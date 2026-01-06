/**
 * Publisher Module Types
 *
 * Defines types for article creation and modification operations
 */

export type ArticleStatus = "draft" | "scheduled" | "published" | "archived"
export type ArticleSourceType = "manual" | "ai_generated" | "imported" | "campaign" | "autonomous"

/**
 * Input for creating a new article
 */
export type CreateArticleInput = {
  // Required fields
  title: string
  slug: string
  content: string
  site_id: number
  status: ArticleStatus

  // Optional metadata
  excerpt?: string
  meta_description?: string
  x_post?: string // Added x_post field for Twitter/X posts

  // Featured image
  featured_image_url?: string
  featured_image_caption?: string
  featured_image_alt?: string

  // Categorization
  category?: string
  tags?: string[]

  // Publishing
  published_at?: string
  scheduled_at?: string

  // Relations
  author_id?: number

  // Source tracking
  source_type?: ArticleSourceType
}

/**
 * Input for updating an existing article
 */
export type UpdateArticleInput = Partial<CreateArticleInput>

/**
 * Result of article creation/update operations
 */
export type PublisherResult<T = any> = {
  success: boolean
  data?: T
  error?: string
  validationErrors?: Record<string, string>
}

/**
 * Options for publishing operations
 */
export type PublishOptions = {
  // Whether to validate before publishing
  validate?: boolean

  // Whether to auto-generate missing fields (slug, excerpt, etc.)
  autoGenerate?: boolean

  // Whether to revalidate cache paths
  revalidate?: boolean

  // Custom revalidation paths
  revalidatePaths?: string[]
}

/**
 * Article with ID (returned after creation)
 */
export type ArticleWithId = CreateArticleInput & {
  id: number
  created_at: string
  updated_at: string
}

/**
 * Validation error details
 */
export type ValidationError = {
  field: string
  message: string
}

/**
 * Bulk operation result
 */
export type BulkPublisherResult = {
  success: boolean
  successCount: number
  failureCount: number
  results: PublisherResult[]
  errors: Array<{ index: number; error: string }>
}
