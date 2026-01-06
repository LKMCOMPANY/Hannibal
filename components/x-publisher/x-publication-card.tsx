"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Clock, ExternalLink, Pause, Play, RotateCw, X as XIcon, CheckCircle2, AlertCircle, FileText } from "lucide-react"
import { XLogo } from "@/components/site/icons/x-logo"
import { toast } from "sonner"
import { pauseXPublicationAction, resumeXPublicationAction, retryXPublicationAction, cancelXPublicationAction } from "@/lib/actions/x-publisher"
import type { XPublicationWithRelations } from "@/lib/types/x-publications"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

type XPublicationCardProps = {
  publication: XPublicationWithRelations
}

export function XPublicationCard({ publication }: XPublicationCardProps) {
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [isProcessing, setIsProcessing] = useState(false)
  const [countdown, setCountdown] = useState<string>("")

  // Countdown timer
  useEffect(() => {
    if (publication.status !== 'pending') return

    const updateCountdown = () => {
      const now = new Date()
      const scheduled = new Date(publication.scheduled_for)
      const diff = scheduled.getTime() - now.getTime()

      if (diff <= 0) {
        setCountdown("Posting...")
        return
      }

      const minutes = Math.floor(diff / 60000)
      const seconds = Math.floor((diff % 60000) / 1000)
      setCountdown(`${minutes}m ${seconds}s`)
    }

    updateCountdown()
    const interval = setInterval(updateCountdown, 1000)
    return () => clearInterval(interval)
  }, [publication.status, publication.scheduled_for])

  const handlePause = async () => {
    setIsProcessing(true)
    const result = await pauseXPublicationAction(publication.id)
    toast[result.success ? "success" : "error"](result.error || "Tweet paused")
    setIsProcessing(false)
  }

  const handleResume = async () => {
    setIsProcessing(true)
    const result = await resumeXPublicationAction(publication.id)
    toast[result.success ? "success" : "error"](result.error || "Tweet resumed")
    setIsProcessing(false)
  }

  const handleRetry = async () => {
    setIsProcessing(true)
    const result = await retryXPublicationAction(publication.id)
    toast[result.success ? "success" : "error"](result.error || "Retrying...")
    setIsProcessing(false)
  }

  const handleCancel = async () => {
    setIsProcessing(true)
    const result = await cancelXPublicationAction(publication.id)
    toast[result.success ? "success" : "error"](result.error || "Tweet cancelled")
    setIsProcessing(false)
    setShowCancelDialog(false)
  }

  // Status badge
  const statusConfig = {
    pending: { label: "Pending", className: "bg-orange-500/10 text-orange-700 dark:text-orange-400 border-orange-500/20" },
    posted: { label: "Posted", className: "bg-green-500/10 text-green-700 dark:text-green-400 border-green-500/20" },
    failed: { label: "Failed", className: "bg-destructive/10 text-destructive border-destructive/20" },
    paused: { label: "Paused", className: "bg-muted text-muted-foreground border-border" },
    cancelled: { label: "Cancelled", className: "bg-muted text-muted-foreground border-border opacity-60" },
  }[publication.status]

  // Build public URL
  const articleUrl = publication.site_custom_domain && publication.article_slug
    ? `https://${publication.site_custom_domain}/article/${publication.article_slug}`
    : publication.article_url

  const scheduledTime = formatDistanceToNow(new Date(publication.scheduled_for), { addSuffix: true })

  return (
    <>
      <Card className="overflow-hidden border-border transition-all duration-200 hover:border-primary/20 hover:shadow-md">
        <CardContent className="p-0">
          <div className="flex flex-col md:flex-row">
            {/* LEFT: Site Info & Controls (25%) */}
            <div className="w-full border-b bg-muted/30 p-6 md:w-1/4 md:border-b-0 md:border-r md:border-border">
              <div className="space-y-4">
                {/* Site Info */}
                <div className="space-y-3">
                  <div className="flex items-center gap-2.5">
                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-foreground">
                      <XLogo className="h-4 w-4 text-background" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-sm font-semibold text-foreground">{publication.site_name}</p>
                      <p className="truncate text-xs text-muted-foreground">@{publication.site_twitter_handle}</p>
                    </div>
                  </div>

                  <Badge variant="secondary" className={cn("w-fit", statusConfig.className)}>
                    {statusConfig.label}
                  </Badge>
                </div>

                {/* Countdown */}
                {publication.status === 'pending' && countdown && (
                  <div className="rounded-md border bg-card p-3">
                    <p className="mb-1.5 text-xs font-medium text-muted-foreground">Posts in</p>
                    <div className="flex items-center gap-2">
                      <Clock className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400" />
                      <span className="font-mono text-sm font-semibold text-orange-600 dark:text-orange-400">{countdown}</span>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-2">
                  {publication.status === 'pending' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={handlePause} disabled={isProcessing}>
                        <Pause className="mr-1 h-3 w-3" />
                        Pause
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(true)} disabled={isProcessing}>
                        <XIcon className="mr-1 h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  )}

                  {publication.status === 'paused' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={handleResume} disabled={isProcessing}>
                        <Play className="mr-1 h-3 w-3" />
                        Resume
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(true)} disabled={isProcessing}>
                        <XIcon className="mr-1 h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  )}

                  {publication.status === 'failed' && (
                    <div className="grid grid-cols-2 gap-2">
                      <Button variant="outline" size="sm" onClick={handleRetry} disabled={isProcessing}>
                        <RotateCw className="mr-1 h-3 w-3" />
                        Retry
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => setShowCancelDialog(true)} disabled={isProcessing}>
                        <XIcon className="mr-1 h-3 w-3" />
                        Cancel
                      </Button>
                    </div>
                  )}

                  {publication.status === 'posted' && publication.twitter_post_url && (
                    <Button variant="outline" size="sm" asChild className="w-full">
                      <a href={publication.twitter_post_url} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="mr-1.5 h-3 w-3" />
                        View on X
                      </a>
                    </Button>
                  )}
                </div>
              </div>
            </div>

            {/* RIGHT: Tweet Preview (75%) - Twitter/X Official Style */}
            <div className="flex-1 p-6">
              <div className="space-y-4">
                {/* Tweet Header */}
                <div className="flex items-start gap-3">
                  <div className="min-w-0 flex-1 space-y-0.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-semibold text-foreground">{publication.site_name}</span>
                      <span className="text-sm text-muted-foreground">@{publication.site_twitter_handle}</span>
                      <span className="text-sm text-muted-foreground">·</span>
                      <span className="text-sm text-muted-foreground">{scheduledTime}</span>
                    </div>
                  </div>
                </div>

                {/* Tweet Text */}
                <div className="space-y-3">
                  <p className="whitespace-pre-wrap break-words text-[15px] leading-normal text-foreground">
                    {publication.x_post_text}
                  </p>

                  {/* Error Alert */}
                  {publication.status === 'failed' && publication.error_message && (
                    <div className="rounded-md border border-destructive/30 bg-destructive/5 p-3">
                      <div className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 shrink-0 text-destructive" />
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-semibold text-destructive">Failed to post</p>
                          <p className="mt-1 text-xs text-destructive/80">{publication.error_message}</p>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Tweet Meta (like real X) */}
                  <div className="flex flex-wrap items-center gap-x-6 gap-y-2 border-t pt-3 text-xs text-muted-foreground">
                    <div className="flex items-center gap-1.5">
                      <Clock className="h-3.5 w-3.5" />
                      <span>Scheduled {scheduledTime}</span>
                    </div>
                    
                    {publication.article_title && (
                      <div className="flex items-center gap-1.5">
                        <FileText className="h-3.5 w-3.5" />
                        <Link
                          href={`/dashboard/articles/${publication.article_id}`}
                          className="hover:underline"
                        >
                          {publication.article_title}
                        </Link>
                      </div>
                    )}

                    {articleUrl && (
                      <a
                        href={articleUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-1.5 hover:underline"
                      >
                        <ExternalLink className="h-3.5 w-3.5" />
                        <span>View article</span>
                      </a>
                    )}

                    {publication.posted_at && (
                      <div className="flex items-center gap-1.5">
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-600 dark:text-green-400" />
                        <span>Posted {formatDistanceToNow(new Date(publication.posted_at), { addSuffix: true })}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <AlertDialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Cancel Tweet</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to cancel this scheduled tweet? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isProcessing}>Keep</AlertDialogCancel>
            <AlertDialogAction onClick={handleCancel} disabled={isProcessing}>
              {isProcessing ? "Cancelling..." : "Cancel Tweet"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
}
