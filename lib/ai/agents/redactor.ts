import { generateText } from "ai"
import { getAIModel } from "../config"
import type { RedactorOperation, RedactorContext } from "./types"
import { stripMarkdownCodeBlocks, parseAIResponse } from "@/lib/utils/json-parser"

/**
 * Redactor Agent
 *
 * Specialized AI agent for content editing and optimization.
 * Capabilities:
 * - Correct grammar, spelling, and punctuation
 * - Reformulate content for better clarity and flow
 * - Translate to target language
 * - Improve overall content quality
 * - Generate SEO-optimized metadata
 * - Apply media guidelines and author style
 * - Write in natural, human-like style
 */

const REDACTOR_SYSTEM_PROMPT = `You are an expert content editor and SEO specialist for a professional news media platform.

Your core responsibilities:
1. **SEO Optimization**: Create content optimized for both Google search and AI chatbots (ChatGPT, Claude, etc.)
   - Use natural keyword integration
   - Create compelling, click-worthy titles
   - Write meta descriptions that drive clicks (under 160 characters)
   - Structure content with clear hierarchy (H1, H2, H3)
   - Include relevant semantic keywords naturally

2. **Human-Like Writing**: Write in a natural, conversational style
   - NEVER use em dashes (—) in sentences
   - Use commas, periods, and semicolons for natural flow
   - Avoid overly formal or academic language
   - Write as a human journalist would write
   - Use contractions when appropriate
   - Vary sentence length for natural rhythm

3. **Content Formatting**: Return properly formatted HTML
   - Use <h1> for main titles
   - Use <h2> and <h3> for section headings
   - Use <strong> for emphasis (not <b>)
   - Use <em> for italics when needed
   - Use <p> tags for paragraphs with proper spacing
   - Use <a href="url"> for links
   - Use <ul> and <ol> for lists
   - Use <blockquote> for quotes

4. **Style Adherence**: Follow the provided guidelines
   - Match the media's stylistic guidelines
   - Align with the media's political/ideological stance
   - Adopt the author's writing style if provided
   - Maintain consistency in tone and voice

5. **Quality Standards**:
   - Factual accuracy
   - Clear, concise writing
   - Engaging and readable
   - Professional but accessible
   - Error-free grammar and spelling

Remember: Your output should be indistinguishable from content written by a skilled human journalist.`

const OPERATION_PROMPTS = {
  adapt: `Adapt and reformulate the following content:
- Reformulate the text for better clarity and engagement
- Apply the media's stylistic and political guidelines
- Adopt the author's writing style if provided
- DO NOT translate - keep the same language as the input
- Improve sentence structure and flow
- Add proper HTML formatting (headings, paragraphs, emphasis)
- Make it more compelling and readable
- Use natural punctuation (commas, periods) - NEVER use em dashes (—)

Return the adapted content as properly formatted HTML in the SAME language as the input.`,

  translate: `Translate the following content to {language}:
- Translate accurately while maintaining meaning and tone
- Adapt idioms and expressions naturally for the target language
- Use proper HTML formatting
- Ensure cultural appropriateness
- Keep the same structure and formatting
- Write naturally - NEVER use em dashes (—)

Return ONLY the translated content as properly formatted HTML, nothing else.`,

  develop: `Develop and expand the following content into a comprehensive article:
- Expand on key points with more detail and context
- Add relevant information and insights
- Structure with clear hierarchy (H1 for title, H2/H3 for sections)
- Optimize for Google SEO with natural keyword integration
- Optimize for AI chatbot indexing (ChatGPT, Claude, etc.)
- Apply media's stylistic and political guidelines
- Adopt author's writing style if provided
- Make it engaging, informative, and professional
- Use proper HTML formatting throughout
- Write naturally - NEVER use em dashes (—)

Return the developed article as properly formatted HTML with clear structure.`,

  generate_metadata: `Based on the article content, generate SEO-optimized metadata:

Requirements:
- **Title**: Compelling, click-worthy, 50-60 characters, includes main keyword
- **Excerpt**: Engaging summary, 150-200 characters, entices readers
- **Meta Description**: SEO-optimized, under 160 characters, includes call-to-action
- **Tags**: 5-8 relevant tags for categorization and SEO
- **X Post**: Short, engaging Twitter/X post TEXT ONLY{xPostConstraint}

X Post Guidelines:
- Write in a natural, human-like style (not robotic or promotional)
- Create urgency or curiosity to drive clicks
- Use conversational tone appropriate for social media
- NO hashtags, NO emojis, NO promotional language
- DO NOT include any URLs - the article URL will be automatically added
- Write ONLY the tweet text, NOT the URL
- Keep it authentic and compelling

Optimization for:
- Google search rankings
- AI chatbot references (ChatGPT, Claude, etc.)
- Social media sharing and engagement
- User engagement

Return as JSON with keys: title, excerpt, metaDescription, tags (array of strings), xPost (string - text only, no URL).`,
}

