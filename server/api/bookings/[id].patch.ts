import { runQuery, getQuery } from '../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    console.log('[APPROVE/REJECT BOOKING] Starting...')
    
    const decoded = requireAuth(event)
    const userId = decoded.userId

    // Set auth context for permission checking
    const user = await getQuery('SELECT role_id FROM users WHERE id = ?', [userId])
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }
    const permissions = await getUserPermissions(user)
    console.log('[APPROVE/REJECT BOOKING] User permissions:', permissions)
    event.context.auth = {
      userId: userId,
      permissions: permissions
    }

    // Check permissions using RBAC
    requirePermission('manage_bookings')(event)

    const bookingId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status, rejection_reason, cancellation_reason } = body
    
    console.log('[APPROVE/REJECT/CANCEL BOOKING] Request:', { bookingId, status, rejection_reason, cancellation_reason })

    // Validate status
    type BookingStatus = 'APPROVED' | 'REJECTED' | 'CANCELLED'
    if (!['APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status tidak valid'
      })
    }

    // Check if booking exists
    console.log('[APPROVE/REJECT BOOKING] Fetching booking data...')
    const booking = await getQuery('SELECT * FROM bookings WHERE id = ?', [bookingId]) as any
    console.log('[APPROVE/REJECT BOOKING] Booking data:', booking)
    
    if (!booking) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pemesanan tidak ditemukan'
      })
    }

    // Validasi status transition
    if (status === 'APPROVED' || status === 'REJECTED') {
      // Untuk approve/reject, booking harus PENDING
      if (booking.status !== 'PENDING') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Hanya pemesanan PENDING yang dapat disetujui/ditolak'
        })
      }
    } else if (status === 'CANCELLED') {
      // Untuk cancel, booking harus APPROVED
      if (booking.status !== 'APPROVED') {
        throw createError({
          statusCode: 400,
          statusMessage: 'Hanya pemesanan APPROVED yang dapat dibatalkan'
        })
      }
    }

    if (status === 'REJECTED' && !rejection_reason) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Alasan penolakan diperlukan'
      })
    }

    // If approving, check for conflicts again (in case another booking was approved)
    if (status === 'APPROVED') {
      console.log('[APPROVE BOOKING] Checking for conflicts...')
      const conflictResult = await runQuery(`
        SELECT COUNT(*) as count FROM bookings
        WHERE room_id = ? AND status = 'APPROVED' AND id != ?
        AND NOT (end_time <= ? OR start_time >= ?)
      `, [booking.room_id, bookingId, booking.start_time, booking.end_time]) as any

      console.log('[APPROVE BOOKING] Raw conflict result:', conflictResult)

      // runQuery returns rows directly (already unwrapped)
      const conflicts = conflictResult
      const conflictCount = conflicts[0]?.count || 0

      console.log('[APPROVE BOOKING] Conflict check:', { conflictCount, bookingId, roomId: booking.room_id })

      if (conflictCount > 0) {
        throw createError({
          statusCode: 409,
          statusMessage: 'Konflik dengan pemesanan lain yang sudah disetujui'
        })
      }
    }

    // Update booking
    console.log('[APPROVE/REJECT/CANCEL BOOKING] Updating booking...')
    
    let updateQuery = ''
    let updateParams = []
    
    if (status === 'CANCELLED') {
      // Update dengan cancellation_reason jika ada
      updateQuery = `
        UPDATE bookings SET status = ?, cancellation_reason = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      updateParams = [status, cancellation_reason || null, bookingId]
    } else {
      // Update dengan rejection_reason untuk reject
      updateQuery = `
        UPDATE bookings SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `
      updateParams = [status, rejection_reason || null, bookingId]
    }
    
    await runQuery(updateQuery, updateParams)

    console.log('[APPROVE/REJECT/CANCEL BOOKING] Success:', { bookingId, status })

    const statusMessages: Record<BookingStatus, string> = {
      'APPROVED': 'disetujui',
      'REJECTED': 'ditolak',
      'CANCELLED': 'dibatalkan'
    }

    return {
      message: `Pemesanan ${statusMessages[status as BookingStatus]}`
    }
  } catch (error: any) {
    console.error('[APPROVE/REJECT BOOKING] Error details:', {
      message: error.message,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage,
      stack: error.stack,
      fullError: error
    })
    
    // If it's already a createError, rethrow it
    if (error.statusCode) {
      throw error
    }
    
    // Otherwise wrap it
    throw createError({
      statusCode: 500,
      statusMessage: `Terjadi kesalahan: ${error.message || 'Unknown error'}`
    })
  }
})
