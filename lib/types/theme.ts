/**
 * Theme System Type Definitions
 *
 * Comprehensive type-safe design token system for multi-tenant theming.
 * Supports unlimited themes with zero code duplication.
 */

// ============================================================================
// Design Token Types
// ============================================================================

/**
 * Typography tokens for font families
 */
export type FontFamilyTokens = {
  heading: string
  body: string
  mono: string
}

/**
 * Typography tokens for font sizes (responsive with clamp)
 */
export type FontSizeTokens = {
  hero: string
  h1: string
  h2: string
  h3: string
  h4: string
  body: string
  small: string
  tiny: string
}

/**
 * Typography tokens for font weights
 */
export type FontWeightTokens = {
  light: number
  normal: number
  medium: number
  semibold: number
  bold: number
  extrabold: number
}

/**
 * Typography tokens for line heights
 */
export type LineHeightTokens = {
  tight: number
  normal: number
  relaxed: number
  loose: number
}

/**
 * Typography tokens for letter spacing
 */
export type LetterSpacingTokens = {
  tighter: string
  tight: string
  normal: string
  wide: string
  wider: string
}

/**
 * Color tokens for text
 */
export type TextColorTokens = {
  primary: string
  secondary: string
  muted: string
  inverse: string
}

/**
 * Comprehensive color tokens with dark mode support and multi-level surfaces
 */
export type ColorTokens = {
  // Light mode colors
  primary: string
  primaryHover: string
  accent: string
  accentHover: string
  background: string
  surface: string
  surfaceHover: string
  surfaceElevated: string
  surfaceSunken: string
  surfaceOverlay: string
  border: string
  borderHover: string
  text: TextColorTokens
  // Dark mode colors
  dark: {
    primary: string
    primaryHover: string
    accent: string
    accentHover: string
    background: string
    surface: string
    surfaceHover: string
    surfaceElevated: string
    surfaceSunken: string
    surfaceOverlay: string
    border: string
    borderHover: string
    text: TextColorTokens
  }
}

/**
 * Spacing tokens for layout
 */
export type SpacingTokens = {
  section: string
  container: string
  card: string
  element: string
  tight: string
}

/**
 * Border radius tokens
 */
export type BorderRadiusTokens = {
  card: string
  button: string
  image: string
  input: string
}

/**
 * Shadow tokens for depth
 */
export type ShadowTokens = {
  card: string
  cardHover: string
  button: string
  dropdown: string
}

/**
 * Transition tokens for animations
 */
export type TransitionTokens = {
  default: string
  fast: string
  slow: string
}

/**
 * Layout tokens for grid and container
 */
export type LayoutTokens = {
  containerMaxWidth: string
  gridGap: string
  sidebarWidth: string
  headerHeight: string
}

/**
 * Complete theme configuration
 */
export type ThemeConfig = {
  id: string
  name: string
  description: string
  fonts: FontFamilyTokens
  fontSizes: FontSizeTokens
  fontWeights: FontWeightTokens
  lineHeights: LineHeightTokens
  letterSpacing: LetterSpacingTokens
  colors: ColorTokens
  spacing: SpacingTokens
  borderRadius: BorderRadiusTokens
  shadows: ShadowTokens
  transitions: TransitionTokens
  layout: LayoutTokens
}

/**
 * Theme preset identifier
 */
export type ThemePreset = "modern" | "classic" | "magazine" | "minimalist" | "bold"

/**
 * Custom theme overrides (for user customization)
 */
export type ThemeOverrides = {
  primaryColor?: string
  accentColor?: string
}

/**
 * Resolved theme (preset + overrides)
 */
export type ResolvedTheme = ThemeConfig & {
  preset: ThemePreset
  overrides?: ThemeOverrides
}

// ============================================================================
// CSS Variable Mapping
// ============================================================================

/**
 * Maps theme tokens to CSS variable names
 */
