import { type NextRequest, NextResponse } from "next/server"
import { sql } from "@/lib/db"

export async function GET(request: NextRequest) {
  const domain = request.nextUrl.searchParams.get("domain")

  if (!domain) {
    return NextResponse.json(null, { status: 400 })
  }

  try {
    const result = await sql`
      SELECT id, name, status, custom_domain 
      FROM sites 
      WHERE custom_domain = ${domain}
      AND status = 'active'
      LIMIT 1
    `

    const site = result[0] as { id: number; name: string; status: string; custom_domain: string } | undefined

    if (!site) {
      return NextResponse.json(null, { status: 404 })
    }

    return NextResponse.json({ id: site.id, name: site.name })
  } catch (error) {
    console.error("Domain resolution error:", error)
    return NextResponse.json(null, { status: 500 })
  }
}
