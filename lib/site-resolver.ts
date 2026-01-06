import { cache } from "react"
import { sql } from "@/lib/db"
import type { Site, SitePublicData, ArticleCategory } from "@/lib/types/sites"

/**
 * Site Resolver Utilities (Public Pages)
 *
 * Centralized functions for resolving and fetching site data
 * in public-facing pages of the multi-tenant architecture.
 *
 * For admin/dashboard operations, use lib/data/sites.ts instead.
 *
 * All functions are cached to prevent duplicate queries within
 * a single request lifecycle.
 */

// ============================================================================
// Types
// ============================================================================

// Types are now imported from "@/lib/types/sites"

// ============================================================================
// Site Resolution Functions
// ============================================================================

/**
 * Get site by ID (full data)
 *
 * Note: For admin dashboard, use getSiteById() from lib/data/sites.ts
 * This function is optimized for public page rendering.
 */
export const getSiteById = cache(async (siteId: number): Promise<Site | null> => {
  const result = await sql`
    SELECT * FROM sites WHERE id = ${siteId} LIMIT 1
  `
  return result[0] as Site | null
})

/**
 * Get site by custom domain
 */
export const getSiteByDomain = cache(async (domain: string): Promise<Site | null> => {
  const result = await sql`
    SELECT * FROM sites 
    WHERE custom_domain = ${domain}
    AND status = 'active'
    LIMIT 1
  `
  return result[0] as Site | null
})

/**
 * Get public site data (optimized for public pages)
 * Only returns fields needed for public display
 */
export const getSitePublicData = cache(async (siteId: number): Promise<SitePublicData | null> => {
  const result = await sql`
    SELECT 
      id, name, description, custom_domain, country, country_iso2,
      language, logo_url, thumbnail_image_url, theme_layout, contact_email,
      twitter_handle, twitter_url, about_page_content,
      privacy_page_content, not_found_message, ga4_measurement_id,
      theme_primary_color, theme_accent_color
    FROM sites 
    WHERE id = ${siteId}
    AND status = 'active'
    LIMIT 1
  `
  return result[0] as SitePublicData | null
})

/**
 * Get article categories for a site with counts
 */
export const getArticleCategories = cache(async (siteId: number): Promise<ArticleCategory[]> => {
  const result = await sql`
    SELECT 
      category as value,
      category as label,
      COUNT(*) as count
    FROM articles
    WHERE site_id = ${siteId}
    AND status = 'published'
    AND category IS NOT NULL
    GROUP BY category
    ORDER BY count DESC, category ASC
  `
  return result as ArticleCategory[]
})

/**
 * Verify site exists and is active
 */
export const verifySiteActive = cache(async (siteId: number): Promise<boolean> => {
  const result = await sql`
    SELECT id FROM sites 
    WHERE id = ${siteId}
    AND status = 'active'
    LIMIT 1
  `
  return result.length > 0
})
