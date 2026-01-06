import { type NextRequest, NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { processCampaignPublication } from "@/lib/queue/processors/campaign-processor"
import type { CampaignPublicationJob } from "@/lib/queue/qstash"

/**
 * QStash webhook handler for campaign publication jobs
 *
 * This endpoint is called by QStash to process campaign publications
 * in the background with automatic retries and error handling
 */
async function handler(request: NextRequest) {
  try {
    console.log("[v0] Campaign publication webhook called")

    // Get request body
    const body = await request.text()

    console.log("[v0] Request body received, length:", body.length)

    // Parse job data
    const job: CampaignPublicationJob = JSON.parse(body)

    console.log("[v0] Processing campaign publication job:", {
      campaignId: job.campaignId,
      publicationId: job.publicationId,
      targetSiteId: job.targetSiteId,
    })

    // Process the publication
    const result = await processCampaignPublication(job)

    if (result.success) {
      console.log("[v0] Campaign publication processed successfully:", {
        publicationId: job.publicationId,
        articleId: result.articleId,
      })

      return NextResponse.json({
        success: true,
        publicationId: job.publicationId,
        articleId: result.articleId,
      })
    } else {
      console.error("[v0] Campaign publication processing failed:", {
        publicationId: job.publicationId,
        error: result.error,
      })

      // Return 500 to trigger QStash retry
      return NextResponse.json(
        {
          success: false,
          error: result.error,
        },
        { status: 500 },
      )
    }
  } catch (error) {
    console.error("[v0] Campaign publication webhook error:", error)

    // Return 500 to trigger QStash retry
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error",
      },
      { status: 500 },
    )
  }
}

/**
 * POST handler with QStash signature verification
 *
 * Set QSTASH_SKIP_VERIFICATION=true in environment variables to skip verification for testing
 */
export const POST = process.env.QSTASH_SKIP_VERIFICATION === "true" ? handler : verifySignatureAppRouter(handler)

/**
 * Health check endpoint
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "campaign-publication",
    timestamp: new Date().toISOString(),
    verificationEnabled: process.env.QSTASH_SKIP_VERIFICATION !== "true",
  })
}
