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
    // Pastikan manage_liturgy_types dimiliki oleh admin_sekretariat
    await runQuery(`
      INSERT IGNORE INTO role_permissions (role_id, permission_id)
      SELECT r.id, p.id
      FROM roles r
      CROSS JOIN permissions p
      WHERE r.name = 'admin_sekretariat' AND p.name = 'manage_liturgy_types'
    `)
    console.log('✅ Permission migrations applied')
  } catch (e: any) {
    // Non-critical: lanjutkan meskipun gagal (tabel mungkin belum ada)
    console.warn('Permission migration skipped:', e.message)
  }
})
