import { type NextRequest, NextResponse } from "next/server"
import { downloadAndUploadToBlob } from "@/lib/utils/image-upload"

/**
 * API endpoint to download an image from a URL and upload it to Blob storage
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { url, filename } = body

    if (!url) {
      return NextResponse.json({ error: "No URL provided" }, { status: 400 })
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json({ error: "Invalid URL format" }, { status: 400 })
    }

    // Download and upload to Blob
    const blobUrl = await downloadAndUploadToBlob(url, filename)

    return NextResponse.json({
      url: blobUrl,
      originalUrl: url,
    })
  } catch (error) {
    console.error("[v0] Image URL upload error:", error)
    return NextResponse.json({ error: error instanceof Error ? error.message : "Upload failed" }, { status: 500 })
  }
}
