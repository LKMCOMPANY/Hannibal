"use server"

import { revalidatePath } from "next/cache"
import { updateSite, createSite, type SiteUpdateInput } from "@/lib/data/sites"

/**
 * Server action to update a site field
 * Used for auto-save functionality
 */
export async function updateSiteField(
  siteId: number,
  field: string,
  value: any,
): Promise<{ success: boolean; error?: string }> {
  try {
    const updateData: SiteUpdateInput = {
      [field]: value,
    }

    await updateSite(siteId, updateData)

    // Revalidate the media pages to reflect changes
    revalidatePath("/dashboard/medias")
    revalidatePath(`/dashboard/medias/${siteId}`)

    if (field === "theme_layout" || field === "theme_primary_color" || field === "theme_accent_color") {
      revalidatePath(`/site/${siteId}`, "layout")
    }

    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating site field:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update site",
    }
  }
}

/**
 * Server action to update multiple site fields at once
 */
export async function updateSiteFields(
  siteId: number,
  data: SiteUpdateInput,
): Promise<{ success: boolean; error?: string }> {
  try {
    await updateSite(siteId, data)

    // Revalidate the media pages to reflect changes
    revalidatePath("/dashboard/medias")
    revalidatePath(`/dashboard/medias/${siteId}`)

    return { success: true }
  } catch (error) {
    console.error("[v0] Error updating site fields:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to update site",
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

    // Revalidate the medias list page
    revalidatePath("/dashboard/medias")

    return { success: true, siteId: newSite.id }
  } catch (error) {
    console.error("[v0] Error creating site:", error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to create site",
    }
  }
}
