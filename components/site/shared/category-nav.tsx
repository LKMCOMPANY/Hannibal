"use client"

import Link from "next/link"
import { ChevronRight } from "lucide-react"
import { useDictionary, getCategoryKey } from "@/lib/i18n"

type CategoryNavProps = {
  categories: { category: string; count: number }[]
  siteId: number
}

export function CategoryNav({ categories, siteId }: CategoryNavProps) {
  const { t } = useDictionary()

  if (!categories.length) return null

  return (
    <div className="border-b border-border/50 bg-muted/20">
      <div className="container mx-auto px-4">
        <nav className="flex items-center gap-2 overflow-x-auto py-4 scrollbar-hide">
          {categories.slice(0, 8).map((cat) => (
            <Link
              key={cat.category}
              href={`/category/${encodeURIComponent(cat.category)}`}
              className="group flex items-center gap-1.5 rounded-full px-3 py-1 text-sm font-medium text-foreground/70 transition-all duration-300 hover:bg-[var(--site-primary)] hover:text-white whitespace-nowrap"
            >
              {t(`category.${getCategoryKey(cat.category)}`, { fallback: cat.category })}
            </Link>
          ))}

          {categories.length > 8 && (
            <Link
              href="/categories"
              className="flex items-center gap-1 rounded-full px-3 py-1 text-sm font-medium text-[var(--site-primary)] transition-all duration-300 hover:bg-[var(--site-primary)] hover:text-white whitespace-nowrap"
            >
              {t("action.viewAll")}
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </nav>
      </div>
    </div>
  )
}
