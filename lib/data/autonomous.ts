/**
 * Autonomous Publication Data Layer
 *
 * Handles data operations for autonomous publication scheduling
 * Following CQRS pattern: read operations are cached, mutations are not
 */

import { cache } from "react"
import { sql } from "@/lib/db"
import type { AutonomousSchedule, TimelineEvent, AutonomousPublication } from "@/lib/types/autonomous"

// ============================================================================
// Query Functions (cached for request deduplication)
// ============================================================================

/**
 * Get autonomous schedule for a site
 */
export const getAutonomousSchedule = cache(async (siteId: number): Promise<AutonomousSchedule | null> => {
  try {
    const result = await sql`
      SELECT 
        id as site_id,
        timezone,
        autonomous_hours as hours,
        autonomous_active as is_active
      FROM sites
      WHERE id = ${siteId}
      LIMIT 1
    `

    if (result.length === 0) {
      return null
    }

    const site = result[0]

    return {
      site_id: site.site_id,
      timezone: site.timezone || "UTC",
      hours: (site.hours as number[]) || [],
      is_active: site.is_active || false,
    }
  } catch (error) {
    console.error("Error fetching autonomous schedule:", error)
    return null
  }
})

/**
 * Get all autonomous schedules (active only)
 */
export const getAllAutonomousSchedules = cache(async (): Promise<AutonomousSchedule[]> => {
  try {
    const result = await sql`
      SELECT 
        id as site_id,
        name,
        timezone,
        autonomous_hours as hours,
        autonomous_active as is_active
      FROM sites
      WHERE autonomous_active = true
      ORDER BY name ASC
    `

    return result.map((site: any) => ({
      site_id: site.site_id,
      timezone: site.timezone || "UTC",
      hours: (site.hours as number[]) || [],
      is_active: site.is_active || false,
    }))
  } catch (error) {
    console.error("Error fetching all autonomous schedules:", error)
    return []
  }
})

/**
 * Get timeline events for all active autonomous schedules
 * Returns a flattened list of all scheduled publication times across all media
 * Hours are kept in LOCAL timezone - conversion happens in the UI
 */
export const getTimelineEvents = cache(async (): Promise<TimelineEvent[]> => {
  try {
    const result = await sql`
      SELECT 
        id as site_id,
        name as site_name,
        timezone,
        autonomous_hours as hours,
        theme_primary_color as color
      FROM sites
      WHERE autonomous_active = true
      ORDER BY name ASC
    `

    const events: TimelineEvent[] = []

    result.forEach((site: any) => {
      const hours = (site.hours as number[]) || []

      hours.forEach((hour: number) => {
        events.push({
          site_id: site.site_id,
          site_name: site.site_name,
          hour, // Keep in LOCAL timezone, not converted
          timezone: site.timezone || "UTC",
          color: site.color || "#8b5cf6",
        })
      })
    })

    return events
  } catch (error) {
    console.error("Error fetching timeline events:", error)
    return []
  }
})

/**
 * Get count of active autonomous sites
 */
export const getActiveAutonomousSitesCount = cache(async (): Promise<number> => {
  try {
    const result = await sql`
      SELECT COUNT(*) as count 
      FROM sites
      WHERE autonomous_active = true
    `
    return Number(result[0]?.count || 0)
  } catch (error) {
    console.error("Error counting active autonomous sites:", error)
    return 0
  }
})

// ============================================================================
// Mutation Functions (not cached)
// ============================================================================

/**
 * Update autonomous schedule for a site
 */
export async function updateAutonomousSchedule(siteId: number, hours: number[], isActive: boolean): Promise<boolean> {
  try {
    await sql`
      UPDATE sites
      SET 
        autonomous_hours = ${hours},
        autonomous_active = ${isActive},
        updated_at = NOW()
      WHERE id = ${siteId}
    `

    return true
  } catch (error) {
    console.error("Error updating autonomous schedule:", error)
    throw new Error("Failed to update autonomous schedule in database")
  }
}

/**
 * Update site timezone
 */
export async function updateSiteTimezone(siteId: number, timezone: string): Promise<boolean> {
  try {
    await sql`
      UPDATE sites
      SET 
        timezone = ${timezone},
        updated_at = NOW()
      WHERE id = ${siteId}
    `

    return true
  } catch (error) {
    console.error("Error updating site timezone:", error)
    throw new Error("Failed to update site timezone in database")
  }
}

