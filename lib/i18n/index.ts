/**
 * i18n Module Exports
 *
 * Central export point for all internationalization utilities.
 */

// Server-side utilities
export { getDictionary } from "./get-dictionary"

// Client-side utilities
export { useDictionary } from "./use-dictionary"

export { LanguageProvider, useLanguage } from "./language-context"
export { getLocaleFromSiteLanguage, getLocaleFromSiteLanguage as getLocaleFromSite } from "./get-locale-from-site"
export { translate, createTranslator } from "./translate"

// Date utilities
export { formatLocalizedDate, formatRelativeTime, formatDate, getDateFnsLocale } from "./utils/format-date"

// Pluralization utilities
export { getPluralForm, pluralize, formatNumber, formatCurrency, formatCompactNumber } from "./utils/pluralize"
export type { PluralForm, PluralTranslations } from "./utils/pluralize"

// Category utilities
export { getCategoryKey } from "./utils/category-key"

// Types
export type { Locale, Dictionary, TranslationKey, TranslationParams, LocaleConfig } from "./types"
export { LOCALE_CONFIGS } from "./types"

// Dictionaries (for direct import if needed)
export { en } from "./locales/en"
export { fr } from "./locales/fr"
export { es } from "./locales/es"
export { ar } from "./locales/ar"
export { pt } from "./locales/pt"
export { de } from "./locales/de"
export { it } from "./locales/it"
export { ja } from "./locales/ja"
export { nl } from "./locales/nl"
export { sv } from "./locales/sv"
export { tr } from "./locales/tr"
export { id } from "./locales/id"
export { ro } from "./locales/ro"
export { da } from "./locales/da"
export { sw } from "./locales/sw"
export { el } from "./locales/el"
export { lt } from "./locales/lt"
export { hy } from "./locales/hy"
export { bn } from "./locales/bn"
export { yue } from "./locales/yue"
export { bg } from "./locales/bg"
export { hi } from "./locales/hi"
export { zh } from "./locales/zh"
export { ko } from "./locales/ko"
export { ru } from "./locales/ru"
export { pl } from "./locales/pl"
export { no } from "./locales/no"
export { fi } from "./locales/fi"
export { cs } from "./locales/cs"
export { hu } from "./locales/hu"
export { uk } from "./locales/uk"
export { vi } from "./locales/vi"
export { th } from "./locales/th"
export { ms } from "./locales/ms"
export { kk } from "./locales/kk"
export { sr } from "./locales/sr"
export { is } from "./locales/is"
export { fa } from "./locales/fa"
export { hr } from "./locales/hr"
