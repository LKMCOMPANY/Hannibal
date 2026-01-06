/**
 * Google Indexing Service
 *
 * Intelligent indexing notification for published articles.
 * 
 * Strategy:
 * - Manual + Campaign → Indexing API (fast, 5-30min, quota 200/day)
 * - Autonomous → Sitemap ping (free, unlimited, 3-24h)
 * - Fallback → Sitemap ping if quota exhausted
 *
 * CRITICAL: All errors are NON-BLOCKING (article publication continues)
 */

import { google } from "googleapis"
import { sql } from "@/lib/db"
import type { ArticleWithId } from "@/lib/types/publisher"
import type { Site } from "@/lib/types/sites"
import type { IndexingResult, IndexingMethod } from "@/lib/types/google-indexing"

// ============================================================================
// Configuration
// ============================================================================

const QUOTA_LIMIT_PER_DAY = 200
const INDEXING_API_SCOPES = ["https://www.googleapis.com/auth/indexing"]

/**
 * Check if Google Indexing API is configured
 */
function hasIndexingCredentials(): boolean {
  return !!(
    process.env.GOOGLE_INDEXING_CLIENT_EMAIL && 
    process.env.GOOGLE_INDEXING_PRIVATE_KEY
  )
}

/**
 * Get authenticated Google Indexing client
 */
async function getIndexingClient() {
  if (!hasIndexingCredentials()) {
    throw new Error("Google Indexing credentials not configured")
  }

  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_INDEXING_CLIENT_EMAIL!,
      // CRITICAL: Replace escaped newlines with actual newlines
      private_key: process.env.GOOGLE_INDEXING_PRIVATE_KEY!.replace(/\\n/g, "\n"),
    },
    scopes: INDEXING_API_SCOPES,
  })

  return google.indexing({ version: "v3", auth })
}

// ============================================================================
// Quota Management
// ============================================================================

/**
 * Check if quota is available for Indexing API
 * Tracks usage in database
 */
async function checkQuotaAvailable(): Promise<boolean> {
  try {
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    const result = await sql`
      SELECT COUNT(*) as count
      FROM google_indexing_logs
      WHERE method = 'api'
      AND success = true
      AND created_at >= ${today.toISOString()}
    `

    const usedToday = Number(result[0]?.count || 0)
    const available = usedToday < QUOTA_LIMIT_PER_DAY

    if (!available) {
      console.warn(`[Indexing] ⚠️ Quota exhausted: ${usedToday}/${QUOTA_LIMIT_PER_DAY}`)
    }

    return available
  } catch (error) {
    // If table doesn't exist or error, assume quota available
    console.warn("[Indexing] Could not check quota (table may not exist), assuming available")
    return true
  }
}

/**
 * Log indexing attempt to database
 * Non-blocking - errors are swallowed
 */
async function logIndexingAttempt(
  articleId: number,
  url: string,
  method: IndexingMethod,
  success: boolean,
  errorMessage?: string,
): Promise<void> {
  try {
    await sql`
      INSERT INTO google_indexing_logs (
        article_id, url, method, success, error_message
      ) VALUES (
        ${articleId}, ${url}, ${method}, ${success}, ${errorMessage || null}
      )
    `
  } catch (error) {
    // Swallow errors - logging failure shouldn't break anything
    console.error("[Indexing] Failed to log (non-critical):", error)
  }
}

// ============================================================================
// Indexing Methods
// ============================================================================

/**
 * Request indexing via Google Indexing API
 * Fast (5-30 min), quota limited (200/day)
 */
async function requestIndexingAPI(url: string): Promise<void> {
  const indexing = await getIndexingClient()

  await indexing.urlNotifications.publish({
    requestBody: {
      url: url,
      type: "URL_UPDATED",
    },
  })

  console.log(`⚡ [Indexing API] Requested: ${url}`)
}

/**
 * Ping Google sitemap
 * Slow (3-24h), unlimited, free
 */
async function pingSitemap(sitemapUrl: string): Promise<void> {
  const pingUrl = `https://www.google.com/ping?sitemap=${encodeURIComponent(sitemapUrl)}`

  const response = await fetch(pingUrl, {
    method: "GET",
    headers: {
      "User-Agent": "Hannibal/1.0 (+https://hannibalv2.onrender.com)",
    },
  })

  if (!response.ok) {
    throw new Error(`Sitemap ping failed: ${response.status}`)
  }

  console.log(`📡 [Sitemap Ping] Sent: ${sitemapUrl}`)
}

// ============================================================================
// Smart Dispatcher (Main Entry Point)
// ============================================================================

/**
 * Notify Google about published article
 * 
 * Strategy:
 * - Autonomous → Sitemap ping (free, unlimited)
 * - Manual/Campaign → Indexing API (fast, quota limited)
 * - Fallback → Sitemap ping if quota exhausted
 * 
 * CRITICAL: This function NEVER throws errors
 * All errors are caught and logged, publication continues
 */
