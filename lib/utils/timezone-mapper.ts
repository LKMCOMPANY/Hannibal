/**
 * Timezone Mapper Utility
 * Maps countries to their primary IANA timezone
 * Updated to support both ISO2 and ISO3 country codes
 */

export const COUNTRY_TO_TIMEZONE_ISO3: Record<string, string> = {
  // Africa
  AGO: "Africa/Luanda",
  BFA: "Africa/Ouagadougou",
  BWA: "Africa/Gaborone",
  CIV: "Africa/Abidjan",
  CMR: "Africa/Douala",
  COD: "Africa/Kinshasa",
  DZA: "Africa/Algiers",
  EGY: "Africa/Cairo",
  ETH: "Africa/Addis_Ababa",
  GAB: "Africa/Libreville",
  GHA: "Africa/Accra",
  KEN: "Africa/Nairobi",
  MAR: "Africa/Casablanca",
  MDG: "Africa/Antananarivo",
  MLI: "Africa/Bamako",
  MOZ: "Africa/Maputo",
  NAM: "Africa/Windhoek",
  NGA: "Africa/Lagos",
  RWA: "Africa/Kigali",
  SEN: "Africa/Dakar",
  SWZ: "Africa/Mbabane",
  TZA: "Africa/Dar_es_Salaam",
  ZAF: "Africa/Johannesburg",
  ZMB: "Africa/Lusaka",
  ZWE: "Africa/Harare",

  // Americas
  ARG: "America/Argentina/Buenos_Aires",
  BOL: "America/La_Paz",
  BRA: "America/Sao_Paulo",
  CAN: "America/Toronto",
  CHL: "America/Santiago",
  COL: "America/Bogota",
  CRI: "America/Costa_Rica",
  CUB: "America/Havana",
  ECU: "America/Guayaquil",
  GUY: "America/Guyana",
  HTI: "America/Port-au-Prince",
  MEX: "America/Mexico_City",
  PAN: "America/Panama",
  PEU: "America/Lima",
  PRY: "America/Asuncion",
  SUR: "America/Paramaribo",
  URY: "America/Montevideo",
  USA: "America/New_York",
  VEN: "America/Caracas",

  // Asia
  ARE: "Asia/Dubai",
  ARM: "Asia/Yerevan",
  BGD: "Asia/Dhaka",
  BHR: "Asia/Bahrain",
  CHN: "Asia/Shanghai",
  HKG: "Asia/Hong_Kong",
  IDN: "Asia/Jakarta",
  IND: "Asia/Kolkata",
  IRN: "Asia/Tehran",
  IRQ: "Asia/Baghdad",
  ISR: "Asia/Jerusalem",
  JPN: "Asia/Tokyo",
  KAZ: "Asia/Almaty",
  KOR: "Asia/Seoul",
  KWT: "Asia/Kuwait",
  LBN: "Asia/Beirut",
  OMN: "Asia/Muscat",
  PAK: "Asia/Karachi",
  PHL: "Asia/Manila",
  QAT: "Asia/Qatar",
  SAU: "Asia/Riyadh",
  SGP: "Asia/Singapore",
  THA: "Asia/Bangkok",
  TUR: "Europe/Istanbul",

  // Europe
  BGR: "Europe/Sofia",
  CHE: "Europe/Zurich",
  CYP: "Asia/Nicosia",
  DEU: "Europe/Berlin",
  DNK: "Europe/Copenhagen",
  ESP: "Europe/Madrid",
  FRA: "Europe/Paris",
  GBR: "Europe/London",
  GRC: "Europe/Athens",
  HRV: "Europe/Zagreb",
  HUN: "Europe/Budapest",
  IRL: "Europe/Dublin",
  ISL: "Atlantic/Reykjavik",
  ITA: "Europe/Rome",
  LTU: "Europe/Vilnius",
  MDA: "Europe/Chisinau",
  NLD: "Europe/Amsterdam",
  NOR: "Europe/Oslo",
  POL: "Europe/Warsaw",
  PRT: "Europe/Lisbon",
  RUS: "Europe/Moscow",
  SRB: "Europe/Belgrade",
  SWE: "Europe/Stockholm",
  UKR: "Europe/Kyiv",

  // Oceania
  AUS: "Australia/Sydney",
  NZL: "Pacific/Auckland",
}

