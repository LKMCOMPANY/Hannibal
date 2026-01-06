import { Skeleton } from "@/components/ui/skeleton"
import { CampaignListSkeleton } from "@/components/campaigns/campaign-list-skeleton"

export default function CampaignsLoading() {
  return (
    <div className="flex flex-col gap-6">
      {/* Header skeleton */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <Skeleton className="h-9 w-48" />
          <Skeleton className="h-5 w-80" />
        </div>
        <Skeleton className="h-10 w-40" />
      </div>

      {/* Search & Filters skeleton */}
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
      <CampaignListSkeleton />
    </div>
  )
}
