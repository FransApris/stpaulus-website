import mysql from 'mysql2/promise'

async function migrateFacilities() {
  const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'new_cms_user',
    password: process.env.MYSQL_PASSWORD || 'secure_app_password_2025',
    database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
  })

  try {
    console.log('🔍 Starting facilities format migration...\n')
    
    const [rooms] = await connection.execute('SELECT id, name, facilities FROM rooms')
    
    console.log(`Found ${rooms.length} rooms to check\n`)
    
    let updated = 0
    let skipped = 0
    
    for (const room of rooms) {
      // Convert Buffer to string if needed
      let facilitiesStr = room.facilities
      if (Buffer.isBuffer(facilitiesStr)) {
        facilitiesStr = facilitiesStr.toString('utf8')
      }
      
      // Check if empty or null
      if (!facilitiesStr || facilitiesStr === 'null' || facilitiesStr === '') {
        console.log(`⏭️  Room ${room.id} (${room.name}) - no facilities, skipping`)
        skipped++
        continue
      }
      
      let facilities
      let needsUpdate = false
      
      try {
        // Try parse as JSON
        facilities = JSON.parse(facilitiesStr)
        
        if (!Array.isArray(facilities)) {
          // If it's an object or other type, wrap in array
          facilities = [facilitiesStr]
          needsUpdate = true
        } else {
          // Already valid JSON array
          console.log(`✅ Room ${room.id} (${room.name}) - already valid JSON array`)
          skipped++
          continue
        }
      } catch (e) {
        // Not valid JSON - plain text
        needsUpdate = true
        
        // Ensure it's a string before splitting
        if (typeof facilitiesStr !== 'string') {
          facilitiesStr = String(facilitiesStr)
        }
        
        // Split by comma and clean up
        facilities = facilitiesStr
          .split(',')
          .map(f => f.trim())
          .filter(f => f)
      }
      
      if (needsUpdate) {
        // Update to JSON array format
        const facilitiesJson = JSON.stringify(facilities)
        
        await connection.execute(
          'UPDATE rooms SET facilities = ? WHERE id = ?',
          [facilitiesJson, room.id]
        )
        
        console.log(`🔄 Room ${room.id} (${room.name}):`)
        console.log(`   Before: ${facilitiesStr}`)
        console.log(`   After:  ${facilitiesJson}`)
        updated++
      }
    }
    
    console.log(`\n${'='.repeat(60)}`)
    console.log(`✅ Migration complete!`)
    console.log(`   Updated: ${updated} rooms`)
    console.log(`   Skipped: ${skipped} rooms (already valid or empty)`)
    console.log(`   Total:   ${rooms.length} rooms`)
    console.log(`${'='.repeat(60)}`)
  } catch (error) {
    console.error('❌ Migration failed:', error)
    process.exit(1)
  } finally {
    await connection.end()
  }
}

// Run migration
migrateFacilities()
