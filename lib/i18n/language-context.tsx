"use client"

import { createContext, useContext, type ReactNode } from "react"
import type { Locale, Dictionary } from "./types"

type LanguageContextValue = {
  locale: Locale
  dictionary: Dictionary
  direction: "ltr" | "rtl"
}

const LanguageContext = createContext<LanguageContextValue | null>(null)

type LanguageProviderProps = {
  locale: Locale
  dictionary: Dictionary
  direction: "ltr" | "rtl"
  children: ReactNode
}

export function LanguageProvider({ locale, dictionary, direction, children }: LanguageProviderProps) {
  return <LanguageContext.Provider value={{ locale, dictionary, direction }}>{children}</LanguageContext.Provider>
}

export function useLanguage() {
  const context = useContext(LanguageContext)
  if (!context) {
    throw new Error("useLanguage must be used within a LanguageProvider")
  }
  return context
}
