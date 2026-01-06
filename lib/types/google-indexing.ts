/**
 * Google Indexing Types
 *
 * Type definitions for Google Indexing API integration
 */

export type IndexingMethod = "api" | "ping"

export type IndexingResult = {
  success: boolean
  method: IndexingMethod
  url: string
  error?: string
  quotaUsed?: boolean
}

export type QuotaStatus = {
  used: number
  limit: number
  remaining: number
  resetAt: Date
}