export const CSS_VAR_MAP = {
  // Fonts
  "fonts.heading": "--theme-font-heading",
  "fonts.body": "--theme-font-body",
  "fonts.mono": "--theme-font-mono",

  // Font Sizes
  "fontSizes.hero": "--theme-text-hero",
  "fontSizes.h1": "--theme-text-h1",
  "fontSizes.h2": "--theme-text-h2",
  "fontSizes.h3": "--theme-text-h3",
  "fontSizes.h4": "--theme-text-h4",
  "fontSizes.body": "--theme-text-body",
  "fontSizes.small": "--theme-text-small",
  "fontSizes.tiny": "--theme-text-tiny",

  // Font Weights
  "fontWeights.light": "--theme-weight-light",
  "fontWeights.normal": "--theme-weight-normal",
  "fontWeights.medium": "--theme-weight-medium",
  "fontWeights.semibold": "--theme-weight-semibold",
  "fontWeights.bold": "--theme-weight-bold",
  "fontWeights.extrabold": "--theme-weight-extrabold",

  // Line Heights
  "lineHeights.tight": "--theme-leading-tight",
  "lineHeights.normal": "--theme-leading-normal",
  "lineHeights.relaxed": "--theme-leading-relaxed",
  "lineHeights.loose": "--theme-leading-loose",

  // Letter Spacing
  "letterSpacing.tighter": "--theme-tracking-tighter",
  "letterSpacing.tight": "--theme-tracking-tight",
  "letterSpacing.normal": "--theme-tracking-normal",
  "letterSpacing.wide": "--theme-tracking-wide",
  "letterSpacing.wider": "--theme-tracking-wider",

  // Colors (Light Mode)
  "colors.primary": "--theme-primary",
  "colors.primaryHover": "--theme-primary-hover",
  "colors.accent": "--theme-accent",
  "colors.accentHover": "--theme-accent-hover",
  "colors.background": "--theme-bg",
  "colors.surface": "--theme-surface",
  "colors.surfaceHover": "--theme-surface-hover",
  "colors.surfaceElevated": "--theme-surface-elevated",
  "colors.surfaceSunken": "--theme-surface-sunken",
  "colors.surfaceOverlay": "--theme-surface-overlay",
  "colors.border": "--theme-border",
  "colors.borderHover": "--theme-border-hover",
  "colors.text.primary": "--theme-text-primary",
  "colors.text.secondary": "--theme-text-secondary",
  "colors.text.muted": "--theme-text-muted",
  "colors.text.inverse": "--theme-text-inverse",

  // Colors (Dark Mode)
  "colors.dark.primary": "--theme-dark-primary",
  "colors.dark.primaryHover": "--theme-dark-primary-hover",
  "colors.dark.accent": "--theme-dark-accent",
  "colors.dark.accentHover": "--theme-dark-accent-hover",
  "colors.dark.background": "--theme-dark-bg",
  "colors.dark.surface": "--theme-dark-surface",
  "colors.dark.surfaceHover": "--theme-dark-surface-hover",
  "colors.dark.surfaceElevated": "--theme-dark-surface-elevated",
  "colors.dark.surfaceSunken": "--theme-dark-surface-sunken",
  "colors.dark.surfaceOverlay": "--theme-dark-surface-overlay",
  "colors.dark.border": "--theme-dark-border",
  "colors.dark.borderHover": "--theme-dark-border-hover",
  "colors.dark.text.primary": "--theme-dark-text-primary",
  "colors.dark.text.secondary": "--theme-dark-text-secondary",
  "colors.dark.text.muted": "--theme-dark-text-muted",
  "colors.dark.text.inverse": "--theme-dark-text-inverse",

  // Spacing
  "spacing.section": "--theme-space-section",
  "spacing.container": "--theme-space-container",
  "spacing.card": "--theme-space-card",
  "spacing.element": "--theme-space-element",
  "spacing.tight": "--theme-space-tight",

  // Border Radius
  "borderRadius.card": "--theme-radius-card",
  "borderRadius.button": "--theme-radius-button",
  "borderRadius.image": "--theme-radius-image",
  "borderRadius.input": "--theme-radius-input",

  // Shadows
  "shadows.card": "--theme-shadow-card",
  "shadows.cardHover": "--theme-shadow-card-hover",
  "shadows.button": "--theme-shadow-button",
  "shadows.dropdown": "--theme-shadow-dropdown",

  // Transitions
  "transitions.default": "--theme-transition",
  "transitions.fast": "--theme-transition-fast",
  "transitions.slow": "--theme-transition-slow",

  // Layout
  "layout.containerMaxWidth": "--theme-container-max",
  "layout.gridGap": "--theme-grid-gap",
  "layout.sidebarWidth": "--theme-sidebar-width",
  "layout.headerHeight": "--theme-header-height",
} as const
