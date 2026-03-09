/**
 * Publisher Data Layer
 *
 * Handles article creation and modification operations
 * Separated from read operations for CQRS pattern
 */

import { sql } from "@/lib/db"
import type { CreateArticleInput, UpdateArticleInput, ArticleWithId } from "@/lib/types/publisher"
import slugify from "slugify"

/**
 * Create a new article
 *
 * @param input - Article data
 * @returns Created article with ID
 */
export async function createArticle(input: CreateArticleInput): Promise<ArticleWithId> {
  try {
    const now = new Date().toISOString()
    // Use generateUniqueSlug for slug generation
    const slug = await generateUniqueSlug(input.title, input.site_id)

    const result = await sql`
      INSERT INTO articles (
        title,
        slug,
        content,
        excerpt,
        meta_description,
        x_post,
        featured_image_url,
        featured_image_caption,
        featured_image_alt,
        category,
        tags,
        status,
        published_at,
        scheduled_at,
        site_id,
        author_id,
        source_type,
        created_at,
        updated_at
      ) VALUES (
        ${input.title},
        ${slug},
        ${input.content},
        ${input.excerpt || null},
        ${input.meta_description || null},
        ${input.x_post || null},
        ${input.featured_image_url || null},
        ${input.featured_image_caption || null},
        ${input.featured_image_alt || null},
        ${input.category || null},
        ${input.tags || null},
        ${input.status},
        ${input.published_at || null},
        ${input.scheduled_at || null},
        ${input.site_id},
        ${input.author_id || null},
        ${input.source_type || "manual"},
        ${now},
        ${now}
      )
      RETURNING *
    `

    const article = result[0] as ArticleWithId

    // AUTO-TRIGGER X PUBLICATION (if article is published with x_post)
    if (article.status === 'published' && article.x_post && article.published_at) {
      try {
        await scheduleXPublicationForArticle(article)
      } catch (error) {
        // Log error but don't fail article creation
        console.error("Scheduling failed:", error instanceof Error ? error.message : error)
      }
    }

    // AUTO-TRIGGER GOOGLE INDEXING (if article is published)
    if (article.status === 'published' && article.published_at) {
      try {
        const { getSiteById } = await import("@/lib/data/sites")
        const { notifyGoogleIndexing } = await import("@/lib/services/google-indexing")
        
        const site = await getSiteById(article.site_id)
        if (site) {
          // Non-blocking - errors caught inside notifyGoogleIndexing
          await notifyGoogleIndexing(article, site)
        }
      } catch (error) {
        // Log error but don't fail article creation
        console.error("Indexing failed:", error instanceof Error ? error.message : error)
      }
    }

    return article
  } catch (error) {
    console.error("DB insert failed:", error instanceof Error ? error.message : error)
    throw new Error("Failed to create article in database")
  }
}

/**
 * Schedule X publication for an article
 * Called automatically when article is published with x_post
 */
async function scheduleXPublicationForArticle(article: ArticleWithId): Promise<void> {
  try {
    const { createXPublication } = await import("@/lib/data/x-publications")
    const { enqueueXPublication } = await import("@/lib/queue/qstash")
    const { getSiteById } = await import("@/lib/data/sites")

    // Get site info for domain
    const site = await getSiteById(article.site_id)
    if (!site) {
      return
    }

    // Build article URL
    const articleUrl = site.custom_domain
      ? `https://${site.custom_domain}/article/${article.slug}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/site/${article.site_id}/article/${article.slug}`

    // Calculate scheduled time (published_at + 10 minutes)
    const publishedAt = new Date(article.published_at!)
    const scheduledFor = new Date(publishedAt.getTime() + 10 * 60 * 1000) // +10 minutes

    // Create X publication record
    const xPublication = await createXPublication({
      article_id: article.id,
      site_id: article.site_id,
      x_post_text: article.x_post!,
      article_url: articleUrl,
      scheduled_for: scheduledFor.toISOString()
    })

    // Enqueue job with 10-minute delay
    await enqueueXPublication(
      {
        publicationId: xPublication.id,
        articleId: article.id,
        siteId: article.site_id,
        xPostText: article.x_post!,
        scheduledFor: scheduledFor.toISOString()
      },
      600 // 10 minutes
    )

  } catch (error) {
    console.error("Scheduling error:", error instanceof Error ? error.message : error)
    throw error
  }
}

