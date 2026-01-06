import { Suspense } from "react"
import { CampaignCreateForm } from "@/components/campaigns/campaign-create-form"
import { CampaignCreateFormSkeleton } from "@/components/campaigns/campaign-create-form-skeleton"
import { getArticles } from "@/lib/data/articles"
import { getSites } from "@/lib/data/sites"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"

// Disable cache for this page (always fetch fresh data)
export const revalidate = 0

export default async function CreateCampaignPage() {
  const [articles, sites] = await Promise.all([
    getArticles({
      source_type: "manual",
      limit: 10,
      offset: 0,
    }),
    getSites(),
  ])

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center gap-4">
        <Link href="/dashboard/campaigns">
          <Button variant="ghost" size="sm" className="gap-2">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back
          </Button>
        </Link>
      </div>

      <div className="space-y-1">
        <h1 className="text-balance text-3xl font-bold leading-tight tracking-tight">Create Campaign</h1>
        <p className="text-sm text-muted-foreground">Launch a new distribution campaign</p>
      </div>

      <Suspense fallback={<CampaignCreateFormSkeleton />}>
        <CampaignCreateForm articles={articles} sites={sites} />
      </Suspense>
    </div>
  )
}
