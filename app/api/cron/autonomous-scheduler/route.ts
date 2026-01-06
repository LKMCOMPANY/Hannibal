import { type NextRequest, NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { getAllAutonomousSchedules, createAutonomousPublication, hasRecentPublication } from "@/lib/data/autonomous"
import { enqueueAutonomousPublication } from "@/lib/queue/qstash"
import { getCurrentHourInTimezone } from "@/lib/utils/timezone"

/**
 * Autonomous Scheduler Endpoint
 * 
 * Called by QStash Schedule every hour (cron: "0 * * * *")
 * 
 * Workflow:
 * 1. Get all active autonomous sites
 * 2. For each site, check if current hour matches scheduled hours
 * 3. If match and not already published this hour → create publication + enqueue job
 * 4. Return summary of scheduled publications
 * 
 * Anti-duplicate: Checks if publication already exists within last 60 minutes
 */
async function handler(request: NextRequest) {
  try {
    console.log("[Autonomous Scheduler] 🕐 Starting hourly check...")

    const startTime = Date.now()
    const scheduledPublications: Array<{ siteId: number; siteName: string; hour: number }> = []
    const skippedSites: Array<{ siteId: number; siteName: string; reason: string }> = []

    // 1. GET ALL ACTIVE AUTONOMOUS SITES
    const activeSites = await getAllAutonomousSchedules()

    console.log(`[Autonomous Scheduler] Found ${activeSites.length} active autonomous sites`)

    if (activeSites.length === 0) {
      return NextResponse.json({
        success: true,
        message: "No active autonomous sites",
        scheduled: 0,
        skipped: 0,
        executionTime: Date.now() - startTime
      })
    }

    // 2. CHECK EACH SITE AND PREPARE PUBLICATIONS
    const sitesToPublish: Array<{ site: any; hour: number; publication: any }> = []

    for (const site of activeSites) {
      try {
        // Get current hour in site's timezone
        const currentLocalHour = getCurrentHourInTimezone(site.timezone)

        console.log(`[Autonomous Scheduler] Checking site ${site.site_id}: ${currentLocalHour}:00 ${site.timezone}`)

        // Check if current hour matches scheduled hours
        if (!site.hours.includes(currentLocalHour)) {
          console.log(`[Autonomous Scheduler] ⏭️  Site ${site.site_id}: ${currentLocalHour} not in schedule ${JSON.stringify(site.hours)}`)
          continue
        }

        console.log(`[Autonomous Scheduler] ✅ Site ${site.site_id}: ${currentLocalHour} matches schedule!`)

        // Check if already published recently (prevent duplicates)
        const alreadyPublished = await hasRecentPublication(site.site_id, 60)
        if (alreadyPublished) {
          console.log(`[Autonomous Scheduler] ⚠️  Site ${site.site_id}: Already published in last 60 minutes, skipping`)
          skippedSites.push({
            siteId: site.site_id,
            siteName: (site as any).name || `Site ${site.site_id}`,
            reason: "Already published recently"
          })
          continue
        }

        // 3. CREATE PUBLICATION RECORD (status: pending)
        const now = new Date()
        const publication = await createAutonomousPublication(
          site.site_id,
          now.toISOString(),
          `lang:${site.timezone},hour:${currentLocalHour}`
        )

        console.log(`[Autonomous Scheduler] Created publication record ${publication.id} for site ${site.site_id}`)

        sitesToPublish.push({
          site,
          hour: currentLocalHour,
          publication
        })

      } catch (error) {
        console.error(`[Autonomous Scheduler] ❌ Error processing site ${site.site_id}:`, error)
        skippedSites.push({
          siteId: site.site_id,
          siteName: (site as any).name || `Site ${site.site_id}`,
          reason: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    // 4. ENQUEUE JOBS WITH PROGRESSIVE DELAY (avoid Anthropic rate limits)
    // Stagger publications: 10 seconds between each to spread API load
    console.log(`\n[Autonomous Scheduler] Enqueueing ${sitesToPublish.length} publications with progressive delay...`)

    for (let i = 0; i < sitesToPublish.length; i++) {
      const { site, hour, publication } = sitesToPublish[i]
      const delaySeconds = i * 10  // 10 seconds between each publication

      try {
        const messageId = await enqueueAutonomousPublication(
          {
            publicationId: publication.id,
            siteId: site.site_id,
            scheduledFor: publication.scheduled_for
          },
          delaySeconds  // Progressive delay
        )

        console.log(`[Autonomous Scheduler] ✅ Enqueued site ${site.site_id} with ${delaySeconds}s delay (message: ${messageId})`)

        scheduledPublications.push({
          siteId: site.site_id,
          siteName: (site as any).name || `Site ${site.site_id}`,
          hour: hour
        })

      } catch (error) {
        console.error(`[Autonomous Scheduler] ❌ Failed to enqueue site ${site.site_id}:`, error)
        skippedSites.push({
          siteId: site.site_id,
          siteName: (site as any).name || `Site ${site.site_id}`,
          reason: error instanceof Error ? error.message : "Enqueue failed"
        })
      }
    }

    // 5. RETURN SUMMARY
    const executionTime = Date.now() - startTime

    console.log(`[Autonomous Scheduler] ✅ Completed in ${executionTime}ms`)
    console.log(`[Autonomous Scheduler] Scheduled: ${scheduledPublications.length}, Skipped: ${skippedSites.length}`)

    return NextResponse.json({
      success: true,
      message: "Scheduler execution completed",
      scheduled: scheduledPublications.length,
      skipped: skippedSites.length,
      executionTime,
      scheduledPublications,
      skippedSites
    })

  } catch (error) {
    console.error("[Autonomous Scheduler] ❌ Scheduler error:", error)
    
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Scheduler error"
      },
      { status: 500 }
    )
  }
}

/**
 * POST handler
 * 
 * Note: QStash Schedules don't send the same signature format as Queue messages
 * so we don't use verifySignatureAppRouter here
 */
export const POST = handler

/**
 * GET handler for health check and manual testing
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "autonomous-scheduler",
    description: "Checks active autonomous sites and schedules publications",
    timestamp: new Date().toISOString(),
    verificationEnabled: process.env.QSTASH_SKIP_VERIFICATION !== "true",
    schedule: "Called by QStash every hour (0 * * * *)"
  })
}