/**
 * Update an existing article
 *
 * @param id - Article ID
 * @param input - Fields to update
 * @returns Updated article
 */
export async function updateArticle(id: number, input: UpdateArticleInput): Promise<ArticleWithId> {
  try {
    const now = new Date().toISOString()

    // Build dynamic update query
    const updates: string[] = []
    const values: any[] = []
    let paramIndex = 1

    // Helper to add field to update
    const addUpdate = (field: string, value: any) => {
      updates.push(`${field} = $${paramIndex}`)
      values.push(value)
      paramIndex++
    }

    // Add fields that are present in input
    if (input.title !== undefined) addUpdate("title", input.title)
    if (input.slug !== undefined) addUpdate("slug", input.slug)
    if (input.content !== undefined) addUpdate("content", input.content)
    if (input.excerpt !== undefined) addUpdate("excerpt", input.excerpt)
    if (input.meta_description !== undefined) addUpdate("meta_description", input.meta_description)
    if (input.x_post !== undefined) addUpdate("x_post", input.x_post)
    if (input.featured_image_url !== undefined) addUpdate("featured_image_url", input.featured_image_url)
    if (input.featured_image_caption !== undefined) addUpdate("featured_image_caption", input.featured_image_caption)
    if (input.featured_image_alt !== undefined) addUpdate("featured_image_alt", input.featured_image_alt)
    if (input.category !== undefined) addUpdate("category", input.category)
    if (input.tags !== undefined) addUpdate("tags", input.tags)
    if (input.status !== undefined) addUpdate("status", input.status)
    if (input.published_at !== undefined) addUpdate("published_at", input.published_at)
    if (input.scheduled_at !== undefined) addUpdate("scheduled_at", input.scheduled_at)
    if (input.author_id !== undefined) addUpdate("author_id", input.author_id)
    if (input.source_type !== undefined) addUpdate("source_type", input.source_type)

    // Always update updated_at
    addUpdate("updated_at", now)

    if (updates.length === 1) {
      // Only updated_at changed, nothing to update
      throw new Error("No fields to update")
    }

    // Build and execute query
    const query = `
      UPDATE articles 
      SET ${updates.join(", ")}
      WHERE id = $${paramIndex}
      RETURNING *
    `
    values.push(id)

    const result = await sql.unsafe(query, values)

    if (result.length === 0) {
      throw new Error("Article not found")
    }

    return result[0] as ArticleWithId
  } catch (error) {
    console.error("DB update failed:", error instanceof Error ? error.message : error)
    throw error
  }
}

/**
 * Publish an article (set status to published and set published_at)
 *
 * @param id - Article ID
 * @param publishedAt - Optional custom publish date (defaults to now)
 * @returns Updated article
 */
export async function publishArticle(id: number, publishedAt?: string): Promise<ArticleWithId> {
  const now = new Date().toISOString()

  return updateArticle(id, {
    status: "published",
    published_at: publishedAt || now,
  })
}

/**
 * Schedule an article for future publication
 *
 * @param id - Article ID
 * @param scheduledAt - Scheduled publish date
 * @returns Updated article
 */
export async function scheduleArticle(id: number, scheduledAt: string): Promise<ArticleWithId> {
  return updateArticle(id, {
    status: "scheduled",
    scheduled_at: scheduledAt,
  })
}

/**
 * Unpublish an article (set status to draft)
 *
 * @param id - Article ID
 * @returns Updated article
 */
export async function unpublishArticle(id: number): Promise<ArticleWithId> {
  return updateArticle(id, {
    status: "draft",
    published_at: null,
  })
}

/**
 * Archive an article
 *
 * @param id - Article ID
 * @returns Updated article
 */
export async function archiveArticle(id: number): Promise<ArticleWithId> {
  return updateArticle(id, {
    status: "archived",
  })
}

/**
 * Bulk create articles
 *
 * @param articles - Array of article inputs
 * @returns Array of created articles
 */
