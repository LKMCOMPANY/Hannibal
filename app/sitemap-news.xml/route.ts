/**
 * Universal News Sitemap Handler
 *
 * Routes to correct site based on domain (like robots.txt).
 */

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"
import { ADMIN_HOSTNAMES } from "@/lib/constants/hostnames"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  const hostname = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  const cleanDomain = hostname.split(":")[0]

  const isAdminDomain = ADMIN_HOSTNAMES.some((h) => hostname.includes(h))

  if (isAdminDomain) {
    return new NextResponse("Not found", { status: 404 })
  }

  // Get site from domain
  const result = await sql`
    SELECT id, custom_domain, name, language
    FROM sites 
    WHERE custom_domain = ${cleanDomain}
    AND status = 'active'
    LIMIT 1
  `

  const site = result[0] as { id: number; custom_domain: string; name: string; language: string } | undefined

  if (!site) {
    return new NextResponse("Site not found", { status: 404 })
  }

  const baseUrl = `https://${site.custom_domain}`

  // Get articles from last 2 days (Google News requirement)
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const articles = await sql`
    SELECT 
      a.title, a.slug, a.published_at, a.category,
      CONCAT(au.first_name, ' ', au.last_name) as author_name
    FROM articles a
    LEFT JOIN authors au ON a.author_id = au.id
    WHERE a.site_id = ${site.id}
    AND a.status = 'published'
    AND a.published_at >= ${twoDaysAgo.toISOString()}
    AND a.published_at <= NOW()
    ORDER BY a.published_at DESC
    LIMIT 100
  `

  const newsItems = articles
    .map((article: any) => {
      const pubDate = new Date(article.published_at)
      return `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <news:news>
      <news:publication>
        <news:name>${escapeXml(site.name)}</news:name>
        <news:language>${site.language || "en"}</news:language>
      </news:publication>
      <news:publication_date>${pubDate.toISOString()}</news:publication_date>
      <news:title>${escapeXml(article.title)}</news:title>
      ${article.category ? `<news:keywords>${escapeXml(article.category)}</news:keywords>` : ""}
    </news:news>
  </url>`
    })
    .join("\n")

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:news="http://www.google.com/schemas/sitemap-news/0.9">
${newsItems}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=900, s-maxage=900",
    },
  })
}

function escapeXml(unsafe: string): string {
  if (!unsafe) return ""
  return unsafe.replace(/[<>&'"]/g, (c) => {
    switch (c) {
      case "<":
        return "&lt;"
      case ">":
        return "&gt;"
      case "&":
        return "&amp;"
      case "'":
        return "&apos;"
      case '"':
        return "&quot;"
      default:
        return c
    }
  })
}

