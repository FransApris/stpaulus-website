// API: Run a pending migration SQL
// Path: POST /api/admin/run-migration
// Access: super_admin only
// Body: { migration: '007_add_agenda_id_to_announcements' }

import { runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

// SQL embedded directly — safer than reading from disk in Nitro production
const MIGRATIONS: Record<string, string[]> = {
  '007_add_agenda_id_to_announcements': [
    `ALTER TABLE church_announcements ADD COLUMN agenda_id INT NULL DEFAULT NULL AFTER display_order`,
    `ALTER TABLE church_announcements ADD INDEX idx_agenda_id (agenda_id)`,
    `ALTER TABLE church_announcements ADD CONSTRAINT fk_announcement_agenda FOREIGN KEY (agenda_id) REFERENCES agendas(id) ON DELETE SET NULL`
  ],
  '008_add_manage_users_permission_to_sekretariat': [
    `INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p ON p.name = 'manage_users_komsos_sekretariat' WHERE r.name = 'admin_sekretariat'`
  ],
  '009_add_liturgy_types_permission_to_sekretariat': [
    `INSERT IGNORE INTO role_permissions (role_id, permission_id) SELECT r.id, p.id FROM roles r JOIN permissions p ON p.name = 'manage_liturgy_types' WHERE r.name = 'admin_sekretariat'`
  ],
  '031_create_app_settings': [
    `CREATE TABLE IF NOT EXISTS app_settings (
      id INT AUTO_INCREMENT PRIMARY KEY,
      setting_key VARCHAR(100) UNIQUE NOT NULL,
      setting_value JSON,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
      INDEX idx_setting_key (setting_key)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`,
    `INSERT IGNORE INTO app_settings (setting_key, setting_value) VALUES ('maintenance_config', '{}')`
  ],
  '030_add_kronik_sections_wilayah_lingkungan': [
    // Wilayah sections
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Petrus', 'wilayah-petrus', 'Kronik kegiatan Wilayah Petrus', 1, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Paulus', 'wilayah-paulus', 'Kronik kegiatan Wilayah Paulus', 2, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Yeseph', 'wilayah-yeseph', 'Kronik kegiatan Wilayah Yeseph', 3, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Bartholomeus', 'wilayah-bartholomeus', 'Kronik kegiatan Wilayah Bartholomeus', 4, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Yakobus', 'wilayah-yakobus', 'Kronik kegiatan Wilayah Yakobus', 5, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Maria Regina', 'wilayah-maria-regina', 'Kronik kegiatan Wilayah Maria Regina', 6, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Fransiskus Asisi', 'wilayah-fransiskus-asisi', 'Kronik kegiatan Wilayah Fransiskus Asisi', 7, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Wilayah Vincentius a Paulo', 'wilayah-vincentius-a-paulo', 'Kronik kegiatan Wilayah Vincentius a Paulo', 8, TRUE FROM kronik_categories WHERE slug = 'wilayah'`,
    // Lingkungan Petrus
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 1', 'lingkungan-petrus-1', 'Lingkungan Petrus 1', 101, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 2', 'lingkungan-petrus-2', 'Lingkungan Petrus 2', 102, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 3', 'lingkungan-petrus-3', 'Lingkungan Petrus 3', 103, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 4', 'lingkungan-petrus-4', 'Lingkungan Petrus 4', 104, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Petrus 5', 'lingkungan-petrus-5', 'Lingkungan Petrus 5', 105, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Paulus
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 1', 'lingkungan-paulus-1', 'Lingkungan Paulus 1', 201, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 2', 'lingkungan-paulus-2', 'Lingkungan Paulus 2', 202, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 3', 'lingkungan-paulus-3', 'Lingkungan Paulus 3', 203, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 4', 'lingkungan-paulus-4', 'Lingkungan Paulus 4', 204, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Paulus 5', 'lingkungan-paulus-5', 'Lingkungan Paulus 5', 205, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Yeseph
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yeseph 1', 'lingkungan-yeseph-1', 'Lingkungan Yeseph 1', 301, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yeseph 2', 'lingkungan-yeseph-2', 'Lingkungan Yeseph 2', 302, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yeseph 3', 'lingkungan-yeseph-3', 'Lingkungan Yeseph 3', 303, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Bartholomeus
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Bartholomeus 1', 'lingkungan-bartholomeus-1', 'Lingkungan Bartholomeus 1', 401, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Bartholomeus 2', 'lingkungan-bartholomeus-2', 'Lingkungan Bartholomeus 2', 402, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Bartholomeus 3', 'lingkungan-bartholomeus-3', 'Lingkungan Bartholomeus 3', 403, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Yakobus
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yakobus 1', 'lingkungan-yakobus-1', 'Lingkungan Yakobus 1', 501, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yakobus 2', 'lingkungan-yakobus-2', 'Lingkungan Yakobus 2', 502, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Yakobus 3', 'lingkungan-yakobus-3', 'Lingkungan Yakobus 3', 503, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Maria Regina
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Maria Regina 1', 'lingkungan-maria-regina-1', 'Lingkungan Maria Regina 1', 601, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Maria Regina 2', 'lingkungan-maria-regina-2', 'Lingkungan Maria Regina 2', 602, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Maria Regina 3', 'lingkungan-maria-regina-3', 'Lingkungan Maria Regina 3', 603, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Fransiskus Asisi
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Fransiskus Asisi 1', 'lingkungan-fransiskus-asisi-1', 'Lingkungan Fransiskus Asisi 1', 701, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Fransiskus Asisi 2', 'lingkungan-fransiskus-asisi-2', 'Lingkungan Fransiskus Asisi 2', 702, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Fransiskus Asisi 3', 'lingkungan-fransiskus-asisi-3', 'Lingkungan Fransiskus Asisi 3', 703, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    // Lingkungan Vincentius a Paulo
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Vincentius a Paulo 1', 'lingkungan-vincentius-a-paulo-1', 'Lingkungan Vincentius a Paulo 1', 801, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Vincentius a Paulo 2', 'lingkungan-vincentius-a-paulo-2', 'Lingkungan Vincentius a Paulo 2', 802, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`,
    `INSERT IGNORE INTO kronik_sections (category_id, name, slug, description, order_index, is_active) SELECT id, 'Lingkungan Vincentius a Paulo 3', 'lingkungan-vincentius-a-paulo-3', 'Lingkungan Vincentius a Paulo 3', 803, TRUE FROM kronik_categories WHERE slug = 'lingkungan'`
  ],
  '040_add_news_organization_filters': [
    `CREATE TABLE IF NOT EXISTS seksi (id INT UNSIGNED PRIMARY KEY AUTO_INCREMENT, nama VARCHAR(100) NOT NULL, bidang VARCHAR(100) NULL, is_active TINYINT(1) DEFAULT 1, display_order INT DEFAULT 0, created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP)`,
    `INSERT IGNORE INTO seksi (nama, bidang, display_order) VALUES ('Keluarga','Pembinaan',1),('BIAK','Pembinaan',2),('REKAT','Pembinaan',3),('OMK','Pembinaan',4),('Lansia','Pembinaan',5),('Katekese','Sumber',6),('Kerasulan Kitab Suci','Sumber',7),('Liturgi','Sumber',8),('Karya Misioner','Kerasulan Khusus',9),('Pendidikan','Kerasulan Khusus',10),('Komunikasi Sosial','Kerasulan Khusus',11),('PHUBB','Kerasulan Umum',12),('Komisi PSE','Kerasulan Umum',13)`,
    `CREATE TABLE IF NOT EXISTS news_wilayah_relations (news_id INT NOT NULL, wilayah_id INT UNSIGNED NOT NULL, PRIMARY KEY (news_id, wilayah_id), FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE, FOREIGN KEY (wilayah_id) REFERENCES wilayah(id) ON DELETE CASCADE)`,
    `CREATE TABLE IF NOT EXISTS news_lingkungan_relations (news_id INT NOT NULL, lingkungan_id INT UNSIGNED NOT NULL, PRIMARY KEY (news_id, lingkungan_id), FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE, FOREIGN KEY (lingkungan_id) REFERENCES lingkungan(id) ON DELETE CASCADE)`,
    `CREATE TABLE IF NOT EXISTS news_seksi_relations (news_id INT NOT NULL, seksi_id INT UNSIGNED NOT NULL, PRIMARY KEY (news_id, seksi_id), FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE, FOREIGN KEY (seksi_id) REFERENCES seksi(id) ON DELETE CASCADE)`,
    `ALTER TABLE news ADD COLUMN is_bgkp TINYINT(1) DEFAULT 0`
  ],
  '050_create_news_interactions': [
    // Add missing columns to news table (runner skips "Duplicate column name" automatically)
    `ALTER TABLE news ADD COLUMN image VARCHAR(1000) NULL`,
    `ALTER TABLE news ADD COLUMN gallery_images JSON NULL`,
    `ALTER TABLE news ADD COLUMN when_date DATE NULL`,
    `ALTER TABLE news ADD COLUMN when_time VARCHAR(50) NULL`,
    `ALTER TABLE news ADD COLUMN where_location VARCHAR(500) NULL`,
    `ALTER TABLE news ADD COLUMN who_participants TEXT NULL`,
    `ALTER TABLE news ADD COLUMN why_purpose TEXT NULL`,
    `ALTER TABLE news ADD COLUMN how_process TEXT NULL`,
    `ALTER TABLE news ADD COLUMN ai_generated TINYINT(1) DEFAULT 0`,
    `ALTER TABLE news ADD COLUMN ai_prompt TEXT NULL`,
    `ALTER TABLE news ADD COLUMN likes_count INT DEFAULT 0`,
    `ALTER TABLE news ADD COLUMN shares_count INT DEFAULT 0`,
    `ALTER TABLE news ADD COLUMN views_count INT DEFAULT 0`,
    // Create news_interactions table
    `CREATE TABLE IF NOT EXISTS news_interactions (
      id INT PRIMARY KEY AUTO_INCREMENT,
      news_id INT NOT NULL,
      interaction_type ENUM('view', 'like', 'share') NOT NULL,
      user_ip VARCHAR(100) NOT NULL DEFAULT '0.0.0.0',
      user_agent TEXT NULL,
      user_session VARCHAR(255) NOT NULL DEFAULT '',
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      INDEX idx_news_interactions_news_id (news_id),
      INDEX idx_news_interactions_type (interaction_type),
      INDEX idx_news_interactions_session (user_session(64)),
      FOREIGN KEY (news_id) REFERENCES news(id) ON DELETE CASCADE
    )`
  ]
}

export default defineEventHandler(async (event) => {
  // Only super_admin
  const decoded = requireAuth(event)
  const user = await runQuery('SELECT role FROM users WHERE id = ? LIMIT 1', [decoded.userId]) as any[]
  const userRole = Array.isArray(user) ? user[0]?.role : (user as any)?.role
  if (userRole !== 'super_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya super_admin yang dapat menjalankan migration' })
  }

  const body = await readBody(event)
  const { migration } = body

  if (!migration || !MIGRATIONS[migration]) {
    throw createError({
      statusCode: 400,
      statusMessage: `Migration tidak dikenal. Tersedia: ${Object.keys(MIGRATIONS).join(', ')}`
    })
  }

  const statements = MIGRATIONS[migration]
  const results: { statement: string; status: string; error?: string }[] = []

  for (const statement of statements) {
    try {
      await runQuery(statement)
      results.push({ statement: statement.slice(0, 80) + (statement.length > 80 ? '...' : ''), status: 'ok' })
    } catch (err: any) {
      const msg: string = err?.message || ''
      const alreadyExists =
        msg.includes('Duplicate column name') ||
        msg.includes('Duplicate key name') ||
        msg.includes('already exists') ||
        msg.includes('Duplicate foreign key')

      if (alreadyExists) {
        results.push({ statement: statement.slice(0, 80) + '...', status: 'skipped (already exists)' })
      } else {
        results.push({ statement: statement.slice(0, 80) + '...', status: 'error', error: msg })
        return { success: false, message: `Migration gagal: ${msg}`, results }
      }
    }
  }

  console.log(`[Migration] ${migration} selesai`, results)
  return { success: true, message: `Migration "${migration}" berhasil dijalankan`, results }
})

