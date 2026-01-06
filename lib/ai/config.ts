/**
 * AI Configuration Module
 *
 * Centralized configuration for AI SDK with Claude Sonnet via Anthropic Direct
 * Configured for Render deployment (no Vercel AI Gateway)
 */

import { anthropic } from "@ai-sdk/anthropic"

/**
 * Create Anthropic model instances
 * Using direct Anthropic provider (not Vercel AI Gateway)
 */
export const AI_MODELS = {
  // Primary model for content generation and editing
  redactor: anthropic("claude-sonnet-4-20250514"),

  // Campaign model for multi-platform content adaptation
  campaign: anthropic("claude-sonnet-4-20250514"),

  // Fast model for quick operations
  fast: anthropic("claude-sonnet-4-20250514"),

  // Extended context for long-form content
  extended: anthropic("claude-sonnet-4-20250514"),
} as const

/**
 * Default AI generation settings
 */
export const AI_SETTINGS = {
  temperature: 0.7,
  maxTokens: 4096,
  topP: 0.9,
} as const

/**
 * Agent-specific configurations
 */
export const AGENT_CONFIGS = {
  redactor: {
    model: AI_MODELS.redactor,
    temperature: 0.7,
    maxTokens: 4096,
    systemPrompt: `You are a professional content editor and translator for a media publication.
Your role is to help journalists and content creators improve their articles by:
- Correcting grammar, spelling, and punctuation errors
- Reformulating sentences for better clarity and flow
- Translating content while preserving tone and meaning
- Adapting content to match specific stylistic and political guidelines

You always maintain the original intent and key information while improving readability.
You respect the editorial guidelines provided and adapt your suggestions accordingly.`,
  },
} as const

/**
 * Rate limiting and safety
 */
export const AI_LIMITS = {
  maxRequestsPerMinute: 20,
  maxTokensPerRequest: 4096,
  timeoutMs: 30000,
} as const

/**
 * Get AI model for a specific agent
 * @param agent - The agent type (e.g., "redactor", "fast", "extended", "campaign")
 * @returns Anthropic model instance for use with AI SDK
 */
export function getAIModel(agent: keyof typeof AI_MODELS) {
  return AI_MODELS[agent]
}
