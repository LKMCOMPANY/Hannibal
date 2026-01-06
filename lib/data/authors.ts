import { cache } from "react"
import { sql } from "@/lib/db"
import type { Author, CreateAuthorData, UpdateAuthorData } from "@/lib/types/authors"

export type { Author, CreateAuthorData, UpdateAuthorData }

// Get all authors for a specific site
export const getAuthorsBySiteId = cache(async (siteId: number): Promise<Author[]> => {
  const result = await sql`
    SELECT * FROM authors 
    WHERE site_id = ${siteId}
    ORDER BY created_at DESC
  `
  return result as Author[]
})

// Get a single author by ID
export const getAuthorById = cache(async (id: number): Promise<Author | null> => {
  const result = await sql`
    SELECT * FROM authors 
    WHERE id = ${id}
    LIMIT 1
  `
  return result[0] || null
})

// Create a new author
export async function createAuthor(data: CreateAuthorData): Promise<Author> {
  const result = await sql`
    INSERT INTO authors (
      site_id, 
      first_name, 
      last_name, 
      email, 
      twitter_link, 
      bio, 
      style
    )
    VALUES (
      ${data.site_id},
      ${data.first_name},
      ${data.last_name},
      ${data.email},
      ${data.twitter_link || null},
      ${data.bio || null},
      ${data.style || null}
    )
    RETURNING *
  `
  return result[0] as Author
}

// Update an author
export async function updateAuthor(id: number, data: UpdateAuthorData): Promise<Author> {
  const updates: string[] = []
  const values: any[] = []
  let paramIndex = 1

  if (data.first_name !== undefined) {
    updates.push(`first_name = $${paramIndex++}`)
    values.push(data.first_name)
  }
  if (data.last_name !== undefined) {
    updates.push(`last_name = $${paramIndex++}`)
    values.push(data.last_name)
  }
  if (data.email !== undefined) {
    updates.push(`email = $${paramIndex++}`)
    values.push(data.email)
  }
  if (data.twitter_link !== undefined) {
    updates.push(`twitter_link = $${paramIndex++}`)
    values.push(data.twitter_link || null)
  }
  if (data.bio !== undefined) {
    updates.push(`bio = $${paramIndex++}`)
    values.push(data.bio || null)
  }
  if (data.style !== undefined) {
    updates.push(`style = $${paramIndex++}`)
    values.push(data.style || null)
  }

  updates.push(`updated_at = NOW()`)
  values.push(id)

  const query = `
    UPDATE authors 
    SET ${updates.join(", ")}
    WHERE id = $${paramIndex}
    RETURNING *
  `

  const result = await sql.query(query, values)
  return result[0] as Author
}

// Delete an author
export async function deleteAuthor(id: number): Promise<void> {
  await sql`
    DELETE FROM authors 
    WHERE id = ${id}
  `
}

// Count authors for a site
export const getAuthorsCountBySiteId = cache(async (siteId: number): Promise<number> => {
  const result = await sql`
    SELECT COUNT(*) as count 
    FROM authors 
    WHERE site_id = ${siteId}
  `
  return Number(result[0].count)
})
