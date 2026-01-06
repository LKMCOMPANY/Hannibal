/**
 * Create QStash Schedule using SDK
 */

import { Client } from "@upstash/qstash"

const QSTASH_TOKEN = "eyJVc2VySUQiOiI1ODlhZDJjNy0yNzg2LTQwZjEtYjM3OC1mY2JmYzkwYWY3MDUiLCJQYXNzd29yZCI6IjQwOGMyOGY3OTE1YjQ1MWFhYmRkZTJlOTQzZmM2OWE0In0="

async function createSchedule() {
  console.log("⏰ Creating QStash Schedule with SDK\n")
  
  const client = new Client({ token: QSTASH_TOKEN })
  
  try {
    // List existing schedules
    const schedules = await client.schedules.list()
    console.log(`Found ${schedules.length} existing schedule(s)`)
    
    // Delete autonomous schedules
    for (const schedule of schedules) {
      if (schedule.destination?.includes('autonomous-scheduler')) {
        console.log(`Deleting old schedule: ${schedule.scheduleId}`)
        await client.schedules.delete(schedule.scheduleId)
      }
    }
    
    console.log("\n✅ Creating new schedule...\n")
    
    // Create new schedule
    const result = await client.schedules.create({
      destination: "https://hannibalv2.onrender.com/api/cron/autonomous-scheduler",
      cron: "0 * * * *",  // Every hour
    })
    
    console.log("✅ Schedule created!")
    console.log(`   Schedule ID: ${result.scheduleId}`)
    console.log(`   Cron: 0 * * * * (every hour)`)
    console.log(`   Destination: https://hannibalv2.onrender.com/api/cron/autonomous-scheduler`)
    console.log("\n🎉 Autonomous system is now fully operational!\n")
    
  } catch (error) {
    console.error("❌ Error:", error.message)
    process.exit(1)
  }
}

createSchedule()

