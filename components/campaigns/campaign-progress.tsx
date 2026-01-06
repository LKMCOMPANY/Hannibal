"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Activity, CheckCircle2, Clock, Loader2, XCircle } from "lucide-react"
import type { CampaignWithRelations } from "@/lib/types/campaigns"
import { formatDistanceToNow } from "date-fns"

type CampaignProgressProps = {
  campaign: CampaignWithRelations
  isLive?: boolean
}

export function CampaignProgress({ campaign, isLive = false }: CampaignProgressProps) {
  const totalPublications = Math.max(0, campaign.publications_count || 0)
  const successfulPublications = Math.max(0, Math.min(campaign.successful_publications || 0, totalPublications))
  const failedPublications = Math.max(0, Math.min(campaign.failed_publications || 0, totalPublications))

  // Ensure completed doesn't exceed total
  const completedPublications = Math.min(successfulPublications + failedPublications, totalPublications)

  // Cap percentage at 100%
  const progressPercentage =
    totalPublications > 0 ? Math.min(100, Math.round((completedPublications / totalPublications) * 100)) : 0

  const isProcessing = campaign.status === "processing"
  const isCompleted = campaign.status === "completed"
  const isFailed = campaign.status === "failed"
  const isPending = campaign.status === "pending"

  const getEstimatedTimeRemaining = () => {
    if (!isProcessing || totalPublications === 0 || completedPublications >= totalPublications) return null

    const remainingPublications = Math.max(0, totalPublications - completedPublications)
    const deploymentSpeedMinutes = Math.max(1, campaign.deployment_speed_minutes || 60)
    const estimatedMinutes = remainingPublications * deploymentSpeedMinutes

    if (estimatedMinutes < 1) return null

    if (estimatedMinutes < 60) {
      return `~${estimatedMinutes} min remaining`
    }

    const hours = Math.floor(estimatedMinutes / 60)
    const minutes = estimatedMinutes % 60

    if (minutes === 0) {
      return `~${hours}h remaining`
    }

    return `~${hours}h ${minutes}m remaining`
  }

  const estimatedTime = getEstimatedTimeRemaining()

  return (
    <Card className="border-2 transition-all duration-300">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div className="flex-1 space-y-1.5">
            <CardTitle className="flex items-center gap-2.5 text-balance">
              Campaign Progress
              {isLive && isProcessing && (
                <Badge variant="secondary" className="gap-1.5 bg-primary/10 text-primary">
                  <span className="relative flex h-2 w-2">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-primary opacity-75" />
                    <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
                  </span>
                  Live
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="text-pretty leading-relaxed">
              {isProcessing && "Publishing articles to target sites"}
              {isCompleted && "All publications completed successfully"}
              {isFailed && "Campaign completed with some failures"}
              {isPending && "Campaign queued for processing"}
            </CardDescription>
          </div>

          {isCompleted && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-green-500/10">
              <CheckCircle2 className="h-6 w-6 text-green-600 dark:text-green-500" aria-hidden="true" />
            </div>
          )}
          {isProcessing && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-primary/10">
              <Loader2 className="h-6 w-6 animate-spin text-primary" aria-hidden="true" />
            </div>
          )}
          {isFailed && (
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-destructive/10">
              <XCircle className="h-6 w-6 text-destructive" aria-hidden="true" />
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <div className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Activity className="h-4 w-4 text-muted-foreground" aria-hidden="true" />
              <span className="font-medium text-foreground">
                {completedPublications} of {totalPublications} completed
              </span>
            </div>
            <span className="text-lg font-bold text-primary">{progressPercentage}%</span>
          </div>

          <Progress value={progressPercentage} className="h-2.5 transition-all duration-500" />

          {estimatedTime && (
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Clock className="h-4 w-4" aria-hidden="true" />
              <span>{estimatedTime}</span>
            </div>
          )}
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-primary/30 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 transition-colors group-hover:bg-primary/15">
                <Activity className="h-5 w-5 text-primary" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Total</p>
                <p className="text-2xl font-bold text-foreground tabular-nums">{totalPublications}</p>
              </div>
            </div>
          </div>

          <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-green-500/30 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-green-500/10 transition-colors group-hover:bg-green-500/15">
                <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-500" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Published</p>
                <p className="text-2xl font-bold text-foreground tabular-nums">{successfulPublications}</p>
              </div>
            </div>
          </div>

          <div className="group rounded-lg border border-border bg-card p-4 transition-all hover:border-destructive/30 hover:shadow-sm">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-destructive/10 transition-colors group-hover:bg-destructive/15">
                <XCircle className="h-5 w-5 text-destructive" aria-hidden="true" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium text-muted-foreground">Failed</p>
                <p className="text-2xl font-bold text-foreground tabular-nums">{failedPublications}</p>
              </div>
            </div>
          </div>
        </div>

        {campaign.created_at && (
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3 text-sm">
            <span className="font-medium text-muted-foreground">Started</span>
            <span className="font-semibold text-foreground">
              {formatDistanceToNow(new Date(campaign.created_at), { addSuffix: true })}
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
