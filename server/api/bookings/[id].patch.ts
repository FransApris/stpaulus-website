// ============================================================
// server/api/bookings/[id].patch.ts  — VERSI PERBAIKAN
// Perubahan utama:
//   1. Enhanced logging di setiap tahap kritis
//   2. SQL error code (ER_LOCK_DEADLOCK, dsb.) terlihat di console
//   3. Error response JSON informatif (bukan hanya 500 kosong)
//   4. Explicit phase tracking agar log mudah di-trace
// ============================================================
import { getConnection, getQuery } from '../../database/db'
import { requireAuth, requirePermission, getUserPermissions } from '../../utils/auth'
import { sendBookingApprovedEmail, sendBookingRejectedEmail, sendBookingCancelledEmail } from '../../utils/email'

export default defineEventHandler(async (event) => {
  const requestId = `PATCH-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`
  console.log(`[BOOKING PATCH][${requestId}] ===== START =====`)

  let phase = 'auth'   // ← Track fase saat ini untuk debugging

  try {
    // ── Phase 1: Auth ──────────────────────────────────────────────────────────
    phase = 'auth'
    console.log(`[BOOKING PATCH][${requestId}] Phase: ${phase}`)

    const decoded = requireAuth(event)
    const userId = decoded.userId
    console.log(`[BOOKING PATCH][${requestId}] Auth OK — userId: ${userId}, role: ${decoded.role}`)

    // Set auth context for permission checking
    phase = 'get-user-permissions'
    console.log(`[BOOKING PATCH][${requestId}] Phase: ${phase}`)

    const user = await getQuery('SELECT role_id FROM users WHERE id = ?', [userId])
    if (!user) {
      throw createError({ statusCode: 401, statusMessage: 'User not found' })
    }
    console.log(`[BOOKING PATCH][${requestId}] User found — role_id: ${(user as any).role_id}`)

    const permissions = await getUserPermissions(user)
    console.log(`[BOOKING PATCH][${requestId}] Permissions fetched — count: ${permissions.length}, has manage_bookings: ${permissions.includes('manage_bookings')}`)

    event.context.auth = { userId, permissions }

    // ── Phase 2: Input Validation ──────────────────────────────────────────────
    phase = 'input-validation'
    const bookingId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { status, rejection_reason, cancellation_reason } = body

    console.log(`[BOOKING PATCH][${requestId}] Input — bookingId: ${bookingId}, status: ${status}`)

    type BookingStatus = 'APPROVED' | 'REJECTED' | 'CANCELLED'
    if (!['APPROVED', 'REJECTED', 'CANCELLED'].includes(status)) {
      throw createError({ statusCode: 400, statusMessage: 'Status tidak valid' })
    }

    if (status === 'REJECTED' && !rejection_reason?.trim()) {
      throw createError({ statusCode: 400, statusMessage: 'Alasan penolakan diperlukan' })
    }

    // ── Phase 3: Permission Check ──────────────────────────────────────────────
    phase = 'permission-check'
    const isAdmin = permissions.includes('manage_bookings')
    console.log(`[BOOKING PATCH][${requestId}] isAdmin: ${isAdmin}`)

    if (status === 'APPROVED' || status === 'REJECTED') {
      requirePermission('manage_bookings')(event)
      console.log(`[BOOKING PATCH][${requestId}] Permission check passed ✅`)
    }

    if (status === 'CANCELLED' && !isAdmin) {
      if (!cancellation_reason?.trim() || cancellation_reason.trim().length < 5) {
        throw createError({ statusCode: 400, statusMessage: 'Alasan pembatalan wajib diisi (minimal 5 karakter).' })
      }
    }

    // ── Phase 4: Acquire DB Connection ────────────────────────────────────────
    phase = 'db-connect'
    console.log(`[BOOKING PATCH][${requestId}] Acquiring DB connection...`)
    const conn = await getConnection()
    console.log(`[BOOKING PATCH][${requestId}] DB connection acquired ✅`)

    try {
      // ── Phase 5: Begin Transaction ─────────────────────────────────────────
      phase = 'begin-transaction'
      console.log(`[BOOKING PATCH][${requestId}] Starting transaction...`)
      await conn.beginTransaction()
      console.log(`[BOOKING PATCH][${requestId}] Transaction started ✅`)

      // ── Phase 6: Fetch & Lock Booking Row ─────────────────────────────────
      phase = 'fetch-booking'
      console.log(`[BOOKING PATCH][${requestId}] Fetching booking id=${bookingId} with FOR UPDATE lock...`)

      const [bookingRows] = await conn.query(
        'SELECT * FROM bookings WHERE id = ? AND deleted_at IS NULL FOR UPDATE',
        [bookingId]
      ) as any

      const booking = bookingRows[0]
      if (!booking) {
        await conn.rollback()
        throw createError({ statusCode: 404, statusMessage: 'Pemesanan tidak ditemukan atau sudah dihapus' })
      }

      console.log(`[BOOKING PATCH][${requestId}] Booking found — status: ${booking.status}, room_id: ${booking.room_id}, user_id: ${booking.user_id}`)

      // ── Phase 7: Status Transition Validation ─────────────────────────────
      phase = 'status-transition-check'
      if (status === 'APPROVED' || status === 'REJECTED') {
        if (booking.status !== 'PENDING') {
          await conn.rollback()
          throw createError({
            statusCode: 400,
            statusMessage: `Hanya pemesanan PENDING yang dapat disetujui/ditolak. Status saat ini: ${booking.status}`
          })
        }
      } else if (status === 'CANCELLED') {
        if (!isAdmin) {
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
          if (!['PENDING', 'APPROVED'].includes(booking.status)) {
            await conn.rollback()
            throw createError({
              statusCode: 400,
              statusMessage: 'Hanya pemesanan PENDING atau APPROVED yang dapat dibatalkan'
            })
          }
        }
      }

      // ── Phase 8: Datetime Validation (APPROVE only) ────────────────────────
      if (status === 'APPROVED') {
        phase = 'datetime-validation'
        const startMs = new Date(booking.start_time).getTime()
        const endMs   = new Date(booking.end_time).getTime()

        console.log(`[BOOKING PATCH][${requestId}] Datetime check — start_time: "${booking.start_time}", end_time: "${booking.end_time}", startMs: ${startMs}, endMs: ${endMs}`)

        if (isNaN(startMs) || isNaN(endMs)) {
          await conn.rollback()
          throw createError({
            statusCode: 400,
            statusMessage: `Data pemesanan tidak valid: gagal parse tanggal. start_time="${booking.start_time}", end_time="${booking.end_time}"`
          })
        }

        if (endMs <= startMs) {
          await conn.rollback()
          throw createError({
            statusCode: 400,
            statusMessage: 'Data pemesanan tidak valid: waktu selesai harus setelah waktu mulai'
          })
        }

        // ── Phase 9: Conflict Check ──────────────────────────────────────────
        phase = 'conflict-check'
        console.log(`[BOOKING PATCH][${requestId}] Checking conflicts for room_id=${booking.room_id}...`)

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

        console.log(`[BOOKING PATCH][${requestId}] Conflict check — found ${conflictRows.length} conflict(s)`)

        if (conflictRows.length > 0) {
          const conflicting = conflictRows[0]
          console.log(`[BOOKING PATCH][${requestId}] CONFLICT with booking id=${conflicting.id}: "${conflicting.event_name}"`)
          await conn.rollback()

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

          throw createError({
            statusCode: 409,
            statusMessage: `Konflik waktu dengan pemesanan lain yang sudah disetujui: "${conflicting.event_name}" pada ${formatWIBDate(conflicting.start_time)} pukul ${formatWIBTime(conflicting.start_time)} – ${formatWIBTime(conflicting.end_time)}`
          })
        }
      }

      // ── Phase 10: Execute UPDATE ───────────────────────────────────────────
      phase = 'db-update'
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

      console.log(`[BOOKING PATCH][${requestId}] Executing UPDATE — status: ${status}, bookingId: ${bookingId}`)
      const [updateResult] = await conn.query(updateQuery, updateParams) as any
      console.log(`[BOOKING PATCH][${requestId}] UPDATE result — affectedRows: ${updateResult.affectedRows}`)

      if (updateResult.affectedRows === 0) {
        await conn.rollback()
        throw createError({ statusCode: 404, statusMessage: 'Tidak ada baris yang diperbarui. Booking mungkin sudah dihapus.' })
      }

      // ── Phase 11: Commit ───────────────────────────────────────────────────
      phase = 'commit'
      console.log(`[BOOKING PATCH][${requestId}] Committing transaction...`)
      await conn.commit()
      console.log(`[BOOKING PATCH][${requestId}] Transaction committed ✅`)

    } catch (txError: any) {
      // ─── Log SQL error detail secara lengkap ───────────────────────────────
      console.error(`[BOOKING PATCH][${requestId}] ❌ ERROR in phase "${phase}":`, {
        message:    txError.message,
        code:       txError.code,       // e.g., ER_LOCK_DEADLOCK, ER_NO_SUCH_TABLE
        errno:      txError.errno,      // MySQL error number
        sqlState:   txError.sqlState,   // SQL state code
        sql:        txError.sql,        // Query yang gagal (jika ada)
        statusCode: txError.statusCode,
        stack:      txError.stack?.split('\n').slice(0, 5).join('\n')
      })
      await conn.rollback().catch((rbErr: Error) => {
        console.error(`[BOOKING PATCH][${requestId}] Rollback error:`, rbErr.message)
      })
      throw txError
    } finally {
      conn.release()
      console.log(`[BOOKING PATCH][${requestId}] Connection released ✅`)
    }

    // ── Success Response ──────────────────────────────────────────────────────
    const statusMessages: Record<BookingStatus, string> = {
      APPROVED: 'disetujui',
      REJECTED: 'ditolak',
      CANCELLED: 'dibatalkan'
    }

    // ── Fire-and-forget email notifications ──────────────────────────────────
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

        if (!bookingData?.email) {
          console.warn(`[BOOKING PATCH][${requestId}] Email skipped — no email found for booking ${bookingId}`)
          return
        }

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

        console.log(`[BOOKING PATCH][${requestId}] Email sent ✅`)
      } catch (emailErr: any) {
        // Email error = non-critical, tidak boleh block response
        console.error(`[BOOKING PATCH][${requestId}] Email failed (non-critical):`, emailErr.message)
      }
    })

    console.log(`[BOOKING PATCH][${requestId}] ===== SUCCESS — status: ${status} =====`)
    return {
      success: true,
      message: `Pemesanan ${statusMessages[status as BookingStatus]}`,
      bookingId,
      newStatus: status
    }

  } catch (error: any) {
    // ─── Final catch: log semua detail error ───────────────────────────────────
    console.error(`[BOOKING PATCH][${requestId}] ❌ UNHANDLED ERROR in phase "${phase}":`, {
      message:       error.message,
      code:          error.code,
      errno:         error.errno,
      sqlState:      error.sqlState,
      sql:           error.sql,
      statusCode:    error.statusCode,
      statusMessage: error.statusMessage,
      stack:         error.stack?.split('\n').slice(0, 8).join('\n')
    })

    // Jika error sudah memiliki statusCode (dari createError), re-throw langsung
    if (error.statusCode) throw error

    // Untuk error tak terduga (DB, runtime, dll) — sertakan info fase yang gagal
    throw createError({
      statusCode: 500,
      statusMessage: `Internal Server Error (phase: ${phase}): ${error.message || 'Unknown error'}`,
      data: {
        phase,
        errorCode:  error.code  || null,
        errorErrno: error.errno || null
      }
    })
  }
})
