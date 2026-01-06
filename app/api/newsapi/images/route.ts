import { type NextRequest, NextResponse } from "next/server"
import { searchArticles } from "@/lib/services/newsapi"
import type { Language, SortBy } from "@/lib/types/newsapi"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")

    if (!query) {
      return NextResponse.json({ error: { message: "Query parameter is required" } }, { status: 400 })
    }

    const sanitizedQuery = query.trim().slice(0, 500) // Limit query length
    if (sanitizedQuery.length < 2) {
      return NextResponse.json({ error: { message: "Query must be at least 2 characters long" } }, { status: 400 })
    }

    // Extract search parameters with sensible defaults for image search
    const language = (searchParams.get("lang") as Language) || "eng"
    const sortBy = (searchParams.get("sortBy") as SortBy) || "rel"
    const page = Math.max(1, Math.min(Number.parseInt(searchParams.get("page") || "1"), 100)) // Limit to 100 pages
    const resultsPerPage = Math.max(1, Math.min(Number.parseInt(searchParams.get("resultsPerPage") || "20"), 50)) // Max 50 per page

    const response = await searchArticles({
      keyword: sanitizedQuery,
      lang: language === "all" ? undefined : language,
      sortBy,
      page,
      count: resultsPerPage,
      // Only return articles with images
      dataType: ["news", "pr"],
    })

    if (response.error) {
      return NextResponse.json(
        {
          error: {
            message: response.error.message || "Failed to fetch images from news API",
          },
        },
        { status: 500 },
      )
    }

    if (!response.data?.articles?.results) {
      return NextResponse.json(
        {
          error: {
            message: "Invalid API response structure",
          },
        },
        { status: 500 },
      )
    }

    // Filter articles to only include those with images
    const articlesWithImages = response.data.articles.results.filter((article) => article.image)

    // Extract image data with metadata
    const images = articlesWithImages.map((article) => ({
      url: article.image!,
      title: article.title,
      source: article.source.title,
      articleUrl: article.url,
      dateTime: article.dateTime,
    }))

    return NextResponse.json({
      data: {
        images,
        totalResults: articlesWithImages.length,
        page,
        hasMore: response.data.articles.results.length === resultsPerPage,
      },
    })
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Failed to search images",
        },
      },
      { status: 500 },
    )
  }
}
