export type Campaign = {
  id: number
  name: string
  source_article_id: number
  custom_instructions: string | null
  campaign_images: string[] | null // Added campaign_images field to store selected image URLs
  deployment_speed_minutes: number // Added deployment speed field
  status: string
  created_at: string
  updated_at: string
  completed_at: string | null
}

export type CampaignPublication = {
  id: number
  campaign_id: number
  target_site_id: number
  generated_article_id: number | null
  status: string
  error_message: string | null
  scheduled_for: string | null // Added scheduled_for field
  published_at: string | null
  created_at: string
  updated_at: string
}

export type CampaignPublicationExtended = CampaignPublication & {
  target_site_id: number
  target_site_name?: string
  target_site_domain?: string
  target_site_custom_domain?: string
  generated_article_id?: number | null
  generated_article_title?: string
  generated_article_excerpt?: string
  generated_article_category?: string
  generated_article_status?: string
  generated_article_slug?: string
  generated_article_image?: string
  generated_article_image_alt?: string
  generated_article_language?: string
}

export type CampaignWithRelations = Campaign & {
  source_article_title?: string
  source_article_excerpt?: string
  source_site_name?: string
  publications_count?: number
  successful_publications?: number
  failed_publications?: number
}

export type CampaignFilters = {
  search?: string
  status?: string
  date_from?: string
  date_to?: string
  limit?: number
  offset?: number
}

export type CampaignCreateInput = {
  name: string
  source_article_id: number
  target_site_ids: number[]
  custom_instructions?: string
  campaign_images?: string[] // Added campaign_images to create input
  deployment_speed_minutes?: number // Added deployment speed field
}
