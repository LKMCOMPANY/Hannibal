"use server"

import { revalidatePath } from "next/cache"
import { updateSite, createSite, type SiteUpdateInput } from "@/lib/data/sites"

/**
 * Auto-save: persists fields WITHOUT revalidating the page.
 * revalidatePath triggers a full RSC re-render on Vercel which can
 * remount the client form, resetting debounce timers and local state.
 */
export async function autoSaveSiteFields(
  siteId: number,
  data: SiteUpdateInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateSite(siteId, data)
    return { success: true }
  } catch (error) {
    console.error("Error auto-saving site fields:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to save",
    }
  }
}

/**
 * Server action to create a new site
 * Returns the new site ID for redirection
 */
export async function createNewSite(name: string): Promise<{ success: boolean; siteId?: number; error?: string }> {
  try {
    if (!name || name.trim().length === 0) {
      return {
        success: false,
        error: "Site name is required",
      }
    }

    const newSite = await createSite({
      name: name.trim(),
      status: "draft",
    })

    revalidatePath("/dashboard/medias")

    return { success: true, siteId: newSite.id }
  } catch (error) {
    console.error("Error creating site:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create site",
    }
  }
}
