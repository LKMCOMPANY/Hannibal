import { Card, CardContent } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export function MediaListSkeleton() {
  return (
    <div className="space-y-4">
      {[...Array(6)].map((_, i) => (
        <Card key={i} className="group transition-colors hover:border-border/80">
          <CardContent className="p-6">
            <div className="flex gap-6">
              {/* Logo skeleton */}
              <Skeleton className="h-20 w-20 shrink-0 rounded-lg" />

              <div className="flex-1 min-w-0 space-y-4">
                {/* Header with name and status */}
                <div className="flex items-start justify-between gap-4">
                  <div className="space-y-2 flex-1">
                    <Skeleton className="h-6 w-48" />
                    <Skeleton className="h-4 w-64" />
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full" />
                </div>

                {/* Description */}
                <Skeleton className="h-4 w-full" />
                <Skeleton className="h-4 w-3/4" />

                {/* Metadata badges */}
                <div className="flex flex-wrap items-center gap-2">
                  <Skeleton className="h-5 w-20" />
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-24" />
                  <Skeleton className="h-5 w-28" />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
