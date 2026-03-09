#!/usr/bin/env node

/**
 * Script untuk setup kategori "Peristiwa Paroki" untuk kronik gereja
 * 
 * Script ini akan:
 * 1. Memeriksa apakah kategori "Peristiwa Paroki" sudah ada
 * 2. Membuat kategori jika belum ada
 * 3. Menampilkan status kategori
 */

import mysql from 'mysql2/promise'
import { config } from 'dotenv'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from project root
config({ path: resolve(__dirname, '../.env') })

const DB_CONFIG = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'stpaulus',
    port: parseInt(process.env.MYSQL_PORT || '3306')
}

async function setupKronikCategories() {
    let connection

    try {
        console.log('🔌 Connecting to database...')
        console.log(`   Host: ${DB_CONFIG.host}:${DB_CONFIG.port}`)
        console.log(`   Database: ${DB_CONFIG.database}`)
        console.log(`   User: ${DB_CONFIG.user}\n`)

        connection = await mysql.createConnection(DB_CONFIG)
        console.log('✅ Connected to database\n')

        // Check and create article category
        console.log('📰 Checking Article Category "Peristiwa Paroki"...')
        const [articleCategories] = await connection.execute(
            'SELECT * FROM article_categories WHERE name = ?',
            ['Peristiwa Paroki']
        )

        if (articleCategories.length === 0) {
            console.log('   ⚠️  Category not found. Creating...')
            await connection.execute(
                'INSERT INTO article_categories (name, slug, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                [
                    'Peristiwa Paroki',
                    'peristiwa-paroki',
                    'Peristiwa dan kejadian penting di Paroki St. Paulus Juanda'
                ]
            )
            console.log('   ✅ Article category "Peristiwa Paroki" created!')
        } else {
            console.log('   ✅ Article category "Peristiwa Paroki" already exists')
            console.log('   📋 ID:', articleCategories[0].id)
            console.log('   📋 Slug:', articleCategories[0].slug)
        }

        // Check and create agenda category
        console.log('\n📅 Checking Agenda Category "Peristiwa Paroki"...')
        const [agendaCategories] = await connection.execute(
            'SELECT * FROM agenda_categories WHERE name = ?',
            ['Peristiwa Paroki']
        )

        if (agendaCategories.length === 0) {
            console.log('   ⚠️  Category not found. Creating...')
            await connection.execute(
                'INSERT INTO agenda_categories (name, slug, description, created_at, updated_at) VALUES (?, ?, ?, NOW(), NOW())',
                [
                    'Peristiwa Paroki',
                    'peristiwa-paroki',
                    'Agenda peristiwa dan kejadian penting di Paroki St. Paulus Juanda'
                ]
            )
            console.log('   ✅ Agenda category "Peristiwa Paroki" created!')
        } else {
            console.log('   ✅ Agenda category "Peristiwa Paroki" already exists')
            console.log('   📋 ID:', agendaCategories[0].id)
            console.log('   📋 Slug:', agendaCategories[0].slug)
        }

        // Count news with this category
        console.log('\n📊 Checking kronik data...')
        const [articleCount] = await connection.execute(
            `SELECT COUNT(*) as count 
       FROM news n 
       INNER JOIN news_category_relations ncr ON n.id = ncr.news_id
       INNER JOIN article_categories ac ON ncr.category_id = ac.id
       WHERE ac.name = ? AND n.status = 'published'`,
            ['Peristiwa Paroki']
        )
        console.log(`   📰 News articles: ${articleCount[0].count}`)

        const [agendaCount] = await connection.execute(
            `SELECT COUNT(*) as count 
       FROM agendas a
       INNER JOIN agenda_categories ac ON a.category_id = ac.id
       WHERE ac.name = ?`,
            ['Peristiwa Paroki']
        )
        console.log(`   📅 Agenda items: ${agendaCount[0].count}`)

        console.log('\n✨ Setup completed successfully!')
        console.log('\n📝 Summary:')
        console.log('   - Kategori "Peristiwa Paroki" untuk artikel: ✅')
        console.log('   - Kategori "Peristiwa Paroki" untuk agenda: ✅')
        console.log(`   - Total kronik items: ${articleCount[0].count + agendaCount[0].count}`)

        if (articleCount[0].count + agendaCount[0].count === 0) {
            console.log('\n💡 Tips:')
            console.log('   1. Buat artikel baru dengan kategori "Peristiwa Paroki"')
            console.log('   2. Atau buat agenda baru dengan kategori "Peristiwa Paroki"')
            console.log('   3. Kronik akan otomatis muncul di halaman /kronik-gereja')
        }

    } catch (error) {
        console.error('\n❌ Error:', error.message)

        // Provide helpful error messages
        if (error.code === 'ER_BAD_DB_ERROR') {
            console.error('💡 Database tidak ditemukan. Periksa MYSQL_DATABASE di .env')
        } else if (error.code === 'ECONNREFUSED') {
            console.error('💡 Tidak dapat terhubung ke MySQL. Apakah server sudah berjalan?')
        } else if (error.code === 'ER_ACCESS_DENIED_ERROR') {
            console.error('💡 Akses ditolak. Periksa MYSQL_USER dan MYSQL_PASSWORD di .env')
        } else if (error.code === 'ENOTFOUND') {
            console.error('💡 Host tidak ditemukan. Periksa MYSQL_HOST di .env')
        }

        process.exit(1)
    } finally {
        if (connection) {
            await connection.end()
            console.log('\n🔌 Database connection closed')
        }
    }
}

// Run the script
setupKronikCategories()
