import { authenticateUser } from '../../utils/auth'
import { getQuery } from '../../database/db'
import { logger } from '../../utils/logger'
import { getRequestHeader } from 'h3'

export default defineEventHandler(async (event) => {
  const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0].trim()
    || getRequestHeader(event, 'x-real-ip')
    || 'unknown'

  try {
    const body = await readBody(event)

    const { username, password } = body

    if (!username || !password) {
      logger.security('Admin login attempt with missing credentials', { ip })
      throw createError({
        statusCode: 400,
        statusMessage: 'Username dan password diperlukan'
      })
    }

    console.log('[Admin Login] Attempting login for:', username)

    const result = await authenticateUser(username, password)

    if (!result) {
      console.log('[Admin Login] Authentication failed for:', username)
      logger.logFailedLogin(username, ip, 'Invalid credentials')
      throw createError({
        statusCode: 401,
        statusMessage: 'Username atau password salah'
      })
    }

    // Check if user has admin role and if they require password reset
    const userDetails = await getQuery('SELECT role_id, role, requires_password_reset FROM users WHERE id = ?', [result.user.id]) as { role_id?: number; role?: string; requires_password_reset?: number } | undefined

    console.log('[Admin Login] User details:', userDetails)

    // Check if password reset is forced (Clean Slate policy)
    if (userDetails && userDetails.requires_password_reset === 1) {
      console.log('[Admin Login] Access denied - Password reset required for:', username)
      logger.logUnauthorizedAccess('/api/admin/login', ip, result.user.id)
      logger.security('User attempted login but requires password reset', { username, ip, userId: result.user.id })
      throw createError({
        statusCode: 403,
        statusMessage: 'Demi keamanan paska-insiden, akun Anda diwajibkan untuk melakukan reset password. Silakan hubungi Super Admin Sekretariat.'
      })
    }

    // Admin must have role_id (assigned to roles table)
    // Users with only 'user' role (role_id = NULL or 0) cannot access admin panel
    if (!userDetails || !userDetails.role_id || userDetails.role_id === 0) {
      console.log('[Admin Login] Access denied - User is not an admin:', username)
      logger.logUnauthorizedAccess('/api/admin/login', ip, result.user.id)
      logger.security('Non-admin user attempted admin login', { username, ip, userId: result.user.id })
      throw createError({
        statusCode: 403,
        statusMessage: 'Akses ditolak. Anda tidak memiliki akses ke panel admin. Silakan gunakan halaman pemesanan ruangan.'
      })
    }

    console.log('[Admin Login] Login successful for admin:', username)
    logger.logSuccessfulLogin(username, ip, result.user.id)

    return result
  } catch (error: any) {
    console.error('[Admin Login] Error:', error)
    throw error
  }
})

