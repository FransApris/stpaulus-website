// Manual sync published news to kronik
const mysql = require('mysql2/promise')

async function manualSync() {
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

        // Find all published news with Peristiwa Paroki category that should sync
        console.log('🔍 Finding published news that should sync to kronik...')
        const [news] = await connection.execute(`
            SELECT DISTINCT
                n.id,
                n.title,
                n.content,
                n.excerpt,
                n.author,
                n.image,
                n.published_at,
                n.status,
                GROUP_CONCAT(DISTINCT ac.kronik_category_id) as kronik_cat_ids
            FROM news n
            INNER JOIN news_category_relations ncr ON n.id = ncr.news_id
            INNER JOIN article_categories ac ON ncr.category_id = ac.id
            WHERE n.status = 'published'
            AND ac.sync_to_kronik = TRUE
            AND ac.kronik_category_id IS NOT NULL
            AND n.id NOT IN (SELECT source_news_id FROM kronik_entries WHERE source_news_id IS NOT NULL)
            GROUP BY n.id
            ORDER BY n.published_at DESC
        `)

        if (news.length === 0) {
            console.log('✅ No news to sync. All published news with sync-enabled categories are already in kronik.')
            connection.release()
            await pool.end()
            return
        }

        console.log(`\n📰 Found ${news.length} news article(s) to sync:\n`)
        
        let synced = 0
        let failed = 0

        for (const item of news) {
            console.log(`\n📄 Syncing: "${item.title}"`)
            console.log(`   News ID: ${item.id}`)
            console.log(`   Published: ${item.published_at}`)
            console.log(`   Kronik Category ID: ${item.kronik_cat_ids}`)

            try {
                // Get kronik category ID (use first one if multiple)
                const kronikCatId = item.kronik_cat_ids.split(',')[0]
                
                // Default author_id to superadmin (111) if not found
                let authorId = 111
                if (item.author) {
                    const [user] = await connection.execute(
                        'SELECT id FROM users WHERE full_name = ? OR username = ? LIMIT 1',
                        [item.author, item.author]
                    )
                    if (user.length > 0) {
                        authorId = user[0].id
                    }
                }

                // Insert to kronik_entries
                const [result] = await connection.execute(
                    `INSERT INTO kronik_entries (
                        category_id,
                        section_id,
                        what_title,
                        what_description,
                        when_date,
                        featured_image,
                        status,
                        author_id,
                        source_news_id,
                        is_auto_synced,
                        sync_updated_at,
                        published_at,
                        created_at,
                        updated_at
                    ) VALUES (?, NULL, ?, ?, ?, ?, 'published', ?, ?, TRUE, NOW(), ?, NOW(), NOW())`,
                    [
                        kronikCatId,
                        item.title,
                        item.content || item.excerpt || '',
                        item.published_at,
                        item.image || null,
                        authorId,
                        item.id,
                        item.published_at
                    ]
                )

                console.log(`   ✅ Synced! Kronik Entry ID: ${result.insertId}`)
                synced++
            } catch (error) {
                console.log(`   ❌ Failed: ${error.message}`)
                failed++
            }
        }

        console.log(`\n${'='.repeat(60)}`)
        console.log(`\n📊 SUMMARY:`)
        console.log(`   ✅ Successfully synced: ${synced}`)
        console.log(`   ❌ Failed: ${failed}`)
        console.log(`   📝 Total: ${news.length}`)
        
        if (synced > 0) {
            console.log(`\n✨ You can now view the synced articles at:`)
            console.log(`   http://localhost:3000/kronik/gereja`)
        }

        connection.release()
        await pool.end()
    } catch (error) {
        console.error('\n❌ Error:', error.message)
        console.error(error.stack)
    }
}

console.log('🔄 Manual News-Kronik Sync Tool')
console.log('='.repeat(60))
console.log('This will sync all published news with "Peristiwa Paroki"')
console.log('category to kronik entries.\n')

manualSync()
