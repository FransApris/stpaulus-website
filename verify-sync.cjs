// Verify sync worked correctly
const mysql = require('mysql2/promise')

async function verify() {
    const pool = mysql.createPool({
        host: 'localhost',
        port: 3306,
        user: 'root',
        password: 'pressgk31',
        database: 'stpaulus_cms_db',
        waitForConnections: true,
        connectionLimit: 10
    })

    try {
        const connection = await pool.getConnection()
        
        const [entries] = await connection.execute(`
            SELECT 
                ke.id,
                ke.what_title,
                ke.source_news_id,
                ke.is_auto_synced,
                ke.status,
                n.title as original_news_title,
                kc.name as category
            FROM kronik_entries ke
            LEFT JOIN news n ON ke.source_news_id = n.id
            LEFT JOIN kronik_categories kc ON ke.category_id = kc.id
            WHERE ke.source_news_id IS NOT NULL
            ORDER BY ke.id DESC
        `)
        
        console.log('✅ Synced Kronik Entries:\n')
        entries.forEach(e => {
            console.log(`📝 "${e.what_title}"`)
            console.log(`   Kronik ID: ${e.id}`)
            console.log(`   Source News ID: ${e.source_news_id}`)
            console.log(`   Original News: "${e.original_news_title}"`)
            console.log(`   Category: ${e.category}`)
            console.log(`   Auto-synced: ${e.is_auto_synced ? 'Yes ✅' : 'No'}`)
            console.log(`   Status: ${e.status}\n`)
        })
        
        console.log(`Total synced entries: ${entries.length}`)
        
        connection.release()
        await pool.end()
    } catch (error) {
        console.error('Error:', error.message)
    }
}

verify()
