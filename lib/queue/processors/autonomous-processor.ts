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

export type ProcessorResult = {
  success: boolean
  articleId?: number
  error?: string
}

export async function processAutonomousPublication(
  job: AutonomousPublicationJob
): Promise<ProcessorResult> {
  const { publicationId, siteId, scheduledFor } = job

  try {
    await updatePublicationStatus(publicationId, "processing")

    const site = await getSiteById(siteId)
    if (!site) {
      throw new Error(`Site ${siteId} not found`)
    }

    const fetchResult = await fetchBestArticleForSite({
      siteId,
      country: site.country_iso2,
      language: site.language || 'en'
    })

    if (!fetchResult.success || !fetchResult.article) {
      throw new Error(fetchResult.error || "Failed to fetch article from NewsAPI")
    }

    const newsArticle = fetchResult.article

    let authorId: number | null = null
    const authors = await getAuthorsBySiteId(siteId)
    if (authors.length > 0) {
      authorId = authors[0].id
    }

    const hostname = site.custom_domain || `site-${site.id}.example.com`
    const tempSlug = (await import("@/lib/data/publisher")).generateSlug(newsArticle.title)
    const estimatedUrl = `https://${hostname}/article/${tempSlug}-999`
    const xPostMaxLength = 280 - estimatedUrl.length - 1

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

    const validCategories = ARTICLE_CATEGORIES.map(c => c.value)
    const finalCategory = validCategories.includes(category) ? category : "Politics"

    const slug = await generateUniqueSlug(title, siteId)
    const publicUrl = `https://${hostname}/article/${slug}`

    let completeXPost = publicUrl
    if (xPost) {
      const { prepareXPostText } = await import("@/lib/utils/text")
      completeXPost = prepareXPostText(xPost, publicUrl, xPostMaxLength)
    }

    let uploadedImageUrl = newsArticle.image || undefined
    
    if (newsArticle.image) {
      try {
        const { downloadAndUploadToBlob } = await import("@/lib/utils/image-upload")
        
        uploadedImageUrl = await downloadAndUploadToBlob(
          newsArticle.image,
          `autonomous-${siteId}-${Date.now()}.jpg`
        )
      } catch (error) {
        uploadedImageUrl = newsArticle.image
      }
    }

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
      source_type: "autonomous",
      featured_image_url: uploadedImageUrl,
      featured_image_alt: title,
      featured_image_caption: featuredImageCaption || `Photo: ${newsArticle.source.title}`,
    })

    await updatePublicationStatus(
      publicationId,
      "published",
      article.id,
      undefined,
      newsArticle
    )

    return {
      success: true,
      articleId: article.id
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    await updatePublicationStatus(publicationId, "failed", undefined, errorMessage)

    return {
      success: false,
      error: errorMessage
    }
  }
}

async function generateAutonomousArticle(
  newsArticle: ArticleInfo,
  site: any,
  authorId: number | null,
  xPostMaxLength: number
) {
  const model = getAIModel("campaign")

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
      void error
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
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to generate article"
    }
  }
}

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
    throw error
  }
}
