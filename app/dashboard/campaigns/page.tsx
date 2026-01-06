import { Suspense } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { CampaignSearch } from "@/components/campaigns/campaign-search"
import { CampaignList } from "@/components/campaigns/campaign-list"
import { CampaignListSkeleton } from "@/components/campaigns/campaign-list-skeleton"
import { getCampaigns, getUniqueCampaignStatuses } from "@/lib/data/campaigns"
import type { CampaignFilters } from "@/lib/types/campaigns"
import Link from "next/link"

type PageProps = {
  searchParams: Promise<{
    search?: string
    status?: string
    date_from?: string
    date_to?: string
  }>
}

export default async function CampaignsPage({ searchParams }: PageProps) {
  const params = await searchParams

  const filters: CampaignFilters = {
    search: params.search,
    status: params.status,
    date_from: params.date_from,
    date_to: params.date_to,
  }

  const [campaigns, statuses] = await Promise.all([getCampaigns(filters), getUniqueCampaignStatuses()])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="space-y-1">
          <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight">Campaigns</h1>
          <p className="text-pretty text-sm text-muted-foreground">
            Manage and monitor your content distribution campaigns
          </p>
        </div>
        <Button asChild className="w-fit">
          <Link href="/dashboard/campaigns/create">
            <Plus className="h-4 w-4" aria-hidden="true" />
            Create Campaign
          </Link>
        </Button>
      </div>

      {/* Search & Filters */}
      <CampaignSearch statuses={statuses} />

      {/* Campaigns List */}
      <Suspense fallback={<CampaignListSkeleton />}>
        <CampaignList campaigns={campaigns} />
      </Suspense>
    </div>
  )
}
