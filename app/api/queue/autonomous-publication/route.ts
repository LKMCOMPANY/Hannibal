import { type NextRequest, NextResponse } from "next/server"
import { verifySignatureAppRouter } from "@upstash/qstash/nextjs"
import { processAutonomousPublication } from "@/lib/queue/processors/autonomous-processor"
import type { AutonomousPublicationJob } from "@/lib/types/autonomous"

async function handler(request: NextRequest) {
  try {
    const body = await request.text()
    const job: AutonomousPublicationJob = JSON.parse(body)
    const result = await processAutonomousPublication(job)

    if (result.success) {
      return NextResponse.json({
        success: true,
        publicationId: job.publicationId,
        articleId: result.articleId
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

export const POST = handler;

export async function GET() {
  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString()
  })
}
