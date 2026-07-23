/**
 * server/api/admin/auth/2fa/status.get.ts
 *
 * GET /api/admin/auth/2fa/status
 * Returns 2FA activation status for current logged-in user.
 */
import { requireAuth } from '../../../../utils/auth'
import { getQuery } from '../../../../database/db'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)

  const user = await getQuery(
    'SELECT totp_enabled FROM users WHERE id = ? LIMIT 1',
    [decoded.userId]
  ) as { totp_enabled?: number } | undefined

  return {
    totpEnabled: Boolean(user && user.totp_enabled === 1)
  }
})
