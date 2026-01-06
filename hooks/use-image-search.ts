"use client"

import { useState, useCallback, useRef, useEffect } from "react"

export type ImageSearchResult = {
  url: string
  title: string
  source: string
  articleUrl: string
  dateTime: string
}

type UseImageSearchReturn = {
  images: ImageSearchResult[]
  isLoading: boolean
  error: string | null
  hasMore: boolean
  search: (query: string, page?: number) => Promise<void>
  reset: () => void
}

const DEBOUNCE_DELAY = 500 // ms

export function useImageSearch(): UseImageSearchReturn {
  const [images, setImages] = useState<ImageSearchResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(false)

  const abortControllerRef = useRef<AbortController | null>(null)
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort()
      }
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  const search = useCallback(async (query: string, page = 1) => {
    const trimmedQuery = query.trim()
    if (!trimmedQuery) {
      setError("Please enter a search query")
      return
    }

    if (trimmedQuery.length < 2) {
      setError("Search query must be at least 2 characters long")
      return
    }

    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }

    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    if (page === 1) {
      debounceTimerRef.current = setTimeout(async () => {
        await performSearch(trimmedQuery, page)
      }, DEBOUNCE_DELAY)
    } else {
      await performSearch(trimmedQuery, page)
    }
  }, [])

  const performSearch = async (query: string, page: number) => {
    setIsLoading(true)
    setError(null)

    abortControllerRef.current = new AbortController()

    try {
      const params = new URLSearchParams({
        query,
        lang: "eng",
        sortBy: "rel",
        page: page.toString(),
        resultsPerPage: "20",
      })

      const response = await fetch(`/api/newsapi/images?${params}`, {
        signal: abortControllerRef.current.signal,
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()

      if (data.error) {
        setError(data.error.message)
        setImages([])
        setHasMore(false)
        return
      }

      if (page === 1) {
        setImages(data.data.images)
      } else {
        setImages((prev) => [...prev, ...data.data.images])
      }

      setHasMore(data.data.hasMore)
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        return
      }

      setError("Failed to search images. Please try again.")
      setImages([])
      setHasMore(false)
    } finally {
      setIsLoading(false)
    }
  }

  const reset = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort()
    }
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    setImages([])
    setError(null)
    setHasMore(false)
    setIsLoading(false)
  }, [])

  return {
    images,
    isLoading,
    error,
    hasMore,
    search,
    reset,
  }
}
