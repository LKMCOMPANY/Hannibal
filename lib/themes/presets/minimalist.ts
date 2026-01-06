import type { ThemeConfig } from "@/lib/types/theme"

/**
 * Minimalist Theme Preset
 *
 * Ultra-clean design inspired by Medium, Substack, and The Browser.
 * Focus on longform readability with maximum content clarity.
 *
 * Key characteristics:
 * - Serif body text for comfortable long reading
 * - Sans-serif headlines for modern contrast
 * - Generous line heights for readability
 * - Minimal visual elements
 * - Narrow container for optimal reading line length
 * - Almost no shadows for pure content focus
 * - Minimal surface differentiation for clean aesthetic
 */
export const minimalistTheme: ThemeConfig = {
  id: "minimalist",
  name: "Minimalist",
  description: "Ultra-clean design focused on content and readability",

  fonts: {
    heading: "var(--font-sans)",
    body: "Georgia, 'Times New Roman', serif",
    mono: "var(--font-mono)",
  },

  fontSizes: {
    hero: "clamp(2.5rem, 5vw, 4rem)",
    h1: "clamp(2rem, 4vw, 3rem)",
    h2: "clamp(1.625rem, 3.25vw, 2.25rem)",
    h3: "clamp(1.375rem, 2.75vw, 1.75rem)",
    h4: "clamp(1.125rem, 2.25vw, 1.375rem)",
    body: "1.1875rem",
    small: "1.0625rem",
    tiny: "0.9375rem",
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
  },

  lineHeights: {
    tight: 1.35,
    normal: 1.7,
    relaxed: 1.85,
    loose: 2.0,
  },

  letterSpacing: {
    tighter: "-0.015em",
    tight: "-0.005em",
    normal: "0",
    wide: "0.005em",
    wider: "0.015em",
  },

  colors: {
    primary: "#000000",
    primaryHover: "#1a1a1a",
    accent: "#059669",
    accentHover: "#047857",
    background: "#ffffff",
    surface: "#ffffff",
    surfaceHover: "#fafafa",
    surfaceElevated: "#fafafa",
    surfaceSunken: "#fafafa",
    surfaceOverlay: "#ffffff",
    border: "#f0f0f0",
    borderHover: "#e5e5e5",
    text: {
      primary: "#1a1a1a",
      secondary: "#525252",
      muted: "#737373",
      inverse: "#ffffff",
    },
    dark: {
      primary: "#ffffff",
      primaryHover: "#f5f5f5",
      accent: "#34d399",
      accentHover: "#10b981",
      background: "#0a0a0a",
      surface: "#1a1a1a",
      surfaceHover: "#262626",
      surfaceElevated: "#262626",
      surfaceSunken: "#0a0a0a",
      surfaceOverlay: "#1a1a1a",
      border: "rgba(255, 255, 255, 0.08)",
      borderHover: "rgba(255, 255, 255, 0.12)",
      text: {
        primary: "#fafafa",
        secondary: "#d4d4d4",
        muted: "#a3a3a3",
        inverse: "#0a0a0a",
      },
    },
  },

  spacing: {
    section: "4.5rem",
    container: "2.5rem",
    card: "2rem",
    element: "1.25rem",
    tight: "0.625rem",
  },

  borderRadius: {
    card: "0.5rem",
    button: "0.375rem",
    image: "0.375rem",
    input: "0.375rem",
  },

  shadows: {
    card: "0 1px 2px 0 rgb(0 0 0 / 0.03)",
    cardHover: "0 2px 4px 0 rgb(0 0 0 / 0.04), 0 1px 2px -1px rgb(0 0 0 / 0.03)",
    button: "none",
    dropdown: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
  },

  transitions: {
    default: "all 0.2s ease",
    fast: "all 0.1s ease",
    slow: "all 0.3s ease",
  },

  layout: {
    containerMaxWidth: "680px",
    gridGap: "2rem",
    sidebarWidth: "280px",
    headerHeight: "4rem",
  },
}
