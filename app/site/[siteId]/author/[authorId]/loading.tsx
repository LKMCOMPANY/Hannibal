import { Skeleton } from "@/components/ui/skeleton"

export default function Loading() {
  return (
    <div className="container mx-auto max-w-7xl px-4 py-12">
      {/* Author Header Skeleton */}
      <div className="mb-12 flex flex-col items-center gap-6 text-center">
        <Skeleton className="h-32 w-32 rounded-full" />
        <div className="w-full max-w-2xl">
          <Skeleton className="mb-4 h-10 w-64 mx-auto" />
          <Skeleton className="mb-2 h-6 w-48 mx-auto" />
          <Skeleton className="mb-6 h-20 w-full" />
          <div className="flex justify-center gap-4">
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
            <Skeleton className="h-10 w-10 rounded-full" />
          </div>
        </div>
      </div>

      {/* Articles Grid Skeleton */}
      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="flex flex-col gap-4 rounded-lg border p-4">
            <Skeleton className="aspect-video w-full" />
            <Skeleton className="h-6 w-1/4" />
            <Skeleton className="h-8 w-full" />
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-4 w-1/2" />
          </div>
        ))}
      </div>
    </div>
  )
}
