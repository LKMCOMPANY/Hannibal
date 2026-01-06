/**
 * i18n Type Definitions
 *
 * Type-safe internationalization types for the Hannibal platform.
 */

import type { Dictionary } from "./locales/en"

/**
 * Supported locales
 */
export type Locale =
  | "en"
  | "fr"
  | "es"
  | "ar"
  | "de"
  | "it"
  | "pt"
  | "ru"
  | "zh"
  | "ja"
  | "ko"
  | "hi"
  | "tr"
  | "nl"
  | "pl"
  | "sv"
  | "no"
  | "da"
  | "fi"
  | "cs"
  | "hu"
  | "ro"
  | "uk"
  | "vi"
  | "th"
  | "id"
  | "ms"
  | "sw" // Swahili
  | "el" // Greek
  | "lt" // Lithuanian
  | "hy" // Armenian
  | "bn" // Bengali
  | "yue" // Cantonese
  | "bg" // Bulgarian
  | "kk" // Kazakh
  | "sr" // Serbian
  | "is" // Icelandic
  | "fa" // Persian/Farsi
  | "hr" // Croatian // Added Croatian locale

/**
 * Dictionary type (exported from en.ts)
 */
export type { Dictionary }

/**
 * Translation key paths (for type-safe access)
 */
export type TranslationKey =
  | `nav.${keyof Dictionary["nav"]}`
  | `action.${keyof Dictionary["action"]}`
  | `time.${keyof Dictionary["time"]}`
  | `comments.${keyof Dictionary["comments"]}`
  | `newsletter.${keyof Dictionary["newsletter"]}`
  | `category.${keyof Dictionary["category"]}`
  | `article.${keyof Dictionary["article"]}`
  | `categoryPage.${keyof Dictionary["categoryPage"]}`
  | `author.${keyof Dictionary["author"]}`
  | `search.${keyof Dictionary["search"]}`
  | `footer.${keyof Dictionary["footer"]}`
  | `error.${keyof Dictionary["error"]}`
  | `aria.${keyof Dictionary["aria"]}`
  | `seo.${keyof Dictionary["seo"]}`
  | `social.${keyof Dictionary["social"]}`
  | `form.${keyof Dictionary["form"]}`
  | `pagination.${keyof Dictionary["pagination"]}`
  | `filter.${keyof Dictionary["filter"]}`
  | `loading.${keyof Dictionary["loading"]}`
  | `breakingNews.${keyof Dictionary["breakingNews"]}` // Added breakingNews section to TranslationKey type

/**
 * Translation parameters for interpolation
 */
export type TranslationParams = Record<string, string | number>

/**
 * Locale configuration
 */
export type LocaleConfig = {
  code: Locale
  name: string
  nativeName: string
  direction: "ltr" | "rtl"
  dateFormat: string
}

/**
 * Locale metadata for all supported languages
 */
