/**
 * UploadThing Client Utilities
 * 
 * Client-side helpers for file uploads using UploadThing
 */

import { generateReactHelpers } from "@uploadthing/react"
import type { OurFileRouter } from "@/app/api/uploadthing/core"

/**
 * Generate typed hooks for UploadThing
 */
export const { useUploadThing, uploadFiles } = generateReactHelpers<OurFileRouter>()

