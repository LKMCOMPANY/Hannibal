"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { Search, Loader2 } from "lucide-react"
import { useDebounce } from "use-debounce"
import { searchArticlesAction } from "@/lib/actions/articles"
import type { ArticleSearchResult } from "@/lib/types/articles"
import { Input } from "@/components/ui/input"
import { cn } from "@/lib/utils"

type ArticleAutocompleteProps = {
  value: string
  onChange: (value: string) => void
  onSelect?: (articleId: number) => void
  placeholder?: string
  className?: string
}

export function ArticleAutocomplete({
  value,
  onChange,
  onSelect,
  placeholder = "Search articles by title, media, or author...",
  className,
}: ArticleAutocompleteProps) {
  const router = useRouter()
  const [isOpen, setIsOpen] = React.useState(false)
  const [isLoading, setIsLoading] = React.useState(false)
  const [results, setResults] = React.useState<ArticleSearchResult[]>([])
  const [debouncedValue] = useDebounce(value, 300)
  const inputRef = React.useRef<HTMLInputElement>(null)
  const dropdownRef = React.useRef<HTMLDivElement>(null)
  const userLocale = typeof navigator !== "undefined" ? navigator.language : "en-US"

  React.useEffect(() => {
    async function search() {
      if (debouncedValue.length < 2) {
        setResults([])
        setIsOpen(false)
        return
      }

      setIsLoading(true)
      const response = await searchArticlesAction(debouncedValue)
      if (response.success) {
        setResults(response.results)
        setIsOpen(response.results.length > 0)
      }
      setIsLoading(false)
    }

    search()
  }, [debouncedValue])

  React.useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        inputRef.current &&
        !inputRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const handleSelect = (article: ArticleSearchResult) => {
    if (onSelect) {
      onSelect(article.id)
    } else {
      router.push(`/dashboard/articles/${article.id}`)
    }
    setIsOpen(false)
    onChange("")
  }

  return (
    <div className={cn("relative", className)}>
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          ref={inputRef}
          type="search"
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          onFocus={() => {
            if (results.length > 0) setIsOpen(true)
          }}
          className="pl-10 pr-10 transition-shadow focus-visible:shadow-sm"
        />
        {isLoading && (
          <Loader2 className="absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 animate-spin text-muted-foreground" />
        )}
      </div>

      {isOpen && results.length > 0 && (
        <div
          ref={dropdownRef}
          className="absolute z-50 mt-2 w-full rounded-lg border border-border bg-popover p-1 shadow-lg"
        >
          <div className="max-h-[300px] overflow-y-auto">
            {results.map((article) => (
              <button
                key={article.id}
                onClick={() => handleSelect(article)}
                className="flex w-full flex-col gap-1 rounded-md px-3 py-2 text-left transition-colors hover:bg-accent focus:bg-accent focus:outline-none"
              >
                <div className="font-medium text-foreground">{article.title}</div>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {article.site_name && <span>{article.site_name}</span>}
                  {article.author_name && (
                    <>
                      <span>•</span>
                      <span>{article.author_name}</span>
                    </>
                  )}
                  {article.published_at && (
                    <>
                      <span>•</span>
                      <span>{new Date(article.published_at).toLocaleDateString(userLocale)}</span>
                    </>
                  )}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
