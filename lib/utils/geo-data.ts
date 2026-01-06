/**
 * Geographic Data Utilities
 * 
 * Country code to coordinates mapping for map visualization
 * Based on capital cities for accurate representation
 */

export type CountryCoordinates = {
  lat: number
  lng: number
  name: string
}

/**
 * Country ISO2 to coordinates mapping
 * Uses capital city coordinates for accurate pin placement
 */
export const COUNTRY_COORDINATES: Record<string, CountryCoordinates> = {
  // Europe
  'FR': { lat: 48.8566, lng: 2.3522, name: 'France' },
  'DE': { lat: 52.5200, lng: 13.4050, name: 'Germany' },
  'IT': { lat: 41.9028, lng: 12.4964, name: 'Italy' },
  'ES': { lat: 40.4168, lng: -3.7038, name: 'Spain' },
  'GB': { lat: 51.5074, lng: -0.1278, name: 'United Kingdom' },
  'CH': { lat: 46.9481, lng: 7.4474, name: 'Switzerland' },
  'NL': { lat: 52.3676, lng: 4.9041, name: 'Netherlands' },
  'BE': { lat: 50.8503, lng: 4.3517, name: 'Belgium' },
  'AT': { lat: 48.2082, lng: 16.3738, name: 'Austria' },
  'SE': { lat: 59.3293, lng: 18.0686, name: 'Sweden' },
  'NO': { lat: 59.9139, lng: 10.7522, name: 'Norway' },
  'DK': { lat: 55.6761, lng: 12.5683, name: 'Denmark' },
  'FI': { lat: 60.1695, lng: 24.9354, name: 'Finland' },
  'IE': { lat: 53.3498, lng: -6.2603, name: 'Ireland' },
  'PL': { lat: 52.2297, lng: 21.0122, name: 'Poland' },
  'CZ': { lat: 50.0755, lng: 14.4378, name: 'Czech Republic' },
  'GR': { lat: 37.9838, lng: 23.7275, name: 'Greece' },
  'PT': { lat: 38.7223, lng: -9.1393, name: 'Portugal' },
  'RU': { lat: 55.7558, lng: 37.6173, name: 'Russia' },
  'UA': { lat: 50.4501, lng: 30.5234, name: 'Ukraine' },
  'BG': { lat: 42.6977, lng: 23.3219, name: 'Bulgaria' },
  'HR': { lat: 45.8150, lng: 15.9819, name: 'Croatia' },
  'HU': { lat: 47.4979, lng: 19.0402, name: 'Hungary' },
  'LT': { lat: 54.6872, lng: 25.2797, name: 'Lithuania' },
  'RS': { lat: 44.7866, lng: 20.4489, name: 'Serbia' },
  'IS': { lat: 64.1466, lng: -21.9426, name: 'Iceland' },
  
  // Americas
  'US': { lat: 38.9072, lng: -77.0369, name: 'United States' },
  'CA': { lat: 45.4215, lng: -75.6972, name: 'Canada' },
  'BR': { lat: -15.8267, lng: -47.9218, name: 'Brazil' },
  'MX': { lat: 19.4326, lng: -99.1332, name: 'Mexico' },
  'AR': { lat: -34.6037, lng: -58.3816, name: 'Argentina' },
  'CL': { lat: -33.4489, lng: -70.6693, name: 'Chile' },
  'CO': { lat: 4.7110, lng: -74.0721, name: 'Colombia' },
  'PE': { lat: -12.0464, lng: -77.0428, name: 'Peru' },
  'VE': { lat: 10.4806, lng: -66.9036, name: 'Venezuela' },
  'BO': { lat: -16.5000, lng: -68.1500, name: 'Bolivia' },
  'CR': { lat: 9.9281, lng: -84.0907, name: 'Costa Rica' },
  'CU': { lat: 23.1136, lng: -82.3666, name: 'Cuba' },
  'EC': { lat: -0.1807, lng: -78.4678, name: 'Ecuador' },
  'GY': { lat: 6.8013, lng: -58.1551, name: 'Guyana' },
  'HT': { lat: 18.5944, lng: -72.3074, name: 'Haiti' },
  'PA': { lat: 8.9824, lng: -79.5199, name: 'Panama' },
  'PY': { lat: -25.2637, lng: -57.5759, name: 'Paraguay' },
  'SR': { lat: 5.8520, lng: -55.2038, name: 'Suriname' },
  'UY': { lat: -34.9011, lng: -56.1645, name: 'Uruguay' },
  
  // Asia
  'CN': { lat: 39.9042, lng: 116.4074, name: 'China' },
  'JP': { lat: 35.6762, lng: 139.6503, name: 'Japan' },
  'IN': { lat: 28.6139, lng: 77.2090, name: 'India' },
  'KR': { lat: 37.5665, lng: 126.9780, name: 'South Korea' },
  'TH': { lat: 13.7563, lng: 100.5018, name: 'Thailand' },
  'ID': { lat: -6.2088, lng: 106.8456, name: 'Indonesia' },
  'MY': { lat: 3.1390, lng: 101.6869, name: 'Malaysia' },
  'PH': { lat: 14.5995, lng: 120.9842, name: 'Philippines' },
  'VN': { lat: 21.0285, lng: 105.8542, name: 'Vietnam' },
  'PK': { lat: 33.6844, lng: 73.0479, name: 'Pakistan' },
  'BD': { lat: 23.8103, lng: 90.4125, name: 'Bangladesh' },
  'KZ': { lat: 51.1694, lng: 71.4491, name: 'Kazakhstan' },
  'AM': { lat: 40.1792, lng: 44.4991, name: 'Armenia' },
  'HK': { lat: 22.3193, lng: 114.1694, name: 'Hong Kong' },
  'SG': { lat: 1.3521, lng: 103.8198, name: 'Singapore' },
  
  // Middle East
  'TR': { lat: 39.9334, lng: 32.8597, name: 'Turkey' },
  'SA': { lat: 24.7136, lng: 46.6753, name: 'Saudi Arabia' },
  'AE': { lat: 24.4539, lng: 54.3773, name: 'UAE' },
  'IL': { lat: 31.7683, lng: 35.2137, name: 'Israel' },
  'IR': { lat: 35.6892, lng: 51.3890, name: 'Iran' },
  'IQ': { lat: 33.3152, lng: 44.3661, name: 'Iraq' },
  'EG': { lat: 30.0444, lng: 31.2357, name: 'Egypt' },
  'LB': { lat: 33.8886, lng: 35.4955, name: 'Lebanon' },
  'BH': { lat: 26.2285, lng: 50.5860, name: 'Bahrain' },
  'KW': { lat: 29.3759, lng: 47.9774, name: 'Kuwait' },
  'OM': { lat: 23.5880, lng: 58.3829, name: 'Oman' },
  'QA': { lat: 25.2854, lng: 51.5310, name: 'Qatar' },
  
  // Africa
  'ZA': { lat: -25.7479, lng: 28.2293, name: 'South Africa' },
  'NG': { lat: 9.0765, lng: 7.3986, name: 'Nigeria' },
  'KE': { lat: -1.2921, lng: 36.8219, name: 'Kenya' },
  'GH': { lat: 5.6037, lng: -0.1870, name: 'Ghana' },
  'MA': { lat: 33.9716, lng: -6.8498, name: 'Morocco' },
  'DZ': { lat: 36.7538, lng: 3.0588, name: 'Algeria' },
  'TN': { lat: 36.8065, lng: 10.1815, name: 'Tunisia' },
  'AO': { lat: -8.8390, lng: 13.2894, name: 'Angola' },
  'BF': { lat: 12.3714, lng: -1.5197, name: 'Burkina Faso' },
  'BW': { lat: -24.6282, lng: 25.9231, name: 'Botswana' },
  'CI': { lat: 5.3600, lng: -4.0083, name: 'Ivory Coast' },
  'CM': { lat: 3.8480, lng: 11.5021, name: 'Cameroon' },
  'CD': { lat: -4.3276, lng: 15.3136, name: 'DR Congo' },
  'ET': { lat: 9.0320, lng: 38.7469, name: 'Ethiopia' },
  'GA': { lat: 0.4162, lng: 9.4673, name: 'Gabon' },
  'MG': { lat: -18.8792, lng: 47.5079, name: 'Madagascar' },
  'ML': { lat: 12.6392, lng: -8.0029, name: 'Mali' },
  'MZ': { lat: -25.9655, lng: 32.5832, name: 'Mozambique' },
  'NA': { lat: -22.5597, lng: 17.0832, name: 'Namibia' },
  'RW': { lat: -1.9403, lng: 29.8739, name: 'Rwanda' },
  'SN': { lat: 14.7167, lng: -17.4677, name: 'Senegal' },
  'SZ': { lat: -26.3054, lng: 31.1367, name: 'Eswatini' },
  'TZ': { lat: -6.7924, lng: 39.2083, name: 'Tanzania' },
  'ZM': { lat: -15.3875, lng: 28.3228, name: 'Zambia' },
  'ZW': { lat: -17.8252, lng: 31.0335, name: 'Zimbabwe' },
  
  // Oceania
  'AU': { lat: -35.2809, lng: 149.1300, name: 'Australia' },
  'NZ': { lat: -41.2865, lng: 174.7762, name: 'New Zealand' },
}

/**
 * Get coordinates for country ISO2 code
 */
export function getCountryCoordinates(countryISO2: string | null): CountryCoordinates | null {
  if (!countryISO2) return null
  return COUNTRY_COORDINATES[countryISO2.toUpperCase()] || null
}

