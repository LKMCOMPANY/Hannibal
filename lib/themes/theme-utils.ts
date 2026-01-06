/**
 * Theme Utility Functions
 *
 * Helper functions for theme manipulation and CSS generation.
 */

import type { ThemeConfig, ThemeOverrides, ResolvedTheme, ThemePreset } from "@/lib/types/theme"
import { CSS_VAR_MAP } from "@/lib/types/theme"
import { getThemePreset } from "./presets"

/**
 * Apply custom color overrides to a theme
 */
export function applyThemeOverrides(theme: ThemeConfig, overrides?: ThemeOverrides): ThemeConfig {
  if (!overrides) return theme

  const updatedTheme = { ...theme }

  if (overrides.primaryColor) {
    updatedTheme.colors = {
      ...updatedTheme.colors,
      primary: overrides.primaryColor,
      primaryHover: adjustColorBrightness(overrides.primaryColor, -10),
    }
  }

  if (overrides.accentColor) {
    updatedTheme.colors = {
      ...updatedTheme.colors,
      accent: overrides.accentColor,
      accentHover: adjustColorBrightness(overrides.accentColor, -10),
    }
  }

  return updatedTheme
}

/**
 * Resolve theme from preset and overrides
 */
export function resolveTheme(preset: ThemePreset, overrides?: ThemeOverrides): ResolvedTheme {
  const baseTheme = getThemePreset(preset)
  const finalTheme = applyThemeOverrides(baseTheme, overrides)

  return {
    ...finalTheme,
    preset,
    overrides,
  }
}

/**
 * Generate CSS variables from theme config
 */
export function generateThemeCSS(theme: ThemeConfig): string {
  const lightVars: string[] = []
  const darkVars: string[] = []

  // Helper to add CSS variable
  const addVar = (path: string, value: string | number, isDark = false) => {
    const cssVarName = CSS_VAR_MAP[path as keyof typeof CSS_VAR_MAP]
    if (cssVarName) {
      const varDeclaration = `  ${cssVarName}: ${value};`
      if (isDark) {
        darkVars.push(varDeclaration)
      } else {
        lightVars.push(varDeclaration)
      }
    }
  }

  // Fonts
  addVar("fonts.heading", theme.fonts.heading)
  addVar("fonts.body", theme.fonts.body)
  addVar("fonts.mono", theme.fonts.mono)

  // Font Sizes
  Object.entries(theme.fontSizes).forEach(([key, value]) => {
    addVar(`fontSizes.${key}`, value)
  })

  // Font Weights
  Object.entries(theme.fontWeights).forEach(([key, value]) => {
    addVar(`fontWeights.${key}`, value)
  })

  // Line Heights
  Object.entries(theme.lineHeights).forEach(([key, value]) => {
    addVar(`lineHeights.${key}`, value)
  })

  // Letter Spacing
  Object.entries(theme.letterSpacing).forEach(([key, value]) => {
    addVar(`letterSpacing.${key}`, value)
  })

  // Colors
  addVar("colors.primary", theme.colors.primary)
  addVar("colors.primaryHover", theme.colors.primaryHover)
  addVar("colors.accent", theme.colors.accent)
  addVar("colors.accentHover", theme.colors.accentHover)
  addVar("colors.background", theme.colors.background)
  addVar("colors.surface", theme.colors.surface)
  addVar("colors.surfaceHover", theme.colors.surfaceHover)
  addVar("colors.surfaceElevated", theme.colors.surfaceElevated)
  addVar("colors.surfaceSunken", theme.colors.surfaceSunken)
  addVar("colors.surfaceOverlay", theme.colors.surfaceOverlay)
  addVar("colors.border", theme.colors.border)
  addVar("colors.borderHover", theme.colors.borderHover)
  addVar("colors.text.primary", theme.colors.text.primary)
  addVar("colors.text.secondary", theme.colors.text.secondary)
  addVar("colors.text.muted", theme.colors.text.muted)
  addVar("colors.text.inverse", theme.colors.text.inverse)

  // Dark Mode Colors
  addVar("colors.dark.primary", theme.colors.dark.primary, true)
  addVar("colors.dark.primaryHover", theme.colors.dark.primaryHover, true)
  addVar("colors.dark.accent", theme.colors.dark.accent, true)
  addVar("colors.dark.accentHover", theme.colors.dark.accentHover, true)
  addVar("colors.dark.background", theme.colors.dark.background, true)
  addVar("colors.dark.surface", theme.colors.dark.surface, true)
  addVar("colors.dark.surfaceHover", theme.colors.dark.surfaceHover, true)
  addVar("colors.dark.surfaceElevated", theme.colors.dark.surfaceElevated, true)
  addVar("colors.dark.surfaceSunken", theme.colors.dark.surfaceSunken, true)
  addVar("colors.dark.surfaceOverlay", theme.colors.dark.surfaceOverlay, true)
  addVar("colors.dark.border", theme.colors.dark.border, true)
  addVar("colors.dark.borderHover", theme.colors.dark.borderHover, true)
  addVar("colors.dark.text.primary", theme.colors.dark.text.primary, true)
  addVar("colors.dark.text.secondary", theme.colors.dark.text.secondary, true)
  addVar("colors.dark.text.muted", theme.colors.dark.text.muted, true)
  addVar("colors.dark.text.inverse", theme.colors.dark.text.inverse, true)

  // Spacing
  Object.entries(theme.spacing).forEach(([key, value]) => {
    addVar(`spacing.${key}`, value)
  })

  // Border Radius
  Object.entries(theme.borderRadius).forEach(([key, value]) => {
    addVar(`borderRadius.${key}`, value)
  })

  // Shadows
  Object.entries(theme.shadows).forEach(([key, value]) => {
    addVar(`shadows.${key}`, value)
  })

  // Transitions
  Object.entries(theme.transitions).forEach(([key, value]) => {
    addVar(`transitions.${key}`, value)
  })

  // Layout
  Object.entries(theme.layout).forEach(([key, value]) => {
    addVar(`layout.${key}`, value)
  })

  return `:root {\n${lightVars.join("\n")}\n}\n\n.dark {\n${darkVars.join("\n")}\n}`
}

/**
 * Adjust color brightness (for hover states)
 */
function adjustColorBrightness(hex: string, percent: number): string {
  // Remove # if present
  hex = hex.replace("#", "")

  // Convert to RGB
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)

  // Adjust brightness
  const adjust = (value: number) => {
    const adjusted = value + (value * percent) / 100
    return Math.max(0, Math.min(255, Math.round(adjusted)))
  }

  const newR = adjust(r)
  const newG = adjust(g)
  const newB = adjust(b)

  // Convert back to hex
  const toHex = (value: number) => value.toString(16).padStart(2, "0")

  return `#${toHex(newR)}${toHex(newG)}${toHex(newB)}`
}

/**
 * Convert hex to RGB for CSS variables
 */
export function hexToRgb(hex: string): string {
  hex = hex.replace("#", "")
  const r = Number.parseInt(hex.substring(0, 2), 16)
  const g = Number.parseInt(hex.substring(2, 4), 16)
  const b = Number.parseInt(hex.substring(4, 6), 16)
  return `${r}, ${g}, ${b}`
}
