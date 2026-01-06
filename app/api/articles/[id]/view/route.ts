import { type NextRequest, NextResponse } from "next/server"
import { incrementArticleViews } from "@/lib/db/queries"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { siteId } = await request.json()

    await incrementArticleViews(Number.parseInt(id), siteId)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Error tracking view:", error)
    return NextResponse.json({ error: "Failed to track view" }, { status: 500 })
  }
}
