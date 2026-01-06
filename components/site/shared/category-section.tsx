"use client"

import Link from "next/link"
import Image from "next/image"
import { TrendingUp, Clock, ArrowRight } from "lucide-react"
import type { PublicArticleListItem } from "@/lib/types/articles"
import { useDictionary, getCategoryKey } from "@/lib/i18n"

type CategorySectionProps = {
  title: string
  articles: PublicArticleListItem[]
  siteId: number
  showTrending?: boolean
  categorySlug?: string
}

export function CategorySection({ title, articles, siteId, showTrending = false, categorySlug }: CategorySectionProps) {
  const { t, locale } = useDictionary()

  if (!articles.length) return null

  return (
    <section className="py-8">
      <div className="mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <h2 className="text-2xl font-bold">{title}</h2>
          {showTrending && (
            <span className="flex items-center gap-1 rounded-full bg-[var(--site-primary)]/10 px-3 py-1 text-xs font-semibold text-[var(--site-primary)]">
              <TrendingUp className="h-3 w-3" />
              {t("article.trending")}
            </span>
          )}
        </div>

        {categorySlug && (
          <Link
            href={`/category/${categorySlug}`}
            className="flex items-center gap-1 text-sm font-medium text-[var(--site-primary)] hover:underline"
          >
            {t("action.viewAll")}
            <ArrowRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.slice(0, 3).map((article) => (
          <Link key={article.id} href={`/article/${article.slug}`} className="group">
            <article
              className="overflow-hidden border transition-all"
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
              {article.featured_image_url && (
                <div className="relative aspect-video overflow-hidden">
                  <Image
                    src={article.featured_image_url || "/placeholder.svg"}
                    alt={article.title}
                    fill
                    className="object-cover transition-transform group-hover:scale-105"
                  />
                </div>
              )}

              <div className="p-4">
                {article.category && (
                  <span className="mb-2 inline-block rounded-full bg-[var(--site-primary)]/10 px-2.5 py-0.5 text-xs font-semibold text-[var(--site-primary)]">
                    {t(`category.${getCategoryKey(article.category)}`, { fallback: article.category })}
                  </span>
                )}

                <h3 className="mb-2 line-clamp-2 text-lg font-bold leading-tight group-hover:text-[var(--site-primary)] transition-colors">
                  {article.title}
                </h3>

                {article.excerpt && (
                  <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">{article.excerpt}</p>
                )}

                {article.published_at && (
                  <div className="flex items-center gap-1 text-xs text-muted-foreground">
                    <Clock className="h-3 w-3" />
                    {new Date(article.published_at).toLocaleDateString(locale, {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                    })}
                  </div>
                )}
              </div>
            </article>
          </Link>
        ))}
      </div>
    </section>
  )
}