export const COUNTRY_TO_TIMEZONE: Record<string, string> = {
  // Europe
  FR: "Europe/Paris",
  DE: "Europe/Berlin",
  GB: "Europe/London",
  ES: "Europe/Madrid",
  IT: "Europe/Rome",
  NL: "Europe/Amsterdam",
  BE: "Europe/Brussels",
  CH: "Europe/Zurich",
  AT: "Europe/Vienna",
  PT: "Europe/Lisbon",
  GR: "Europe/Athens",
  PL: "Europe/Warsaw",
  SE: "Europe/Stockholm",
  NO: "Europe/Oslo",
  DK: "Europe/Copenhagen",
  FI: "Europe/Helsinki",
  IE: "Europe/Dublin",
  CZ: "Europe/Prague",
  HU: "Europe/Budapest",
  RO: "Europe/Bucharest",

  // Americas
  US: "America/New_York",
  CA: "America/Toronto",
  MX: "America/Mexico_City",
  BR: "America/Sao_Paulo",
  AR: "America/Argentina/Buenos_Aires",
  CL: "America/Santiago",
  CO: "America/Bogota",
  PE: "America/Lima",
  VE: "America/Caracas",

  // Asia
  JP: "Asia/Tokyo",
  CN: "Asia/Shanghai",
  IN: "Asia/Kolkata",
  KR: "Asia/Seoul",
  SG: "Asia/Singapore",
  HK: "Asia/Hong_Kong",
  TH: "Asia/Bangkok",
  MY: "Asia/Kuala_Lumpur",
  ID: "Asia/Jakarta",
  PH: "Asia/Manila",
  VN: "Asia/Ho_Chi_Minh",
  TW: "Asia/Taipei",
  IL: "Asia/Jerusalem",
  TR: "Europe/Istanbul",
  SA: "Asia/Riyadh",
  AE: "Asia/Dubai",

  // Oceania
  AU: "Australia/Sydney",
  NZ: "Pacific/Auckland",

  // Africa
  ZA: "Africa/Johannesburg",
  EG: "Africa/Cairo",
  NG: "Africa/Lagos",
  KE: "Africa/Nairobi",
  MA: "Africa/Casablanca",
  DZ: "Africa/Algiers",
  TN: "Africa/Tunis",
}

/**
 * Get timezone for a country code (supports both ISO2 and ISO3)
 * @param countryCode - Two or three-letter country code (e.g., 'FR', 'FRA', 'US', 'USA')
 * @returns IANA timezone string or 'UTC' as fallback
 */
export function getTimezoneForCountry(countryCode: string | null): string {
  if (!countryCode) return "UTC"

  const code = countryCode.toUpperCase()

  if (code.length === 3) {
    return COUNTRY_TO_TIMEZONE_ISO3[code] || "UTC"
  }

  return COUNTRY_TO_TIMEZONE[code] || "UTC"
}

/**
 * Get all available timezones grouped by region
 */
export function getTimezonesByRegion() {
  return {
    Europe: Object.entries(COUNTRY_TO_TIMEZONE)
      .filter(([_, tz]) => tz.startsWith("Europe/"))
      .map(([code, tz]) => ({ code, timezone: tz })),
    Americas: Object.entries(COUNTRY_TO_TIMEZONE)
      .filter(([_, tz]) => tz.startsWith("America/"))
      .map(([code, tz]) => ({ code, timezone: tz })),
    Asia: Object.entries(COUNTRY_TO_TIMEZONE)
      .filter(([_, tz]) => tz.startsWith("Asia/"))
      .map(([code, tz]) => ({ code, timezone: tz })),
    Oceania: Object.entries(COUNTRY_TO_TIMEZONE)
      .filter(([_, tz]) => tz.startsWith("Australia/") || tz.startsWith("Pacific/"))
      .map(([code, tz]) => ({ code, timezone: tz })),
    Africa: Object.entries(COUNTRY_TO_TIMEZONE)
      .filter(([_, tz]) => tz.startsWith("Africa/"))
      .map(([code, tz]) => ({ code, timezone: tz })),
  }
}

/**
 * Format timezone for display
 * @param timezone - IANA timezone string
 * @returns Formatted timezone string (e.g., 'Paris (GMT+1)')
 */
export function formatTimezone(timezone: string): string {
  try {
    const now = new Date()
    const formatter = new Intl.DateTimeFormat("en-US", {
      timeZone: timezone,
      timeZoneName: "short",
    })
    const parts = formatter.formatToParts(now)
    const tzName = parts.find((part) => part.type === "timeZoneName")?.value || ""
    const city = timezone.split("/").pop()?.replace(/_/g, " ") || timezone
    return `${city} (${tzName})`
  } catch {
    return timezone
  }
}
