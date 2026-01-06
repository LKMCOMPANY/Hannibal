/**
 * Theme Presets Registry
 *
 * Central registry for all available theme presets.
 */

import type { ThemeConfig, ThemePreset } from "@/lib/types/theme"
import { modernTheme } from "./modern"
import { classicTheme } from "./classic"
import { magazineTheme } from "./magazine"
import { minimalistTheme } from "./minimalist"
import { boldTheme } from "./bold"

/**
 * All available theme presets
 */
export const THEME_PRESETS: Record<ThemePreset, ThemeConfig> = {
  modern: modernTheme,
  classic: classicTheme,
  magazine: magazineTheme,
  minimalist: minimalistTheme,
  bold: boldTheme,
}

/**
 * Default theme preset
 */
export const DEFAULT_THEME_PRESET: ThemePreset = "modern"

/**
 * Get theme preset by ID
 */
export function getThemePreset(preset: ThemePreset): ThemeConfig {
  return THEME_PRESETS[preset] || THEME_PRESETS[DEFAULT_THEME_PRESET]
}

/**
 * Get all theme presets as array
 */
export function getAllThemePresets(): ThemeConfig[] {
  return Object.values(THEME_PRESETS)
}

/**
 * Check if preset exists
 */
export function isValidThemePreset(preset: string): preset is ThemePreset {
  return preset in THEME_PRESETS
}
