import { type NextRequest, NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { processXPublication } from "@/lib/queue/processors/x-publisher-processor"
import type { XPublicationJob } from "@/lib/types/x-publications"

async function handler(request: NextRequest) {
  try {
    const body = await request.text()
    const job: XPublicationJob = JSON.parse(body)
    const result = await processXPublication(job)

    if (result.success) {
      return NextResponse.json({
        success: true,
        publicationId: job.publicationId,
        tweetId: result.tweetId,
        tweetUrl: result.tweetUrl
      })
    } else {
      return NextResponse.json(
        { success: false, error: result.error },
        { status: 500 }
      )
    }
  } catch (error) {
    console.error("Route handler error:", error instanceof Error ? error.message : error)
    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : "Internal server error" },
      { status: 500 }
    )
  }
}

export const POST = process.env.QSTASH_SKIP_VERIFICATION === "true" 
  ? handler 
  : verifySignatureAppRouter(handler)

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
}
