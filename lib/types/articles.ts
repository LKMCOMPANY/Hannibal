export type Article = {
  id: number
  title: string
  slug: string
  content: string
  excerpt: string | null
  meta_description: string | null
  x_post: string | null // Added x_post field for Twitter/X posts
  featured_image_url: string | null
  featured_image_caption: string | null
  featured_image_alt: string | null
  category: string | null
  tags: string[] | null
  status: string
  published_at: string | null
  scheduled_at: string | null
  site_id: number
  author_id: number | null
  created_at: string
  updated_at: string
  source_type: string | null
}

export type ArticleListItem = Omit<Article, "content"> & {
  site_name?: string
  site_country?: string
  site_language?: string
  site_custom_domain?: string
  author_name?: string
}

export type ArticleWithRelations = Article & {
  site_name?: string
  site_country?: string
  site_language?: string
  author_name?: string
}

export type ArticleFilters = {
  search?: string
  site_id?: number
  author_id?: number
  status?: string
  source_type?: string
  country?: string
  language?: string
  category?: string
  date_from?: string // Added date range filters
  date_to?: string // Added date range filters
  limit?: number
  offset?: number
}

export type ArticleSearchResult = {
  id: number
  title: string
  site_name?: string
  author_name?: string
  published_at: string | null
}
