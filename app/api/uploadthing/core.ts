/**
 * UploadThing Core Configuration
 * 
 * Centralized file upload configuration using UploadThing
 * Replaces Vercel Blob storage for Render deployment
 */

import { createUploadthing, type FileRouter } from "uploadthing/next"
import { UploadThingError } from "uploadthing/server"

const f = createUploadthing()

/**
 * File Router for UploadThing
 * Defines all file upload endpoints and their configurations
 */
export const ourFileRouter = {
  /**
   * Image uploader for articles, campaigns, and media
   * Accepts: jpg, jpeg, png, gif, webp
   * Max size: 16MB
   */
  imageUploader: f({
    image: {
      maxFileSize: "16MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      // Authentication can be added here if needed
      // For now, we allow uploads (you can add auth later)
      
      // Return metadata that will be available in onUploadComplete
      return { uploadedBy: "user" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      // This code runs on the server after upload completes
      console.log("[UploadThing] Upload complete for:", file.name)
      console.log("[UploadThing] File URL:", file.url)
      console.log("[UploadThing] Metadata:", metadata)

      // Return data that will be sent to the client
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
      }
    }),

  /**
   * Multiple images uploader for campaigns
   * Accepts: jpg, jpeg, png, gif, webp
   * Max size: 8MB per file
   * Max count: 10 files
   */
  campaignImagesUploader: f({
    image: {
      maxFileSize: "8MB",
      maxFileCount: 10,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "user" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Campaign image uploaded:", file.name)
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
      }
    }),

  /**
   * Logo uploader for sites/media
   * Accepts: jpg, jpeg, png, svg
   * Max size: 4MB
   */
  logoUploader: f({
    image: {
      maxFileSize: "4MB",
      maxFileCount: 1,
    },
  })
    .middleware(async () => {
      return { uploadedBy: "user" }
    })
    .onUploadComplete(async ({ metadata, file }) => {
      console.log("[UploadThing] Logo uploaded:", file.name)
      return { 
        url: file.url,
        name: file.name,
        size: file.size,
      }
    }),
} satisfies FileRouter

export type OurFileRouter = typeof ourFileRouter

