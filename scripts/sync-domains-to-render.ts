#!/usr/bin/env tsx
/**
 * Script d'automatisation - Sync Domains to Render
 * 
 * Ce script récupère tous les domaines custom depuis la table sites
 * et les ajoute automatiquement comme Custom Domains dans Render
 * 
 * Usage:
 *   pnpm tsx scripts/sync-domains-to-render.ts
 *   
 * Options:
 *   --dry-run    Affiche les domaines sans les ajouter
 *   --force      Ajoute même si le domaine existe déjà
 */

// Load environment variables
import { config } from "dotenv"
config()

import { neon } from "@neondatabase/serverless"

// Configuration
const DATABASE_URL = process.env.DATABASE_URL
const RENDER_API_KEY = process.env.RENDER_API_KEY
const RENDER_SERVICE_ID = process.env.RENDER_SERVICE_ID || "srv-xxxxx" // À définir

if (!DATABASE_URL) {
  console.error("❌ DATABASE_URL non défini dans .env")
  process.exit(1)
}

if (!RENDER_API_KEY) {
  console.error("❌ RENDER_API_KEY non défini dans .env")
  process.exit(1)
}

const sql = neon(DATABASE_URL)

// Types
type Site = {
  id: number
  name: string
  custom_domain: string | null
  status: string
}

type RenderDomain = {
  id: string
  name: string
  verified: boolean
  createdAt: string
}

/**
 * Récupère tous les domaines custom depuis la database
 */
async function getDomainsFromDatabase(): Promise<Site[]> {
  console.log("📊 Récupération des domaines depuis Neon Database...\n")
  
  const sites = await sql`
    SELECT id, name, custom_domain, status
    FROM sites
    WHERE custom_domain IS NOT NULL
    AND custom_domain != ''
    AND status = 'active'
    ORDER BY id ASC
  `
  
  return sites as Site[]
}

/**
 * Récupère les domaines existants dans Render
 */
async function getRenderDomains(): Promise<RenderDomain[]> {
  const response = await fetch(
    `https://api.render.com/v1/services/${RENDER_SERVICE_ID}/custom-domains`,
    {
      headers: {
        "Authorization": `Bearer ${RENDER_API_KEY}`,
        "Accept": "application/json",
      },
    }
  )
  
  if (!response.ok) {
    throw new Error(`Render API Error: ${response.statusText}`)
  }
  
  const data = await response.json()
  return data as RenderDomain[]
}

/**
 * Ajoute un domaine custom dans Render
 */
async function addDomainToRender(domain: string): Promise<boolean> {
  try {
    const response = await fetch(
      `https://api.render.com/v1/services/${RENDER_SERVICE_ID}/custom-domains`,
      {
        method: "POST",
        headers: {
          "Authorization": `Bearer ${RENDER_API_KEY}`,
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify({ name: domain }),
      }
    )
    
    if (!response.ok) {
      const error = await response.text()
      console.error(`   ❌ Erreur API: ${error}`)
      return false
    }
    
    return true
  } catch (error) {
    console.error(`   ❌ Erreur: ${error}`)
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
  
  console.log("🚀 Synchronisation des domaines vers Render\n")
  console.log("━".repeat(60))
  
  // 1. Récupérer les domaines depuis la database
  const sites = await getDomainsFromDatabase()
  
  if (sites.length === 0) {
    console.log("ℹ️  Aucun domaine trouvé dans la database")
    return
  }
  
  console.log(`✅ ${sites.length} domaine(s) trouvé(s) dans la database:\n`)
  sites.forEach((site, index) => {
    console.log(`   ${index + 1}. ${site.custom_domain} (${site.name})`)
  })
  console.log("\n" + "━".repeat(60) + "\n")
  
  // 2. Récupérer les domaines existants dans Render
  console.log("📡 Récupération des domaines existants dans Render...\n")
  
  let existingDomains: RenderDomain[] = []
  try {
    existingDomains = await getRenderDomains()
    console.log(`✅ ${existingDomains.length} domaine(s) déjà dans Render:\n`)
    existingDomains.forEach((domain, index) => {
      const status = domain.verified ? "✓ Vérifié" : "⏳ En attente"
      console.log(`   ${index + 1}. ${domain.name} ${status}`)
    })
  } catch (error) {
    console.error(`⚠️  Impossible de récupérer les domaines existants: ${error}`)
    console.log("   → Continuer quand même...\n")
  }
  
  console.log("\n" + "━".repeat(60) + "\n")
  
  // 3. Ajouter les domaines manquants
  const existingDomainNames = new Set(existingDomains.map(d => d.name))
  const domainsToAdd = sites.filter(site => 
    !existingDomainNames.has(site.custom_domain!) || isForce
  )
  
  if (domainsToAdd.length === 0) {
    console.log("✅ Tous les domaines sont déjà dans Render !")
    return
  }
  
  console.log(`📝 ${domainsToAdd.length} domaine(s) à ajouter:\n`)
  
  if (isDryRun) {
    console.log("🔍 Mode DRY-RUN (simulation uniquement)\n")
    domainsToAdd.forEach((site, index) => {
      console.log(`   ${index + 1}. ${site.custom_domain}`)
    })
    console.log("\n💡 Exécutez sans --dry-run pour ajouter les domaines")
    return
  }
  
  // 4. Ajouter chaque domaine
  let successCount = 0
  let errorCount = 0
  
  for (const site of domainsToAdd) {
    const domain = site.custom_domain!
    console.log(`\n📌 Ajout de ${domain}...`)
    
    const success = await addDomainToRender(domain)
    
    if (success) {
      console.log(`   ✅ Domaine ajouté avec succès !`)
      successCount++
    } else {
      console.log(`   ❌ Échec de l'ajout`)
      errorCount++
    }
    
    // Pause entre chaque requête pour respecter rate limits Render API
    // 103 domaines × 3s = ~5 minutes total
    console.log(`   ⏳ Pause 3s (rate limit protection)...`)
    await new Promise(resolve => setTimeout(resolve, 3000))
  }
  
  // 5. Résumé final
  console.log("\n" + "━".repeat(60))
  console.log("\n📊 RÉSUMÉ\n")
  console.log(`   Total domaines database  : ${sites.length}`)
  console.log(`   Déjà dans Render         : ${existingDomains.length}`)
  console.log(`   Ajoutés avec succès      : ${successCount}`)
  console.log(`   Erreurs                  : ${errorCount}`)
  console.log("\n" + "━".repeat(60))
  
  if (successCount > 0) {
    console.log("\n✅ Synchronisation terminée !")
    console.log("\n📝 Prochaines étapes:")
    console.log("   1. Aller dans Render Dashboard → Custom Domains")
    console.log("   2. Cliquer 'Verify' pour chaque domaine")
    console.log("   3. Configurer le DNS chez Cloudflare si pas déjà fait")
  }
}

// Exécution
main().catch((error) => {
  console.error("\n❌ Erreur fatale:", error)
  process.exit(1)
})

