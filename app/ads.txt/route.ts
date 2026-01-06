/**
 * Universal ads.txt Handler
 *
 * Serves ads.txt for all sites in the network.
 * Currently disabled - no ad networks configured.
 *
 * Format: https://iabtechlab.com/ads-txt/
 */

import { NextResponse } from "next/server"

export async function GET(request: Request) {
  // ads.txt content - currently empty (no ad networks)
  const adsTxt = `# Hannibal Media Network
# No ad networks currently configured

# Additional ad networks can be added here
# Format: <domain>, <publisher_id>, <relationship>, <certification_id>
`

  return new NextResponse(adsTxt, {
    headers: {
      "Content-Type": "text/plain",
      "Cache-Control": "public, max-age=86400, s-maxage=86400", // 24h cache
      "X-Robots-Tag": "noindex", // Don't index ads.txt in search results
    },
  })
}

