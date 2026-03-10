/**
 * Site Type Definitions
 *
 * Comprehensive types for the sites table and related data structures.
 * Ensures type safety across the application.
 */

// ============================================================================
// Database Types
// ============================================================================

/**
 * Complete Site type matching database schema
 */
export type Site = {
  // Core Identity
  id: number
  name: string
  description: string | null
  custom_domain: string | null
  status: string | null
  domain_verified: boolean | null

  // Localization
  country: string | null
  country_iso2: string | null
  language: string | null

  // Branding
  logo_url: string | null
  thumbnail_image_url: string | null
  ideology: string | null

  // Theme & Layout (theme_layout now stores preset name: modern, classic, magazine, minimalist, bold)
  theme_layout: string | null
  theme_primary_color: string | null
  theme_accent_color: string | null

  guideline_stylistic: string | null
  guideline_political: string | null

  // Content Pages
  about_page_content: string | null
  privacy_page_content: string | null
  not_found_message: string | null

  // Social Media
  twitter_handle: string | null
  twitter_url: string | null
  twitter_token: string | null
  /** When false, X (Twitter) auto-post is paused: articles with x_post will not schedule a tweet for this site. */
  twitter_auto_enabled: boolean | null
  contact_email: string | null

  // Analytics
  ga4_measurement_id: string | null
  ga4_property_id: string | null
  ga4_stream_id: string | null

  // Metadata
  created_at: string
  updated_at: string
  user_id: string | null
}

/**
 * Public-facing site data (optimized for public pages)
 */
export type SitePublicData = {
  id: number
  name: string
  description: string | null
  custom_domain: string | null
  country: string | null
  country_iso2: string | null
  language: string | null
  logo_url: string | null
  thumbnail_image_url: string | null
  theme_layout: string | null
  theme_primary_color: string | null
  theme_accent_color: string | null
  contact_email: string | null
  twitter_handle: string | null
  twitter_url: string | null
  about_page_content: string | null
  privacy_page_content: string | null
  not_found_message: string | null
  ga4_measurement_id: string | null
}

/**
 * Site creation input
 */
export type SiteCreateInput = {
  name: string
  description?: string
  custom_domain?: string
  country?: string
  country_iso2?: string
  ideology?: string
  twitter_handle?: string
  twitter_url?: string
  twitter_auto_enabled?: boolean
  contact_email?: string
  thumbnail_image_url?: string
  logo_url?: string
  language?: string
  status?: string
  theme_layout?: string
  theme_primary_color?: string
  theme_accent_color?: string
}

/**
 * Site update input (partial)
 */
export type SiteUpdateInput = Partial<SiteCreateInput>

/**
 * Site filters for queries
 */
export type SiteFilters = {
  search?: string
  country?: string
  status?: string
  ideology?: string
}

/**
 * Article category with count
 */
export type ArticleCategory = {
  value: string
  label: string
  count: number
}
