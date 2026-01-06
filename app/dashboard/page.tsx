"use client"

import { useState, useEffect } from "react"
import { TimeRangeSelector } from "@/components/dashboard/time-range-selector"
import { BreakingNewsBanner } from "@/components/dashboard/breaking-news-banner"
import { OverviewStats } from "@/components/dashboard/overview-stats"
import { PublicationsGraph } from "@/components/dashboard/publications-graph"
import { PublicationsMap } from "@/components/dashboard/publications-map"
import { ActiveCampaignsWidget } from "@/components/dashboard/active-campaigns-widget"
import { PendingXPostsWidget } from "@/components/dashboard/pending-x-posts-widget"
import type { TimeRange } from "@/lib/data/dashboard"
import { Loader2 } from "lucide-react"

export default function DashboardPage() {
  const [timeRange, setTimeRange] = useState<TimeRange>("24h")
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true)
      try {
        const response = await fetch(`/api/dashboard?range=${timeRange}`)
        const result = await response.json()
        setData(result)
      } catch (error) {
        console.error("Error fetching dashboard data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [timeRange])

  if (isLoading || !data) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="space-y-3 text-center">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" aria-hidden="true" />
          <p className="text-sm text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full space-y-4 pb-6 sm:space-y-5 md:space-y-6 md:pb-8">
      {/* Header */}
      <div className="space-y-1.5">
        <h1 className="text-balance text-2xl font-bold tracking-tight sm:text-3xl lg:text-4xl">
          Dashboard
        </h1>
        <p className="text-pretty text-sm text-muted-foreground sm:text-base">
          Real-time overview of your media management platform
        </p>
      </div>

      {/* Time Range Selector */}
      <TimeRangeSelector value={timeRange} onChange={setTimeRange} />

      {/* Breaking News Banner */}
      {data.latestArticles?.length > 0 && (
        <BreakingNewsBanner articles={data.latestArticles} />
      )}

      {/* Overview Stats Cards */}
      {data.overviewStats && (
        <OverviewStats stats={data.overviewStats} />
      )}

      {/* Publications Graph */}
      {data.timeline && (
        <PublicationsGraph data={data.timeline} range={timeRange} />
      )}

      {/* Global Map 3D */}
      {data.byCountry && (
        <PublicationsMap data={data.byCountry} />
      )}

      {/* Widgets Row */}
      <div className="grid w-full gap-4 sm:gap-5 md:gap-6 lg:grid-cols-2">
        <ActiveCampaignsWidget campaigns={data.activeCampaigns || []} />
        <PendingXPostsWidget publications={data.pendingXPosts || []} />
      </div>
    </div>
  )
}
