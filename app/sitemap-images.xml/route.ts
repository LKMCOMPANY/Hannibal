/**
 * Universal Image Sitemap Handler
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
    SELECT id, custom_domain
    FROM sites 
    WHERE custom_domain = ${cleanDomain}
    AND status = 'active'
    LIMIT 1
  `

  const site = result[0] as { id: number; custom_domain: string } | undefined

  if (!site) {
    return new NextResponse("Site not found", { status: 404 })
  }

  const baseUrl = `https://${site.custom_domain}`

  const articles = await sql`
    SELECT slug, title, featured_image_url, featured_image_alt
    FROM articles
    WHERE site_id = ${site.id}
    AND status = 'published'
    AND featured_image_url IS NOT NULL
    ORDER BY published_at DESC
    LIMIT 1000
  `

  const imageUrls = articles
    .map(
      (article: any) => `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <image:image>
      <image:loc>${article.featured_image_url}</image:loc>
      <image:title>${escapeXml(article.featured_image_alt || article.title)}</image:title>
    </image:image>
  </url>`,
    )
    .join("\n")

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">
${imageUrls}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
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

