// Check news-kronik sync configuration and data
const mysql = require('mysql2/promise')

async function checkSync() {
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

        // 1. Check article categories sync config
        console.log('📋 Article Categories Sync Config:')
        console.log('='.repeat(60))
        const [categories] = await connection.execute(`
            SELECT 
                id,
                name,
                slug,
                sync_to_kronik,
                kronik_category_id,
                (SELECT name FROM kronik_categories WHERE id = ac.kronik_category_id) as kronik_category_name
            FROM article_categories ac
            ORDER BY name
        `)
        
        categories.forEach(cat => {
            const syncIcon = cat.sync_to_kronik ? '✅ ENABLED' : '❌ DISABLED'
            console.log(`\n${cat.name} (${cat.slug})`)
            console.log(`  ID: ${cat.id}`)
            console.log(`  Sync to Kronik: ${syncIcon}`)
            console.log(`  Kronik Category: ${cat.kronik_category_name || 'Not Set'} (ID: ${cat.kronik_category_id || 'null'})`)
        })

        // 2. Check recent news (last 5)
        console.log('\n\n📰 Recent News (Last 5):')
        console.log('='.repeat(60))
        const [news] = await connection.execute(`
            SELECT 
                n.id,
                n.title,
                n.status,
                n.published_at,
                n.created_at,
                GROUP_CONCAT(ac.name) as categories,
                GROUP_CONCAT(ac.id) as category_ids,
                GROUP_CONCAT(ac.sync_to_kronik) as sync_flags,
                GROUP_CONCAT(ac.kronik_category_id) as kronik_cat_ids
            FROM news n
            LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
            LEFT JOIN article_categories ac ON ncr.category_id = ac.id
            GROUP BY n.id
            ORDER BY n.created_at DESC
            LIMIT 5
        `)
        
        news.forEach(item => {
            console.log(`\n📄 "${item.title}"`)
            console.log(`   ID: ${item.id}`)
            console.log(`   Status: ${item.status}`)
            console.log(`   Created: ${item.created_at}`)
            console.log(`   Published: ${item.published_at || 'Not published'}`)
            console.log(`   Categories: ${item.categories || 'None'}`)
            console.log(`   Category IDs: ${item.category_ids || 'None'}`)
            console.log(`   Sync Flags: ${item.sync_flags || 'N/A'}`)
            console.log(`   Kronik Cat IDs: ${item.kronik_cat_ids || 'N/A'}`)
            
            // Check if any category has sync enabled
            if (item.sync_flags) {
                const hasSync = item.sync_flags.split(',').some(flag => flag === '1')
                if (hasSync) {
                    console.log(`   ✅ Should sync to kronik`)
                } else {
                    console.log(`   ❌ No category configured for sync`)
                }
            }
        })

        // 3. Check kronik entries from news
        console.log('\n\n📖 Kronik Entries from News:')
        console.log('='.repeat(60))
        const [kronikEntries] = await connection.execute(`
            SELECT 
                ke.id,
                ke.what_title,
                ke.source_news_id,
                ke.is_auto_synced,
                ke.status,
                ke.published_at,
                ke.sync_updated_at,
                n.title as news_title,
                kc.name as category_name
            FROM kronik_entries ke
            LEFT JOIN news n ON ke.source_news_id = n.id
            LEFT JOIN kronik_categories kc ON ke.category_id = kc.id
            WHERE ke.source_news_id IS NOT NULL
            ORDER BY ke.created_at DESC
            LIMIT 10
        `)
        
        if (kronikEntries.length === 0) {
            console.log('❌ No kronik entries synced from news yet')
        } else {
            kronikEntries.forEach(entry => {
                console.log(`\n📝 "${entry.what_title}"`)
                console.log(`   Kronik ID: ${entry.id}`)
                console.log(`   Source News ID: ${entry.source_news_id}`)
                console.log(`   News Title: ${entry.news_title || 'DELETED'}`)
                console.log(`   Category: ${entry.category_name}`)
                console.log(`   Auto Synced: ${entry.is_auto_synced ? 'Yes' : 'No'}`)
                console.log(`   Status: ${entry.status}`)
                console.log(`   Published: ${entry.published_at}`)
                console.log(`   Last Sync: ${entry.sync_updated_at || 'Never'}`)
            })
        }

        // 4. Check for "peristiwa paroki baru" specifically
        console.log('\n\n🔍 Looking for "peristiwa paroki baru":')
        console.log('='.repeat(60))
        const [specific] = await connection.execute(`
            SELECT 
                n.id,
                n.title,
                n.status,
                n.published_at,
                n.created_at,
                GROUP_CONCAT(ac.name) as categories,
                GROUP_CONCAT(ac.sync_to_kronik) as sync_flags,
                GROUP_CONCAT(ac.kronik_category_id) as kronik_cat_ids
            FROM news n
            LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
            LEFT JOIN article_categories ac ON ncr.category_id = ac.id
            WHERE n.title LIKE '%peristiwa paroki%'
            GROUP BY n.id
            ORDER BY n.created_at DESC
        `)
        
        if (specific.length === 0) {
            console.log('❌ News "peristiwa paroki baru" not found in database')
        } else {
            for (const item of specific) {
                console.log(`\n✓ Found: "${item.title}"`)
                console.log(`  ID: ${item.id}`)
                console.log(`  Status: ${item.status}`)
                console.log(`  Published: ${item.published_at || 'NOT PUBLISHED YET'}`)
                console.log(`  Categories: ${item.categories || 'NONE'}`)
                console.log(`  Sync Flags: ${item.sync_flags || 'N/A'}`)
                console.log(`  Kronik Cat IDs: ${item.kronik_cat_ids || 'N/A'}`)
                
                // Check if synced to kronik
                const [kronik] = await connection.execute(
                    'SELECT id, what_title FROM kronik_entries WHERE source_news_id = ?',
                    [item.id]
                )
                
                if (kronik.length > 0) {
                    console.log(`  ✅ Synced to Kronik: "${kronik[0].what_title}" (ID: ${kronik[0].id})`)
                } else {
                    console.log(`  ❌ NOT synced to kronik yet`)
                    
                    // Diagnose why
                    if (item.status !== 'published') {
                        console.log(`     → Reason: Status is "${item.status}" (needs to be "published")`)
                    } else if (!item.categories) {
                        console.log(`     → Reason: No categories assigned`)
                    } else if (!item.sync_flags || !item.sync_flags.includes('1')) {
                        console.log(`     → Reason: Categories not configured for sync`)
                        console.log(`     → Categories: ${item.categories}`)
                    } else if (!item.kronik_cat_ids || item.kronik_cat_ids === 'null') {
                        console.log(`     → Reason: No kronik category ID set`)
                    }
                }
            }
        }

        connection.release()
        await pool.end()
        
        console.log('\n' + '='.repeat(60))
        console.log('\n💡 RECOMMENDATION:')
        console.log('If category is not configured for sync, run:')
        console.log('UPDATE article_categories')
        console.log("SET sync_to_kronik = TRUE, kronik_category_id = 1")
        console.log("WHERE name = 'Peristiwa Paroki' OR slug LIKE '%peristiwa%';")
        
    } catch (error) {
        console.error('❌ Error:', error.message)
        console.error(error.stack)
    }
}

checkSync()
