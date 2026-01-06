import { generateText } from "ai"
import { getAIModel } from "../config"
import type { CampaignContext, CampaignArticleResult } from "./types"
import { ARTICLE_CATEGORIES } from "@/lib/constants/categories"
import { parseAIResponse } from "@/lib/utils/json-parser"

/**
 * Campaign Agent
 *
 * Specialized AI agent for campaign-based content adaptation and distribution.
 * Capabilities:
 * - Adapt source articles for different media outlets
 * - Apply target media's style and political guidelines
 * - Adopt specific author's writing style
 * - Generate SEO-optimized content for Google and AI chatbots
 * - Create human-like, natural content
 * - Maintain factual accuracy while adapting tone and perspective
 */

const CAMPAIGN_SYSTEM_PROMPT = `You are an expert content strategist and journalist specializing in multi-platform content distribution.

Your core responsibilities:

1. **Content Adaptation**: Transform source articles for different media outlets
   - Maintain core facts and information
   - Adapt tone, perspective, and emphasis to match target media
   - Apply target media's stylistic and political guidelines
   - Adopt the selected author's unique writing style
   - Make each version feel native to its platform

2. **SEO Optimization**: Create content optimized for discovery
   - Google search rankings (natural keyword integration)
   - AI chatbot references (ChatGPT, Claude, Perplexity, etc.)
   - Social media sharing (compelling hooks and excerpts)
   - Clear information hierarchy (H1, H2, H3 structure)

3. **Human-Like Writing**: Write naturally and authentically
   - NEVER use em dashes (—) in sentences
   - Use commas, periods, and semicolons for natural flow
   - Avoid overly formal or academic language
   - Write as a human journalist would write
   - Use contractions when appropriate
   - Vary sentence length for natural rhythm
   - Make it indistinguishable from human-written content

4. **Content Formatting**: Return properly formatted HTML
   - Use <h1> for main titles (only one per article)
   - Use <h2> and <h3> for section headings
   - Use <strong> for emphasis (not <b>)
   - Use <em> for italics when needed
   - Use <p> tags for paragraphs with proper spacing
   - Use <a href="url"> for links
   - Use <ul> and <ol> for lists
   - Use <blockquote> for quotes

5. **Metadata Generation**: Create compelling metadata
   - Title: 50-60 characters, click-worthy, includes main keyword
   - Excerpt: 150-200 characters, engaging summary
   - Meta Description: Under 160 characters, includes call-to-action
   - Tags: 5-8 relevant tags for categorization and SEO
   - Category: Single most relevant category

6. **Quality Standards**:
   - Factual accuracy (never invent facts)
   - Clear, concise writing
   - Engaging and readable
   - Professional but accessible
   - Error-free grammar and spelling
   - Appropriate for target audience

Remember: Each adapted article should feel like it was originally written for that specific media outlet by that specific author.`

function buildCampaignContextPrompt(context: CampaignContext): string {
  const parts: string[] = []

  // Target media information
  parts.push(`TARGET MEDIA INFORMATION:`)
  parts.push(`Media Name: ${context.targetMediaName}`)
  parts.push(`Language: ${context.targetLanguage}`)

  if (context.targetCountry) {
    parts.push(`Country: ${context.targetCountry}`)
  }

  // Stylistic guidelines
  if (context.targetStylisticGuideline) {
    parts.push(`\nSTYLISTIC GUIDELINES:`)
    parts.push(context.targetStylisticGuideline)
  }

  // Political/ideological guidelines
  if (context.targetPoliticalGuideline) {
    parts.push(`\nEDITORIAL STANCE:`)
    parts.push(context.targetPoliticalGuideline)
  }

  if (context.targetIdeology) {
    parts.push(`\nIdeological Alignment: ${context.targetIdeology}`)
  }

  // Author style
  if (context.targetAuthorStyle) {
    parts.push(`\nAUTHOR'S WRITING STYLE:`)
    parts.push(context.targetAuthorStyle)
    parts.push(
      `\nIMPORTANT: Adopt this author's unique voice, tone, sentence structure, and writing patterns while maintaining quality and guidelines.`,
    )
  }

  if (context.targetAuthorName) {
    parts.push(`\nAuthor Name: ${context.targetAuthorName}`)
  }

  // X post character limit constraint
  if (context.xPostMaxLength) {
    parts.push(`\nX POST CHARACTER LIMIT:`)
    parts.push(`Maximum ${context.xPostMaxLength} characters (the article URL will be appended automatically)`)
    parts.push(`CRITICAL: Your X post text MUST NOT exceed ${context.xPostMaxLength} characters`)
  }

  // Custom instructions
  if (context.customInstructions) {
    parts.push(`\nSPECIAL INSTRUCTIONS:`)
    parts.push(context.customInstructions)
  }

  return parts.join("\n")
}

/**
 * Generate an adapted article for a campaign target
 */
