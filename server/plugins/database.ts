import { initDatabase, runQuery } from '../database/db'

// =============================================================================
// SCHEMA MIGRATION RUNNER
// =============================================================================
//
// Sistem ini memastikan semua perubahan skema database (ALTER TABLE, dll.)
// diterapkan secara otomatis ke production saat server restart/deploy.
//
// Cara kerja:
//   1. Saat server start, plugin ini membuat tabel schema_migrations jika belum ada.
//   2. Setiap migrasi didaftarkan dengan ID unik (migration_id).
//   3. Sistem mengecek apakah migration_id sudah ada di tabel tersebut.
//   4. Jika BELUM ada - jalankan SQL migrasi - catat ke tabel sebagai selesai.
//   5. Jika SUDAH ada - lewati (idempotent, aman dijalankan berulang kali).
//
// ATURAN WAJIB untuk developer:
//   Setiap kali menambah kolom/tabel baru ke skema database, WAJIB mendaftarkan
//   migrasinya di array STRUCTURAL_MIGRATIONS di bawah ini dengan ID unik.
//   Format ID: 'NNN_nama_deskriptif' (sesuai nama file .sql)
// =============================================================================

interface Migration {
  id: string
  description: string
  statements: string[]
}

const STRUCTURAL_MIGRATIONS: Migration[] = [
  {
    id: '031_create_app_settings',
    description: 'Create app_settings table for maintenance mode and global config',
    statements: [
      `CREATE TABLE IF NOT EXISTS app_settings (
        id INT AUTO_INCREMENT PRIMARY KEY,
        setting_key VARCHAR(100) NOT NULL UNIQUE,
        setting_value TEXT,
        description VARCHAR(255),
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci`
    ]
  },
  {
    id: '032_add_force_password_reset',
    description: 'Add requires_password_reset column to users table (Clean Slate security policy)',
    statements: [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS requires_password_reset TINYINT(1) NOT NULL DEFAULT 0`
    ]
  },
  {
    id: '033_add_totp_2fa_to_users',
    description: 'Add TOTP 2FA fields to users table',
    statements: [
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_secret VARCHAR(255) NULL`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_enabled TINYINT(1) NOT NULL DEFAULT 0`,
      `ALTER TABLE users ADD COLUMN IF NOT EXISTS totp_backup_codes TEXT NULL`
    ]
  },
  // Tambahkan migrasi baru di sini menggunakan template:
  // {
  //   id: '034_nama_migrasi',
  //   description: 'Deskripsi singkat',
  //   statements: [
  //     `ALTER TABLE nama_tabel ADD COLUMN IF NOT EXISTS nama_kolom TINYINT(1) NOT NULL DEFAULT 0`
  //   ]
  // },
]

const PERMISSION_SEEDS = [
  { name: 'manage_liturgy_types', display_name: 'Kelola Jenis Liturgi', description: 'Manage liturgy types for mass schedules' },
  { name: 'kronik.bgkp.view', display_name: 'View Kronik BGKP', description: 'Melihat data BGKP' },
  { name: 'kronik.bgkp.create', display_name: 'Create Kronik BGKP', description: 'Membuat data BGKP' },
  { name: 'kronik.bgkp.edit', display_name: 'Edit Kronik BGKP', description: 'Mengedit data BGKP' },
  { name: 'kronik.bgkp.delete', display_name: 'Delete Kronik BGKP', description: 'Menghapus data BGKP' },
  { name: 'kronik.bgkp.publish', display_name: 'Publish Kronik BGKP', description: 'Mempublikasi data BGKP' },
  { name: 'kronik.wilayah.view', display_name: 'View Kronik Wilayah', description: 'Melihat data wilayah' },
  { name: 'kronik.wilayah.create', display_name: 'Create Kronik Wilayah', description: 'Membuat data wilayah' },
  { name: 'kronik.wilayah.edit', display_name: 'Edit Kronik Wilayah', description: 'Mengedit data wilayah' },
  { name: 'kronik.wilayah.delete', display_name: 'Delete Kronik Wilayah', description: 'Menghapus data wilayah' },
  { name: 'kronik.wilayah.publish', display_name: 'Publish Kronik Wilayah', description: 'Mempublikasi data wilayah' },
  { name: 'kronik.lingkungan.view', display_name: 'View Kronik Lingkungan', description: 'Melihat data lingkungan' },
  { name: 'kronik.lingkungan.create', display_name: 'Create Kronik Lingkungan', description: 'Membuat data lingkungan' },
  { name: 'kronik.lingkungan.edit', display_name: 'Edit Kronik Lingkungan', description: 'Mengedit data lingkungan' },
  { name: 'kronik.lingkungan.delete', display_name: 'Delete Kronik Lingkungan', description: 'Menghapus data lingkungan' },
  { name: 'kronik.lingkungan.publish', display_name: 'Publish Kronik Lingkungan', description: 'Mempublikasi data lingkungan' },
]

// =============================================================================
// PLUGIN ENTRY POINT
// =============================================================================

export default defineNitroPlugin(async () => {
  try {
    await initDatabase()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    return
  }

  await runMigrations()
  await seedPermissions()
})

// =============================================================================
// MIGRATION RUNNER
// =============================================================================

async function runMigrations(): Promise<void> {
  try {
    await runQuery(`
      CREATE TABLE IF NOT EXISTS schema_migrations (
        migration_id  VARCHAR(100) NOT NULL PRIMARY KEY,
        description   TEXT,
        applied_at    TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
        environment   VARCHAR(20) DEFAULT 'production'
      ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    `)

    let applied = 0
    let skipped = 0

    for (const migration of STRUCTURAL_MIGRATIONS) {
      try {
        const existing = await runQuery(
          'SELECT migration_id FROM schema_migrations WHERE migration_id = ?',
          [migration.id]
        ) as any

        if (existing) {
          skipped++
          continue
        }

        for (const sql of migration.statements) {
          await runQuery(sql)
        }

        await runQuery(
          'INSERT INTO schema_migrations (migration_id, description, environment) VALUES (?, ?, ?)',
          [migration.id, migration.description, process.env.NODE_ENV || 'production']
        )

        console.log(`OK Migration applied: [${migration.id}] ${migration.description}`)
        applied++

      } catch (migrationError: any) {
        console.error(`FAIL Migration failed: [${migration.id}]`, migrationError.message)
      }
    }

    if (applied > 0) {
      console.log(`OK Schema migrations: ${applied} applied, ${skipped} already up-to-date`)
    } else {
      console.log(`OK Database migrations checked & applied successfully (all ${skipped} up-to-date)`)
    }

  } catch (e: any) {
    console.error('FAIL Migration runner error:', e.message)
  }
}

// =============================================================================
// PERMISSION SEEDER
// =============================================================================

async function seedPermissions(): Promise<void> {
  try {
    for (const perm of PERMISSION_SEEDS) {
      await runQuery(
        'INSERT IGNORE INTO permissions (name, display_name, description) VALUES (?, ?, ?)',
        [perm.name, perm.display_name, perm.description]
      )
    }

    const placeholders = PERMISSION_SEEDS.map(() => '?').join(',')
    await runQuery(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r
      CROSS JOIN permissions p
      WHERE r.name = 'admin_sekretariat'
        AND p.name IN (${placeholders})
    `, PERMISSION_SEEDS.map(p => p.name))

    console.log(`OK Permission seeds checked (${PERMISSION_SEEDS.length} permissions)`)

  } catch (e: any) {
    console.warn('Permission seed skipped:', e.message)
  }
}
