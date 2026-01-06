import { type NextRequest, NextResponse } from "next/server"
import { toggleBookmark } from "@/lib/db/queries"
import { cookies } from "next/headers"

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const { siteId } = await request.json()

    // Get or create user identifier from cookies
    const cookieStore = await cookies()
    let userIdentifier = cookieStore.get("user_identifier")?.value

    if (!userIdentifier) {
      userIdentifier = `guest_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
      cookieStore.set("user_identifier", userIdentifier, {
        maxAge: 60 * 60 * 24 * 365, // 1 year
        httpOnly: true,
        sameSite: "lax",
      })
    }

    const result = await toggleBookmark(Number.parseInt(id), userIdentifier, siteId)

    return NextResponse.json(result)
  } catch (error) {
    console.error("Error toggling bookmark:", error)
    return NextResponse.json({ error: "Failed to toggle bookmark" }, { status: 500 })
  }
}
