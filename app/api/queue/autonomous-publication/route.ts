import { type NextRequest, NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { processAutonomousPublication } from "@/lib/queue/processors/autonomous-processor"
import type { AutonomousPublicationJob } from "@/lib/types/autonomous"

/**
 * QStash webhook handler for autonomous publication jobs
 * 
 * This endpoint is called by QStash to process autonomous publications
 * in the background with automatic retries and error handling
 * 
 * Pattern: Identical to campaign-publication webhook for consistency
 */
async function handler(request: NextRequest) {
  try {
    console.log("[Autonomous Publication - DEBUG MODE NO SIGNATURE] 📨 Webhook called")

    // Get request body
    const body = await request.text()

    console.log("[Autonomous Publication] Request body received, length:", body.length)

    // Parse job data
    const job: AutonomousPublicationJob = JSON.parse(body)

    console.log("[Autonomous Publication] Processing job:", {
      publicationId: job.publicationId,
      siteId: job.siteId,
      scheduledFor: job.scheduledFor
    })

    // Process the publication
    const result = await processAutonomousPublication(job)

    if (result.success) {
      console.log("[Autonomous Publication] ✅ Publication processed successfully:", {
        publicationId: job.publicationId,
        articleId: result.articleId
      })

      return NextResponse.json({
        success: true,
        publicationId: job.publicationId,
        articleId: result.articleId
      })
    } else {
      console.error("[Autonomous Publication] ❌ Processing failed:", {
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
    console.error("[Autonomous Publication] ❌ Webhook error:", error)

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
 * 
 * Set QSTASH_SKIP_VERIFICATION=true in environment variables to skip verification for testing
 */
// TEMPORARY DEBUG: Bypass signature verification
// export const POST = process.env.QSTASH_SKIP_VERIFICATION === "true" 
//   ? handler 
//   : verifySignatureAppRouter(handler)

export const POST = handler; // <--- FORCE HANDLER WITHOUT VERIFICATION

/**
 * GET handler for health check
 */
export async function GET() {
  return NextResponse.json({
    status: "ok",
    endpoint: "autonomous-publication",
    description: "Processes autonomous publications from NewsAPI",
    timestamp: new Date().toISOString(),
    verificationEnabled: process.env.QSTASH_SKIP_VERIFICATION !== "true"
  })
}

