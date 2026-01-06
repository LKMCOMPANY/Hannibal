"use client"

import { useEffect, useRef, useState, useCallback } from "react"
import { ArticleCard } from "./article-card"
import { Spinner } from "@/components/ui/spinner"
import type { ArticleListItem, ArticleFilters } from "@/lib/types/articles"

type ArticleListInfiniteProps = {
  initialArticles: ArticleListItem[]
  filters: ArticleFilters
  hasMore: boolean
}

export function ArticleListInfinite({ initialArticles, filters, hasMore: initialHasMore }: ArticleListInfiniteProps) {
  const [articles, setArticles] = useState<ArticleListItem[]>(initialArticles)
  const [isLoading, setIsLoading] = useState(false)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [page, setPage] = useState(1)
  const observerTarget = useRef<HTMLDivElement>(null)

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    try {
      const params = new URLSearchParams()
      const offset = page * 10

      params.set("offset", offset.toString())
      params.set("limit", "10")

      if (filters.search) params.set("search", filters.search)
      if (filters.status) params.set("status", filters.status)
      if (filters.source_type) params.set("source_type", filters.source_type)
      if (filters.country) params.set("country", filters.country)
      if (filters.language) params.set("language", filters.language)
      if (filters.date_from) params.set("date_from", filters.date_from)
      if (filters.date_to) params.set("date_to", filters.date_to)

      const response = await fetch(`/api/articles?${params.toString()}`)
      const data = await response.json()

      if (data.articles && data.articles.length > 0) {
        setArticles((prev) => [...prev, ...data.articles])
        setPage((prev) => prev + 1)
        setHasMore(data.articles.length === 10)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("[v0] Failed to load more articles:", error)
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, page, filters])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && hasMore && !isLoading) {
          loadMore()
        }
      },
      { threshold: 0.1, rootMargin: "100px" },
    )

    const currentTarget = observerTarget.current
    if (currentTarget) {
      observer.observe(currentTarget)
    }

    return () => {
      if (currentTarget) {
        observer.unobserve(currentTarget)
      }
    }
  }, [loadMore, hasMore, isLoading])

  // Reset when filters change
  useEffect(() => {
    setArticles(initialArticles)
    setPage(1)
    setHasMore(initialHasMore)
  }, [initialArticles, initialHasMore])

  if (articles.length === 0 && !isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed bg-muted/30 p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No articles found</p>
          <p className="mt-1 text-sm text-muted-foreground">Try adjusting your search or filters</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-4">
      {articles.map((article, index) => (
        <ArticleCard key={`${article.id}-${index}`} article={article} />
      ))}

      {/* Infinite scroll trigger */}
      <div ref={observerTarget} className="flex min-h-[100px] items-center justify-center">
        {isLoading && (
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Spinner className="h-5 w-5" />
            <span>Loading more articles...</span>
          </div>
        )}
        {!hasMore && articles.length > 0 && <p className="text-sm text-muted-foreground">No more articles to load</p>}
      </div>
    </div>
  )
}
