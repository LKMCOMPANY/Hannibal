import { cache } from "react"
import { sql } from "@/lib/db"
import type {
  Campaign,
  CampaignPublication,
  CampaignWithRelations,
  CampaignFilters,
  CampaignCreateInput,
} from "@/lib/types/campaigns"

/**
 * Data Access Layer for Campaigns
 *
 * This module provides centralized access to campaign data with:
 * - Request deduplication via React cache()
 * - Consistent query patterns
 * - Type safety
 * - Modular architecture
 */

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Parse PostgreSQL TEXT[] array to JavaScript array
 * PostgreSQL may return arrays as strings like: {item1,item2,item3}
 * or as native JavaScript arrays depending on the driver configuration
 */
function parsePostgresArray(pgArray: string | string[] | null): string[] | null {
  if (!pgArray) {
    return null
  }

  if (Array.isArray(pgArray)) {
    return pgArray.length > 0 ? pgArray : null
  }

  // If it's a string, parse PostgreSQL array format
  if (typeof pgArray === "string") {
    const cleaned = pgArray.replace(/^\{|\}$/g, "")

    if (!cleaned) {
      return null
    }

    const result = cleaned
      .split(",")
      .map((item) => item.trim())
      .filter((item) => item.length > 0)

    return result.length > 0 ? result : null
  }

  return null
}

/**
 * Normalize campaign data to ensure campaign_images is properly parsed
 */
function normalizeCampaign<T extends { campaign_images?: string | string[] | null }>(campaign: T): T {
  return {
    ...campaign,
    campaign_images: parsePostgresArray(campaign.campaign_images as any) as any,
  }
}

// ============================================================================
// Query Functions (cached)
// ============================================================================

/**
 * Get a single campaign by ID
 */
export const getCampaignById = cache(async (id: number): Promise<Campaign | null> => {
  const result = await sql`
    SELECT * FROM campaigns WHERE id = ${id} LIMIT 1
  `

  if (result[0]) {
    return normalizeCampaign(result[0] as Campaign)
  }
  return null
})

/**
 * Get campaign with related data (source article, publications stats)
 */
export const getCampaignWithRelations = cache(async (id: number): Promise<CampaignWithRelations | null> => {
  const result = await sql`
    SELECT 
      c.*,
      a.title as source_article_title,
      a.excerpt as source_article_excerpt,
      s.name as source_site_name,
      (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id) as publications_count,
      (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'published') as successful_publications,
      (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'failed') as failed_publications
    FROM campaigns c
    LEFT JOIN articles a ON c.source_article_id = a.id
    LEFT JOIN sites s ON a.site_id = s.id
    WHERE c.id = ${id}
    LIMIT 1
  `
  if (result[0]) {
    return normalizeCampaign(result[0] as CampaignWithRelations)
  }
  return null
})

/**
 * Get all campaigns with optional filtering and relations
 */
