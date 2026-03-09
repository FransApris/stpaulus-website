import mysql from 'mysql2/promise'

const connection = await mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: 'pressgk31',
    database: 'stpaulus_cms_db'
})

console.log('✅ Connected to database\n')

// Check DPP ketua lingkungan data
console.log('📊 DPP Ketua Lingkungan:')
const [dppKetua] = await connection.execute(`
    SELECT id, name, position_category, wilayah_name, lingkungan_number, is_active
    FROM dpp_members
    WHERE position_category = 'ketua_lingkungan'
    ORDER BY wilayah_name, lingkungan_number
`)

console.log(`Total: ${dppKetua.length} ketua lingkungan`)
console.table(dppKetua)

// Check wilayah data
console.log('\n📊 Wilayah Data:')
const [wilayah] = await connection.execute(`
    SELECT id, nama, is_visible
    FROM wilayah
    ORDER BY nama
`)

console.log(`Total: ${wilayah.length} wilayah`)
console.table(wilayah)

// Check lingkungan data in DB
console.log('\n📊 Lingkungan in Database:')
const [lingkunganDB] = await connection.execute(`
    SELECT id, no, nama, wilayah_id, ketua, jumlah_kk, jumlah_jiwa, no_hp_pengurus
    FROM lingkungan
    ORDER BY no
`)

console.log(`Total: ${lingkunganDB.length} lingkungan in database`)
if (lingkunganDB.length > 0) {
    console.table(lingkunganDB)
} else {
    console.log('❌ No lingkungan records in database')
}

// Show relationship
console.log('\n🔗 Expected Relationships:')
dppKetua.forEach(ketua => {
    const matchingWilayah = wilayah.find(w => w.nama === ketua.wilayah_name)
    console.log(`  ${ketua.wilayah_name} - Ling ${ketua.lingkungan_number}: ${ketua.name} | Wilayah ID: ${matchingWilayah?.id || 'NOT FOUND'}`)
})

await connection.end()
console.log('\n✅ Analysis complete')
