/**
 * Create QStash Schedule using SDK
 */

import { Client } from "@upstash/qstash"

const QSTASH_TOKEN = process.env.QSTASH_TOKEN
if (!QSTASH_TOKEN) {
  console.error("❌ QSTASH_TOKEN env var is required")
  process.exit(1)
}

const APP_URL = process.env.NEXT_PUBLIC_APP_URL
if (!APP_URL) {
  console.error("❌ NEXT_PUBLIC_APP_URL env var is required")
  process.exit(1)
}

async function createSchedule() {
  console.log("⏰ Creating QStash Schedule with SDK\n")
  
  const client = new Client({ token: QSTASH_TOKEN })
  const destination = `${APP_URL}/api/cron/autonomous-scheduler`
  
  try {
    const schedules = await client.schedules.list()
    console.log(`Found ${schedules.length} existing schedule(s)`)
    
    for (const schedule of schedules) {
      if (schedule.destination?.includes('autonomous-scheduler')) {
        console.log(`Deleting old schedule: ${schedule.scheduleId}`)
        await client.schedules.delete(schedule.scheduleId)
      }
    }
    
    console.log("\n✅ Creating new schedule...\n")
    
    const result = await client.schedules.create({
      destination,
      cron: "0 * * * *",
    })
    
    console.log("✅ Schedule created!")
    console.log(`   Schedule ID: ${result.scheduleId}`)
    console.log(`   Cron: 0 * * * * (every hour)`)
    console.log(`   Destination: ${destination}`)
    console.log("\n🎉 Autonomous system is now fully operational!\n")
    
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

createSchedule()
