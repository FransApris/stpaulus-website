import mysql from 'mysql2/promise'

const config = {
  host: 'localhost',
  port: 3306,
  user: 'new_cms_user',
  password: 'secure_app_password_2025',
  database: 'stpaulus_cms_db'
}

async function migrateAllowedCategories() {
  const connection = await mysql.createConnection(config)
  
  try {
    const [rooms] = await connection.execute('SELECT id, name, allowed_categories FROM rooms')
    
    console.log(`Found ${rooms.length} rooms to check\n`)
    
    let updated = 0
    let skipped = 0
    
    for (const room of rooms) {
      let allowedCategoriesStr = room.allowed_categories
      
      // Skip NULL values
      if (!allowedCategoriesStr || allowedCategoriesStr === 'null') {
        console.log(`⏭️  Room ${room.id} (${room.name}) - no allowed_categories, skipping`)
        skipped++
        continue
      }
      
      // Handle Buffer type
      if (Buffer.isBuffer(allowedCategoriesStr)) {
        allowedCategoriesStr = allowedCategoriesStr.toString('utf8')
      }
      
      // Convert to string if needed
      allowedCategoriesStr = String(allowedCategoriesStr || '')
      
      // Try to parse as JSON
      let categories = []
      let needsUpdate = false
      
      try {
        const parsed = JSON.parse(allowedCategoriesStr)
        if (Array.isArray(parsed)) {
          console.log(`✅ Room ${room.id} (${room.name}) - already JSON array`)
          skipped++
          continue
        } else {
          categories = [String(parsed)]
          needsUpdate = true
        }
      } catch (e) {
        // Not JSON, treat as comma-separated or single value
        if (allowedCategoriesStr.includes(',')) {
          categories = allowedCategoriesStr.split(',').map(c => c.trim())
        } else {
          categories = [allowedCategoriesStr]
        }
        needsUpdate = true
      }
      
      if (needsUpdate) {
        const jsonCategories = JSON.stringify(categories)
        await connection.execute(
          'UPDATE rooms SET allowed_categories = ? WHERE id = ?',
          [jsonCategories, room.id]
        )
        console.log(`🔄 Room ${room.id} (${room.name}): "${allowedCategoriesStr}" → ${jsonCategories}`)
        updated++
      }
    }
    
    console.log(`\n✅ Migration complete! Updated: ${updated}, Skipped: ${skipped}`)
    
  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await connection.end()
  }
}

migrateAllowedCategories()
