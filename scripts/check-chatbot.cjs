const mysql = require('mysql2/promise')
require('dotenv').config()

async function checkChatbot() {
    const conn = await mysql.createConnection({
        host: process.env.MYSQL_HOST || 'localhost',
        port: parseInt(process.env.MYSQL_PORT) || 3306,
        user: process.env.MYSQL_USER || 'root',
        password: process.env.MYSQL_PASSWORD || '',
        database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
    })

    console.log('\n🤖 PEMERIKSAAN DATABASE CHATBOT')
    console.log('='.repeat(80))

    // Check FAQs
    console.log('\n📝 CHATBOT FAQs:\n')
    const [faqs] = await conn.execute('SELECT * FROM chatbot_faqs ORDER BY id')
    console.log(`Total: ${faqs.length} FAQ\n`)

    faqs.forEach((faq, i) => {
        console.log(`[${i + 1}] ID: ${faq.id}`)
        console.log(`    Pertanyaan: ${faq.question}`)
        console.log(`    Jawaban: ${faq.answer.substring(0, 150)}${faq.answer.length > 150 ? '...' : ''}`)
        console.log(`    Kategori: ${faq.category || '(tidak ada)'}`)
        console.log(`    Keywords: ${faq.keywords || '(tidak ada)'}`)
        console.log(`    Status: ${faq.is_active ? '✅ Aktif' : '❌ Non-aktif'}`)
        console.log(`    Digunakan: ${faq.usage_count} kali`)
        console.log('')
    })

    // Check Categories
    console.log('='.repeat(80))
    console.log('\n📂 KATEGORI FAQ:\n')
    const [categories] = await conn.execute('SELECT * FROM chatbot_faq_categories ORDER BY display_order, name')
    console.log(`Total: ${categories.length} kategori\n`)

    if (categories.length > 0) {
        categories.forEach((cat, i) => {
            console.log(`[${i + 1}] ${cat.name}`)
            console.log(`    Slug: ${cat.slug}`)
            console.log(`    Deskripsi: ${cat.description || '(tidak ada)'}`)
            console.log(`    Warna: ${cat.color}`)
            console.log(`    Status: ${cat.is_active ? '✅ Aktif' : '❌ Non-aktif'}`)
            console.log('')
        })
    } else {
        console.log('⚠️  Tidak ada kategori\n')
    }

    // Statistics
    console.log('='.repeat(80))
    console.log('\n📊 STATISTIK:\n')
    const [stats] = await conn.execute(`
    SELECT 
      COUNT(*) as total,
      SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
      SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
      SUM(usage_count) as total_usage,
      AVG(usage_count) as avg_usage
    FROM chatbot_faqs
  `)

    const stat = stats[0]
    console.log(`Total FAQ: ${stat.total}`)
    console.log(`FAQ Aktif: ${stat.active}`)
    console.log(`FAQ Non-aktif: ${stat.inactive}`)
    console.log(`Total Penggunaan: ${stat.total_usage}`)
    console.log(`Rata-rata: ${stat.avg_usage ? Number(stat.avg_usage).toFixed(2) : 0} kali/FAQ`)

    console.log('\n' + '='.repeat(80))
    console.log('✅ Selesai!\n')

    await conn.end()
}

checkChatbot().catch(err => {
    console.error('❌ Error:', err.message)
    process.exit(1)
})
