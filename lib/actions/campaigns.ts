"use server"

import { revalidatePath } from "next/cache"
import {
  createCampaign,
  updateCampaign,
  deleteCampaign,
  deleteCampaignWithArticles,
  type CampaignCreateInput,
} from "@/lib/data/campaigns"
import { enqueueCampaignPublications } from "@/lib/queue/qstash"
import type { CampaignPublicationJob } from "@/lib/queue/qstash"
import { sql } from "@/lib/db"

/**
 * Server action to create a new campaign
 */
export async function createCampaignAction(
  data: CampaignCreateInput,
): Promise<{ success: boolean; campaignId?: number; error?: string }> {
  try {
    if (!data.name || data.name.trim().length === 0) {
      return {
        success: false,
        error: "Campaign name is required",
      }
    }

    if (!data.source_article_id) {
      return {
        success: false,
        error: "Source article is required",
      }
    }

    if (!data.target_site_ids || data.target_site_ids.length === 0) {
      return {
        success: false,
        error: "At least one target media site is required",
      }
    }

    const campaign = await createCampaign(data)

    const publications = await sql`
      SELECT id, target_site_id
      FROM campaign_publications
      WHERE campaign_id = ${campaign.id}
      ORDER BY id ASC
    `

    const jobs: CampaignPublicationJob[] = publications.map((pub: any) => ({
      campaignId: campaign.id,
      publicationId: pub.id,
      sourceArticleId: data.source_article_id,
      targetSiteId: pub.target_site_id,
      customInstructions: data.custom_instructions,
    }))

    const deploymentSpeedMinutes = data.deployment_speed_minutes || 60
    await enqueueCampaignPublications(jobs, deploymentSpeedMinutes)

    await sql`
      UPDATE campaigns
      SET status = 'processing', updated_at = NOW()
      WHERE id = ${campaign.id}
    `

    // Revalidate campaign pages
    revalidatePath("/dashboard/campaigns")

    return { success: true, campaignId: campaign.id }
  } catch (error) {
    void error
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create campaign",
    }
  }
}

/**
 * Server action to update a campaign
 */
export async function updateCampaignAction(
  id: number,
  data: Partial<any>,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateCampaign(id, data)

    // Revalidate campaign pages
    revalidatePath("/dashboard/campaigns")
    revalidatePath(`/dashboard/campaigns/${id}`)

    return { success: true }
  } catch (error) {
    void error
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update campaign",
    }
  }
}

/**
 * Server action to delete a campaign
 */
export async function deleteCampaignAction(id: number): Promise<{ success: boolean; error?: string }> {
  try {
    await deleteCampaign(id)

    // Revalidate campaign pages
    revalidatePath("/dashboard/campaigns")

    return { success: true }
  } catch (error) {
    void error
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete campaign",
    }
  }
}

/**
 * Server action to delete a campaign and all its generated articles in cascade
 * This will stop the campaign and delete all published articles
 */
export async function deleteCampaignWithArticlesAction(
  id: number,
): Promise<{ success: boolean; deletedArticles?: number; error?: string }> {
  try {
    const result = await deleteCampaignWithArticles(id)

    if (!result.success) {
      return {
        success: false,
        error: "Failed to delete campaign",
      }
    }

    // Revalidate campaign pages
    revalidatePath("/dashboard/campaigns")
    revalidatePath(`/dashboard/campaigns/${id}`)

    return {
      success: true,
      deletedArticles: result.deletedArticles,
    }
  } catch (error) {
    void error
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete campaign and articles",
    }
  }
}
