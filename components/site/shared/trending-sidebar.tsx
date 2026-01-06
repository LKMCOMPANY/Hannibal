"use client"

import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Clock } from "lucide-react"
import type { PublicArticleListItem } from "@/lib/types/articles"
import { useDictionary } from "@/lib/i18n"

type TrendingSidebarProps = {
  articles: PublicArticleListItem[]
  siteId: number
}

export function TrendingSidebar({ articles, siteId }: TrendingSidebarProps) {
  const { t, locale } = useDictionary()

  if (!articles.length) return null

  return (
    <div
      className="border p-6 transition-shadow duration-300 hover:shadow-md"
      style={{
        backgroundColor: "var(--theme-current-surface)",
        borderColor: "var(--theme-current-border)",
        borderRadius: "var(--theme-radius-card)",
        boxShadow: "var(--theme-shadow-card)",
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.boxShadow = "var(--theme-shadow-card-hover)"
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.boxShadow = "var(--theme-shadow-card)"
      }}
    >
      <div className="mb-6 flex items-center gap-3">
        <div
          className="flex h-10 w-10 items-center justify-center"
          style={{
            backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
            borderRadius: "var(--theme-radius-button)",
          }}
        >
          <TrendingUp className="h-5 w-5" style={{ color: "var(--theme-current-primary)" }} />
        </div>
        <h2
          className="text-balance text-xl font-bold tracking-tight"
          style={{
            fontFamily: "var(--theme-font-heading)",
            color: "var(--theme-current-text-primary)",
          }}
        >
          {t("article.trendingNow")}
        </h2>
      </div>

      <div className="space-y-4">
        {articles.map((article, index) => (
          <Link
            key={article.id}
            href={`/article/${article.slug}`}
            className="group flex gap-4 border-b pb-4 last:border-0 last:pb-0 transition-all duration-300 hover:translate-x-1"
            style={{
              borderColor: "color-mix(in srgb, var(--theme-current-border) 40%, transparent)",
            }}
          >
            <div
              className="flex h-7 w-7 shrink-0 items-center justify-center text-sm font-bold transition-all duration-300"
              style={{
                backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
                color: "var(--theme-current-primary)",
                borderRadius: "var(--theme-radius-button)",
              }}
            >
              {index + 1}
            </div>

            <div className="flex-1 space-y-2">
              <h3
                className="line-clamp-2 text-sm font-semibold leading-snug transition-colors duration-300 group-hover:text-[var(--theme-current-primary)]"
                style={{
                  fontFamily: "var(--theme-font-heading)",
                  color: "var(--theme-current-text-primary)",
                }}
              >
                {article.title}
              </h3>

              {article.published_at && (
                <div
                  className="flex items-center gap-1.5 text-xs"
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    color: "var(--theme-current-text-muted)",
                  }}
                >
                  <Clock className="h-3.5 w-3.5" />
                  <time dateTime={article.published_at}>
                    {new Date(article.published_at).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                    })}
                  </time>
                </div>
              )}
            </div>

            {article.featured_image_url && (
              <div
                className="relative h-16 w-20 shrink-0 overflow-hidden"
                style={{
                  backgroundColor: "var(--theme-current-surface)",
                  borderRadius: "var(--theme-radius-image)",
                }}
              >
                <Image
                  src={article.featured_image_url || "/placeholder.svg"}
                  alt={article.title}
                  fill
                  sizes="80px"
                  className="object-cover transition-transform duration-500 group-hover:scale-110"
                />
              </div>
            )}
          </Link>
        ))}
      </div>
    </div>
  )
}
