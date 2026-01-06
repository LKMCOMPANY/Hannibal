/**
 * X Publisher Server Actions
 * 
 * Handle X publication mutations with proper revalidation
 */

"use server"

import { revalidatePath } from "next/cache"
import {
  pauseXPublication,
  resumeXPublication,
  cancelXPublication,
  updateXPublicationStatus,
  createXPublication,
} from "@/lib/data/x-publications"
import { enqueueXPublication } from "@/lib/queue/qstash"
import { processXPublication } from "@/lib/queue/processors/x-publisher-processor"

type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Pause an X publication (prevent posting)
 */
export async function pauseXPublicationAction(id: number): Promise<ActionResult> {
  try {
    await pauseXPublication(id)

    revalidatePath("/dashboard/x-publisher")

    return { success: true }
  } catch (error) {
    console.error("Error in pauseXPublicationAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to pause X publication",
    }
  }
}

/**
 * Resume a paused X publication
 */
export async function resumeXPublicationAction(id: number): Promise<ActionResult> {
  try {
    await resumeXPublication(id)

    // Re-enqueue with 10 minute delay from now
    await enqueueXPublication(
      {
        publicationId: id,
        articleId: 0, // Will be fetched in processor
        siteId: 0,
        xPostText: "", // Will be fetched
        scheduledFor: new Date().toISOString()
      },
      600 // 10 minutes
    )

    revalidatePath("/dashboard/x-publisher")

    return { success: true }
  } catch (error) {
    console.error("Error in resumeXPublicationAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to resume X publication",
    }
  }
}

/**
 * Retry a failed X publication
 */
export async function retryXPublicationAction(id: number): Promise<ActionResult> {
  try {
    // Reset status to pending
    await updateXPublicationStatus(id, 'pending')

    // Re-enqueue immediately
    await enqueueXPublication(
      {
        publicationId: id,
        articleId: 0,
        siteId: 0,
        xPostText: "",
        scheduledFor: new Date().toISOString()
      },
      0 // Immediate
    )

    revalidatePath("/dashboard/x-publisher")

    return { success: true }
  } catch (error) {
    console.error("Error in retryXPublicationAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to retry X publication",
    }
  }
}

/**
 * Cancel an X publication
 */
export async function cancelXPublicationAction(id: number): Promise<ActionResult> {
  try {
    await cancelXPublication(id)

    revalidatePath("/dashboard/x-publisher")

    return { success: true }
  } catch (error) {
    console.error("Error in cancelXPublicationAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to cancel X publication",
    }
  }
}

