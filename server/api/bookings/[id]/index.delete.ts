import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, getUserPermissions } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    console.log('[DELETE BOOKING] Starting...')
    
    const decoded = requireAuth(event)
    const userId = decoded.userId
    const bookingId = getRouterParam(event, 'id')
    
    console.log('[DELETE BOOKING] Request:', { bookingId, userId })

    // Check if booking exists and has not already been soft-deleted
    const booking = await getQuery(
      'SELECT * FROM bookings WHERE id = ? AND deleted_at IS NULL',
      [bookingId]
    ) as any
    
    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pemesanan tidak ditemukan atau sudah dihapus'
      })
    }

    // Check if user is admin
    const user = await getQuery('SELECT role_id FROM users WHERE id = ?', [userId])
    const permissions = await getUserPermissions(user)
    const isAdmin = permissions.includes('manage_bookings')

    console.log('[DELETE BOOKING] User check:', { userId, isAdmin, bookingOwner: booking.user_id })

    // If not admin, only allow owner to delete PENDING bookings
    if (!isAdmin) {
      if (booking.user_id !== userId) {
        throw createError({
          statusCode: 403,
          statusMessage: 'Anda tidak memiliki akses untuk membatalkan pemesanan ini'
        })
      }

      if (booking.status !== 'PENDING') {
        throw createError({
          statusCode: 400,
          statusMessage: `Tidak dapat membatalkan pemesanan dengan status ${booking.status}. Hanya pemesanan PENDING yang dapat dibatalkan.`
        })
      }
    }
    // Admin can delete any booking regardless of status

    // Soft-delete: set deleted_at instead of permanent DELETE
    // This preserves audit history while hiding the booking from active lists.
    await runQuery(
      'UPDATE bookings SET deleted_at = NOW(), status = \'CANCELLED\', updated_at = NOW() WHERE id = ?',
      [bookingId]
    )

    console.log('[DELETE BOOKING] Soft-deleted (cancelled):', { bookingId, deletedBy: isAdmin ? 'admin' : 'user' })

    return {
      message: isAdmin ? 'Pemesanan berhasil dibatalkan oleh admin' : 'Pemesanan berhasil dibatalkan'
    }
  } catch (error: any) {
    console.error('[DELETE BOOKING] Error:', error)
    
    if (error.statusCode) {
      throw error
    }
    
    throw createError({
      statusCode: 500,
      statusMessage: `Terjadi kesalahan: ${error.message || 'Unknown error'}`
    })
  }
})
