import type { ThemeConfig } from "@/lib/types/theme"

/**
 * Magazine Theme Preset
 *
 * Bold, image-driven design inspired by Vogue, GQ, and National Geographic.
 * Dramatic typography with strong visual hierarchy and generous whitespace.
 *
 * Key characteristics:
 * - Large, impactful headlines
 * - Tight line heights for dramatic effect
 * - Strong shadows for depth and dimension
 * - Generous spacing for luxury feel
 * - Large border radius for modern magazine aesthetic
 * - Pronounced surface elevation for dramatic depth
 */
export const magazineTheme: ThemeConfig = {
  id: "magazine",
  name: "Magazine",
  description: "Bold, image-focused design for lifestyle and culture media",

  fonts: {
    heading: "var(--font-sans)",
    body: "var(--font-sans)",
    mono: "var(--font-mono)",
  },

  fontSizes: {
    hero: "clamp(3.5rem, 7vw, 6rem)",
    h1: "clamp(2.75rem, 5.5vw, 4.5rem)",
    h2: "clamp(2.125rem, 4.25vw, 3rem)",
    h3: "clamp(1.625rem, 3.25vw, 2.25rem)",
    h4: "clamp(1.375rem, 2.75vw, 1.75rem)",
    body: "1.125rem",
    small: "1rem",
    tiny: "0.875rem",
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 600,
    semibold: 700,
    bold: 800,
    extrabold: 900,
  },

  lineHeights: {
    tight: 1.05,
    normal: 1.4,
    relaxed: 1.6,
    loose: 1.75,
  },

  letterSpacing: {
    tighter: "-0.04em",
    tight: "-0.025em",
    normal: "0",
    wide: "0.025em",
    wider: "0.075em",
  },

  colors: {
    primary: "#dc2626",
    primaryHover: "#b91c1c",
    accent: "#ea580c",
    accentHover: "#c2410c",
    background: "#ffffff",
    surface: "#fafafa",
    surfaceHover: "#f5f5f5",
    surfaceElevated: "#ffffff",
    surfaceSunken: "#f5f5f5",
    surfaceOverlay: "#ffffff",
    border: "#e5e5e5",
    borderHover: "#d4d4d4",
    text: {
      primary: "#171717",
      secondary: "#404040",
      muted: "#737373",
      inverse: "#ffffff",
    },
    dark: {
      primary: "#f87171",
      primaryHover: "#ef4444",
      accent: "#fb923c",
      accentHover: "#f97316",
      background: "#171717",
      surface: "#262626",
      surfaceHover: "#404040",
      surfaceElevated: "#404040",
      surfaceSunken: "#171717",
      surfaceOverlay: "#262626",
      border: "rgba(255, 255, 255, 0.1)",
      borderHover: "rgba(255, 255, 255, 0.15)",
      text: {
        primary: "#fafafa",
        secondary: "#d4d4d4",
        muted: "#a3a3a3",
        inverse: "#171717",
      },
    },
  },

  spacing: {
    section: "6.5rem",
    container: "3.5rem",
    card: "2.5rem",
    element: "1.75rem",
    tight: "1rem",
  },

  borderRadius: {
    card: "1.25rem",
    button: "0.875rem",
    image: "1rem",
    input: "0.625rem",
  },

  shadows: {
    card: "0 4px 6px -1px rgb(0 0 0 / 0.12), 0 2px 4px -2px rgb(0 0 0 / 0.08)",
    cardHover: "0 20px 25px -5px rgb(0 0 0 / 0.15), 0 8px 10px -6px rgb(0 0 0 / 0.1)",
    button: "0 2px 4px 0 rgb(0 0 0 / 0.12)",
    dropdown: "0 10px 15px -3px rgb(0 0 0 / 0.12), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
  },

  transitions: {
    default: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 0.2s cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "all 0.6s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  layout: {
    containerMaxWidth: "1440px",
    gridGap: "3rem",
    sidebarWidth: "380px",
    headerHeight: "5rem",
  },
}
