import { runQuery, getQuery as dbGetOne } from '../../../database/db'
import { requireAuth, requireUserManagementPermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId
  const queryParams = getQuery(event)
  const force = queryParams.force === 'true'

  // Check permissions using RBAC - only super admin can delete users
  requireUserManagementPermission(event)

  const targetUserId = getRouterParam(event, 'id')

  if (!targetUserId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'User ID diperlukan'
    })
  }

  // Prevent users from deleting themselves
  if (parseInt(targetUserId) === userId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Tidak dapat menghapus akun sendiri'
    })
  }

  // Check if user exists
  const user = await dbGetOne('SELECT id, username, role FROM users WHERE id = ?', [targetUserId]) as any
  if (!user) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pengguna tidak ditemukan'
    })
  }

  // Prevent deletion of super admin accounts (safety measure)
  if (user.role === 'super_admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Tidak dapat menghapus akun super admin'
    })
  }

  // Check if user has any active bookings
  const activeBookings = await dbGetOne(`
    SELECT COUNT(*) as count FROM bookings
    WHERE user_id = ? AND status IN ('PENDING', 'APPROVED')
  `, [targetUserId]) as any

  if (activeBookings.count > 0) {
    if (!force) {
      throw createError({
        statusCode: 409,
        statusMessage: 'Pengguna ini memiliki pemesanan aktif',
        data: { activeBookingCount: activeBookings.count }
      })
    }
    // force=true: cancel all active bookings before deletion
    await runQuery(
      `UPDATE bookings SET status = 'CANCELLED', cancellation_reason = 'Akun pengguna dihapus oleh admin'
       WHERE user_id = ? AND status IN ('PENDING', 'APPROVED')`,
      [targetUserId]
    )
  }

  // Delete the user
  const deleteResult = await runQuery('DELETE FROM users WHERE id = ?', [targetUserId])

  if ((deleteResult as any).affectedRows === 0) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pengguna tidak ditemukan atau sudah dihapus'
    })
  }

  return {
    message: `Pengguna ${user.username} berhasil dihapus`
  }
})
