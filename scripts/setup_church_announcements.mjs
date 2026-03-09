#!/usr/bin/env node

/**
 * Setup Church Announcements Table & Sample Data
 * Run: node scripts/setup_church_announcements.mjs
 */

import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Load .env from parent directory
dotenv.config({ path: join(__dirname, '..', '.env') })

const dbConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    user: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db',
}

async function setup() {
    let connection

    try {
        console.log('🔌 Connecting to database...')
        connection = await mysql.createConnection(dbConfig)
        console.log('✅ Connected to database\n')

        // Create table
        console.log('📋 Creating church_announcements table...')
        await connection.execute(`
      CREATE TABLE IF NOT EXISTS church_announcements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        event_date DATE NOT NULL,
        event_time TIME,
        thumbnail VARCHAR(500),
        is_active BOOLEAN DEFAULT true,
        display_order INT DEFAULT 0,
        created_by INT,
        updated_by INT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        INDEX idx_event_date (event_date),
        INDEX idx_is_active (is_active),
        INDEX idx_display_order (display_order)
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
    `)
        console.log('✅ Table created successfully\n')

        // Check if data already exists
        const [existing] = await connection.execute(
            'SELECT COUNT(*) as count FROM church_announcements'
        )

        if (existing[0].count > 0) {
            console.log(`ℹ️  Table already has ${existing[0].count} records`)
            console.log('   Skipping sample data insertion\n')
        } else {
            // Insert sample data
            console.log('📝 Inserting sample announcements...')

            const sampleData = [
                {
                    title: 'Misa Minggu Pertama Februari',
                    description: 'Misa Minggu Pertama bulan Februari akan dilaksanakan dengan tema "Berbagi Kasih untuk Sesama". Seluruh umat diharapkan hadir tepat waktu dan membawa bahan makanan untuk dibagikan kepada yang membutuhkan.',
                    event_date: '2026-02-01',
                    event_time: '07:00:00',
                    thumbnail: null,
                    display_order: 1
                },
                {
                    title: 'Adorasi Sakramen Mahakudus',
                    description: 'Adorasi Sakramen Mahakudus akan diadakan setiap Kamis pertama bulan ini. Mari kita luangkan waktu untuk berdoa dan merenungkan kehadiran Yesus dalam Sakramen Mahakudus.',
                    event_date: '2026-02-05',
                    event_time: '19:00:00',
                    thumbnail: null,
                    display_order: 2
                },
                {
                    title: 'Retret Kaum Muda',
                    description: 'Retret Kaum Muda dengan tema "Menemukan Jati Diri dalam Kristus" akan diadakan di Wisma Pertapaan. Peserta terbatas 50 orang, pendaftaran dibuka hingga 10 Februari 2026. Kontribusi: Rp 250.000 (sudah termasuk akomodasi dan konsumsi).',
                    event_date: '2026-02-14',
                    event_time: '08:00:00',
                    thumbnail: null,
                    display_order: 3
                },
                {
                    title: 'Bakti Sosial Lingkungan',
                    description: 'Kegiatan bakti sosial berupa pembagian sembako dan pemeriksaan kesehatan gratis untuk warga kurang mampu. Lokasi: Balai Paroki. Dibutuhkan relawan untuk membantu kegiatan ini. Pendaftaran relawan hubungi sekretariat paroki.',
                    event_date: '2026-02-08',
                    event_time: '08:30:00',
                    thumbnail: null,
                    display_order: 4
                },
                {
                    title: 'Pemberkatan Rumah Februari',
                    description: 'Jadwal pemberkatan rumah untuk bulan Februari sudah tersedia. Umat yang ingin rumahnya diberkati dapat mendaftar di sekretariat paroki atau menghubungi Romo Paroki. Pemberkatan dilakukan setiap Sabtu sore.',
                    event_date: '2026-02-07',
                    event_time: '15:00:00',
                    thumbnail: null,
                    display_order: 5
                },
                {
                    title: 'Pelatihan Koor Paroki',
                    description: 'Pelatihan untuk anggota koor paroki akan dilaksanakan setiap Rabu malam. Terbuka untuk semua umat yang tertarik untuk bergabung dalam pelayanan koor. Tidak ada syarat khusus, yang penting memiliki kemauan untuk melayani.',
                    event_date: '2026-02-11',
                    event_time: '19:30:00',
                    thumbnail: null,
                    display_order: 6
                },
                {
                    title: 'Rapat Dewan Pastoral Paroki',
                    description: 'Rapat koordinasi Dewan Pastoral Paroki membahas program kerja triwulan pertama 2026. Seluruh anggota DPP dan pengurus wilayah dimohon untuk hadir. Agenda: evaluasi program Januari, perencanaan kegiatan Februari-Maret.',
                    event_date: '2026-02-03',
                    event_time: '19:00:00',
                    thumbnail: null,
                    display_order: 7
                }
            ]

            for (const data of sampleData) {
                await connection.execute(
                    `INSERT INTO church_announcements 
           (title, description, event_date, event_time, thumbnail, display_order, is_active) 
           VALUES (?, ?, ?, ?, ?, ?, true)`,
                    [data.title, data.description, data.event_date, data.event_time, data.thumbnail, data.display_order]
                )
            }

            console.log(`✅ Inserted ${sampleData.length} sample announcements\n`)
        }

        // Show current data
        const [announcements] = await connection.execute(`
      SELECT id, title, event_date, event_time, is_active 
      FROM church_announcements 
      ORDER BY event_date ASC, event_time ASC
    `)

        console.log('📊 Current Announcements:')
        console.log('═'.repeat(80))
        announcements.forEach(ann => {
            const date = new Date(ann.event_date).toLocaleDateString('id-ID')
            const time = ann.event_time || 'N/A'
            const status = ann.is_active ? '✓' : '✗'
            console.log(`${status} [${ann.id}] ${ann.title}`)
            console.log(`   📅 ${date} ${time}`)
        })
        console.log('═'.repeat(80))

        console.log('\n✅ Setup completed successfully!')

    } catch (error) {
        console.error('\n❌ Error during setup:', error.message)
        process.exit(1)
    } finally {
        if (connection) {
            await connection.end()
            console.log('\n🔌 Database connection closed')
        }
    }
}

setup()
