/**
 * NewsAPI.ai (Event Registry) Type Definitions
 *
 * Complete type definitions for the Event Registry API
 * Documentation: https://newsapi.ai/documentation
 */

// ============================================================================
// Common Types
// ============================================================================

export type Language =
  | "all" // Added "all" option for all languages
  | "eng" // English
  | "deu" // German
  | "spa" // Spanish
  | "zho" // Chinese
  | "slv" // Slovenian
  | "fra" // French
  | "rus" // Russian
  | "ara" // Arabic
  | "tur" // Turkish
  | "por" // Portuguese
  | "ita" // Italian
  | "jpn" // Japanese
  | "kor" // Korean
  | "pol" // Polish
  | "nld" // Dutch
  | "swe" // Swedish
  | "dan" // Danish
  | "nor" // Norwegian
  | "fin" // Finnish
  | "ces" // Czech
  | "hun" // Hungarian
  | "ron" // Romanian
  | "ukr" // Ukrainian
  | "ell" // Greek
  | "heb" // Hebrew
  | "hin" // Hindi
  | "tha" // Thai
  | "vie" // Vietnamese
  | "ind" // Indonesian
  | "msa" // Malay
  | "cat" // Catalan

export type SortBy = "date" | "rel" | "sourceImportance" | "sourceImportanceRank" | "socialScore"

export type SentimentType = "neg" | "neutral" | "pos"

// ============================================================================
// Article Types
// ============================================================================

export interface ArticleInfo {
  id: string
  uri: string
  lang: Language
  isDuplicate: boolean
  date: string
  time: string
  dateTime: string
  dateTimePub: string
  dataType: string
  sim: number
  url: string
  title: string
  body: string
  source: {
    uri: string
    dataType: string
    title: string
  }
  authors?: Array<{
    uri: string
    name: string
    type: string
  }>
  image?: string
  eventUri?: string
  sentiment?: number
  wgt: number
  relevance: number
}

export interface ArticleSearchParams {
  keyword?: string
  conceptUri?: string
  categoryUri?: string
  sourceUri?: string
  sourceLocationUri?: string
  sourceGroupUri?: string
  authorUri?: string
  locationUri?: string
  lang?: Language | Language[]
  dateStart?: string // YYYY-MM-DD
  dateEnd?: string // YYYY-MM-DD
  dateMentionStart?: string
  dateMentionEnd?: string
  keywordLoc?: "body" | "title" | "body,title"
  keywordOper?: "and" | "or"
  ignoreKeyword?: string
  ignoreSourceUri?: string
  ignoreSourceLocationUri?: string
  ignoreSourceGroupUri?: string
  ignoreSourceLang?: string
  isDuplicateFilter?: "skipDuplicates" | "keepOnlyDuplicates"
  hasDuplicateFilter?: "skipHasDuplicates" | "keepOnlyHasDuplicates"
  eventFilter?: string
  startSourceRankPercentile?: number
  endSourceRankPercentile?: number
  minSentiment?: number
  maxSentiment?: number
  dataType?: string[]
}

export interface ArticleSearchRequest {
  action: "getArticles"
  keyword?: string
  conceptUri?: string
  categoryUri?: string
  sourceUri?: string
  lang?: Language | Language[]
  dateStart?: string
  dateEnd?: string
  articlesPage?: number
  articlesCount?: number
  articlesSortBy?: SortBy
  articlesSortByAsc?: boolean
  dataType?: string[]
  resultType?: "articles"
  apiKey?: string
}

export interface ArticleSearchResponse {
  articles: {
    results: ArticleInfo[]
    totalResults: number
    page: number
    count: number
    pages: number
  }
}

// ============================================================================
// Event Types
// ============================================================================

export interface EventInfo {
  uri: string
  title: {
    eng?: string
    [key: string]: string | undefined
  }
  summary: {
    eng?: string
    [key: string]: string | undefined
  }
  eventDate: string
  eventDateEnd?: string
  location?: {
    label: {
      eng?: string
      [key: string]: string | undefined
    }
    lat?: number
    long?: number
  }
  categories?: Array<{
    uri: string
    label: string
  }>
  concepts?: Array<{
    uri: string
    label: {
      eng?: string
      [key: string]: string | undefined
    }
    score: number
  }>
  totalArticleCount: number
  sentiment?: number
  wgt: number
  relevance?: number
  images?: string[]
  videos?: string[]
  stories?: Array<{
    uri: string
    title: string
    summary: string
    concepts: any[]
    categories: any[]
    location: any
    eventDate: string
    totalArticleCount: number
  }>
}

export interface EventSearchParams {
  keyword?: string
  conceptUri?: string
  categoryUri?: string
  sourceUri?: string
  sourceLocationUri?: string
  sourceGroupUri?: string
  locationUri?: string
  lang?: Language | Language[]
  dateStart?: string // YYYY-MM-DD
  dateEnd?: string // YYYY-MM-DD
  minArticlesInEvent?: number
  maxArticlesInEvent?: number
  dateMentionStart?: string
  dateMentionEnd?: string
  keywordLoc?: "body" | "title" | "body,title"
  keywordOper?: "and" | "or"
  ignoreKeyword?: string
  ignoreSourceUri?: string
  ignoreSourceLocationUri?: string
  ignoreSourceGroupUri?: string
  ignoreSourceLang?: string
  minSentiment?: number
  maxSentiment?: number
}

export interface EventSearchRequest {
  action: "getEvents"
  keyword?: string
  conceptUri?: string
  categoryUri?: string
  sourceUri?: string
  locationUri?: string
  lang?: Language | Language[]
  dateStart?: string
  dateEnd?: string
  eventsPage?: number
  eventsCount?: number
  eventsSortBy?: SortBy
  eventsSortByAsc?: boolean
  includeEventTitle?: boolean
  includeEventSummary?: boolean
  includeEventSocialScore?: boolean
  includeEventSentiment?: boolean
  includeEventLocation?: boolean
  includeEventDate?: boolean
  includeEventArticleCounts?: boolean
  includeEventConcepts?: boolean
  includeEventCategories?: boolean
  includeEventCommonDates?: boolean
  includeEventStories?: boolean
  resultType?: "events"
  apiKey?: string
}

export interface EventSearchResponse {
  events: {
    results: EventInfo[]
    totalResults: number
    page: number
    count: number
    pages: number
  }
}

// ============================================================================
// Concept & Category Types (for autocomplete/suggestions)
// ============================================================================

export interface ConceptInfo {
  id: number
  uri: string
  label: {
    eng?: string
    [key: string]: string | undefined
  }
  synonyms?: string[]
  image?: string
  type?: string
}

export interface CategoryInfo {
  id: number
  uri: string
  label: string
  parentUri?: string
}

export interface SourceInfo {
  id: number
  uri: string
  title: string
  description?: string
  location?: {
    country: {
      label: string
    }
  }
  ranking?: {
    importanceRank?: number
  }
}

// ============================================================================
// API Response Wrapper
// ============================================================================

export interface NewsAPIResponse<T> {
  data?: T
  error?: {
    message: string
    code?: string
  }
}
