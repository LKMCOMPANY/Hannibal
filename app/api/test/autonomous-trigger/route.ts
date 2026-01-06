import { type NextRequest, NextResponse } from "next/server"
import { createAutonomousPublication, hasRecentPublication } from "@/lib/data/autonomous"
import { enqueueAutonomousPublication } from "@/lib/queue/qstash"
import { getSiteById } from "@/lib/data/sites"

/**
 * MANUAL TEST ENDPOINT - Autonomous Publication
 * 
 * Allows manual triggering of autonomous publication for testing
 * 
 * Usage:
 * POST /api/test/autonomous-trigger?siteId=105
 * 
 * WARNING: This bypasses the normal scheduling logic
 * Use only for testing!
 */
export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const siteIdParam = searchParams.get("siteId")

    if (!siteIdParam) {
      return NextResponse.json(
        { error: "siteId parameter is required. Usage: /api/test/autonomous-trigger?siteId=105" },
        { status: 400 }
      )
    }

    const siteId = parseInt(siteIdParam)

    console.log(`[Test Trigger] 🧪 Manual test triggered for site ${siteId}`)

    // Get site info
    const site = await getSiteById(siteId)
    if (!site) {
      return NextResponse.json(
        { error: `Site ${siteId} not found` },
        { status: 404 }
      )
    }

    console.log(`[Test Trigger] Site: ${site.name} (${site.country_iso2}, ${site.language})`)

    // Check if already has recent publication
    const hasRecent = await hasRecentPublication(siteId, 60)
    if (hasRecent) {
      console.log(`[Test Trigger] ⚠️  Site has publication in last 60 minutes`)
      return NextResponse.json({
        success: false,
        message: "Site already has a publication in the last 60 minutes",
        suggestion: "Wait or check autonomous_publications table"
      })
    }

    // Create autonomous publication
    const publication = await createAutonomousPublication(
      siteId,
      new Date().toISOString(),
      "manual-test-trigger"
    )

    console.log(`[Test Trigger] Created publication record: ${publication.id}`)

    // Enqueue job
    const messageId = await enqueueAutonomousPublication({
      publicationId: publication.id,
      siteId: siteId,
      scheduledFor: new Date().toISOString()
    })

    console.log(`[Test Trigger] ✅ Job enqueued: ${messageId}`)

    return NextResponse.json({
      success: true,
      message: "Autonomous publication triggered successfully",
      publication: {
        id: publication.id,
        siteId: siteId,
        siteName: site.name,
        country: site.country_iso2,
        language: site.language
      },
      qstash: {
        messageId: messageId
      },
      next: "Check logs for processing status or query autonomous_publications table"
    })

  } catch (error) {
    console.error("[Test Trigger] ❌ Error:", error)
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Unknown error"
      },
      { status: 500 }
    )
  }
}

/**
 * GET handler - Show available test sites
 */
export async function GET() {
  try {
    const { getAllAutonomousSchedules } = await import("@/lib/data/autonomous")
    const sites = await getAllAutonomousSchedules()

    return NextResponse.json({
      message: "Manual test endpoint for autonomous publications",
      usage: "POST /api/test/autonomous-trigger?siteId=<ID>",
      availableSites: sites.map(s => ({
        siteId: s.site_id,
        timezone: s.timezone,
        hours: s.hours
      }))
    })
  } catch (error) {
    return NextResponse.json({
      message: "Manual test endpoint for autonomous publications",
      usage: "POST /api/test/autonomous-trigger?siteId=<ID>",
      error: "Could not fetch sites"
    })
  }
}

