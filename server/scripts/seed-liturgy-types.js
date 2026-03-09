import Database from 'better-sqlite3'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const DB_PATH = path.join(__dirname, '../database/cms.db')
const db = new Database(DB_PATH)

const liturgyTypes = [
  {
    name: 'Misa Harian',
    slug: 'misa-harian',
    icon: '✝️',
    color: '#3B82F6',
    description: 'Misa harian Senin-Sabtu',
    display_order: 1
  },
  {
    name: 'Misa Minggu',
    slug: 'misa-minggu',
    icon: '⛪',
    color: '#10B981',
    description: 'Misa Hari Minggu dan Hari Raya',
    display_order: 2
  },
  {
    name: 'Misa Khusus',
    slug: 'misa-khusus',
    icon: '🎄',
    color: '#F59E0B',
    description: 'Misa Natal, Paskah, Jumat Pertama, dll',
    display_order: 3
  },
  {
    name: 'Sakramen Tobat',
    slug: 'sakramen-tobat',
    icon: '🙏',
    color: '#8B5CF6',
    description: 'Jadwal Pengakuan Dosa',
    display_order: 4
  },
  {
    name: 'Adorasi',
    slug: 'adorasi',
    icon: '🕯️',
    color: '#EF4444',
    description: 'Adorasi Sakramen Mahakudus',
    display_order: 5
  },
  {
    name: 'Rosario',
    slug: 'rosario',
    icon: '📿',
    color: '#06B6D4',
    description: 'Doa Rosario Bersama',
    display_order: 6
  },
  {
    name: 'Novena',
    slug: 'novena',
    icon: '🕊️',
    color: '#EC4899',
    description: 'Novena dan Doa Khusus',
    display_order: 7
  },
  {
    name: 'Ibadat Lainnya',
    slug: 'ibadat-lainnya',
    icon: '🙌',
    color: '#6B7280',
    description: 'Ibadat dan kegiatan rohani lainnya',
    display_order: 8
  }
]

try {
  console.log('🌱 Seeding liturgy types...')
  
  const insert = db.prepare(`
    INSERT OR IGNORE INTO liturgy_types (name, slug, icon, color, description, display_order, is_active)
    VALUES (?, ?, ?, ?, ?, ?, 1)
  `)
  
  for (const type of liturgyTypes) {
    insert.run(
      type.name,
      type.slug,
      type.icon,
      type.color,
      type.description,
      type.display_order
    )
    console.log(`✅ Created: ${type.name}`)
  }
  
  console.log('✨ Liturgy types seeded successfully!')
  
  // Display all types
  const types = db.prepare('SELECT * FROM liturgy_types ORDER BY display_order').all()
  console.log('\n📋 All Liturgy Types:')
  console.table(types)
  
} catch (error) {
  console.error('❌ Error seeding liturgy types:', error)
  process.exit(1)
} finally {
  db.close()
}
