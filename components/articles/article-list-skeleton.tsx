import { Skeleton } from "@/components/ui/skeleton"
import { Card, CardContent } from "@/components/ui/card"

export function ArticleListSkeleton() {
  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {Array.from({ length: 6 }).map((_, i) => (
        <div 
          key={i} 
          className="flex flex-col overflow-hidden"
          style={{
            borderRadius: "var(--theme-radius-card)",
            border: "1px solid var(--theme-current-border)",
            backgroundColor: "var(--theme-current-surface)",
          }}
        >
          <div className="relative aspect-[4/3] sm:aspect-video overflow-hidden">
            <Skeleton className="h-full w-full rounded-none" />
          </div>
          
          <div className="flex flex-1 flex-col gap-3.5 p-4 sm:p-5">
            <div className="flex items-center justify-between">
              <Skeleton className="h-5 w-20 rounded-full" />
              <Skeleton className="h-3 w-16" />
            </div>

            <div className="space-y-2">
              <Skeleton className="h-6 w-full" />
              <Skeleton className="h-6 w-2/3" />
            </div>

            <div className="space-y-1.5">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-1/2" />
            </div>

            <div className="mt-auto flex items-center justify-between border-t pt-3" style={{ borderColor: "var(--theme-current-border)" }}>
              <div className="flex items-center gap-2">
                <Skeleton className="h-7 w-7 rounded-full" />
                <Skeleton className="h-4 w-24" />
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-3 w-16" />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}
