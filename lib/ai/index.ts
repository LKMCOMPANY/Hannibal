/**
 * AI Module Entry Point
 *
 * Central export for all AI functionality
 */

// Configuration
export { AI_MODELS, AI_SETTINGS, AGENT_CONFIGS, AI_LIMITS } from "./config"

// Agent Types
export type {
  AgentContext,
  MediaGuidelines,
  ContentOperation,
  AgentResponse,
  StreamingResponse,
  CampaignContext, // Added campaign context type
  CampaignArticleData, // Added campaign article data type
  CampaignArticleResult, // Added campaign article result type
} from "./agents/types"

// Redactor Agent
export {
  editContent,
  generateMetadata,
} from "./agents/redactor"

export type {
  RedactorInput,
  RedactorOutput,
  MetadataGenerationInput,
  MetadataGenerationOutput,
} from "./agents/redactor"

// Campaign Agent
export { generateCampaignArticle, validateCampaignArticle } from "./agents/campaign"

// Server Actions
export {
  editContentAction,
  generateMetadataAction,
  generateCampaignArticleAction, // Added campaign article action
} from "./actions/redactor-actions"

// Content Tools
export {
  stripHtml,
  countWords,
  countCharacters,
  truncateText,
  extractFirstParagraph,
  calculateReadingTime,
  extractHeadings,
  generateExcerpt,
  isValidHtml,
  normalizeHtml,
  extractKeywords,
  analyzeContentQuality,
} from "./tools/content-tools"
