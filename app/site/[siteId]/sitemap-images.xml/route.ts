/**
 * Images Sitemap
 *
 * Dedicated sitemap for images to improve image SEO
 */

import { NextResponse } from "next/server"
import { getSitePublicData } from "@/lib/site-resolver"
import { getPublishedArticles } from "@/lib/data/public-articles"

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

  const articles = await getPublishedArticles(Number(siteId), 1000, 0)
  const articlesWithImages = articles.filter((a) => a.featured_image_url)

  const imageUrls = articlesWithImages
    .map((article) => {
      return `  <url>
    <loc>${baseUrl}/article/${article.slug}</loc>
    <image:image>
      <image:loc>${article.featured_image_url}</image:loc>
      <image:title>${article.featured_image_alt || article.title}</image:title>
      ${article.featured_image_caption ? `<image:caption>${article.featured_image_caption}</image:caption>` : ""}
    </image:image>
  </url>`
    })
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
