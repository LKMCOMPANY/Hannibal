"use server"

/**
 * Publisher Server Actions
 *
 * Handles article creation and modification with validation and revalidation
 */

import { revalidatePath } from "next/cache"
import {
  createArticle as createArticleInDb,
  updateArticle as updateArticleInDb,
  publishArticle as publishArticleInDb,
  scheduleArticle as scheduleArticleInDb,
  unpublishArticle as unpublishArticleInDb,
  archiveArticle as archiveArticleInDb,
  bulkCreateArticles as bulkCreateArticlesInDb,
  slugExists,
  generateUniqueSlug,
  generateSlug,
} from "@/lib/data/publisher"
import { validateCreateArticle, validateUpdateArticle, generateExcerpt } from "@/lib/validation/articles"
import type {
  CreateArticleInput,
  UpdateArticleInput,
  PublisherResult,
  PublishOptions,
  BulkPublisherResult,
} from "@/lib/types/publisher"

/**
 * Create a new article
 */
export async function createArticle(input: CreateArticleInput, options: PublishOptions = {}): Promise<PublisherResult> {
  try {
    // Normalize slug server-side before validation.
    // The client generates slugs with a basic regex that produces empty strings
    // for non-Latin titles (Arabic, CJK, Cyrillic, etc.). We always use the
    // server-side slugify (with transliteration) as the source of truth.
    const normalizedSlug = generateSlug(input.title)
    if (!input.slug || !/^[a-z0-9-]+$/.test(input.slug) || normalizedSlug.length > 0) {
      input.slug = normalizedSlug || `article-${Date.now()}`
    }

    // Auto-generate fields if requested
    if (options.autoGenerate) {
      if (!input.slug) {
        input.slug = await generateUniqueSlug(input.title, input.site_id)
      }
      if (!input.excerpt && input.content) {
        input.excerpt = generateExcerpt(input.content)
      }
    }

    // Validate input
    if (options.validate !== false) {
      const validationErrors = validateCreateArticle(input)
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: "Validation failed",
          validationErrors: Object.fromEntries(validationErrors.map((e) => [e.field, e.message])),
        }
      }
    }

    // Check slug uniqueness
    const slugAlreadyExists = await slugExists(input.slug, input.site_id)
    if (slugAlreadyExists) {
      return {
        success: false,
        error: "Slug already exists for this site",
        validationErrors: { slug: "This slug is already in use" },
      }
    }

    // Create article
    const article = await createArticleInDb(input)

    // Revalidate paths
    if (options.revalidate !== false) {
      const paths = options.revalidatePaths || [
        "/dashboard/articles",
        `/dashboard/articles/${article.id}`,
        "/dashboard/campaigns/create",  // Revalidate campaign source articles list
      ]
      paths.forEach((path) => revalidatePath(path))
    }

    return {
      success: true,
      data: article,
    }
  } catch (error) {
    console.error("[v0] Error in createArticle action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create article",
    }
  }
}

/**
 * Update an existing article
 */
export async function updateArticle(
  id: number,
  input: UpdateArticleInput,
  options: PublishOptions = {},
): Promise<PublisherResult> {
  try {
    // Validate input
    if (options.validate !== false) {
      const validationErrors = validateUpdateArticle(input)
      if (validationErrors.length > 0) {
        return {
          success: false,
          error: "Validation failed",
          validationErrors: Object.fromEntries(validationErrors.map((e) => [e.field, e.message])),
        }
      }
    }

    // Check slug uniqueness if slug is being updated
    if (input.slug && input.site_id) {
      const slugAlreadyExists = await slugExists(input.slug, input.site_id, id)
      if (slugAlreadyExists) {
        return {
          success: false,
          error: "Slug already exists for this site",
          validationErrors: { slug: "This slug is already in use" },
        }
      }
    }

    // Update article
    const article = await updateArticleInDb(id, input)

    // Revalidate paths
    if (options.revalidate !== false) {
      const paths = options.revalidatePaths || ["/dashboard/articles", `/dashboard/articles/${id}`]
      paths.forEach((path) => revalidatePath(path))
    }

    return {
      success: true,
      data: article,
    }
  } catch (error) {
    console.error("[v0] Error in updateArticle action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update article",
    }
  }
}

