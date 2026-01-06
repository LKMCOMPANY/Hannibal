/**
 * NewsAPI (Event Registry) Mappings
 * 
 * Dictionaries for converting site data to NewsAPI parameters
 */

/**
 * Country ISO2 → Wikipedia URI mapping
 * 
 * NewsAPI uses Wikipedia URIs to identify countries/locations
 * This is used for sourceLocationUri parameter (articles from sources in this country)
 * 
 * Coverage: 53 countries (100% of your database)
 */
export const COUNTRY_TO_WIKI_URI: Record<string, string> = {
  // Americas (15)
  'US': 'http://en.wikipedia.org/wiki/United_States',
  'CA': 'http://en.wikipedia.org/wiki/Canada',
  'MX': 'http://en.wikipedia.org/wiki/Mexico',
  'BR': 'http://en.wikipedia.org/wiki/Brazil',
  'AR': 'http://en.wikipedia.org/wiki/Argentina',
  'CL': 'http://en.wikipedia.org/wiki/Chile',
  'CO': 'http://en.wikipedia.org/wiki/Colombia',
  'PE': 'http://en.wikipedia.org/wiki/Peru',
  'VE': 'http://en.wikipedia.org/wiki/Venezuela',
  'BO': 'http://en.wikipedia.org/wiki/Bolivia',
  'CR': 'http://en.wikipedia.org/wiki/Costa_Rica',
  'CU': 'http://en.wikipedia.org/wiki/Cuba',
  'EC': 'http://en.wikipedia.org/wiki/Ecuador',
  'GY': 'http://en.wikipedia.org/wiki/Guyana',
  'HT': 'http://en.wikipedia.org/wiki/Haiti',
  'PA': 'http://en.wikipedia.org/wiki/Panama',
  'PY': 'http://en.wikipedia.org/wiki/Paraguay',
  'SR': 'http://en.wikipedia.org/wiki/Suriname',
  'UY': 'http://en.wikipedia.org/wiki/Uruguay',
  
  // Europe (22)
  'GB': 'http://en.wikipedia.org/wiki/United_Kingdom',
  'FR': 'http://en.wikipedia.org/wiki/France',
  'DE': 'http://en.wikipedia.org/wiki/Germany',
  'IT': 'http://en.wikipedia.org/wiki/Italy',
  'ES': 'http://en.wikipedia.org/wiki/Spain',
  'PT': 'http://en.wikipedia.org/wiki/Portugal',
  'NL': 'http://en.wikipedia.org/wiki/Netherlands',
  'BE': 'http://en.wikipedia.org/wiki/Belgium',
  'CH': 'http://en.wikipedia.org/wiki/Switzerland',
  'AT': 'http://en.wikipedia.org/wiki/Austria',
  'SE': 'http://en.wikipedia.org/wiki/Sweden',
  'NO': 'http://en.wikipedia.org/wiki/Norway',
  'DK': 'http://en.wikipedia.org/wiki/Denmark',
  'FI': 'http://en.wikipedia.org/wiki/Finland',
  'IE': 'http://en.wikipedia.org/wiki/Ireland',
  'IS': 'http://en.wikipedia.org/wiki/Iceland',
  'PL': 'http://en.wikipedia.org/wiki/Poland',
  'CZ': 'http://en.wikipedia.org/wiki/Czech_Republic',
  'GR': 'http://en.wikipedia.org/wiki/Greece',
  'RU': 'http://en.wikipedia.org/wiki/Russia',
  'UA': 'http://en.wikipedia.org/wiki/Ukraine',
  'BG': 'http://en.wikipedia.org/wiki/Bulgaria',
  'HR': 'http://en.wikipedia.org/wiki/Croatia',
  'HU': 'http://en.wikipedia.org/wiki/Hungary',
  'LT': 'http://en.wikipedia.org/wiki/Lithuania',
  'RS': 'http://en.wikipedia.org/wiki/Serbia',
  
  // Asia-Pacific (15)
  'JP': 'http://en.wikipedia.org/wiki/Japan',
  'CN': 'http://en.wikipedia.org/wiki/China',
  'HK': 'http://en.wikipedia.org/wiki/Hong_Kong',
  'IN': 'http://en.wikipedia.org/wiki/India',
  'KR': 'http://en.wikipedia.org/wiki/South_Korea',
  'AU': 'http://en.wikipedia.org/wiki/Australia',
  'NZ': 'http://en.wikipedia.org/wiki/New_Zealand',
  'SG': 'http://en.wikipedia.org/wiki/Singapore',
  'TH': 'http://en.wikipedia.org/wiki/Thailand',
  'ID': 'http://en.wikipedia.org/wiki/Indonesia',
  'MY': 'http://en.wikipedia.org/wiki/Malaysia',
  'PH': 'http://en.wikipedia.org/wiki/Philippines',
  'VN': 'http://en.wikipedia.org/wiki/Vietnam',
  'PK': 'http://en.wikipedia.org/wiki/Pakistan',
  'BD': 'http://en.wikipedia.org/wiki/Bangladesh',
  'KZ': 'http://en.wikipedia.org/wiki/Kazakhstan',
  'AM': 'http://en.wikipedia.org/wiki/Armenia',
  
  // Middle East (9)
  'IL': 'http://en.wikipedia.org/wiki/Israel',
  'TR': 'http://en.wikipedia.org/wiki/Turkey',
  'SA': 'http://en.wikipedia.org/wiki/Saudi_Arabia',
  'AE': 'http://en.wikipedia.org/wiki/United_Arab_Emirates',
  'EG': 'http://en.wikipedia.org/wiki/Egypt',
  'IR': 'http://en.wikipedia.org/wiki/Iran',
  'IQ': 'http://en.wikipedia.org/wiki/Iraq',
  'BH': 'http://en.wikipedia.org/wiki/Bahrain',
  'KW': 'http://en.wikipedia.org/wiki/Kuwait',
  'LB': 'http://en.wikipedia.org/wiki/Lebanon',
  'OM': 'http://en.wikipedia.org/wiki/Oman',
  'QA': 'http://en.wikipedia.org/wiki/Qatar',
  
  // Africa (20)
  'ZA': 'http://en.wikipedia.org/wiki/South_Africa',
  'NG': 'http://en.wikipedia.org/wiki/Nigeria',
  'KE': 'http://en.wikipedia.org/wiki/Kenya',
  'GH': 'http://en.wikipedia.org/wiki/Ghana',
  'MA': 'http://en.wikipedia.org/wiki/Morocco',
  'DZ': 'http://en.wikipedia.org/wiki/Algeria',
  'TN': 'http://en.wikipedia.org/wiki/Tunisia',
  'AO': 'http://en.wikipedia.org/wiki/Angola',
  'BF': 'http://en.wikipedia.org/wiki/Burkina_Faso',
  'BW': 'http://en.wikipedia.org/wiki/Botswana',
  'CI': 'http://en.wikipedia.org/wiki/Ivory_Coast',
  'CM': 'http://en.wikipedia.org/wiki/Cameroon',
  'CD': 'http://en.wikipedia.org/wiki/Democratic_Republic_of_the_Congo',
  'ET': 'http://en.wikipedia.org/wiki/Ethiopia',
  'GA': 'http://en.wikipedia.org/wiki/Gabon',
  'MG': 'http://en.wikipedia.org/wiki/Madagascar',
  'ML': 'http://en.wikipedia.org/wiki/Mali',
  'MZ': 'http://en.wikipedia.org/wiki/Mozambique',
  'NA': 'http://en.wikipedia.org/wiki/Namibia',
  'RW': 'http://en.wikipedia.org/wiki/Rwanda',
  'SN': 'http://en.wikipedia.org/wiki/Senegal',
  'SZ': 'http://en.wikipedia.org/wiki/Eswatini',
  'TZ': 'http://en.wikipedia.org/wiki/Tanzania',
  'ZM': 'http://en.wikipedia.org/wiki/Zambia',
  'ZW': 'http://en.wikipedia.org/wiki/Zimbabwe',
} as const

