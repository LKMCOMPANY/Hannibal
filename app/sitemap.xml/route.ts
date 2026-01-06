/**
 * Universal Main Sitemap Handler
 * Routes to correct site based on domain
 */

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
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

  // Get all articles (limited to first 1000 for main sitemap)
  const articles = await sql`
    SELECT slug, published_at, updated_at
    FROM articles
    WHERE site_id = ${site.id}
    AND status = 'published'
    AND published_at IS NOT NULL
    AND published_at <= NOW()
    ORDER BY published_at DESC
    LIMIT 1000
  `

  // Get unique categories
  const categories = await sql`
    SELECT DISTINCT category
    FROM articles
    WHERE site_id = ${site.id}
    AND status = 'published'
    AND category IS NOT NULL
  `

  const articleUrls = articles.map(
    (article: any) => `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <lastmod>${new Date(article.updated_at || article.published_at).toISOString()}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.9</priority>
  </url>`,
  )

  const categoryUrls = categories.map(
    (cat: any) => `  <url>
    <loc>${baseUrl}/category/${encodeURIComponent(cat.category)}</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.7</priority>
  </url>`,
  )

  const staticPages = `  <url>
    <loc>${baseUrl}/</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>${baseUrl}/about</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>${baseUrl}/privacy</loc>
    <lastmod>${new Date().toISOString()}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>`

  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${staticPages}
${categoryUrls.join("\n")}
${articleUrls.join("\n")}
</urlset>`

  return new NextResponse(sitemap, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, max-age=3600, s-maxage=3600",
    },
  })
}

