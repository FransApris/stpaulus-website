import { createHash } from 'crypto'
import { getQuery as dbGetOne, runQuery } from '../../database/db'
import { hashPassword } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { token, email, password } = body

  if (!token || !email || !password) {
    throw createError({ statusCode: 400, statusMessage: 'Token, email, dan password diperlukan' })
  }
  if (password.length < 6) {
    throw createError({ statusCode: 400, statusMessage: 'Password minimal 6 karakter' })
  }

  const tokenHash = createHash('sha256').update(token).digest('hex')
  const normalizedEmail = email.trim().toLowerCase()

  const user = await dbGetOne(
    `SELECT id, password_reset_token, password_reset_expires FROM users
     WHERE LOWER(email) = ? AND password_reset_token = ? LIMIT 1`,
    [normalizedEmail, tokenHash]
  ) as any

  if (!user) {
    throw createError({ statusCode: 400, statusMessage: 'Link reset password tidak valid' })
  }

  if (!user.password_reset_expires || new Date(user.password_reset_expires) < new Date()) {
    // Clear expired token
    await runQuery(
      `UPDATE users SET password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?`,
      [user.id]
    )
    throw createError({ statusCode: 400, statusMessage: 'Link reset password sudah kadaluarsa. Silakan minta link baru.' })
  }

  const newHash = await hashPassword(password)
  await runQuery(
    `UPDATE users SET password_hash = ?, password_reset_token = NULL, password_reset_expires = NULL WHERE id = ?`,
    [newHash, user.id]
  )

  return { message: 'Password berhasil direset. Silakan login dengan password baru Anda.' }
})
