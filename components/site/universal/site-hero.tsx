"use client"

import Link from "next/link"
import Image from "next/image"
import { Clock, Calendar } from "lucide-react"
import type { PublicArticleListItem } from "@/lib/data/public-articles"
import { useDictionary, formatRelativeTime, getCategoryKey } from "@/lib/i18n"

type Props = {
  article: PublicArticleListItem | null
  siteId: number
}

export function SiteHero({ article, siteId }: Props) {
  const { t, locale } = useDictionary()

  if (!article) {
    return null
  }

  const publishedDate = article.published_at ? new Date(article.published_at) : null
  const readingTime = article.excerpt ? Math.ceil(article.excerpt.length / 200) : 5

  return (
    <section className="container mx-auto px-4 py-6 sm:px-6 sm:py-10 lg:px-8 lg:py-16">
      <Link href={`/article/${article.slug}`} className="group block">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-2 lg:gap-12">
          <div
            className="relative aspect-[16/10] overflow-hidden sm:aspect-video lg:aspect-[4/3]"
            style={{ borderRadius: "var(--theme-radius-image)" }}
          >
            {article.featured_image_url ? (
              <Image
                src={article.featured_image_url || "/placeholder.svg"}
                alt={article.featured_image_alt || article.title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 600px"
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
                    fontSize: "var(--theme-text-hero)",
                    fontFamily: "var(--theme-font-heading)",
                    fontWeight: "var(--theme-weight-bold)",
                    color: "color-mix(in srgb, var(--theme-current-primary) 25%, transparent)",
                  }}
                >
                  {article.title.charAt(0)}
                </span>
              </div>
            )}

            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 lg:hidden" />

            <div
              className="absolute left-4 top-4 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-white shadow-sm backdrop-blur-md sm:left-6 sm:top-6"
              style={{
                borderRadius: "9999px",
                backgroundColor: "rgba(0, 0, 0, 0.6)",
                fontFamily: "var(--theme-font-heading)",
                fontWeight: "var(--theme-weight-bold)",
              }}
            >
              {t("article.featured")}
            </div>
          </div>

          <div className="flex flex-col justify-center space-y-3 sm:space-y-4 lg:space-y-6">
            {article.category && (
              <div className="flex items-center">
                <Link
                  href={`/category/${encodeURIComponent(article.category)}`}
                  className="inline-flex items-center px-3 py-1 text-[10px] font-bold uppercase tracking-wider transition-all hover:scale-105 hover:brightness-110 touch-target shadow-sm"
                  style={{
                    borderRadius: "9999px",
                    backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
                    color: "var(--theme-current-primary)",
                    fontFamily: "var(--theme-font-heading)",
                    fontWeight: "var(--theme-weight-bold)",
                    transitionDuration: "var(--theme-transition)",
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  {t(`category.${getCategoryKey(article.category)}`) || article.category}
                </Link>
              </div>
            )}

            <h1
              className="text-balance transition-colors"
              style={{
                fontSize: "clamp(1.75rem, 3.5vw, 2.5rem)",
                fontFamily: "var(--theme-font-heading)",
                fontWeight: "var(--theme-weight-bold)",
                lineHeight: "var(--theme-leading-tight)",
                letterSpacing: "var(--theme-tracking-tighter)",
                color: "var(--theme-current-text-primary)",
                transitionDuration: "var(--theme-transition)",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--theme-current-primary)"
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--theme-current-text-primary)"
              }}
            >
              {article.title}
            </h1>

            {article.excerpt && (
              <p
                className="line-clamp-3 text-pretty"
                style={{
                  fontSize: "clamp(0.9375rem, 1.5vw, 1.0625rem)",
                  fontFamily: "var(--theme-font-body)",
                  lineHeight: "var(--theme-leading-relaxed)",
                  color: "var(--theme-current-text-secondary)",
                }}
              >
                {article.excerpt}
              </p>
            )}

            <div
              className="flex flex-wrap items-center gap-3 text-sm tabular-nums"
              style={{
                color: "var(--theme-current-text-muted)",
                fontFamily: "var(--theme-font-body)",
              }}
            >
              {article.author_name && article.author_id && (
                <Link
                  href={`/author/${article.author_id}`}
                  className="flex items-center gap-2 font-medium transition-colors touch-target group/author"
                  style={{
                    fontWeight: "var(--theme-weight-medium)",
                    transitionDuration: "var(--theme-transition)",
                    color: "inherit",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.color = "var(--theme-current-primary)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.color = "var(--theme-current-text-muted)"
                  }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div
                    className="flex h-6 w-6 shrink-0 items-center justify-center text-[10px] font-bold sm:h-7 sm:w-7 ring-1 ring-transparent transition-all group-hover/author:ring-[var(--theme-current-primary)]"
                    style={{
                      borderRadius: "9999px",
                      backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 12%, transparent)",
                      color: "var(--theme-current-primary)",
                      fontWeight: "var(--theme-weight-bold)",
                    }}
                  >
                    {article.author_name.charAt(0)}
                  </div>
                  <span style={{ color: "var(--theme-current-text-primary)" }}>{article.author_name}</span>
                </Link>
              )}

              {publishedDate && (
                <>
                  <span className="hidden sm:inline" style={{ color: "var(--theme-current-text-muted)", opacity: 0.3 }}>
                    •
                  </span>
                  <div className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4 shrink-0" />
                    <time dateTime={publishedDate.toISOString()}>{formatRelativeTime(publishedDate, locale)}</time>
                  </div>
                </>
              )}

              <span style={{ color: "var(--theme-current-text-muted)", opacity: 0.3 }}>•</span>
              <div className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 shrink-0" />
                <span>{t("time.minRead", { count: readingTime })}</span>
              </div>
            </div>

            <div
              className="flex items-center gap-2 font-semibold transition-all group-hover:gap-3"
              style={{
                color: "var(--theme-current-primary)",
                fontFamily: "var(--theme-font-body)",
                fontWeight: "var(--theme-weight-semibold)",
                transitionDuration: "var(--theme-transition)",
              }}
            >
              <span>{t("article.readFullStory")}</span>
              <svg
                className="h-5 w-5 transition-transform group-hover:translate-x-1"
                style={{ transitionDuration: "var(--theme-transition)" }}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2.5}
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M17 8l4 4m0 0l-4 4m4-4H3" />
              </svg>
            </div>
          </div>
        </div>
      </Link>
    </section>
  )
}
