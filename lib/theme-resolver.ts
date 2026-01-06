/**
 * Theme Resolver (Refactored)
 *
 * New architecture: Returns universal components + theme configuration.
 * Themes are now pure design token configurations, not separate component sets.
 */

import type { ComponentType } from "react"
import type { SitePublicData } from "@/lib/site-resolver"
import type { PublicArticleListItem } from "@/lib/data/public-articles"
import type { ThemePreset } from "@/lib/types/theme"
import { isValidThemePreset } from "@/lib/themes/presets"
import type { ArticleCategory } from "@/lib/types/sites"

export type SiteHeaderProps = {
  site: SitePublicData
  categories: ArticleCategory[]
}

export type SiteHeroProps = {
  article: PublicArticleListItem | null
  siteId: number
}

export type ArticleCardProps = {
  article: PublicArticleListItem
  siteId: number
  featured?: boolean
}

export type ArticleGridProps = {
  articles: PublicArticleListItem[]
  siteId: number
}

export type SiteFooterProps = {
  site: SitePublicData
}

export type ThemeComponents = {
  SiteHeader: ComponentType<SiteHeaderProps>
  SiteHero: ComponentType<SiteHeroProps>
  ArticleCard: ComponentType<ArticleCardProps>
  ArticleGrid: ComponentType<ArticleGridProps>
  SiteFooter: ComponentType<SiteFooterProps>
}

/**
 * Get universal theme components
 * All sites now use the same components - styling is controlled via CSS variables
 */
export async function getThemeComponents(_themeLayout?: string | null): Promise<ThemeComponents> {
  const components = await import("@/components/site/universal")

  return {
    SiteHeader: components.SiteHeader,
    SiteHero: components.SiteHero,
    ArticleCard: components.ArticleCard,
    ArticleGrid: components.ArticleGrid,
    SiteFooter: components.SiteFooter,
  }
}

/**
 * Normalize theme preset from database value
 */
export function normalizeThemePreset(themeLayout: string | null): ThemePreset {
  if (!themeLayout) return "modern"

  // Map old theme names to new presets
  const themeMap: Record<string, ThemePreset> = {
    default: "modern",
    newspaper: "classic",
    modern: "modern",
    classic: "classic",
    magazine: "magazine",
    minimalist: "minimalist",
    bold: "bold",
  }

  const normalized = themeMap[themeLayout.toLowerCase()]
  return normalized && isValidThemePreset(normalized) ? normalized : "modern"
}

/**
 * Available themes for admin UI
 */
export const AVAILABLE_THEMES = [
  {
    value: "modern",
    label: "Modern Editorial",
    description: "Clean, contemporary design with excellent readability",
  },
  {
    value: "classic",
    label: "Classic Newspaper",
    description: "Traditional editorial design with elegant serif typography",
  },
  {
    value: "magazine",
    label: "Magazine",
    description: "Bold, image-focused design for lifestyle and culture media",
  },
  {
    value: "minimalist",
    label: "Minimalist",
    description: "Ultra-clean design focused on content and readability",
  },
  {
    value: "bold",
    label: "Bold",
    description: "Strong, impactful design for edgy and youth-focused media",
  },
] as const

export type ThemeLayout = (typeof AVAILABLE_THEMES)[number]["value"]
