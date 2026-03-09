/**
 * Campaign Publication Processor
 *
 * Core logic for processing campaign publications:
 * 1. Fetch source article and target site information
 * 2. Generate adapted article using Campaign AI Agent
 * 3. Create article in target site
 * 4. Update campaign publication status
 */

import { generateCampaignArticleAction } from "@/lib/ai/actions/campaign-actions"
import { createArticle, generateUniqueSlug } from "@/lib/data/publisher"
import { getArticleById } from "@/lib/data/articles"
import { getSiteById } from "@/lib/data/sites"
import { getAuthorsBySiteId } from "@/lib/data/authors"
import { sql } from "@/lib/db"
import type { CampaignPublicationJob } from "../qstash"
import { ARTICLE_CATEGORIES } from "@/lib/constants/categories"
import { getCampaignById as fetchCampaignById } from "@/lib/data/campaigns"

export type ProcessorResult = {
  success: boolean
  articleId?: number
  error?: string
}

/**
 * Process a single campaign publication
 *
 * This function is called by the QStash webhook handler
 * and handles the complete workflow of generating and publishing
 * an adapted article for a target site
 */
export async function processCampaignPublication(job: CampaignPublicationJob): Promise<ProcessorResult> {
  const { campaignId, publicationId, sourceArticleId, targetSiteId, targetAuthorId, customInstructions } = job

  try {
    // Update publication status to processing
    await updatePublicationStatus(publicationId, "processing")

    const campaign = await fetchCampaignById(campaignId)
    if (!campaign) {
      throw new Error(`Campaign ${campaignId} not found`)
    }

    // Fetch source article
    const sourceArticle = await getArticleById(sourceArticleId)
    if (!sourceArticle) {
      throw new Error(`Source article ${sourceArticleId} not found`)
    }

    // Fetch target site
    const targetSite = await getSiteById(targetSiteId)
    if (!targetSite) {
      throw new Error(`Target site ${targetSiteId} not found`)
    }

    const targetHostname = targetSite.custom_domain || targetSite.hostname

    const tempSlug = (await import("@/lib/data/publisher")).generateSlug(sourceArticle.title)
    // Assume worst case: slug might get "-999" suffix, so add 4 chars margin
    const estimatedUrl = `https://${targetHostname}/article/${tempSlug}-999`
    const xPostMaxLength = 280 - estimatedUrl.length - 1 // -1 for space before URL

    let finalTargetAuthorId: number | null = targetAuthorId || null

    // If no author specified, try to find a matching author or use the first available
    if (!finalTargetAuthorId) {
      const targetAuthors = await getAuthorsBySiteId(targetSiteId)

      if (targetAuthors.length === 0) {
        void 0
        finalTargetAuthorId = null
      } else {
        // Try to find author with same name as source article author
        if (sourceArticle.author_id) {
          const sourceAuthor = await getAuthorById(sourceArticle.author_id)
          if (sourceAuthor) {
            const matchingAuthor = targetAuthors.find(
              (a) => a.first_name === sourceAuthor.first_name && a.last_name === sourceAuthor.last_name,
            )
            finalTargetAuthorId = matchingAuthor?.id || targetAuthors[0].id
          } else {
            finalTargetAuthorId = targetAuthors[0].id
          }
        } else {
          finalTargetAuthorId = targetAuthors[0].id
        }
      }
    }

    // Generate adapted article using Campaign AI Agent
    const aiResult = await generateCampaignArticleAction({
      sourceArticleId,
      targetSiteId,
      targetAuthorId: finalTargetAuthorId || undefined,
      customInstructions,
      xPostMaxLength,
    })

    if (!aiResult.success || !aiResult.data) {
      throw new Error(aiResult.error || "Failed to generate adapted article")
    }

    const { title, content, excerpt, metaDescription, tags, category, xPost, featuredImageCaption } = aiResult.data

    const validCategoryValues = ARTICLE_CATEGORIES.map((c) => c.value)
    const finalCategory = validCategoryValues.includes(category) ? category : "Politics"

    void (category !== finalCategory)

    const generatedSlug = await generateUniqueSlug(title, targetSiteId)

    const publicUrl = `https://${targetHostname}/article/${generatedSlug}`

    // Prepare X post with smart truncation (by sentence)
    let completeXPost = publicUrl
    if (xPost) {
      const { prepareXPostText } = await import("@/lib/utils/text")
      completeXPost = prepareXPostText(xPost, publicUrl, xPostMaxLength)
    }

    let selectedImageUrl = sourceArticle.featured_image_url || undefined
    let selectedImageCaption = sourceArticle.featured_image_caption || undefined
    let selectedImageAlt = sourceArticle.featured_image_alt || undefined

    if (campaign.campaign_images && campaign.campaign_images.length > 0) {
      // Randomly select an image from the campaign images
      const randomIndex = Math.floor(Math.random() * campaign.campaign_images.length)
      selectedImageUrl = campaign.campaign_images[randomIndex]

      // Use AI-generated caption or fallback to generic caption
      selectedImageCaption = featuredImageCaption || `Campaign Image ${randomIndex + 1}`
      selectedImageAlt = title // Use article title as alt text

    } else {
      selectedImageCaption = featuredImageCaption || sourceArticle.featured_image_caption || undefined
    }

    const createdArticle = await createArticle({
      title,
      slug: generatedSlug,
      content,
      excerpt,
      meta_description: metaDescription,
      x_post: completeXPost,
      tags,
      category: finalCategory,
      site_id: targetSiteId,
      author_id: finalTargetAuthorId || undefined,
      status: "published",
      published_at: new Date().toISOString(),
      source_type: "campaign",
      featured_image_url: selectedImageUrl,
      featured_image_caption: selectedImageCaption,
      featured_image_alt: selectedImageAlt,
    })

    await updatePublicationStatus(publicationId, "published", createdArticle.id, undefined, selectedImageUrl)

    // Check if all publications are complete and update campaign status
    await checkAndUpdateCampaignStatus(campaignId)

    return {
      success: true,
      articleId: createdArticle.id,
    }
  } catch (error) {
    void error

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // Update publication status to failed
    await updatePublicationStatus(publicationId, "failed", undefined, errorMessage)

    // Update campaign status if needed
    await checkAndUpdateCampaignStatus(campaignId)

    return {
      success: false,
      error: errorMessage,
    }
  }
}

