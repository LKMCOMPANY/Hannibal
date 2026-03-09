/**
 * QStash Client Configuration
 *
 * Upstash QStash integration for background job processing
 * Handles campaign publication scheduling and parallel processing
 */

import { Client } from "@upstash/qstash"

/**
 * QStash client instance
 * Uses environment variables for authentication
 */
export const qstash = new Client({
  token: process.env.QSTASH_TOKEN!,
})


/**
 * QStash configuration
 */
export const QSTASH_CONFIG = {
  // Base URL for API routes (ensure no trailing slash)
  // Priority: NEXT_PUBLIC_APP_URL > RENDER_EXTERNAL_URL > localhost
  baseUrl: (() => {
    let url = process.env.NEXT_PUBLIC_APP_URL ||
      (process.env.RENDER_EXTERNAL_URL ? `https://${process.env.RENDER_EXTERNAL_URL}` : null) ||
      "http://localhost:3000"
    
    // Ensure URL has protocol
    if (!url.startsWith('http://') && !url.startsWith('https://')) {
      url = `https://${url}`
    }
    
    // Remove trailing slash
    return url.replace(/\/$/, "")
  })(),

  // Queue names
  queues: {
    campaignPublication: "campaign-publication",
  },

  // Retry configuration
  retries: 3,
  retryBackoff: "exponential" as const,

  // Timeout (30 seconds)
  timeout: 30,
} as const

/**
 * Campaign publication job payload
 */
export type CampaignPublicationJob = {
  campaignId: number
  publicationId: number
  sourceArticleId: number
  targetSiteId: number
  targetAuthorId?: number
  customInstructions?: string
  scheduledFor?: string
}

/**
 * Autonomous publication job payload
 * Imported from types but re-exported here for consistency
 */
export type { AutonomousPublicationJob } from "@/lib/types/autonomous"

/**
 * X publication job payload
 * Imported from types but re-exported here for consistency
 */
export type { XPublicationJob } from "@/lib/types/x-publications"

/**
 * Enqueue a campaign publication job
 *
 * @param job - Campaign publication job data
 * @param delaySeconds - Optional delay before processing (for staggered publishing)
 * @returns Message ID from QStash
 */
export async function enqueueCampaignPublication(job: CampaignPublicationJob, delaySeconds?: number): Promise<string> {
  try {
    const url = `${QSTASH_CONFIG.baseUrl}/api/queue/campaign-publication`

    const publishOptions: any = {
      url,
      body: job,
      retries: QSTASH_CONFIG.retries,
    }

    if (delaySeconds && delaySeconds > 0) {
      publishOptions.delay = delaySeconds
    }

    const result = await qstash.publishJSON(publishOptions)

    return result.messageId
  } catch (error) {
    throw new Error(`Failed to enqueue job: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

/**
 * Enqueue multiple campaign publications with staggered delays
 *
 * @param jobs - Array of campaign publication jobs
 * @param deploymentSpeedMinutes - Minutes between each publication
 * @returns Array of message IDs
 */
export async function enqueueCampaignPublications(
  jobs: CampaignPublicationJob[],
  deploymentSpeedMinutes: number,
): Promise<string[]> {
  const messageIds: string[] = []
  const delaySeconds = deploymentSpeedMinutes * 60

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i]
    const delay = i * delaySeconds // Stagger each job

    try {
      const messageId = await enqueueCampaignPublication(job, delay)
      messageIds.push(messageId)
    } catch (error) {
      // Continue with other jobs even if one fails
    }
  }

  return messageIds
}

/**
 * Verify QStash signature for webhook security
 *
 * @param signature - QStash signature from request header
 * @param signingKey - Current signing key from request header
 * @param body - Request body
 * @returns True if signature is valid
 */
export async function verifyQStashSignature(signature: string, signingKey: string, body: string): Promise<boolean> {
  try {
    const { Receiver } = await import("@upstash/qstash")

    const receiver = new Receiver({
      currentSigningKey: process.env.QSTASH_CURRENT_SIGNING_KEY!,
      nextSigningKey: process.env.QSTASH_NEXT_SIGNING_KEY!,
    })

    await receiver.verify({
      signature,
      body,
    })

    return true
  } catch (error) {
    void error
    return false
  }
}

/**
 * Get QStash message details
 *
 * @param messageId - QStash message ID
 * @returns Message details
 */
export async function getQStashMessage(messageId: string) {
  try {
    return null
  } catch (error) {
    return null
  }
}

// ============================================================================
// Autonomous Publication Queue Functions
// ============================================================================

/**
 * Enqueue an autonomous publication job
 *
 * @param job - Autonomous publication job data
 * @param delaySeconds - Optional delay before processing
 * @returns Message ID from QStash
 */
export async function enqueueAutonomousPublication(
  job: { publicationId: number; siteId: number; scheduledFor: string },
  delaySeconds?: number
): Promise<string> {
  try {
    const url = `${QSTASH_CONFIG.baseUrl}/api/queue/autonomous-publication`

    const publishOptions: any = {
      url,
      body: job,
      retries: QSTASH_CONFIG.retries,
    }

    if (delaySeconds && delaySeconds > 0) {
      publishOptions.delay = delaySeconds
    }

    const result = await qstash.publishJSON(publishOptions)

    return result.messageId
  } catch (error) {
    throw new Error(`Failed to enqueue job: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}

// ============================================================================
// X Publication Queue Functions
// ============================================================================

/**
 * Enqueue an X publication job
 *
 * @param job - X publication job data
 * @param delaySeconds - Delay before processing (default: 600 = 10 minutes)
 * @returns Message ID from QStash
 */
export async function enqueueXPublication(
  job: { publicationId: number; articleId: number; siteId: number; xPostText: string; scheduledFor: string },
  delaySeconds = 600 // Default 10 minutes
): Promise<string> {
  try {
    const url = `${QSTASH_CONFIG.baseUrl}/api/queue/x-publication`

    const publishOptions: any = {
      url,
      body: job,
      retries: QSTASH_CONFIG.retries,
    }

    if (delaySeconds > 0) {
      publishOptions.delay = delaySeconds
    }

    const result = await qstash.publishJSON(publishOptions)

    return result.messageId
  } catch (error) {
    throw new Error(`Failed to enqueue job: ${error instanceof Error ? error.message : "Unknown error"}`)
  }
}
