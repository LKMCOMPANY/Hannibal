import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { neon } from "@neondatabase/serverless"
import { isAuthenticated } from "@/lib/auth/dev-auth"

/**
 * Multi-Tenant Middleware
 *
 * Handles domain resolution and routing for multi-tenant architecture:
 * - Admin domain: Access to dashboard and admin features at root
 * - Custom domains: Rewrites to /site/[siteId] routes
 *
 * Best practices:
 * - Direct database access (no internal fetch)
 * - Fast domain resolution with Edge-compatible DB
 * - Proper error handling
 * - Authentication check for admin routes
 */

  // Admin hostnames that should access the dashboard
  const ADMIN_HOSTNAMES = [
    "localhost",
    "hannibal.media", // Hardcoded production admin domain
    process.env.NEXT_PUBLIC_ADMIN_HOSTNAME,
    process.env.RENDER_EXTERNAL_HOSTNAME,
  ].filter(Boolean) as string[]

// Initialize database connection for Edge Runtime
const sql = neon(process.env.DATABASE_URL!)

export async function middleware(request: NextRequest) {
  const url = request.nextUrl
  // Check for X-Tenant-Host first (custom header from Cloudflare Worker, not overwritten by Vercel)
  // Then X-Forwarded-Host, then standard host header
  const hostname = request.headers.get("x-tenant-host") || request.headers.get("x-forwarded-host") || request.headers.get("host") || ""
  const path = url.pathname

  // Skip middleware for static files, API routes, and Next.js internals
  if (
    path.startsWith("/_next") ||
    path.startsWith("/api") ||
    path.startsWith("/static") ||
    path.includes(".") // Files with extensions
  ) {
    return NextResponse.next()
  }

  // Extract clean domain (remove port for localhost testing)
  const cleanDomain = hostname.split(":")[0]

  const isAdminHostname = ADMIN_HOSTNAMES.some((adminHost) => hostname.includes(adminHost))
  const isRenderPreview = hostname.includes(".onrender.com") // Render preview/staging
  const isVercelDeploy = hostname.includes(".vercel.app") // Vercel deployments
  const isDevelopment = process.env.NODE_ENV === "development"

  // Admin domain or preview environment - check authentication for dashboard routes
  if (isAdminHostname || isRenderPreview || isVercelDeploy || isDevelopment) {
    // Check if user is trying to access dashboard routes
    if (path.startsWith("/dashboard")) {
      const cookies = request.headers.get("cookie")
      
      // If not authenticated, redirect to home page
      if (!isAuthenticated(cookies || undefined)) {
        const homeUrl = new URL("/", request.url)
        homeUrl.searchParams.set("error", "authentication_required")
        return NextResponse.redirect(homeUrl)
      }
    }
    
    return NextResponse.next()
  }

  // Custom domain - resolve to site and rewrite
  try {
    // Normalize domain: remove www. if present to improve matching
    // (Assuming DB stores domains without www, or we handle both)
    const domainWithoutWww = cleanDomain.replace(/^www\./, "")

    // Direct database query instead of internal fetch
    // Try exact match first, then without www
    const result = await sql`
      SELECT id, name, status, custom_domain 
      FROM sites 
      WHERE (custom_domain = ${cleanDomain} OR custom_domain = ${domainWithoutWww})
      AND status = 'active'
      LIMIT 1
    `

    const site = result[0] as { id: number; name: string; status: string; custom_domain: string } | undefined

    if (!site) {
      // Domain not found or site not active
      // Redirect to main admin domain with error message
      const adminDomain = ADMIN_HOSTNAMES.find((h) => h !== "localhost") || "localhost:3000"
      const adminUrl = new URL("/", `https://${adminDomain}`)
      adminUrl.searchParams.set("error", "site_not_found")
      return NextResponse.redirect(adminUrl)
    }

    // Rewrite to /site/[siteId] route
    const rewriteUrl = new URL(`/site/${site.id}${path}`, request.url)

    // Preserve query parameters
    url.searchParams.forEach((value, key) => {
      rewriteUrl.searchParams.set(key, value)
    })

    // Rewrite the request
    const rewriteResponse = NextResponse.rewrite(rewriteUrl)

    // Add custom headers for site context
    rewriteResponse.headers.set("x-site-id", site.id.toString())
    // Encode non-ASCII characters to prevent header errors
    rewriteResponse.headers.set("x-site-name", encodeURIComponent(site.name))
    rewriteResponse.headers.set("x-custom-domain", cleanDomain)

    return rewriteResponse
  } catch (error) {
    console.error("Middleware error:", error)

    // On error, redirect to admin domain
    const adminDomain = ADMIN_HOSTNAMES.find((h) => h !== "localhost") || "localhost:3000"
    const adminUrl = new URL("/", `https://${adminDomain}`)
    adminUrl.searchParams.set("error", "middleware_error")
    return NextResponse.redirect(adminUrl)
  }
}

// Configure which routes the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    "/((?!_next/static|_next/image|favicon.ico|.*\\..*|api).*)",
  ],
}
