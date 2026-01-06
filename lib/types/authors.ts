export type Author = {
  id: number
  site_id: number
  first_name: string
  last_name: string
  email: string
  twitter_link: string | null
  bio: string | null
  style: string | null
  created_at: string
  updated_at: string
}

export type CreateAuthorData = {
  site_id: number
  first_name: string
  last_name: string
  email: string
  twitter_link?: string
  bio?: string
  style?: string
}

export type UpdateAuthorData = Partial<Omit<Author, "id" | "site_id" | "created_at" | "updated_at">>
