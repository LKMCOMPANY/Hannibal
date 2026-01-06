/**
 * Autonomous Publication Processor
 * 
 * Core logic for processing autonomous publications:
 * 1. Fetch best article from NewsAPI (via autonomous-article-fetcher)
 * 2. Transform article using Campaign AI Agent
 * 3. Create and publish article in target site
 * 4. Track publication in autonomous_publications table
 * 
 * Pattern: Follows campaign-processor.ts structure for consistency
 * MODULAR: Reuses Campaign Agent, Publisher Module, NewsAPI Fetcher
 */

import { generateText } from "ai"
import { getAIModel } from "@/lib/ai/config"
import { createArticle, generateUniqueSlug } from "@/lib/data/publisher"
import { getSiteById } from "@/lib/data/sites"
import { getAuthorsBySiteId } from "@/lib/data/authors"
import { fetchBestArticleForSite } from "@/lib/services/autonomous-article-fetcher"
import { sql } from "@/lib/db"
import type { AutonomousPublicationJob } from "@/lib/types/autonomous"
import type { ArticleInfo } from "@/lib/types/newsapi"
import { ARTICLE_CATEGORIES } from "@/lib/constants/categories"
import { parseAIResponse } from "@/lib/utils/json-parser"

// ============================================================================
// Types
// ============================================================================

export type ProcessorResult = {
  success: boolean
  articleId?: number
  error?: string
}

// ============================================================================
// Main Processor
// ============================================================================

/**
 * Process autonomous publication
 * 
 * Full workflow:
 * 1. Update status to processing
 * 2. Fetch site and author info
 * 3. Fetch best article from NewsAPI
 * 4. Transform with Campaign Agent AI
 * 5. Create and publish article
 * 6. Update publication status to published
 */
