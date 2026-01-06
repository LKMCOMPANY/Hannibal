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

export async function updateAuthorField(id: number, siteId: number, field: string, value: any): Promise<ActionResult> {
  try {
    const updateData: UpdateAuthorData = { [field]: value }
    await updateAuthor(id, updateData)
    revalidatePath(`/dashboard/medias/${siteId}`)
    return { success: true }
  } catch (error) {
    console.error("Error updating author field:", error)
    return { success: false, error: "Failed to update author" }
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