/**
 * Update campaign publication status
 */
async function updatePublicationStatus(
  publicationId: number,
  status: string,
  generatedArticleId?: number,
  errorMessage?: string,
  selectedImageUrl?: string,
): Promise<void> {
  try {
    await sql`
      UPDATE campaign_publications
      SET 
        status = ${status},
        generated_article_id = ${generatedArticleId || null},
        error_message = ${errorMessage || null},
        selected_image_url = ${selectedImageUrl || null},
        published_at = ${status === "published" ? new Date().toISOString() : null},
        updated_at = NOW()
      WHERE id = ${publicationId}
    `
  } catch (error) {
    void error
    throw error
  }
}

/**
 * Check campaign completion and update status
 */
async function checkAndUpdateCampaignStatus(campaignId: number): Promise<void> {
  try {
    // Get publication statistics
    const stats = await sql`
      SELECT 
        COUNT(*) as total,
        COUNT(*) FILTER (WHERE status = 'published') as published,
        COUNT(*) FILTER (WHERE status = 'failed') as failed,
        COUNT(*) FILTER (WHERE status = 'processing') as processing,
        COUNT(*) FILTER (WHERE status = 'pending') as pending
      FROM campaign_publications
      WHERE campaign_id = ${campaignId}
    `

    const { total, published, failed, processing, pending } = stats[0]

    // Determine campaign status
    let campaignStatus = "processing"
    let completedAt = null

    if (Number(processing) === 0 && Number(pending) === 0) {
      // All publications are either published or failed
      if (Number(failed) === Number(total)) {
        campaignStatus = "failed"
      } else {
        campaignStatus = "completed"
      }
      completedAt = new Date().toISOString()
    }

    // Update campaign status
    await sql`
      UPDATE campaigns
      SET 
        status = ${campaignStatus},
        completed_at = ${completedAt},
        updated_at = NOW()
      WHERE id = ${campaignId}
    `
  } catch (error) {
    void error
    // Don't throw - this is not critical
  }
}

/**
 * Get author by ID (helper function)
 */
async function getAuthorById(authorId: number) {
  try {
    const result = await sql`
      SELECT * FROM authors WHERE id = ${authorId} LIMIT 1
    `
    return result[0] || null
  } catch (error) {
    void error
    return null
  }
}
