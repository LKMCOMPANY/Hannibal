/**
 * Admin hostnames that should access the dashboard (not tenant sites).
 *
 * Vercel exposes VERCEL_URL (e.g. "my-app-abc123.vercel.app") at build time.
 * NEXT_PUBLIC_ADMIN_HOSTNAME is the canonical production domain (e.g. "hannibal.media").
 *
 * We intentionally do NOT include ".vercel.app" or ".onrender.com" wildcard
 * checks here — those are handled as platform checks in middleware.ts.
 */
export const ADMIN_HOSTNAMES = [
  "localhost",
  "hannibal.media",
  process.env.NEXT_PUBLIC_ADMIN_HOSTNAME,
  process.env.VERCEL_URL,
].filter(Boolean) as string[]
