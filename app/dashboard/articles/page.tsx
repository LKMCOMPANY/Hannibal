import { Suspense } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ArticleSearch } from "@/components/articles/article-search"
import { ArticleListInfinite } from "@/components/articles/article-list-infinite"
import { ArticleListSkeleton } from "@/components/articles/article-list-skeleton"
import { getArticles, getUniqueStatuses, getUniqueSourceTypes } from "@/lib/data/articles"
import { getUniqueCountries } from "@/lib/data/sites"
import type { ArticleFilters } from "@/lib/types/articles"

type PageProps = {
  searchParams: Promise<{
    search?: string
    status?: string
    source_type?: string
    country?: string
    language?: string
    date_from?: string
    date_to?: string
  }>
}

export default async function ArticlesPage({ searchParams }: PageProps) {
  const params = await searchParams

  const filters: ArticleFilters = {
    search: params.search,
    status: params.status,
    source_type: params.source_type,
    country: params.country,
    language: params.language,
    date_from: params.date_from,
    date_to: params.date_to,
    limit: 10,
    offset: 0,
  }

  const [articles, statuses, sourceTypes, countries] = await Promise.all([
    getArticles(filters),
    getUniqueStatuses(),
    getUniqueSourceTypes(),
    getUniqueCountries(),
  ])

  // Get unique languages from articles
  const languages = Array.from(new Set(articles.map((a) => a.site_language).filter(Boolean))) as string[]

  const hasMore = articles.length === 10

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="typography-h1 text-balance">Articles</h1>
          <p className="typography-muted text-pretty">Manage and view all published articles</p>
        </div>
        <Button asChild className="w-fit">
          <a href="/dashboard/publish">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Article
          </a>
        </Button>
      </div>

      {/* Search & Filters */}
      <ArticleSearch statuses={statuses} sourceTypes={sourceTypes} countries={countries} languages={languages} />

      {/* Articles List with Infinite Scroll */}
      <Suspense fallback={<ArticleListSkeleton />}>
        <ArticleListInfinite initialArticles={articles} filters={filters} hasMore={hasMore} />
      </Suspense>
    </div>
  )
}
