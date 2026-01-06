"use client"

import { useState, useEffect, useCallback } from "react"
import { useSearchParams } from "next/navigation"
import { XPublicationCard } from "./x-publication-card"
import type { XPublicationWithRelations, XPublicationFilters } from "@/lib/types/x-publications"
import { Loader2 } from "lucide-react"

type XPublicationListProps = {
  initialPublications: XPublicationWithRelations[]
  filters: XPublicationFilters
  hasMore: boolean
}

export function XPublicationList({ initialPublications, filters, hasMore: initialHasMore }: XPublicationListProps) {
  const searchParams = useSearchParams()
  const [publications, setPublications] = useState(initialPublications)
  const [hasMore, setHasMore] = useState(initialHasMore)
  const [isLoading, setIsLoading] = useState(false)
  const [offset, setOffset] = useState(10)

  // Reset when filters change
  useEffect(() => {
    setPublications(initialPublications)
    setHasMore(initialHasMore)
    setOffset(10)
  }, [initialPublications, initialHasMore, searchParams])

  const loadMore = useCallback(async () => {
    if (isLoading || !hasMore) return

    setIsLoading(true)

    try {
      // Build query params
      const params = new URLSearchParams()
      if (filters.search) params.set("search", filters.search)
      if (filters.status) params.set("status", filters.status)
      if (filters.site_id) params.set("site_id", filters.site_id.toString())
      if (filters.date_from) params.set("date_from", filters.date_from)
      if (filters.date_to) params.set("date_to", filters.date_to)
      params.set("offset", offset.toString())
      params.set("limit", "10")

      const response = await fetch(`/api/x-publisher/publications?${params}`)
      const data = await response.json()

      if (data.publications && data.publications.length > 0) {
        setPublications((prev) => [...prev, ...data.publications])
        setOffset((prev) => prev + 10)
        setHasMore(data.hasMore)
      } else {
        setHasMore(false)
      }
    } catch (error) {
      console.error("Error loading more X publications:", error)
    } finally {
      setIsLoading(false)
    }
  }, [isLoading, hasMore, offset, filters])

  // Auto-load on scroll
  useEffect(() => {
    const handleScroll = () => {
      if (isLoading || !hasMore) return

      const scrollPosition = window.innerHeight + window.scrollY
      const threshold = document.documentElement.scrollHeight - 500

      if (scrollPosition >= threshold) {
        loadMore()
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [isLoading, hasMore, loadMore])

  if (publications.length === 0 && !isLoading) {
    return (
      <div className="flex min-h-[400px] items-center justify-center rounded-lg border border-dashed border-border bg-muted/30 p-8">
        <div className="text-center">
          <p className="text-lg font-medium text-muted-foreground">No X publications found</p>
          <p className="mt-1 text-sm text-muted-foreground">
            Publications will appear here when articles with X posts are published
          </p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {publications.map((publication) => (
        <XPublicationCard key={publication.id} publication={publication} />
      ))}

      {/* Loading indicator */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
        </div>
      )}

      {/* End message */}
      {!hasMore && publications.length > 0 && (
        <p className="py-4 text-center text-sm text-muted-foreground">No more publications to load</p>
      )}
    </div>
  )
}

