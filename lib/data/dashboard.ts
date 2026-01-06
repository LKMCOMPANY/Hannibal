/**
 * Dashboard Data Layer
 * 
 * Centralized queries for dashboard analytics and stats
 * All queries are cached for performance
 */

import { cache } from "react"
import { sql } from "@/lib/db"

export type TimeRange = "3h" | "24h" | "7d" | "30d"

// ============================================================================
// Time Range Utilities
// ============================================================================

/**
 * Get SQL interval for time range
 */
export function getTimeRangeInterval(range: TimeRange): string {
  const intervals = {
    "3h": "3 hours",
    "24h": "24 hours",
    "7d": "7 days",
    "30d": "30 days",
  }
  return intervals[range]
}

// ============================================================================
// Publications Stats
// ============================================================================

/**
 * Get publications count by source type for time range
 */
export const getPublicationsStats = cache(async (range: TimeRange = "24h") => {
  try {
    const interval = getTimeRangeInterval(range)
    
    const result = await sql`
      SELECT 
        source_type,
        COUNT(*) as count
      FROM articles
      WHERE published_at >= NOW() - INTERVAL '${sql.unsafe(interval)}'
      GROUP BY source_type
      ORDER BY count DESC
    `

    return {
      manual: Number(result.find((r: any) => r.source_type === 'manual')?.count || 0),
      autonomous: Number(result.find((r: any) => r.source_type === 'autonomous')?.count || 0),
      campaign: Number(result.find((r: any) => r.source_type === 'campaign')?.count || 0),
      total: result.reduce((acc: number, r: any) => acc + Number(r.count), 0),
    }
  } catch (error) {
    console.error("Error fetching publications stats:", error)
    return { manual: 0, autonomous: 0, campaign: 0, total: 0 }
  }
})

/**
 * Get overview stats for dashboard
 */
export const getOverviewStats = cache(async (range: TimeRange = "24h") => {
  try {
    const interval = getTimeRangeInterval(range)
    
    const [mediaCount, countryCount, languageCount, xPostsCount] = await Promise.all([
      // Active medias that published in period
      sql`
        SELECT COUNT(DISTINCT a.site_id) as count
        FROM articles a
        WHERE a.published_at >= NOW() - INTERVAL '${sql.unsafe(interval)}'
      `,
      // Active countries (from medias that published)
      sql`
        SELECT COUNT(DISTINCT s.country_iso2) as count
        FROM articles a
        JOIN sites s ON a.site_id = s.id
        WHERE a.published_at >= NOW() - INTERVAL '${sql.unsafe(interval)}'
        AND s.country_iso2 IS NOT NULL
      `,
      // Languages used (from medias that published)
      sql`
        SELECT COUNT(DISTINCT s.language) as count
        FROM articles a
        JOIN sites s ON a.site_id = s.id
        WHERE a.published_at >= NOW() - INTERVAL '${sql.unsafe(interval)}'
        AND s.language IS NOT NULL
      `,
      // X posts in period
      sql`
        SELECT COUNT(*) as count
        FROM x_publications
        WHERE scheduled_for >= NOW() - INTERVAL '${sql.unsafe(interval)}'
        AND status = 'posted'
      `,
    ])

    return {
      activeMedias: Number(mediaCount[0]?.count || 0),
      activeCountries: Number(countryCount[0]?.count || 0),
      activeLanguages: Number(languageCount[0]?.count || 0),
      xPosts: Number(xPostsCount[0]?.count || 0),
    }
  } catch (error) {
    console.error("Error fetching overview stats:", error)
    return { activeMedias: 0, activeCountries: 0, activeLanguages: 0, xPosts: 0 }
  }
})

/**
 * Get publications timeline (hourly) for graph
 */
export const getPublicationsTimeline = cache(async (range: TimeRange = "24h") => {
  try {
    const interval = getTimeRangeInterval(range)
    
    const result = await sql`
      SELECT 
        source_type,
        DATE_TRUNC('hour', published_at) as hour,
        COUNT(*) as count
      FROM articles
      WHERE published_at >= NOW() - INTERVAL '${sql.unsafe(interval)}'
      GROUP BY source_type, hour
      ORDER BY hour ASC
    `

    return result as Array<{
      source_type: string
      hour: string
      count: string
    }>
  } catch (error) {
    console.error("Error fetching publications timeline:", error)
    return []
  }
})

/**
 * Get publications by country for map
 */
export const getPublicationsByCountry = cache(async (range: TimeRange = "24h") => {
  try {
    const interval = getTimeRangeInterval(range)
    
    const result = await sql`
      SELECT 
        s.country_iso2,
        s.country,
        s.name as site_name,
        COUNT(a.id) as article_count,
        MAX(a.published_at) as last_published
      FROM articles a
      JOIN sites s ON a.site_id = s.id
      WHERE a.published_at >= NOW() - INTERVAL '${sql.unsafe(interval)}'
      AND s.country_iso2 IS NOT NULL
      GROUP BY s.country_iso2, s.country, s.name
      ORDER BY article_count DESC
    `

    return result as Array<{
      country_iso2: string
      country: string
      site_name: string
      article_count: string
      last_published: string
    }>
  } catch (error) {
    console.error("Error fetching publications by country:", error)
    return []
  }
})

// ============================================================================
// Recent Activity
// ============================================================================

/**
 * Get latest autonomous articles
 */
export const getLatestAutonomousArticles = cache(async (limit = 10) => {
  try {
    const result = await sql`
      SELECT 
        a.id,
        a.title,
        a.slug,
        a.published_at,
        s.name as site_name,
        s.custom_domain,
        s.country_iso2
      FROM articles a
      JOIN sites s ON a.site_id = s.id
      WHERE a.source_type = 'autonomous'
      AND a.status = 'published'
      ORDER BY a.published_at DESC
      LIMIT ${limit}
    `

    return result as Array<{
      id: number
      title: string
      slug: string
      published_at: string
      site_name: string
      custom_domain: string | null
      country_iso2: string | null
    }>
  } catch (error) {
    console.error("Error fetching latest autonomous articles:", error)
    return []
  }
})

/**
 * Get active campaigns (processing status)
 */
export const getActiveCampaigns = cache(async (limit = 5) => {
  try {
    const result = await sql`
      SELECT 
        c.*,
        a.title as source_article_title,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id) as publications_count,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'published') as successful_publications,
        (SELECT COUNT(*) FROM campaign_publications WHERE campaign_id = c.id AND status = 'failed') as failed_publications
      FROM campaigns c
      LEFT JOIN articles a ON c.source_article_id = a.id
      WHERE c.status IN ('processing', 'pending')
      ORDER BY c.created_at DESC
      LIMIT ${limit}
    `

    return result
  } catch (error) {
    console.error("Error fetching active campaigns:", error)
    return []
  }
})

/**
 * Get pending X publications
 */
export const getPendingXPublications = cache(async (limit = 5) => {
  try {
    const result = await sql`
      SELECT 
        xp.*,
        a.title as article_title,
        a.slug as article_slug,
        s.name as site_name,
        s.twitter_handle as site_twitter_handle,
        s.custom_domain as site_custom_domain
      FROM x_publications xp
      LEFT JOIN articles a ON xp.article_id = a.id
      LEFT JOIN sites s ON xp.site_id = s.id
      WHERE xp.status = 'pending'
      ORDER BY xp.scheduled_for ASC
      LIMIT ${limit}
    `

    return result
  } catch (error) {
    console.error("Error fetching pending X publications:", error)
    return []
  }
})

