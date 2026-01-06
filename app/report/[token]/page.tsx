"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import { ReportHeader } from "@/components/campaign-report/report-header"
import { ReportStats } from "@/components/campaign-report/report-stats"
import { PublicationCard } from "@/components/campaign-report/publication-card"
import { PublicationsMap } from "@/components/dashboard/publications-map"
import { Megaphone, Loader2 } from "lucide-react"

export default function CampaignReportPage() {
  const params = useParams()
  const token = params.token as string
  
  const [data, setData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState(false)

  useEffect(() => {
    async function fetchData() {
      if (!token) return
      
      setIsLoading(true)
      try {
        const response = await fetch(`/api/campaign-report/${token}`)
        
        if (!response.ok) {
          setError(true)
          return
        }
        
        const result = await response.json()
        setData(result)
      } catch (err) {
        console.error("Error fetching campaign report:", err)
        setError(true)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [token])

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-3">
          <Loader2 className="mx-auto h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">Loading report...</p>
        </div>
      </div>
    )
  }

  if (error || !data?.campaign) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">Report Not Found</p>
          <p className="text-sm text-muted-foreground">This campaign report doesn't exist or the link has expired.</p>
        </div>
      </div>
    )
  }

  const { campaign, publications } = data

  // Calculate stats
  const stats = {
    totalSites: Number(campaign.publications_count) || 0,
    activeMedias: Number(campaign.active_medias) || 0,
    activeCountries: Number(campaign.active_countries) || 0,
    activeLanguages: Number(campaign.active_languages) || 0,
  }

  // Map data (only published publications with country)
  const mapData = publications
    .filter((p: any) => p.status === 'published' && p.country_iso2)
    .map((p: any) => ({
      country_iso2: p.country_iso2,
      country: p.country_iso2, // Will be formatted by map
      site_name: p.site_name,
      article_count: "1",
      last_published: p.published_at,
    }))

  return (
    <div className="min-h-screen bg-background">
      {/* Header with branding */}
      <div className="border-b bg-card">
        <div className="container mx-auto px-4 py-6 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10">
              <Megaphone className="h-5 w-5 text-primary" />
            </div>
            <div>
              <h2 className="text-lg font-semibold">Hannibal</h2>
              <p className="text-xs text-muted-foreground">Campaign Report</p>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-7xl space-y-6">
          {/* Campaign Header */}
          <ReportHeader campaign={campaign} />

          {/* Stats */}
          <ReportStats stats={stats} />

          {/* Global Map */}
          {mapData.length > 0 && (
            <PublicationsMap data={mapData} />
          )}

          {/* Publications List */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold">Publications ({publications.length})</h2>
            </div>

            {publications.length === 0 ? (
              <div className="flex min-h-[200px] items-center justify-center rounded-lg border border-dashed bg-muted/30">
                <p className="text-sm text-muted-foreground">No publications yet</p>
              </div>
            ) : (
              <div className="space-y-4">
                {publications.map((pub: any) => (
                  <PublicationCard key={pub.id} publication={pub} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="mt-12 border-t bg-muted/30 py-6">
        <div className="container mx-auto px-4 text-center sm:px-6 lg:px-8">
          <p className="text-xs text-muted-foreground">
            Generated on {new Date().toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    </div>
  )
}

