import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, getUserPermissions } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    console.log('[DELETE BOOKING] Starting...')
    
    const decoded = requireAuth(event)
    const userId = decoded.userId
    const bookingId = getRouterParam(event, 'id')
    
    console.log('[DELETE BOOKING] Request:', { bookingId, userId })

    // Check if booking exists
    const booking = await getQuery('SELECT * FROM bookings WHERE id = ?', [bookingId]) as any
    
    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pemesanan tidak ditemukan'
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

    // Delete the booking
    await runQuery('DELETE FROM bookings WHERE id = ?', [bookingId])

    console.log('[DELETE BOOKING] Success:', { bookingId, deletedBy: isAdmin ? 'admin' : 'user' })

    return {
      message: isAdmin ? 'Pemesanan berhasil dihapus oleh admin' : 'Pemesanan berhasil dibatalkan'
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
