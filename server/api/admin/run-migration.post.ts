// API: Run a pending migration SQL file
// Path: POST /api/admin/run-migration
// Access: super_admin only
// Body: { migration: '007_add_agenda_id_to_announcements' }

import { readFileSync } from 'fs'
import { resolve } from 'path'
import { runQuery, getQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

const MIGRATIONS_DIR = resolve(process.cwd(), 'server/database/migrations')

// Allowed migrations whitelist – only explicitly listed files can be run
const ALLOWED_MIGRATIONS: Record<string, string> = {
  '007_add_agenda_id_to_announcements': '007_add_agenda_id_to_announcements.sql'
}

export default defineEventHandler(async (event) => {
  // Only super_admin
  const decoded = requireAuth(event)
  const user = await getQuery('SELECT role FROM users WHERE id = ?', [decoded.userId]) as any
  if (!user || user.role !== 'super_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Hanya super_admin yang dapat menjalankan migration' })
  }

  const body = await readBody(event)
  const { migration } = body

  if (!migration || !ALLOWED_MIGRATIONS[migration]) {
    throw createError({
      statusCode: 400,
      statusMessage: `Migration tidak dikenal. Migration yang tersedia: ${Object.keys(ALLOWED_MIGRATIONS).join(', ')}`
    })
  }

  const fileName = ALLOWED_MIGRATIONS[migration]
  const filePath = resolve(MIGRATIONS_DIR, fileName)

  let sql: string
  try {
    sql = readFileSync(filePath, 'utf-8')
  } catch {
    throw createError({ statusCode: 404, statusMessage: `File migration tidak ditemukan: ${fileName}` })
  }

  // Split by semicolon, filter empty lines, run each statement
  const statements = sql
    .split(';')
    .map(s => s.replace(/--.*$/gm, '').trim())
    .filter(s => s.length > 0)

  const results: { statement: string; status: string; error?: string }[] = []

  for (const statement of statements) {
    try {
      await runQuery(statement)
      results.push({ statement: statement.slice(0, 80) + (statement.length > 80 ? '...' : ''), status: 'ok' })
    } catch (err: any) {
      // Treat "Duplicate key name" / "Duplicate column name" as already-run (idempotent)
      const msg: string = err?.message || ''
      const alreadyExists =
        msg.includes('Duplicate column name') ||
        msg.includes('Duplicate key name') ||
        msg.includes('already exists')

      if (alreadyExists) {
        results.push({ statement: statement.slice(0, 80) + '...', status: 'skipped (already exists)' })
      } else {
        results.push({ statement: statement.slice(0, 80) + '...', status: 'error', error: msg })
        return {
          success: false,
          message: `Migration gagal di statement: ${msg}`,
          results
        }
      }
    }
  }

  console.log(`[Migration] ${migration} selesai`, results)

  return {
    success: true,
    message: `Migration "${migration}" berhasil dijalankan`,
    results
  }
})
