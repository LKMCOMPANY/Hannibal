/**
 * Sitemap Index
 *
 * For sites with 100+ media outlets, we create a sitemap index
 * that points to individual sitemaps for better organization and performance.
 *
 * Updated to support pagination (max 50K URLs per sitemap per Google guidelines).
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

  // Count total articles to determine number of paginated sitemaps
  const countResult = await sql`
    SELECT COUNT(*) as count
    FROM articles
    WHERE site_id = ${Number(siteId)}
    AND status = 'published'
  `
  const totalArticles = Number(countResult[0]?.count || 0)
  const pagesNeeded = Math.ceil(totalArticles / 1000)

  // Generate paginated sitemap entries
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
