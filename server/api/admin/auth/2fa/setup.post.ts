/**
 * server/api/admin/auth/2fa/setup.post.ts
 *
 * POST /api/admin/auth/2fa/setup
 * Generates a new TOTP secret for the current user and returns setup details.
 * The secret is temporarily stored on the user record until confirmed via /enable.
 */
import { requireAuth } from '../../../../utils/auth'
import { getQuery, runQuery } from '../../../../database/db'
import { generateTotpSecret } from '../../../../utils/totp'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)

  const user = await getQuery(
    'SELECT username, totp_enabled FROM users WHERE id = ? LIMIT 1',
    [decoded.userId]
  ) as { username: string; totp_enabled?: number } | undefined

  if (!user) {
    throw createError({ statusCode: 404, statusMessage: 'User tidak ditemukan' })
  }

  if (user.totp_enabled === 1) {
    throw createError({
      statusCode: 400,
      statusMessage: '2FA sudah aktif pada akun Anda. Nonaktifkan terlebih dahulu jika ingin mengatur ulang.'
    })
  }

  const { secret, otpauthUrl } = generateTotpSecret(user.username)

  // Simpan secret sementara ke database
  await runQuery(
    'UPDATE users SET totp_secret = ? WHERE id = ?',
    [secret, decoded.userId]
  )

  return {
    secret,
    otpauthUrl
  }
})
