import { type NextRequest, NextResponse } from "next/server"
import { neon } from "@neondatabase/serverless"

const sql = neon(process.env.DATABASE_URL!)

export async function POST(request: NextRequest) {
  try {
    const { email, siteId } = await request.json()

    if (!email || !siteId) {
      return NextResponse.json({ error: "Email and siteId are required" }, { status: 400 })
    }

    // Check if email already exists for this site
    const existing = await sql`
      SELECT id FROM newsletter_subscribers
      WHERE email = ${email} AND site_id = ${Number(siteId)}
    `

    if (existing.length > 0) {
      return NextResponse.json({ message: "Already subscribed" }, { status: 200 })
    }

    // Insert new subscriber
    await sql`
      INSERT INTO newsletter_subscribers (email, site_id, subscribed_at)
      VALUES (${email}, ${Number(siteId)}, NOW())
    `

    return NextResponse.json({ message: "Subscribed successfully" })
  } catch (error) {
    console.error("Newsletter subscription error:", error)
    return NextResponse.json({ error: "Failed to subscribe" }, { status: 500 })
  }
}
