import { type NextRequest, NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { processXPublication } from "@/lib/queue/processors/x-publisher-processor"
import type { XPublicationJob } from "@/lib/types/x-publications"

/**
 * QStash webhook handler for X publication jobs
 * 
 * Called after 10-minute delay to post tweets
 * Pattern: Identical to autonomous-publication for consistency
 */
async function handler(request: NextRequest) {
  try {
    console.log("[X Publication] 📨 Webhook called")

    // Get request body
    const body = await request.text()
    console.log("[X Publication] Request body received, length:", body.length)

    // Parse job data
    const job: XPublicationJob = JSON.parse(body)

    console.log("[X Publication] Processing job:", {
      publicationId: job.publicationId,
      articleId: job.articleId,
      siteId: job.siteId
    })

    // Process the publication
    const result = await processXPublication(job)

    if (result.success) {
      console.log("[X Publication] ✅ Tweet posted successfully:", {
        publicationId: job.publicationId,
        tweetId: result.tweetId,
        tweetUrl: result.tweetUrl
      })

      return NextResponse.json({
        success: true,
        publicationId: job.publicationId,
        tweetId: result.tweetId,
        tweetUrl: result.tweetUrl
      })
    } else {
      console.error("[X Publication] ❌ Processing failed:", {
        publicationId: job.publicationId,
        error: result.error
      })

      // Return 500 to trigger QStash retry
      return NextResponse.json(
        {
          success: false,
          error: result.error
        },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("[X Publication] ❌ Webhook error:", error)

    // Return 500 to trigger QStash retry
    return NextResponse.json(
      {
        success: false,
        error: error instanceof Error ? error.message : "Internal server error"
      },
      { status: 500 }
    )
  }
}

/**
 * POST handler with QStash signature verification
 */
export const POST = process.env.QSTASH_SKIP_VERIFICATION === "true" 
  ? handler 
  : verifySignatureAppRouter(handler)

/**
 * GET handler for health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "x-publication",
    description: "Posts tweets to X/Twitter for published articles",
    timestamp: new Date().toISOString(),
    verificationEnabled: process.env.QSTASH_SKIP_VERIFICATION !== "true"
  })
}

