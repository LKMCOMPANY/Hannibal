"use server"

/**
 * Redactor Agent Server Actions
 *
 * Server-side actions for content editing and metadata generation
 */

import { executeRedactorOperation, generateArticleMetadata } from "../agents/redactor"
import type { RedactorOperation, RedactorContext } from "../agents/types"
import { getSiteById } from "@/lib/data/sites"
import { getAuthorById } from "@/lib/data/authors"

type EditContentInput = {
  content: string
  operation: RedactorOperation
  siteId: number
  authorId?: number
  additionalInstructions?: string
}

type GenerateMetadataInput = {
  content: string
  siteId: number
  authorId?: number
  slug?: string
}

/**
 * Edit content with AI assistance
 */
export async function editContentAction(input: EditContentInput) {
  try {
    const site = await getSiteById(input.siteId)
    if (!site) {
      return {
        success: false,
        error: "Site not found",
      }
    }

    const context: RedactorContext = {
      language: site.language || "en",
      stylisticGuideline: site.guideline_stylistic || undefined,
      politicalGuideline: site.guideline_political || undefined,
      ideology: site.ideology || undefined,
    }

    if (input.authorId) {
      const author = await getAuthorById(input.authorId)
      if (author?.style) {
        context.authorStyle = author.style
      }
    }

    let contentToProcess = input.content
    if (input.additionalInstructions) {
      contentToProcess = `${input.content}\n\nAdditional Instructions: ${input.additionalInstructions}`
    }

    const result = await executeRedactorOperation(input.operation, contentToProcess, context)

    return {
      success: true,
      data: {
        editedContent: result,
        operation: input.operation,
      },
    }
  } catch (error) {
    console.error("[v0] Edit content action error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to edit content",
    }
  }
}

/**
 * Generate metadata from content
 */
export async function generateMetadataAction(input: GenerateMetadataInput) {
  try {
    const site = await getSiteById(input.siteId)
    if (!site) {
      return {
        success: false,
        error: "Site not found",
      }
    }

    const context: RedactorContext = {
      language: site.language || "en",
      stylisticGuideline: site.guideline_stylistic || undefined,
      politicalGuideline: site.guideline_political || undefined,
      ideology: site.ideology || undefined,
    }

    if (input.authorId) {
      const author = await getAuthorById(input.authorId)
      if (author?.style) {
        context.authorStyle = author.style
      }
    }

    let publicUrl: string | undefined
    if (input.slug) {
      const domain = site.custom_domain || site.hostname
      publicUrl = `https://${domain}/article/${input.slug}`
    }

    const metadata = await generateArticleMetadata(input.content, context, publicUrl)

    // Clean and prepare X post text (don't add URL here - publish form will do it)
    let xPost = metadata.xPost
    if (xPost) {
      const { removeUrls, smartTruncate } = await import("@/lib/utils/text")
      
      // Remove any URLs the AI might have added
      xPost = removeUrls(xPost)
      
      // Smart truncate if needed (by sentence)
      if (publicUrl) {
        const maxLength = 280 - publicUrl.length - 6  // Leave room for URL + safety
        if (xPost.length > maxLength) {
          xPost = smartTruncate(xPost, maxLength)
        }
      }
    }

    return {
      success: true,
      data: {
        title: metadata.title,
        excerpt: metadata.excerpt,
        metaDescription: metadata.metaDescription,
        suggestedTags: metadata.tags,
        xPost: xPost,  // Text only, publish form will add URL
      },
    }
  } catch (error) {
    console.error("[v0] Generate metadata action error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate metadata",
    }
  }
}
