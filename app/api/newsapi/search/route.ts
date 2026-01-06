import { type NextRequest, NextResponse } from "next/server"
import { searchArticles, searchEvents, getDateRange } from "@/lib/services/newsapi"
import type { Language, SortBy } from "@/lib/types/newsapi"

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const query = searchParams.get("query")
    const type = searchParams.get("type") as "articles" | "events"
    const page = Number.parseInt(searchParams.get("page") || "1")

    if (!query) {
      return NextResponse.json({ error: { message: "Query parameter is required" } }, { status: 400 })
    }

    const lang = (searchParams.get("lang") || "eng") as Language
    const sortBy = (searchParams.get("sortBy") || "date") as SortBy
    const dateRange = searchParams.get("dateRange") as "today" | "week" | "month" | "year" | "custom" | null

    // Date handling
    let dateStart: string | undefined
    let dateEnd: string | undefined

    if (dateRange === "custom") {
      dateStart = searchParams.get("dateStart") || undefined
      dateEnd = searchParams.get("dateEnd") || undefined
    } else if (dateRange) {
      const range = getDateRange(dateRange as "today" | "week" | "month" | "year")
      dateStart = range.dateStart
      dateEnd = range.dateEnd
    }

    // Content filters
    const conceptUri = searchParams.get("conceptUri") || undefined
    const categoryUri = searchParams.get("categoryUri") || undefined
    const keywordLoc = searchParams.get("keywordLoc") || "body,title"
    const keywordOper = searchParams.get("keywordOper") || "and"
    const ignoreKeyword = searchParams.get("ignoreKeyword") || undefined

    // Source filters
    const sourceUri = searchParams.get("sourceUri") || undefined
    const sourceLocationUri = searchParams.get("sourceLocationUri") || undefined
    const sourceGroupUri = searchParams.get("sourceGroupUri") || undefined
    const authorUri = searchParams.get("authorUri") || undefined
    const ignoreSourceUri = searchParams.get("ignoreSourceUri") || undefined
    const ignoreSourceLocationUri = searchParams.get("ignoreSourceLocationUri") || undefined
    const ignoreSourceGroupUri = searchParams.get("ignoreSourceGroupUri") || undefined
    const ignoreSourceLang = searchParams.get("ignoreSourceLang") || undefined

    // Quality filters
    const startSourceRankPercentile = searchParams.get("startSourceRankPercentile")
      ? Number.parseInt(searchParams.get("startSourceRankPercentile")!)
      : undefined
    const endSourceRankPercentile = searchParams.get("endSourceRankPercentile")
      ? Number.parseInt(searchParams.get("endSourceRankPercentile")!)
      : undefined
    const minSentiment = searchParams.get("minSentiment")
      ? Number.parseFloat(searchParams.get("minSentiment")!)
      : undefined
    const maxSentiment = searchParams.get("maxSentiment")
      ? Number.parseFloat(searchParams.get("maxSentiment")!)
      : undefined

    // Article-specific filters
    const isDuplicateFilter = searchParams.get("isDuplicateFilter") || undefined
    const hasDuplicateFilter = searchParams.get("hasDuplicateFilter") || undefined
    const dataType = searchParams.get("dataType")?.split(",") || undefined

    // Event-specific filters
    const minArticlesInEvent = searchParams.get("minArticlesInEvent")
      ? Number.parseInt(searchParams.get("minArticlesInEvent")!)
      : undefined
    const maxArticlesInEvent = searchParams.get("maxArticlesInEvent")
      ? Number.parseInt(searchParams.get("maxArticlesInEvent")!)
      : undefined

    const baseParams = {
      keyword: query,
      lang: lang === "all" ? undefined : lang,
      dateStart,
      dateEnd,
      page,
      count: 20,
      sortBy,
      sortByAsc: false,
      conceptUri,
      categoryUri,
      sourceUri,
      sourceLocationUri,
      sourceGroupUri,
      authorUri,
      ignoreKeyword,
      ignoreSourceUri,
      ignoreSourceLocationUri,
      ignoreSourceGroupUri,
      ignoreSourceLang,
      startSourceRankPercentile,
      endSourceRankPercentile,
      minSentiment,
      maxSentiment,
    }

    if (type === "events") {
      const result = await searchEvents({
        ...baseParams,
        minArticlesInEvent,
        maxArticlesInEvent,
      })

      return NextResponse.json(result)
    } else {
      const result = await searchArticles({
        ...baseParams,
        isDuplicateFilter,
        hasDuplicateFilter,
        dataType,
      })

      return NextResponse.json(result)
    }
  } catch (error) {
    return NextResponse.json(
      {
        error: {
          message: error instanceof Error ? error.message : "Failed to perform search",
        },
      },
      { status: 500 },
    )
  }
}
