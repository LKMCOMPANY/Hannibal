/**
 * NewsAPI.ai (Event Registry) Service
 *
 * Modular, reusable service for interacting with the Event Registry API
 * Features:
 * - Request deduplication via caching
 * - Type-safe API calls
 * - Error handling
 * - Consistent response format
 *
 * Documentation: https://newsapi.ai/documentation
 */

import { cache } from "react"
import type {
  ArticleSearchParams,
  ArticleSearchRequest,
  ArticleSearchResponse,
  EventSearchParams,
  EventSearchRequest,
  EventSearchResponse,
  NewsAPIResponse,
  Language,
  SortBy,
  ConceptInfo,
  CategoryInfo,
  SourceInfo,
} from "@/lib/types/newsapi"

// ============================================================================
// Configuration
// ============================================================================

const API_BASE_URL = "https://eventregistry.org/api/v1"
const API_KEY = process.env.EVENT_REGISTRY_API_KEY

if (!API_KEY) {
  console.warn("EVENT_REGISTRY_API_KEY is not set. NewsAPI service will not work.")
}

// ============================================================================
// Core API Client
// ============================================================================

class NewsAPIClient {
  private apiKey: string
  private baseUrl: string

  constructor(apiKey: string, baseUrl: string = API_BASE_URL) {
    this.apiKey = apiKey
    this.baseUrl = baseUrl
  }

