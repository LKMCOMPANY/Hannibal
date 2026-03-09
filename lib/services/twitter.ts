/**
 * Twitter API Service
 * 
 * OAuth 1.0a implementation for Twitter API v2
 * Based on v1 proven implementation
 * 
 * Features:
 * - Post tweets with OAuth 1.0a authentication
 * - Test connection/credentials
 * - Type-safe API responses
 * - Error handling
 */

import crypto from "crypto"

// ============================================================================
// Types
// ============================================================================

export interface TwitterUser {
  id: string
  name: string
  username: string
}

export interface TwitterTweet {
  id: string
  text: string
}

export interface TwitterApiResponse {
  data?: TwitterTweet
  errors?: Array<{
    title: string
    detail: string
    type: string
    status?: number
  }>
}

export interface TwitterCredentials {
  twitter_api_key: string              // Consumer Key (API Key) - 25 chars
  twitter_token: string                // Consumer Secret (API Secret) - 50 chars
  twitter_access_token: string         // Access Token - 50 chars
  twitter_access_token_secret: string  // Access Token Secret - 45 chars
}

// ============================================================================
// Validation
// ============================================================================

/**
 * Validate that Twitter credentials are complete
 */
export function validateTwitterCredentials(site: any): site is TwitterCredentials {
  return !!(
    site.twitter_api_key &&
    site.twitter_token &&
    site.twitter_access_token &&
    site.twitter_access_token_secret
  )
}

// ============================================================================
// OAuth 1.0a Implementation
// ============================================================================

/**
 * Percent encode according to RFC 3986
 */
