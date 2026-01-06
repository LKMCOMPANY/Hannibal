import type { ThemeConfig } from "@/lib/types/theme"

/**
 * Bold Theme Preset
 *
 * Strong, impactful design inspired by Vice, Complex, and The Outline.
 * Sharp edges, high contrast, and aggressive typography for youth-focused media.
 *
 * Key characteristics:
 * - Zero border radius for sharp, edgy aesthetic
 * - Heavy font weights throughout
 * - Tight letter spacing for impact
 * - Border-based shadows instead of soft shadows
 * - Fast, snappy transitions
 * - High contrast colors
 * - Strong surface differentiation with borders
 */
export const boldTheme: ThemeConfig = {
  id: "bold",
  name: "Bold",
  description: "Strong, impactful design for edgy and youth-focused media",

  fonts: {
    heading: "var(--font-sans)",
    body: "var(--font-sans)",
    mono: "var(--font-mono)",
  },

  fontSizes: {
    hero: "clamp(3.25rem, 6.5vw, 6rem)",
    h1: "clamp(2.75rem, 5.5vw, 5rem)",
    h2: "clamp(2.25rem, 4.5vw, 3.5rem)",
    h3: "clamp(1.75rem, 3.5vw, 2.5rem)",
    h4: "clamp(1.375rem, 2.75vw, 1.75rem)",
    body: "1.0625rem",
    small: "0.9375rem",
    tiny: "0.8125rem",
  },

  fontWeights: {
    light: 500,
    normal: 600,
    medium: 700,
    semibold: 800,
    bold: 900,
    extrabold: 900,
  },

  lineHeights: {
    tight: 1.0,
    normal: 1.3,
    relaxed: 1.5,
    loose: 1.65,
  },

  letterSpacing: {
    tighter: "-0.05em",
    tight: "-0.03em",
    normal: "-0.01em",
    wide: "0.01em",
    wider: "0.1em",
  },

  colors: {
    primary: "#0ea5e9",
    primaryHover: "#0284c7",
    accent: "#f59e0b",
    accentHover: "#d97706",
    background: "#ffffff",
    surface: "#f9fafb",
    surfaceHover: "#f3f4f6",
    surfaceElevated: "#ffffff",
    surfaceSunken: "#f3f4f6",
    surfaceOverlay: "#ffffff",
    border: "#e5e7eb",
    borderHover: "#d1d5db",
    text: {
      primary: "#111827",
      secondary: "#374151",
      muted: "#6b7280",
      inverse: "#ffffff",
    },
    dark: {
      primary: "#38bdf8",
      primaryHover: "#0ea5e9",
      accent: "#fbbf24",
      accentHover: "#f59e0b",
      background: "#111827",
      surface: "#1f2937",
      surfaceHover: "#374151",
      surfaceElevated: "#374151",
      surfaceSunken: "#111827",
      surfaceOverlay: "#1f2937",
      border: "rgba(255, 255, 255, 0.1)",
      borderHover: "rgba(255, 255, 255, 0.2)",
      text: {
        primary: "#f9fafb",
        secondary: "#d1d5db",
        muted: "#9ca3af",
        inverse: "#111827",
      },
    },
  },

  spacing: {
    section: "4rem",
    container: "2rem",
    card: "1.75rem",
    element: "1rem",
    tight: "0.5rem",
  },

  borderRadius: {
    card: "0",
    button: "0",
    image: "0",
    input: "0",
  },

  shadows: {
    card: "0 0 0 1px rgb(0 0 0 / 0.12)",
    cardHover: "0 0 0 2px rgb(0 0 0 / 0.2), 0 4px 8px 0 rgb(0 0 0 / 0.08)",
    button: "0 0 0 1px rgb(0 0 0 / 0.12)",
    dropdown: "0 0 0 1px rgb(0 0 0 / 0.12), 0 4px 6px -1px rgb(0 0 0 / 0.1)",
  },

  transitions: {
    default: "all 0.15s ease-out",
    fast: "all 0.08s ease-out",
    slow: "all 0.25s ease-out",
  },

  layout: {
    containerMaxWidth: "1480px",
    gridGap: "2rem",
    sidebarWidth: "340px",
    headerHeight: "4.5rem",
  },
}
