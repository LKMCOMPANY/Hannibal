import { getSitePublicData } from "@/lib/site-resolver"
import { getPublishedArticles } from "@/lib/data/public-articles"

type Props = {
  params: Promise<{ siteId: string }>
}

export async function GET(request: Request, { params }: Props) {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return new Response("Site not found", { status: 404 })
  }

  const baseUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  const articles = await getPublishedArticles(Number(siteId), 50, 0)

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
        (article) => `
    <item>
      <title>${escapeXml(article.title)}</title>
      <link>${baseUrl}/article/${article.slug}</link>
      <guid isPermaLink="true">${baseUrl}/article/${article.slug}</guid>
      <description>${escapeXml(article.excerpt || "")}</description>
      ${article.category ? `<category>${escapeXml(article.category)}</category>` : ""}
      ${article.author_name ? `<dc:creator>${escapeXml(article.author_name)}</dc:creator>` : ""}
      <pubDate>${article.published_at?.toUTCString() || new Date().toUTCString()}</pubDate>
      ${article.featured_image_url ? `<enclosure url="${article.featured_image_url}" type="image/jpeg" />` : ""}
    </item>
    `,
      )
      .join("")}
  </channel>
</rss>`

  return new Response(rss, {
    headers: {
      "Content-Type": "application/xml",
      "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}

function escapeXml(unsafe: string): string {
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
