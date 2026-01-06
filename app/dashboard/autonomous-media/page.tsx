import { Suspense } from "react"
import { sql } from "@/lib/db"
import { GlobalTimeline } from "@/components/autonomous/global-timeline"
import { MediaCard } from "@/components/autonomous/media-card"
import { getTimelineEvents } from "@/lib/data/autonomous"
import { Bot } from "lucide-react"
import AutonomousMediaLoading from "./loading"

async function getMediaSites() {
  const sites = await sql`
    SELECT 
      id,
      name,
      custom_domain,
      timezone,
      country,
      language,
      autonomous_hours,
      autonomous_active
    FROM sites
    ORDER BY name ASC
  `

  return sites.map((site: any) => ({
    id: site.id,
    name: site.name,
    domain: site.custom_domain || "No domain",
    timezone: site.timezone || "UTC",
    country: site.country || "Unknown",
    language: site.language || "en",
    hours: (site.autonomous_hours as number[]) || [],
    isActive: site.autonomous_active || false,
  }))
}

async function AutonomousMediaContent() {
  const [mediaSites, timelineEvents] = await Promise.all([getMediaSites(), getTimelineEvents()])

  return (
    <div className="space-y-8">
      <GlobalTimeline events={timelineEvents} />

      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <h2 className="text-balance text-2xl font-semibold tracking-tight">Media Outlets</h2>
          <span className="text-sm text-muted-foreground">({mediaSites.length} total)</span>
        </div>

        {mediaSites.length === 0 ? (
          <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8">
            <div className="text-center">
              <Bot className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
              <p className="mt-4 text-lg font-medium text-muted-foreground">No media outlets found</p>
              <p className="mt-1 text-sm text-muted-foreground">Create a media outlet to get started</p>
            </div>
          </div>
        ) : (
          <div className="space-y-4">
            {mediaSites.map((site) => (
              <MediaCard
                key={site.id}
                siteId={site.id}
                siteName={site.name}
                domain={site.domain}
                timezone={site.timezone}
                country={site.country}
                language={site.language}
                hours={site.hours}
                isActive={site.isActive}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default function AutonomousMediaPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
          <Bot className="h-6 w-6 text-primary" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="text-balance text-3xl font-bold tracking-tight">Autonomous Media</h1>
          <p className="text-pretty text-sm text-muted-foreground">
            Configure automatic article fetching and publishing schedules for each media outlet
          </p>
        </div>
      </div>

      <Suspense fallback={<AutonomousMediaLoading />}>
        <AutonomousMediaContent />
      </Suspense>
    </div>
  )
}
