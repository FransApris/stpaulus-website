import { getConnection, getQuery } from '../../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../../utils/auth'

/**
 * PUT /api/admin/bookings/:id
 *
 * Admin endpoint untuk mengubah status booking (APPROVED / REJECTED).
 *
 * Fix: Endpoint lama langsung UPDATE tanpa conflict check, tanpa transaction,
 * dan tanpa validasi status-transition — menjadi backdoor double-booking.
 * Sekarang disamakan keamanannya dengan PATCH endpoint (/api/bookings/[id].patch.ts):
 *  - Database transaction + SELECT FOR UPDATE (row-level lock)
 *  - Conflict check sebelum APPROVE
 *  - Validasi status-transition (hanya PENDING yang bisa di-APPROVE/REJECT)
 *  - Validasi end_time > start_time sebelum APPROVE
 */
export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const userId = decoded.userId

    // Set auth context untuk permission checking
    const user = await getQuery('SELECT role_id FROM users WHERE id = ?', [userId])
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }
    const permissions = await getUserPermissions(user)
    event.context.auth = { userId, permissions }

    requirePermission('manage_bookings')(event)

    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({ statusCode: 400, statusMessage: 'Booking ID is required' })
    }

    const body = await readBody(event)
    const { status, rejection_reason } = body

    // Validasi status
    if (!status || !['APPROVED', 'REJECTED'].includes(status)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Status must be APPROVED or REJECTED'
      })
    }

    if (status === 'REJECTED' && !rejection_reason?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Alasan penolakan diperlukan' })
    }

    // Gunakan dedicated connection untuk transaction
    const conn = await getConnection()

    try {
      await conn.beginTransaction()

      // Lock baris target agar concurrent APPROVE tidak bisa lolos bersamaan
      const [bookingRows] = await conn.query(
        'SELECT * FROM bookings WHERE id = ? FOR UPDATE',
        [id]
      ) as any

      const booking = bookingRows[0]
      if (!booking) {
        await conn.rollback()
        throw createError({ statusCode: 404, statusMessage: 'Booking not found' })
      }

      // Validasi status-transition: hanya PENDING yang bisa diubah
      if (booking.status !== 'PENDING') {
        await conn.rollback()
        throw createError({
          statusCode: 400,
          statusMessage: 'Hanya pemesanan PENDING yang dapat disetujui/ditolak'
        })
      }

      // Jika APPROVE, lakukan validasi tambahan
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

        // Conflict check di dalam transaction yang sama (dengan row lock aktif)
        const [conflictRows] = await conn.query(
          `SELECT id, event_name, start_time, end_time
           FROM bookings
           WHERE room_id = ?
             AND status = 'APPROVED'
             AND id != ?
             AND deleted_at IS NULL
             AND NOT (end_time <= ? OR start_time >= ?)`,
          [booking.room_id, id, booking.start_time, booking.end_time]
        ) as any

        if (conflictRows.length > 0) {
          const conflicting = conflictRows[0]
          await conn.rollback()
          throw createError({
            statusCode: 409,
            statusMessage: `Konflik waktu dengan pemesanan yang sudah disetujui: "${conflicting.event_name}" (${conflicting.start_time} – ${conflicting.end_time})`
          })
        }
      }

      // Update status booking
      await conn.query(
        `UPDATE bookings
         SET status = ?, rejection_reason = ?, updated_at = NOW()
         WHERE id = ?`,
        [status, status === 'REJECTED' ? (rejection_reason || null) : null, id]
      )

      await conn.commit()

      console.log('[Admin PUT Booking] Success:', { id, status, userId })

      return { message: 'Booking status updated successfully' }

    } catch (txError) {
      await conn.rollback().catch(() => {})
      throw txError
    } finally {
      conn.release()
    }

  } catch (error: any) {
    console.error('[Admin PUT Booking] Error:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