export const LOCALE_CONFIGS: Record<Locale, LocaleConfig> = {
  en: {
    code: "en",
    name: "English",
    nativeName: "English",
    direction: "ltr",
    dateFormat: "MMM d, yyyy",
  },
  fr: {
    code: "fr",
    name: "French",
    nativeName: "Français",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  es: {
    code: "es",
    name: "Spanish",
    nativeName: "Español",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  ar: {
    code: "ar",
    name: "Arabic",
    nativeName: "العربية",
    direction: "rtl",
    dateFormat: "d MMM yyyy",
  },
  de: {
    code: "de",
    name: "German",
    nativeName: "Deutsch",
    direction: "ltr",
    dateFormat: "d. MMM yyyy",
  },
  it: {
    code: "it",
    name: "Italian",
    nativeName: "Italiano",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  pt: {
    code: "pt",
    name: "Portuguese",
    nativeName: "Português",
    direction: "ltr",
    dateFormat: "d 'de' MMM 'de' yyyy",
  },
  ru: {
    code: "ru",
    name: "Russian",
    nativeName: "Русский",
    direction: "ltr",
    dateFormat: "d MMM yyyy 'г.'",
  },
  zh: {
    code: "zh",
    name: "Chinese",
    nativeName: "中文",
    direction: "ltr",
    dateFormat: "yyyy年M月d日",
  },
  ja: {
    code: "ja",
    name: "Japanese",
    nativeName: "日本語",
    direction: "ltr",
    dateFormat: "yyyy年M月d日",
  },
  ko: {
    code: "ko",
    name: "Korean",
    nativeName: "한국어",
    direction: "ltr",
    dateFormat: "yyyy년 M월 d일",
  },
  hi: {
    code: "hi",
    name: "Hindi",
    nativeName: "हिन्दी",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  tr: {
    code: "tr",
    name: "Turkish",
    nativeName: "Türkçe",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  nl: {
    code: "nl",
    name: "Dutch",
    nativeName: "Nederlands",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  pl: {
    code: "pl",
    name: "Polish",
    nativeName: "Polski",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  sv: {
    code: "sv",
    name: "Swedish",
    nativeName: "Svenska",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  no: {
    code: "no",
    name: "Norwegian",
    nativeName: "Norsk",
    direction: "ltr",
    dateFormat: "d. MMM yyyy",
  },
  da: {
    code: "da",
    name: "Danish",
    nativeName: "Dansk",
    direction: "ltr",
    dateFormat: "d. MMM yyyy",
  },
  fi: {
    code: "fi",
    name: "Finnish",
    nativeName: "Suomi",
    direction: "ltr",
    dateFormat: "d. MMM yyyy",
  },
  cs: {
    code: "cs",
    name: "Czech",
    nativeName: "Čeština",
    direction: "ltr",
    dateFormat: "d. M. yyyy",
  },
  hu: {
    code: "hu",
    name: "Hungarian",
    nativeName: "Magyar",
    direction: "ltr",
    dateFormat: "yyyy. MMM d.",
  },
  ro: {
    code: "ro",
    name: "Romanian",
    nativeName: "Română",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  uk: {
    code: "uk",
    name: "Ukrainian",
    nativeName: "Українська",
    direction: "ltr",
    dateFormat: "d MMM yyyy 'р.'",
  },
  vi: {
    code: "vi",
    name: "Vietnamese",
    nativeName: "Tiếng Việt",
    direction: "ltr",
    dateFormat: "d 'tháng' M, yyyy",
  },
  th: {
    code: "th",
    name: "Thai",
    nativeName: "ไทย",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  id: {
    code: "id",
    name: "Indonesian",
    nativeName: "Bahasa Indonesia",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  ms: {
    code: "ms",
    name: "Malay",
    nativeName: "Bahasa Melayu",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  sw: {
    code: "sw",
    name: "Swahili",
    nativeName: "Kiswahili",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  el: {
    code: "el",
    name: "Greek",
    nativeName: "Ελληνικά",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  lt: {
    code: "lt",
    name: "Lithuanian",
    nativeName: "Lietuvių",
    direction: "ltr",
    dateFormat: "yyyy-MM-dd",
  },
  hy: {
    code: "hy",
    name: "Armenian",
    nativeName: "Հայերեն",
    direction: "ltr",
    dateFormat: "dd.MM.yyyy",
  },
  bn: {
    code: "bn",
    name: "Bengali",
    nativeName: "বাংলা",
    direction: "ltr",
    dateFormat: "d MMM yyyy",
  },
  yue: {
    code: "yue",
    name: "Cantonese",
    nativeName: "粵語",
    direction: "ltr",
    dateFormat: "yyyy年M月d日",
  },
  bg: {
    code: "bg",
    name: "Bulgarian",
    nativeName: "Български",
    direction: "ltr",
    dateFormat: "d.MM.yyyy 'г.'",
  },
  kk: {
    code: "kk",
    name: "Kazakh",
    nativeName: "Қазақша",
    direction: "ltr",
    dateFormat: "dd.MM.yyyy",
  },
  sr: {
    code: "sr",
    name: "Serbian",
    nativeName: "Српски",
    direction: "ltr",
    dateFormat: "d.M.yyyy.",
  },
  is: {
    code: "is",
    name: "Icelandic",
    nativeName: "Íslenska",
    direction: "ltr",
    dateFormat: "d. MMM yyyy",
  },
  fa: {
    code: "fa",
    name: "Persian",
    nativeName: "فارسی",
    direction: "rtl",
    dateFormat: "d MMM yyyy",
  },
  hr: {
    code: "hr",
    name: "Croatian",
    nativeName: "Hrvatski",
    direction: "ltr",
    dateFormat: "d. M. yyyy.",
  },
} as const
