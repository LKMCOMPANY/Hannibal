-- ============================================================================
-- THEME CONFIGURATION MIGRATION
-- Intelligent theme and color assignment for 103 media sites
-- Based on: Culture, Ideology, Editorial Tone, Country
-- ============================================================================

-- CATEGORY 1: ARAB CONSERVATIVE (Classic theme - Traditional authority)
-- ============================================================================
UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#006233', theme_accent_color = '#C1272D' 
WHERE custom_domain IN ('dzinfo.org', 'alwatanalakbar.com', 'gulfhorizon.info', 'muscattimes.com', 'kuwaitpost.org', 'dunestribune.com');

-- CATEGORY 2: ARAB MODERATE (Modern theme)
UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#C8102E', theme_accent_color = '#007A3D' 
WHERE custom_domain = 'lebanon-plus.com';

-- CATEGORY 3: EUROPEAN CONSERVATIVE (Classic theme - Traditional newspapers)
-- ============================================================================
UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#004C45', theme_accent_color = '#D72638' 
WHERE custom_domain = 'italia-24.com';

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#002654', theme_accent_color = '#ED2939' 
WHERE custom_domain IN ('journal-sentinelle.com', 'lejournalenligne.com', 'horizonspublics.org');

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#009A44', theme_accent_color = '#CD212A' 
WHERE custom_domain = 'turulnews.org';

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#DC143C', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'kurierpolski.org';

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#02529C', theme_accent_color = '#DC1E35' 
WHERE custom_domain = 'norraentljos.com';

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#012169', theme_accent_color = '#C8102E' 
WHERE custom_domain = 'british-daily.com';

-- CATEGORY 4: EUROPEAN PROGRESSIVE (Modern theme)
-- ============================================================================
UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#000000', theme_accent_color = '#DD0000' 
WHERE custom_domain = 'echoberlin.info';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#006AA7', theme_accent_color = '#FECC00' 
WHERE custom_domain = 'detoffentliga.org';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#21468B', theme_accent_color = '#AE1C28' 
WHERE custom_domain = 'openstad.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#C8102E', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'faktanu.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#FDB913', theme_accent_color = '#C1272D' 
WHERE custom_domain = 'atviralietuva.org';

-- CATEGORY 5: LATIN LEFTIST/REVOLUTIONARY (Bold theme - Activist)
-- ============================================================================
UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#CE1126', theme_accent_color = '#007934' 
WHERE custom_domain = 'elpulsopopular.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#FCD116', theme_accent_color = '#CE1126' 
WHERE custom_domain = 'el-nuevo-camino.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#007A33', theme_accent_color = '#FCD116' 
WHERE custom_domain IN ('lavozdepachamama.com', 'tierrabolivariana.com');

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#009739', theme_accent_color = '#FFCD00' 
WHERE custom_domain = 'vozesdobrasil.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#CE1126', theme_accent_color = '#0038A8' 
WHERE custom_domain = 'larepubliqueenmarche.com';

-- CATEGORY 6: LATIN CONSERVATIVE (Classic theme)
-- ============================================================================
UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#74ACDF', theme_accent_color = '#F6B40E' 
WHERE custom_domain = 'agendafederal.com';

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#0039A6', theme_accent_color = '#D52B1E' 
WHERE custom_domain = 'chileprimera.com';

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#D91023', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'elforoliberal.com';

-- CATEGORY 7: LATIN MODERATE (Modern theme)
-- ============================================================================
UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#002B7F', theme_accent_color = '#CE1126' 
WHERE custom_domain = 'eldiariodujarras.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#DA291C', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'noticiasdelcanal.info';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#0038A8', theme_accent_color = '#FCD116' 
WHERE custom_domain = 'lavozdemontevideo.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#FFD100', theme_accent_color = '#034EA2' 
WHERE custom_domain = 'mitad-del-mundo.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#D52B1E', theme_accent_color = '#0038A8' 
WHERE custom_domain = 'hoyenasuncion.com';

