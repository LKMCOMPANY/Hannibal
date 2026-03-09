import { type NextRequest, NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { getAllAutonomousSchedules, createAutonomousPublication, hasRecentPublication } from "@/lib/data/autonomous"
import { enqueueAutonomousPublication } from "@/lib/queue/qstash"
import { getCurrentHourInTimezone } from "@/lib/utils/timezone"

async function handler(request: NextRequest) {
  try {
    const startTime = Date.now()
    const scheduledPublications: Array<{ siteId: number; siteName: string; hour: number }> = []
    const skippedSites: Array<{ siteId: number; siteName: string; reason: string }> = []

    const activeSites = await getAllAutonomousSchedules()

    if (activeSites.length === 0) {
      return NextResponse.json({
        success: true,
        scheduled: 0,
        skipped: 0,
        executionTime: Date.now() - startTime
      })
    }

    const sitesToPublish: Array<{ site: any; hour: number; publication: any }> = []

    for (const site of activeSites) {
      try {
        const currentLocalHour = getCurrentHourInTimezone(site.timezone)

        if (!site.hours.includes(currentLocalHour)) {
          continue
        }

        const alreadyPublished = await hasRecentPublication(site.site_id, 60)
        if (alreadyPublished) {
          skippedSites.push({
            siteId: site.site_id,
            siteName: (site as any).name || `Site ${site.site_id}`,
            reason: "Already published recently"
          })
          continue
        }

        const now = new Date()
        const publication = await createAutonomousPublication(
          site.site_id,
          now.toISOString(),
          `lang:${site.timezone},hour:${currentLocalHour}`
        )

        sitesToPublish.push({
          site,
          hour: currentLocalHour,
          publication
        })

      } catch (error) {
        skippedSites.push({
          siteId: site.site_id,
          siteName: (site as any).name || `Site ${site.site_id}`,
          reason: error instanceof Error ? error.message : "Unknown error"
        })
      }
    }

    for (let i = 0; i < sitesToPublish.length; i++) {
      const { site, hour, publication } = sitesToPublish[i]
      const delaySeconds = i * 10

      try {
        await enqueueAutonomousPublication(
          {
            publicationId: publication.id,
            siteId: site.site_id,
            scheduledFor: publication.scheduled_for
          },
          delaySeconds
        )

        scheduledPublications.push({
          siteId: site.site_id,
          siteName: (site as any).name || `Site ${site.site_id}`,
          hour: hour
        })

      } catch (error) {
        skippedSites.push({
          siteId: site.site_id,
          siteName: (site as any).name || `Site ${site.site_id}`,
          reason: error instanceof Error ? error.message : "Enqueue failed"
        })
      }
    }

    return NextResponse.json({
      success: true,
      scheduled: scheduledPublications.length,
      skipped: skippedSites.length,
      executionTime: Date.now() - startTime
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Error" },
      { status: 500 }
    )
  }
}

export const POST = handler

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
}
