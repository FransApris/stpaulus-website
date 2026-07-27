import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, getUserPermissions } from '../../../utils/auth'
import { sendBookingCancelledEmail } from '../../../utils/email'

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

    const body = await readBody(event).catch(() => ({}))
    const cancellationReason = String(body?.cancellation_reason || '').trim()

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

      if (!cancellationReason || cancellationReason.length < 5) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Alasan pembatalan wajib diisi (minimal 5 karakter).'
        })
      }
    }

    // Soft-delete: set deleted_at & cancellation_reason
    await runQuery(
      'UPDATE bookings SET deleted_at = NOW(), status = \'CANCELLED\', cancellation_reason = ?, updated_at = NOW() WHERE id = ?',
      [cancellationReason || (isAdmin ? 'Dibatalkan oleh Admin' : 'Dibatalkan oleh Pemesan'), bookingId]
    )

    console.log('[DELETE BOOKING] Soft-deleted (cancelled):', { bookingId, deletedBy: isAdmin ? 'admin' : 'user' })

    // Fire-and-forget email notification to user
    setImmediate(async () => {
      try {
        const bookingDetails = await getQuery(`
          SELECT b.event_name, b.start_time, b.end_time, r.name as room_name, u.email, u.full_name
          FROM bookings b
          JOIN rooms r ON b.room_id = r.id
          LEFT JOIN users u ON b.user_id = u.id
          WHERE b.id = ?
        `, [bookingId]) as any

        if (bookingDetails?.email) {
          const toUTCStr = (s: any) => s ? String(s).replace(' ', 'T') + (String(s).endsWith('Z') ? '' : 'Z') : null
          const fmtTime = (raw: any) => new Date(toUTCStr(raw) as string).toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: false }).replace(':', '.')
          const fmtDate = (raw: any) => new Date(toUTCStr(raw) as string).toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' })

          await sendBookingCancelledEmail({
            to: bookingDetails.email,
            fullName: bookingDetails.full_name,
            eventName: bookingDetails.event_name,
            roomName: bookingDetails.room_name,
            startFormatted: fmtTime(bookingDetails.start_time),
            endFormatted: fmtTime(bookingDetails.end_time),
            dateFormatted: fmtDate(bookingDetails.start_time),
            cancellationReason: cancellationReason || undefined
          })
        }
      } catch (e) {
        console.error('[DELETE BOOKING] Email send error:', e)
      }
    })

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
