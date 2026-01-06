"use client"

import type { PublicArticleListItem } from "@/lib/data/public-articles"
import { ArticleCard } from "./article-card"
import { IntersectionObserverWrapper } from "../intersection-observer"
import { useDictionary } from "@/lib/i18n"

type Props = {
  articles: PublicArticleListItem[]
  siteId: number
}

export function ArticleGrid({ articles, siteId }: Props) {
  const { t, locale } = useDictionary()
  if (articles.length === 0) {
    return (
      <div className="theme-empty-state">
        <div className="text-center">
          <p className="theme-font-body theme-text-secondary text-lg font-medium" lang={locale}>
            {t("error.noArticles")}
          </p>
          <p className="theme-font-body theme-text-muted mt-2 text-sm" lang={locale}>
            {t("error.noArticlesDescription")}
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3" style={{ gap: "var(--theme-grid-gap)" }}>
      {articles.map((article, index) => (
        <IntersectionObserverWrapper key={article.id} className={`stagger-${Math.min((index % 3) + 1, 4)}`}>
          <ArticleCard article={article} siteId={siteId} />
        </IntersectionObserverWrapper>
      ))}
    </div>
  )
}
