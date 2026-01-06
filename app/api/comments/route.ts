import { type NextRequest, NextResponse } from "next/server"
import { createComment, getArticleComments } from "@/lib/db/queries"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const articleId = searchParams.get("articleId")

    if (!articleId) {
      return NextResponse.json({ error: "Article ID is required" }, { status: 400 })
    }

    const comments = await getArticleComments(Number.parseInt(articleId))

    return NextResponse.json(comments)
  } catch (error) {
    console.error("Error fetching comments:", error)
    return NextResponse.json({ error: "Failed to fetch comments" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const data = await request.json()

    // Basic validation
    if (!data.articleId || !data.siteId || !data.authorName || !data.content) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Content length validation
    if (data.content.length < 3 || data.content.length > 5000) {
      return NextResponse.json({ error: "Comment must be between 3 and 5000 characters" }, { status: 400 })
    }

    const comment = await createComment(data)

    return NextResponse.json({
      success: true,
      message: "Comment submitted for moderation",
      comment,
    })
  } catch (error) {
    console.error("Error creating comment:", error)
    return NextResponse.json({ error: "Failed to create comment" }, { status: 500 })
  }
}
