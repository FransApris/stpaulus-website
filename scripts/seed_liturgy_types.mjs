import 'dotenv/config'
import mysql from 'mysql2/promise'

const pool = mysql.createPool({
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
})

async function seedLiturgyTypes() {
    let connection

    try {
        console.log('🔌 Connecting to database...')
        connection = await pool.getConnection()
        console.log('✅ Connected to database\n')

        // Check existing data
        const [existing] = await connection.query(
            'SELECT COUNT(*) as count FROM liturgy_types WHERE is_active = 1'
        )

        console.log(`ℹ️  Found ${existing[0].count} active liturgy types`)

        if (existing[0].count > 0) {
            console.log('✅ Liturgy types already seeded!')
            console.log('💡 To re-seed, run: DELETE FROM liturgy_types;')

            // Show existing data
            const [result] = await connection.query(`
        SELECT id, name, slug, color, display_order 
        FROM liturgy_types 
        WHERE is_active = 1
        ORDER BY display_order
      `)

            console.log('\n📊 Current Liturgy Types:')
            console.log('┌─────┬─────────────────────────┬──────────┬───────┐')
            console.log('│ ID  │ Name                    │ Color    │ Order │')
            console.log('├─────┼─────────────────────────┼──────────┼───────┤')
            result.forEach(row => {
                console.log(
                    `│ ${String(row.id).padEnd(3)} │ ${row.name.padEnd(23)} │ ${(row.color || '-').padEnd(8)} │ ${String(row.display_order).padEnd(5)} │`
                )
            })
            console.log('└─────┴─────────────────────────┴──────────┴───────┘\n')
            return
        }

        // Insert seed data
        console.log('📥 Inserting liturgy types seed data...\n')

        const liturgyTypes = [
            { name: 'Misa Harian', slug: 'misa-harian', description: 'Misa pada hari biasa', color: '#3B82F6', icon: '📖', display_order: 1 },
            { name: 'Misa Minggu', slug: 'misa-minggu', description: 'Misa hari Minggu', color: '#10B981', icon: '✨', display_order: 2 },
            { name: 'Misa Hari Raya', slug: 'misa-hari-raya', description: 'Misa pada hari raya liturgi', color: '#F59E0B', icon: '🎉', display_order: 3 },
            { name: 'Adorasi', slug: 'adorasi', description: 'Adorasi Sakramen Mahakudus', color: '#8B5CF6', icon: '🕯️', display_order: 4 },
            { name: 'Ibadat', slug: 'ibadat', description: 'Ibadat dan devosi', color: '#EC4899', icon: '🙏', display_order: 5 },
            { name: 'Misa Jumat Pertama', slug: 'misa-jumat-pertama', description: 'Misa Jumat Pertama', color: '#EF4444', icon: '❤️', display_order: 6 },
            { name: 'Misa Syukuran', slug: 'misa-syukuran', description: 'Misa syukuran khusus', color: '#06B6D4', icon: '🎊', display_order: 7 },
            { name: 'Misa Pernikahan', slug: 'misa-pernikahan', description: 'Misa pemberkatan pernikahan', color: '#F97316', icon: '💒', display_order: 8 },
            { name: 'Misa Arwah', slug: 'misa-arwah', description: 'Misa untuk arwah', color: '#6B7280', icon: '🕊️', display_order: 9 }
        ]

        for (const type of liturgyTypes) {
            await connection.query(
                `INSERT INTO liturgy_types (name, slug, description, color, icon, is_active, display_order)
         VALUES (?, ?, ?, ?, ?, 1, ?)`,
                [type.name, type.slug, type.description, type.color, type.icon, type.display_order]
            )
            console.log(`   ✅ ${type.name}`)
        }

        console.log(`\n✨ Successfully inserted ${liturgyTypes.length} liturgy types!\n`)

        // Display summary
        const [result] = await connection.query(`
      SELECT id, name, slug, color, display_order 
      FROM liturgy_types 
      ORDER BY display_order
    `)

        console.log('📊 Seeded Liturgy Types:')
        console.log('┌─────┬─────────────────────────┬──────────┬───────┐')
        console.log('│ ID  │ Name                    │ Color    │ Order │')
        console.log('├─────┼─────────────────────────┼──────────┼───────┤')
        result.forEach(row => {
            console.log(
                `│ ${String(row.id).padEnd(3)} │ ${row.name.padEnd(23)} │ ${row.color.padEnd(8)} │ ${String(row.display_order).padEnd(5)} │`
            )
        })
        console.log('└─────┴─────────────────────────┴──────────┴───────┘\n')

    } catch (error) {
        console.error('❌ Error:', error.message)
        throw error
    } finally {
        if (connection) {
            connection.release()
        }
        await pool.end()
        console.log('🔌 Database connection closed')
    }
}

// Run the seed
seedLiturgyTypes()
    .then(() => {
        console.log('✅ Seed completed successfully!')
        process.exit(0)
    })
    .catch((error) => {
        console.error('❌ Seed failed:', error)
        process.exit(1)
    })
