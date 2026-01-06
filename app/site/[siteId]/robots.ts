import type { MetadataRoute } from "next"
import { getSitePublicData } from "@/lib/site-resolver"

type Props = {
  params: Promise<{ siteId: string }>
}

export default async function robots({ params }: Props): Promise<MetadataRoute.Robots> {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return {
      rules: {
        userAgent: "*",
        disallow: "/",
      },
    }
  }

  const baseUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        crawlDelay: 1,
      },
      // AI Crawlers - Generous access for content feeding
      {
        userAgent: "GPTBot",
        allow: "/",
        crawlDelay: 2,
      },
      {
        userAgent: "ChatGPT-User",
        allow: "/",
      },
      {
        userAgent: "Claude-Web",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "anthropic-ai",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "CCBot",
        allow: "/",
        crawlDelay: 2,
      },
      {
        userAgent: "PerplexityBot",
        allow: "/",
        crawlDelay: 1,
      },
      {
        userAgent: "Applebot-Extended",
        allow: "/",
      },
      {
        userAgent: "Meta-ExternalAgent",
        allow: "/",
      },
      // Google specialized bots
      {
        userAgent: "Googlebot-News",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Image",
        allow: "/",
      },
      {
        userAgent: "Googlebot-Video",
        allow: "/",
      },
    ],
    sitemap: `${baseUrl}/sitemap-index.xml`,
    host: baseUrl,
  }
}
