import { type NextRequest, NextResponse } from "next/server"
import { getCampaignWithRelations, getCampaignPublications } from "@/lib/data/campaigns"

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params
    const campaignId = Number.parseInt(id)

    if (Number.isNaN(campaignId)) {
      return NextResponse.json({ error: "Invalid campaign ID" }, { status: 400 })
    }

    const [campaign, publications] = await Promise.all([
      getCampaignWithRelations(campaignId),
      getCampaignPublications(campaignId),
    ])

    if (!campaign) {
      return NextResponse.json({ error: "Campaign not found" }, { status: 404 })
    }

    return NextResponse.json({
      campaign,
      publications,
    })
  } catch (error) {
    console.error("[v0] Error fetching campaign status:", error)
    return NextResponse.json({ error: "Failed to fetch campaign status" }, { status: 500 })
  }
}
