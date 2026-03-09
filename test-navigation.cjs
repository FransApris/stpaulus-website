// Quick test: Check if card navigation works
const mysql = require('mysql2/promise')

async function quickTest() {
    console.log('🔍 Quick Navigation Test\n')
    console.log('='.repeat(60))
    
    // Test URLs
    const tests = [
        { name: 'Index Page', url: 'http://localhost:3000/kronik', check: 'Kronik Paroki' },
        { name: 'Gereja Category', url: 'http://localhost:3000/kronik/gereja', check: 'pertemuan3|Peresmian' },
        { name: 'Detail Page 31', url: 'http://localhost:3000/kronik/gereja/31', check: 'pertemuan3' },
        { name: 'Detail Page 32', url: 'http://localhost:3000/kronik/gereja/32', check: 'Peresmian' }
    ]
    
    console.log('\n📋 Testing all pages...\n')
    
    for (const test of tests) {
        try {
            const response = await fetch(test.url)
            const html = await response.text()
            const found = new RegExp(test.check, 'i').test(html)
            const status = response.ok ? '✅' : '❌'
            const content = found ? '✅' : '⚠️'
            console.log(`${status} ${test.name} (${response.status})`)
            console.log(`   ${content} Expected content: ${found ? 'Found' : 'Not found'}`)
            console.log(`   🔗 ${test.url}\n`)
        } catch (error) {
            console.log(`❌ ${test.name}`)
            console.log(`   Error: ${error.message}\n`)
        }
    }
    
    // Check database
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
            SELECT id, what_title, category_id, status
            FROM kronik_entries
            WHERE id IN (31, 32)
        `)
        
        console.log('📊 Database Check:')
        entries.forEach(e => {
            console.log(`   ✅ ID ${e.id}: "${e.what_title}" (${e.status})`)
        })
        
        connection.release()
        await pool.end()
    } catch (error) {
        console.log('❌ Database error:', error.message)
    }
    
    console.log('\n' + '='.repeat(60))
    console.log('\n💡 NEXT STEPS:')
    console.log('1. Open browser: http://localhost:3000/kronik/gereja')
    console.log('2. Look for cards: "pertemuan3" and "Peresmian Renovasi..."')
    console.log('3. Click on a card')
    console.log('4. Should navigate to: /kronik/gereja/[id]')
    console.log('\nIf cards are not clickable:')
    console.log('- Check browser console for JS errors (F12)')
    console.log('- Try: Ctrl+Shift+R to hard refresh')
    console.log('- Restart dev server if needed')
}

quickTest()