/**
 * Publish an article
 */
export async function publishArticle(id: number, publishedAt?: string): Promise<PublisherResult> {
  try {
    const article = await publishArticleInDb(id, publishedAt)

    revalidatePath("/dashboard/articles")
    revalidatePath(`/dashboard/articles/${id}`)

    return {
      success: true,
      data: article,
    }
  } catch (error) {
    console.error("[v0] Error in publishArticle action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to publish article",
    }
  }
}

/**
 * Schedule an article for future publication
 */
export async function scheduleArticle(id: number, scheduledAt: string): Promise<PublisherResult> {
  try {
    const article = await scheduleArticleInDb(id, scheduledAt)

    revalidatePath("/dashboard/articles")
    revalidatePath(`/dashboard/articles/${id}`)

    return {
      success: true,
      data: article,
    }
  } catch (error) {
    console.error("[v0] Error in scheduleArticle action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to schedule article",
    }
  }
}

/**
 * Unpublish an article
 */
export async function unpublishArticle(id: number): Promise<PublisherResult> {
  try {
    const article = await unpublishArticleInDb(id)

    revalidatePath("/dashboard/articles")
    revalidatePath(`/dashboard/articles/${id}`)

    return {
      success: true,
      data: article,
    }
  } catch (error) {
    console.error("[v0] Error in unpublishArticle action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to unpublish article",
    }
  }
}

/**
 * Archive an article
 */
export async function archiveArticle(id: number): Promise<PublisherResult> {
  try {
    const article = await archiveArticleInDb(id)

    revalidatePath("/dashboard/articles")
    revalidatePath(`/dashboard/articles/${id}`)

    return {
      success: true,
      data: article,
    }
  } catch (error) {
    console.error("[v0] Error in archiveArticle action:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to archive article",
    }
  }
}

/**
 * Bulk create articles
 */
export async function bulkCreateArticles(
  articles: CreateArticleInput[],
  options: PublishOptions = {},
): Promise<BulkPublisherResult> {
  const results: PublisherResult[] = []
  const errors: Array<{ index: number; error: string }> = []
  let successCount = 0
  let failureCount = 0

  try {
    // Validate all articles first
    if (options.validate !== false) {
      for (let i = 0; i < articles.length; i++) {
        const validationErrors = validateCreateArticle(articles[i])
        if (validationErrors.length > 0) {
          failureCount++
          errors.push({
            index: i,
            error: `Validation failed: ${validationErrors.map((e) => e.message).join(", ")}`,
          })
          results.push({
            success: false,
            error: "Validation failed",
            validationErrors: Object.fromEntries(validationErrors.map((e) => [e.field, e.message])),
          })
        }
      }

      if (failureCount > 0) {
        return {
          success: false,
          successCount,
          failureCount,
          results,
          errors,
        }
      }
    }

    // Create all articles
    const createdArticles = await bulkCreateArticlesInDb(articles)
    successCount = createdArticles.length

    // Revalidate paths
    if (options.revalidate !== false) {
      revalidatePath("/dashboard/articles")
    }

    return {
      success: true,
      successCount,
      failureCount: 0,
      results: createdArticles.map((article) => ({
        success: true,
        data: article,
      })),
      errors: [],
    }
  } catch (error) {
    console.error("[v0] Error in bulkCreateArticles action:", error)
    return {
      success: false,
      successCount,
      failureCount: articles.length - successCount,
      results,
      errors: [
        ...errors,
        {
          index: -1,
          error: error instanceof Error ? error.message : "Failed to bulk create articles",
        },
      ],
    }
  }
}

/**
 * Check if a slug is available
 */
export async function checkSlugAvailability(
  slug: string,
  siteId: number,
  excludeId?: number,
): Promise<PublisherResult<boolean>> {
  try {
    const exists = await slugExists(slug, siteId, excludeId)
    return {
      success: true,
      data: !exists,
    }
  } catch (error) {
    console.error("[v0] Error checking slug availability:", error)
    return {
      success: false,
      error: "Failed to check slug availability",
    }
  }
}
