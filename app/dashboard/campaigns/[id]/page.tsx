import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import Link from "next/link"
import { CampaignDetailClient } from "@/components/campaigns/campaign-detail-client"

type PageProps = {
  params: Promise<{ id: string }>
}

export default async function CampaignDetailPage({ params }: PageProps) {
  const { id } = await params
  const campaignId = Number.parseInt(id)

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

      <CampaignDetailClient campaignId={campaignId} />
    </div>
  )
}
