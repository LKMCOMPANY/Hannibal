/**
 * Universal Sitemap Index Handler
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
    SELECT id, custom_domain, name
    FROM sites 
    WHERE custom_domain = ${cleanDomain}
    AND status = 'active'
    LIMIT 1
  `

  const site = result[0] as { id: number; custom_domain: string; name: string } | undefined

  if (!site) {
    return new NextResponse("Site not found", { status: 404 })
  }

  const baseUrl = `https://${site.custom_domain}`

  // Count articles for pagination
  const countResult = await sql`
    SELECT COUNT(*) as count
    FROM articles
    WHERE site_id = ${site.id}
    AND status = 'published'
  `
  const totalArticles = Number(countResult[0]?.count || 0)
  const pagesNeeded = Math.ceil(totalArticles / 1000)

  const paginatedSitemaps = Array.from({ length: pagesNeeded }, (_, i) => {
    const pageNum = i + 1
    return `  <sitemap>
    <loc>${baseUrl}/sitemap/${pageNum}.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>`
  }).join("\n")

  const sitemapIndex = `<?xml version="1.0" encoding="UTF-8"?>
<sitemapindex xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <sitemap>
    <loc>${baseUrl}/sitemap.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
${paginatedSitemaps}
  <sitemap>
    <loc>${baseUrl}/sitemap-images.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
  <sitemap>
    <loc>${baseUrl}/sitemap-news.xml</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
  </sitemap>
</sitemapindex>`

  return new NextResponse(sitemapIndex, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

