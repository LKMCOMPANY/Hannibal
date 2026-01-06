import type { Locale, Dictionary } from "./types"
import { en } from "./locales/en"
import { fr } from "./locales/fr"
import { es } from "./locales/es"
import { ar } from "./locales/ar"
import { pt } from "./locales/pt"
import { de } from "./locales/de"
import { it } from "./locales/it"
import { ja } from "./locales/ja"
import { nl } from "./locales/nl"
import { sv } from "./locales/sv"
import { tr } from "./locales/tr"
import { id } from "./locales/id"
import { ro } from "./locales/ro"
import { da } from "./locales/da"
import { sw } from "./locales/sw"
import { el } from "./locales/el"
import { lt } from "./locales/lt"
import { hy } from "./locales/hy"
import { bn } from "./locales/bn"
import { yue } from "./locales/yue"
import { bg } from "./locales/bg"
import { hi } from "./locales/hi"
import { zh } from "./locales/zh"
import { ko } from "./locales/ko"
import { ru } from "./locales/ru"
import { pl } from "./locales/pl"
import { no } from "./locales/no"
import { fi } from "./locales/fi"
import { cs } from "./locales/cs"
import { hu } from "./locales/hu"
import { uk } from "./locales/uk"
import { vi } from "./locales/vi"
import { th } from "./locales/th"
import { ms } from "./locales/ms"
import { kk } from "./locales/kk"
import { sr } from "./locales/sr"
import { is } from "./locales/is"
import { fa } from "./locales/fa"
import { hr } from "./locales/hr"

/**
 * Dictionary registry
 * All supported languages now have proper translations
 */
const dictionaries: Record<Locale, () => Promise<Dictionary>> = {
  en: async () => en,
  fr: async () => fr,
  es: async () => es,
  ar: async () => ar,
  pt: async () => pt,
  de: async () => de,
  it: async () => it,
  ja: async () => ja,
  nl: async () => nl,
  sv: async () => sv,
  tr: async () => tr,
  id: async () => id,
  ro: async () => ro,
  da: async () => da,
  sw: async () => sw,
  el: async () => el,
  lt: async () => lt,
  hy: async () => hy,
  bn: async () => bn,
  yue: async () => yue,
  bg: async () => bg,
  hi: async () => hi,
  zh: async () => zh,
  ko: async () => ko,
  ru: async () => ru,
  pl: async () => pl,
  no: async () => no,
  fi: async () => fi,
  cs: async () => cs,
  hu: async () => hu,
  uk: async () => uk,
  vi: async () => vi,
  th: async () => th,
  ms: async () => ms,
  kk: async () => kk,
  sr: async () => sr,
  is: async () => is,
  fa: async () => fa,
  hr: async () => hr,
}

/**
 * Get dictionary for a locale (server-side)
 * Cached automatically by React
 */
export async function getDictionary(locale: Locale): Promise<Dictionary> {
  const dictionaryLoader = dictionaries[locale] || dictionaries.en
  const dictionary = await dictionaryLoader()

  return dictionary
}
