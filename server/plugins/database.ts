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
    console.log('✅ Permission migrations applied (manage_liturgy_types + kronik.bgkp.* -> admin_sekretariat)')
  } catch (e: any) {
    // Non-critical: lanjutkan meskipun gagal (tabel mungkin belum ada)
    console.warn('Permission migration skipped:', e.message)
  }
})
