import type { Dictionary, TranslationParams } from "./types"

/**
 * Get nested translation value from dictionary
 */
function getNestedValue(obj: any, path: string): string | undefined {
  const keys = path.split(".")
  let current = obj

  for (const key of keys) {
    if (current && typeof current === "object" && key in current) {
      current = current[key]
    } else {
      return undefined
    }
  }

  return typeof current === "string" ? current : undefined
}

/**
 * Interpolate parameters into translation string
 */
function interpolate(template: string, params?: TranslationParams): string {
  if (!params) return template

  return template.replace(/\{(\w+)\}/g, (match, key) => {
    return params[key] !== undefined ? String(params[key]) : match
  })
}

/**
 * Translate a key using the dictionary
 */
export function translate(dictionary: Dictionary, key: string, params?: TranslationParams): string {
  const value = getNestedValue(dictionary, key)

  if (!value) {
    console.warn(`[i18n] Missing translation for key: ${key}`)
    return key
  }

  return interpolate(value, params)
}

/**
 * Create a translation function bound to a dictionary
 */
export function createTranslator(dictionary: Dictionary) {
  return (key: string, params?: TranslationParams) => translate(dictionary, key, params)
}
