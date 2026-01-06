import { type NextRequest, NextResponse } from "next/server"
import { getXPublications } from "@/lib/data/x-publications"
import type { XPublicationFilters } from "@/lib/types/x-publications"

/**
 * API endpoint for X publications list
 * Used by infinite scroll component
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams

    const filters: XPublicationFilters = {
      search: searchParams.get("search") || undefined,
      status: searchParams.get("status") as any,
      site_id: searchParams.get("site_id") ? parseInt(searchParams.get("site_id")!) : undefined,
      date_from: searchParams.get("date_from") || undefined,
      date_to: searchParams.get("date_to") || undefined,
      limit: searchParams.get("limit") ? parseInt(searchParams.get("limit")!) : 10,
      offset: searchParams.get("offset") ? parseInt(searchParams.get("offset")!) : 0,
    }

    const publications = await getXPublications(filters)
    const hasMore = publications.length === (filters.limit || 10)

    return NextResponse.json({
      publications,
      hasMore,
      count: publications.length,
    })
  } catch (error) {
    console.error("Error fetching X publications:", error)
    return NextResponse.json(
      { error: "Failed to fetch X publications" },
      { status: 500 }
    )
  }
}

