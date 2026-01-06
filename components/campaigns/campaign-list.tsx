import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, Target, CheckCircle2, XCircle, FileText } from "lucide-react"
import Link from "next/link"
import type { CampaignWithRelations } from "@/lib/types/campaigns"
import { formatDistanceToNow } from "date-fns"

type CampaignListProps = {
  campaigns: CampaignWithRelations[]
}

export function CampaignList({ campaigns }: CampaignListProps) {
  if (campaigns.length === 0) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-muted-foreground" aria-hidden="true" />
          <p className="mt-4 text-lg font-medium text-muted-foreground">No campaigns found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {campaigns.map((campaign) => (
        <Link key={campaign.id} href={`/dashboard/campaigns/${campaign.id}`}>
          <Card className="group overflow-hidden transition-all duration-200 hover:shadow-md hover:border-primary/20">
            <CardContent className="p-6">
              <div className="mb-4 flex items-start justify-between gap-4">
                <div className="flex-1 space-y-1.5">
                  <h3 className="line-clamp-1 text-balance text-lg font-semibold leading-tight text-foreground transition-colors group-hover:text-primary">
                    {campaign.name}
                  </h3>
                  <p className="flex items-center gap-2 text-sm text-muted-foreground text-pretty">
                    <FileText className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
                    <span className="line-clamp-1">{campaign.source_article_title || "Unknown Article"}</span>
                  </p>
                </div>
                {campaign.status !== "failed" && (
                  <Badge
                    variant={
                      campaign.status === "completed"
                        ? "default"
                        : campaign.status === "running"
                          ? "secondary"
                          : "outline"
                    }
                    className="shrink-0"
                  >
                    {campaign.status}
                  </Badge>
                )}
              </div>

              <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
                <div className="flex items-center gap-2.5 rounded-md border border-border bg-card p-3 transition-colors group-hover:border-primary/30">
                  <Target className="h-4 w-4 shrink-0 text-primary" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Target Sites</p>
                    <p className="font-semibold text-foreground">{campaign.publications_count || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-md border border-border bg-card p-3 transition-colors group-hover:border-primary/30">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-green-600 dark:text-green-500" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Successful</p>
                    <p className="font-semibold text-foreground">{campaign.successful_publications || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-md border border-border bg-card p-3 transition-colors group-hover:border-primary/30">
                  <XCircle className="h-4 w-4 shrink-0 text-destructive" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Failed</p>
                    <p className="font-semibold text-foreground">{campaign.failed_publications || 0}</p>
                  </div>
                </div>

                <div className="flex items-center gap-2.5 rounded-md border border-border bg-card p-3 transition-colors group-hover:border-primary/30">
                  <Calendar className="h-4 w-4 shrink-0 text-muted-foreground" aria-hidden="true" />
                  <div className="min-w-0 flex-1">
                    <p className="text-xs text-muted-foreground">Created</p>
                    <p className="text-sm font-medium text-foreground">
                      {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              </div>

              {campaign.custom_instructions && (
                <div className="mt-4 rounded-md border border-border bg-muted/50 p-3">
                  <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                    {campaign.custom_instructions}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </Link>
      ))}
    </div>
  )
}
