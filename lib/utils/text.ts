/**
 * Text Utilities
 * 
 * Utilities for text processing, truncation, and cleaning
 */

/**
 * Smart truncate text by keeping complete sentences
 * 
 * Truncates at sentence boundaries (. ! ?) instead of cutting mid-sentence
 * Falls back to word boundaries if no sentence fits
 * 
 * @param text - Text to truncate
 * @param maxLength - Maximum length
 * @returns Truncated text with complete sentences
 */
export function smartTruncate(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text

  // Split into sentences (. ! ? as delimiters)
  const sentenceRegex = /[.!?]+\s+/g
  const sentences: string[] = []
  let lastIndex = 0
  let match

  while ((match = sentenceRegex.exec(text)) !== null) {
    sentences.push(text.slice(lastIndex, match.index + match[0].length).trim())
    lastIndex = match.index + match[0].length
  }

  // Add remaining text as last sentence (if any)
  if (lastIndex < text.length) {
    sentences.push(text.slice(lastIndex).trim())
  }

  // Build result by adding complete sentences
  let result = ''
  for (const sentence of sentences) {
    const withSentence = result + (result ? ' ' : '') + sentence

    if (withSentence.length > maxLength) {
      // This sentence would exceed limit
      break
    }

    result = withSentence
  }

  // If no sentence fits (first sentence too long), fallback to word boundary
  if (!result || result.length === 0) {
    const truncated = text.slice(0, maxLength - 3)
    const lastSpace = truncated.lastIndexOf(' ')

    return lastSpace > 0
      ? truncated.slice(0, lastSpace) + "..."
      : truncated + "..."
  }

  return result
}

/**
 * Remove all URLs from text
 * 
 * Removes http://, https://, and www. URLs that AI might have included
 * Useful to clean AI-generated text before adding official URL
 * 
 * @param text - Text potentially containing URLs
 * @returns Text with URLs removed
 */
export function removeUrls(text: string): string {
  if (!text) return text

  // Regex to match URLs (http, https, www)
  const urlRegex = /(?:https?:\/\/|www\.)[^\s]+/gi

  return text
    .replace(urlRegex, '')  // Remove URLs
    .replace(/\s+/g, ' ')   // Normalize whitespace
    .trim()
}

/**
 * Calculate safe X post text length
 * 
 * Calculates maximum safe length for X post text (without URL)
 * Uses conservative estimation to ensure final post never exceeds 280 chars
 * 
 * @param hostname - Site hostname
 * @returns Maximum safe text length
 */
export function calculateSafeXPostLength(hostname: string): number {
  const maxSlugLength = 80  // Conservative estimation (most slugs < 80)
  const estimatedUrl = `https://${hostname}/article/${"x".repeat(maxSlugLength)}`
  const spaceBeforeUrl = 1
  const safetyMargin = 5  // Extra safety margin

  return 280 - estimatedUrl.length - spaceBeforeUrl - safetyMargin
}

/**
 * Prepare X post text for final tweet
 * 
 * Cleans and truncates AI-generated text, then adds article URL
 * Used by campaigns, autonomous, and manual publishing
 * 
 * @param aiGeneratedText - Text from AI (may contain URLs)
 * @param publicUrl - Actual article URL to append
 * @param maxTextLength - Maximum length for text alone (calculated beforehand)
 * @returns Complete X post text with URL
 */
export function prepareXPostText(
  aiGeneratedText: string,
  publicUrl: string,
  maxTextLength: number
): string {
  if (!aiGeneratedText) return publicUrl

  // 1. Remove any URLs the AI might have included
  let cleanText = removeUrls(aiGeneratedText)

  // 2. Smart truncate if still too long
  if (cleanText.length > maxTextLength) {
    cleanText = smartTruncate(cleanText, maxTextLength)
  }

  // 3. Add official URL
  return `${cleanText} ${publicUrl}`
}

