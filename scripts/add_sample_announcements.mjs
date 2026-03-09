import mysql from 'mysql2/promise'
import dotenv from 'dotenv'
import { fileURLToPath } from 'url'
import { dirname, join } from 'path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)
dotenv.config({ path: join(__dirname, '..', '.env') })

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db',
}

async function addSamples() {
  const connection = await mysql.createConnection(dbConfig)

  try {
    console.log('🔌 Connecting to database...')

    // Check existing count
    const [existing] = await connection.execute('SELECT COUNT(*) as count FROM church_announcements')
    const currentCount = existing[0].count

    console.log(`📊 Current announcements: ${currentCount}`)

    if (currentCount >= 10) {
      console.log('ℹ️  Already have enough sample data')
      return
    }

    const samples = [
      {
        title: 'Misa Syukur HUT Paroki ke-50',
        description: 'Bergabunglah dengan kami dalam perayaan Misa Syukur memperingati 50 tahun berdirinya Paroki St. Paulus. Akan ada prosesi khusus dan doa bersama untuk masa depan paroki kita.',
        event_date: '2026-03-15',
        event_time: '09:00:00'
      },
      {
        title: 'Rekoleksi Keluarga Katolik',
        description: 'Program rekoleksi khusus untuk keluarga Katolik dengan tema "Membangun Keluarga Kudus di Era Digital". Narasumber: Romo Dr. Johannes Hartono, SJ. Gratis untuk seluruh anggota paroki.',
        event_date: '2026-03-22',
        event_time: '08:00:00'
      },
      {
        title: 'Ziarek ke Gua Maria Lourdes',
        description: 'Perjalanan ziarah sehari ke Gua Maria Lourdes Sendangsono. Biaya Rp 150.000/orang sudah termasuk transportasi AC dan makan siang. Pendaftaran melalui sekretariat paroki.',
        event_date: '2026-04-05',
        event_time: '05:00:00'
      },
      {
        title: 'Katekese Persiapan Paskah',
        description: 'Seri katekese 4 minggu menjelang Paskah. Topik: Makna Sengsara, Wafat, dan Kebangkitan Kristus dalam kehidupan sehari-hari. Terbuka untuk semua umat.',
        event_date: '2026-03-08',
        event_time: '15:00:00'
      },
      {
        title: 'Bakti Sosial Ramadhan',
        description: 'Kegiatan berbagi kepada saudara Muslim dalam menyambut bulan Ramadhan. Donasi sembako dan santunan untuk fakir miskin. Mari wujudkan persaudaraan lintas agama.',
        event_date: '2026-03-18',
        event_time: '10:00:00'
      },
      {
        title: 'Adorasi dan Doa Rosario',
        description: 'Adorasi Ekaristi Mahakudus dan Doa Rosario khusus untuk para orang tua, guru, dan pendidik. Dipimpin oleh Pastor Paroki dengan refleksi khusus.',
        event_date: '2026-02-28',
        event_time: '18:00:00'
      }
    ]

    console.log(`\n✨ Adding ${samples.length} sample announcements...\n`)

    for (const sample of samples) {
      await connection.execute(
        `INSERT INTO church_announcements 
        (title, description, event_date, event_time, is_active, display_order, created_at, updated_at)
        VALUES (?, ?, ?, ?, true, 0, NOW(), NOW())`,
        [sample.title, sample.description, sample.event_date, sample.event_time]
      )
      console.log(`✓ Added: ${sample.title}`)
    }

    console.log(`\n✅ Successfully added ${samples.length} announcements!`)

  } catch (error) {
    console.error('❌ Error:', error.message)
  } finally {
    await connection.end()
  }
}

addSamples()
