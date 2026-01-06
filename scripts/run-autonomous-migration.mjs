/**
 * Run Autonomous Publications Migration
 * 
 * Executes the SQL migration to create autonomous_publications table
 * Uses .mjs for native ESM support
 */

import { neon } from "@neondatabase/serverless"
import { readFileSync } from "fs"
import { join, dirname } from "path"
import { fileURLToPath } from "url"

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

async function runMigration() {
  console.log("🚀 Running Autonomous Publications Migration...\n")
  
  // Check environment
  if (!process.env.DATABASE_URL) {
    console.error("❌ DATABASE_URL not found in environment")
    console.error("💡 Make sure .env file exists with DATABASE_URL")
    process.exit(1)
  }

  const sql = neon(process.env.DATABASE_URL)

  try {
    // Read migration file
    const migrationPath = join(__dirname, "003-create-autonomous-publications-table.sql")
    const migrationSQL = readFileSync(migrationPath, "utf-8")

    console.log("📄 Migration file loaded:", migrationPath)
    console.log("📊 Executing SQL migration...\n")

    // Execute the entire migration as one statement
    await sql.unsafe(migrationSQL)

    console.log("\n✅ Migration executed successfully!\n")

    // Verify table was created
    console.log("🔍 Verifying table creation...\n")
    
    const verification = await sql`
      SELECT table_name, column_name, data_type 
      FROM information_schema.columns 
      WHERE table_name = 'autonomous_publications'
      ORDER BY ordinal_position
    `

    if (verification.length > 0) {
      console.log("✅ Table autonomous_publications created with columns:")
      verification.forEach((col) => {
        console.log(`   - ${col.column_name} (${col.data_type})`)
      })
    } else {
      console.error("⚠️  Table not found - migration may have failed")
    }

    // Check indexes
    const indexes = await sql`
      SELECT indexname 
      FROM pg_indexes 
      WHERE tablename = 'autonomous_publications'
    `

    console.log(`\n✅ Created ${indexes.length} indexes:`)
    indexes.forEach((idx) => {
      console.log(`   - ${idx.indexname}`)
    })

    console.log("\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("✅ MIGRATION COMPLETED SUCCESSFULLY!")
    console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━")
    console.log("\n📝 Next steps:")
    console.log("   1. ✅ Database migration done")
    console.log("   2. ⏰ Run: node scripts/setup-qstash-schedule.mjs")
    console.log("   3. 🧪 Test autonomous system\n")

  } catch (error) {
    console.error("\n❌ Migration failed:", error)
    process.exit(1)
  }
}

runMigration()