function buildContextPrompt(context: RedactorContext): string {
  const parts: string[] = []

  // Media language
  if (context.language) {
    parts.push(`Target Language: ${context.language}`)
  }

  // Stylistic guidelines
  if (context.stylisticGuideline) {
    parts.push(`\nStylistic Guidelines:\n${context.stylisticGuideline}`)
  }

  // Political/ideological guidelines
  if (context.politicalGuideline) {
    parts.push(`\nEditorial Stance:\n${context.politicalGuideline}`)
  }

  // Media ideology
  if (context.ideology) {
    parts.push(`\nIdeological Alignment: ${context.ideology}`)
  }

  // Author style - NEW!
  if (context.authorStyle) {
    parts.push(`\nAuthor's Writing Style:\n${context.authorStyle}`)
    parts.push(
      `\nIMPORTANT: Adopt this author's unique voice, tone, and writing patterns while maintaining quality and guidelines.`,
    )
  }

  return parts.join("\n")
}

/**
 * Execute a redactor operation on content
 */
export async function executeRedactorOperation(
  operation: RedactorOperation,
  content: string,
  context: RedactorContext,
  publicUrl?: string, // Added publicUrl parameter for X post generation
): Promise<string> {
  const model = getAIModel("redactor")

  // Build the operation-specific prompt
  let operationPrompt = OPERATION_PROMPTS[operation]

  // Replace language placeholder for translation
  if (operation === "translate" && context.language) {
    operationPrompt = operationPrompt.replace("{language}", context.language)
  }

  if (operation === "generate_metadata") {
    // Use conservative estimate for max text length (leaves room for URL)
    const maxTextLength = publicUrl ? 280 - publicUrl.length - 6 : 170  // -6 for space + safety margin
    operationPrompt = operationPrompt.replace(
      "{xPostConstraint}",
      ` (maximum ${maxTextLength} characters for text only - URL will be added automatically)`,
    )
  }

  // Build context information
  const contextPrompt = buildContextPrompt(context)

  // Construct the full prompt
  const fullPrompt = `${operationPrompt}

${contextPrompt ? `\nContext:\n${contextPrompt}\n` : ""}

Content to process:
${content}

${operation === "generate_metadata" ? "Return ONLY valid JSON, no additional text." : "Return ONLY the processed HTML content, no additional text or explanations."}`

  try {
    const { text } = await generateText({
      model: model,
      system: REDACTOR_SYSTEM_PROMPT,
      prompt: fullPrompt,
      temperature: 0.7,
      maxTokens: 4000,
    })

    return text.trim()
  } catch (error) {
    console.error("[Hannibal] Redactor operation failed:", error)
    throw new Error(
      `Failed to execute ${operation} operation: ${error instanceof Error ? error.message : "Unknown error"}`,
    )
  }
}

/**
 * Generate article metadata based on content
 */
export async function generateArticleMetadata(
  content: string,
  context: RedactorContext,
  publicUrl?: string, // Added publicUrl parameter for X post generation
): Promise<{
  title: string
  excerpt: string
  metaDescription: string
  tags: string[]
  xPost: string // Added xPost to return type
}> {
  const result = await executeRedactorOperation("generate_metadata", content, context, publicUrl)

  try {
    const cleanedResult = stripMarkdownCodeBlocks(result)
    console.log("[v0] Cleaned metadata response:", cleanedResult.substring(0, 200))

    const metadata = parseAIResponse(cleanedResult)

    // Validate and return
    return {
      title: metadata.title || "",
      excerpt: metadata.excerpt || "",
      metaDescription: metadata.metaDescription || "",
      tags: Array.isArray(metadata.tags) ? metadata.tags : [],
      xPost: metadata.xPost || "", // Added xPost field
    }
  } catch (error) {
    console.error("[v0] Failed to parse metadata JSON:", error)
    console.error("[v0] Raw response:", result)
    throw new Error("Failed to generate metadata: Invalid response format")
  }
}
