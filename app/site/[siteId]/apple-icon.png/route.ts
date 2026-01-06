import { NextResponse } from "next/server"
import { getSitePublicData } from "@/lib/site-resolver"

/**
 * Dynamic Apple Touch Icon Generator
 *
 * Serves the site's logo as an Apple touch icon for iOS devices.
 * This ensures the site looks great when added to the home screen.
 *
 * Apple recommends 180x180px for modern devices.
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
  return NextResponse.redirect(site.logo_url, {
    headers: {
      "Cache-Control": "public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400",
    },
  })
}
