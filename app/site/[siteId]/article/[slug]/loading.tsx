import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <article className="container mx-auto max-w-4xl px-4 py-12">
      {/* Article Header Skeleton */}
      <header className="mb-12">
        <Skeleton className="mb-4 h-6 w-32" />
        <Skeleton className="mb-6 h-12 w-full" />
        <div className="mb-8 flex items-center gap-4">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1">
            <Skeleton className="mb-2 h-4 w-32" />
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        <Skeleton className="aspect-video w-full" />
      </header>

      {/* Article Content Skeleton */}
      <div className="prose prose-lg mx-auto max-w-none">
        <Skeleton className="mb-4 h-6 w-full" />
        <Skeleton className="mb-4 h-6 w-full" />
        <Skeleton className="mb-4 h-6 w-3/4" />
        <Skeleton className="mb-8 h-6 w-full" />

        <Skeleton className="mb-4 h-6 w-full" />
        <Skeleton className="mb-4 h-6 w-full" />
        <Skeleton className="mb-8 h-6 w-2/3" />

        <Skeleton className="mb-8 aspect-video w-full" />

        <Skeleton className="mb-4 h-6 w-full" />
        <Skeleton className="mb-4 h-6 w-full" />
        <Skeleton className="mb-4 h-6 w-4/5" />
      </div>
    </article>
  )
}
