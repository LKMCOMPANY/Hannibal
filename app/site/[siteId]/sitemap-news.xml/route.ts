/**
 * Google News Sitemap
 *
 * Specialized sitemap for Google News indexing.
 * Only includes articles from the last 2 days (Google News requirement).
 *
 * Format: https://support.google.com/news/publisher-center/answer/9606710
 */

import { NextResponse } from "next/server"
import { getSitePublicData } from "@/lib/site-resolver"
import { sql } from "@/lib/db"

type Props = {
  params: Promise<{ siteId: string }>
}

export async function GET(request: Request, { params }: Props) {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return new NextResponse("Site not found", { status: 404 })
  }

  const baseUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  // Get articles from last 2 days only (Google News requirement)
  const twoDaysAgo = new Date()
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2)

  const articles = await sql`
    SELECT 
      a.title, a.slug, a.published_at, a.category,
      CONCAT(au.first_name, ' ', au.last_name) as author_name
    FROM articles a
    LEFT JOIN authors au ON a.author_id = au.id
    WHERE a.site_id = ${Number(siteId)}
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
      "Cache-Control": "public, max-age=900, s-maxage=900", // 15 min cache (news changes frequently)
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

