/**
 * SEO Utilities
 *
 * Centralized SEO helper functions for generating optimized metadata,
 * structured data, and canonical URLs across the platform.
 */

/**
 * Generate canonical URL for a page
 */
export function generateCanonicalUrl(siteCustomDomain: string | null, siteId: number, path = ""): string {
  const baseUrl = siteCustomDomain ? `https://${siteCustomDomain}` : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  return `${baseUrl}${path}`
}

/**
 * Calculate reading time from content
 */
export function calculateReadingTime(content: string, wordsPerMinute = 200): number {
  const wordCount = content.split(/\s+/).length
  return Math.ceil(wordCount / wordsPerMinute)
}

/**
 * Extract first paragraph from HTML content for AI-optimized summaries
 */
export function extractFirstParagraph(htmlContent: string): string {
  const match = htmlContent.match(/<p[^>]*>(.*?)<\/p>/i)
  if (match && match[1]) {
    return match[1].replace(/<[^>]+>/g, "").trim()
  }
  return ""
}

/**
 * Generate keywords from article content
 */
export function generateKeywords(title: string, category: string | null, tags: string[] | null): string {
  const keywords: string[] = []

  // Add title words (excluding common words)
  const titleWords = title
    .toLowerCase()
    .split(/\s+/)
    .filter((word) => word.length > 3 && !["the", "and", "for", "with", "from"].includes(word))
  keywords.push(...titleWords)

  // Add category
  if (category) {
    keywords.push(category.toLowerCase())
  }

  // Add tags
  if (tags && tags.length > 0) {
    keywords.push(...tags.map((tag) => tag.toLowerCase()))
  }

  return [...new Set(keywords)].join(", ")
}

/**
 * Truncate text to specified length with ellipsis
 */
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text
  return text.substring(0, maxLength).trim() + "..."
}

/**
 * Generate AI-optimized content summary
 */
export function generateAISummary(title: string, excerpt: string | null, content: string, maxLength = 300): string {
  if (excerpt && excerpt.length > 50) {
    return truncateText(excerpt, maxLength)
  }

  const firstParagraph = extractFirstParagraph(content)
  if (firstParagraph) {
    return truncateText(firstParagraph, maxLength)
  }

  return truncateText(title, maxLength)
}