  /**
   * Make a POST request to the Event Registry API
   */
  private async request<T>(endpoint: string, body: Record<string, any>): Promise<NewsAPIResponse<T>> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...body,
          apiKey: this.apiKey,
        }),
        // Cache for 5 minutes for GET-like operations
        next: { revalidate: 300 },
      })

      if (!response.ok) {
        const errorText = await response.text()
        return {
          error: {
            message: `API request failed: ${response.status} ${response.statusText}`,
            code: response.status.toString(),
          },
        }
      }

      const data = await response.json()

      // Check for API-level errors
      if (data.error) {
        return {
          error: {
            message: data.error,
            code: "API_ERROR",
          },
        }
      }

      return { data }
    } catch (error) {
      console.error("[NewsAPI] Request error:", error)
      return {
        error: {
          message: error instanceof Error ? error.message : "Unknown error occurred",
          code: "NETWORK_ERROR",
        },
      }
    }
  }

  /**
   * Search for articles
   */
  async searchArticles(
    params: ArticleSearchParams & {
      page?: number
      count?: number
      sortBy?: SortBy
      sortByAsc?: boolean
      sourceLocationUri?: string
      sourceGroupUri?: string
      authorUri?: string
      ignoreKeyword?: string
      ignoreSourceUri?: string
      ignoreSourceLocationUri?: string
      ignoreSourceGroupUri?: string
      ignoreSourceLang?: string
      startSourceRankPercentile?: number
      endSourceRankPercentile?: number
      minSentiment?: number
      maxSentiment?: number
      isDuplicateFilter?: string
      hasDuplicateFilter?: string
      dataType?: string[]
    },
  ): Promise<NewsAPIResponse<ArticleSearchResponse>> {
    const request: ArticleSearchRequest = {
      action: "getArticles",
      keyword: params.keyword,
      conceptUri: params.conceptUri,
      categoryUri: params.categoryUri,
      sourceUri: params.sourceUri,
      sourceLocationUri: params.sourceLocationUri,
      sourceGroupUri: params.sourceGroupUri,
      authorUri: params.authorUri,
      lang: params.lang,
      dateStart: params.dateStart,
      dateEnd: params.dateEnd,
      ignoreKeyword: params.ignoreKeyword,
      ignoreSourceUri: params.ignoreSourceUri,
      ignoreSourceLocationUri: params.ignoreSourceLocationUri,
      ignoreSourceGroupUri: params.ignoreSourceGroupUri,
      ignoreSourceLang: params.ignoreSourceLang,
      startSourceRankPercentile: params.startSourceRankPercentile,
      endSourceRankPercentile: params.endSourceRankPercentile,
      minSentiment: params.minSentiment,
      maxSentiment: params.maxSentiment,
      isDuplicateFilter: params.isDuplicateFilter,
      hasDuplicateFilter: params.hasDuplicateFilter,
      articlesPage: params.page || 1,
      articlesCount: params.count || 20,
      articlesSortBy: params.sortBy || "date",
      articlesSortByAsc: params.sortByAsc || false,
      dataType: params.dataType || ["news", "blog"],
      resultType: "articles",
    }

    return this.request<ArticleSearchResponse>("/article/getArticles", request)
  }

  /**
   * Search for events
   */
  async searchEvents(
    params: EventSearchParams & {
      page?: number
      count?: number
      sortBy?: SortBy
      sortByAsc?: boolean
      sourceLocationUri?: string
      sourceGroupUri?: string
      authorUri?: string
      ignoreKeyword?: string
      ignoreSourceUri?: string
      ignoreSourceLocationUri?: string
      ignoreSourceGroupUri?: string
      ignoreSourceLang?: string
      startSourceRankPercentile?: number
      endSourceRankPercentile?: number
      minSentiment?: number
      maxSentiment?: number
      minArticlesInEvent?: number
      maxArticlesInEvent?: number
    },
  ): Promise<NewsAPIResponse<EventSearchResponse>> {
    const request: EventSearchRequest = {
      action: "getEvents",
      keyword: params.keyword,
      conceptUri: params.conceptUri,
      categoryUri: params.categoryUri,
      sourceUri: params.sourceUri,
      sourceLocationUri: params.sourceLocationUri,
      sourceGroupUri: params.sourceGroupUri,
      authorUri: params.authorUri,
      locationUri: params.locationUri,
      lang: params.lang,
      dateStart: params.dateStart,
      dateEnd: params.dateEnd,
      ignoreKeyword: params.ignoreKeyword,
      ignoreSourceUri: params.ignoreSourceUri,
      ignoreSourceLocationUri: params.ignoreSourceLocationUri,
      ignoreSourceGroupUri: params.ignoreSourceGroupUri,
      ignoreSourceLang: params.ignoreSourceLang,
      startSourceRankPercentile: params.startSourceRankPercentile,
      endSourceRankPercentile: params.endSourceRankPercentile,
      minSentiment: params.minSentiment,
      maxSentiment: params.maxSentiment,
      minArticlesInEvent: params.minArticlesInEvent,
      maxArticlesInEvent: params.maxArticlesInEvent,
      eventsPage: params.page || 1,
      eventsCount: params.count || 20,
      eventsSortBy: params.sortBy || "date",
      eventsSortByAsc: params.sortByAsc || false,
      includeEventTitle: true,
      includeEventSummary: true,
      includeEventSocialScore: true,
      includeEventSentiment: true,
      includeEventLocation: true,
      includeEventDate: true,
      includeEventArticleCounts: true,
      includeEventConcepts: true,
      includeEventCategories: true,
      includeEventStories: false,
      resultType: "events",
    }

    return this.request<EventSearchResponse>("/event/getEvents", request)
  }

  /**
   * Get concept suggestions (for autocomplete)
   */
  async suggestConcepts(prefix: string, lang: Language = "eng"): Promise<NewsAPIResponse<ConceptInfo[]>> {
    return this.request<ConceptInfo[]>("/suggest/concepts", {
      prefix,
      lang,
      conceptLang: lang,
    })
  }

  /**
   * Get category suggestions
   */
  async suggestCategories(prefix: string): Promise<NewsAPIResponse<CategoryInfo[]>> {
    return this.request<CategoryInfo[]>("/suggest/categories", {
      prefix,
    })
  }

  /**
   * Get source suggestions
   */
  async suggestSources(prefix: string): Promise<NewsAPIResponse<SourceInfo[]>> {
    return this.request<SourceInfo[]>("/suggest/sources", {
      prefix,
    })
  }
}

