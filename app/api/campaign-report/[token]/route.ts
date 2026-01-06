import { type NextRequest, NextResponse } from "next/server"
import { getCampaignByToken, getCampaignReportPublications } from "@/lib/data/campaign-report"

/**
 * Campaign Report API endpoint
 * 
 * Fetches campaign data by public token for client-side rendering
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ token: string }> }
) {
  try {
    const { token } = await params

    const [campaign, publications] = await Promise.all([
      getCampaignByToken(token),
      getCampaignByToken(token).then(c => c ? getCampaignReportPublications(c.id) : []),
    ])

    if (!campaign) {
      return NextResponse.json(
        { error: "Campaign not found" },
        { status: 404 }
      )
    }

    return NextResponse.json({
      campaign,
      publications,
      timestamp: new Date().toISOString(),
    })
  } catch (error) {
    console.error("Error fetching campaign report:", error)
    return NextResponse.json(
      { error: "Failed to fetch campaign report" },
      { status: 500 }
    )
  }
}

