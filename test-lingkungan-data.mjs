import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pressgk31',
    database: 'stpaulus_cms_db'
})

console.log('✅ Connected to database\n')

// Check if column exists
const [columns] = await connection.execute(`
    SHOW COLUMNS FROM lingkungan WHERE Field = 'no_hp_pengurus'
`)

if (columns.length > 0) {
    console.log('✅ Column no_hp_pengurus exists:')
    console.log(columns[0])
} else {
    console.log('❌ Column no_hp_pengurus NOT FOUND')
}

// Check sample data
console.log('\n📊 Sample lingkungan data:')
const [rows] = await connection.execute(`
    SELECT id, no, nama, ketua, telp, no_hp_pengurus, jumlah_kk, jumlah_jiwa
    FROM lingkungan
    LIMIT 3
`)

console.table(rows)

// Check lingkungan with ID 84
console.log('\n🔍 Checking lingkungan ID 84:')
const [ling84] = await connection.execute(`
    SELECT * FROM lingkungan WHERE id = 84
`)

if (ling84.length > 0) {
    console.log('✅ Found:')
    console.log(ling84[0])
} else {
    console.log('❌ Lingkungan ID 84 not found')
}

await connection.end()
console.log('\n✅ Connection closed')
