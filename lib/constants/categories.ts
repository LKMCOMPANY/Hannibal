/**
 * Article Categories
 *
 * Predefined categories for articles
 * Must match database CHECK constraint exactly
 */

export const ARTICLE_CATEGORIES = [
  { value: "Business", label: "Business" },
  { value: "Politics", label: "Politics" },
  { value: "Technology", label: "Technology" },
  { value: "Science", label: "Science" },
  { value: "Health", label: "Health" },
  { value: "Sports", label: "Sports" },
  { value: "Arts and Entertainment", label: "Arts and Entertainment" },
  { value: "Environment", label: "Environment" },
] as const

export type ArticleCategory = (typeof ARTICLE_CATEGORIES)[number]["value"]
