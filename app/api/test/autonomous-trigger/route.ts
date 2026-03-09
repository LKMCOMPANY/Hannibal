import { type NextRequest, NextResponse } from "next/server"
import { createAutonomousPublication, hasRecentPublication } from "@/lib/data/autonomous"
import { enqueueAutonomousPublication } from "@/lib/queue/qstash"
import { getSiteById } from "@/lib/data/sites"

export async function POST(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const siteIdParam = searchParams.get("siteId")

    if (!siteIdParam) {
      return NextResponse.json(
        { error: "siteId parameter is required" },
        { status: 400 }
      )
    }

    const siteId = parseInt(siteIdParam)

    const site = await getSiteById(siteId)
    if (!site) {
      return NextResponse.json(
        { error: `Site ${siteId} not found` },
        { status: 404 }
      )
    }

    const hasRecent = await hasRecentPublication(siteId, 60)
    if (hasRecent) {
      return NextResponse.json({
        success: false,
        message: "Site already has a publication in the last 60 minutes"
      })
    }

    const publication = await createAutonomousPublication(
      siteId,
      new Date().toISOString(),
      "manual-test-trigger"
    )

    const messageId = await enqueueAutonomousPublication({
      publicationId: publication.id,
      siteId: siteId,
      scheduledFor: new Date().toISOString()
    })

    return NextResponse.json({
      success: true,
      publicationId: publication.id,
      siteId: siteId
    })

  } catch (error) {
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Unknown error" },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json({ status: "ok", timestamp: new Date().toISOString() })
}
