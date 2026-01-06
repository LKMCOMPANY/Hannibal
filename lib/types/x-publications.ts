/**
 * X Publications Types
 * 
 * Types for the X/Twitter publication system
 * Handles automated tweet posting after article publication
 */

export type XPublicationStatus = "pending" | "posted" | "failed" | "paused" | "cancelled"

export type XPublication = {
  id: number
  article_id: number
  site_id: number
  
  // Tweet content
  x_post_text: string
  article_url: string
  
  // Scheduling
  scheduled_for: string
  posted_at: string | null
  
  // Status
  status: XPublicationStatus
  
  // Twitter response
  twitter_post_id: string | null
  twitter_post_url: string | null
  error_message: string | null
  
  // Metadata
  created_at: string
  updated_at: string
}

export type XPublicationWithRelations = XPublication & {
  article_title?: string
  article_slug?: string
  article_featured_image?: string
  site_name?: string
  site_twitter_handle?: string
  site_custom_domain?: string
}

export type XPublicationJob = {
  publicationId: number
  articleId: number
  siteId: number
  xPostText: string
  scheduledFor: string
}

export type XPublicationFilters = {
  search?: string
  status?: XPublicationStatus
  site_id?: number
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

export type XPublicationCreateInput = {
  article_id: number
  site_id: number
  x_post_text: string
  article_url: string
  scheduled_for: string
}

