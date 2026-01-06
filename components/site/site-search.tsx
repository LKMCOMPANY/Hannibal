"use client"

import { useState, useEffect, useCallback } from "react"
import { Search, X, Loader2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Badge } from "@/components/ui/badge"
import Image from "next/image"
import { useDictionary, getCategoryKey } from "@/lib/i18n"

type SearchResult = {
  id: number
  title: string
  excerpt: string
  slug: string
  category?: string
  featured_image_url?: string
  published_at: Date
}

type Props = {
  siteId: number
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function SiteSearch({ siteId, open, onOpenChange }: Props) {
  const { t } = useDictionary()
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<SearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const performSearch = useCallback(
    async (searchQuery: string) => {
      if (!searchQuery.trim()) {
        setResults([])
        return
      }

      setIsLoading(true)
      try {
        const response = await fetch(`/api/search?siteId=${siteId}&q=${encodeURIComponent(searchQuery)}`)
        if (response.ok) {
          const data = await response.json()
          setResults(data.results || [])
        }
      } catch (error) {
        console.error("Search error:", error)
      } finally {
        setIsLoading(false)
      }
    },
    [siteId],
  )

  useEffect(() => {
    const debounce = setTimeout(() => {
      performSearch(query)
    }, 300)

    return () => clearTimeout(debounce)
  }, [query, performSearch])

  const handleResultClick = (slug: string) => {
    router.push(`/article/${slug}`)
    onOpenChange(false)
    setQuery("")
  }

  const handleClear = () => {
    setQuery("")
    setResults([])
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-2xl p-0 gap-0"
        style={{
          backgroundColor: "var(--theme-current-bg)",
          borderColor: "var(--theme-current-border)",
        }}
      >
        {/* Custom header with theme variables */}
        <div
          className="border-b px-6 py-4"
          style={{
            borderColor: "var(--theme-current-border)",
          }}
        >
          <div className="flex items-center gap-3">
            <Search className="h-5 w-5 shrink-0" style={{ color: "var(--theme-current-text-secondary)" }} />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={t("search.placeholder")}
              className="border-0 p-0 text-lg focus-visible:ring-0 bg-transparent"
              style={{
                color: "var(--theme-current-text)",
                fontFamily: "var(--theme-font-body)",
              }}
              autoFocus
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                onClick={handleClear}
                className="h-8 w-8 shrink-0"
                style={{
                  color: "var(--theme-current-text-secondary)",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = "var(--theme-current-primary)"
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = "var(--theme-current-text-secondary)"
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        <ScrollArea className="max-h-[60vh]">
          {isLoading ? (
            <div className="flex items-center justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin" style={{ color: "var(--theme-current-primary)" }} />
            </div>
          ) : results.length > 0 ? (
            <div className="space-y-1 p-2">
              {results.map((result) => (
                <button
                  key={result.id}
                  onClick={() => handleResultClick(result.slug)}
                  className="flex w-full items-start gap-4 rounded-lg p-3 text-left transition-colors"
                  style={{
                    borderRadius: "var(--theme-radius-card)",
                    color: "var(--theme-current-text)",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.backgroundColor =
                      "color-mix(in srgb, var(--theme-current-primary) 5%, transparent)"
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.backgroundColor = "transparent"
                  }}
                >
                  {result.featured_image_url && (
                    <div
                      className="relative h-16 w-24 shrink-0 overflow-hidden"
                      style={{
                        borderRadius: "var(--theme-radius-card)",
                      }}
                    >
                      <Image
                        src={result.featured_image_url || "/placeholder.svg"}
                        alt={result.title}
                        fill
                        className="object-cover"
                        sizes="96px"
                      />
                    </div>
                  )}
                  <div className="flex-1 space-y-1">
                    <div className="flex items-start justify-between gap-2">
                      <h4
                        className="line-clamp-1 font-semibold"
                        style={{
                          fontFamily: "var(--theme-font-heading)",
                          fontWeight: "var(--theme-weight-semibold)",
                          color: "var(--theme-current-text)",
                        }}
                      >
                        {result.title}
                      </h4>
                      {result.category && (
                        <Badge
                          variant="secondary"
                          className="shrink-0 text-xs"
                          style={{
                            backgroundColor: "color-mix(in srgb, var(--theme-current-primary) 10%, transparent)",
                            color: "var(--theme-current-primary)",
                            borderRadius: "var(--theme-radius-button)",
                            fontFamily: "var(--theme-font-body)",
                          }}
                        >
                          {t(`category.${getCategoryKey(result.category)}`, { fallback: result.category })}
                        </Badge>
                      )}
                    </div>
                    <p
                      className="line-clamp-2 text-sm"
                      style={{
                        color: "var(--theme-current-text-secondary)",
                        fontFamily: "var(--theme-font-body)",
                      }}
                    >
                      {result.excerpt}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : query ? (
            <div className="py-12 text-center">
              <p
                style={{
                  color: "var(--theme-current-text-secondary)",
                  fontFamily: "var(--theme-font-body)",
                }}
              >
                {t("search.noResults")}
              </p>
            </div>
          ) : (
            <div className="py-12 text-center">
              <Search
                className="mx-auto h-12 w-12"
                style={{
                  color: "color-mix(in srgb, var(--theme-current-text-secondary) 30%, transparent)",
                }}
              />
              <p
                className="mt-4"
                style={{
                  color: "var(--theme-current-text-secondary)",
                  fontFamily: "var(--theme-font-body)",
                }}
              >
                {t("search.placeholder")}
              </p>
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}
