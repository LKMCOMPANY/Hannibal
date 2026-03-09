/**
 * Universal RSS Feed Handler
 * Routes to correct site based on domain
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

  const result = await sql`
    SELECT id, custom_domain, name, description, language
    FROM sites 
    WHERE custom_domain = ${cleanDomain}
    AND status = 'active'
    LIMIT 1
  `

  const site = result[0] as
    | { id: number; custom_domain: string; name: string; description: string; language: string }
    | undefined

  if (!site) {
    return new NextResponse("Site not found", { status: 404 })
  }

  const baseUrl = `https://${site.custom_domain}`

  const articles = await sql`
    SELECT 
      a.title, a.slug, a.excerpt, a.published_at, a.category,
      a.featured_image_url,
      CONCAT(au.first_name, ' ', au.last_name) as author_name
    FROM articles a
    LEFT JOIN authors au ON a.author_id = au.id
    WHERE a.site_id = ${site.id}
    AND a.status = 'published'
    AND a.published_at IS NOT NULL
    AND a.published_at <= NOW()
    ORDER BY a.published_at DESC
    LIMIT 50
  `

  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/" xmlns:dc="http://purl.org/dc/elements/1.1/">
  <channel>
    <title>${escapeXml(site.name)}</title>
    <link>${baseUrl}</link>
    <description>${escapeXml(site.description || "")}</description>
    <language>${site.language || "en"}</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <atom:link href="${baseUrl}/rss.xml" rel="self" type="application/rss+xml"/>
    <generator>Hannibal Media Platform</generator>
    <copyright>© ${new Date().getFullYear()} ${escapeXml(site.name)}</copyright>
    <ttl>60</ttl>
    ${articles
      .map(
        (article: any) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${baseUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>
      <description>${escapeXml(article.excerpt || "")}</description>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ""}
      ${article.author_name ? `<dc:creator>${escapeXml(article.author_name)}</dc:creator>` : ""}
      <pubDate>${article.published_at ? new Date(article.published_at).toUTCString() : new Date().toUTCString()}</pubDate>
      ${article.featured_image_url ? `<enclosure url="${article.featured_image_url}" type="image/jpeg" />` : ""}
    </item>
    `,
      )
      .join("")}
  </channel>
</rss>`

  return new NextResponse(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
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

