/**
 * Autonomous Publication Types
 *
 * Defines types for the autonomous publication system where media outlets
 * automatically fetch and publish local news articles at scheduled times
 */

export type AutonomousSchedule = {
  site_id: number
  timezone: string
  hours: number[] // Array of hours (0-23) in local timezone
  is_active: boolean
  last_execution?: string
  next_execution?: string
}

export type AutonomousPublication = {
  id: number
  site_id: number
  scheduled_for: string
  executed_at: string | null
  status: "pending" | "processing" | "published" | "failed"
  generated_article_id: number | null
  source_query: string | null
  source_article_data: any | null  // JSONB field storing full NewsAPI article
  error_message: string | null
  created_at: string
  updated_at: string
}

export type AutonomousPublicationJob = {
  publicationId: number
  siteId: number
  scheduledFor: string
  sourceQuery?: string
}

export type TimelineEvent = {
  site_id: number
  site_name: string
  hour: number // Hour in media's LOCAL timezone (not converted)
  timezone: string // Media's IANA timezone
  color: string // For visual differentiation
}
