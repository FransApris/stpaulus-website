#!/usr/bin/env node
import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from project root
dotenv.config({ path: join(__dirname, '..', '.env') })

const connection = await mysql.createConnection({
    host: process.env.MYSQL_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || '3306'),
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
})

console.log('🤖 ===== CHATBOT AUDIT REPORT =====\n')

// 1. Check total FAQs
const [faqs] = await connection.execute('SELECT COUNT(*) as total FROM chatbot_faqs')
console.log(`📊 Total FAQs: ${faqs[0].total}`)

// 2. Check active vs inactive
const [active] = await connection.execute('SELECT COUNT(*) as total FROM chatbot_faqs WHERE is_active = 1')
const [inactive] = await connection.execute('SELECT COUNT(*) as total FROM chatbot_faqs WHERE is_active = 0')
console.log(`✅ Active FAQs: ${active[0].total}`)
console.log(`❌ Inactive FAQs: ${inactive[0].total}\n`)

// 3. Check duplicates (should be 0 now)
const [duplicates] = await connection.execute(`
  SELECT question, COUNT(*) as jumlah 
  FROM chatbot_faqs 
  GROUP BY question 
  HAVING COUNT(*) > 1
`)
console.log(`🔄 Duplicate Questions: ${duplicates.length}`)
if (duplicates.length > 0) {
    console.log('⚠️  WARNING: Still have duplicates:')
    duplicates.forEach(d => console.log(`   - "${d.question}" (${d.jumlah}x)`))
}
console.log()

// 4. Check FAQs without keywords
const [noKeywords] = await connection.execute(`
  SELECT id, question 
  FROM chatbot_faqs 
  WHERE keywords IS NULL OR keywords = '' OR keywords = '[]'
`)
console.log(`🏷️  FAQs Without Keywords: ${noKeywords.length}`)
if (noKeywords.length > 0) {
    console.log('⚠️  WARNING: These FAQs have no keywords (may not match well):')
    noKeywords.forEach(f => console.log(`   - [${f.id}] ${f.question}`))
}
console.log()

// 5. Check most used FAQs
const [topFAQs] = await connection.execute(`
  SELECT question, usage_count 
  FROM chatbot_faqs 
  WHERE is_active = 1
  ORDER BY usage_count DESC 
  LIMIT 5
`)
console.log('📈 Top 5 Most Asked Questions:')
topFAQs.forEach((f, i) => console.log(`   ${i + 1}. ${f.question} (${f.usage_count} times)`))
console.log()

// 6. Sample all active FAQs with keywords
const [allActive] = await connection.execute(`
  SELECT id, question, keywords, category
  FROM chatbot_faqs 
  WHERE is_active = 1
  ORDER BY id
`)
console.log('📝 All Active FAQs with Keywords:')
console.log('='.repeat(80))
allActive.forEach(f => {
    let keywords = 'None'
    if (f.keywords) {
        try {
            keywords = JSON.parse(f.keywords).join(', ')
        } catch (e) {
            keywords = f.keywords
        }
    }
    console.log(`[${f.id}] ${f.question}`)
    console.log(`    Category: ${f.category || 'General'}`)
    console.log(`    Keywords: ${keywords}`)
    console.log()
})

console.log('\n✅ Audit Complete!\n')
console.log('💡 RECOMMENDATIONS:')
console.log('   1. Add keywords to FAQs that don\'t have them')
console.log('   2. Remove duplicates if any found')
console.log('   3. Test chatbot with various questions')
console.log('   4. Monitor usage_count to see which FAQs are popular\n')

await connection.end()
