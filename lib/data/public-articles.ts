import { cache } from "react"
import { sql } from "@/lib/db"

/**
 * Public Articles Data Layer
 *
 * Optimized queries for public-facing article pages.
 * Only returns published articles with necessary fields.
 */

// ============================================================================
// Types
// ============================================================================

export type PublicArticle = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  content: string
  featured_image_url: string | null
  featured_image_caption: string | null
  featured_image_alt: string | null
  category: string | null
  tags: string[] | null
  published_at: Date | null
  site_id: number
  author_id: number | null
  meta_description: string | null
  author_name: string | null
  author_bio: string | null
}

export type PublicArticleListItem = {
  id: number
  title: string
  slug: string
  excerpt: string | null
  featured_image_url: string | null
  featured_image_alt: string | null
  category: string | null
  tags: string[] | null
  published_at: Date | null
  author_name: string | null
  author_id: number | null
}

// ============================================================================
// Query Functions
// ============================================================================

/**
 * Get published articles for a site (list view)
 */
export const getPublishedArticles = cache(
  async (siteId: number, limit = 20, offset = 0): Promise<PublicArticleListItem[]> => {
    const result = await sql`
      SELECT 
        a.id, a.title, a.slug, a.excerpt,
        a.featured_image_url, a.featured_image_alt,
        a.category, a.tags, a.published_at,
        a.author_id,
        CONCAT(au.first_name, ' ', au.last_name) as author_name
      FROM articles a
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE a.site_id = ${siteId}
      AND a.status = 'published'
      AND a.published_at IS NOT NULL
      AND a.published_at <= NOW()
      ORDER BY a.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return result as PublicArticleListItem[]
  },
)

/**
 * Get a single published article by slug
 */
export const getPublishedArticleBySlug = cache(async (siteId: number, slug: string): Promise<PublicArticle | null> => {
  const result = await sql`
      SELECT 
        a.id, a.title, a.slug, a.excerpt, a.content,
        a.featured_image_url, a.featured_image_caption, a.featured_image_alt,
        a.category, a.tags, a.published_at, a.site_id, a.author_id,
        a.meta_description,
        CONCAT(au.first_name, ' ', au.last_name) as author_name,
        au.bio as author_bio
      FROM articles a
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE a.site_id = ${siteId}
      AND a.slug = ${slug}
      AND a.status = 'published'
      AND a.published_at IS NOT NULL
      AND a.published_at <= NOW()
      LIMIT 1
    `
  return result[0] as PublicArticle | null
})

/**
 * Get published articles by category
 */
export const getPublishedArticlesByCategory = cache(
  async (siteId: number, category: string, limit = 20, offset = 0): Promise<PublicArticleListItem[]> => {
    const result = await sql`
      SELECT 
        a.id, a.title, a.slug, a.excerpt,
        a.featured_image_url, a.featured_image_alt,
        a.category, a.tags, a.published_at,
        a.author_id,
        CONCAT(au.first_name, ' ', au.last_name) as author_name
      FROM articles a
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE a.site_id = ${siteId}
      AND a.category = ${category}
      AND a.status = 'published'
      AND a.published_at IS NOT NULL
      AND a.published_at <= NOW()
      ORDER BY a.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return result as PublicArticleListItem[]
  },
)

/**
 * Get related articles (same category, excluding current article)
 */
export const getRelatedArticles = cache(
  async (siteId: number, articleId: number, category: string | null, limit = 3): Promise<PublicArticleListItem[]> => {
    if (!category) {
      // If no category, just get recent articles
      const result = await sql`
        SELECT 
          a.id, a.title, a.slug, a.excerpt,
          a.featured_image_url, a.featured_image_alt,
          a.category, a.tags, a.published_at,
          a.author_id,
          CONCAT(au.first_name, ' ', au.last_name) as author_name
        FROM articles a
        LEFT JOIN authors au ON a.author_id = au.id
        WHERE a.site_id = ${siteId}
        AND a.id != ${articleId}
        AND a.status = 'published'
        AND a.published_at IS NOT NULL
        AND a.published_at <= NOW()
        ORDER BY a.published_at DESC
        LIMIT ${limit}
      `
      return result as PublicArticleListItem[]
    }

    const result = await sql`
      SELECT 
        a.id, a.title, a.slug, a.excerpt,
        a.featured_image_url, a.featured_image_alt,
        a.category, a.tags, a.published_at,
        a.author_id,
        CONCAT(au.first_name, ' ', au.last_name) as author_name
      FROM articles a
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE a.site_id = ${siteId}
      AND a.id != ${articleId}
      AND a.category = ${category}
      AND a.status = 'published'
      AND a.published_at IS NOT NULL
      AND a.published_at <= NOW()
      ORDER BY a.published_at DESC
      LIMIT ${limit}
    `
    return result as PublicArticleListItem[]
  },
)

/**
 * Get total count of published articles for a site
 */
export const getPublishedArticlesCount = cache(async (siteId: number): Promise<number> => {
  const result = await sql`
    SELECT COUNT(*) as count 
    FROM articles
    WHERE site_id = ${siteId}
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= NOW()
  `
  return Number(result[0]?.count || 0)
})

/**
 * Get count by category
 */
export const getPublishedArticlesCountByCategory = cache(async (siteId: number, category: string): Promise<number> => {
  const result = await sql`
      SELECT COUNT(*) as count 
      FROM articles
      WHERE site_id = ${siteId}
      AND category = ${category}
      AND status = 'published'
      AND published_at IS NOT NULL
      AND published_at <= NOW()
    `
  return Number(result[0]?.count || 0)
})

/**
 * Get published articles by author
 */
export const getPublishedArticlesByAuthor = cache(
  async (siteId: number, authorId: number, limit = 20, offset = 0): Promise<PublicArticleListItem[]> => {
    const result = await sql`
      SELECT 
        a.id, a.title, a.slug, a.excerpt,
        a.featured_image_url, a.featured_image_alt,
        a.category, a.tags, a.published_at,
        a.author_id,
        CONCAT(au.first_name, ' ', au.last_name) as author_name
      FROM articles a
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE a.site_id = ${siteId}
      AND a.author_id = ${authorId}
      AND a.status = 'published'
      AND a.published_at IS NOT NULL
      AND a.published_at <= NOW()
      ORDER BY a.published_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
    return result as PublicArticleListItem[]
  },
)

/**
 * Get categories with article counts for a site
 */
export const getSiteCategories = cache(async (siteId: number): Promise<{ category: string; count: number }[]> => {
  const result = await sql`
    SELECT 
      category,
      COUNT(*) as count
    FROM articles
    WHERE site_id = ${siteId}
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= NOW()
    AND category IS NOT NULL
    GROUP BY category
    ORDER BY count DESC
    LIMIT 10
  `
  return result.map((row: any) => ({
    category: row.category,
    count: Number(row.count),
  }))
})
