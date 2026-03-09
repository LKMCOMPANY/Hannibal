#!/usr/bin/env tsx
/**
 * Script d'automatisation - Sync DNS Cloudflare
 * 
 * Ce script configure automatiquement les CNAME records dans Cloudflare
 * pour tous les domaines custom de votre database Neon
 * 
 * Usage:
 *   pnpm tsx scripts/sync-dns-cloudflare.ts
 *   
 * Options:
 *   --dry-run    Affiche les changements sans les appliquer
 *   --force      Met à jour même si le record existe déjà
 */

// Load environment variables
import { config } from "dotenv"
config()

import { neon } from "@neondatabase/serverless"

// Configuration
const DATABASE_URL = process.env.DATABASE_URL
const CLOUDFLARE_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN
const CNAME_TARGET = process.env.CNAME_TARGET || "cname.vercel-dns.com"

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL non défini dans .env")
  process.exit(1)
}

if (!CLOUDFLARE_API_TOKEN) {
  console.error("❌ CLOUDFLARE_API_TOKEN non défini dans .env")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

// Types
type Site = {
  id: number
  name: string
  custom_domain: string
}

type CloudflareZone = {
  id: string
  name: string
}

type CloudflareDNSRecord = {
  id: string
  type: string
  name: string
  content: string
  proxied: boolean
}

/**
 * Récupère tous les domaines custom depuis la database
 */
async function getDomainsFromDatabase(): Promise<Site[]> {
  const sites = await sql`
    SELECT id, name, custom_domain
    FROM sites
    WHERE custom_domain IS NOT NULL
    AND custom_domain != ''
    AND status = 'active'
    ORDER BY id ASC
  `
  
  return sites as Site[]
}

/**
 * Extrait le domaine racine (zone) d'un domaine complet
 * Ex: www.italia-24.com → italia-24.com
 *     admin.example.org → example.org
 */
function extractRootDomain(domain: string): string {
  const parts = domain.split('.')
  
  // Gère les TLDs avec 2 parties (ex: .co.uk, .com.br)
  if (parts.length >= 3 && ['co', 'com', 'gov', 'org', 'ac'].includes(parts[parts.length - 2])) {
    return parts.slice(-3).join('.')
  }
  
  // TLD standard
  return parts.slice(-2).join('.')
}

/**
 * Récupère toutes les zones Cloudflare accessibles
 */
async function getCloudflareZones(): Promise<Map<string, CloudflareZone>> {
  const zones = new Map<string, CloudflareZone>()
  
  let page = 1
  let hasMore = true
  
  while (hasMore) {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones?page=${page}&per_page=50`,
      {
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`Cloudflare API Error: ${response.statusText}`)
    }
    
    const data = await response.json() as any
    
    if (!data.success) {
      throw new Error(`Cloudflare API Error: ${JSON.stringify(data.errors)}`)
    }
    
    data.result.forEach((zone: CloudflareZone) => {
      zones.set(zone.name, zone)
    })
    
    hasMore = data.result.length === 50
    page++
  }
  
  return zones
}

/**
 * Récupère TOUS les DNS records pour une zone (A, AAAA, CNAME)
 */
async function getDNSRecords(zoneId: string): Promise<CloudflareDNSRecord[]> {
  const response = await fetch(
    `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records?per_page=500`,
    {
      headers: {
        "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
        "Content-Type": "application/json",
      },
    }
  )
  
  if (!response.ok) {
    return []
  }
  
  const data = await response.json() as any
  return data.success ? data.result : []
}

/**
 * Supprime un DNS record
 */
async function deleteDNSRecord(zoneId: string, recordId: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`,
      {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
        },
      }
    )
    
    const data = await response.json() as any
    return data.success
  } catch (error) {
    return false
  }
}

/**
 * Crée un CNAME record dans Cloudflare
 */
async function createCNAMERecord(
  zoneId: string,
  name: string,
  content: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          type: "CNAME",
          name: name,
          content: content,
          ttl: 1, // Auto
          proxied: false, // DNS only (important pour Vercel SSL)
        }),
      }
    )
    
    const data = await response.json() as any
    
    if (!data.success) {
      console.error(`      ❌ Erreur: ${JSON.stringify(data.errors)}`)
      return false
    }
    
    return true
  } catch (error) {
    console.error(`      ❌ Exception: ${error}`)
    return false
  }
}

