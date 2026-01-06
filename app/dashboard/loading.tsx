import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Skeleton } from "@/components/ui/skeleton"

export default function DashboardLoading() {
  return (
    <div className="w-full space-y-4 pb-6 sm:space-y-5 md:space-y-6 md:pb-8">
      {/* Header Skeleton */}
      <div className="space-y-1.5">
        <Skeleton className="h-8 w-40 sm:h-9 sm:w-48 lg:h-10 lg:w-56" />
        <Skeleton className="h-4 w-56 sm:h-5 sm:w-72 lg:w-96" />
      </div>

      {/* Time Range Selector Skeleton */}
      <div className="flex w-full items-center gap-2">
        <Skeleton className="hidden h-4 w-4 sm:block" />
        <Skeleton className="hidden h-4 w-12 sm:block" />
        <Skeleton className="h-9 flex-1" />
      </div>

      {/* Breaking News Banner Skeleton */}
      <Card className="w-full overflow-hidden border-orange-500/20 bg-gradient-to-r from-orange-500/5 to-transparent">
        <div className="flex items-center gap-2.5 p-3 sm:gap-3 sm:p-4">
          <Skeleton className="h-7 w-7 shrink-0 rounded-full sm:h-8 sm:w-8" />
          <Skeleton className="hidden h-6 w-12 sm:block" />
          <div className="min-w-0 flex-1 space-y-1">
            <Skeleton className="h-4 w-full sm:h-5" />
            <Skeleton className="h-3 w-32 sm:w-48" />
          </div>
        </div>
      </Card>

      {/* Stats Cards Skeleton */}
      <div className="grid w-full grid-cols-2 gap-3 sm:gap-4 md:grid-cols-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <Card key={i} className="overflow-hidden">
            <CardContent className="p-3 sm:p-4">
              <div className="flex items-center gap-2.5 sm:gap-3">
                <Skeleton className="h-8 w-8 shrink-0 rounded-lg sm:h-10 sm:w-10" />
                <div className="min-w-0 flex-1 space-y-1.5">
                  <Skeleton className="h-3 w-14 sm:w-16" />
                  <Skeleton className="h-6 w-10 sm:h-7 sm:w-14 lg:h-8 lg:w-16" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Graph Skeleton */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="border-b p-3 sm:p-4 md:p-6">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between sm:gap-4">
            <div className="space-y-1">
              <Skeleton className="h-5 w-40 sm:h-6 sm:w-48 lg:h-7 lg:w-56" />
              <Skeleton className="h-3 w-24 sm:h-4 sm:w-32" />
            </div>
            <div className="flex gap-3 sm:gap-4">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-4 w-14" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0 px-1 pt-4 sm:px-2 sm:pt-6 md:px-6">
          <Skeleton className="h-[200px] w-full sm:h-[280px] lg:h-[320px]" />
        </CardContent>
      </Card>

      {/* Map Skeleton */}
      <Card className="w-full overflow-hidden">
        <CardHeader className="border-b p-3 sm:p-4 md:p-6">
          <div className="flex items-center justify-between">
            <Skeleton className="h-5 w-44 sm:h-6 sm:w-52 lg:h-7 lg:w-64" />
            <Skeleton className="h-8 w-24 sm:h-9 sm:w-28" />
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <Skeleton className="h-[300px] w-full rounded-b-lg sm:h-[400px] lg:h-[500px]" />
        </CardContent>
      </Card>

      {/* Widgets Skeleton */}
      <div className="grid w-full gap-4 sm:gap-5 md:gap-6 lg:grid-cols-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <Card key={i} className="flex h-full w-full flex-col">
            <CardHeader className="border-b p-3 sm:p-4 md:p-6">
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-32 sm:h-6 sm:w-40" />
                <Skeleton className="h-8 w-16 sm:h-9 sm:w-20" />
              </div>
            </CardHeader>
            <CardContent className="flex-1 p-3 sm:p-4">
              <div className="space-y-2.5 sm:space-y-3">
                {Array.from({ length: 3 }).map((_, j) => (
                  <div key={j} className="space-y-2 rounded-lg border p-3">
                    <div className="flex items-start justify-between gap-2">
                      <div className="min-w-0 flex-1 space-y-1.5">
                        <Skeleton className="h-4 w-full max-w-[200px]" />
                        <Skeleton className="h-3 w-full max-w-[160px]" />
                      </div>
                      <Skeleton className="h-5 w-12 shrink-0" />
                    </div>
                    <Skeleton className="h-3 w-full max-w-[140px]" />
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
