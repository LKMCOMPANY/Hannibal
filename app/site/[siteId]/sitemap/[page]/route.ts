/**
 * Paginated Sitemap Handler
 *
 * Google recommends max 50,000 URLs per sitemap.
 * This handles pagination for sites with >1000 articles.
 *
 * Format: /sitemap/1.xml, /sitemap/2.xml, etc.
 */

import type { MetadataRoute } from "next"
import { NextResponse } from "next/server"
import { sql } from "@/lib/db"
import { getSitePublicData } from "@/lib/site-resolver"

type Props = {
  params: Promise<{ siteId: string; page: string }>
}

const ARTICLES_PER_SITEMAP = 1000

export async function GET(request: Request, { params }: Props) {
  const { siteId, page } = await params
  const pageNum = parseInt(page, 10)

  if (isNaN(pageNum) || pageNum < 1) {
    return new NextResponse("Invalid page number", { status: 400 })
  }

  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return new NextResponse("Site not found", { status: 404 })
  }

  const baseUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  const offset = (pageNum - 1) * ARTICLES_PER_SITEMAP

  // Get paginated articles
  const articles = await sql`
    SELECT 
      a.slug, a.published_at, a.updated_at
    FROM articles a
    WHERE a.site_id = ${Number(siteId)}
    AND a.status = 'published'
    AND a.published_at IS NOT NULL
    AND a.published_at <= NOW()
    ORDER BY a.published_at DESC
    LIMIT ${ARTICLES_PER_SITEMAP} OFFSET ${offset}
  `

  if (articles.length === 0) {
    return new NextResponse("No articles found for this page", { status: 404 })
  }

  const urls: MetadataRoute.Sitemap = articles.map((article: any) => ({
    url: `${baseUrl}/article/${article.slug}`,
    lastModified: article.updated_at || article.published_at || new Date(),
    changeFrequency: "weekly" as const,
    priority: 0.9,
  }))

  // Convert to XML manually for better control
  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.url}</loc>
    <lastmod>${new Date(url.lastModified).toISOString()}</lastmod>
    <changefreq>${url.changeFrequency}</changefreq>
    <priority>${url.priority}</priority>
  </url>`,
  )
  .join("\n")}
</urlset>`

  return new NextResponse(sitemapXml, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

