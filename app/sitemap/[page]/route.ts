/**
 * Universal Paginated Sitemap Handler
 * Routes to correct site based on domain
 * Supports 1000 articles per sitemap (Google best practice)
 */

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

type Props = {
  params: Promise<{ page: string }>
}

const ARTICLES_PER_SITEMAP = 1000

export async function GET(request: Request, { params }: Props) {
  const { page } = await params
  const pageNum = parseInt(page, 10)

  if (isNaN(pageNum) || pageNum < 1) {
    return new NextResponse("Invalid page number", { status: 400 })
  }

  const hostname = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  const cleanDomain = hostname.split(":")[0]

  const ADMIN_HOSTNAMES = [
    "localhost",
    process.env.NEXT_PUBLIC_ADMIN_HOSTNAME,
    process.env.RENDER_EXTERNAL_HOSTNAME,
    "hannibalv2.onrender.com",
  ].filter(Boolean) as string[]

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
  const offset = (pageNum - 1) * ARTICLES_PER_SITEMAP

  const articles = await sql`
    SELECT slug, published_at, updated_at
    FROM articles
    WHERE site_id = ${site.id}
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= NOW()
    ORDER BY published_at DESC
    LIMIT ${ARTICLES_PER_SITEMAP} OFFSET ${offset}
  `

  if (articles.length === 0) {
    return new NextResponse("No articles found for this page", { status: 404 })
  }

  const sitemapXml = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${articles
  .map(
    (article: any) => `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at || article.published_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
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

