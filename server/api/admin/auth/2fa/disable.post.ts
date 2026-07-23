/**
 * server/api/admin/auth/2fa/disable.post.ts
 *
 * POST /api/admin/auth/2fa/disable
 * Body: { password: 'currentpassword', token: '123456' }
 * Disables 2FA (requires current account password and current 2FA code for security).
 */
import { requireAuth, verifyPassword } from '../../../../utils/auth'
import { getQuery, runQuery } from '../../../../database/db'
import { verifyTotpToken } from '../../../../utils/totp'
import { logger } from '../../../../utils/logger'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const body = await readBody(event)

  const { password, token } = body
  if (!password || !token) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password dan kode 2FA diperlukan untuk mematikan 2FA'
    })
  }

  const user = await getQuery(
    'SELECT username, password_hash, totp_secret, totp_enabled FROM users WHERE id = ? LIMIT 1',
    [decoded.userId]
  ) as { username: string; password_hash: string; totp_secret?: string; totp_enabled?: number } | undefined

  if (!user || user.totp_enabled !== 1 || !user.totp_secret) {
    throw createError({ statusCode: 400, statusMessage: '2FA belum aktif pada akun Anda' })
  }

  // Verifikasi password
  const validPassword = await verifyPassword(password, user.password_hash)
  if (!validPassword) {
    throw createError({ statusCode: 401, statusMessage: 'Password salah' })
  }

  // Verifikasi token 2FA
  const validToken = verifyTotpToken(user.totp_secret, String(token).trim())
  if (!validToken) {
    throw createError({ statusCode: 400, statusMessage: 'Kode 2FA salah' })
  }

  // Nonaktifkan 2FA & bersihkan secret
  await runQuery(
    'UPDATE users SET totp_enabled = 0, totp_secret = NULL, totp_backup_codes = NULL WHERE id = ?',
    [decoded.userId]
  )

  logger.security('2FA disabled by user', {
    event: '2FA_DISABLED',
    userId: decoded.userId,
    username: user.username
  })

  return {
    success: true,
    message: '2FA berhasil dinonaktifkan.'
  }
})
