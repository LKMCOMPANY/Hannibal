import type { ThemeConfig } from "@/lib/types/theme"

/**
 * Classic Newspaper Theme Preset
 *
 * Traditional editorial design inspired by The New York Times, The Guardian, and Le Monde.
 * Timeless serif typography with generous whitespace and refined hierarchy.
 *
 * Key characteristics:
 * - Serif fonts for authority and tradition
 * - Generous line heights for comfortable reading
 * - Minimal shadows for print-like aesthetic
 * - Wide spacing for elegance and breathing room
 * - Subtle borders for classic newspaper columns
 * - Subtle surface variations for traditional print feel
 */
export const classicTheme: ThemeConfig = {
  id: "classic",
  name: "Classic Newspaper",
  description: "Traditional editorial design with elegant serif typography",

  fonts: {
    heading: "Georgia, 'Times New Roman', serif",
    body: "Georgia, 'Times New Roman', serif",
    mono: "var(--font-mono)",
  },

  fontSizes: {
    hero: "clamp(3rem, 6vw, 5rem)",
    h1: "clamp(2.5rem, 5vw, 3.75rem)",
    h2: "clamp(1.875rem, 3.75vw, 2.5rem)",
    h3: "clamp(1.5rem, 3vw, 1.875rem)",
    h4: "clamp(1.25rem, 2.5vw, 1.5rem)",
    body: "1.125rem",
    small: "1rem",
    tiny: "0.875rem",
  },

  fontWeights: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 700,
  },

  lineHeights: {
    tight: 1.3,
    normal: 1.7,
    relaxed: 1.85,
    loose: 2.0,
  },

  letterSpacing: {
    tighter: "0",
    tight: "0.005em",
    normal: "0.01em",
    wide: "0.025em",
    wider: "0.05em",
  },

  colors: {
    primary: "#1a1a1a",
    primaryHover: "#000000",
    accent: "#b91c1c",
    accentHover: "#991b1b",
    background: "#fafaf9",
    surface: "#ffffff",
    surfaceHover: "#f5f5f4",
    surfaceElevated: "#ffffff",
    surfaceSunken: "#f5f5f4",
    surfaceOverlay: "#ffffff",
    border: "#e7e5e4",
    borderHover: "#d6d3d1",
    text: {
      primary: "#1c1917",
      secondary: "#44403c",
      muted: "#78716c",
      inverse: "#fafaf9",
    },
    dark: {
      primary: "#e7e5e4",
      primaryHover: "#fafafa",
      accent: "#ef4444",
      accentHover: "#dc2626",
      background: "#1c1917",
      surface: "#292524",
      surfaceHover: "#44403c",
      surfaceElevated: "#44403c",
      surfaceSunken: "#1c1917",
      surfaceOverlay: "#292524",
      border: "rgba(255, 255, 255, 0.1)",
      borderHover: "rgba(255, 255, 255, 0.15)",
      text: {
        primary: "#fafaf9",
        secondary: "#d6d3d1",
        muted: "#a8a29e",
        inverse: "#1c1917",
      },
    },
  },

  spacing: {
    section: "5.5rem",
    container: "3rem",
    card: "2.25rem",
    element: "1.5rem",
    tight: "0.875rem",
  },

  borderRadius: {
    card: "0.25rem",
    button: "0.25rem",
    image: "0.125rem",
    input: "0.25rem",
  },

  shadows: {
    card: "0 1px 2px 0 rgb(0 0 0 / 0.04)",
    cardHover: "0 2px 4px 0 rgb(0 0 0 / 0.06), 0 1px 2px -1px rgb(0 0 0 / 0.04)",
    button: "none",
    dropdown: "0 4px 6px -1px rgb(0 0 0 / 0.08), 0 2px 4px -2px rgb(0 0 0 / 0.06)",
  },

  transitions: {
    default: "all 0.3s ease-in-out",
    fast: "all 0.15s ease-in-out",
    slow: "all 0.5s ease-in-out",
  },

  layout: {
    containerMaxWidth: "1200px",
    gridGap: "2.5rem",
    sidebarWidth: "300px",
    headerHeight: "5rem",
  },
}
