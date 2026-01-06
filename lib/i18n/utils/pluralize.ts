/**
 * Advanced Pluralization Utilities
 *
 * Implements CLDR-compliant pluralization rules for all supported locales.
 * Uses Intl.PluralRules for native browser support.
 */

import type { Locale } from "../types"

/**
 * Plural forms supported by CLDR
 */
export type PluralForm = "zero" | "one" | "two" | "few" | "many" | "other"

/**
 * Plural translations object
 */
export type PluralTranslations = {
  zero?: string
  one: string
  two?: string
  few?: string
  many?: string
  other: string
}

/**
 * Get the correct plural form for a given count and locale
 *
 * @param locale - Target locale
 * @param count - Number to determine plural form
 * @param translations - Object with plural forms
 * @returns The appropriate translated string
 *
 * @example
 * ```ts
 * const result = pluralize('en', 1, {
 *   one: '{count} article',
 *   other: '{count} articles'
 * })
 * // Returns: "1 article"
 * ```
 */
export function pluralize(locale: Locale, count: number, translations: PluralTranslations): string {
  // Create plural rules for the locale
  const pr = new Intl.PluralRules(locale)
  const rule = pr.select(count) as PluralForm

  // Get the translation for this plural form, fallback to 'other'
  const template = translations[rule] || translations.other

  // Replace {count} placeholder with actual count
  return template.replace(/\{count\}/g, count.toString())
}

/**
 * Format a number according to locale
 *
 * @param locale - Target locale
 * @param number - Number to format
 * @param options - Intl.NumberFormat options
 * @returns Formatted number string
 *
 * @example
 * ```ts
 * formatNumber('fr', 1234.56) // "1 234,56"
 * formatNumber('en', 1234.56) // "1,234.56"
 * ```
 */
export function formatNumber(
  locale: Locale,
  number: number,
  options?: Intl.NumberFormatOptions,
): string {
  return new Intl.NumberFormat(locale, options).format(number)
}

/**
 * Format a currency amount according to locale
 *
 * @param locale - Target locale
 * @param amount - Amount to format
 * @param currency - Currency code (e.g., 'USD', 'EUR')
 * @returns Formatted currency string
 *
 * @example
 * ```ts
 * formatCurrency('fr', 1234.56, 'EUR') // "1 234,56 €"
 * formatCurrency('en', 1234.56, 'USD') // "$1,234.56"
 * ```
 */
export function formatCurrency(locale: Locale, amount: number, currency: string): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
  }).format(amount)
}

/**
 * Format a compact number (e.g., 1.2K, 3.4M)
 *
 * @param locale - Target locale
 * @param number - Number to format
 * @returns Compact formatted number
 *
 * @example
 * ```ts
 * formatCompactNumber('en', 1234) // "1.2K"
 * formatCompactNumber('en', 1234567) // "1.2M"
 * ```
 */
export function formatCompactNumber(locale: Locale, number: number): string {
  return new Intl.NumberFormat(locale, {
    notation: "compact",
    compactDisplay: "short",
  }).format(number)
}
