import { type NextRequest, NextResponse } from "next/server"
import {
  getPublicationsTimeline,
  getPublicationsByCountry,
  getLatestAutonomousArticles,
  getActiveCampaigns,
  getPendingXPublications,
  getOverviewStats,
  type TimeRange,
} from "@/lib/data/dashboard"

/**
 * Dashboard API endpoint
 * 
 * Returns all dashboard data for selected time range
 * Client-side fetches to allow dynamic time range selection
 */
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const range = (searchParams.get("range") || "24h") as TimeRange

    const [timeline, byCountry, latestArticles, activeCampaigns, pendingXPosts, overviewStats] = await Promise.all([
      getPublicationsTimeline(range),
      getPublicationsByCountry(range),
      getLatestAutonomousArticles(10),
      getActiveCampaigns(5),
      getPendingXPublications(5),
      getOverviewStats(range),
    ])

    return NextResponse.json({
      timeline,
      byCountry,
      latestArticles,
      activeCampaigns,
      pendingXPosts,
      overviewStats,
      range,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching dashboard data:", error)
    return NextResponse.json(
      { error: "Failed to fetch dashboard data" },
      { status: 500 }
    )
  }
}

