/**
 * Campaign Report Data Layer
 * 
 * Queries for public campaign reports
 */

import { cache } from "react"
import { sql } from "@/lib/db"

/**
 * Get campaign by public token
 */
export const getCampaignByToken = cache(async (token: string) => {
  try {
    const result = await sql`
      SELECT 
        c.*,
        a.title as source_article_title,
        a.slug as source_article_slug,
        a.excerpt as source_article_excerpt,
        s.id as source_site_id,
        s.name as source_site_name,
        s.custom_domain as source_custom_domain,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id) as publications_count,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'published') as successful_publications,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'failed') as failed_publications,
        (SELECT COUNT(DISTINCT cp.target_site_id) FROM campaign_publications cp WHERE cp.campaign_id = c.id AND cp.status = 'published') as active_medias,
        (SELECT COUNT(DISTINCT s.country_iso2) FROM campaign_publications cp JOIN sites s ON cp.target_site_id = s.id WHERE cp.campaign_id = c.id AND cp.status = 'published' AND s.country_iso2 IS NOT NULL) as active_countries,
        (SELECT COUNT(DISTINCT s.language) FROM campaign_publications cp JOIN sites s ON cp.target_site_id = s.id WHERE cp.campaign_id = c.id AND cp.status = 'published' AND s.language IS NOT NULL) as active_languages
      FROM campaigns c
      LEFT JOIN articles a ON c.source_article_id = a.id
      LEFT JOIN sites s ON a.site_id = s.id
      WHERE c.public_token = ${token}
      LIMIT 1
    `
    
    return result[0] || null
  } catch (error) {
    console.error("Error fetching campaign by token:", error)
    return null
  }
})

/**
 * Get campaign publications for report
 */
export const getCampaignReportPublications = cache(async (campaignId: number) => {
  try {
    const result = await sql`
      SELECT 
        cp.*,
        s.id as site_id,
        s.name as site_name,
        s.custom_domain,
        s.country_iso2,
        s.twitter_handle,
        a.id as article_id,
        a.title as article_title,
        a.slug as article_slug,
        a.featured_image_url,
        a.x_post
      FROM campaign_publications cp
      LEFT JOIN sites s ON cp.target_site_id = s.id
      LEFT JOIN articles a ON cp.generated_article_id = a.id
      WHERE cp.campaign_id = ${campaignId}
      ORDER BY cp.published_at DESC NULLS LAST, cp.created_at ASC
    `
    
    return result
  } catch (error) {
    console.error("Error fetching campaign report publications:", error)
    return []
  }
})

/**
 * Generate public token for campaign
 */
export async function generateCampaignToken(campaignId: number): Promise<string> {
  try {
    // Check if already has token
    const existing = await sql`
      SELECT public_token FROM campaigns WHERE id = ${campaignId} LIMIT 1
    `
    
    if (existing[0]?.public_token) {
      return existing[0].public_token
    }
    
    // Generate UUID v4
    const token = crypto.randomUUID()
    
    // Update campaign
    await sql`
      UPDATE campaigns
      SET public_token = ${token}, updated_at = NOW()
      WHERE id = ${campaignId}
    `
    
    return token
  } catch (error) {
    console.error("Error generating campaign token:", error)
    throw new Error("Failed to generate campaign token")
  }
}