-- CATEGORY 8: PANAFRICAN NATIONALIST (Bold theme - Strong voice)
-- ============================================================================
UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#000000', theme_accent_color = '#006B3F' 
WHERE custom_domain IN ('jambojournal.org', 'sunugalenclair.org', 'voixdabidjan.com');

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#008751', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'naijapulse.org';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#078930', theme_accent_color = '#FCDD09' 
WHERE custom_domain = 'axumvoices.org';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#E03C31', theme_accent_color = '#000000' 
WHERE custom_domain = 'rainbow-report.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#FF7900', theme_accent_color = '#009E60' 
WHERE custom_domain IN ('laubedumali.com', 'le-journal-burkinabe.com');

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#009543', theme_accent_color = '#FCD116' 
WHERE custom_domain = 'voixducameroun.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#000000', theme_accent_color = '#EF7D00' 
WHERE custom_domain = 'hararechronicle.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#00A1DE', theme_accent_color = '#FAD201' 
WHERE custom_domain = 'intwarinews.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#CC092F', theme_accent_color = '#000000' 
WHERE custom_domain = 'voz-de-luanda.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#DE2010', theme_accent_color = '#009543' 
WHERE custom_domain = 'zed-nation.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#1EB53A', theme_accent_color = '#FCD116' 
WHERE custom_domain = 'tanzania-24.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#009543', theme_accent_color = '#FCD116' 
WHERE custom_domain = 'toutpourlapatrie.info';

-- CATEGORY 9: AFRICAN PROGRESSIVE (Modern theme)
-- ============================================================================
UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#FC3D32', theme_accent_color = '#007E3A' 
WHERE custom_domain = 'malagasytribune.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#EF3340', theme_accent_color = '#006B3F' 
WHERE custom_domain = 'ghanatomorrow.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#75AADB', theme_accent_color = '#000000' 
WHERE custom_domain = 'gaboronenow.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#009E60', theme_accent_color = '#FCD116' 
WHERE custom_domain = 'voixgabonaises.info';

-- CATEGORY 10: ASIAN TECH/MODERN (Modern theme - Digital focus)
-- ============================================================================
UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#0EA5E9', theme_accent_color = '#8B5CF6' 
WHERE custom_domain = 'cloudnation.news';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#DC2626', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'southeastasiainsight.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#A51931', theme_accent_color = '#F4F5F8' 
WHERE custom_domain = 'siam-rising.com';

-- CATEGORY 11: ASIAN TRADITIONAL (Classic theme - Heritage)
-- ============================================================================
UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#BC002D', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'kuninohikari.com';

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#C60C30', theme_accent_color = '#003478' 
WHERE custom_domain = 'hanbando-uimirae.com';

UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#DE2910', theme_accent_color = '#FFDE00' 
WHERE custom_domain IN ('hoifongsibou.com', 'voiceoftherejuvenation.com');

-- CATEGORY 12: ASIAN SPIRITUAL (Minimalist theme - Deep reading)
-- ============================================================================
UPDATE sites SET theme_layout = 'minimalist', theme_primary_color = '#FF9933', theme_accent_color = '#138808' 
WHERE custom_domain = 'ashokavoice.com';

UPDATE sites SET theme_layout = 'minimalist', theme_primary_color = '#01411C', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'nurnusantara.com';

UPDATE sites SET theme_layout = 'minimalist', theme_primary_color = '#006A4E', theme_accent_color = '#F42A41' 
WHERE custom_domain = 'muktirbarta.org';

UPDATE sites SET theme_layout = 'minimalist', theme_primary_color = '#01411C', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'pakssarzameen.org';

-- CATEGORY 13: ANGLO LIBERAL (Modern theme)
-- ============================================================================
UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#012169', theme_accent_color = '#C8102E' 
WHERE custom_domain = 'theliberalcurrent.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#B22234', theme_accent_color = '#3C3B6E' 
WHERE custom_domain = 'civicpulse.info';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#00008B', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'commonwealth-post.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#001489', theme_accent_color = '#CE1126' 
WHERE custom_domain = 'archipelagotimes.org';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#00247D', theme_accent_color = '#CC142B' 
WHERE custom_domain = 'newsealand.info';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#377E3F', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'suriname-vandaag.com';

UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#003893', theme_accent_color = '#F77F00' 
WHERE custom_domain = 'guyanaherald.com';

-- CATEGORY 14: ANGLO CONSERVATIVE (Classic theme)
-- ============================================================================
UPDATE sites SET theme_layout = 'classic', theme_primary_color = '#B22234', theme_accent_color = '#3C3B6E' 
WHERE custom_domain = 'fiftystates.news';

