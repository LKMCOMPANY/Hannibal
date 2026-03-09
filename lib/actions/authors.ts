"use server"

import { revalidatePath } from "next/cache"
import {
  createAuthor,
  updateAuthor,
  deleteAuthor,
  getAuthorsBySiteId,
  type CreateAuthorData,
  type UpdateAuthorData,
} from "@/lib/data/authors"
import type { Author } from "@/lib/types/authors"

type ActionResult<T = void> = {
  success: boolean
  data?: T
  error?: string
}

export async function createAuthorAction(data: CreateAuthorData): Promise<ActionResult<{ id: number }>> {
  try {
    const author = await createAuthor(data)
    revalidatePath(`/dashboard/medias/${data.site_id}`)
    return { success: true, data: { id: author.id } }
  } catch (error) {
    console.error("Error creating author:", error)
    return { success: false, error: "Failed to create author" }
  }
}

/**
 * Auto-save: persists fields WITHOUT revalidating the page.
 */
export async function autoSaveAuthorFields(
  id: number,
  data: UpdateAuthorData,
): Promise<ActionResult> {
  try {
    await updateAuthor(id, data)
    return { success: true }
  } catch (error) {
    console.error("Error auto-saving author fields:", error)
    return { success: false, error: "Failed to save" }
  }
}

export async function deleteAuthorAction(id: number, siteId: number): Promise<ActionResult> {
  try {
    await deleteAuthor(id)
    revalidatePath(`/dashboard/medias/${siteId}`)
    return { success: true }
  } catch (error) {
    console.error("Error deleting author:", error)
    return { success: false, error: "Failed to delete author" }
  }
}

export async function getAuthorsBySiteIdAction(siteId: number): Promise<ActionResult<Author[]>> {
  try {
    const authors = await getAuthorsBySiteId(siteId)
    return { success: true, data: authors }
  } catch (error) {
    console.error("Error fetching authors:", error)
    return { success: false, error: "Failed to fetch authors", data: [] }
  }
}
