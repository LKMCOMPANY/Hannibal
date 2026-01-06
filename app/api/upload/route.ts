/**
 * Legacy Upload Route
 * 
 * Maintains backward compatibility for existing upload endpoints
 * Uses UploadThing via server-side API (UTApi)
 */

import { UTApi } from "uploadthing/server"
import { type NextRequest, NextResponse } from "next/server"

const utapi = new UTApi()

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData()
    const file = formData.get("file") as File

    if (!file) {
      return NextResponse.json({ error: "No file provided" }, { status: 400 })
    }

    // Upload to UploadThing
    const response = await utapi.uploadFiles(file)

    if (!response.data) {
      throw new Error("Upload failed - no data returned")
    }

    return NextResponse.json({
      url: response.data.url,
      filename: file.name,
      size: file.size,
      type: file.type,
    })
  } catch (error) {
    console.error("[Hannibal] Upload error:", error)
    return NextResponse.json({ error: "Upload failed" }, { status: 500 })
  }
}
