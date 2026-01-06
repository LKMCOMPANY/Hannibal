"use server"

import { revalidatePath } from "next/cache"
import { deleteArticle as deleteArticleFromDb, searchArticlesAutocomplete } from "@/lib/data/articles"

/**
 * Server Actions for Articles
 *
 * These actions handle article mutations with proper revalidation
 */

export async function deleteArticle(articleId: number) {
  try {
    const success = await deleteArticleFromDb(articleId)

    if (!success) {
      return { success: false, error: "Article not found" }
    }

    revalidatePath("/dashboard/articles")
    return { success: true }
  } catch (error) {
    console.error("Error deleting article:", error)
    return { success: false, error: "Failed to delete article" }
  }
}

export async function searchArticlesAction(searchTerm: string) {
  try {
    const results = await searchArticlesAutocomplete(searchTerm, 10)
    return { success: true, results }
  } catch (error) {
    console.error("Error searching articles:", error)
    return { success: false, results: [] }
  }
}