-- CATEGORY 15: MEDITERRANEAN IDENTITY (Magazine theme - Visual, passionate)
-- ============================================================================
UPDATE sites SET theme_layout = 'magazine', theme_primary_color = '#0D5EAF', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'acropolischronicle.com';

UPDATE sites SET theme_layout = 'magazine', theme_primary_color = '#002F6C', theme_accent_color = '#CE1126' 
WHERE custom_domain = 'isulanova.com';

UPDATE sites SET theme_layout = 'magazine', theme_primary_color = '#005EB8', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'enosistimes.com';

UPDATE sites SET theme_layout = 'magazine', theme_primary_color = '#171796', theme_accent_color = '#FF161D' 
WHERE custom_domain = 'vatrenosrce.com';

-- CATEGORY 16: SLAVIC NATIONALIST (Bold theme - Resistance)
-- ============================================================================
UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#005BBB', theme_accent_color = '#FFD500' 
WHERE custom_domain = 'dnieprlibre.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#FFFFFF', theme_accent_color = '#0039A6' 
WHERE custom_domain = 'russianway.info';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#C6363C', theme_accent_color = '#0C4076' 
WHERE custom_domain = 'vukovglas.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#00966E', theme_accent_color = '#FFD200' 
WHERE custom_domain = 'rodinanews.org';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#169B62', theme_accent_color = '#FF883E' 
WHERE custom_domain = 'dailnandaoine.com';

-- CATEGORY 17: SWISS ALPINE (Minimalist theme - Precision)
-- ============================================================================
UPDATE sites SET theme_layout = 'minimalist', theme_primary_color = '#FF0000', theme_accent_color = '#FFFFFF' 
WHERE custom_domain IN ('alpenzeit.info', 'tribunealpine.com');

-- CATEGORY 18: MIDDLE EAST RESISTANCE (Bold theme - Anti-regime)
-- ============================================================================
UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#239F40', theme_accent_color = '#DA0000' 
WHERE custom_domain = 'rooznameh.info';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#CE1126', theme_accent_color = '#007A3D' 
WHERE custom_domain = 'sawtbabylon.com';

-- CATEGORY 19: TRANSCAUCASIAN (Magazine theme - Heritage + Modernity)
-- ============================================================================
UPDATE sites SET theme_layout = 'magazine', theme_primary_color = '#D90012', theme_accent_color = '#0033A0' 
WHERE custom_domain = 'araratpress.com';

UPDATE sites SET theme_layout = 'magazine', theme_primary_color = '#0046AE', theme_accent_color = '#FFD100' 
WHERE custom_domain = 'obiectivmoldova.com';

UPDATE sites SET theme_layout = 'magazine', theme_primary_color = '#00AFCA', theme_accent_color = '#FEC50C' 
WHERE custom_domain = 'steppes.info';

-- CATEGORY 20: REVOLUTIONARY LEFT (Bold theme - Anti-capitalist)
-- ============================================================================
UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#CD212A', theme_accent_color = '#008C45' 
WHERE custom_domain = 'stracciorosso.com';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#E4002B', theme_accent_color = '#000000' 
WHERE custom_domain = 'radicalquill.uk';

UPDATE sites SET theme_layout = 'bold', theme_primary_color = '#AA151B', theme_accent_color = '#F1BF00' 
WHERE custom_domain = 'esp-ahora.com';

-- CATEGORY 21: FRENCH CANADIAN (Modern theme)
-- ============================================================================
UPDATE sites SET theme_layout = 'modern', theme_primary_color = '#0085CA', theme_accent_color = '#FFFFFF' 
WHERE custom_domain = 'quebectribune.news';

-- CATEGORY 22: SPECIAL CASES - Keep existing if custom, otherwise modernize
-- ============================================================================
-- Sites with unique colors already set (keep them)
-- Sites without colors get defaults based on region

-- ============================================================================
-- VERIFICATION QUERY
-- ============================================================================
-- SELECT 
--   id, name, custom_domain, theme_layout, 
--   theme_primary_color, theme_accent_color, 
--   country_iso2, ideology
-- FROM sites 
-- WHERE status = 'active'
-- ORDER BY theme_layout, name;

