import { getConnection, getQuery } from '../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    console.log('[APPROVE/REJECT BOOKING] Starting...')

    const decoded = requireAuth(event)
    const userId = decoded.userId

    // Set auth context for permission checking
    const user = await getQuery('SELECT role_id FROM users WHERE id = ?', [userId])
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }
    const permissions = await getUserPermissions(user)
    event.context.auth = { userId, permissions }

    requirePermission('manage_bookings')(event)

    const bookingId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status, rejection_reason, cancellation_reason } = body

    console.log('[APPROVE/REJECT/CANCEL BOOKING] Request:', { bookingId, status })

    // ── Basic validation ──────────────────────────────────────────────────────
    type BookingStatus = 'APPROVED' | 'REJECTED' | 'CANCELLED'
    if (!['APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) {
      throw createError({ statusCode: 400, statusMessage: 'Status tidak valid' })
    }

    if (status === 'REJECTED' && !rejection_reason?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Alasan penolakan diperlukan' })
    }

    // ── Acquire a dedicated connection for the transaction ────────────────────
    const conn = await getConnection()

    try {
      await conn.beginTransaction()

      // Lock the target booking row so concurrent APPROVE requests cannot
      // both pass the conflict check at the same time (prevents race condition).
      const [bookingRows] = await conn.query(
        'SELECT * FROM bookings WHERE id = ? FOR UPDATE',
        [bookingId]
      ) as any

      const booking = bookingRows[0]
      if (!booking) {
        await conn.rollback()
        throw createError({ statusCode: 404, statusMessage: 'Pemesanan tidak ditemukan' })
      }

      console.log('[APPROVE/REJECT BOOKING] Booking data:', {
        id: booking.id, status: booking.status,
        start: booking.start_time, end: booking.end_time
      })

      // ── Status transition validation ────────────────────────────────────────
      if (status === 'APPROVED' || status === 'REJECTED') {
        if (booking.status !== 'PENDING') {
          await conn.rollback()
          throw createError({
            statusCode: 400,
            statusMessage: 'Hanya pemesanan PENDING yang dapat disetujui/ditolak'
          })
        }
      } else if (status === 'CANCELLED') {
        if (booking.status !== 'APPROVED') {
          await conn.rollback()
          throw createError({
            statusCode: 400,
            statusMessage: 'Hanya pemesanan APPROVED yang dapat dibatalkan'
          })
        }
      }

      // ── Fix #2: Validate end_time > start_time before APPROVE ───────────────
      if (status === 'APPROVED') {
        const startMs = new Date(booking.start_time).getTime()
        const endMs   = new Date(booking.end_time).getTime()

        if (isNaN(startMs) || isNaN(endMs) || endMs <= startMs) {
          await conn.rollback()
          throw createError({
            statusCode: 400,
            statusMessage: 'Data pemesanan tidak valid: waktu selesai harus setelah waktu mulai'
          })
        }

        // ── Fix #1: Conflict check inside the same transaction (with row lock) ─
        // Any concurrent APPROVE for the same room/time will block here until
        // the first transaction commits or rolls back.
        console.log('[APPROVE BOOKING] Checking for time conflicts (inside transaction)...')
        const [conflictRows] = await conn.query(
          `SELECT id, event_name, start_time, end_time
           FROM bookings
           WHERE room_id = ?
             AND status = 'APPROVED'
             AND id != ?
             AND deleted_at IS NULL
             AND NOT (end_time <= ? OR start_time >= ?)`,
          [booking.room_id, bookingId, booking.start_time, booking.end_time]
        ) as any

        const conflictCount = conflictRows.length

        console.log('[APPROVE BOOKING] Conflict check result:', {
          conflictCount,
          bookingId,
          roomId: booking.room_id
        })

        if (conflictCount > 0) {
          const conflicting = conflictRows[0]
          await conn.rollback()
          throw createError({
            statusCode: 409,
            statusMessage: `Konflik waktu dengan pemesanan lain yang sudah disetujui: "${conflicting.event_name}" (${conflicting.start_time} – ${conflicting.end_time})`
          })
        }
      }

      // ── Update booking status ────────────────────────────────────────────────
      let updateQuery: string
      let updateParams: any[]

      if (status === 'CANCELLED') {
        updateQuery = `
          UPDATE bookings
          SET status = ?, cancellation_reason = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `
        updateParams = [status, cancellation_reason || null, bookingId]
      } else {
        updateQuery = `
          UPDATE bookings
          SET status = ?, rejection_reason = ?, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `
        updateParams = [status, rejection_reason || null, bookingId]
      }

      await conn.query(updateQuery, updateParams)
      await conn.commit()

      console.log('[APPROVE/REJECT/CANCEL BOOKING] Success:', { bookingId, status })

    } catch (txError) {
      // Rollback on any error inside the transaction
      await conn.rollback().catch(() => {})
      throw txError
    } finally {
      conn.release()
    }

    const statusMessages: Record<BookingStatus, string> = {
      APPROVED: 'disetujui',
      REJECTED: 'ditolak',
      CANCELLED: 'dibatalkan'
    }

    return { message: `Pemesanan ${statusMessages[status as BookingStatus]}` }

  } catch (error: any) {
    console.error('[APPROVE/REJECT BOOKING] Error:', {
      message: error.message,
      statusCode: error.statusCode,
      statusMessage: error.statusMessage
    })

    if (error.statusCode) throw error

    throw createError({
      statusCode: 500,
      statusMessage: `Terjadi kesalahan: ${error.message || 'Unknown error'}`
    })
  }
})
