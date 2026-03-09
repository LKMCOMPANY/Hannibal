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

export async function processXPublication(job: XPublicationJob): Promise<ProcessorResult> {
  const { publicationId, articleId, siteId, xPostText } = job

  try {
    const currentStatus = await sql`
      SELECT status FROM x_publications WHERE id = ${publicationId} LIMIT 1
    `

    if (!currentStatus[0]) {
      throw new Error(`X publication ${publicationId} not found`)
    }

    if (currentStatus[0].status !== 'pending') {
      return {
        success: false,
        error: `Publication ${currentStatus[0].status}, not posting`
      }
    }

    const site = await getSiteById(siteId)
    if (!site) {
      throw new Error(`Site ${siteId} not found`)
    }

    const article = await getArticleById(articleId)
    if (!article) {
      throw new Error(`Article ${articleId} not found`)
    }

    const twitterClient = createTwitterClient(site)
    const tweet = await twitterClient.postTweet(xPostText)
    const tweetUrl = generateTwitterPostUrl(site.twitter_handle!, tweet.id)

    await updateXPublicationStatus(
      publicationId,
      'posted',
      tweet.id,
      tweetUrl
    )

    return {
      success: true,
      tweetId: tweet.id,
      tweetUrl: tweetUrl
    }

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : "Unknown error"
    await updateXPublicationStatus(publicationId, 'failed', undefined, undefined, errorMessage)

    return {
      success: false,
      error: errorMessage
    }
  }
}
