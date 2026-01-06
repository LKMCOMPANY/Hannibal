/**
 * Dev Authentication Utilities
 * 
 * Hardcoded authentication for development period
 * ⚠️ WARNING: This is for development only and should be replaced with a proper auth system
 */

// Hardcoded credentials for development
export const DEV_CREDENTIALS = {
  username: "Odyssey",
  password: "Langusta",
}

export const AUTH_COOKIE_NAME = "hannibal_dev_auth"
export const AUTH_COOKIE_VALUE = "authenticated"

/**
 * Validate credentials against hardcoded values
 */
export function validateCredentials(username: string, password: string): boolean {
  return username === DEV_CREDENTIALS.username && password === DEV_CREDENTIALS.password
}

/**
 * Check if the auth cookie is present and valid
 */
export function isAuthenticated(cookies: string | undefined): boolean {
  if (!cookies) return false
  
  const cookieArray = cookies.split(";").map((c) => c.trim())
  const authCookie = cookieArray.find((cookie) => 
    cookie.startsWith(`${AUTH_COOKIE_NAME}=`)
  )
  
  return authCookie === `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}`
}

/**
 * Create authentication cookie string
 */
export function createAuthCookie(): string {
  // Set cookie for 7 days
  const maxAge = 60 * 60 * 24 * 7 // 7 days in seconds
  return `${AUTH_COOKIE_NAME}=${AUTH_COOKIE_VALUE}; Path=/; HttpOnly; SameSite=Lax; Max-Age=${maxAge}`
}

/**
 * Create logout cookie string (expires immediately)
 */
export function createLogoutCookie(): string {
  return `${AUTH_COOKIE_NAME}=; Path=/; HttpOnly; SameSite=Lax; Max-Age=0`
}

