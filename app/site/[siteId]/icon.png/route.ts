import { NextResponse } from "next/server"
import { getSitePublicData } from "@/lib/site-resolver"

/**
 * Dynamic Favicon Generator
 *
 * Serves the site's logo as a favicon with proper caching headers.
 * Falls back to a generated icon if no logo is available.
 *
 * This route is used by Next.js metadata API for icon generation.
 */

type Params = {
  params: Promise<{ siteId: string }>
}

export async function GET(request: Request, { params }: Params) {
  const { siteId } = await params
  const site = await getSitePublicData(Number(siteId))

  if (!site || !site.logo_url) {
    // Return a 1x1 transparent PNG if no logo
    const transparentPng = Buffer.from(
      "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==",
      "base64",
    )

    return new NextResponse(transparentPng, {
      headers: {
        "Content-Type": "image/png",
        "Cache-Control": "public, max-age=31536000, immutable",
      },
    })
  }

  // Redirect to the actual logo URL
  // The browser will cache this redirect
  return NextResponse.redirect(site.logo_url, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
