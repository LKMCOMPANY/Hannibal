/**
 * Autonomous Article Fetcher
 * 
 * Intelligent article selection from NewsAPI (Event Registry) with filtering and validation
 * 
 * Features:
 * - Fetches from NewsAPI with country + language filters
 * - Filters by image availability and minimum word count
 * - Sorts by source quality (top 30% sources only)
 * - Excludes paywall sources
 * - Prevents duplicates via NewsAPI article ID tracking
 * 
 * MODULAR: Reuses existing searchArticles() from lib/services/newsapi.ts
 */

import { searchArticles, formatDateForAPI } from "@/lib/services/newsapi"
import type { ArticleInfo, NewsAPIResponse, ArticleSearchResponse } from "@/lib/types/newsapi"
import { getCountryWikiUri, langISO2toISO3 } from "@/lib/constants/newsapi-mappings"
import { sql } from "@/lib/db"

// ============================================================================
// Types
// ============================================================================

export type FetchArticleParams = {
  siteId: number
  country?: string | null        // ISO2 code (ex: "IT", "FR", "US")
  language: string               // ISO2 code (ex: "it", "fr", "en")
}

export type FetchArticleResult = {
  success: boolean
  article?: ArticleInfo
  error?: string
  debugInfo?: {
    totalFetched: number
    afterImageFilter: number
    afterWordFilter: number
    afterDuplicateFilter: number
  }
}

// ============================================================================
// Constants
// ============================================================================

const MIN_WORD_COUNT = 500
const DATE_RANGE_DAYS = 3
const MAX_ARTICLES_TO_FETCH = 50
const SOURCE_QUALITY_TOP_PERCENTILE = 30  // Top 30% sources only

// ============================================================================
// Main Function
// ============================================================================

/**
 * Fetch best article for autonomous publication
 * 
 * Criteria (in order):
 * 1. NewsAPI search: Country (if available) + Language for last 3 days
 * 2. Filter: Image available + >= 500 words
 * 3. Sort by: Source quality (sourceImportance)
 * 4. Check duplicates: Via NewsAPI article ID
 * 5. Return: First valid article
 */
export async function fetchBestArticleForSite(
  params: FetchArticleParams
): Promise<FetchArticleResult> {
  const { siteId, country, language } = params

  try {
    console.log(`[Autonomous Fetcher] Starting fetch for site ${siteId}`, {
      country,
      language
    })

    // TRY 1: With country filter (if available)
    let result = await fetchArticlesFromNewsAPI(siteId, country, language)
    
    // TRY 2: Fallback to language-only if country search failed
    if (!result.success && country) {
      console.log(`[Autonomous Fetcher] ⚠️  No articles found for ${country}, retrying with language-only...`)
      result = await fetchArticlesFromNewsAPI(siteId, null, language)
    }
    
    return result

  } catch (error) {
    console.error(`[Autonomous Fetcher] Error:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error"
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Fetch articles from NewsAPI with filters
 * Extracted to allow country fallback strategy
 */
async function fetchArticlesFromNewsAPI(
  siteId: number,
  country: string | null | undefined,
  language: string
): Promise<FetchArticleResult> {
  try {
    // 1. BUILD DATE RANGE (last 3 days)
    const now = new Date()
    const threeDaysAgo = new Date(now)
    threeDaysAgo.setDate(now.getDate() - DATE_RANGE_DAYS)
    
    const dateStart = formatDateForAPI(threeDaysAgo)
    const dateEnd = formatDateForAPI(now)

    // 2. MAP LANGUAGE ISO2 → ISO3
    const langISO3 = langISO2toISO3(language)

    // 3. BUILD NEWSAPI QUERY
    const searchParams: any = {
      action: "getArticles",
      
      // LANGUAGE (required)
      lang: langISO3,
      
      // DATE RANGE (3 days)
      dateStart,
      dateEnd,
      
      // SORTING & QUALITY
      articlesSortBy: "sourceImportance",  // HIGH value = HIGH quality
      articlesSortByAsc: false,            // Descending (best first)
      startSourceRankPercentile: 0,        // Top sources
      endSourceRankPercentile: SOURCE_QUALITY_TOP_PERCENTILE,
      
      // FILTERS
      isDuplicateFilter: "skipDuplicates", // Avoid NewsAPI duplicates
      dataType: ["news"],                  // News only (no PR, no blogs)
      
      // EXCLUDE PAYWALL
      ignoreSourceGroupUri: "paywall/paywalled_sources",
      
      // PAGINATION
      articlesPage: 1,
      articlesCount: MAX_ARTICLES_TO_FETCH,
      
      // CONTENT
      articleBodyLen: -1,  // Full body (for word count)
      
      // OPTIMIZATIONS (reduce payload)
      includeArticleImage: true,
      includeArticleBody: true,
      includeArticleTitle: true,
      includeArticleBasicInfo: true,
      includeArticleSocialScore: false,
      includeArticleConcepts: false,
      includeArticleCategories: false,
      includeArticleLocation: false,
      includeArticleVideos: false,
      includeArticleLinks: false,
      
      resultType: "articles",
    }

    // 4. ADD LOCATION (country) IF AVAILABLE
    const countryWikiUri = getCountryWikiUri(country)
    if (countryWikiUri) {
      searchParams.sourceLocationUri = [countryWikiUri]
      console.log(`[Autonomous Fetcher] Using country filter: ${country} (${countryWikiUri})`)
    } else {
      console.log(`[Autonomous Fetcher] No country filter (using language only: ${langISO3})`)
    }

    console.log(`[Autonomous Fetcher] NewsAPI query:`, {
      lang: searchParams.lang,
      sourceLocationUri: searchParams.sourceLocationUri,
      dateRange: `${dateStart} to ${dateEnd}`,
      sortBy: searchParams.articlesSortBy,
      excludePaywall: true
    })

    // 5. FETCH ARTICLES FROM NEWSAPI (REUSE EXISTING MODULE)
    const response: NewsAPIResponse<ArticleSearchResponse> = await searchArticles(searchParams)

    if (response.error || !response.data) {
      console.error(`[Autonomous Fetcher] NewsAPI error:`, response.error)
      return {
        success: false,
        error: response.error?.message || "Failed to fetch articles from NewsAPI"
      }
    }

    const articles = response.data.articles.results

    if (!articles || articles.length === 0) {
      console.warn(`[Autonomous Fetcher] No articles found for site ${siteId}`)
      return {
        success: false,
        error: "No articles found matching criteria"
      }
    }

    const debugInfo = {
      totalFetched: articles.length,
      afterImageFilter: 0,
      afterWordFilter: 0,
      afterDuplicateFilter: 0
    }

    console.log(`[Autonomous Fetcher] Found ${articles.length} articles from NewsAPI, filtering...`)

    // 6. FILTER AND SELECT BEST ARTICLE
    const validArticles = await filterArticles(articles, siteId, debugInfo)

    if (validArticles.length === 0) {
      console.warn(`[Autonomous Fetcher] No valid articles after filtering`)
      return {
        success: false,
        error: "No articles passed validation filters (image, word count, duplicates)",
        debugInfo
      }
    }

    // 7. RETURN FIRST VALID ARTICLE (already sorted by quality from NewsAPI)
    const bestArticle = validArticles[0]

    console.log(`[Autonomous Fetcher] ✅ Selected article:`, {
      id: bestArticle.id,
      title: bestArticle.title.substring(0, 80) + '...',
      source: bestArticle.source.title,
      wordCount: countWords(bestArticle.body),
      hasImage: !!bestArticle.image,
      date: bestArticle.date
    })

    return {
      success: true,
      article: bestArticle,
      debugInfo
    }

  } catch (error) {
    console.error(`[Autonomous Fetcher] NewsAPI fetch error:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error fetching from NewsAPI"
    }
  }
}

