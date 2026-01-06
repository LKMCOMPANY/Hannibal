"use client"

import { useState, useCallback } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Search, X } from "lucide-react"
import { useDebouncedCallback } from "use-debounce"

const COUNTRIES = [
  { value: "all", label: "All Countries" },
  { value: "ITA", label: "Italy" },
  { value: "DEU", label: "Germany" },
  { value: "FRA", label: "France" },
  { value: "ESP", label: "Spain" },
  { value: "USA", label: "United States" },
]

const STATUSES = [
  { value: "all", label: "All Statuses" },
  { value: "active", label: "Active" },
  { value: "inactive", label: "Inactive" },
  { value: "draft", label: "Draft" },
]

const IDEOLOGIES = [
  { value: "all", label: "All Ideologies" },
  { value: "droite", label: "Right" },
  { value: "social démocrate", label: "Social Democrat" },
  { value: "centre", label: "Center" },
  { value: "gauche", label: "Left" },
]

export function MediaSearch() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [search, setSearch] = useState(searchParams.get("search") || "")
  const [country, setCountry] = useState(searchParams.get("country") || "all")
  const [status, setStatus] = useState(searchParams.get("status") || "all")
  const [ideology, setIdeology] = useState(searchParams.get("ideology") || "all")

  const updateURL = useCallback(
    (params: Record<string, string>) => {
      const newParams = new URLSearchParams(searchParams.toString())

      Object.entries(params).forEach(([key, value]) => {
        if (value && value !== "all") {
          newParams.set(key, value)
        } else {
          newParams.delete(key)
        }
      })

      router.push(`/dashboard/medias?${newParams.toString()}`, { scroll: false })
    },
    [router, searchParams],
  )

  const debouncedSearch = useDebouncedCallback((value: string) => {
    updateURL({ search: value, country, status, ideology })
  }, 300)

  const handleSearchChange = (value: string) => {
    setSearch(value)
    debouncedSearch(value)
  }

  const handleCountryChange = (value: string) => {
    setCountry(value)
    updateURL({ search, country: value, status, ideology })
  }

  const handleStatusChange = (value: string) => {
    setStatus(value)
    updateURL({ search, country, status: value, ideology })
  }

  const handleIdeologyChange = (value: string) => {
    setIdeology(value)
    updateURL({ search, country, status, ideology: value })
  }

  const clearFilters = () => {
    setSearch("")
    setCountry("all")
    setStatus("all")
    setIdeology("all")
    router.push("/dashboard/medias")
  }

  const hasActiveFilters = search || country !== "all" || status !== "all" || ideology !== "all"

  return (
    <div className="space-y-4">
      <div className="relative">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder="Search medias by name, domain, or description..."
          value={search}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="pl-9"
          aria-label="Search medias"
        />
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <Select value={country} onValueChange={handleCountryChange}>
          <SelectTrigger className="w-[160px]" aria-label="Filter by country">
            <SelectValue placeholder="Country" />
          </SelectTrigger>
          <SelectContent>
            {COUNTRIES.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                {c.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={status} onValueChange={handleStatusChange}>
          <SelectTrigger className="w-[160px]" aria-label="Filter by status">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            {STATUSES.map((s) => (
              <SelectItem key={s.value} value={s.value}>
                {s.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ideology} onValueChange={handleIdeologyChange}>
          <SelectTrigger className="w-[180px]" aria-label="Filter by ideology">
            <SelectValue placeholder="Ideology" />
          </SelectTrigger>
          <SelectContent>
            {IDEOLOGIES.map((i) => (
              <SelectItem key={i.value} value={i.value}>
                {i.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={clearFilters}
            className="gap-2 ml-auto"
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
