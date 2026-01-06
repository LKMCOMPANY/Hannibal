import { NextResponse } from "next/server"
import { createLogoutCookie } from "@/lib/auth/dev-auth"

/**
 * POST /api/auth/logout
 * 
 * Logout endpoint - clears authentication cookie
 */
export async function POST() {
  try {
    const response = NextResponse.json(
      { success: true, message: "Déconnexion réussie" },
      { status: 200 }
    )

    // Clear authentication cookie
    response.headers.set("Set-Cookie", createLogoutCookie())

    return response
  } catch (error) {
    console.error("Logout error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la déconnexion" },
      { status: 500 }
    )
  }
}

