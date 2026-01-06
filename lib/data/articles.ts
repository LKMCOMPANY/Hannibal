import { cache } from "react"
import { sql } from "@/lib/db"
import type {
  Article,
  ArticleWithRelations,
  ArticleListItem,
  ArticleFilters,
  ArticleSearchResult,
} from "@/lib/types/articles"

/**
 * Data Access Layer for Articles
 *
 * This module provides centralized access to article data with:
 * - Request deduplication via React cache()
 * - Consistent query patterns
 * - Type safety
 * - Modular architecture
 */

// ============================================================================
// Query Functions (cached)
// ============================================================================

/**
 * Get a single article by ID (includes content)
 */
export const getArticleById = cache(async (id: number): Promise<Article | null> => {
  const result = await sql`
    SELECT * FROM articles WHERE id = ${id} LIMIT 1
  `
  return result[0] as Article | null
})

/**
 * Get article with related data (site, author) - includes content
 */
export const getArticleWithRelations = cache(async (id: number): Promise<ArticleWithRelations | null> => {
  const result = await sql`
      SELECT 
        a.*,
        s.name as site_name,
        s.country as site_country,
        s.language as site_language,
        s.custom_domain as site_custom_domain,
        CONCAT(au.first_name, ' ', au.last_name) as author_name
      FROM articles a
      LEFT JOIN sites s ON a.site_id = s.id
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE a.id = ${id}
      LIMIT 1
    `
  return result[0] as ArticleWithRelations | null
})

/**
 * Get all articles with optional filtering and relations (excludes content for performance)
 */
export const getArticles = cache(async (filters?: ArticleFilters): Promise<ArticleListItem[]> => {
  const limit = filters?.limit || 50
  const offset = filters?.offset || 0

  if (
    !filters ||
    (!filters.search &&
      !filters.site_id &&
      !filters.author_id &&
      !filters.status &&
      !filters.source_type &&
      !filters.country &&
      !filters.language &&
      !filters.category &&
      !filters.date_from &&
      !filters.date_to)
  ) {
    // No filters - get all with relations (excluding content)
    const result = await sql`
        SELECT 
          a.id, a.title, a.slug, a.excerpt, a.meta_description, a.x_post,
          a.featured_image_url, a.featured_image_caption, a.featured_image_alt,
          a.category, a.tags, a.status, a.published_at, a.scheduled_at,
          a.site_id, a.author_id, a.created_at, a.updated_at, a.source_type,
          s.name as site_name,
          s.country as site_country,
          s.language as site_language,
          s.custom_domain as site_custom_domain,
          CONCAT(au.first_name, ' ', au.last_name) as author_name
        FROM articles a
        LEFT JOIN sites s ON a.site_id = s.id
        LEFT JOIN authors au ON a.author_id = au.id
        ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
        LIMIT ${limit} OFFSET ${offset}
      `
    return result as ArticleListItem[]
  }

  // Build filtered query (excluding content)
  const searchPattern = filters.search ? `%${filters.search}%` : null

  const result = await sql`
      SELECT 
        a.id, a.title, a.slug, a.excerpt, a.meta_description, a.x_post,
        a.featured_image_url, a.featured_image_caption, a.featured_image_alt,
        a.category, a.tags, a.status, a.published_at, a.scheduled_at,
        a.site_id, a.author_id, a.created_at, a.updated_at, a.source_type,
        s.name as site_name,
        s.country as site_country,
        s.language as site_language,
        s.custom_domain as site_custom_domain,
        CONCAT(au.first_name, ' ', au.last_name) as author_name
      FROM articles a
      LEFT JOIN sites s ON a.site_id = s.id
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE 1=1
      ${searchPattern ? sql`AND (a.title ILIKE ${searchPattern} OR a.excerpt ILIKE ${searchPattern})` : sql``}
      ${filters.site_id ? sql`AND a.site_id = ${filters.site_id}` : sql``}
      ${filters.author_id ? sql`AND a.author_id = ${filters.author_id}` : sql``}
      ${filters.status && filters.status !== "all" ? sql`AND a.status = ${filters.status}` : sql``}
      ${filters.source_type && filters.source_type !== "all" ? sql`AND a.source_type = ${filters.source_type}` : sql``}
      ${filters.country && filters.country !== "all" ? sql`AND s.country = ${filters.country}` : sql``}
      ${filters.language && filters.language !== "all" ? sql`AND s.language = ${filters.language}` : sql``}
      ${filters.category && filters.category !== "all" ? sql`AND a.category = ${filters.category}` : sql``}
      ${filters.date_from ? sql`AND a.published_at >= ${filters.date_from}` : sql``}
      ${filters.date_to ? sql`AND a.published_at <= ${filters.date_to}` : sql``}
      ORDER BY a.published_at DESC NULLS LAST, a.created_at DESC
      LIMIT ${limit} OFFSET ${offset}
    `
  return result as ArticleListItem[]
})

/**
 * Get articles by site ID
 */
export const getArticlesBySiteId = cache(async (siteId: number): Promise<Article[]> => {
  const result = await sql`
    SELECT * FROM articles 
    WHERE site_id = ${siteId}
    ORDER BY created_at DESC
  `
  return result as Article[]
})

/**
 * Get articles by author ID
 */
