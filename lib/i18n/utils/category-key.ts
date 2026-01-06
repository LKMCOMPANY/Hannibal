/**
 * Convert category name to dictionary key
 * Handles proper camelCase conversion for category translations
 *
 * IMPORTANT: This function now preserves Unicode characters for international support.
 * For Asian, Indian, and other non-Latin scripts, we use a normalized slug approach
 * that maintains the original characters while creating valid keys.
 *
 * Examples:
 * "Business" -> "business"
 * "Arts and Entertainment" -> "artsAndEntertainment"
 * "Politics" -> "politics"
 * "ビジネス" -> "ビジネス" (Japanese - preserved)
 * "व्यापार" -> "व्यापार" (Hindi - preserved)
 * "ব্যবসা" -> "ব্যবসা" (Bengali - preserved)
 */
export function getCategoryKey(category: string): string {
  if (!category || category.trim().length === 0) {
    return "all"
  }

  const trimmed = category.trim()

  const isLatinOnly = /^[a-zA-Z0-9\s\-_&]+$/.test(trimmed)

  if (isLatinOnly) {
    // For Latin scripts, use camelCase conversion
    const words = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, "")
      .split(/\s+/)
      .filter(Boolean)

    if (words.length === 0) return trimmed.toLowerCase()

    // First word lowercase, rest capitalized (camelCase)
    return words
      .map((word, index) => {
        if (index === 0) return word
        return word.charAt(0).toUpperCase() + word.slice(1)
      })
      .join("")
  } else {
    // Remove only whitespace and special punctuation, keep Unicode letters and numbers
    return trimmed
      .toLowerCase()
      .replace(/[\s\-_&]+/g, "")
      .trim()
  }
}
