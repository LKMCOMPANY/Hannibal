/**
 * X Publications Data Layer
 * 
 * Handles data operations for X/Twitter publications
 * Following CQRS pattern: read operations are cached, mutations are not
 */

import { cache } from "react"
import { sql } from "@/lib/db"
import type { XPublication, XPublicationWithRelations, XPublicationFilters, XPublicationCreateInput } from "@/lib/types/x-publications"

// ============================================================================
// Query Functions (cached for request deduplication)
// ============================================================================

/**
 * Get X publication by ID
 */
export const getXPublicationById = cache(async (id: number): Promise<XPublication | null> => {
  try {
    const result = await sql`
      SELECT * FROM x_publications WHERE id = ${id} LIMIT 1
    `
    return result[0] as XPublication | null
  } catch (error) {
    console.error("Error fetching X publication:", error)
    return null
  }
})

/**
 * Get X publication by article ID
 */
export const getXPublicationByArticleId = cache(async (articleId: number): Promise<XPublication | null> => {
  try {
    const result = await sql`
      SELECT * FROM x_publications WHERE article_id = ${articleId} LIMIT 1
    `
    return result[0] as XPublication | null
  } catch (error) {
    console.error("Error fetching X publication by article:", error)
    return null
  }
})

/**
 * Get X publications with filters and relations
 */
export const getXPublications = cache(
  async (filters?: XPublicationFilters): Promise<XPublicationWithRelations[]> => {
    const limit = filters?.limit || 10
    const offset = filters?.offset || 0

    try {
      if (!filters || (!filters.search && !filters.status && !filters.site_id && !filters.date_from && !filters.date_to)) {
        // No filters - get all with relations
        const result = await sql`
          SELECT 
            xp.*,
            a.title as article_title,
            a.slug as article_slug,
            a.featured_image_url as article_featured_image,
            s.name as site_name,
            s.twitter_handle as site_twitter_handle,
            s.custom_domain as site_custom_domain
          FROM x_publications xp
          LEFT JOIN articles a ON xp.article_id = a.id
          LEFT JOIN sites s ON xp.site_id = s.id
          ORDER BY xp.scheduled_for DESC
          LIMIT ${limit} OFFSET ${offset}
        `
        return result as XPublicationWithRelations[]
      }

      // Build filtered query
      const searchPattern = filters.search ? `%${filters.search}%` : null

      const result = await sql`
        SELECT 
          xp.*,
          a.title as article_title,
          a.slug as article_slug,
          a.featured_image_url as article_featured_image,
          s.name as site_name,
          s.twitter_handle as site_twitter_handle,
          s.custom_domain as site_custom_domain
        FROM x_publications xp
        LEFT JOIN articles a ON xp.article_id = a.id
        LEFT JOIN sites s ON xp.site_id = s.id
        WHERE 1=1
        ${searchPattern ? sql`AND (a.title ILIKE ${searchPattern} OR xp.x_post_text ILIKE ${searchPattern})` : sql``}
        ${filters.status ? sql`AND xp.status = ${filters.status}` : sql``}
        ${filters.site_id ? sql`AND xp.site_id = ${filters.site_id}` : sql``}
        ${filters.date_from ? sql`AND xp.scheduled_for >= ${filters.date_from}` : sql``}
        ${filters.date_to ? sql`AND xp.scheduled_for <= ${filters.date_to}` : sql``}
        ORDER BY xp.scheduled_for DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      return result as XPublicationWithRelations[]
    } catch (error) {
      console.error("Error fetching X publications:", error)
      return []
    }
  }
)

/**
 * Get X publications count
 */
export const getXPublicationsCount = cache(async (filters?: XPublicationFilters): Promise<number> => {
  try {
    if (!filters || (!filters.search && !filters.status && !filters.site_id && !filters.date_from && !filters.date_to)) {
      const result = await sql`
        SELECT COUNT(*) as count FROM x_publications
      `
      return Number(result[0]?.count || 0)
    }

    const searchPattern = filters.search ? `%${filters.search}%` : null

    const result = await sql`
      SELECT COUNT(*) as count 
      FROM x_publications xp
      LEFT JOIN articles a ON xp.article_id = a.id
      WHERE 1=1
      ${searchPattern ? sql`AND (a.title ILIKE ${searchPattern} OR xp.x_post_text ILIKE ${searchPattern})` : sql``}
      ${filters.status ? sql`AND xp.status = ${filters.status}` : sql``}
      ${filters.site_id ? sql`AND xp.site_id = ${filters.site_id}` : sql``}
      ${filters.date_from ? sql`AND xp.scheduled_for >= ${filters.date_from}` : sql``}
      ${filters.date_to ? sql`AND xp.scheduled_for <= ${filters.date_to}` : sql``}
    `
    return Number(result[0]?.count || 0)
  } catch (error) {
    console.error("Error counting X publications:", error)
    return 0
  }
})

/**
 * Get X publication statistics
 */
export const getXPublicationStats = cache(async (): Promise<{
  total: number
  pending: number
  posted: number
  failed: number
  paused: number
  cancelled: number
}> => {
  try {
    const result = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'pending') as pending,
        COUNT(*) FILTER (WHERE status = 'posted') as posted,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'paused') as paused,
        COUNT(*) FILTER (WHERE status = 'cancelled') as cancelled
      FROM x_publications
    `

    const stats = result[0]
    return {
      total: Number(stats.total) || 0,
      pending: Number(stats.pending) || 0,
      posted: Number(stats.posted) || 0,
      failed: Number(stats.failed) || 0,
      paused: Number(stats.paused) || 0,
      cancelled: Number(stats.cancelled) || 0,
    }
  } catch (error) {
    console.error("Error fetching X publication stats:", error)
    return { total: 0, pending: 0, posted: 0, failed: 0, paused: 0, cancelled: 0 }
  }
})

