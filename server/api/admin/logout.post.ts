/**
 * server/api/admin/logout.post.ts
 *
 * POST /api/admin/logout
 * Clears all HttpOnly authentication cookies (auth_token, accessToken, refreshToken).
 */
import { clearAuthCookies } from '../../utils/auth'
import { logger } from '../../utils/logger'

export default defineEventHandler(async (event) => {
  clearAuthCookies(event)

  logger.info('[Auth] Admin logged out', {
    event: 'ADMIN_LOGOUT',
    timestamp: new Date().toISOString()
  })

  return {
    success: true,
    message: 'Logout berhasil. Semua cookie sesi telah dibersihkan.'
  }
})
