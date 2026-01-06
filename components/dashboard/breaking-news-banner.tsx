"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import { Card } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Zap } from "lucide-react"
import { cn } from "@/lib/utils"
import { formatDistanceToNow } from "date-fns"

type Article = {
  id: number
  title: string
  slug: string
  published_at: string
  site_name: string
  custom_domain: string | null
  country_iso2: string | null
}

type BreakingNewsBannerProps = {
  articles: Article[]
}

export function BreakingNewsBanner({ articles }: BreakingNewsBannerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)

  // Auto-rotate every 5 seconds
  useEffect(() => {
    if (articles.length <= 1) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % articles.length)
    }, 5000)

    return () => clearInterval(interval)
  }, [articles.length])

  if (articles.length === 0) return null

  const current = articles[currentIndex]
  const articleUrl = current.custom_domain
    ? `https://${current.custom_domain}/article/${current.slug}`
    : `/site/${current.id}/article/${current.slug}`

  return (
    <Card className="w-full overflow-hidden border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-transparent">
      <div className="flex items-center gap-2.5 p-3 sm:gap-3 sm:p-4">
        <div className="flex shrink-0 items-center gap-1.5 sm:gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-orange-500/10 sm:h-8 sm:w-8">
            <Zap className="h-3.5 w-3.5 text-orange-600 dark:text-orange-400 sm:h-4 sm:w-4" aria-hidden="true" />
          </div>
          <Badge variant="secondary" className="hidden border-orange-500/20 bg-orange-500/10 text-orange-700 dark:text-orange-400 sm:inline-flex">
            Latest
          </Badge>
        </div>

        <div className="min-w-0 flex-1 overflow-hidden">
          <Link
            href={articleUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="group block"
          >
            <p className="line-clamp-2 text-xs font-semibold text-foreground transition-colors group-hover:text-primary sm:line-clamp-1 sm:text-sm">
              {current.title}
            </p>
            <div className="mt-1 flex flex-wrap items-center gap-x-1.5 gap-y-0.5 text-[11px] text-muted-foreground sm:mt-0.5 sm:gap-x-2 sm:text-xs">
              <span className="truncate max-w-[120px] sm:max-w-none">{current.site_name}</span>
              <span className="hidden sm:inline">·</span>
              <span className="shrink-0">{formatDistanceToNow(new Date(current.published_at), { addSuffix: true })}</span>
              {current.country_iso2 && (
                <>
                  <span className="hidden sm:inline">·</span>
                  <span className="shrink-0 uppercase">{current.country_iso2}</span>
                </>
              )}
            </div>
          </Link>
        </div>

        {articles.length > 1 && (
          <div className="flex shrink-0 items-center gap-1 sm:gap-1.5">
            {articles.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentIndex(index)}
                className={cn(
                  "h-1.5 w-1.5 rounded-full transition-all duration-200",
                  index === currentIndex
                    ? "w-4 bg-orange-600 dark:bg-orange-400"
                    : "bg-muted-foreground/30 hover:bg-muted-foreground/50"
                )}
                aria-label={`Go to article ${index + 1}`}
                aria-current={index === currentIndex ? "true" : "false"}
              />
            ))}
          </div>
        )}
      </div>
    </Card>
  )
}

