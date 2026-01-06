import { NextResponse } from "next/server"
import { validateCredentials, createAuthCookie } from "@/lib/auth/dev-auth"

/**
 * POST /api/auth/login
 * 
 * Development login endpoint with hardcoded credentials
 */
export async function POST(request: Request) {
  try {
    const body = await request.json()
    const { username, password } = body

    // Validate input
    if (!username || !password) {
      return NextResponse.json(
        { error: "Nom d'utilisateur et mot de passe requis" },
        { status: 400 }
      )
    }

    // Validate credentials
    if (!validateCredentials(username, password)) {
      return NextResponse.json(
        { error: "Identifiants incorrects" },
        { status: 401 }
      )
    }

    // Create response with auth cookie
    const response = NextResponse.json(
      { success: true, message: "Connexion réussie" },
      { status: 200 }
    )

    // Set authentication cookie
    response.headers.set("Set-Cookie", createAuthCookie())

    return response
  } catch (error) {
    console.error("Login error:", error)
    return NextResponse.json(
      { error: "Erreur lors de la connexion" },
      { status: 500 }
    )
  }
}

