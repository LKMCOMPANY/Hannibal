import { Suspense } from "react"
import { XPublicationList } from "@/components/x-publisher/x-publication-list"
import { getXPublications } from "@/lib/data/x-publications"
import type { XPublicationFilters } from "@/lib/types/x-publications"
import XPublisherLoading from "./loading"

// X Logo Component
function XLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={className} fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  )
}

type PageProps = {
  searchParams: Promise<{
    search?: string
    status?: string
    site_id?: string
    date_from?: string
    date_to?: string
  }>
}

async function XPublisherContent({ searchParams }: { searchParams: Awaited<PageProps["searchParams"]> }) {
  const filters: XPublicationFilters = {
    search: searchParams.search,
    status: searchParams.status as any,
    site_id: searchParams.site_id ? parseInt(searchParams.site_id) : undefined,
    date_from: searchParams.date_from,
    date_to: searchParams.date_to,
    limit: 10,
    offset: 0,
  }

  const publications = await getXPublications(filters)
  const hasMore = publications.length === 10

  return (
    <XPublicationList initialPublications={publications} filters={filters} hasMore={hasMore} />
  )
}

export default async function XPublisherPage({ searchParams }: PageProps) {
  const params = await searchParams

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-foreground">
          <XLogo className="h-6 w-6 text-background" aria-hidden="true" />
        </div>
        <div className="space-y-1">
          <h1 className="text-balance text-3xl font-bold tracking-tight">X Publisher</h1>
          <p className="text-pretty text-sm text-muted-foreground">
            Manage and monitor scheduled tweets for published articles
          </p>
        </div>
      </div>

      {/* Content */}
      <Suspense fallback={<XPublisherLoading />}>
        <XPublisherContent searchParams={params} />
      </Suspense>
    </div>
  )
}
