export const maxDuration = 60

import { type NextRequest, NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { processCampaignPublication } from "@/lib/queue/processors/campaign-processor"
import type { CampaignPublicationJob } from "@/lib/queue/qstash"

async function handler(request: NextRequest) {
  try {
    const body = await request.text()
    const job: CampaignPublicationJob = JSON.parse(body)
    const result = await processCampaignPublication(job)

    if (result.success) {
      return NextResponse.json({
        success: true,
        publicationId: job.publicationId,
        articleId: result.articleId,
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("Route handler error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 },
    )
  }
}

export const POST = process.env.QSTASH_SKIP_VERIFICATION === "true" ? handler : verifySignatureAppRouter(handler)

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  })
}
