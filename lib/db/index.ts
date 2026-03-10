import { neon } from "@neondatabase/serverless"
import type { Site } from "@/lib/types/sites"

export const sql = neon(process.env.DATABASE_URL!)
export type { Site }
