import { format, formatDistanceToNow } from "date-fns"
import {
  enUS,
  fr,
  es,
  ar,
  de,
  it,
  pt,
  ru,
  zhCN,
  ja,
  ko,
  hi,
  tr,
  nl,
  pl,
  sv,
  nb,
  da,
  fi,
  cs,
  hu,
  ro,
  uk,
  vi,
  th,
  id,
  ms,
  el,
  lt,
  bg,
  bn,
  hy,
  kk,
  sr,
  is,
  faIR,
  hr, // Added Croatian date-fns locale import
} from "date-fns/locale"
import type { Locale } from "../types"
import { LOCALE_CONFIGS } from "../types"

/**
 * Map locales to date-fns locale objects
 */
const DATE_FNS_LOCALES: Record<Locale, any> = {
  en: enUS,
  fr: fr,
  es: es,
  ar: ar,
  de: de,
  it: it,
  pt: pt,
  ru: ru,
  zh: zhCN,
  ja: ja,
  ko: ko,
  hi: hi,
  tr: tr,
  nl: nl,
  pl: pl,
  sv: sv,
  no: nb,
  da: da,
  fi: fi,
  cs: cs,
  hu: hu,
  ro: ro,
  uk: uk,
  vi: vi,
  th: th,
  id: id,
  ms: ms,
  el: el, // Greek
  lt: lt, // Lithuanian
  bg: bg, // Bulgarian
  bn: bn, // Bengali
  hy: hy, // Armenian
  sw: enUS, // Swahili - fallback to English
  yue: zhCN, // Cantonese - use Simplified Chinese
  kk: kk, // Kazakh
  sr: sr, // Serbian
  is: is, // Icelandic
  fa: faIR, // Persian/Farsi
  hr: hr, // Croatian
}

/**
 * Format a date using the locale's configured format
 */
export function formatLocalizedDate(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const dateFormat = LOCALE_CONFIGS[locale].dateFormat
  const dateFnsLocale = DATE_FNS_LOCALES[locale]

  return format(dateObj, dateFormat, { locale: dateFnsLocale })
}

/**
 * Format relative time (e.g., "2 hours ago")
 */
export function formatRelativeTime(date: Date | string, locale: Locale): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const dateFnsLocale = DATE_FNS_LOCALES[locale]

  return formatDistanceToNow(dateObj, { addSuffix: true, locale: dateFnsLocale })
}

/**
 * Format a date with custom format options
 * @param date - Date to format
 * @param locale - Locale to use for formatting
 * @param options - Intl.DateTimeFormatOptions for custom formatting
 */
export function formatDate(date: Date | string, locale: Locale, options?: Intl.DateTimeFormatOptions): string {
  const dateObj = typeof date === "string" ? new Date(date) : date
  const localeCode = LOCALE_CONFIGS[locale]?.code || "en"

  return new Intl.DateTimeFormat(localeCode, options).format(dateObj)
}

/**
 * Get date-fns locale object for a given locale
 */
export function getDateFnsLocale(locale: Locale) {
  return DATE_FNS_LOCALES[locale] || enUS
}