// ============================================================================
// Mutation Functions (not cached)
// ============================================================================

/**
 * Create a new X publication
 */
export async function createXPublication(input: XPublicationCreateInput): Promise<XPublication> {
  try {
    const result = await sql`
      INSERT INTO x_publications (
        article_id,
        site_id,
        x_post_text,
        article_url,
        scheduled_for,
        status
      ) VALUES (
        ${input.article_id},
        ${input.site_id},
        ${input.x_post_text},
        ${input.article_url},
        ${input.scheduled_for},
        'pending'
      )
      RETURNING *
    `
    return result[0] as XPublication
  } catch (error) {
    console.error("Error creating X publication:", error)
    throw new Error("Failed to create X publication")
  }
}

/**
 * Update X publication status
 */
export async function updateXPublicationStatus(
  id: number,
  status: string,
  twitterPostId?: string,
  twitterPostUrl?: string,
  errorMessage?: string
): Promise<void> {
  try {
    await sql`
      UPDATE x_publications
      SET 
        status = ${status},
        twitter_post_id = ${twitterPostId || null},
        twitter_post_url = ${twitterPostUrl || null},
        error_message = ${errorMessage || null},
        posted_at = ${status === 'posted' ? new Date().toISOString() : null},
        updated_at = NOW()
      WHERE id = ${id}
    `
  } catch (error) {
    console.error("Error updating X publication status:", error)
    throw error
  }
}

/**
 * Pause an X publication
 */
export async function pauseXPublication(id: number): Promise<void> {
  try {
    await sql`
      UPDATE x_publications
      SET status = 'paused', updated_at = NOW()
      WHERE id = ${id} AND status = 'pending'
    `
  } catch (error) {
    console.error("Error pausing X publication:", error)
    throw new Error("Failed to pause X publication")
  }
}

/**
 * Resume a paused X publication
 */
export async function resumeXPublication(id: number): Promise<void> {
  try {
    await sql`
      UPDATE x_publications
      SET status = 'pending', updated_at = NOW()
      WHERE id = ${id} AND status = 'paused'
    `
  } catch (error) {
    console.error("Error resuming X publication:", error)
    throw new Error("Failed to resume X publication")
  }
}

/**
 * Cancel an X publication
 */
export async function cancelXPublication(id: number): Promise<void> {
  try {
    await sql`
      UPDATE x_publications
      SET status = 'cancelled', updated_at = NOW()
      WHERE id = ${id} AND status IN ('pending', 'paused', 'failed')
    `
  } catch (error) {
    console.error("Error cancelling X publication:", error)
    throw new Error("Failed to cancel X publication")
  }
}