// ============================================================================
// Singleton Instance
// ============================================================================

let clientInstance: NewsAPIClient | null = null

function getClient(): NewsAPIClient {
  if (!API_KEY) {
    throw new Error("EVENT_REGISTRY_API_KEY is not configured")
  }

  if (!clientInstance) {
    clientInstance = new NewsAPIClient(API_KEY)
  }

  return clientInstance
}

// ============================================================================
// Exported Functions (with React cache for deduplication)
// ============================================================================

/**
 * Search for articles with caching
 */
export const searchArticles = cache(
  async (
    params: ArticleSearchParams & {
      page?: number
      count?: number
      sortBy?: SortBy
      sortByAsc?: boolean
      sourceLocationUri?: string
      sourceGroupUri?: string
      authorUri?: string
      ignoreKeyword?: string
      ignoreSourceUri?: string
      ignoreSourceLocationUri?: string
      ignoreSourceGroupUri?: string
      ignoreSourceLang?: string
      startSourceRankPercentile?: number
      endSourceRankPercentile?: number
      minSentiment?: number
      maxSentiment?: number
      isDuplicateFilter?: string
      hasDuplicateFilter?: string
      dataType?: string[]
    },
  ): Promise<NewsAPIResponse<ArticleSearchResponse>> => {
    const client = getClient()
    return client.searchArticles(params)
  },
)

/**
 * Search for events with caching
 */
export const searchEvents = cache(
  async (
    params: EventSearchParams & {
      page?: number
      count?: number
      sortBy?: SortBy
      sortByAsc?: boolean
      sourceLocationUri?: string
      sourceGroupUri?: string
      authorUri?: string
      ignoreKeyword?: string
      ignoreSourceUri?: string
      ignoreSourceLocationUri?: string
      ignoreSourceGroupUri?: string
      ignoreSourceLang?: string
      startSourceRankPercentile?: number
      endSourceRankPercentile?: number
      minSentiment?: number
      maxSentiment?: number
      minArticlesInEvent?: number
      maxArticlesInEvent?: number
    },
  ): Promise<NewsAPIResponse<EventSearchResponse>> => {
    const client = getClient()
    return client.searchEvents(params)
  },
)

/**
 * Get concept suggestions with caching
 */
export const suggestConcepts = cache(
  async (prefix: string, lang: Language = "eng"): Promise<NewsAPIResponse<ConceptInfo[]>> => {
    const client = getClient()
    return client.suggestConcepts(prefix, lang)
  },
)

/**
 * Get category suggestions with caching
 */
export const suggestCategories = cache(async (prefix: string): Promise<NewsAPIResponse<CategoryInfo[]>> => {
  const client = getClient()
  return client.suggestCategories(prefix)
})

/**
 * Get source suggestions with caching
 */
export const suggestSources = cache(async (prefix: string): Promise<NewsAPIResponse<SourceInfo[]>> => {
  const client = getClient()
  return client.suggestSources(prefix)
})

// ============================================================================
// Utility Functions
// ============================================================================

/**
 * Format date for API (YYYY-MM-DD)
 */
export function formatDateForAPI(date: Date): string {
  return date.toISOString().split("T")[0]
}

/**
 * Get date range for common periods
 */
export function getDateRange(period: "today" | "week" | "month" | "year"): { dateStart: string; dateEnd: string } {
  const end = new Date()
  const start = new Date()

  switch (period) {
    case "today":
      start.setHours(0, 0, 0, 0)
      break
    case "week":
      start.setDate(start.getDate() - 7)
      break
    case "month":
      start.setMonth(start.getMonth() - 1)
      break
    case "year":
      start.setFullYear(start.getFullYear() - 1)
      break
  }

  return {
    dateStart: formatDateForAPI(start),
    dateEnd: formatDateForAPI(end),
  }
}

/**
 * Check if NewsAPI is configured
 */
export function isNewsAPIConfigured(): boolean {
  return !!API_KEY
}