/**
 * Met à jour un CNAME record existant
 */
async function updateCNAMERecord(
  zoneId: string,
  recordId: string,
  content: string
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.cloudflare.com/client/v4/zones/${zoneId}/dns_records/${recordId}`,
      {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${CLOUDFLARE_API_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          proxied: false,
        }),
      }
    )
    
    const data = await response.json() as any
    return data.success
  } catch (error) {
    return false
  }
}

/**
 * Script principal
 */
async function main() {
  const args = process.argv.slice(2)
  const isDryRun = args.includes("--dry-run")
  const isForce = args.includes("--force")
  
  console.log("🌐 Synchronisation DNS Cloudflare → Vercel\n")
  console.log("━".repeat(70))
  
  // 1. Récupérer les domaines depuis la database
  console.log("\n📊 Récupération des domaines depuis Neon...\n")
  const sites = await getDomainsFromDatabase()
  
  console.log(`✅ ${sites.length} domaine(s) trouvé(s)\n`)
  
  // 2. Récupérer les zones Cloudflare
  console.log("☁️  Récupération des zones Cloudflare...\n")
  const zones = await getCloudflareZones()
  
  console.log(`✅ ${zones.size} zone(s) Cloudflare accessible(s):\n`)
  Array.from(zones.values()).forEach((zone, index) => {
    console.log(`   ${index + 1}. ${zone.name}`)
  })
  
  console.log("\n" + "━".repeat(70) + "\n")
  
  // 3. Grouper les domaines par zone
  const domainsByZone = new Map<string, string[]>()
  const domainsWithoutZone: string[] = []
  
  sites.forEach(site => {
    const domain = site.custom_domain
    const rootDomain = extractRootDomain(domain)
    
    if (zones.has(rootDomain)) {
      if (!domainsByZone.has(rootDomain)) {
        domainsByZone.set(rootDomain, [])
      }
      domainsByZone.get(rootDomain)!.push(domain)
    } else {
      domainsWithoutZone.push(domain)
    }
  })
  
  console.log("📋 Analyse des domaines:\n")
  console.log(`   ✅ Domaines avec zone Cloudflare : ${sites.length - domainsWithoutZone.length}`)
  console.log(`   ⚠️  Domaines sans zone Cloudflare : ${domainsWithoutZone.length}`)
  
  if (domainsWithoutZone.length > 0) {
    console.log("\n⚠️  Domaines sans zone Cloudflare (ignorés):")
    domainsWithoutZone.forEach((d, i) => {
      if (i < 10) console.log(`   - ${d}`)
    })
    if (domainsWithoutZone.length > 10) {
      console.log(`   ... et ${domainsWithoutZone.length - 10} autres`)
    }
  }
  
  console.log("\n" + "━".repeat(70) + "\n")
  
  if (isDryRun) {
    console.log("🔍 Mode DRY-RUN - Simulation uniquement\n")
    console.log("Configuration qui serait appliquée:\n")
    
    domainsByZone.forEach((domains, zoneName) => {
      console.log(`\n📦 Zone: ${zoneName}`)
      domains.forEach(domain => {
        const subdomain = domain === zoneName ? "@" : domain.replace(`.${zoneName}`, '')
        console.log(`   → CNAME ${subdomain} → ${CNAME_TARGET}`)
      })
    })
    
    console.log("\n💡 Exécutez sans --dry-run pour appliquer les changements")
    return
  }
  
  // 4. Configurer les DNS pour chaque zone
  let totalCreated = 0
  let totalUpdated = 0
  let totalSkipped = 0
  let totalErrors = 0
  
  for (const [zoneName, domains] of domainsByZone) {
    const zone = zones.get(zoneName)!
    console.log(`\n📦 Zone: ${zoneName} (${domains.length} domaine(s))`)
    
    // Récupérer les records existants
    const existingRecords = await getDNSRecords(zone.id)
    const existingRecordMap = new Map(
      existingRecords.map(r => [r.name, r])
    )
    
    for (const domain of domains) {
      const subdomain = domain === zoneName ? "@" : domain.replace(`.${zoneName}`, '')
      const fullName = domain
      
      console.log(`\n   📌 ${domain}`)
      
      // Récupérer TOUS les records pour ce nom (peut y avoir A + AAAA + TXT etc.)
      const allRecordsForName = existingRecords.filter(r => r.name === fullName)
      
      // Chercher le record principal (A, AAAA, ou CNAME)
      const existingMain = allRecordsForName.find(r => 
        r.type === "A" || r.type === "AAAA" || r.type === "CNAME"
      )
      
      // Si CNAME existe déjà vers Render, skip
      if (existingMain && existingMain.type === "CNAME" && existingMain.content === CNAME_TARGET && !isForce) {
        console.log(`      ✓ CNAME existe déjà et pointe vers Vercel (skip)`)
        totalSkipped++
        continue
      }
      
      // Si CNAME existe mais pointe ailleurs
      if (existingMain && existingMain.type === "CNAME" && existingMain.content !== CNAME_TARGET) {
        console.log(`      ⚠️  CNAME existe mais pointe vers: ${existingMain.content}`)
        console.log(`      🔄 Mise à jour vers: ${CNAME_TARGET}`)

        const success = await updateCNAMERecord(zone.id, existingMain.id, CNAME_TARGET)
        if (success) {
          console.log(`      ✅ CNAME mis à jour !`)
          totalUpdated++
        } else {
          console.log(`      ❌ Échec de la mise à jour`)
          totalErrors++
        }
      } else if (existingMain && existingMain.type !== "CNAME") {
        // Record A ou AAAA existe - le supprimer et créer CNAME
        console.log(`      ⚠️  Record ${existingMain.type} existe (${existingMain.content})`)
        console.log(`      🗑️  Suppression UNIQUEMENT du ${existingMain.type} record (préserve MX/TXT)...`)
        
        const deleted = await deleteDNSRecord(zone.id, existingMain.id)
        if (!deleted) {
          console.log(`      ❌ Échec de la suppression`)
          totalErrors++
          continue
        }
        
        console.log(`      ✅ ${existingMain.type} record supprimé`)
        console.log(`      ➕ Création CNAME: ${subdomain} → ${CNAME_TARGET}`)

        await new Promise(resolve => setTimeout(resolve, 1000))

        const success = await createCNAMERecord(zone.id, subdomain, CNAME_TARGET)
        if (success) {
          console.log(`      ✅ CNAME créé !`)
          totalCreated++
        } else {
          console.log(`      ❌ Échec de la création`)
          totalErrors++
        }
      } else if (!existingMain) {
        console.log(`      ➕ Création CNAME: ${subdomain} → ${CNAME_TARGET}`)

        const success = await createCNAMERecord(zone.id, subdomain, CNAME_TARGET)
        if (success) {
          console.log(`      ✅ CNAME créé !`)
          totalCreated++
        } else {
          console.log(`      ❌ Échec de la création`)
          totalErrors++
        }
      }
      
      // Pause pour respecter rate limits Cloudflare (1200 req/5min = ~1 req/250ms)
      await new Promise(resolve => setTimeout(resolve, 500))
    }
  }
  
  // 5. Résumé final
  console.log("\n" + "━".repeat(70))
  console.log("\n📊 RÉSUMÉ DNS CLOUDFLARE\n")
  console.log(`   Total domaines traités    : ${sites.length}`)
  console.log(`   Domaines sans zone CF     : ${domainsWithoutZone.length}`)
  console.log(`   CNAME créés               : ${totalCreated}`)
  console.log(`   CNAME mis à jour          : ${totalUpdated}`)
  console.log(`   CNAME déjà configurés     : ${totalSkipped}`)
  console.log(`   Erreurs                   : ${totalErrors}`)
  console.log("\n" + "━".repeat(70))
  
  if (totalCreated + totalUpdated > 0) {
    console.log("\n✅ Configuration DNS Cloudflare terminée !")
    console.log("\n📝 Prochaines étapes:")
    console.log("   1. Attendre propagation DNS (~5-30 minutes)")
    console.log("   2. Ajouter les domaines dans Vercel (Settings → Domains)")
    console.log("   3. Vérifier chaque domaine dans Vercel Dashboard")
    console.log("\n💡 Tip: Utilisez https://dnschecker.org pour vérifier la propagation")
  }
}

// Exécution
main().catch((error) => {
  console.error("\n❌ Erreur fatale:", error)
  process.exit(1)
})