// ============================================================================
// Autonomous Publications Queries (for tracking and analytics)
// ============================================================================

/**
 * Get autonomous publications for a site
 */
export const getAutonomousPublications = cache(
  async (siteId: number, limit = 50, offset = 0): Promise<AutonomousPublication[]> => {
    try {
      const result = await sql`
        SELECT * FROM autonomous_publications
        WHERE site_id = ${siteId}
        ORDER BY scheduled_for DESC
        LIMIT ${limit} OFFSET ${offset}
      `
      return result as AutonomousPublication[]
    } catch (error) {
      console.error("Error fetching autonomous publications:", error)
      return []
    }
  }
)

/**
 * Get autonomous publication by ID
 */
export const getAutonomousPublicationById = cache(
  async (id: number): Promise<AutonomousPublication | null> => {
    try {
      const result = await sql`
        SELECT * FROM autonomous_publications
        WHERE id = ${id}
        LIMIT 1
      `
      return result[0] as AutonomousPublication | null
    } catch (error) {
      console.error("Error fetching autonomous publication:", error)
      return null
    }
  }
)

/**
 * Get recent autonomous publications across all sites
 */
export const getRecentAutonomousPublications = cache(
  async (limit = 20): Promise<AutonomousPublication[]> => {
    try {
      const result = await sql`
        SELECT * FROM autonomous_publications
        ORDER BY scheduled_for DESC
        LIMIT ${limit}
      `
      return result as AutonomousPublication[]
    } catch (error) {
      console.error("Error fetching recent autonomous publications:", error)
      return []
    }
  }
)

/**
 * Get autonomous publications by status
 */
export const getAutonomousPublicationsByStatus = cache(
  async (status: string, limit = 50): Promise<AutonomousPublication[]> => {
    try {
      const result = await sql`
        SELECT * FROM autonomous_publications
        WHERE status = ${status}
        ORDER BY scheduled_for DESC
        LIMIT ${limit}
      `
      return result as AutonomousPublication[]
    } catch (error) {
      console.error("Error fetching autonomous publications by status:", error)
      return []
    }
  }
)

/**
 * Get autonomous publication statistics for a site
 */
export const getAutonomousPublicationStats = cache(
  async (siteId: number): Promise<{
    total: number
    published: number
    failed: number
    pending: number
    successRate: number
  }> => {
    try {
      const result = await sql`
        SELECT 
          COUNT(*) as total,
          COUNT(*) FILTER (WHERE status = 'published') as published,
          COUNT(*) FILTER (WHERE status = 'failed') as failed,
          COUNT(*) FILTER (WHERE status = 'pending' OR status = 'processing') as pending
        FROM autonomous_publications
        WHERE site_id = ${siteId}
      `

      const stats = result[0]
      const total = Number(stats.total) || 0
      const published = Number(stats.published) || 0
      const failed = Number(stats.failed) || 0
      const pending = Number(stats.pending) || 0
      const successRate = total > 0 ? (published / total) * 100 : 0

      return { total, published, failed, pending, successRate }
    } catch (error) {
      console.error("Error fetching autonomous publication stats:", error)
      return { total: 0, published: 0, failed: 0, pending: 0, successRate: 0 }
    }
  }
)

/**
 * Create a new autonomous publication record
 * Used by scheduler to create pending publications before processing
 */
export async function createAutonomousPublication(
  siteId: number,
  scheduledFor: string,
  sourceQuery?: string
): Promise<AutonomousPublication> {
  try {
    const result = await sql`
      INSERT INTO autonomous_publications (
        site_id,
        scheduled_for,
        source_query,
        status
      ) VALUES (
        ${siteId},
        ${scheduledFor},
        ${sourceQuery || null},
        'pending'
      )
      RETURNING *
    `
    return result[0] as AutonomousPublication
  } catch (error) {
    console.error("Error creating autonomous publication:", error)
    throw new Error("Failed to create autonomous publication")
  }
}

/**
 * Check if autonomous publication already exists for site in time window
 * Prevents duplicate publications within the same hour
 */
export async function hasRecentPublication(
  siteId: number,
  withinMinutes = 60
): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id FROM autonomous_publications
      WHERE site_id = ${siteId}
      AND scheduled_for >= NOW() - INTERVAL '${withinMinutes} minutes'
      AND status IN ('published', 'processing', 'pending')
      LIMIT 1
    `
    return result.length > 0
  } catch (error) {
    console.error("Error checking recent publication:", error)
    return false
  }
}
