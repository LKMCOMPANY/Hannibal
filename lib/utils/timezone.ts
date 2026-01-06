/**
 * Timezone Conversion Utilities
 *
 * Provides timezone conversion functions for the autonomous publication system.
 * Converts local media times to server timezone for scheduling and display.
 */

import { toZonedTime, fromZonedTime, format } from "date-fns-tz"

/**
 * Server timezone - Europe/Paris (can be configured via env var)
 */
export const SERVER_TIMEZONE = process.env.NEXT_PUBLIC_SERVER_TIMEZONE || "Europe/Paris"

/**
 * Convert a local hour in a specific timezone to server timezone hour
 *
 * @param localHour - Hour in local timezone (0-23)
 * @param sourceTimezone - IANA timezone of the source (e.g., "Asia/Tokyo")
 * @param targetTimezone - IANA timezone to convert to (defaults to SERVER_TIMEZONE)
 * @returns Hour in target timezone (0-23)
 *
 * @example
 * // Convert 10H Tokyo time to Paris time
 * convertHourToTimezone(10, "Asia/Tokyo", "Europe/Paris") // Returns 2 or 3 depending on DST
 */
export function convertHourToTimezone(
  localHour: number,
  sourceTimezone: string,
  targetTimezone: string = SERVER_TIMEZONE,
): number {
  // Create a date object for today at the specified hour in source timezone
  const now = new Date()
  const sourceDate = new Date(now.getFullYear(), now.getMonth(), now.getDate(), localHour, 0, 0)

  // Convert from source timezone to UTC, then to target timezone
  const utcDate = fromZonedTime(sourceDate, sourceTimezone)
  const targetDate = toZonedTime(utcDate, targetTimezone)

  return targetDate.getHours()
}

/**
 * Convert multiple hours from source timezone to target timezone
 *
 * @param hours - Array of hours in local timezone (0-23)
 * @param sourceTimezone - IANA timezone of the source
 * @param targetTimezone - IANA timezone to convert to (defaults to SERVER_TIMEZONE)
 * @returns Array of hours in target timezone
 */
export function convertHoursToTimezone(
  hours: number[],
  sourceTimezone: string,
  targetTimezone: string = SERVER_TIMEZONE,
): number[] {
  return hours.map((hour) => convertHourToTimezone(hour, sourceTimezone, targetTimezone))
}

/**
 * Get timezone offset in hours between two timezones
 *
 * @param sourceTimezone - IANA timezone of the source
 * @param targetTimezone - IANA timezone to compare to
 * @returns Offset in hours (can be fractional for 30/45 min offsets)
 */
export function getTimezoneOffset(sourceTimezone: string, targetTimezone: string): number {
  const now = new Date()
  const sourceDate = toZonedTime(now, sourceTimezone)
  const targetDate = toZonedTime(now, targetTimezone)

  const offsetMs = targetDate.getTime() - sourceDate.getTime()
  return offsetMs / (1000 * 60 * 60)
}

/**
 * Format timezone offset for display
 *
 * @param sourceTimezone - IANA timezone
 * @returns Formatted offset string (e.g., "UTC+9", "UTC-5")
 */
export function formatTimezoneOffset(timezone: string): string {
  const now = new Date()
  const zonedDate = toZonedTime(now, timezone)
  const formatted = format(zonedDate, "XXX", { timeZone: timezone })

  // Convert +09:00 to UTC+9
  const offset = formatted.replace(":00", "").replace("+", "+").replace("-", "-")
  return `UTC${offset}`
}

/**
 * Check if a timezone is valid IANA timezone
 *
 * @param timezone - Timezone string to validate
 * @returns true if valid, false otherwise
 */
export function isValidTimezone(timezone: string): boolean {
  try {
    Intl.DateTimeFormat(undefined, { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

/**
 * Get current hour in a specific timezone
 *
 * @param timezone - IANA timezone
 * @returns Current hour (0-23) in the specified timezone
 */
export function getCurrentHourInTimezone(timezone: string): number {
  const now = new Date()
  const zonedDate = toZonedTime(now, timezone)
  return zonedDate.getHours()
}

// ============================================================================
// Browser-based Timezone Functions (for UI display)
// Uses native Intl API - no external dependencies
// ============================================================================

/**
 * Get user's browser timezone
 * @returns IANA timezone string (e.g., "Europe/Paris", "America/New_York")
 */
export function getUserTimezone(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone
}

/**
 * Convert a local hour to user's browser timezone using native Intl API
 *
 * @param localHour - Hour in source timezone (0-23)
 * @param sourceTimezone - IANA timezone of the source
 * @returns Hour in user's browser timezone (0-23)
 *
 * @example
 * // User in Paris, converting 10H Tokyo time
 * convertHourToBrowserTimezone(10, "Asia/Tokyo") // Returns 2 or 3
 */
export function convertHourToBrowserTimezone(localHour: number, sourceTimezone: string): number {
  const userTimezone = getUserTimezone()

  // Create a date for today at the specified hour
  const now = new Date()
  const year = now.getFullYear()
  const month = now.getMonth()
  const day = now.getDate()

  // Create date string in source timezone
  const dateString = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}T${String(localHour).padStart(2, "0")}:00:00`

  // Parse as if it's in the source timezone
  const sourceDate = new Date(dateString)

  // Get the offset difference
  const sourceFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: sourceTimezone,
    hour: "numeric",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  const userFormatter = new Intl.DateTimeFormat("en-US", {
    timeZone: userTimezone,
    hour: "numeric",
    hour12: false,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  })

  // Create a reference date
  const refDate = new Date(Date.UTC(year, month, day, localHour, 0, 0))

  // Get UTC offset for source timezone
  const sourceOffset = getUTCOffset(sourceTimezone)
  const userOffset = getUTCOffset(userTimezone)

  // Calculate the hour in user timezone
  const utcHour = (localHour - sourceOffset + 24) % 24
  const userHour = (utcHour + userOffset + 24) % 24

  return Math.floor(userHour)
}

/**
 * Get UTC offset for a timezone in hours
 * @param timezone - IANA timezone
 * @returns Offset in hours from UTC
 */
function getUTCOffset(timezone: string): number {
  const now = new Date()
  const utcDate = new Date(now.toLocaleString("en-US", { timeZone: "UTC" }))
  const tzDate = new Date(now.toLocaleString("en-US", { timeZone: timezone }))
  const offset = (tzDate.getTime() - utcDate.getTime()) / (1000 * 60 * 60)
  return offset
}

/**
 * Format timezone name for display
 * @param timezone - IANA timezone
 * @returns Formatted timezone (e.g., "Central European Time")
 */
export function formatTimezoneName(timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "long",
    })
    const parts = formatter.formatToParts(new Date())
    const tzName = parts.find((part) => part.type === "timeZoneName")?.value
    return tzName || timezone
  } catch {
    return timezone
  }
}

/**
 * Format timezone abbreviation for display
 * @param timezone - IANA timezone
 * @returns Timezone abbreviation (e.g., "CET", "JST")
 */
export function formatTimezoneAbbr(timezone: string): string {
  try {
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    })
    const parts = formatter.formatToParts(new Date())
    const tzName = parts.find((part) => part.type === "timeZoneName")?.value
    return tzName || timezone.split("/").pop() || timezone
  } catch {
    return timezone.split("/").pop() || timezone
  }
}
