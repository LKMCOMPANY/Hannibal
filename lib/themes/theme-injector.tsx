/**
 * Theme CSS Injector
 *
 * Generates and injects theme CSS variables into the page.
 * This is the core of the new theming system.
 */

import type { ThemePreset, ThemeOverrides } from "@/lib/types/theme"
import { resolveTheme } from "./theme-utils"
import { generateThemeCSS } from "./theme-utils"

type ThemeInjectorProps = {
  preset: ThemePreset
  overrides?: ThemeOverrides
}

/**
 * Server component that injects theme CSS variables
 */
export function ThemeInjector({ preset, overrides }: ThemeInjectorProps) {
  const theme = resolveTheme(preset, overrides)
  const css = generateThemeCSS(theme)

  const enhancedCSS = `
    ${css}
    
    /* Apply theme colors based on light/dark mode */
    :root:not(.dark) {
      --theme-current-primary: var(--theme-primary);
      --theme-current-primary-hover: var(--theme-primary-hover);
      --theme-current-accent: var(--theme-accent);
      --theme-current-accent-hover: var(--theme-accent-hover);
      --theme-current-bg: var(--theme-bg);
      --theme-current-surface: var(--theme-surface);
      --theme-current-surface-hover: var(--theme-surface-hover);
      --theme-current-surface-elevated: var(--theme-surface-elevated);
      --theme-current-surface-sunken: var(--theme-surface-sunken);
      --theme-current-surface-overlay: var(--theme-surface-overlay);
      --theme-current-border: var(--theme-border);
      --theme-current-border-hover: var(--theme-border-hover);
      --theme-current-text-primary: var(--theme-text-primary);
      --theme-current-text-secondary: var(--theme-text-secondary);
      --theme-current-text-muted: var(--theme-text-muted);
      --theme-current-text-inverse: var(--theme-text-inverse);
    }
    
    .dark {
      --theme-current-primary: var(--theme-dark-primary);
      --theme-current-primary-hover: var(--theme-dark-primary-hover);
      --theme-current-accent: var(--theme-dark-accent);
      --theme-current-accent-hover: var(--theme-dark-accent-hover);
      --theme-current-bg: var(--theme-dark-bg);
      --theme-current-surface: var(--theme-dark-surface);
      --theme-current-surface-hover: var(--theme-dark-surface-hover);
      --theme-current-surface-elevated: var(--theme-dark-surface-elevated);
      --theme-current-surface-sunken: var(--theme-dark-surface-sunken);
      --theme-current-surface-overlay: var(--theme-dark-surface-overlay);
      --theme-current-border: var(--theme-dark-border);
      --theme-current-border-hover: var(--theme-dark-border-hover);
      --theme-current-text-primary: var(--theme-dark-text-primary);
      --theme-current-text-secondary: var(--theme-dark-text-secondary);
      --theme-current-text-muted: var(--theme-dark-text-muted);
      --theme-current-text-inverse: var(--theme-dark-text-inverse);
    }
  `

  return (
    <style
      dangerouslySetInnerHTML={{
        __html: enhancedCSS,
      }}
    />
  )
}
