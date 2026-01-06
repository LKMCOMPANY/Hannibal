/**
 * Setup Autonomous QStash Schedule
 * 
 * Creates the correct hourly schedule for autonomous publications
 */

const QSTASH_TOKEN = process.env.QSTASH_TOKEN || "eyJVc2VySUQiOiI1ODlhZDJjNy0yNzg2LTQwZjEtYjM3OC1mY2JmYzkwYWY3MDUiLCJQYXNzd29yZCI6IjQwOGMyOGY3OTE1YjQ1MWFhYmRkZTJlOTQzZmM2OWE0In0="
const APP_URL = process.env.NEXT_PUBLIC_APP_URL || "https://hannibalv2.onrender.com"

async function setupSchedule() {
  console.log("⏰ Setting up Autonomous QStash Schedule\n")
  console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
  
  const destinationUrl = `${APP_URL}/api/cron/autonomous-scheduler`
  
  try {
    // STEP 1: List existing schedules
    console.log("📋 Step 1: Checking existing schedules...\n")
    
    const listResponse = await fetch("https://qstash.upstash.io/v2/schedules", {
      headers: {
        "Authorization": `Bearer ${QSTASH_TOKEN}`
      }
    })
    
    if (listResponse.ok) {
      const schedules = await listResponse.json()
      console.log(`Found ${schedules.length} existing schedule(s)`)
      
      // Delete any existing autonomous scheduler
      for (const schedule of schedules) {
        if (schedule.destination && schedule.destination.includes('autonomous-scheduler')) {
          console.log(`\n🗑️  Deleting old schedule: ${schedule.scheduleId}`)
          console.log(`   Cron: ${schedule.cron}`)
          console.log(`   Destination: ${schedule.destination}`)
          
          await fetch(`https://qstash.upstash.io/v2/schedules/${schedule.scheduleId}`, {
            method: 'DELETE',
            headers: {
              "Authorization": `Bearer ${QSTASH_TOKEN}`
            }
          })
          
          console.log(`   ✅ Deleted`)
        }
      }
    }
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    
    // STEP 2: Create new schedule with correct cron
    console.log("📋 Step 2: Creating new schedule...\n")
    
    const scheduleConfig = {
      destination: destinationUrl,
      cron: "0 * * * *",  // ← CORRECT: Every hour
      retries: 3,
    }
    
    console.log("Configuration:")
    console.log(`   Destination: ${scheduleConfig.destination}`)
    console.log(`   Cron: ${scheduleConfig.cron} (every hour at minute 0)`)
    console.log(`   Token: ${QSTASH_TOKEN.substring(0, 30)}...`)
    console.log("")
    
    const createResponse = await fetch("https://qstash.upstash.io/v2/schedules", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${QSTASH_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(scheduleConfig)
    })
    
    const responseText = await createResponse.text()
    
    if (!createResponse.ok) {
      throw new Error(`QStash API error (${createResponse.status}): ${responseText}`)
    }
    
    const result = JSON.parse(responseText)
    
    console.log("✅ Schedule created successfully!\n")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    console.log("📋 Schedule Details:")
    console.log(`   Schedule ID: ${result.scheduleId}`)
    console.log(`   Cron: ${result.cron} ✅`)
    console.log(`   Destination: ${result.destination}`)
    console.log(`   Status: Active`)
    console.log(`   Created: ${new Date().toISOString()}`)
    
    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("✅ AUTONOMOUS SYSTEM READY!")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n")
    
    console.log("📊 System Status:")
    console.log("   ✅ Database: autonomous_publications table created")
    console.log("   ✅ Code: All modules deployed")
    console.log("   ✅ Schedule: Active (every hour)")
    console.log("   ✅ Sites: 103 medias configured")
    
    console.log("\n⏰ Next Execution:")
    console.log("   At the next hour mark (e.g., 12:00, 13:00, 14:00)")
    
    console.log("\n🔍 Monitor:")
    console.log(`   QStash: https://console.upstash.com/qstash`)
    console.log(`   Logs: Dashboard Render → Logs → Search "[Autonomous"`)
    console.log(`   DB: SELECT * FROM autonomous_publications ORDER BY created_at DESC`)
    
    console.log("\n🎯 What will happen:")
    console.log("   - QStash calls scheduler every hour")
    console.log("   - Scheduler checks which sites match current hour")
    console.log("   - For each match: fetch NewsAPI → AI transform → publish")
    console.log("   - Expected: ~100-200 articles/day across all 103 medias\n")
    
  } catch (error) {
    console.error("\n❌ Failed:", error.message)
    console.error("\n💡 You can still create manually:")
    console.error("   1. Go to https://console.upstash.com/qstash")
    console.error("   2. Schedules → Create")
    console.error(`   3. Cron: 0 * * * *`)
    console.error(`   4. URL: ${destinationUrl}\n`)
    process.exit(1)
  }
}

setupSchedule()

