"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Clock, ArrowRight, FileText } from "lucide-react"

// X Logo
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

type PendingXPostsWidgetProps = {
  publications: any[]
}

export function PendingXPostsWidget({ publications }: PendingXPostsWidgetProps) {
  if (publications.length === 0) {
    return (
      <Card className="flex h-full w-full flex-col">
        <CardHeader className="border-b p-3 sm:p-4 md:p-6">
          <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-foreground">
              <XLogo className="h-3 w-3 text-background" />
            </div>
            Pending X Posts
          </CardTitle>
        </CardHeader>
        <CardContent className="flex flex-1 items-center justify-center p-6">
          <div className="text-center">
            <p className="text-sm text-muted-foreground">No pending posts</p>
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
            <div className="flex h-5 w-5 shrink-0 items-center justify-center rounded bg-foreground">
              <XLogo className="h-3 w-3 text-background" />
            </div>
            <span className="truncate">Pending X Posts</span>
          </CardTitle>
          <Button variant="ghost" size="sm" asChild className="w-full justify-center sm:w-auto">
            <Link href="/dashboard/x-publisher" className="text-xs sm:text-sm">
              View All
              <ArrowRight className="ml-1 h-3 w-3" aria-hidden="true" />
            </Link>
          </Button>
        </div>
      </CardHeader>
      <CardContent className="flex-1 p-3 sm:p-4">
        <div className="space-y-2.5 sm:space-y-3">
          {publications.map((pub) => (
            <XPostItem key={pub.id} publication={pub} />
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function XPostItem({ publication }: { publication: any }) {
  const [countdown, setCountdown] = useState<string>("")

  useEffect(() => {
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
  }, [publication.scheduled_for])

  return (
    <div className="rounded-lg border bg-card p-3 transition-all duration-200 hover:border-primary/30 hover:shadow-sm">
      <div className="space-y-2">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0 flex-1">
            <p className="truncate text-xs font-medium text-muted-foreground">
              @{publication.site_twitter_handle}
            </p>
            <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-foreground">
              {publication.x_post_text}
            </p>
          </div>
          <Badge 
            variant="secondary" 
            className="shrink-0 bg-orange-500/10 text-xs text-orange-600 dark:text-orange-400"
          >
            {countdown}
          </Badge>
        </div>
        {publication.article_title && (
          <Link
            href={`/dashboard/articles/${publication.article_id}`}
            className="flex items-center gap-1.5 text-xs text-muted-foreground transition-colors hover:text-primary hover:underline"
          >
            <FileText className="h-3 w-3 shrink-0" aria-hidden="true" />
            <span className="truncate">{publication.article_title}</span>
          </Link>
        )}
      </div>
    </div>
  )
}