// ============================================================================
// Helper Functions
// ============================================================================

/**
 * Filter articles by validation criteria
 */
async function filterArticles(
  articles: ArticleInfo[],
  siteId: number,
  debugInfo: FetchArticleResult['debugInfo']
): Promise<ArticleInfo[]> {
  const validArticles: ArticleInfo[] = []

  for (const article of articles) {
    // FILTER 1: Image available
    if (!article.image) {
      continue
    }
    
    if (debugInfo) debugInfo.afterImageFilter++

    // FILTER 2: Minimum 500 words
    const wordCount = countWords(article.body)
    if (wordCount < MIN_WORD_COUNT) {
      continue
    }
    
    if (debugInfo) debugInfo.afterWordFilter++

    // FILTER 3: Check duplicate (NewsAPI ID already used)
    const isDuplicate = await isArticleAlreadyPublished(article.id, siteId)
    if (isDuplicate) {
      continue
    }
    
    if (debugInfo) debugInfo.afterDuplicateFilter++

    // Article is valid!
    validArticles.push(article)
  }

  console.log(`[Autonomous Fetcher] Filtering results:`, {
    total: articles.length,
    withImage: debugInfo?.afterImageFilter || 0,
    longEnough: debugInfo?.afterWordFilter || 0,
    notDuplicate: debugInfo?.afterDuplicateFilter || 0,
    valid: validArticles.length
  })

  return validArticles
}

/**
 * Count words in text
 */
function countWords(text: string): number {
  if (!text) return 0
  return text.trim().split(/\s+/).length
}

/**
 * Check if NewsAPI article already published on this site
 * 
 * Uses autonomous_publications table for tracking
 * Checks NewsAPI article ID stored in source_article_data JSONB field
 */
async function isArticleAlreadyPublished(
  newsApiArticleId: string,
  siteId: number
): Promise<boolean> {
  try {
    const result = await sql`
      SELECT id FROM autonomous_publications
      WHERE site_id = ${siteId}
      AND source_article_data->>'id' = ${newsApiArticleId}
      AND status IN ('published', 'processing')
      LIMIT 1
    `
    
    const exists = result.length > 0
    
    if (exists) {
      console.log(`[Autonomous Fetcher] Duplicate detected: ${newsApiArticleId} already published on site ${siteId}`)
    }
    
    return exists
  } catch (error) {
    console.error("[Autonomous Fetcher] Error checking duplicate:", error)
    // On error, assume NOT duplicate to avoid blocking the system
    return false
  }
}

