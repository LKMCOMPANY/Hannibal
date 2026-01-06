import type { Locale } from "./types"

/**
 * Map database language codes to supported locales
 * Handles various language code formats (en, en-US, en_US, etc.)
 * Added all missing locale mappings for complete international support
 */
export function getLocaleFromSiteLanguage(siteLanguage: string | null | undefined): Locale {
  if (!siteLanguage) {
    return "en" // Default fallback
  }

  // Normalize the language code (lowercase, extract base language)
  const normalized = siteLanguage.toLowerCase().split(/[-_]/)[0]

  const localeMap: Record<string, Locale> = {
    en: "en",
    fr: "fr",
    es: "es",
    ar: "ar",
    de: "de",
    it: "it",
    pt: "pt",
    ru: "ru",
    zh: "zh",
    ja: "ja",
    ko: "ko",
    hi: "hi",
    tr: "tr",
    nl: "nl",
    pl: "pl",
    sv: "sv",
    no: "no",
    da: "da",
    fi: "fi",
    cs: "cs",
    hu: "hu",
    ro: "ro",
    uk: "uk",
    vi: "vi",
    th: "th",
    id: "id",
    ms: "ms",
    sw: "sw", // Swahili
    el: "el", // Greek
    lt: "lt", // Lithuanian
    hy: "hy", // Armenian
    bn: "bn", // Bengali
    yue: "yue", // Cantonese
    bg: "bg", // Bulgarian
    kk: "kk", // Kazakh
    sr: "sr", // Serbian
    is: "is", // Icelandic
    fa: "fa", // Persian/Farsi
    hr: "hr", // Croatian
  }

  const result = localeMap[normalized] || "en"

  return result
}

export const getLocaleFromSite = getLocaleFromSiteLanguage
