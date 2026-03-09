"use server"

import { generateCampaignToken } from "@/lib/data/campaign-report"

type ActionResult<T = string> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Generate public report URL for campaign
 */
export async function generateCampaignReportAction(campaignId: number): Promise<ActionResult> {
  try {
    const token = await generateCampaignToken(campaignId)
    
    const hostname = process.env.NEXT_PUBLIC_ADMIN_HOSTNAME ||
                     process.env.VERCEL_URL ||
                     "localhost:3000"

    const baseUrl = hostname.startsWith('http')
      ? hostname
      : `https://${hostname}`
    
    const reportUrl = `${baseUrl}/report/${token}`
    
    return {
      success: true,
      data: reportUrl,
    }
  } catch (error) {
    console.error("Error generating campaign report:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate report",
    }
  }
}

