#!/usr/bin/env tsx
/**
 * Script Helper - Récupérer l'ID du service Render
 * 
 * Ce script vous aide à trouver l'ID de votre service Render
 * nécessaire pour ajouter des custom domains
 * 
 * Usage:
 *   pnpm tsx scripts/get-render-service-id.ts
 */

// Load environment variables
import { config } from "dotenv"
config()

const RENDER_API_KEY = process.env.RENDER_API_KEY

if (!RENDER_API_KEY) {
  console.error("❌ RENDER_API_KEY non défini dans .env")
  process.exit(1)
}

async function getServices() {
  try {
    console.log("🔍 Récupération de vos services Render...\n")
    
    const response = await fetch(
      "https://api.render.com/v1/services?limit=20",
      {
        headers: {
          "Authorization": `Bearer ${RENDER_API_KEY}`,
          "Accept": "application/json",
        },
      }
    )
    
    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }
    
    const data = await response.json() as any
    const services = data[0]?.service || data
    
    if (!Array.isArray(services) || services.length === 0) {
      console.log("⚠️  Aucun service trouvé")
      return
    }
    
    console.log(`✅ ${services.length} service(s) trouvé(s):\n`)
    console.log("━".repeat(80))
    
    services.forEach((service: any, index: number) => {
      console.log(`\n${index + 1}. ${service.name}`)
      console.log(`   ID       : ${service.id}`)
      console.log(`   Type     : ${service.type}`)
      console.log(`   Repo     : ${service.repo || 'N/A'}`)
      console.log(`   URL      : ${service.serviceDetails?.url || 'N/A'}`)
    })
    
    console.log("\n" + "━".repeat(80))
    console.log("\n💡 Copiez l'ID du service 'hannibalv2' (ou similaire)")
    console.log("   et ajoutez-le dans votre .env:")
    console.log("\n   RENDER_SERVICE_ID=srv-xxxxxxxxxxxxx")
    
  } catch (error) {
    console.error("❌ Erreur:", error)
    process.exit(1)
  }
}

getServices()

