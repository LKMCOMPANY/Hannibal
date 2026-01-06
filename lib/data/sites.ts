import { cache } from "react"
import { sql } from "@/lib/db"
import type { Site, SiteFilters, SiteCreateInput, SiteUpdateInput } from "@/lib/types/sites"

/**
 * Data Access Layer for Sites (Dashboard/Admin)
 *
 * This module provides database access for the admin dashboard.
 * For public site pages, use lib/site-resolver.ts instead.
 *
 * All query functions are cached to prevent duplicate queries within
 * a single request lifecycle.
 */

// ============================================================================
// Types
// ============================================================================

// These types are now imported from "@/lib/types/sites"
// export type SiteFilters = {
//   search?: string
//   country?: string
//   status?: string
//   ideology?: string
// }

// export type SiteCreateInput = {
//   name: string
//   description?: string
//   custom_domain?: string
//   country?: string
//   country_iso2?: string
//   ideology?: string
//   twitter_handle?: string
//   twitter_url?: string
//   contact_email?: string
//   thumbnail_image_url?: string
//   logo_url?: string
//   language?: string
//   status?: string
// }

// export type SiteUpdateInput = Partial<SiteCreateInput>

// ============================================================================
// Query Functions (cached to deduplicate requests within a single render)
// ============================================================================

/**
 * Get a single site by ID
 * Cached to avoid duplicate queries in the same request
 *
 * Note: For public pages, use getSitePublicData() from lib/site-resolver.ts
 * which returns optimized data for public display.
 */
export const getSiteById = cache(async (id: number): Promise<Site | null> => {
  const result = await sql`
    SELECT * FROM sites WHERE id = ${id} LIMIT 1
  `
  return result[0] as Site | null
})

/**
 * Get all sites with optional filtering
 * Cached to avoid duplicate queries in the same request
 */
export const getSites = cache(async (filters?: SiteFilters): Promise<Site[]> => {
  if (!filters || (!filters.search && !filters.country && !filters.status && !filters.ideology)) {
    // No filters - simple query
    const result = await sql`
      SELECT * FROM sites 
      ORDER BY created_at DESC
    `
    return result as Site[]
  }

  // Build conditions array
  const conditions: string[] = []

  // Apply filters
  if (filters.search) {
    const searchPattern = `%${filters.search}%`
    const result = await sql`
      SELECT * FROM sites 
      WHERE (name ILIKE ${searchPattern} OR custom_domain ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
      ${filters.country && filters.country !== "all" ? sql`AND country = ${filters.country}` : sql``}
      ${filters.status && filters.status !== "all" ? sql`AND status = ${filters.status}` : sql``}
      ${filters.ideology && filters.ideology !== "all" ? sql`AND ideology ILIKE ${`%${filters.ideology}%`}` : sql``}
      ORDER BY created_at DESC
    `
    return result as Site[]
  }

  // No search, but other filters
  const result = await sql`
    SELECT * FROM sites 
    WHERE 1=1
    ${filters.country && filters.country !== "all" ? sql`AND country = ${filters.country}` : sql``}
    ${filters.status && filters.status !== "all" ? sql`AND status = ${filters.status}` : sql``}
    ${filters.ideology && filters.ideology !== "all" ? sql`AND ideology ILIKE ${`%${filters.ideology}%`}` : sql``}
    ORDER BY created_at DESC
  `
  return result as Site[]
})

/**
 * Get sites by status
 * Useful for filtering active/inactive sites
 */
export const getSitesByStatus = cache(async (status: string): Promise<Site[]> => {
  const result = await sql`
    SELECT * FROM sites 
    WHERE status = ${status}
    ORDER BY created_at DESC
  `
  return result as Site[]
})

/**
 * Get sites by country
 * Useful for geographic filtering
 */
export const getSitesByCountry = cache(async (country: string): Promise<Site[]> => {
  const result = await sql`
    SELECT * FROM sites 
    WHERE country = ${country}
    ORDER BY created_at DESC
  `
  return result as Site[]
})

/**
 * Get sites by ideology
 * Useful for filtering by political leaning
 */
export const getSitesByIdeology = cache(async (ideology: string): Promise<Site[]> => {
  const result = await sql`
    SELECT * FROM sites 
    WHERE ideology ILIKE ${`%${ideology}%`}
    ORDER BY created_at DESC
  `
  return result as Site[]
})

/**
 * Search sites by name or domain
 * Optimized for autocomplete functionality
 */
export const searchSites = cache(async (searchTerm: string, limit = 10): Promise<Site[]> => {
  const result = await sql`
    SELECT * FROM sites 
    WHERE name ILIKE ${`%${searchTerm}%`} 
       OR custom_domain ILIKE ${`%${searchTerm}%`}
    ORDER BY name ASC
    LIMIT ${limit}
  `
  return result as Site[]
})

/**
 * Get total count of sites
 * Useful for pagination and statistics
 */
