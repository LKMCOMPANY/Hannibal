/**
 * Health Check Endpoint
 * 
 * Used by Render to monitor service availability
 * Returns 200 OK if the service is running properly
 */

import { NextResponse } from "next/server"

export async function GET() {
  try {
    // Basic health check - can be extended to check:
    // - Database connectivity
    // - External service availability
    // - Memory usage, etc.
    
    return NextResponse.json(
      {
        status: "ok",
        timestamp: new Date().toISOString(),
        service: "Hannibal V2",
        environment: process.env.NODE_ENV,
      },
      { status: 200 }
    )
  } catch (error) {
    console.error("[Health Check] Error:", error)
    
    return NextResponse.json(
      {
        status: "error",
        timestamp: new Date().toISOString(),
        error: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 503 } // Service Unavailable
    )
  }
}

