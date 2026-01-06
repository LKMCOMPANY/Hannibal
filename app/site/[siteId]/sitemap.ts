import type { MetadataRoute } from "next"
import { getSitePublicData } from "@/lib/site-resolver"
import { getPublishedArticles } from "@/lib/data/public-articles"

type Props = {
  params: Promise<{ siteId: string }>
}

export default async function sitemap({ params }: Props): Promise<MetadataRoute.Sitemap> {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return []
  }

  const baseUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  // Get all published articles
  const articles = await getPublishedArticles(Number(siteId), 1000, 0)

  // Get unique categories
  const categories = [...new Set(articles.map((a) => a.category).filter(Boolean))]

  return [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: "daily",
      priority: 1,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.8,
    },
    {
      url: `${baseUrl}/privacy`,
      lastModified: new Date(),
      changeFrequency: "monthly",
      priority: 0.5,
    },
    ...articles.map((article) => ({
      url: `${baseUrl}/article/${article.slug}`,
      lastModified: article.updated_at || article.published_at || new Date(),
      changeFrequency: "weekly" as const,
      priority: 0.9,
      ...(article.featured_image_url
        ? {
            images: [
              {
                url: article.featured_image_url,
                title: article.featured_image_alt || article.title,
                caption: article.featured_image_caption || undefined,
              },
            ],
          }
        : {}),
    })),
    ...categories.map((category) => ({
      url: `${baseUrl}/category/${encodeURIComponent(category!)}`,
      lastModified: new Date(),
      changeFrequency: "daily" as const,
      priority: 0.7,
    })),
  ]
}
