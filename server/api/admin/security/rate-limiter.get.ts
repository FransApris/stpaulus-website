/**
 * server/api/admin/security/rate-limiter.get.ts
 *
 * API endpoint untuk melihat status rate limiter saat ini.
 * Hanya bisa diakses oleh super_admin.
 *
 * GET /api/admin/security/rate-limiter
 */
import { requireAuth } from '../../../utils/auth'
import { getRateLimiterStatus, manualBlock, manualUnblock, RATE_LIMIT_CONFIG } from '../../../utils/rateLimiter'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  // Hanya super_admin yang boleh akses
  const decoded = requireAuth(event)
  if (decoded.role !== 'super_admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak. Hanya Super Admin yang dapat melihat status rate limiter.'
    })
  }

  const status = getRateLimiterStatus()

  return {
    config: RATE_LIMIT_CONFIG,
    summary: {
      totalMonitored: status.length,
      currentlyBlocked: status.filter(s => s.blocked).length,
      totalWithFailures: status.filter(s => s.count > 0).length
    },
    entries: status
  }
})
