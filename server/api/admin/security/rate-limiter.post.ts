/**
 * server/api/admin/security/rate-limiter.post.ts
 *
 * API untuk manual block / unblock IP oleh super_admin.
 *
 * POST /api/admin/security/rate-limiter
 * Body: { action: 'block' | 'unblock', ip: string, reason?: string }
 */
import { requireAuth } from '../../../utils/auth'
import { manualBlock, manualUnblock } from '../../../utils/rateLimiter'
import { logger } from '../../../utils/logger'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  if (decoded.role !== 'super_admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak. Hanya Super Admin yang dapat mengelola rate limiter.'
    })
  }

  const body = await readBody(event)
  const { action, ip, reason } = body

  if (!action || !ip) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field "action" (block/unblock) dan "ip" wajib diisi.'
    })
  }

  // Validasi format IP sederhana
  const ipRegex = /^(\d{1,3}\.){3}\d{1,3}$|^([0-9a-fA-F]{0,4}:){2,7}[0-9a-fA-F]{0,4}$/
  if (!ipRegex.test(ip)) {
    throw createError({ statusCode: 400, statusMessage: 'Format IP address tidak valid.' })
  }

  if (action === 'block') {
    manualBlock(ip, reason || `Manual block by admin ${decoded.username} at ${new Date().toISOString()}`)
    logger.security('Admin manually blocked IP', {
      event: 'ADMIN_MANUAL_BLOCK',
      targetIp: ip,
      adminId: decoded.userId,
      adminUsername: decoded.username,
      reason
    })
    return { success: true, message: `IP ${ip} berhasil diblokir.` }
  }

  if (action === 'unblock') {
    manualUnblock(ip)
    logger.security('Admin manually unblocked IP', {
      event: 'ADMIN_MANUAL_UNBLOCK',
      targetIp: ip,
      adminId: decoded.userId,
      adminUsername: decoded.username
    })
    return { success: true, message: `IP ${ip} berhasil di-unblock.` }
  }

  throw createError({ statusCode: 400, statusMessage: 'Action tidak valid. Gunakan "block" atau "unblock".' })
})
