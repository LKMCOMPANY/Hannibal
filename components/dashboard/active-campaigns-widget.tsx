import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Megaphone, ArrowRight, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"

type ActiveCampaignsWidgetProps = {
  campaigns: any[]
}

export function ActiveCampaignsWidget({ campaigns }: ActiveCampaignsWidgetProps) {
  if (campaigns.length === 0) {
    return (
      <Card className="flex h-full w-full flex-col">
        <CardHeader className="border-b p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Megaphone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            Active Campaigns
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No active campaigns</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="flex h-full w-full flex-col">
      <CardHeader className="border-b p-3 sm:p-4 md:p-6">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <Megaphone className="h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <span className="truncate">Active Campaigns</span>
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="w-full justify-center sm:w-auto">
            <Link href="/dashboard/campaigns" className="text-xs sm:text-sm">
              View All
              <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-3 sm:p-4">
        <div className="space-y-2.5 sm:space-y-3">
          {campaigns.map((campaign) => (
            <Link
              key={campaign.id}
              href={`/dashboard/campaigns/${campaign.id}`}
              className="block"
            >
              <div className="group rounded-lg border bg-card p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
                <div className="flex items-start justify-between gap-2">
                  <div className="min-w-0 flex-1 space-y-1">
                    <p className="truncate text-sm font-semibold text-foreground transition-colors group-hover:text-primary">
                      {campaign.name}
                    </p>
                    <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                      <FileText className="h-3 w-3 shrink-0" aria-hidden="true" />
                      <span className="truncate">{campaign.source_article_title || "Unknown"}</span>
                    </p>
                  </div>
                  <Badge
                    variant="secondary"
                    className="shrink-0 bg-primary/10 text-xs text-primary"
                  >
                    {campaign.status}
                  </Badge>
                </div>
                <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-muted-foreground sm:gap-x-4">
                  <span className="shrink-0">{campaign.publications_count || 0} sites</span>
                  <span className="shrink-0 text-green-600 dark:text-green-400">
                    {campaign.successful_publications || 0} posted
                  </span>
                  {Number(campaign.failed_publications || 0) > 0 && (
                    <span className="shrink-0 text-destructive">
                      {campaign.failed_publications} failed
                    </span>
                  )}
                </div>
              </div>
            </Link>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