function percentEncode(str: string): string {
  return encodeURIComponent(str).replace(/[!'()*]/g, (c) => `%${c.charCodeAt(0).toString(16).toUpperCase()}`)
}

/**
 * Generate OAuth 1.0a signature (Twitter spec)
 */
function generateOAuthSignature(
  method: string,
  url: string,
  params: Record<string, string>,
  consumerSecret: string,
  tokenSecret: string
): string {
  // 1. Encode all parameters
  const encodedParams: Record<string, string> = {}
  for (const [key, value] of Object.entries(params)) {
    encodedParams[percentEncode(key)] = percentEncode(value)
  }

  // 2. Sort parameters by key
  const sortedKeys = Object.keys(encodedParams).sort()

  // 3. Create parameter string
  const parameterString = sortedKeys.map((key) => `${key}=${encodedParams[key]}`).join("&")

  // 4. Create signature base string
  const signatureBaseString = [method.toUpperCase(), percentEncode(url), percentEncode(parameterString)].join("&")

  // 5. Create signing key
  const signingKey = `${percentEncode(consumerSecret)}&${percentEncode(tokenSecret)}`

  // 6. Generate HMAC-SHA1 signature
  const signature = crypto.createHmac("sha1", signingKey).update(signatureBaseString).digest("base64")

  return signature
}

/**
 * Generate OAuth 1.0a Authorization header
 */
function generateOAuthHeader(
  method: string,
  url: string,
  credentials: TwitterCredentials,
  additionalParams: Record<string, string> = {}
): string {
  // Base OAuth parameters
  const oauthParams: Record<string, string> = {
    oauth_consumer_key: credentials.twitter_api_key,
    oauth_token: credentials.twitter_access_token,
    oauth_signature_method: "HMAC-SHA1",
    oauth_timestamp: Math.floor(Date.now() / 1000).toString(),
    oauth_nonce: crypto.randomBytes(16).toString("hex"),
    oauth_version: "1.0",
    ...additionalParams,
  }

  // Generate signature with all parameters
  const allParams = { ...oauthParams }
  const signature = generateOAuthSignature(
    method,
    url,
    allParams,
    credentials.twitter_token,
    credentials.twitter_access_token_secret
  )

  // Add signature to OAuth params
  const oauthParamsWithSignature = {
    ...oauthParams,
    oauth_signature: signature,
  }

  // Build Authorization header (OAuth params only)
  const authParams = Object.keys(oauthParamsWithSignature)
    .sort()
    .map((key) => `${percentEncode(key)}="${percentEncode(oauthParamsWithSignature[key])}"`)
    .join(", ")

  return `OAuth ${authParams}`
}

// ============================================================================
// Twitter Client
// ============================================================================

export class TwitterClient {
  private credentials: TwitterCredentials

  constructor(credentials: TwitterCredentials) {
    this.credentials = credentials
  }

  /**
   * Test connection by verifying credentials (API v1.1)
   */
  async testConnection(): Promise<{ success: boolean; message: string; user?: TwitterUser }> {
    try {
      const url = "https://api.twitter.com/1.1/account/verify_credentials.json"
      const authHeader = generateOAuthHeader("GET", url, this.credentials)

      void 0

      const response = await fetch(url, {
        method: "GET",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          "User-Agent": "Hannibal-Media-Bot/2.0",
        },
      })

      const responseText = await response.text()

      if (!response.ok) {
        return {
          success: false,
          message: `Twitter API error (${response.status}): ${responseText}`,
        }
      }

      const data = JSON.parse(responseText)

      if (data.errors) {
        return {
          success: false,
          message: `Twitter error: ${data.errors[0]?.message || "Unknown error"}`,
        }
      }

      return {
        success: true,
        message: `Connected as @${data.screen_name}`,
        user: {
          id: data.id_str,
          name: data.name,
          username: data.screen_name,
        },
      }
    } catch (error: any) {
      return {
        success: false,
        message: `Connection error: ${error.message}`,
      }
    }
  }

  /**
   * Post a tweet (API v2)
   */
  async postTweet(text: string): Promise<TwitterTweet> {
    try {
      // Validation
      if (!text || text.trim().length === 0) {
        throw new Error("Tweet text cannot be empty")
      }

      if (text.length > 280) {
        throw new Error(`Tweet too long: ${text.length} characters (max 280)`)
      }

      const url = "https://api.twitter.com/2/tweets"
      const body = JSON.stringify({ text: text.trim() })

      void 0

      const authHeader = generateOAuthHeader("POST", url, this.credentials)

      const response = await fetch(url, {
        method: "POST",
        headers: {
          Authorization: authHeader,
          "Content-Type": "application/json",
          "User-Agent": "Hannibal-Media-Bot/2.0",
        },
        body,
      })

      const responseText = await response.text()

      if (!response.ok) {
        void 0
        throw new Error(`Twitter API error (${response.status}): ${responseText}`)
      }

      const data: TwitterApiResponse = JSON.parse(responseText)

      if (data.errors) {
        throw new Error(`Twitter error: ${data.errors[0]?.detail || "Unknown error"}`)
      }

      if (!data.data) {
        throw new Error("Invalid Twitter response: no data")
      }

      void 0

      return data.data
    } catch (error: any) {
      throw error
    }
  }
}

// ============================================================================
// Factory Functions
// ============================================================================

/**
 * Create Twitter client for a site
 */
export function createTwitterClient(site: any): TwitterClient {
  if (!validateTwitterCredentials(site)) {
    throw new Error("Twitter credentials missing or incomplete for this site")
  }

  return new TwitterClient({
    twitter_api_key: site.twitter_api_key,
    twitter_token: site.twitter_token,
    twitter_access_token: site.twitter_access_token,
    twitter_access_token_secret: site.twitter_access_token_secret,
  })
}

/**
 * Generate Twitter post URL from tweet ID and handle
 */
export function generateTwitterPostUrl(twitterHandle: string, tweetId: string): string {
  // Remove @ if present
  const handle = twitterHandle.startsWith("@") ? twitterHandle.slice(1) : twitterHandle
  return `https://x.com/${handle}/status/${tweetId}`
}

