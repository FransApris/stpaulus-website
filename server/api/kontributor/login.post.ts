import { authenticateUser } from '../../utils/auth'
import { getQuery } from '../../database/db'
import { isBlocked, recordFailedAttempt, resetAttempts } from '../../utils/rateLimiter'
import { getRequestHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0].trim()
    || getRequestHeader(event, 'x-real-ip')
    || 'unknown'

  // Rate limit check
  const blockStatus = isBlocked(ip)
  if (blockStatus.blocked) {
    throw createError({
      statusCode: 429,
      statusMessage: `Terlalu banyak percobaan login. Coba lagi dalam ${blockStatus.retryAfter}.`
    })
  }

  try {
    const body = await readBody(event)
    const { username, password } = body

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username dan password diperlukan'
      })
    }

    // Authenticate
    const result = await authenticateUser(username, password)

    if (!result) {
      const attemptResult = recordFailedAttempt(ip, username)
      if (attemptResult.blocked) {
        throw createError({
          statusCode: 429,
          statusMessage: `Terlalu banyak percobaan login. Coba lagi dalam ${attemptResult.retryAfter}.`
        })
      }
      const warningMsg = attemptResult.attemptsLeft <= 2
        ? ` Sisa percobaan: ${attemptResult.attemptsLeft}.`
        : ''
      throw createError({
        statusCode: 401,
        statusMessage: `Username atau password salah.${warningMsg}`
      })
    }

    // Get user's role details
    const userDetails = await getQuery(
      'SELECT role_id, requires_password_reset FROM users WHERE id = ?',
      [result.user.id]
    ) as { role_id?: number; requires_password_reset?: number } | undefined

    // Check forced password reset
    if (userDetails?.requires_password_reset === 1) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Akun Anda diwajibkan untuk melakukan reset password. Silakan hubungi Admin.'
      })
    }

    // --- EXCLUSIVE CHECK: only kontributor_berita can use this login endpoint ---
    // Get the role name
    const roleInfo = await getQuery(
      'SELECT r.name FROM roles r JOIN users u ON u.role_id = r.id WHERE u.id = ?',
      [result.user.id]
    ) as { name?: string } | undefined

    if (!roleInfo || roleInfo.name !== 'kontributor_berita') {
      // This login page is ONLY for contributors
      // Admins should use /admin/login
      recordFailedAttempt(ip, username)
      throw createError({
        statusCode: 403,
        statusMessage: 'Akun ini tidak memiliki akses ke Portal Kontributor. Admin silakan gunakan halaman login CMS Admin.'
      })
    }

    resetAttempts(ip)

    return {
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      user: {
        id: result.user.id,
        username: result.user.username,
        role: roleInfo.name
      }
    }

  } catch (error: any) {
    if (error?.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan sistem. Coba beberapa saat lagi.'
    })
  }
})