export async function processAutonomousPublication(
  job: AutonomousPublicationJob
): Promise<ProcessorResult> {
  const { publicationId, siteId, scheduledFor } = job

  try {
    console.log(`[Autonomous Processor] 🚀 Starting publication ${publicationId} for site ${siteId}`)

    // 1. UPDATE STATUS: processing
    await updatePublicationStatus(publicationId, "processing")

    // 2. GET SITE INFO
    const site = await getSiteById(siteId)
    if (!site) {
      throw new Error(`Site ${siteId} not found`)
    }

    console.log(`[Autonomous Processor] Site: ${site.name} (${site.language})`)

    // 3. FETCH BEST ARTICLE FROM NEWSAPI
    console.log(`[Autonomous Processor] Fetching article from NewsAPI...`)
    const fetchResult = await fetchBestArticleForSite({
      siteId,
      country: site.country_iso2,
      language: site.language || 'en'
    })

    if (!fetchResult.success || !fetchResult.article) {
      throw new Error(fetchResult.error || "Failed to fetch article from NewsAPI")
    }

    const newsArticle = fetchResult.article

    console.log(`[Autonomous Processor] ✅ Article fetched:`, {
      title: newsArticle.title.substring(0, 80),
      source: newsArticle.source.title
    })

    // 4. GET AUTHOR FOR SITE
    let authorId: number | null = null
    const authors = await getAuthorsBySiteId(siteId)
    if (authors.length > 0) {
      // Take first author
      authorId = authors[0].id
      console.log(`[Autonomous Processor] Using author: ${authors[0].first_name} ${authors[0].last_name}`)
    } else {
      console.log(`[Autonomous Processor] ⚠️  No author found for site ${siteId}`)
    }

    // 5. CALCULATE X POST MAX LENGTH
    const hostname = site.custom_domain || `site-${site.id}.example.com`
    const tempSlug = (await import("@/lib/data/publisher")).generateSlug(newsArticle.title)
    const estimatedUrl = `https://${hostname}/article/${tempSlug}-999`
    const xPostMaxLength = 280 - estimatedUrl.length - 1

    // 6. TRANSFORM WITH CAMPAIGN AGENT AI
    console.log(`[Autonomous Processor] 🤖 Transforming article with AI...`)
    const aiResult = await generateAutonomousArticle(
      newsArticle,
      site,
      authorId,
      xPostMaxLength
    )

    if (!aiResult.success || !aiResult.data) {
      throw new Error(aiResult.error || "Failed to generate article with AI")
    }

    const { title, content, excerpt, metaDescription, tags, category, xPost, featuredImageCaption } = aiResult.data

    console.log(`[Autonomous Processor] ✅ AI transformation complete`)

    // 7. VALIDATE CATEGORY
    const validCategories = ARTICLE_CATEGORIES.map(c => c.value)
    const finalCategory = validCategories.includes(category) ? category : "Politics"

    if (category !== finalCategory) {
      console.warn(`[Autonomous Processor] Category "${category}" not valid, using "${finalCategory}"`)
    }

    // 8. GENERATE UNIQUE SLUG
    const slug = await generateUniqueSlug(title, siteId)
    const publicUrl = `https://${hostname}/article/${slug}`

    // 9. PREPARE X POST (smart truncation by sentence)
    let completeXPost = publicUrl
    if (xPost) {
      const { prepareXPostText } = await import("@/lib/utils/text")
      completeXPost = prepareXPostText(xPost, publicUrl, xPostMaxLength)
    }

    // 10. UPLOAD IMAGE TO UPLOADTHING
    let uploadedImageUrl = newsArticle.image || undefined
    
    if (newsArticle.image) {
      try {
        console.log(`[Autonomous Processor] 📸 Uploading image to UploadThing...`)
        const { downloadAndUploadToBlob } = await import("@/lib/utils/image-upload")
        
        uploadedImageUrl = await downloadAndUploadToBlob(
          newsArticle.image,
          `autonomous-${siteId}-${Date.now()}.jpg`
        )
        
        console.log(`[Autonomous Processor] ✅ Image uploaded to UploadThing: ${uploadedImageUrl}`)
      } catch (error) {
        console.warn(`[Autonomous Processor] ⚠️  Image upload failed, using original URL:`, error)
        // Fallback to original URL if upload fails (better than no image)
        uploadedImageUrl = newsArticle.image
      }
    }

    // 11. CREATE ARTICLE (REUSE PUBLISHER MODULE)
    console.log(`[Autonomous Processor] 📝 Publishing article...`)
    const article = await createArticle({
      title,
      slug,
      content,
      excerpt,
      meta_description: metaDescription,
      x_post: completeXPost,
      tags,
      category: finalCategory,
      site_id: siteId,
      author_id: authorId,
      status: "published",
      published_at: new Date().toISOString(),
      source_type: "autonomous",  // NEW SOURCE TYPE
      featured_image_url: uploadedImageUrl,  // ← UploadThing URL now
      featured_image_alt: title,
      featured_image_caption: featuredImageCaption || `Photo: ${newsArticle.source.title}`,  // AI-generated or source credit
    })

    console.log(`[Autonomous Processor] ✅ Article created: ${article.id}`)

    // 12. UPDATE PUBLICATION STATUS: published
    await updatePublicationStatus(
      publicationId,
      "published",
      article.id,
      undefined,
      newsArticle
    )

    console.log(`[Autonomous Processor] ✅✅✅ Publication ${publicationId} completed successfully!`)
    console.log(`[Autonomous Processor] Article ${article.id} published on site ${siteId}: ${publicUrl}`)

    return {
      success: true,
      articleId: article.id
    }

  } catch (error) {
    console.error(`[Autonomous Processor] ❌ Error processing publication ${publicationId}:`, error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    
    // UPDATE STATUS: failed
    await updatePublicationStatus(publicationId, "failed", undefined, errorMessage)

    return {
      success: false,
      error: errorMessage
    }
  }
}

// ============================================================================
// AI Generation (Campaign Agent Pattern)
// ============================================================================

/**
 * Generate article using Campaign Agent
 * Pattern similar to campaign agent but adapted for NewsAPI source
 */
async function generateAutonomousArticle(
  newsArticle: ArticleInfo,
  site: any,
  authorId: number | null,
  xPostMaxLength: number
) {
  const model = getAIModel("campaign")

  // Get author info if available
  let authorName = ""
  let authorStyle = ""
  if (authorId) {
    try {
      const authorResult = await sql`
        SELECT first_name, last_name, writing_style FROM authors WHERE id = ${authorId} LIMIT 1
      `
      if (authorResult[0]) {
        authorName = `${authorResult[0].first_name} ${authorResult[0].last_name}`
        authorStyle = authorResult[0].writing_style || ""
      }
    } catch (error) {
      console.error("[Autonomous Processor] Error fetching author:", error)
    }
  }

  const validCategories = ARTICLE_CATEGORIES.map((c) => c.value).join(", ")

  const systemPrompt = `You are an expert content strategist and journalist specializing in adapting news articles for different media outlets.

Your task is to transform a news article from an external source into content perfectly suited for the target media outlet.

CRITICAL RULES:
1. Maintain all factual information from the source
2. Adapt tone and style to match the target media's guidelines
3. Write in the target language
4. Create SEO-optimized content for Google and AI chatbots
5. NEVER use em dashes (—) - use commas, periods, semicolons
6. Write in a natural, human-like style
7. Format content as clean HTML with proper tags (<h1>, <h2>, <p>, <strong>, <em>, etc.)

CATEGORIES: You MUST choose ONE category from this list: ${validCategories}

X POST: Maximum ${xPostMaxLength} characters, natural conversational style, no hashtags, no emojis.`

  const prompt = `Transform the following news article for publication on "${site.name}".

TARGET MEDIA:
- Name: ${site.name}
- Language: ${site.language || 'en'}
- Country: ${site.country || 'N/A'}
${site.guideline_stylistic ? `- Stylistic Guidelines: ${site.guideline_stylistic}` : ''}
${site.guideline_political ? `- Political Stance: ${site.guideline_political}` : ''}
${site.ideology ? `- Ideology: ${site.ideology}` : ''}
${authorName ? `- Author: ${authorName}` : ''}
${authorStyle ? `- Author Style: ${authorStyle}` : ''}

SOURCE ARTICLE:
Title: ${newsArticle.title}
Source: ${newsArticle.source.title}
Date: ${newsArticle.date}

Content:
${newsArticle.body}

TASK:
1. Transform this article for ${site.name}
2. Adapt the tone and perspective to match the media's guidelines
3. Write in ${site.language || 'en'} language
4. ${authorStyle ? `Adopt ${authorName}'s writing style` : 'Write in a professional journalistic style'}
5. Create compelling SEO-optimized metadata
6. Choose the most appropriate category from the list above

Return ONLY valid JSON with this structure:
{
  "title": "Compelling SEO-optimized title (50-60 chars)",
  "content": "Full article as clean HTML",
  "excerpt": "Engaging summary (150-200 chars)",
  "metaDescription": "SEO meta description (under 160 chars)",
  "tags": ["tag1", "tag2", "tag3", "tag4", "tag5"],
  "category": "One of: ${validCategories}",
  "xPost": "Natural X post text (max ${xPostMaxLength} chars, no hashtags, no emojis)",
  "featuredImageCaption": "Photo caption with source credit (30-80 chars, e.g. 'Photo: Reuters' or 'Image: AFP', in target language)"
}

CRITICAL: Return ONLY valid JSON, no markdown code blocks, no additional text.`

  try {
    const { text, usage } = await generateText({
      model: model,
      system: systemPrompt,
      prompt: prompt,
      temperature: 0.7,
      maxTokens: 6000,
    })

    const result = parseAIResponse(text)

    // Validate required fields
    if (!result.title || !result.content) {
      throw new Error("Missing required fields in AI response")
    }

    return {
      success: true,
      data: {
        title: result.title,
        content: result.content,
        excerpt: result.excerpt || "",
        metaDescription: result.metaDescription || "",
        tags: Array.isArray(result.tags) ? result.tags : [],
        category: result.category || "Politics",
        xPost: result.xPost || "",
        featuredImageCaption: result.featuredImageCaption || undefined,
      },
      usage: {
        promptTokens: usage?.promptTokens || 0,
        completionTokens: usage?.completionTokens || 0,
        totalTokens: usage?.totalTokens || 0,
      },
    }
  } catch (error) {
    console.error("[Autonomous Processor] AI generation error:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate article"
    }
  }
}

// ============================================================================
// Database Operations
// ============================================================================

/**
 * Update autonomous_publications status
 */
async function updatePublicationStatus(
  publicationId: number,
  status: string,
  generatedArticleId?: number,
  errorMessage?: string,
  sourceArticleData?: ArticleInfo
): Promise<void> {
  try {
    await sql`
      UPDATE autonomous_publications
      SET 
        status = ${status},
        generated_article_id = ${generatedArticleId || null},
        error_message = ${errorMessage || null},
        source_article_data = ${sourceArticleData ? JSON.stringify(sourceArticleData) : null},
        executed_at = ${status === "published" || status === "failed" ? new Date().toISOString() : null},
        updated_at = NOW()
      WHERE id = ${publicationId}
    `
  } catch (error) {
    console.error("[Autonomous Processor] Failed to update publication status:", error)
    throw error
  }
}

