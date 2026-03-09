import mysql from 'mysql2/promise'
import dotenv from 'dotenv'

dotenv.config()

async function checkChatbotDatabase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST || 'localhost',
            port: parseInt(process.env.DB_PORT) || 13306,
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'stpaulus'
        })

        console.log('🗄️  CHATBOT DATABASE INSPECTION\n')
        console.log('='.repeat(80))

        // Check table structure
        const [columns] = await connection.execute('DESCRIBE chatbot_faqs')
        console.log('\n📋 STRUKTUR TABEL chatbot_faqs:\n')
        console.log('Field           | Type                 | Null | Key | Default')
        console.log('-'.repeat(80))
        columns.forEach(col => {
            const field = String(col.Field).padEnd(15)
            const type = String(col.Type).padEnd(20)
            const nullable = String(col.Null).padEnd(4)
            const key = String(col.Key).padEnd(3)
            const def = col.Default === null ? 'NULL' : String(col.Default)
            console.log(`${field} | ${type} | ${nullable} | ${key} | ${def}`)
        })

        // Get all FAQs
        console.log('\n' + '='.repeat(80))
        console.log('\n📝 DATA FAQ:\n')
        const [faqs] = await connection.execute('SELECT * FROM chatbot_faqs ORDER BY id')
        console.log(`Total: ${faqs.length} FAQ(s)\n`)

        if (faqs.length === 0) {
            console.log('⚠️  Tidak ada data FAQ dalam database!')
        } else {
            faqs.forEach((faq, i) => {
                console.log(`[${i + 1}] ID: ${faq.id}`)
                console.log(`    Pertanyaan: ${faq.question}`)
                console.log(`    Jawaban: ${faq.answer.substring(0, 150)}${faq.answer.length > 150 ? '...' : ''}`)
                console.log(`    Kategori: ${faq.category || '(tidak ada kategori)'}`)
                console.log(`    Keywords: ${faq.keywords || '(tidak ada keywords)'}`)
                console.log(`    Status: ${faq.is_active ? '✅ Aktif' : '❌ Non-aktif'}`)
                console.log(`    Penggunaan: ${faq.usage_count} kali`)
                console.log(`    Dibuat: ${faq.created_at}`)
                console.log(`    Diperbarui: ${faq.updated_at}`)
                console.log()
            })
        }

        // Check chatbot_faq_categories table
        console.log('='.repeat(80))
        console.log('\n📂 KATEGORI FAQ:\n')
        const [categories] = await connection.execute('SELECT * FROM chatbot_faq_categories ORDER BY display_order, name')
        console.log(`Total: ${categories.length} kategori\n`)

        if (categories.length === 0) {
            console.log('⚠️  Tidak ada kategori FAQ dalam database!')
        } else {
            categories.forEach((cat, i) => {
                console.log(`[${i + 1}] ${cat.name}`)
                console.log(`    Slug: ${cat.slug}`)
                console.log(`    Deskripsi: ${cat.description || '(tidak ada deskripsi)'}`)
                console.log(`    Warna: ${cat.color}`)
                console.log(`    Display Order: ${cat.display_order}`)
                console.log(`    Status: ${cat.is_active ? '✅ Aktif' : '❌ Non-aktif'}`)
                console.log(`    Dibuat: ${cat.created_at}`)
                console.log()
            })
        }

        // Statistics
        console.log('='.repeat(80))
        console.log('\n📊 STATISTIK:\n')
        const [stats] = await connection.execute(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active = 1 THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN is_active = 0 THEN 1 ELSE 0 END) as inactive,
        SUM(usage_count) as total_usage,
        AVG(usage_count) as avg_usage
      FROM chatbot_faqs
    `)

        console.log(`Total FAQ: ${stats[0].total}`)
        console.log(`FAQ Aktif: ${stats[0].active}`)
        console.log(`FAQ Non-aktif: ${stats[0].inactive}`)
        console.log(`Total Penggunaan: ${stats[0].total_usage}`)
        console.log(`Rata-rata Penggunaan: ${stats[0].avg_usage ? stats[0].avg_usage.toFixed(2) : 0}`)

        console.log('\n' + '='.repeat(80))
        console.log('✅ Pemeriksaan selesai!\n')

        await connection.end()
    } catch (error) {
        console.error('❌ Error:', error.message)
        process.exit(1)
    }
}

checkChatbotDatabase()
