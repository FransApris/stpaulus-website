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

