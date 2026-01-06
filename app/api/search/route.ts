import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const siteId = searchParams.get("siteId")
    const query = searchParams.get("q")

    if (!siteId || !query) {
      return NextResponse.json({ results: [] })
    }

    const results = await sql`
      SELECT 
        id,
        title,
        excerpt,
        slug,
        category,
        featured_image_url,
        published_at
      FROM articles
      WHERE 
        site_id = ${Number(siteId)}
        AND status = 'published'
        AND (
          title ILIKE ${"%" + query + "%"}
          OR excerpt ILIKE ${"%" + query + "%"}
          OR content ILIKE ${"%" + query + "%"}
        )
      ORDER BY published_at DESC
      LIMIT 10
    `

    return NextResponse.json({ results })
  } catch (error) {
    console.error("Search error:", error)
    return NextResponse.json({ results: [] }, { status: 500 })
  }
}
