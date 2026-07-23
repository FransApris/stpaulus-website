/**
 * server/api/admin/auth/2fa/enable.post.ts
 *
 * POST /api/admin/auth/2fa/enable
 * Body: { token: '123456' }
 * Verifies test TOTP code, enables 2FA on account, and generates recovery backup codes.
 */
import { requireAuth } from '../../../../utils/auth'
import { getQuery, runQuery } from '../../../../database/db'
import { verifyTotpToken, generateBackupCodes, hashBackupCode } from '../../../../utils/totp'
import { logger } from '../../../../utils/logger'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const body = await readBody(event)

  const { token } = body
  if (!token) {
    throw createError({ statusCode: 400, statusMessage: 'Kode 6-digit 2FA diperlukan' })
  }

  const user = await getQuery(
    'SELECT username, totp_secret, totp_enabled FROM users WHERE id = ? LIMIT 1',
    [decoded.userId]
  ) as { username: string; totp_secret?: string; totp_enabled?: number } | undefined

  if (!user || !user.totp_secret) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Belum ada setup 2FA. Jalankan /api/admin/auth/2fa/setup terlebih dahulu.'
    })
  }

  // Verifikasi kode TOTP
  const isValid = verifyTotpToken(user.totp_secret, String(token).trim())
  if (!isValid) {
    logger.security('Failed 2FA activation attempt', {
      event: '2FA_ENABLE_FAILED',
      userId: decoded.userId,
      username: user.username
    })
    throw createError({
      statusCode: 400,
      statusMessage: 'Kode 2FA salah atau telah kadaluarsa. Pastikan jam perangkat Anda akurat.'
    })
  }

  // Generate 8 backup codes
  const plainBackupCodes = generateBackupCodes()
  const hashedBackupCodes = plainBackupCodes.map(c => hashBackupCode(c))

  // Aktifkan 2FA & simpan hashed backup codes
  await runQuery(
    'UPDATE users SET totp_enabled = 1, totp_backup_codes = ? WHERE id = ?',
    [JSON.stringify(hashedBackupCodes), decoded.userId]
  )

  logger.security('2FA successfully enabled for user', {
    event: '2FA_ENABLED',
    userId: decoded.userId,
    username: user.username
  })

  return {
    success: true,
    message: 'Autentikasi Dua Langkah (2FA) berhasil diaktifkan.',
    backupCodes: plainBackupCodes
  }
})
