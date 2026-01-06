/**
 * Universal robots.txt Handler
 *
 * Intelligent robots.txt that adapts based on domain:
 * - Admin domain: Blocks dashboard, API routes
 * - Custom domains: Allows site content, includes AI crawlers
 *
 * Best practices for media sites + AI indexing.
 */

import { NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

// Admin hostnames that should block dashboard access
const ADMIN_HOSTNAMES = [
  "localhost",
  process.env.NEXT_PUBLIC_ADMIN_HOSTNAME,
  process.env.RENDER_EXTERNAL_HOSTNAME,
  "hannibalv2.onrender.com", // Render default domain
].filter(Boolean) as string[]

const sql = neon(process.env.DATABASE_URL!)

export async function GET(request: Request) {
  const url = new URL(request.url)
  const hostname = request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  const cleanDomain = hostname.split(":")[0]

  // Check if this is admin domain
  const isAdminDomain = ADMIN_HOSTNAMES.some((adminHost) => hostname.includes(adminHost))

  if (isAdminDomain) {
    // Admin domain - block admin routes, allow public site routes
    const robotsTxt = `# Hannibal Admin Domain
# Block admin/dashboard from indexing

User-agent: *
Disallow: /dashboard
Disallow: /api
Disallow: /admin
Allow: /site/

# Allow AI crawlers for public content
User-agent: GPTBot
Allow: /site/
Disallow: /dashboard
Disallow: /api

User-agent: ChatGPT-User
Allow: /site/
Disallow: /dashboard
Disallow: /api

User-agent: Claude-Web
Allow: /site/
Disallow: /dashboard
Disallow: /api

User-agent: anthropic-ai
Allow: /site/
Disallow: /dashboard
Disallow: /api

User-agent: CCBot
Allow: /site/
Disallow: /dashboard
Disallow: /api

User-agent: PerplexityBot
Allow: /site/
Disallow: /dashboard
Disallow: /api

User-agent: Applebot-Extended
Allow: /site/
Disallow: /dashboard
Disallow: /api

# Google indexing preferences
User-agent: Googlebot
Allow: /site/
Disallow: /dashboard
Disallow: /api
Disallow: /admin

User-agent: Googlebot-Image
Allow: /site/

User-agent: Googlebot-News
Allow: /site/

# Sitemap
Sitemap: ${url.origin}/sitemap.xml
`

    return new NextResponse(robotsTxt, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600, s-maxage=3600",
      },
    })
  }

  // Custom domain - fetch site and generate robots.txt
  try {
    const result = await sql`
      SELECT id, name, custom_domain, language, status
      FROM sites 
      WHERE custom_domain = ${cleanDomain}
      AND status = 'active'
      LIMIT 1
    `

    const site = result[0] as
      | { id: number; name: string; custom_domain: string; language: string; status: string }
      | undefined

    if (!site) {
      // Site not found - return permissive robots.txt
      return new NextResponse(
        `User-agent: *
Disallow:
`,
        {
          headers: {
            "Content-Type": "text/plain",
            "Cache-Control": "public, max-age=3600",
          },
        },
      )
    }

    const baseUrl = `https://${site.custom_domain}`

    // Generate comprehensive robots.txt for media site
    const robotsTxt = `# ${site.name}
# Optimized for search engines and AI crawlers

# Allow all content (news media site)
User-agent: *
Allow: /
Crawl-delay: 1

# AI Crawlers - Full access to content
User-agent: GPTBot
Allow: /
Crawl-delay: 2

User-agent: ChatGPT-User
Allow: /

User-agent: Claude-Web
Allow: /
Crawl-delay: 1

User-agent: anthropic-ai
Allow: /
Crawl-delay: 1

User-agent: CCBot
Allow: /
Crawl-delay: 2

User-agent: PerplexityBot
Allow: /
Crawl-delay: 1

User-agent: Applebot-Extended
Allow: /

User-agent: Meta-ExternalAgent
Allow: /

# Google crawlers
User-agent: Googlebot
Allow: /
Crawl-delay: 1

User-agent: Googlebot-Image
Allow: /

User-agent: Googlebot-News
Allow: /

User-agent: Googlebot-Video
Allow: /

# Bing
User-agent: Bingbot
Allow: /
Crawl-delay: 1

# Other search engines
User-agent: Slurp
Allow: /

User-agent: DuckDuckBot
Allow: /

User-agent: Baiduspider
Allow: /

User-agent: YandexBot
Allow: /

# Social media crawlers
User-agent: facebookexternalhit
Allow: /

User-agent: Twitterbot
Allow: /

User-agent: LinkedInBot
Allow: /

# Sitemaps
Sitemap: ${baseUrl}/sitemap-index.xml
Sitemap: ${baseUrl}/sitemap.xml
Sitemap: ${baseUrl}/sitemap-articles.xml
Sitemap: ${baseUrl}/sitemap-images.xml
Sitemap: ${baseUrl}/rss.xml

# Host
Host: ${baseUrl}
`

    return new NextResponse(robotsTxt, {
      headers: {
        "Content-Type": "text/plain",
        "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
        "X-Robots-Tag": "all",
      },
    })
  } catch (error) {
    console.error("robots.txt error:", error)

    // Fallback - allow all
    return new NextResponse(
      `User-agent: *
Allow: /
`,
      {
        headers: {
          "Content-Type": "text/plain",
          "Cache-Control": "public, max-age=300",
        },
      },
    )
  }
}

