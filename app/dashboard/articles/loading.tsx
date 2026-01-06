import { Skeleton } from "@/components/ui/skeleton"
import { ArticleListSkeleton } from "@/components/articles/article-list-skeleton"

export default function ArticlesLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex items-center justify-between">
        <div>
          <Skeleton className="h-9 w-48" />
          <Skeleton className="mt-2 h-4 w-64" />
        </div>
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Search skeleton */}
      <div className="rounded-lg border border-border bg-card p-6">
        <Skeleton className="h-10 w-full" />
        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
          <Skeleton className="h-10 w-full" />
        </div>
      </div>

      {/* List skeleton */}
      <ArticleListSkeleton />
    </div>
  )
}
