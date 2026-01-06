import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { FileText, Target, CheckCircle2, XCircle, Clock } from "lucide-react"
import type { CampaignWithRelations } from "@/lib/types/campaigns"
import { format } from "date-fns"

type CampaignDetailProps = {
  campaign: CampaignWithRelations
}

export function CampaignDetail({ campaign }: CampaignDetailProps) {
  const deploymentSpeed =
    campaign.deployment_speed_minutes === 1
      ? "1 minute"
      : campaign.deployment_speed_minutes < 60
        ? `${campaign.deployment_speed_minutes} minutes`
        : `${campaign.deployment_speed_minutes / 60} hour${campaign.deployment_speed_minutes / 60 > 1 ? "s" : ""}`

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Campaign Information</CardTitle>
          <CardDescription className="text-pretty">Basic details about this campaign</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Status</p>
              <Badge
                variant={
                  campaign.status === "completed"
                    ? "default"
                    : campaign.status === "failed"
                      ? "destructive"
                      : campaign.status === "processing"
                        ? "secondary"
                        : "outline"
                }
              >
                {campaign.status}
              </Badge>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Deployment Speed</p>
              <div className="flex items-center gap-2">
                <Clock className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
                <p className="text-sm font-medium">{deploymentSpeed}</p>
              </div>
            </div>

            <div className="space-y-1.5">
              <p className="text-sm text-muted-foreground">Created</p>
              <p className="text-sm font-medium">{format(new Date(campaign.created_at), "PPpp")}</p>
            </div>

            {campaign.completed_at && (
              <div className="space-y-1.5">
                <p className="text-sm text-muted-foreground">Completed</p>
                <p className="text-sm font-medium">{format(new Date(campaign.completed_at), "PPpp")}</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Source Article</CardTitle>
          <CardDescription className="text-pretty">The article being distributed</CardDescription>
        </CardHeader>
        <CardContent className="space-y-2">
          <div className="flex items-start gap-3 rounded-lg border border-border bg-muted/30 p-4">
            <FileText className="mt-1 h-5 w-5 shrink-0 text-primary" aria-hidden="true" />
            <div className="flex-1 space-y-2">
              <p className="font-semibold leading-tight">{campaign.source_article_title || "Unknown Article"}</p>
              {campaign.source_article_excerpt && (
                <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                  {campaign.source_article_excerpt}
                </p>
              )}
              {campaign.source_site_name && (
                <p className="text-sm text-muted-foreground">From: {campaign.source_site_name}</p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="text-balance">Distribution Statistics</CardTitle>
          <CardDescription className="text-pretty">Publication results across target sites</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4 sm:grid-cols-3">
            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                <Target className="h-6 w-6 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Total Sites</p>
                <p className="text-2xl font-bold text-foreground">{campaign.publications_count || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-green-500/10">
                <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Successful</p>
                <p className="text-2xl font-bold text-foreground">{campaign.successful_publications || 0}</p>
              </div>
            </div>

            <div className="flex items-center gap-3 rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-destructive/10">
                <XCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
              </div>
              <div className="flex-1">
                <p className="text-sm text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-foreground">{campaign.failed_publications || 0}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {campaign.custom_instructions && (
        <Card>
          <CardHeader>
            <CardTitle className="text-balance">Custom Instructions</CardTitle>
            <CardDescription className="text-pretty">Special instructions for this campaign</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="rounded-md border border-border bg-muted/50 p-4">
              <p className="whitespace-pre-wrap text-sm leading-relaxed text-foreground/90">
                {campaign.custom_instructions}
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}
