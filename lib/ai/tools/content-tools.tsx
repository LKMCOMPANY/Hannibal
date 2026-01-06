/**
 * Content Tools
 *
 * Reusable utility functions for content manipulation
 * Can be used by multiple agents
 */

/**
 * Strip HTML tags from content
 */
export function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, "")
}

/**
 * Count words in text
 */
export function countWords(text: string): number {
  return text
    .trim()
    .split(/\s+/)
    .filter((word) => word.length > 0).length
}

/**
 * Count characters in text
 */
export function countCharacters(text: string): number {
  return text.length
}

/**
 * Truncate text to specified length
 */
export function truncateText(text: string, maxLength: number, suffix = "..."): string {
  if (text.length <= maxLength) return text

  const truncated = text.substring(0, maxLength - suffix.length)
  const lastSpace = truncated.lastIndexOf(" ")

  return lastSpace > 0 ? truncated.substring(0, lastSpace) + suffix : truncated + suffix
}

/**
 * Extract first paragraph from HTML content
 */
export function extractFirstParagraph(html: string): string {
  const match = html.match(/<p[^>]*>(.*?)<\/p>/i)
  return match ? stripHtml(match[1]) : ""
}

/**
 * Calculate reading time in minutes
 */
export function calculateReadingTime(text: string, wordsPerMinute = 200): number {
  const words = countWords(stripHtml(text))
  return Math.ceil(words / wordsPerMinute)
}

/**
 * Extract headings from HTML content
 */
export function extractHeadings(html: string): Array<{ level: number; text: string }> {
  const headingRegex = /<h([1-6])[^>]*>(.*?)<\/h\1>/gi
  const headings: Array<{ level: number; text: string }> = []

  let match
  while ((match = headingRegex.exec(html)) !== null) {
    headings.push({
      level: Number.parseInt(match[1]),
      text: stripHtml(match[2]),
    })
  }

  return headings
}

/**
 * Generate excerpt from content
 */
export function generateExcerpt(html: string, maxLength = 200): string {
  const plainText = stripHtml(html)
  return truncateText(plainText, maxLength)
}

/**
 * Validate HTML structure
 */
export function isValidHtml(html: string): boolean {
  try {
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    return !doc.querySelector("parsererror")
  } catch {
    return false
  }
}

/**
 * Clean and normalize HTML
 */
export function normalizeHtml(html: string): string {
  return html
    .replace(/\s+/g, " ") // Normalize whitespace
    .replace(/>\s+</g, "><") // Remove whitespace between tags
    .trim()
}

/**
 * Extract keywords from text (simple implementation)
 */
export function extractKeywords(text: string, limit = 10): string[] {
  const plainText = stripHtml(text).toLowerCase()

  // Remove common words
  const stopWords = new Set([
    "the",
    "a",
    "an",
    "and",
    "or",
    "but",
    "in",
    "on",
    "at",
    "to",
    "for",
    "of",
    "with",
    "by",
    "from",
    "as",
    "is",
    "was",
    "are",
    "were",
    "been",
    "be",
    "have",
    "has",
    "had",
    "do",
    "does",
    "did",
    "will",
    "would",
    "could",
    "should",
    "may",
    "might",
    "must",
    "can",
    "this",
    "that",
    "these",
    "those",
  ])

  // Extract words
  const words = plainText.split(/\W+/).filter((word) => word.length > 3 && !stopWords.has(word))

  // Count frequency
  const frequency = new Map<string, number>()
  words.forEach((word) => {
    frequency.set(word, (frequency.get(word) || 0) + 1)
  })

  // Sort by frequency and return top keywords
  return Array.from(frequency.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, limit)
    .map(([word]) => word)
}

/**
 * Check content quality metrics
 */
export function analyzeContentQuality(html: string): {
  wordCount: number
  characterCount: number
  readingTime: number
  paragraphCount: number
  headingCount: number
  hasImages: boolean
  hasLinks: boolean
} {
  const plainText = stripHtml(html)

  return {
    wordCount: countWords(plainText),
    characterCount: countCharacters(plainText),
    readingTime: calculateReadingTime(plainText),
    paragraphCount: (html.match(/<p[^>]*>/gi) || []).length,
    headingCount: (html.match(/<h[1-6][^>]*>/gi) || []).length,
    hasImages: /<img[^>]*>/i.test(html),
    hasLinks: /<a[^>]*>/i.test(html),
  }
}