export const getCampaigns = cache(async (filters?: CampaignFilters): Promise<CampaignWithRelations[]> => {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  if (!filters || (!filters.search && !filters.status && !filters.date_from && !filters.date_to)) {
    // No filters - get all with relations
    const result = await sql`
      SELECT 
        c.*,
        a.title as source_article_title,
        a.excerpt as source_article_excerpt,
        s.name as source_site_name,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id) as publications_count,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'published') as successful_publications,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'failed') as failed_publications
      FROM campaigns c
      LEFT JOIN articles a ON c.source_article_id = a.id
      LEFT JOIN sites s ON a.site_id = s.id
      ORDER BY c.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return result.map((campaign) => normalizeCampaign(campaign as CampaignWithRelations))
  }

  // Build filtered query
  const searchPattern = filters.search ? `%${filters.search}%` : null

  const result = await sql`
    SELECT 
      c.*,
      a.title as source_article_title,
      a.excerpt as source_article_excerpt,
      s.name as source_site_name,
      (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id) as publications_count,
      (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'published') as successful_publications,
      (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'failed') as failed_publications
    FROM campaigns c
    LEFT JOIN articles a ON c.source_article_id = a.id
    LEFT JOIN sites s ON a.site_id = s.id
    WHERE 1=1
    ${searchPattern ? sql`AND c.name ILIKE ${searchPattern}` : sql``}
    ${filters.status && filters.status !== "all" ? sql`AND c.status = ${filters.status}` : sql``}
    ${filters.date_from ? sql`AND c.created_at >= ${filters.date_from}` : sql``}
    ${filters.date_to ? sql`AND c.created_at <= ${filters.date_to}` : sql``}
    ORDER BY c.created_at DESC
    LIMIT ${limit} OFFSET ${offset}
  `
  return result.map((campaign) => normalizeCampaign(campaign as CampaignWithRelations))
})

/**
 * Get campaign publications by campaign ID
 */
export const getCampaignPublications = cache(async (campaignId: number): Promise<CampaignPublication[]> => {
  const result = await sql`
    SELECT DISTINCT ON (cp.id)
      cp.*,
      s.id as target_site_id,
      s.name as target_site_name,
      s.custom_domain as target_site_domain,
      s.custom_domain as target_site_custom_domain,
      a.id as generated_article_id,
      a.title as generated_article_title,
      a.excerpt as generated_article_excerpt,
      a.category as generated_article_category,
      a.status as generated_article_status,
      a.slug as generated_article_slug,
      a.featured_image_url as generated_article_image,
      a.featured_image_alt as generated_article_image_alt,
      s.language as generated_article_language
    FROM campaign_publications cp
    LEFT JOIN sites s ON cp.target_site_id = s.id
    LEFT JOIN articles a ON cp.generated_article_id = a.id
    WHERE cp.campaign_id = ${campaignId}
    ORDER BY cp.id, cp.created_at DESC
  `
  return result as any[]
})

/**
 * Get campaigns by status
 */
export const getCampaignsByStatus = cache(async (status: string): Promise<Campaign[]> => {
  const result = await sql`
    SELECT * FROM campaigns 
    WHERE status = ${status}
    ORDER BY created_at DESC
  `
  return result.map((campaign) => normalizeCampaign(campaign as Campaign))
})

/**
 * Get total count of campaigns
 */
export const getCampaignsCount = cache(async (filters?: CampaignFilters): Promise<number> => {
  if (!filters || (!filters.search && !filters.status && !filters.date_from && !filters.date_to)) {
    const result = await sql`
      SELECT COUNT(*) as count FROM campaigns
    `
    return Number(result[0]?.count || 0)
  }

  const searchPattern = filters.search ? `%${filters.search}%` : null

  const result = await sql`
    SELECT COUNT(*) as count 
    FROM campaigns c
    WHERE 1=1
    ${searchPattern ? sql`AND c.name ILIKE ${searchPattern}` : sql``}
    ${filters.status && filters.status !== "all" ? sql`AND c.status = ${filters.status}` : sql``}
    ${filters.date_from ? sql`AND c.created_at >= ${filters.date_from}` : sql``}
    ${filters.date_to ? sql`AND c.created_at <= ${filters.date_to}` : sql``}
  `
  return Number(result[0]?.count || 0)
})

// ============================================================================
// Mutation Functions (not cached)
// ============================================================================

/**
 * Create a new campaign
 */
export async function createCampaign(data: CampaignCreateInput): Promise<Campaign> {
  const result = await sql`
    INSERT INTO campaigns (
      name, 
      source_article_id, 
      custom_instructions,
      campaign_images,
      deployment_speed_minutes,
      status
    )
    VALUES (
      ${data.name}, 
      ${data.source_article_id}, 
      ${data.custom_instructions || null},
      ${data.campaign_images || null},
      ${data.deployment_speed_minutes || 60},
      'pending'
    )
    RETURNING *
  `

  const campaign = result[0] as Campaign

  // Create campaign publications for each target site
  if (data.target_site_ids && data.target_site_ids.length > 0) {
    for (const siteId of data.target_site_ids) {
      await sql`
        INSERT INTO campaign_publications (
          campaign_id,
          target_site_id,
          status
        )
        VALUES (
          ${campaign.id},
          ${siteId},
          'pending'
        )
      `
    }
  }

  return campaign
}

/**
 * Update campaign status
 */
export async function updateCampaignStatus(id: number, status: string, completedAt?: string): Promise<Campaign | null> {
  const result = await sql`
    UPDATE campaigns 
    SET 
      status = ${status},
      completed_at = ${completedAt || null},
      updated_at = NOW()
    WHERE id = ${id}
    RETURNING *
  `
  if (result[0]) {
    return normalizeCampaign(result[0] as Campaign)
  }
  return null
}

/**
 * Update campaign
 */
export async function updateCampaign(id: number, data: Partial<Campaign>): Promise<Campaign | null> {
  if (Object.keys(data).length === 0) {
    return getCampaignById(id)
  }

  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  Object.entries(data).forEach(([key, value]) => {
    if (key !== "id" && key !== "created_at") {
      updates.push(`${key} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }
  })

  updates.push(`updated_at = NOW()`)

  const query = `
    UPDATE campaigns 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `
  values.push(id)

  const result = await sql.query(query, values)
  if (result[0]) {
    return normalizeCampaign(result[0] as Campaign)
  }
  return null
}

/**
 * Delete a campaign by ID
 */
export async function deleteCampaign(id: number): Promise<boolean> {
  // Delete related records first
  await sql`DELETE FROM campaign_publications WHERE campaign_id = ${id}`

  const result = await sql`
    DELETE FROM campaigns WHERE id = ${id} RETURNING id
  `
  return result.length > 0
}

/**
 * Delete a campaign and all its generated articles in cascade
 * This will:
 * 1. Fetch all campaign publications with generated article IDs
 * 2. Delete each generated article
 * 3. Delete all campaign publications
 * 4. Delete the campaign
 */
export async function deleteCampaignWithArticles(id: number): Promise<{ success: boolean; deletedArticles: number }> {
  try {
    // Fetch all campaign publications with generated article IDs
    const publications = await sql`
      SELECT id, generated_article_id
      FROM campaign_publications
      WHERE campaign_id = ${id} AND generated_article_id IS NOT NULL
    `

    let deletedArticles = 0

    // Delete each generated article
    for (const pub of publications) {
      if (pub.generated_article_id) {
        try {
          await sql`DELETE FROM articles WHERE id = ${pub.generated_article_id}`
          deletedArticles++
        } catch (error) {
          console.error(`[v0] Failed to delete article ${pub.generated_article_id}:`, error)
          // Continue with other deletions even if one fails
        }
      }
    }

    // Delete all campaign publications
    await sql`DELETE FROM campaign_publications WHERE campaign_id = ${id}`

    // Delete the campaign
    const result = await sql`DELETE FROM campaigns WHERE id = ${id} RETURNING id`

    return {
      success: result.length > 0,
      deletedArticles,
    }
  } catch (error) {
    console.error("[v0] Error deleting campaign with articles:", error)
    throw error
  }
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get unique campaign statuses
 */
export const getUniqueCampaignStatuses = cache(async (): Promise<string[]> => {
  const result = await sql`
    SELECT DISTINCT status 
    FROM campaigns 
    WHERE status IS NOT NULL 
    ORDER BY status ASC
  `
  return result.map((row: any) => row.status)
})