/**
 * Language ISO2 → ISO3 mapping
 * 
 * NewsAPI uses ISO 639-3 (3-letter) language codes
 * Our sites use ISO 639-1 (2-letter) language codes
 * 
 * Coverage: 35 languages (100% of your database)
 * Reference: https://newsapi.ai/documentation (Languages section)
 */
export const LANG_TO_ISO3: Record<string, string> = {
  // Major languages (6)
  'en': 'eng',  // English - 25 sites
  'fr': 'fra',  // French - 16 sites
  'es': 'spa',  // Spanish - 14 sites
  'ar': 'ara',  // Arabic - 9 sites
  'pt': 'por',  // Portuguese - 4 sites
  'de': 'deu',  // German - 2 sites
  
  // European languages (13)
  'it': 'ita',  // Italian - 2 sites
  'nl': 'nld',  // Dutch - 2 sites
  'el': 'ell',  // Greek - 2 sites
  'bg': 'bul',  // Bulgarian - 1 site
  'da': 'dan',  // Danish - 1 site
  'hr': 'hrv',  // Croatian - 1 site
  'hu': 'hun',  // Hungarian - 1 site
  'is': 'isl',  // Icelandic - 1 site
  'lt': 'lit',  // Lithuanian - 1 site
  'no': 'nor',  // Norwegian - 1 site
  'pl': 'pol',  // Polish - 1 site
  'ro': 'ron',  // Romanian - 1 site
  'ru': 'rus',  // Russian - 1 site
  'sr': 'srp',  // Serbian - 1 site
  'sv': 'swe',  // Swedish - 1 site
  'uk': 'ukr',  // Ukrainian - 1 site
  
  // Asian languages (8)
  'ja': 'jpn',  // Japanese - 1 site
  'zh': 'zho',  // Chinese (Mandarin) - 1 site
  'yue': 'zho', // Cantonese (use Mandarin ISO3) - 1 site
  'ko': 'kor',  // Korean - 1 site
  'th': 'tha',  // Thai - 1 site
  'id': 'ind',  // Indonesian - 1 site
  'hi': 'hin',  // Hindi - 1 site
  'bn': 'ben',  // Bengali - 1 site
  'kk': 'kaz',  // Kazakh - 1 site
  'hy': 'hye',  // Armenian - 1 site
  'sw': 'swa',  // Swahili - 2 sites
  
  // Middle Eastern languages (2)
  'tr': 'tur',  // Turkish - 1 site
  'fa': 'fas',  // Persian - 1 site
  'he': 'heb',  // Hebrew
  
  // Other
  'vi': 'vie',  // Vietnamese
  'ms': 'msa',  // Malay
  'cs': 'ces',  // Czech
  'sk': 'slk',  // Slovak
  'sl': 'slv',  // Slovenian
} as const

/**
 * Check if a country code has NewsAPI coverage
 */
export function hasNewsAPICoverage(countryISO2: string | null | undefined): boolean {
  if (!countryISO2) return false
  return countryISO2.toUpperCase() in COUNTRY_TO_WIKI_URI
}

/**
 * Get Wikipedia URI for a country
 */
export function getCountryWikiUri(countryISO2: string | null | undefined): string | null {
  if (!countryISO2) return null
  return COUNTRY_TO_WIKI_URI[countryISO2.toUpperCase()] || null
}

/**
 * Convert language ISO2 to ISO3
 */
export function langISO2toISO3(langISO2: string): string {
  const iso3 = LANG_TO_ISO3[langISO2.toLowerCase()]
  return iso3 || 'eng' // Default to English if unknown
}

