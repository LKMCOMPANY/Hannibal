"use client"

import Link from "next/link"
import { Clock, X } from "lucide-react"
import { useState } from "react"
import type { PublicArticleListItem } from "@/lib/types/articles"
import { useDictionary } from "@/lib/i18n"

type BreakingNewsTickerProps = {
  articles: PublicArticleListItem[]
  siteId: number
}

export function BreakingNewsTicker({ articles, siteId }: BreakingNewsTickerProps) {
  const { t } = useDictionary()
  const [isDismissed, setIsDismissed] = useState(false)

  if (!articles.length || isDismissed) return null

  return (
    <div
      className="border-b backdrop-blur-sm"
      style={{
        backgroundColor: "var(--theme-current-primary)",
        borderColor: "var(--theme-current-border)",
        color: "var(--theme-current-text-inverse)",
      }}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 py-2 overflow-hidden sm:gap-4">
          <div className="flex items-center gap-2 shrink-0">
            <div
              className="flex h-5 w-5 items-center justify-center rounded-full"
              style={{ backgroundColor: "rgba(255, 255, 255, 0.2)" }}
            >
              <Clock className="h-3 w-3" />
            </div>
            <span className="text-xs font-semibold uppercase tracking-wide sm:text-sm">{t("breakingNews.title")}</span>
          </div>

          <div className="flex-1 overflow-hidden">
            <div className="animate-scroll flex gap-6 hover:animation-paused sm:gap-8" style={{ willChange: 'transform' }}>
              {articles.map((article) => (
                <Link
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="shrink-0 text-sm transition-opacity duration-200 hover:opacity-80 hover:underline touch-target flex items-center"
                >
                  {article.title}
                </Link>
              ))}
              {articles.map((article) => (
                <Link
                  key={`${article.id}-duplicate`}
                  href={`/article/${article.slug}`}
                  className="shrink-0 text-sm transition-opacity duration-200 hover:opacity-80 hover:underline touch-target flex items-center"
                >
                  {article.title}
                </Link>
              ))}
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="shrink-0 p-1 rounded hover:bg-white/10 transition-colors touch-target"
            aria-label={t("breakingNews.dismiss")}
          >
            <X className="h-4 w-4" />
          </button>
        </div>
      </div>

      <style jsx>{`
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        .animate-scroll {
          animation: scroll 40s linear infinite;
          will-change: transform;
        }
        .animate-scroll:hover {
          animation-play-state: paused;
        }
        @media (prefers-reduced-motion: reduce) {
          .animate-scroll {
            animation: none;
            will-change: auto;
          }
        }
      `}</style>
    </div>
  )
}
