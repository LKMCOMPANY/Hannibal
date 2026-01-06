"use server"

import { revalidatePath } from "next/cache"
import { updateAutonomousSchedule, updateSiteTimezone } from "@/lib/data/autonomous"

/**
 * Server Actions for Autonomous Publication
 *
 * Handles autonomous schedule mutations with proper revalidation
 */

type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

/**
 * Update autonomous schedule for a site
 */
export async function updateAutonomousScheduleAction(
  siteId: number,
  hours: number[],
  isActive: boolean,
): Promise<ActionResult> {
  try {
    // Validate input
    if (!siteId || siteId <= 0) {
      return {
        success: false,
        error: "Invalid site ID",
      }
    }

    if (!Array.isArray(hours)) {
      return {
        success: false,
        error: "Invalid hours format",
      }
    }

    // Validate hours are in valid range (0-23)
    if (hours.some((h) => h < 0 || h > 23)) {
      return {
        success: false,
        error: "Hours must be between 0 and 23",
      }
    }

    // Update schedule
    await updateAutonomousSchedule(siteId, hours, isActive)

    // Revalidate autonomous media page
    revalidatePath("/dashboard/autonomous-media")
    revalidatePath(`/dashboard/medias/${siteId}`)

    return { success: true }
  } catch (error) {
    console.error("Error in updateAutonomousScheduleAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update autonomous schedule",
    }
  }
}

/**
 * Update site timezone
 */
export async function updateSiteTimezoneAction(siteId: number, timezone: string): Promise<ActionResult> {
  try {
    // Validate input
    if (!siteId || siteId <= 0) {
      return {
        success: false,
        error: "Invalid site ID",
      }
    }

    if (!timezone || timezone.trim().length === 0) {
      return {
        success: false,
        error: "Timezone is required",
      }
    }

    // Update timezone
    await updateSiteTimezone(siteId, timezone)

    // Revalidate pages
    revalidatePath("/dashboard/autonomous-media")
    revalidatePath(`/dashboard/medias/${siteId}`)

    return { success: true }
  } catch (error) {
    console.error("Error in updateSiteTimezoneAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update site timezone",
    }
  }
}

/**
 * Toggle autonomous mode for a site
 */
export async function toggleAutonomousModeAction(siteId: number, isActive: boolean): Promise<ActionResult> {
  try {
    if (!siteId || siteId <= 0) {
      return {
        success: false,
        error: "Invalid site ID",
      }
    }

    // Get current schedule and update only the active status
    const { getAutonomousSchedule } = await import("@/lib/data/autonomous")
    const schedule = await getAutonomousSchedule(siteId)

    if (!schedule) {
      return {
        success: false,
        error: "Site not found",
      }
    }

    await updateAutonomousSchedule(siteId, schedule.hours, isActive)

    revalidatePath("/dashboard/autonomous-media")
    revalidatePath(`/dashboard/medias/${siteId}`)

    return { success: true }
  } catch (error) {
    console.error("Error in toggleAutonomousModeAction:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to toggle autonomous mode",
    }
  }
}
