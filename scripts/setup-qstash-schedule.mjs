/**
 * Setup QStash Schedule for Autonomous Publications
 * 
 * Creates an hourly schedule using QStash REST API
 */

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

async function setupSchedule() {
  console.log("⏰ Setting up QStash Schedule for Autonomous Publications...\n")
  
  const destinationUrl = `${APP_URL}/api/cron/autonomous-scheduler`
  
  console.log("🔧 Configuration:")
  console.log(`   QStash Token: ${QSTASH_TOKEN.substring(0, 20)}...`)
  console.log(`   App URL: ${APP_URL}`)
  console.log(`   Schedule: 0 * * * * (every hour at minute 0)`)
  console.log(`   Endpoint: ${destinationUrl}\n`)

  try {
    const qstashApiUrl = "https://qstash.upstash.io/v2/schedules"
    
    const scheduleConfig = {
      destination: destinationUrl,
      cron: "0 * * * *",
    }

    console.log("📡 Creating schedule via QStash API...\n")

    const response = await fetch(qstashApiUrl, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${QSTASH_TOKEN}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(scheduleConfig)
    })

    const responseText = await response.text()

    if (!response.ok) {
      throw new Error(`QStash API error (${response.status}): ${responseText}`)
    }

    const result = JSON.parse(responseText)

    console.log("✅ Schedule created successfully!\n")
    console.log("📋 Schedule Details:")
    console.log(`   Schedule ID: ${result.scheduleId}`)
    console.log(`   Cron: ${result.cron}`)
    console.log(`   Destination: ${result.destination}`)
    console.log(`   Created: ${result.createdAt || new Date().toISOString()}`)

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("✅ QSTASH SCHEDULE SETUP COMPLETE!")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")

    console.log("\n🧪 Next steps:")
    console.log("   1. Go to /dashboard/autonomous-media")
    console.log("   2. Configure media sites (select hours, toggle enable)")
    console.log("   3. Wait for next hour to see first publication")

    console.log("\n🔍 Monitor:")
    console.log(`   QStash Dashboard: https://console.upstash.com/qstash`)
    console.log(`   Schedule ID: ${result.scheduleId}`)
    console.log(`   Test endpoint: curl ${destinationUrl}\n`)

  } catch (error) {
    console.error("\n❌ Failed to create QStash schedule:", error.message)
    console.error("\n💡 Manual setup fallback:")
    console.error("   1. Go to https://console.upstash.com/qstash")
    console.error("   2. Schedules → Create Schedule")
    console.error(`   3. Cron: 0 * * * *`)
    console.error(`   4. URL: ${destinationUrl}`)
    console.error("   5. Method: POST\n")
    process.exit(1)
  }
}

setupSchedule()
