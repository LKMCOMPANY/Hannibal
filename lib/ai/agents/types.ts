/**
 * AI Agent Type Definitions
 *
 * Shared types for all AI agents in the system
 */

/**
 * Base agent context that all agents receive
 */
export type AgentContext = {
  userId?: string
  siteId?: number
  timestamp: string
}

/**
 * Media guidelines for content generation
 */
export type MediaGuidelines = {
  language: string
  stylisticGuideline?: string
  politicalGuideline?: string
  ideology?: string
}

/**
 * Content operation types
 */
export type ContentOperation = "adapt" | "translate" | "develop"

/**
 * Agent response structure
 */
export type AgentResponse<T = any> = {
  success: boolean
  data?: T
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}

/**
 * Streaming response for real-time updates
 */
export type StreamingResponse = {
  stream: ReadableStream
  usage?: {
    promptTokens: number
    completionTokens: number
  }
}

/**
 * Redactor operation types
 * Simplified to 3 clear operations: adapt, translate, develop
 */
export type RedactorOperation = "adapt" | "translate" | "develop" | "generate_metadata"

/**
 * Context for redactor agent operations
 */
export type RedactorContext = {
  language?: string
  stylisticGuideline?: string
  politicalGuideline?: string
  ideology?: string
  authorStyle?: string
}

/**
 * Campaign operation types
 */
export type CampaignOperation = "generate_article" | "validate_content"

/**
 * Context for campaign agent operations
 */
export type CampaignContext = {
  // Target media information
  targetMediaName: string
  targetLanguage: string
  targetCountry?: string
  targetStylisticGuideline?: string
  targetPoliticalGuideline?: string
  targetIdeology?: string

  // Target author information
  targetAuthorName?: string
  targetAuthorStyle?: string

  // Source information
  sourceMediaName: string
  sourceLanguage?: string

  // Campaign-specific
  customInstructions?: string
  xPostMaxLength?: number // Maximum characters available for X post text (excluding URL)
}

/**
 * Campaign article generation result
 */
export type CampaignArticleData = {
  title: string
  content: string
  excerpt: string
  metaDescription: string
  tags: string[]
  category: string
  xPost: string // Added xPost field for Twitter/X post generation
  featuredImageCaption?: string // Photo caption with source credit (optional)
}

export type CampaignArticleResult = {
  success: boolean
  data?: CampaignArticleData
  error?: string
  usage?: {
    promptTokens: number
    completionTokens: number
    totalTokens: number
  }
}
