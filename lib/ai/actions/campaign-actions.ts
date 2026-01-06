"use server"

/**
 * Campaign Agent Server Actions
 *
 * Server-side actions for campaign-based content generation
 */

import { generateCampaignArticle, validateCampaignArticle } from "../agents/campaign"
import type { CampaignContext, CampaignArticleResult } from "../agents/types"
import { getSiteById } from "@/lib/data/sites"
import { getAuthorById } from "@/lib/data/authors"
import { getArticleById } from "@/lib/data/articles"

type GenerateCampaignArticleInput = {
  sourceArticleId: number
  targetSiteId: number
  targetAuthorId?: number
  customInstructions?: string
  xPostMaxLength?: number
}

/**
 * Generate an adapted article for a campaign target
 */
export async function generateCampaignArticleAction(
  input: GenerateCampaignArticleInput,
): Promise<CampaignArticleResult> {
  try {
    // Fetch source article
    const sourceArticle = await getArticleById(input.sourceArticleId)
    if (!sourceArticle) {
      return {
        success: false,
        error: "Source article not found",
      }
    }

    // Fetch source site
    const sourceSite = await getSiteById(sourceArticle.site_id)
    if (!sourceSite) {
      return {
        success: false,
        error: "Source site not found",
      }
    }

    // Fetch target site
    const targetSite = await getSiteById(input.targetSiteId)
    if (!targetSite) {
      return {
        success: false,
        error: "Target site not found",
      }
    }

    // Build context
    const context: CampaignContext = {
      targetMediaName: targetSite.name,
      targetLanguage: targetSite.language || "en",
      targetCountry: targetSite.country || undefined,
      targetStylisticGuideline: targetSite.guideline_stylistic || undefined,
      targetPoliticalGuideline: targetSite.guideline_political || undefined,
      targetIdeology: targetSite.ideology || undefined,
      sourceMediaName: sourceSite.name,
      sourceLanguage: sourceSite.language || undefined,
      customInstructions: input.customInstructions || undefined,
      xPostMaxLength: input.xPostMaxLength,
    }

    // Fetch target author if specified
    if (input.targetAuthorId) {
      const targetAuthor = await getAuthorById(input.targetAuthorId)
      if (targetAuthor) {
        context.targetAuthorName = `${targetAuthor.first_name} ${targetAuthor.last_name}`.trim()
        context.targetAuthorStyle = targetAuthor.style || undefined
      }
    }

    // Generate adapted article
    const result = await generateCampaignArticle(sourceArticle.content, sourceArticle.title, context)

    // Validate result
    if (result.success && !validateCampaignArticle(result)) {
      return {
        success: false,
        error: "Generated article failed validation",
      }
    }

    return result
  } catch (error) {
    console.error("[v0] Generate campaign article action error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate campaign article",
    }
  }
}