export async function bulkCreateArticles(articles: CreateArticleInput[]): Promise<ArticleWithId[]> {
  try {
    const now = new Date().toISOString()

    const values = articles.flatMap(async (article) => {
      // Use generateUniqueSlug for slug generation in bulk
      const slug = await generateUniqueSlug(article.title, article.site_id)
      return [
        article.title,
        slug,
        article.content,
        article.excerpt || null,
        article.meta_description || null,
        article.x_post || null,
        article.featured_image_url || null,
        article.featured_image_caption || null,
        article.featured_image_alt || null,
        article.category || null,
        article.tags || null,
        article.status,
        article.published_at || null,
        article.scheduled_at || null,
        article.site_id,
        article.author_id || null,
        article.source_type || "manual",
        now,
        now,
      ]
    })

    const placeholders = articles
      .map((_, i) => {
        const start = i * 19 + 1
        return `($${start}, $${start + 1}, $${start + 2}, $${start + 3}, $${start + 4}, $${start + 5}, $${start + 6}, $${start + 7}, $${start + 8}, $${start + 9}, $${start + 10}, $${start + 11}, $${start + 12}, $${start + 13}, $${start + 14}, $${start + 15}, $${start + 16}, $${start + 17}, $${start + 18})`
      })
      .join(", ")

    const query = `
      INSERT INTO articles (
        title, slug, content, excerpt, meta_description, x_post,
        featured_image_url, featured_image_caption, featured_image_alt,
        category, tags, status, published_at, scheduled_at,
        site_id, author_id, source_type, created_at, updated_at
      ) VALUES ${placeholders}
      RETURNING *
    `

    const result = await sql.unsafe(query, await Promise.all(values))
    return result as ArticleWithId[]
  } catch (error) {
    console.error("Bulk insert failed:", error instanceof Error ? error.message : error)
    throw new Error("Failed to bulk create articles")
  }
}

/**
 * Check if slug exists for a site
 *
 * @param slug - Article slug
 * @param siteId - Site ID
 * @param excludeId - Optional article ID to exclude (for updates)
 * @returns True if slug exists
 */
export async function slugExists(slug: string, siteId: number, excludeId?: number): Promise<boolean> {
  try {
    const result = excludeId
      ? await sql`
          SELECT id FROM articles 
          WHERE slug = ${slug} 
          AND site_id = ${siteId}
          AND id != ${excludeId}
          LIMIT 1
        `
      : await sql`
          SELECT id FROM articles 
          WHERE slug = ${slug} 
          AND site_id = ${siteId}
          LIMIT 1
        `

    return result.length > 0
  } catch (error) {
    console.error("DB query failed:", error instanceof Error ? error.message : error)
    return false
  }
}

/**
 * Generate URL-friendly slug from title with transliteration
 * Supports multiple languages including Arabic, Chinese, Cyrillic, etc.
 *
 * @param title - Article title
 * @returns URL-friendly slug
 */
export function generateSlug(title: string): string {
  // Use slugify with transliteration for international character support
  let slug = slugify(title, {
    lower: true,
    strict: true,
    locale: "auto", // Auto-detect language for proper transliteration
    remove: /[*+~.()'"!:@]/g,
  })

  // Fallback if slug is empty or too short (e.g., only emojis)
  if (!slug || slug.length < 3) {
    slug = `article-${Date.now()}`
  }

  // Limit to 100 characters
  return slug.substring(0, 100)
}

/**
 * Generate a unique slug for a site
 * If slug exists, appends a numeric suffix (-1, -2, etc.)
 *
 * @param title - Article title
 * @param siteId - Site ID
 * @returns Unique slug
 */
export async function generateUniqueSlug(title: string, siteId: number): Promise<string> {
  const baseSlug = generateSlug(title)
  let slug = baseSlug
  let counter = 1

  // Check for collisions and add suffix if needed
  while (await slugExists(slug, siteId)) {
    // Keep base slug under 95 chars to leave room for suffix
    slug = `${baseSlug.substring(0, 95)}-${counter}`
    counter++

    // Safety limit to prevent infinite loops
    if (counter > 100) {
      throw new Error("Could not generate unique slug after 100 attempts")
    }
  }

  return slug
}
