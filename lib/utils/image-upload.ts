/**
 * Image Upload Utilities
 *
 * Centralized utilities for uploading images using UploadThing
 * Migrated from Vercel Blob to support Render deployment
 */

import { UTApi } from "uploadthing/server"

/**
 * UploadThing API client instance
 */
const utapi = new UTApi()

/**
 * Upload a file to UploadThing storage
 */
export async function uploadFileToBlob(file: File): Promise<string> {
  try {
    const response = await utapi.uploadFiles(file)
    
    if (!response.data) {
      throw new Error("Upload failed - no data returned")
    }
    
    return response.data.url
  } catch (error) {
    console.error("[Hannibal] Failed to upload file to UploadThing:", error)
    throw new Error(`Failed to upload ${file.name}`)
  }
}

/**
 * Download an image from a URL and upload it to UploadThing storage
 */
export async function downloadAndUploadToBlob(imageUrl: string, filename?: string): Promise<string> {
  try {
    // Fetch the image
    const response = await fetch(imageUrl)
    if (!response.ok) {
      throw new Error(`Failed to fetch image: ${response.statusText}`)
    }

    // Get the blob data
    const blob = await response.blob()

    // Extract filename from URL if not provided
    const finalFilename = filename || imageUrl.split("/").pop()?.split("?")[0] || "image.jpg"

    // Create a File object
    const file = new File([blob], finalFilename, { type: blob.type })

    // Upload to UploadThing storage
    return await uploadFileToBlob(file)
  } catch (error) {
    console.error("[Hannibal] Failed to download and upload image:", error)
    throw new Error(`Failed to process image from ${imageUrl}`)
  }
}

/**
 * Upload multiple files to UploadThing storage
 */
export async function uploadFilesToBlob(files: File[]): Promise<string[]> {
  try {
    const response = await utapi.uploadFiles(files)
    
    if (!Array.isArray(response)) {
      throw new Error("Upload failed - invalid response format")
    }
    
    return response.map((r) => {
      if (!r.data) {
        throw new Error("Upload failed for one or more files")
      }
      return r.data.url
    })
  } catch (error) {
    console.error("[Hannibal] Failed to upload files:", error)
    throw new Error("Failed to upload multiple files")
  }
}

/**
 * Check if a URL is an UploadThing storage URL
 */
export function isBlobUrl(url: string): boolean {
  return (
    url.includes("uploadthing.com") ||
    url.includes("utfs.io") ||
    // Legacy Vercel Blob URLs (for backward compatibility)
    url.includes("blob.vercel-storage.com") ||
    url.includes("public.blob.vercel-storage.com")
  )
}

/**
 * Check if a string is a base64 data URL
 */
export function isBase64DataUrl(str: string): boolean {
  return str.startsWith("data:image/")
}