export const getArticlesByAuthorId = cache(async (authorId: number): Promise<Article[]> => {
  const result = await sql`
    SELECT * FROM articles 
    WHERE author_id = ${authorId}
    ORDER BY created_at DESC
  `
  return result as Article[]
})

/**
 * Get articles by status
 */
export const getArticlesByStatus = cache(async (status: string): Promise<Article[]> => {
  const result = await sql`
    SELECT * FROM articles 
    WHERE status = ${status}
    ORDER BY created_at DESC
  `
  return result as Article[]
})

/**
 * Search articles
 */
export const searchArticles = cache(async (searchTerm: string, limit = 10): Promise<ArticleWithRelations[]> => {
  const result = await sql`
      SELECT 
        a.*,
        s.name as site_name,
        s.country as site_country,
        s.language as site_language,
        s.custom_domain as site_custom_domain,
        CONCAT(au.first_name, ' ', au.last_name) as author_name
      FROM articles a
      LEFT JOIN sites s ON a.site_id = s.id
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE a.title ILIKE ${`%${searchTerm}%`} 
         OR a.excerpt ILIKE ${`%${searchTerm}%`}
      ORDER BY a.created_at DESC
      LIMIT ${limit}
    `
  return result as ArticleWithRelations[]
})

/**
 * Search articles for autocomplete (optimized query)
 */
export const searchArticlesAutocomplete = cache(
  async (searchTerm: string, limit = 10): Promise<ArticleSearchResult[]> => {
    if (!searchTerm || searchTerm.length < 2) return []

    const result = await sql`
      SELECT 
        a.id,
        a.title,
        a.published_at,
        s.name as site_name,
        s.custom_domain as site_custom_domain,
        CONCAT(au.first_name, ' ', au.last_name) as author_name
      FROM articles a
      LEFT JOIN sites s ON a.site_id = s.id
      LEFT JOIN authors au ON a.author_id = au.id
      WHERE a.title ILIKE ${`%${searchTerm}%`} 
         OR s.name ILIKE ${`%${searchTerm}%`}
         OR CONCAT(au.first_name, ' ', au.last_name) ILIKE ${`%${searchTerm}%`}
      ORDER BY a.created_at DESC
      LIMIT ${limit}
    `
    return result as ArticleSearchResult[]
  },
)

/**
 * Get total count of articles
 */
export const getArticlesCount = cache(async (filters?: ArticleFilters): Promise<number> => {
  if (
    !filters ||
    (!filters.search &&
      !filters.site_id &&
      !filters.author_id &&
      !filters.status &&
      !filters.source_type &&
      !filters.country &&
      !filters.language &&
      !filters.category &&
      !filters.date_from &&
      !filters.date_to)
  ) {
    const result = await sql`
      SELECT COUNT(*) as count FROM articles
    `
    return Number(result[0]?.count || 0)
  }

  const searchPattern = filters.search ? `%${filters.search}%` : null

  const result = await sql`
    SELECT COUNT(*) as count 
    FROM articles a
    LEFT JOIN sites s ON a.site_id = s.id
    WHERE 1=1
    ${searchPattern ? sql`AND (a.title ILIKE ${searchPattern} OR a.excerpt ILIKE ${searchPattern})` : sql``}
    ${filters.site_id ? sql`AND a.site_id = ${filters.site_id}` : sql``}
    ${filters.author_id ? sql`AND a.author_id = ${filters.author_id}` : sql``}
    ${filters.status && filters.status !== "all" ? sql`AND a.status = ${filters.status}` : sql``}
    ${filters.source_type && filters.source_type !== "all" ? sql`AND a.source_type = ${filters.source_type}` : sql``}
    ${filters.country && filters.country !== "all" ? sql`AND s.country = ${filters.country}` : sql``}
    ${filters.language && filters.language !== "all" ? sql`AND s.language = ${filters.language}` : sql``}
    ${filters.category && filters.category !== "all" ? sql`AND a.category = ${filters.category}` : sql``}
    ${filters.date_from ? sql`AND a.published_at >= ${filters.date_from}` : sql``}
    ${filters.date_to ? sql`AND a.published_at <= ${filters.date_to}` : sql``}
  `
  return Number(result[0]?.count || 0)
})

// ============================================================================
// Mutation Functions (not cached)
// ============================================================================

/**
 * Delete an article by ID
 */
export async function deleteArticle(id: number): Promise<boolean> {
  const result = await sql`
    DELETE FROM articles WHERE id = ${id} RETURNING id
  `
  return result.length > 0
}

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Get unique statuses
 */
export const getUniqueStatuses = cache(async (): Promise<string[]> => {
  const result = await sql`
    SELECT DISTINCT status 
    FROM articles 
    WHERE status IS NOT NULL 
    ORDER BY status ASC
  `
  return result.map((row: any) => row.status)
})

/**
 * Get unique source types
 */
export const getUniqueSourceTypes = cache(async (): Promise<string[]> => {
  const result = await sql`
    SELECT DISTINCT source_type 
    FROM articles 
    WHERE source_type IS NOT NULL 
    ORDER BY source_type ASC
  `
  return result.map((row: any) => row.source_type)
})

/**
 * Get unique categories
 */
export const getUniqueCategories = cache(async (): Promise<string[]> => {
  const result = await sql`
    SELECT DISTINCT category 
    FROM articles 
    WHERE category IS NOT NULL 
    ORDER BY category ASC
  `
  return result.map((row: any) => row.category)
})