export const getSitesCount = cache(async (filters?: SiteFilters): Promise<number> => {
  if (!filters || (!filters.search && !filters.country && !filters.status && !filters.ideology)) {
    const result = await sql`
      SELECT COUNT(*) as count FROM sites
    `
    return Number(result[0]?.count || 0)
  }

  if (filters.search) {
    const searchPattern = `%${filters.search}%`
    const result = await sql`
      SELECT COUNT(*) as count FROM sites 
      WHERE (name ILIKE ${searchPattern} OR custom_domain ILIKE ${searchPattern} OR description ILIKE ${searchPattern})
      ${filters.country && filters.country !== "all" ? sql`AND country = ${filters.country}` : sql``}
      ${filters.status && filters.status !== "all" ? sql`AND status = ${filters.status}` : sql``}
      ${filters.ideology && filters.ideology !== "all" ? sql`AND ideology ILIKE ${`%${filters.ideology}%`}` : sql``}
    `
    return Number(result[0]?.count || 0)
  }

  const result = await sql`
    SELECT COUNT(*) as count FROM sites 
    WHERE 1=1
    ${filters.country && filters.country !== "all" ? sql`AND country = ${filters.country}` : sql``}
    ${filters.status && filters.status !== "all" ? sql`AND status = ${filters.status}` : sql``}
    ${filters.ideology && filters.ideology !== "all" ? sql`AND ideology ILIKE ${`%${filters.ideology}%`}` : sql``}
  `
  return Number(result[0]?.count || 0)
})

// ============================================================================
// Mutation Functions (not cached - these modify data)
// ============================================================================

/**
 * Create a new site
 * Returns the created site with its ID
 */
export async function createSite(data: SiteCreateInput): Promise<Site> {
  const result = await sql`
    INSERT INTO sites (
      name, description, custom_domain, country, country_iso2,
      ideology, twitter_handle, twitter_url, contact_email,
      thumbnail_image_url, logo_url, language, status
    )
    VALUES (
      ${data.name}, ${data.description || null}, ${data.custom_domain || null},
      ${data.country || null}, ${data.country_iso2 || null}, ${data.ideology || null},
      ${data.twitter_handle || null}, ${data.twitter_url || null}, ${data.contact_email || null},
      ${data.thumbnail_image_url || null}, ${data.logo_url || null}, ${data.language || "en"},
      ${data.status || "draft"}
    )
    RETURNING *
  `
  return result[0] as Site
}

/**
 * Update an existing site
 * Returns the updated site
 */
export async function updateSite(id: number, data: SiteUpdateInput): Promise<Site | null> {
  if (Object.keys(data).length === 0) {
    return getSiteById(id)
  }

  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  Object.entries(data).forEach(([key, value]) => {
    updates.push(`${key} = $${paramIndex}`)
    values.push(value)
    paramIndex++
  })

  updates.push(`updated_at = NOW()`)

  const query = `
    UPDATE sites 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `
  values.push(id)

  const result = await sql.query(query, values)

  // Neon returns rows directly in the result array, not in a .rows property
  return (result[0] as Site) || null
}

/**
 * Delete a site by ID
 * Returns true if deleted, false if not found
 */
export async function deleteSite(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM sites WHERE id = ${id} RETURNING id
  `
  return result.length > 0
}

/**
 * Check if a custom domain is available
 * Returns true if available, false if taken
 */
export async function isDomainAvailable(domain: string, excludeSiteId?: number): Promise<boolean> {
  if (excludeSiteId) {
    const result = await sql`
      SELECT id FROM sites 
      WHERE custom_domain = ${domain} 
      AND id != ${excludeSiteId}
      LIMIT 1
    `
    return result.length === 0
  }

  const result = await sql`
    SELECT id FROM sites 
    WHERE custom_domain = ${domain}
    LIMIT 1
  `
  return result.length === 0
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get unique countries from all sites
 * Useful for filter dropdowns
 */
export const getUniqueCountries = cache(async (): Promise<string[]> => {
  const result = await sql`
    SELECT DISTINCT country 
    FROM sites 
    WHERE country IS NOT NULL 
    ORDER BY country ASC
  `
  return result.map((row: any) => row.country)
})

/**
 * Get unique statuses from all sites
 * Useful for filter dropdowns
 */
export const getUniqueStatuses = cache(async (): Promise<string[]> => {
  const result = await sql`
    SELECT DISTINCT status 
    FROM sites 
    WHERE status IS NOT NULL 
    ORDER BY status ASC
  `
  return result.map((row: any) => row.status)
})

/**
 * Get unique ideologies from all sites
 * Useful for filter dropdowns
 */
export const getUniqueIdeologies = cache(async (): Promise<string[]> => {
  const result = await sql`
    SELECT DISTINCT ideology 
    FROM sites 
    WHERE ideology IS NOT NULL 
    ORDER BY ideology ASC
  `
  return result.map((row: any) => row.ideology)
})
