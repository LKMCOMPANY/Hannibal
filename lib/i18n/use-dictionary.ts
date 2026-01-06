"use client"

import { useLanguage } from "./language-context"
import type { TranslationParams } from "./types"
import { translate } from "./translate"

/**
 * Client-side hook to access dictionary and translation function
 */
export function useDictionary() {
  const { dictionary, locale, direction } = useLanguage()

  const t = (key: string, params?: TranslationParams) => {
    return translate(dictionary, key, params)
  }

  return {
    dictionary,
    locale,
    direction,
    t,
  }
}
