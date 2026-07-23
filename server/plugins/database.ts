import { initDatabase, runQuery } from '../database/db'

export default defineNitroPlugin(async () => {
  // Initialize database on server start
  try {
    await initDatabase()
    console.log('Database initialized successfully')
  } catch (error) {
    console.error('Database initialization failed:', error)
    return
  }

  // Idempotent permission migrations (INSERT IGNORE = aman dijalankan berulang kali)
  try {
    // 1. Pastikan permission manage_liturgy_types ada di tabel permissions
    await runQuery(`
      INSERT IGNORE INTO permissions (name, display_name, description)
      VALUES ('manage_liturgy_types', 'Kelola Jenis Liturgi', 'Manage liturgy types for mass schedules')
    `)

    // 2. Assign manage_liturgy_types ke role admin_sekretariat
    await runQuery(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r
      CROSS JOIN permissions p
      WHERE r.name = 'admin_sekretariat' AND p.name = 'manage_liturgy_types'
    `)

    // 3. Pastikan semua permission kronik.bgkp.* ada di tabel permissions
    const bgkpPermissions = [
      ['kronik.bgkp.view', 'View Kronik BGKP', 'Melihat data BGKP'],
      ['kronik.bgkp.create', 'Create Kronik BGKP', 'Membuat data BGKP'],
      ['kronik.bgkp.edit', 'Edit Kronik BGKP', 'Mengedit data BGKP'],
      ['kronik.bgkp.delete', 'Delete Kronik BGKP', 'Menghapus data BGKP'],
      ['kronik.bgkp.publish', 'Publish Kronik BGKP', 'Mempublikasi data BGKP']
    ]
    for (const [name, display, desc] of bgkpPermissions) {
      await runQuery(`
        INSERT IGNORE INTO permissions (name, display_name, description)
        VALUES (?, ?, ?)
      `, [name, display, desc])
    }

    // 4. Assign semua kronik.bgkp.* ke role admin_sekretariat
    await runQuery(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r
      CROSS JOIN permissions p
      WHERE r.name = 'admin_sekretariat' AND p.name LIKE 'kronik.bgkp.%'
    `)

    // 5. Pastikan permission kronik.wilayah.* dan kronik.lingkungan.* ada
    const teritorialPermissions = [
      ['kronik.wilayah.view', 'View Kronik Wilayah', 'Melihat data wilayah'],
      ['kronik.wilayah.create', 'Create Kronik Wilayah', 'Membuat data wilayah'],
      ['kronik.wilayah.edit', 'Edit Kronik Wilayah', 'Mengedit data wilayah'],
      ['kronik.wilayah.delete', 'Delete Kronik Wilayah', 'Menghapus data wilayah'],
      ['kronik.wilayah.publish', 'Publish Kronik Wilayah', 'Mempublikasi data wilayah'],
      ['kronik.lingkungan.view', 'View Kronik Lingkungan', 'Melihat data lingkungan'],
      ['kronik.lingkungan.create', 'Create Kronik Lingkungan', 'Membuat data lingkungan'],
      ['kronik.lingkungan.edit', 'Edit Kronik Lingkungan', 'Mengedit data lingkungan'],
      ['kronik.lingkungan.delete', 'Delete Kronik Lingkungan', 'Menghapus data lingkungan'],
      ['kronik.lingkungan.publish', 'Publish Kronik Lingkungan', 'Mempublikasi data lingkungan']
    ]
    for (const [name, display, desc] of teritorialPermissions) {
      await runQuery(`
        INSERT IGNORE INTO permissions (name, display_name, description)
        VALUES (?, ?, ?)
      `, [name, display, desc])
    }

    // 6. Assign kronik.wilayah.* dan kronik.lingkungan.* ke role admin_sekretariat
    await runQuery(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r
      CROSS JOIN permissions p
      WHERE r.name = 'admin_sekretariat'
        AND (p.name LIKE 'kronik.wilayah.%' OR p.name LIKE 'kronik.lingkungan.%')
    `)
    // 7. Migrasi 2FA (TOTP) untuk tabel users
    const checkTotpColumn = await runQuery(`
      SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
      WHERE TABLE_NAME = 'users' AND COLUMN_NAME = 'totp_secret'
    `) as any
    if (!checkTotpColumn || checkTotpColumn.length === 0) {
      await runQuery(`
        ALTER TABLE users
        ADD COLUMN totp_secret VARCHAR(255) NULL,
        ADD COLUMN totp_enabled TINYINT(1) NOT NULL DEFAULT 0,
        ADD COLUMN totp_backup_codes TEXT NULL
      `)
      console.log('✅ Migration 033: Added TOTP 2FA columns to users table')
    }

    console.log('✅ Database migrations checked & applied successfully')
  } catch (e: any) {
    // Non-critical: lanjutkan meskipun gagal (tabel mungkin belum ada)
    console.warn('Permission migration skipped:', e.message)
  }
})

