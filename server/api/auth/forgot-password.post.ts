import { randomBytes, createHash } from 'crypto'
import { getQuery as dbGetOne, runQuery } from '../../database/db'
import { sendPasswordResetEmail } from '../../utils/email'

async function ensureResetTokenColumns() {
  try {
    const dbName = process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || 'stpaulus_cms_db'
    const col = await dbGetOne(
      `SELECT COLUMN_NAME FROM INFORMATION_SCHEMA.COLUMNS
       WHERE TABLE_SCHEMA = ? AND TABLE_NAME = 'users' AND COLUMN_NAME = 'password_reset_token'`,
      [dbName]
    ) as any
    if (!col) {
      await runQuery(`ALTER TABLE users
        ADD COLUMN password_reset_token VARCHAR(64) NULL DEFAULT NULL,
        ADD COLUMN password_reset_expires DATETIME NULL DEFAULT NULL`)
      console.log('[ForgotPassword] password_reset columns added to users table')
    }
  } catch (err) {
    console.error('[ForgotPassword] ensureResetTokenColumns error:', err)
  }
}

export default defineEventHandler(async (event) => {
  await ensureResetTokenColumns()

  const body = await readBody(event)
  const email = (body?.email || '').trim().toLowerCase()

  if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw createError({ statusCode: 400, statusMessage: 'Email tidak valid' })
  }

  // Look up user — only booking users (role_id IS NULL)
  const user = await dbGetOne(
    `SELECT id, full_name, username, account_status, role_id FROM users WHERE LOWER(email) = ? LIMIT 1`,
    [email]
  ) as any

  // Always return success to prevent user enumeration
  const ok = { message: 'Jika email terdaftar, link reset password telah dikirim.' }
  if (!user || (user.role_id && user.role_id > 0) || user.account_status !== 'ACTIVE') return ok

  // Generate secure random token; store its SHA-256 hash in DB
  const rawToken = randomBytes(32).toString('hex')
  const tokenHash = createHash('sha256').update(rawToken).digest('hex')
  const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour
  const expiresStr = expires.toISOString().slice(0, 19).replace('T', ' ')

  await runQuery(
    `UPDATE users SET password_reset_token = ?, password_reset_expires = ? WHERE id = ?`,
    [tokenHash, expiresStr, user.id]
  )

  const siteUrl = process.env.NUXT_PUBLIC_SITE_URL || 'https://stpaulusjuanda.org'
  const resetLink = `${siteUrl}/reset-password?token=${rawToken}&email=${encodeURIComponent(email)}`

  sendPasswordResetEmail({
    to: email,
    fullName: user.full_name || user.username,
    resetLink
  }).catch(err => console.error('[ForgotPassword] Email error:', err))

  return ok
})
