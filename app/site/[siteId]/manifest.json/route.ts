import { NextResponse } from "next/server"
import { getSitePublicData } from "@/lib/site-resolver"

/**
 * Dynamic Web App Manifest Generator
 *
 * Generates a PWA manifest.json for each media site with:
 * - Site-specific name, description, and icons
 * - Theme colors and display preferences
 * - Optimized for mobile home screen installation
 *
 * Best Practices:
 * - Uses site logo for all icon sizes
 * - Supports multiple icon sizes for different devices
 * - Includes theme colors for native app feel
 * - Enables standalone display mode for app-like experience
 */

type Params = {
  params: Promise<{ siteId: string }>
}

export async function GET(request: Request, { params }: Params) {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site) {
    return NextResponse.json({ error: "Site not found" }, { status: 404 })
  }

  const siteUrl = site.custom_domain
    ? `https://${site.custom_domain}`
    : `${process.env.NEXT_PUBLIC_APP_URL}/site/${siteId}`

  const manifest = {
    name: site.name,
    short_name: site.name.length > 12 ? site.name.substring(0, 12) : site.name,
    description: site.description || `Read the latest news and articles from ${site.name}`,
    start_url: siteUrl,
    display: "standalone",
    background_color: "#ffffff",
    theme_color: site.theme_primary_color || "#000000",
    orientation: "portrait-primary",
    icons: site.logo_url
      ? [
          {
            src: site.logo_url,
            sizes: "192x192",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: site.logo_url,
            sizes: "512x512",
            type: "image/png",
            purpose: "any maskable",
          },
          {
            src: site.logo_url,
            sizes: "180x180",
            type: "image/png",
            purpose: "any",
          },
          {
            src: site.logo_url,
            sizes: "152x152",
            type: "image/png",
            purpose: "any",
          },
          {
            src: site.logo_url,
            sizes: "144x144",
            type: "image/png",
            purpose: "any",
          },
          {
            src: site.logo_url,
            sizes: "120x120",
            type: "image/png",
            purpose: "any",
          },
          {
            src: site.logo_url,
            sizes: "96x96",
            type: "image/png",
            purpose: "any",
          },
          {
            src: site.logo_url,
            sizes: "72x72",
            type: "image/png",
            purpose: "any",
          },
        ]
      : [],
    categories: ["news", "media", "magazines"],
    lang: site.language || "en",
    dir: "ltr",
    scope: siteUrl,
    prefer_related_applications: false,
  }

  return NextResponse.json(manifest, {
    headers: {
      "Content-Type": "application/manifest+json",
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
