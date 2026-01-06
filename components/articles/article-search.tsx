"use client"

import { useState, useEffect, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { X } from "lucide-react"
import { useDebounce } from "use-debounce"
import type { DateRange } from "react-day-picker"
import { format } from "date-fns"
import { ArticleAutocomplete } from "./article-autocomplete"
import { DateRangePicker } from "./date-range-picker"

type ArticleSearchProps = {
  statuses: string[]
  sourceTypes: string[]
  countries: string[]
  languages: string[]
}

export function ArticleSearch({ statuses, sourceTypes, countries, languages }: ArticleSearchProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [sourceType, setSourceType] = useState(searchParams.get("source_type") || "all")
  const [country, setCountry] = useState(searchParams.get("country") || "all")
  const [language, setLanguage] = useState(searchParams.get("language") || "all")

  const [dateRange, setDateRange] = useState<DateRange | undefined>(() => {
    const from = searchParams.get("date_from")
    const to = searchParams.get("date_to")
    if (from || to) {
      return {
        from: from ? new Date(from) : undefined,
        to: to ? new Date(to) : undefined,
      }
    }
    return undefined
  })

  const [debouncedSearch] = useDebounce(search, 500)

  const dateFrom = dateRange?.from
  const dateTo = dateRange?.to

  useEffect(() => {
    const params = new URLSearchParams()

    if (debouncedSearch) params.set("search", debouncedSearch)
    if (status !== "all") params.set("status", status)
    if (sourceType !== "all") params.set("source_type", sourceType)
    if (country !== "all") params.set("country", country)
    if (language !== "all") params.set("language", language)

    if (dateFrom) {
      params.set("date_from", format(dateFrom, "yyyy-MM-dd"))
    }
    if (dateTo) {
      params.set("date_to", format(dateTo, "yyyy-MM-dd"))
    }

    router.push(`/dashboard/articles?${params.toString()}`, { scroll: false })
  }, [debouncedSearch, status, sourceType, country, language, dateFrom, dateTo, router])

  const clearFilters = useCallback(() => {
    setSearch("")
    setStatus("all")
    setSourceType("all")
    setCountry("all")
    setLanguage("all")
    setDateRange(undefined)
    router.push("/dashboard/articles", { scroll: false })
  }, [router])

  const hasActiveFilters =
    search || status !== "all" || sourceType !== "all" || country !== "all" || language !== "all" || dateRange

  return (
    <div className="space-y-4">
      <ArticleAutocomplete
        value={search}
        onChange={setSearch}
        placeholder="Search articles by title, media, or author..."
      />

      <div className="flex flex-wrap items-center gap-2">
        <Select value={status} onValueChange={setStatus}>
          <SelectTrigger className="w-[140px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            {statuses.map((s) => (
              <SelectItem key={s} value={s}>
                {s.charAt(0).toUpperCase() + s.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={sourceType} onValueChange={setSourceType}>
          <SelectTrigger className="w-[140px]" aria-label="Filter by source type">
            <SelectValue placeholder="Source" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Sources</SelectItem>
            {sourceTypes.map((type) => (
              <SelectItem key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={country} onValueChange={setCountry}>
          <SelectTrigger className="w-[140px]" aria-label="Filter by country">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Countries</SelectItem>
            {countries.map((c) => (
              <SelectItem key={c} value={c}>
                {c}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={language} onValueChange={setLanguage}>
          <SelectTrigger className="w-[120px]" aria-label="Filter by language">
            <SelectValue placeholder="Language" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Languages</SelectItem>
            {languages.map((lang) => (
              <SelectItem key={lang} value={lang}>
                {lang.toUpperCase()}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <DateRangePicker dateRange={dateRange} onDateRangeChange={setDateRange} />

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="ml-auto gap-2"
            aria-label="Clear all filters"
          >
            <X className="h-4 w-4" aria-hidden="true" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
