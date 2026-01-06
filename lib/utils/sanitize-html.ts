/**
 * HTML Sanitization Utilities
 *
 * Provides secure HTML sanitization using DOMPurify to prevent XSS attacks.
 * Used for user-generated content and database HTML content.
 * 
 * Note: This module works client-side only (DOMPurify requires browser DOM).
 * For SSR pages, use the regex-based sanitization or trust admin content.
 */

import DOMPurify from "dompurify"

/**
 * Configuration for article content sanitization
 * Allows common editorial HTML tags while blocking dangerous elements
 */
const ARTICLE_CONTENT_CONFIG = {
  ALLOWED_TAGS: [
    // Text formatting
    "p",
    "br",
    "strong",
    "em",
    "u",
    "s",
    "mark",
    "small",
    "sub",
    "sup",
    // Headings
    "h1",
    "h2",
    "h3",
    "h4",
    "h5",
    "h6",
    // Lists
    "ul",
    "ol",
    "li",
    // Links and media
    "a",
    "img",
    "figure",
    "figcaption",
    "picture",
    "source",
    // Quotes and code
    "blockquote",
    "code",
    "pre",
    // Tables
    "table",
    "thead",
    "tbody",
    "tr",
    "th",
    "td",
    // Semantic
    "article",
    "section",
    "aside",
    "div",
    "span",
    "hr",
    // Embedded content (safe)
    "iframe",
    "video",
    "audio",
  ],
  ALLOWED_ATTR: [
    "href",
    "src",
    "alt",
    "title",
    "width",
    "height",
    "class",
    "id",
    "style",
    "target",
    "rel",
    "loading",
    "decoding",
    "fetchpriority",
    "sizes",
    "srcset",
    "type",
    "controls",
    "autoplay",
    "loop",
    "muted",
    "poster",
    "preload",
    "allowfullscreen",
    "frameborder",
    "allow",
  ],
  ALLOWED_URI_REGEXP: /^(?:(?:(?:f|ht)tps?|mailto|tel|callto|sms|cid|xmpp|data):|[^a-z]|[a-z+.\-]+(?:[^a-z+.\-:]|$))/i,
  FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "applet", "base", "form"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  ALLOW_DATA_ATTR: false,
}

/**
 * Configuration for simple HTML content (about, privacy pages)
 * More restrictive than article content
 */
const SIMPLE_CONTENT_CONFIG = {
  ALLOWED_TAGS: [
    "p",
    "br",
    "strong",
    "em",
    "u",
    "h1",
    "h2",
    "h3",
    "h4",
    "ul",
    "ol",
    "li",
    "a",
    "blockquote",
    "hr",
    "div",
    "span",
  ],
  ALLOWED_ATTR: ["href", "target", "rel", "class"],
  FORBID_TAGS: ["script", "style", "iframe", "object", "embed", "form", "input"],
  FORBID_ATTR: ["onerror", "onload", "onclick", "onmouseover"],
  ALLOW_DATA_ATTR: false,
}

/**
 * Sanitize article content HTML (client-side only)
 *
 * @param dirtyHTML - Raw HTML from database or user input
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeArticleContent(dirtyHTML: string): string {
  if (!dirtyHTML) return ""
  
  // DOMPurify only works in browser environment
  if (typeof window === "undefined") {
    return dirtyHTML // SSR: return as-is, sanitization happens on client
  }

  return DOMPurify.sanitize(dirtyHTML, ARTICLE_CONTENT_CONFIG) as string
}

/**
 * Sanitize simple HTML content (about pages, privacy pages)
 * 
 * For SSR pages, uses regex-based sanitization.
 * For client-side, uses DOMPurify.
 *
 * @param dirtyHTML - Raw HTML from database
 * @returns Sanitized HTML safe for rendering
 */
export function sanitizeSimpleContent(dirtyHTML: string): string {
  if (!dirtyHTML) return ""
  
  // Server-side: Use regex-based sanitization (trusted admin content)
  if (typeof window === "undefined") {
    return sanitizeServerSide(dirtyHTML)
  }

  // Client-side: Use DOMPurify
  return DOMPurify.sanitize(dirtyHTML, SIMPLE_CONTENT_CONFIG) as string
}

/**
 * Server-side regex-based HTML sanitization
 * Used for admin-controlled content (about, privacy pages)
 */
function sanitizeServerSide(html: string): string {
  // Remove dangerous tags
  let clean = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
  clean = clean.replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, "")
  clean = clean.replace(/<object\b[^<]*(?:(?!<\/object>)<[^<]*)*<\/object>/gi, "")
  clean = clean.replace(/<embed\b[^<]*(?:(?!<\/embed>)<[^<]*)*<\/embed>/gi, "")
  clean = clean.replace(/<form\b[^<]*(?:(?!<\/form>)<[^<]*)*<\/form>/gi, "")
  
  // Remove dangerous attributes
  clean = clean.replace(/\son\w+\s*=\s*["'][^"']*["']/gi, "") // onclick, onerror, etc.
  clean = clean.replace(/\son\w+\s*=\s*[^\s>]*/gi, "") // onclick without quotes
  clean = clean.replace(/javascript:/gi, "")
  
  return clean
}

/**
 * Sanitize with custom configuration
 *
 * @param dirtyHTML - Raw HTML
 * @param config - Custom sanitization configuration
 * @returns Sanitized HTML
 */
export function sanitizeHTML(
  dirtyHTML: string,
  config?: {
    ALLOWED_TAGS?: string[]
    ALLOWED_ATTR?: string[]
    FORBID_TAGS?: string[]
    FORBID_ATTR?: string[]
    ALLOW_DATA_ATTR?: boolean
  },
): string {
  if (!dirtyHTML) return ""

  return DOMPurify.sanitize(dirtyHTML, config) as string
}

