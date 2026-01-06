import type { ThemeConfig } from "@/lib/types/theme"

/**
 * Modern Editorial Theme Preset
 *
 * Contemporary digital-first design inspired by The Verge, TechCrunch, and Bloomberg.
 * Optimized for tech, business, and fast-paced news with excellent screen readability.
 *
 * Key characteristics:
 * - Sans-serif throughout for digital clarity
 * - Moderate line heights for scanning
 * - Subtle shadows for depth without distraction
 * - Balanced spacing for information density
 * - Multi-level surfaces for clear visual hierarchy
 */
export const modernTheme: ThemeConfig = {
  id: "modern",
  name: "Modern Editorial",
  description: "Contemporary digital-first design with excellent readability",

  fonts: {
    heading: "var(--font-sans)",
    body: "var(--font-sans)",
    mono: "var(--font-mono)",
  },

  fontSizes: {
    hero: "clamp(2.75rem, 5.5vw, 4.5rem)",
    h1: "clamp(2.25rem, 4.5vw, 3.25rem)",
    h2: "clamp(1.75rem, 3.5vw, 2.25rem)",
    h3: "clamp(1.375rem, 2.75vw, 1.75rem)",
    h4: "clamp(1.125rem, 2.25vw, 1.375rem)",
    body: "1.0625rem",
    small: "0.9375rem",
    tiny: "0.8125rem",
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
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.65,
    loose: 1.8,
  },

  letterSpacing: {
    tighter: "-0.025em",
    tight: "-0.015em",
    normal: "0",
    wide: "0.015em",
    wider: "0.025em",
  },

  colors: {
    primary: "#2563eb",
    primaryHover: "#1d4ed8",
    accent: "#7c3aed",
    accentHover: "#6d28d9",
    background: "#ffffff",
    surface: "#f8fafc",
    surfaceHover: "#f1f5f9",
    surfaceElevated: "#ffffff",
    surfaceSunken: "#f1f5f9",
    surfaceOverlay: "#ffffff",
    border: "#e2e8f0",
    borderHover: "#cbd5e1",
    text: {
      primary: "#0f172a",
      secondary: "#475569",
      muted: "#64748b",
      inverse: "#ffffff",
    },
    dark: {
      primary: "#60a5fa",
      primaryHover: "#3b82f6",
      accent: "#a78bfa",
      accentHover: "#8b5cf6",
      background: "#0f172a",
      surface: "#1e293b",
      surfaceHover: "#334155",
      surfaceElevated: "#334155",
      surfaceSunken: "#0f172a",
      surfaceOverlay: "#1e293b",
      border: "rgba(255, 255, 255, 0.1)",
      borderHover: "rgba(255, 255, 255, 0.2)",
      text: {
        primary: "#f1f5f9",
        secondary: "#cbd5e1",
        muted: "#94a3b8",
        inverse: "#0f172a",
      },
    },
  },

  spacing: {
    section: "4.5rem",
    container: "2rem",
    card: "1.5rem",
    element: "1rem",
    tight: "0.5rem",
  },

  borderRadius: {
    card: "0.75rem",
    button: "0.5rem",
    image: "0.625rem",
    input: "0.5rem",
  },

  shadows: {
    card: "0 1px 3px 0 rgb(0 0 0 / 0.08), 0 1px 2px -1px rgb(0 0 0 / 0.06)",
    cardHover: "0 10px 15px -3px rgb(0 0 0 / 0.08), 0 4px 6px -4px rgb(0 0 0 / 0.06)",
    button: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
    dropdown: "0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.08)",
  },

  transitions: {
    default: "all 0.25s cubic-bezier(0.4, 0, 0.2, 1)",
    fast: "all 0.15s cubic-bezier(0.4, 0, 0.2, 1)",
    slow: "all 0.4s cubic-bezier(0.4, 0, 0.2, 1)",
  },

  layout: {
    containerMaxWidth: "1280px",
    gridGap: "2rem",
    sidebarWidth: "320px",
    headerHeight: "4rem",
  },
}