export async function generateCampaignArticle(
  sourceContent: string,
  sourceTitle: string,
  context: CampaignContext,
): Promise<CampaignArticleResult> {
  const model = getAIModel("campaign")

  const contextPrompt = buildCampaignContextPrompt(context)

  const validCategories = ARTICLE_CATEGORIES.map((c) => c.value).join(", ")

  const xPostMaxLength = context.xPostMaxLength || 170  // Conservative (leaves room for URL)
  const xPostInstructions = `X POST REQUIREMENTS:
- Write a short, engaging Twitter/X post text ONLY (MAXIMUM ${xPostMaxLength} characters)
- Natural, human-like style (not robotic or promotional)
- Create curiosity or urgency to drive clicks
- Conversational tone appropriate for social media
- NO hashtags, NO emojis, NO promotional language
- DO NOT include any URLs - the article URL will be automatically added
- Write ONLY the tweet text, not the URL
- CRITICAL: Respect the ${xPostMaxLength} character limit for TEXT ONLY`

  const fullPrompt = `You are adapting an article from "${context.sourceMediaName}" for publication on "${context.targetMediaName}".

${contextPrompt}

TASK:
1. Read and understand the source article below
2. Adapt it for the target media while:
   - Maintaining all factual information
   - Applying the target media's style and political guidelines
   - Adopting the author's writing style
   - Writing in ${context.targetLanguage}
   - Optimizing for SEO (Google + AI chatbots)
   - Making it feel native to the target platform
3. Generate appropriate metadata (title, excerpt, meta description, tags, category, X post)

IMPORTANT - CATEGORY SELECTION:
You MUST select ONE category from this exact list (case-sensitive):
${validCategories}

Do NOT create new categories or use variations. Choose the single most relevant category from the list above.

${xPostInstructions}

SOURCE ARTICLE:
Title: ${sourceTitle}

Content:
${sourceContent}

RESPONSE FORMAT:
Return a JSON object with the following structure:
{
  "title": "Adapted article title (50-60 chars, compelling, SEO-optimized)",
  "content": "Full adapted article content as HTML with proper formatting",
  "excerpt": "Engaging summary (150-200 chars)",
  "metaDescription": "SEO meta description (under 160 chars)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "One of: ${validCategories}",
  "xPost": "Engaging X/Twitter post text (max ${xPostMaxLength} chars, human-like, no hashtags/emojis)",
  "featuredImageCaption": "Photo caption (30-80 chars, describe image + source credit if known, in target language)"
}

CRITICAL JSON FORMATTING RULES:
- Escape all quotes in content with backslash: \\"
- Escape all newlines with \\n
- Do NOT include any text outside the JSON object
- Ensure all strings are properly closed
- Ensure all objects and arrays are properly closed

Return ONLY valid JSON, no additional text or markdown code blocks.`

  try {
    const { text, usage } = await generateText({
      model: model,
      system: CAMPAIGN_SYSTEM_PROMPT,
      prompt: fullPrompt,
      temperature: 0.7,
      maxTokens: 6000,
    })

    const result = parseAIResponse(text)

    // Validate required fields
    if (!result.title || !result.content) {
      throw new Error("Missing required fields in AI response")
    }

    const validCategoryValues = ARTICLE_CATEGORIES.map((c) => c.value)
    if (!validCategoryValues.includes(result.category)) {
      result.category = "Politics"
    }

    let finalXPost = result.xPost || ""
    if (finalXPost.length > xPostMaxLength) {
      const chars = Array.from(finalXPost)
      finalXPost = chars.slice(0, xPostMaxLength - 3).join("") + "..."
    }

    return {
      success: true,
      data: {
        title: result.title,
        content: result.content,
        excerpt: result.excerpt || "",
        metaDescription: result.metaDescription || "",
        tags: Array.isArray(result.tags) ? result.tags : [],
        category: result.category,
        xPost: finalXPost,
        featuredImageCaption: result.featuredImageCaption || undefined,
      },
      usage: {
        promptTokens: usage?.promptTokens || 0,
        completionTokens: usage?.completionTokens || 0,
        totalTokens: usage?.totalTokens || 0,
      },
    }
  } catch (error) {
    console.error("[Hannibal] Campaign article generation failed:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate campaign article",
    }
  }
}

/**
 * Validate campaign article result
 */
export function validateCampaignArticle(result: CampaignArticleResult): boolean {
  if (!result.success || !result.data) {
    return false
  }

  const { title, content, excerpt, xPost } = result.data

  // Check required fields
  if (!title || title.length < 10 || title.length > 200) {
    return false
  }

  if (!content || content.length < 100) {
    return false
  }

  if (!excerpt || excerpt.length < 50) {
    return false
  }

  // Note: This validation is lenient since we truncate in the processor if needed
  if (!xPost || xPost.length < 1) {
    return false
  }

  return true
}
