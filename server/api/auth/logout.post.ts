/**
 * server/api/auth/logout.post.ts
 *
 * POST /api/auth/logout
 * Clears all HttpOnly authentication cookies for users.
 */
import { clearAuthCookies } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  clearAuthCookies(event)

  return {
    success: true,
    message: 'Logout berhasil.'
  }
})
