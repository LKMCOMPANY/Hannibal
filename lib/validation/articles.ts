/**
 * Article Validation Module
 *
 * Provides validation functions for article data
 */

import type { CreateArticleInput, UpdateArticleInput, ValidationError } from "@/lib/types/publisher"

/**
 * Validate article creation input
 */
export function validateCreateArticle(input: CreateArticleInput): ValidationError[] {
  const errors: ValidationError[] = []

  // Required fields
  if (!input.title || input.title.trim().length === 0) {
    errors.push({ field: "title", message: "Title is required" })
  } else if (input.title.length > 255) {
    errors.push({ field: "title", message: "Title must be less than 255 characters" })
  }

  if (!input.slug || input.slug.trim().length === 0) {
    errors.push({ field: "slug", message: "Slug is required" })
  } else if (!/^[a-z0-9-]+$/.test(input.slug)) {
    errors.push({ field: "slug", message: "Slug must contain only lowercase letters, numbers, and hyphens" })
  }

  if (input.status === "published" || input.status === "scheduled") {
    if (!input.content || input.content.trim().length === 0) {
      errors.push({ field: "content", message: "Content is required for publication" })
    }
    if (!input.author_id) {
      errors.push({ field: "author_id", message: "Author is required for publication" })
    }
    if (!input.excerpt || input.excerpt.trim().length === 0) {
      errors.push({ field: "excerpt", message: "Excerpt is required for publication" })
    }
    if (!input.category || input.category.trim().length === 0) {
      errors.push({ field: "category", message: "Category is required for publication" })
    }
  }

  if (!input.site_id || input.site_id <= 0) {
    errors.push({ field: "site_id", message: "Valid site ID is required" })
  }

  if (!input.status) {
    errors.push({ field: "status", message: "Status is required" })
  } else if (!["draft", "scheduled", "published", "archived"].includes(input.status)) {
    errors.push({ field: "status", message: "Invalid status value" })
  }

  // Optional field validation
  if (input.excerpt && input.excerpt.length > 500) {
    errors.push({ field: "excerpt", message: "Excerpt must be less than 500 characters" })
  }

  if (input.meta_description && input.meta_description.length > 160) {
    errors.push({ field: "meta_description", message: "Meta description must be less than 160 characters" })
  }

  if (input.category && input.category.length > 100) {
    errors.push({ field: "category", message: "Category must be less than 100 characters" })
  }

  // Status-specific validation
  if (input.status === "scheduled" && !input.scheduled_at) {
    errors.push({ field: "scheduled_at", message: "Scheduled date is required for scheduled articles" })
  }

  if (input.status === "published" && !input.published_at) {
    errors.push({ field: "published_at", message: "Published date is required for published articles" })
  }

  // URL validation
  if (input.featured_image_url && !isValidUrl(input.featured_image_url)) {
    errors.push({ field: "featured_image_url", message: "Invalid image URL" })
  }

  return errors
}

/**
 * Validate article update input
 */
export function validateUpdateArticle(input: UpdateArticleInput): ValidationError[] {
  const errors: ValidationError[] = []

  // Only validate fields that are present
  if (input.title !== undefined) {
    if (input.title.trim().length === 0) {
      errors.push({ field: "title", message: "Title cannot be empty" })
    } else if (input.title.length > 255) {
      errors.push({ field: "title", message: "Title must be less than 255 characters" })
    }
  }

  if (input.slug !== undefined) {
    if (input.slug.trim().length === 0) {
      errors.push({ field: "slug", message: "Slug cannot be empty" })
    } else if (!/^[a-z0-9-]+$/.test(input.slug)) {
      errors.push({ field: "slug", message: "Slug must contain only lowercase letters, numbers, and hyphens" })
    }
  }

  if (input.content !== undefined && input.content.trim().length === 0) {
    errors.push({ field: "content", message: "Content cannot be empty" })
  }

  if (input.status !== undefined && !["draft", "scheduled", "published", "archived"].includes(input.status)) {
    errors.push({ field: "status", message: "Invalid status value" })
  }

  if (input.excerpt !== undefined && input.excerpt.length > 500) {
    errors.push({ field: "excerpt", message: "Excerpt must be less than 500 characters" })
  }

  if (input.meta_description !== undefined && input.meta_description.length > 160) {
    errors.push({ field: "meta_description", message: "Meta description must be less than 160 characters" })
  }

  if (input.featured_image_url !== undefined && !isValidUrl(input.featured_image_url)) {
    errors.push({ field: "featured_image_url", message: "Invalid image URL" })
  }

  return errors
}

/**
 * Helper: Validate URL format
 */
function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

/**
 * Helper: Generate excerpt from content
 */
export function generateExcerpt(content: string, maxLength = 200): string {
  // Strip HTML tags
  const plainText = content.replace(/<[^>]*>/g, "")

  if (plainText.length <= maxLength) {
    return plainText
  }

  // Truncate at word boundary
  const truncated = plainText.substring(0, maxLength)
  const lastSpace = truncated.lastIndexOf(" ")

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + "..." : truncated + "..."
}
