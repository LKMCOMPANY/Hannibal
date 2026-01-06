/**
 * UploadThing Route Handler
 * 
 * API route for handling UploadThing file uploads
 * This replaces the previous Vercel Blob implementation
 */

import { createRouteHandler } from "uploadthing/next"
import { ourFileRouter } from "./core"

/**
 * Export routes for Next.js App Router
 */
export const { GET, POST } = createRouteHandler({
  router: ourFileRouter,
  
  // Optional: Add custom config
  config: {
    // Log upload errors
    logLevel: "error",
  },
})

