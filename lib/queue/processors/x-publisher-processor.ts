/**
 * X Publisher Processor
 * 
 * Processes X/Twitter publications after 10-minute delay
 * 
 * Workflow:
 * 1. Fetch article and site Twitter credentials
 * 2. Post tweet using Twitter API v2 (OAuth 1.0a)
 * 3. Update x_publication with result (posted/failed)
 * 
 * Pattern: Similar to autonomous-processor for consistency
 */

import { createTwitterClient, generateTwitterPostUrl } from "@/lib/services/twitter"
import { updateXPublicationStatus } from "@/lib/data/x-publications"
import { getArticleById } from "@/lib/data/articles"
import { getSiteById } from "@/lib/data/sites"
import { sql } from "@/lib/db"
import type { XPublicationJob } from "@/lib/types/x-publications"

export type ProcessorResult = {
  success: boolean
  tweetId?: string
  tweetUrl?: string
  error?: string
}

/**
 * Process X publication
 * 
 * Called by QStash webhook after 10-minute delay
 */
export async function processXPublication(job: XPublicationJob): Promise<ProcessorResult> {
  const { publicationId, articleId, siteId, xPostText } = job

  try {
    console.log(`[X Publisher] 🐦 Starting publication ${publicationId} for article ${articleId}`)

    // 1. CHECK STATUS (might have been paused/cancelled)
    const currentStatus = await sql`
      SELECT status FROM x_publications WHERE id = ${publicationId} LIMIT 1
    `

    if (!currentStatus[0]) {
      throw new Error(`X publication ${publicationId} not found`)
    }

    if (currentStatus[0].status !== 'pending') {
      console.log(`[X Publisher] ⚠️  Publication ${publicationId} status is ${currentStatus[0].status}, skipping`)
      return {
        success: false,
        error: `Publication ${currentStatus[0].status}, not posting`
      }
    }

    // 2. GET SITE WITH TWITTER CREDENTIALS
    const site = await getSiteById(siteId)
    if (!site) {
      throw new Error(`Site ${siteId} not found`)
    }

    console.log(`[X Publisher] Site: ${site.name} (@${site.twitter_handle})`)

    // 3. GET ARTICLE INFO
    const article = await getArticleById(articleId)
    if (!article) {
      throw new Error(`Article ${articleId} not found`)
    }

    // 4. CREATE TWITTER CLIENT
    const twitterClient = createTwitterClient(site)

    // 5. POST TWEET
    console.log(`[X Publisher] 📤 Posting tweet...`)
    console.log(`[X Publisher] Text: ${xPostText.substring(0, 100)}...`)

    const tweet = await twitterClient.postTweet(xPostText)

    // 6. GENERATE TWEET URL
    const tweetUrl = generateTwitterPostUrl(site.twitter_handle!, tweet.id)

    console.log(`[X Publisher] ✅ Tweet posted: ${tweetUrl}`)

    // 7. UPDATE STATUS: posted
    await updateXPublicationStatus(
      publicationId,
      'posted',
      tweet.id,
      tweetUrl
    )

    console.log(`[X Publisher] ✅✅✅ Publication ${publicationId} completed successfully!`)

    return {
      success: true,
      tweetId: tweet.id,
      tweetUrl: tweetUrl
    }

  } catch (error) {
    console.error(`[X Publisher] ❌ Error processing publication ${publicationId}:`, error)

    const errorMessage = error instanceof Error ? error.message : "Unknown error"

    // UPDATE STATUS: failed
    await updateXPublicationStatus(publicationId, 'failed', undefined, undefined, errorMessage)

    return {
      success: false,
      error: errorMessage
    }
  }
}