export async function notifyGoogleIndexing(
  article: ArticleWithId,
  site: Site,
): Promise<IndexingResult> {
  try {
    // Build article URL
    const articleUrl = site.custom_domain
      ? `https://${site.custom_domain}/article/${article.slug}`
      : `${process.env.NEXT_PUBLIC_APP_URL}/site/${site.id}/article/${article.slug}`

    const sitemapUrl = site.custom_domain
      ? `https://${site.custom_domain}/sitemap.xml`
      : `${process.env.NEXT_PUBLIC_APP_URL}/site/${site.id}/sitemap.xml`

    // STRATEGY: Autonomous → Always ping (free, unlimited)
    if (article.source_type === "autonomous") {
      try {
        await pingSitemap(sitemapUrl)
        await logIndexingAttempt(article.id, articleUrl, "ping", true)
        
        return {
          success: true,
          method: "ping",
          url: articleUrl,
        }
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Unknown error"
        await logIndexingAttempt(article.id, articleUrl, "ping", false, errorMsg)
        
        return {
          success: false,
          method: "ping",
          url: articleUrl,
          error: errorMsg,
        }
      }
    }

    // STRATEGY: Manual + Campaign → Try Indexing API first
    if (article.source_type === "manual" || article.source_type === "campaign") {
      // Check if credentials are configured
      if (!hasIndexingCredentials()) {
        console.warn("[Indexing] ⚠️ Credentials not configured, falling back to sitemap ping")
        await pingSitemap(sitemapUrl)
        await logIndexingAttempt(article.id, articleUrl, "ping", true)
        
        return {
          success: true,
          method: "ping",
          url: articleUrl,
        }
      }

      // Check quota availability
      const hasQuota = await checkQuotaAvailable()

      if (hasQuota) {
        try {
          await requestIndexingAPI(articleUrl)
          await logIndexingAttempt(article.id, articleUrl, "api", true)
          
          return {
            success: true,
            method: "api",
            url: articleUrl,
            quotaUsed: true,
          }
        } catch (error) {
          // Indexing API failed, fallback to sitemap ping
          const errorMsg = error instanceof Error ? error.message : "Unknown error"
          console.error(`[Indexing] ❌ API failed, fallback to ping:`, errorMsg)
          
          await logIndexingAttempt(article.id, articleUrl, "api", false, errorMsg)

          // Fallback to sitemap ping
          try {
            await pingSitemap(sitemapUrl)
            await logIndexingAttempt(article.id, articleUrl, "ping", true)
            
            return {
              success: true,
              method: "ping",
              url: articleUrl,
              error: `API failed: ${errorMsg}, used ping fallback`,
            }
          } catch (pingError) {
            const pingErrorMsg = pingError instanceof Error ? pingError.message : "Unknown error"
            await logIndexingAttempt(article.id, articleUrl, "ping", false, pingErrorMsg)
            
            return {
              success: false,
              method: "ping",
              url: articleUrl,
              error: `Both methods failed. API: ${errorMsg}, Ping: ${pingErrorMsg}`,
            }
          }
        }
      } else {
        // Quota exhausted, use sitemap ping
        console.log("[Indexing] 📊 Quota exhausted, using sitemap ping")
        
        try {
          await pingSitemap(sitemapUrl)
          await logIndexingAttempt(article.id, articleUrl, "ping", true)
          
          return {
            success: true,
            method: "ping",
            url: articleUrl,
          }
        } catch (error) {
          const errorMsg = error instanceof Error ? error.message : "Unknown error"
          await logIndexingAttempt(article.id, articleUrl, "ping", false, errorMsg)
          
          return {
            success: false,
            method: "ping",
            url: articleUrl,
            error: errorMsg,
          }
        }
      }
    }

    // Unknown source_type, default to sitemap ping
    console.warn(`[Indexing] Unknown source_type: ${article.source_type}, using sitemap ping`)
    await pingSitemap(sitemapUrl)
    await logIndexingAttempt(article.id, articleUrl, "ping", true)
    
    return {
      success: true,
      method: "ping",
      url: articleUrl,
    }
  } catch (error) {
    // CRITICAL: Catch-all to ensure function NEVER throws
    const errorMsg = error instanceof Error ? error.message : "Unknown error"
    console.error("[Indexing] ❌ Critical error (non-blocking):", errorMsg)
    
    return {
      success: false,
      method: "ping",
      url: article.slug,
      error: errorMsg,
    }
  }
}

/**
 * Helper: Build article URL
 */
function buildArticleUrl(site: Site, slug: string): string {
  if (site.custom_domain) {
    return `https://${site.custom_domain}/article/${slug}`
  }
  return `${process.env.NEXT_PUBLIC_APP_URL}/site/${site.id}/article/${slug}`
}

