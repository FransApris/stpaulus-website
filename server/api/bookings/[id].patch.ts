import { getConnection, getQuery } from '../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../utils/auth'
import { sendBookingApprovedEmail, sendBookingRejectedEmail, sendBookingCancelledEmail } from '../../utils/email'

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

    // ── Bug #7A fix: CANCELLED bisa dilakukan oleh pemilik booking sendiri ────
    // APPROVED/REJECTED hanya untuk admin yang punya manage_bookings permission
    const isAdmin = permissions.includes('manage_bookings')

    if (status === 'APPROVED' || status === 'REJECTED') {
      // Hanya admin yang bisa approve/reject
      requirePermission('manage_bookings')(event)
    }
    // CANCELLED bisa dilakukan admin ATAU user yang punya booking tersebut
    // Validasi ownership dilakukan setelah ambil data booking di bawah

    if (status === 'CANCELLED' && !isAdmin) {
      // Untuk user biasa: alasan pembatalan wajib diisi
      if (!cancellation_reason?.trim() || cancellation_reason.trim().length < 5) {
        throw createError({ statusCode: 400, statusMessage: 'Alasan pembatalan wajib diisi (minimal 5 karakter).' })
      }
    }

    // ── Acquire a dedicated connection for the transaction ────────────────────
    const conn = await getConnection()

    try {
      await conn.beginTransaction()

      // Lock the target booking row so concurrent APPROVE requests cannot
      // both pass the conflict check at the same time (prevents race condition).
      // Also filter deleted_at IS NULL to block operations on soft-deleted bookings.
      const [bookingRows] = await conn.query(
        'SELECT * FROM bookings WHERE id = ? AND deleted_at IS NULL FOR UPDATE',
        [bookingId]
      ) as any

      const booking = bookingRows[0]
      if (!booking) {
        await conn.rollback()
        throw createError({ statusCode: 404, statusMessage: 'Pemesanan tidak ditemukan atau sudah dihapus' })
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
        if (!isAdmin) {
          // User biasa: hanya bisa cancel miliknya sendiri, dan hanya yang PENDING
          if (booking.user_id !== userId) {
            await conn.rollback()
            throw createError({ statusCode: 403, statusMessage: 'Anda tidak memiliki akses untuk membatalkan pemesanan ini' })
          }
          if (booking.status !== 'PENDING') {
            await conn.rollback()
            throw createError({
              statusCode: 400,
              statusMessage: `Tidak dapat membatalkan pemesanan dengan status ${booking.status}. Hanya pemesanan PENDING yang dapat dibatalkan oleh pemesan.`
            })
          }
        } else {
          // Admin bisa cancel PENDING atau APPROVED
          if (!['PENDING', 'APPROVED'].includes(booking.status)) {
            await conn.rollback()
            throw createError({
              statusCode: 400,
              statusMessage: 'Hanya pemesanan PENDING atau APPROVED yang dapat dibatalkan'
            })
          }
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

          // Format times to WIB for readable error message
          const formatWIBTime = (dt: Date | string) => {
            const d = dt instanceof Date ? dt : new Date(String(dt).replace(' ', 'T') + (String(dt).endsWith('Z') ? '' : 'Z'))
            return d.toLocaleTimeString('id-ID', {
              hour: '2-digit', minute: '2-digit',
              timeZone: 'Asia/Jakarta', hour12: false
            }).replace(':', '.')
          }
          const formatWIBDate = (dt: Date | string) => {
            const d = dt instanceof Date ? dt : new Date(String(dt).replace(' ', 'T') + (String(dt).endsWith('Z') ? '' : 'Z'))
            return d.toLocaleDateString('id-ID', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
              timeZone: 'Asia/Jakarta'
            })
          }

          const startFormatted = formatWIBTime(conflicting.start_time)
          const endFormatted = formatWIBTime(conflicting.end_time)
          const dateFormatted = formatWIBDate(conflicting.start_time)

          throw createError({
            statusCode: 409,
            statusMessage: `Konflik waktu dengan pemesanan lain yang sudah disetujui: "${conflicting.event_name}" pada ${dateFormatted} pukul ${startFormatted} – ${endFormatted}`
          })
        }
      }

      // ── Update booking status ────────────────────────────────────────────────
      let updateQuery: string
      let updateParams: any[]

      if (status === 'CANCELLED') {
        updateQuery = `
          UPDATE bookings
          SET status = ?, cancellation_reason = ?, is_read = 0, updated_at = CURRENT_TIMESTAMP
          WHERE id = ?
        `
        updateParams = [status, cancellation_reason || null, bookingId]
      } else {
        updateQuery = `
          UPDATE bookings
          SET status = ?, rejection_reason = ?, is_read = 0, updated_at = CURRENT_TIMESTAMP
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

    // ── Fire-and-forget email notifications ──────────────────────────────────
    // Fetch booking + user details outside the transaction (already committed)
    if (status === 'APPROVED' || status === 'REJECTED' || status === 'CANCELLED') {
      setImmediate(async () => {
        try {
          const bookingData = await getQuery(`
            SELECT b.id, b.event_name, b.start_time, b.end_time,
                   b.rejection_reason, b.cancellation_reason, r.name AS room_name,
                   u.email, u.full_name
            FROM bookings b
            JOIN rooms r ON b.room_id = r.id
            JOIN users u ON b.user_id = u.id
            WHERE b.id = ?
          `, [bookingId]) as any

          if (!bookingData?.email) return

          const toUTCStr = (s: any) =>
            s ? String(s).replace(' ', 'T') + (String(s).endsWith('Z') ? '' : 'Z') : null

          const fmtTime = (raw: any) => new Date(toUTCStr(raw) as string)
            .toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta', hour12: false })
            .replace(':', '.')

          const fmtDate = (raw: any) => new Date(toUTCStr(raw) as string)
            .toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' })

          const emailParams = {
            to: bookingData.email,
            fullName: bookingData.full_name,
            eventName: bookingData.event_name,
            roomName: bookingData.room_name,
            startFormatted: fmtTime(bookingData.start_time),
            endFormatted: fmtTime(bookingData.end_time),
            dateFormatted: fmtDate(bookingData.start_time)
          }

          if (status === 'APPROVED') {
            await sendBookingApprovedEmail(emailParams)
          } else if (status === 'REJECTED') {
            await sendBookingRejectedEmail({
              ...emailParams,
              rejectionReason: bookingData.rejection_reason || undefined
            })
          } else if (status === 'CANCELLED') {
            await sendBookingCancelledEmail({
              ...emailParams,
              cancellationReason: bookingData.cancellation_reason || undefined
            })
          }
        } catch (emailErr) {
          console.error('[PATCH BOOKING] Email notification failed (non-critical):', emailErr)
        }
      })
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
