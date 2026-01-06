"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, TrendingUp } from "lucide-react"
import type { PublicArticleListItem } from "@/lib/data/public-articles"
import { useDictionary, formatRelativeTime } from "@/lib/i18n"

type Props = {
  article: PublicArticleListItem
  siteId: number
  featured?: boolean
}

export function ArticleCard({ article, siteId, featured = false }: Props) {
  const { t, locale } = useDictionary()

  const publishedDate = article.published_at ? new Date(article.published_at) : null
  const readingTime = article.excerpt ? Math.ceil(article.excerpt.length / 200) : 5

  return (
    <article
      className={`group flex flex-col overflow-hidden transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--theme-shadow-card-hover)] hover:border-[color-mix(in_srgb,var(--theme-current-primary)_25%,var(--theme-current-border))] ${featured ? "lg:col-span-2" : ""}`}
      style={{
        borderRadius: "var(--theme-radius-card)",
        border: "1px solid var(--theme-current-border)",
        backgroundColor: "var(--theme-current-surface)",
        boxShadow: "var(--theme-shadow-card)",
        transitionDuration: "var(--theme-transition)",
      }}
    >
      <Link
        href={`/article/${article.slug}`}
        className="relative aspect-[4/3] overflow-hidden sm:aspect-video"
        style={{ borderRadius: "var(--theme-radius-image) var(--theme-radius-image) 0 0" }}
      >
        {article.featured_image_url ? (
          <Image
            src={article.featured_image_url || "/placeholder.svg"}
            alt={article.featured_image_alt || article.title}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition-transform duration-700 ease-out group-hover:scale-105"
          />
        ) : (
          <div
            className="flex h-full w-full items-center justify-center"
            style={{
              background: `linear-gradient(135deg, color-mix(in srgb, var(--theme-current-primary) 12%, transparent), color-mix(in srgb, var(--theme-current-accent) 12%, transparent))`,
            }}
          >
            <span
              style={{
                fontSize: "2.5rem",
                fontFamily: "var(--theme-font-heading)",
                fontWeight: "var(--theme-weight-bold)",
                color: "color-mix(in srgb, var(--theme-current-primary) 25%, transparent)",
              }}
            >
              {article.title.charAt(0)}
            </span>
          </div>
        )}

        <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      </Link>

      <div
        className="flex flex-1 flex-col"
        style={{
          padding: featured ? "clamp(1rem, 3vw, 1.5rem)" : "clamp(0.875rem, 2.5vw, 1.25rem)",
          gap: "0.875rem",
        }}
      >
        <div className="flex items-center justify-between gap-2">
          {article.category && (
            <Link
              href={`/category/${encodeURIComponent(article.category)}`}
              className="inline-flex items-center px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 hover:brightness-110 touch-target shadow-sm"
              style={{
                borderRadius: "9999px",
                backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
                color: "var(--theme-current-primary)",
                fontFamily: "var(--theme-font-heading)",
                fontWeight: "var(--theme-weight-bold)",
                letterSpacing: "0.05em",
                transitionDuration: "var(--theme-transition)",
              }}
              lang={locale}
            >
              {t(`category.${article.category.toLowerCase().replace(/\s+/g, "")}`, { fallback: article.category })}
            </Link>
          )}

          {featured && (
            <div
              className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider"
              style={{
                color: "var(--theme-current-accent)",
                fontFamily: "var(--theme-font-heading)",
                fontWeight: "var(--theme-weight-bold)",
              }}
              lang={locale}
            >
              <TrendingUp className="h-3.5 w-3.5" />
              <span className="hidden sm:inline">{t("article.trending")}</span>
            </div>
          )}
        </div>

        <Link href={`/article/${article.slug}`}>
          <h3
            className="line-clamp-2 text-balance transition-colors hover:text-[var(--theme-current-primary)]"
            style={{
              fontSize: featured
                ? "clamp(1.125rem, 2.5vw, var(--theme-text-h3))"
                : "clamp(0.9375rem, 2vw, var(--theme-text-h4))",
              fontFamily: "var(--theme-font-heading)",
              fontWeight: "var(--theme-weight-bold)",
              lineHeight: "var(--theme-leading-tight)",
              letterSpacing: "var(--theme-tracking-tight)",
              color: "var(--theme-current-text-primary)",
              transitionDuration: "var(--theme-transition)",
            }}
          >
            {article.title}
          </h3>
        </Link>

        {article.excerpt && (
          <p
            className="line-clamp-3 flex-1 text-pretty"
            style={{
              fontSize: featured ? "var(--theme-text-body)" : "var(--theme-text-small)",
              fontFamily: "var(--theme-font-body)",
              lineHeight: "var(--theme-leading-relaxed)",
              color: "var(--theme-current-text-secondary)",
            }}
          >
            {article.excerpt}
          </p>
        )}

        <div
          className="mt-auto flex flex-col gap-2 border-t pt-4 sm:flex-row sm:items-center sm:justify-between sm:gap-3"
          style={{
            borderColor: "var(--theme-current-border)",
          }}
        >
          <div className="flex items-center gap-2.5" style={{ color: "var(--theme-current-text-muted)" }}>
            {article.author_name && article.author_id && (
              <Link
                href={`/author/${article.author_id}`}
                className="flex items-center gap-2 transition-colors touch-target group/author hover:text-[var(--theme-current-primary)]"
                style={{
                  transitionDuration: "var(--theme-transition)",
                  color: "inherit",
                }}
              >
                <div
                  className="flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-bold sm:h-7 sm:w-7 ring-1 ring-transparent transition-all group-hover/author:ring-[var(--theme-current-primary)]"
                  style={{
                    borderRadius: "9999px",
                    backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
                    color: "var(--theme-current-primary)",
                    fontWeight: "var(--theme-weight-bold)",
                  }}
                >
                  {article.author_name.charAt(0)}
                </div>
                <span
                  className="text-xs font-medium"
                  style={{
                    fontFamily: "var(--theme-font-body)",
                    fontWeight: "var(--theme-weight-medium)",
                    color: "var(--theme-current-text-primary)",
                  }}
                >
                  {article.author_name}
                </span>
              </Link>
            )}
          </div>

          <div
            className="flex items-center gap-3 text-xs tabular-nums"
            style={{
              color: "var(--theme-current-text-muted)",
              fontFamily: "var(--theme-font-body)",
            }}
          >
            {publishedDate && (
              <time dateTime={publishedDate.toISOString()} className="whitespace-nowrap">
                {formatRelativeTime(publishedDate, locale)}
              </time>
            )}
            <span style={{ opacity: 0.3 }}>•</span>
            <div className="flex items-center gap-1 whitespace-nowrap">
              <Clock className="h-3.5 w-3.5 shrink-0" />
              <span>{t("time.min", { count: readingTime.toString() })}</span>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
