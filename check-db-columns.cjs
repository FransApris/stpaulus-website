// Check if article_categories has sync_to_kronik column
const mysql = require('mysql2/promise')

async function checkColumns() {
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
        console.log('✅ Connected to MySQL\n')

        // Check article_categories columns
        console.log('📋 Checking article_categories columns:')
        const [columns] = await connection.execute(
            "SHOW COLUMNS FROM article_categories"
        )
        console.log('Columns:', columns.map(c => c.Field).join(', '))
        
        const hasSyncColumn = columns.some(c => c.Field === 'sync_to_kronik')
        const hasKronikCatColumn = columns.some(c => c.Field === 'kronik_category_id')
        
        console.log('\n✓ Has sync_to_kronik:', hasSyncColumn)
        console.log('✓ Has kronik_category_id:', hasKronikCatColumn)
        
        if (!hasSyncColumn || !hasKronikCatColumn) {
            console.log('\n⚠️  Missing columns! Need to run migration 021_add_news_kronik_sync.sql')
        }

        // Check kronik_entries columns
        console.log('\n📋 Checking kronik_entries columns:')
        const [kronikColumns] = await connection.execute(
            "SHOW COLUMNS FROM kronik_entries"
        )
        console.log('Columns:', kronikColumns.map(c => c.Field).join(', '))
        
        const hasSourceNewsId = kronikColumns.some(c => c.Field === 'source_news_id')
        const hasAutoSynced = kronikColumns.some(c => c.Field === 'is_auto_synced')
        
        console.log('\n✓ Has source_news_id:', hasSourceNewsId)
        console.log('✓ Has is_auto_synced:', hasAutoSynced)
        
        if (!hasSourceNewsId || !hasAutoSynced) {
            console.log('\n⚠️  Missing columns! Need to run migration 021_add_news_kronik_sync.sql')
        }

        connection.release()
        await pool.end()
    } catch (error) {
        console.error('❌ Error:', error.message)
    }
}

checkColumns()
