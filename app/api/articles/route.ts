import { type NextRequest, NextResponse } from "next/server"
import { getArticles } from "@/lib/data/articles"
import type { ArticleFilters } from "@/lib/types/articles"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters: ArticleFilters = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") || undefined,
      source_type: searchParams.get("source_type") || undefined,
      country: searchParams.get("country") || undefined,
      language: searchParams.get("language") || undefined,
      date_from: searchParams.get("date_from") || undefined,
      date_to: searchParams.get("date_to") || undefined,
      limit: Number.parseInt(searchParams.get("limit") || "10"),
      offset: Number.parseInt(searchParams.get("offset") || "0"),
    }

    const articles = await getArticles(filters)

    return NextResponse.json({ articles })
  } catch (error) {
    console.error("[API] Failed to fetch articles:", error)
    return NextResponse.json({ error: "Failed to fetch articles" }, { status: 500 })
  }
}
