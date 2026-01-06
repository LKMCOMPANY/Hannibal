-- Update timezones for all sites based on their country
-- Updated to use ISO3 country codes (3-letter) instead of ISO2
-- This script maps countries to their primary timezone using IANA timezone database
-- Also sets default autonomous hours to 9H, 13H, and 20H

-- Update timezones and default hours based on country ISO3 codes
UPDATE sites
SET 
  timezone = CASE
    -- Africa
    WHEN country = 'AGO' THEN 'Africa/Luanda'           -- Angola
    WHEN country = 'BFA' THEN 'Africa/Ouagadougou'      -- Burkina Faso
    WHEN country = 'BWA' THEN 'Africa/Gaborone'         -- Botswana
    WHEN country = 'CIV' THEN 'Africa/Abidjan'          -- Côte d'Ivoire
    WHEN country = 'CMR' THEN 'Africa/Douala'           -- Cameroon
    WHEN country = 'COD' THEN 'Africa/Kinshasa'         -- DR Congo
    WHEN country = 'DZA' THEN 'Africa/Algiers'          -- Algeria
    WHEN country = 'EGY' THEN 'Africa/Cairo'            -- Egypt
    WHEN country = 'ETH' THEN 'Africa/Addis_Ababa'      -- Ethiopia
    WHEN country = 'GAB' THEN 'Africa/Libreville'       -- Gabon
    WHEN country = 'GHA' THEN 'Africa/Accra'            -- Ghana
    WHEN country = 'KEN' THEN 'Africa/Nairobi'          -- Kenya
    WHEN country = 'MAR' THEN 'Africa/Casablanca'       -- Morocco
    WHEN country = 'MDG' THEN 'Indian/Antananarivo'     -- Madagascar
    WHEN country = 'MLI' THEN 'Africa/Bamako'           -- Mali
    WHEN country = 'MOZ' THEN 'Africa/Maputo'           -- Mozambique
    WHEN country = 'NAM' THEN 'Africa/Windhoek'         -- Namibia
    WHEN country = 'NGA' THEN 'Africa/Lagos'            -- Nigeria
    WHEN country = 'RWA' THEN 'Africa/Kigali'           -- Rwanda
    WHEN country = 'SEN' THEN 'Africa/Dakar'            -- Senegal
    WHEN country = 'SWZ' THEN 'Africa/Mbabane'          -- Eswatini
    WHEN country = 'TZA' THEN 'Africa/Dar_es_Salaam'    -- Tanzania
    WHEN country = 'ZAF' THEN 'Africa/Johannesburg'     -- South Africa
    WHEN country = 'ZMB' THEN 'Africa/Lusaka'           -- Zambia
    WHEN country = 'ZWE' THEN 'Africa/Harare'           -- Zimbabwe
    
    -- Americas
    WHEN country = 'ARG' THEN 'America/Argentina/Buenos_Aires'  -- Argentina
    WHEN country = 'BOL' THEN 'America/La_Paz'          -- Bolivia
    WHEN country = 'BRA' THEN 'America/Sao_Paulo'       -- Brazil
    WHEN country = 'CAN' THEN 'America/Toronto'         -- Canada (Eastern)
    WHEN country = 'CHL' THEN 'America/Santiago'        -- Chile
    WHEN country = 'COL' THEN 'America/Bogota'          -- Colombia
    WHEN country = 'CRI' THEN 'America/Costa_Rica'      -- Costa Rica
    WHEN country = 'CUB' THEN 'America/Havana'          -- Cuba
    WHEN country = 'ECU' THEN 'America/Guayaquil'       -- Ecuador
    WHEN country = 'GUY' THEN 'America/Guyana'          -- Guyana
    WHEN country = 'HTI' THEN 'America/Port-au-Prince'  -- Haiti
    WHEN country = 'MEX' THEN 'America/Mexico_City'     -- Mexico
    WHEN country = 'PAN' THEN 'America/Panama'          -- Panama
    WHEN country = 'PEU' THEN 'America/Lima'            -- Peru
    WHEN country = 'PRY' THEN 'America/Asuncion'        -- Paraguay
    WHEN country = 'SUR' THEN 'America/Paramaribo'      -- Suriname
    WHEN country = 'URY' THEN 'America/Montevideo'      -- Uruguay
    WHEN country = 'USA' THEN 'America/New_York'        -- USA (Eastern)
    WHEN country = 'VEN' THEN 'America/Caracas'         -- Venezuela
    
    -- Asia
    WHEN country = 'ARE' THEN 'Asia/Dubai'              -- UAE
    WHEN country = 'ARM' THEN 'Asia/Yerevan'            -- Armenia
    WHEN country = 'BGD' THEN 'Asia/Dhaka'              -- Bangladesh
    WHEN country = 'BHR' THEN 'Asia/Bahrain'            -- Bahrain
    WHEN country = 'CHN' THEN 'Asia/Shanghai'           -- China
    WHEN country = 'HKG' THEN 'Asia/Hong_Kong'          -- Hong Kong
    WHEN country = 'IDN' THEN 'Asia/Jakarta'            -- Indonesia
    WHEN country = 'IND' THEN 'Asia/Kolkata'            -- India
    WHEN country = 'IRN' THEN 'Asia/Tehran'             -- Iran
    WHEN country = 'IRQ' THEN 'Asia/Baghdad'            -- Iraq
    WHEN country = 'ISR' THEN 'Asia/Jerusalem'          -- Israel
    WHEN country = 'JPN' THEN 'Asia/Tokyo'              -- Japan
    WHEN country = 'KAZ' THEN 'Asia/Almaty'             -- Kazakhstan
    WHEN country = 'KOR' THEN 'Asia/Seoul'              -- South Korea
    WHEN country = 'KWT' THEN 'Asia/Kuwait'             -- Kuwait
    WHEN country = 'LBN' THEN 'Asia/Beirut'             -- Lebanon
    WHEN country = 'OMN' THEN 'Asia/Muscat'             -- Oman
    WHEN country = 'PAK' THEN 'Asia/Karachi'            -- Pakistan
    WHEN country = 'PHL' THEN 'Asia/Manila'             -- Philippines
    WHEN country = 'QAT' THEN 'Asia/Qatar'              -- Qatar
    WHEN country = 'SAU' THEN 'Asia/Riyadh'             -- Saudi Arabia
    WHEN country = 'SGP' THEN 'Asia/Singapore'          -- Singapore
    WHEN country = 'THA' THEN 'Asia/Bangkok'            -- Thailand
    WHEN country = 'TUR' THEN 'Europe/Istanbul'         -- Turkey
    
    -- Europe
    WHEN country = 'BGR' THEN 'Europe/Sofia'            -- Bulgaria
    WHEN country = 'CHE' THEN 'Europe/Zurich'           -- Switzerland
    WHEN country = 'CYP' THEN 'Asia/Nicosia'            -- Cyprus
    WHEN country = 'DEU' THEN 'Europe/Berlin'           -- Germany
    WHEN country = 'DNK' THEN 'Europe/Copenhagen'       -- Denmark
    WHEN country = 'ESP' THEN 'Europe/Madrid'           -- Spain
    WHEN country = 'FRA' THEN 'Europe/Paris'            -- France
    WHEN country = 'GBR' THEN 'Europe/London'           -- United Kingdom
    WHEN country = 'GRC' THEN 'Europe/Athens'           -- Greece
    WHEN country = 'HRV' THEN 'Europe/Zagreb'           -- Croatia
    WHEN country = 'HUN' THEN 'Europe/Budapest'         -- Hungary
    WHEN country = 'IRL' THEN 'Europe/Dublin'           -- Ireland
    WHEN country = 'ISL' THEN 'Atlantic/Reykjavik'      -- Iceland
    WHEN country = 'ITA' THEN 'Europe/Rome'             -- Italy
    WHEN country = 'LTU' THEN 'Europe/Vilnius'          -- Lithuania
    WHEN country = 'MDA' THEN 'Europe/Chisinau'         -- Moldova
    WHEN country = 'NLD' THEN 'Europe/Amsterdam'        -- Netherlands
    WHEN country = 'NOR' THEN 'Europe/Oslo'             -- Norway
    WHEN country = 'POL' THEN 'Europe/Warsaw'           -- Poland
    WHEN country = 'PRT' THEN 'Europe/Lisbon'           -- Portugal
    WHEN country = 'RUS' THEN 'Europe/Moscow'           -- Russia
    WHEN country = 'SRB' THEN 'Europe/Belgrade'         -- Serbia
    WHEN country = 'SWE' THEN 'Europe/Stockholm'        -- Sweden
    WHEN country = 'UKR' THEN 'Europe/Kyiv'             -- Ukraine
    
    -- Oceania
    WHEN country = 'AUS' THEN 'Australia/Sydney'        -- Australia
    WHEN country = 'NZL' THEN 'Pacific/Auckland'        -- New Zealand
    
    -- Default to UTC if country is unknown
    ELSE 'UTC'
  END,
  -- Set default autonomous hours to 9H, 13H, and 20H using simple integer array
  autonomous_hours = ARRAY[9, 13, 20]
WHERE country IS NOT NULL;

-- Display the results
SELECT 
  id,
  name,
  country,
  country_iso2,
  timezone,
  autonomous_hours,
  CASE 
    WHEN timezone = 'UTC' THEN '⚠️ Default timezone (country not mapped)'
    ELSE '✅ Timezone updated with default hours (9H, 13H, 20H)'
  END as status
FROM sites
ORDER BY country, name;
