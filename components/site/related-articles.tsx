"use client"

import Link from "next/link"
import Image from "next/image"
import { useState, useEffect } from "react"
import type { PublicArticleListItem } from "@/lib/data/public-articles"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Clock } from "lucide-react"
import { Skeleton } from "@/components/ui/skeleton"
import { useDictionary, formatRelativeTime } from "@/lib/i18n"

type Props = {
  articles: PublicArticleListItem[]
  siteId: number
}

function ArticleCardSkeleton() {
  return (
    <Card className="h-full overflow-hidden">
      <Skeleton className="aspect-video w-full" />
      <CardHeader className="space-y-3">
        <Skeleton className="h-6 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </CardHeader>
      <CardContent>
        <Skeleton className="h-4 w-full" />
        <Skeleton className="mt-2 h-4 w-5/6" />
      </CardContent>
    </Card>
  )
}

export function RelatedArticles({ articles, siteId }: Props) {
  const { t, locale } = useDictionary()

  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading for skeleton
    const timer = setTimeout(() => setIsLoading(false), 100)
    return () => clearTimeout(timer)
  }, [])

  if (articles.length === 0) {
    return null
  }

  return (
    <section>
      <h2
        className="mb-6 text-balance"
        style={{
          fontSize: "var(--theme-text-h3)",
          fontFamily: "var(--theme-font-heading)",
          fontWeight: "var(--theme-weight-bold)",
          color: "var(--theme-current-text-primary)",
        }}
      >
        {t("article.related")}
      </h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {isLoading
          ? Array.from({ length: Math.min(3, articles.length) }).map((_, i) => <ArticleCardSkeleton key={i} />)
          : articles.map((article) => {
              const wordCount = article.excerpt?.split(/\s+/).length || 0
              const readingTime = Math.ceil(wordCount / 50)

              return (
                <Link key={article.id} href={`/article/${article.slug}`} className="group">
                  <Card
                    className="h-full overflow-hidden"
                    style={{
                      borderColor: "var(--theme-current-border)",
                      backgroundColor: "var(--theme-current-surface)",
                      borderRadius: "var(--theme-radius-card)",
                      boxShadow: "var(--theme-shadow-card)",
                      transition: "var(--theme-transition)",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.boxShadow = "var(--theme-shadow-card-hover)"
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.boxShadow = "var(--theme-shadow-card)"
                    }}
                  >
                    {article.featured_image_url && (
                      <div
                        className="relative aspect-video overflow-hidden"
                        style={{
                          borderTopLeftRadius: "var(--theme-radius-card)",
                          borderTopRightRadius: "var(--theme-radius-card)",
                        }}
                      >
                        <Image
                          src={article.featured_image_url || "/placeholder.svg"}
                          alt={article.featured_image_alt || article.title}
                          width={400}
                          height={225}
                          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                          loading="lazy"
                        />
                        {article.category && (
                          <Badge
                            className="absolute left-3 top-3"
                            style={{
                              backgroundColor: "var(--theme-current-primary)",
                              color: "white",
                              borderRadius: "var(--theme-radius-button)",
                            }}
                          >
                            {t(`category.${article.category.toLowerCase().replace(/\s+/g, "")}`, {
                              fallback: article.category,
                            })}
                          </Badge>
                        )}
                      </div>
                    )}

                    <CardHeader className="space-y-3">
                      <h3
                        className="line-clamp-2 text-balance transition-colors"
                        style={{
                          fontSize: "var(--theme-text-h4)",
                          fontFamily: "var(--theme-font-heading)",
                          fontWeight: "var(--theme-weight-semibold)",
                          color: "var(--theme-current-text-primary)",
                        }}
                      >
                        {article.title}
                      </h3>

                      {article.published_at && (
                        <div
                          className="flex items-center gap-3 text-xs"
                          style={{
                            fontFamily: "var(--theme-font-body)",
                            color: "var(--theme-current-text-muted)",
                          }}
                        >
                          <time dateTime={article.published_at.toISOString()}>
                            {formatRelativeTime(article.published_at, locale)}
                          </time>
                          {readingTime > 0 && (
                            <>
                              <span>•</span>
                              <div className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                <span>{t("time.min", { count: readingTime.toString() })}</span>
                              </div>
                            </>
                          )}
                        </div>
                      )}
                    </CardHeader>

                    {article.excerpt && (
                      <CardContent>
                        <p
                          className="line-clamp-2 text-sm text-pretty"
                          style={{
                            fontFamily: "var(--theme-font-body)",
                            color: "var(--theme-current-text-secondary)",
                          }}
                        >
                          {article.excerpt}
                        </p>
                      </CardContent>
                    )}
                  </Card>
                </Link>
              )
            })}
      </div>
    </section>
  )
}
