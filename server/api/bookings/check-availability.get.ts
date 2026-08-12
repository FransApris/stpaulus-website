import { allQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import { dbToUtcIso, dbToWibTimeStr } from '~/server/utils/datetime'

/**
 * GET /api/bookings/check-availability
 * Real-time slot availability check — requires authentication.
 *
 * Query params:
 *   room_id    : number  (required)
 *   date       : string  YYYY-MM-DD  (required)
 *   start_time : string  HH:MM       (required)
 *   end_time   : string  HH:MM       (required)
 *
 * Response:
 *   {
 *     available     : boolean   – true if no conflicts at all
 *     hard_conflict : boolean   – true if APPROVED booking overlaps (hard block)
 *     soft_conflict : boolean   – true if only PENDING booking overlaps (soft warning)
 *     conflicts     : ConflictItem[]
 *   }
 */
export default defineEventHandler(async (event) => {
  // T-2 Fix: autentikasi diperlukan — cegah pemetaan jadwal oleh aktor tak dikenal
  requireAuth(event)

  const query = getQuery(event)
  const { room_id, date, start_time, end_time } = query as Record<string, string>

  // ── Validate required params ──────────────────────────────────────────────
  if (!room_id || !date || !start_time || !end_time) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parameter room_id, date, start_time, end_time diperlukan'
    })
  }

  // ── Build full datetime strings ───────────────────────────────────────────
  // Client sends HH:MM (WIB local time). Parse dengan timezone +07:00 eksplisit
  // agar tidak tergantung timezone runtime server.
  const startDt = new Date(`${date}T${start_time}:00+07:00`)
  const endDt   = new Date(`${date}T${end_time}:00+07:00`)

  if (isNaN(startDt.getTime()) || isNaN(endDt.getTime()) || endDt <= startDt) {
    throw createError({ statusCode: 400, statusMessage: 'Waktu tidak valid' })
  }

  // Convert to MySQL UTC datetime format (YYYY-MM-DD HH:MM:SS)
  const mysqlStart = startDt.toISOString().slice(0, 19).replace('T', ' ')
  const mysqlEnd   = endDt.toISOString().slice(0, 19).replace('T', ' ')

  try {
    // ── Query overlapping bookings ────────────────────────────────────────────
    // Standard overlap: NOT (b.end_time <= startRequested OR b.start_time >= endRequested)
    let conflicts: any[] = []

    try {
      conflicts = await allQuery(`
        SELECT
          b.id,
          b.event_name,
          b.start_time,
          b.end_time,
          b.status,
          COALESCE(b.requester_name, u.full_name) AS requester_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.room_id = ?
          AND b.status IN ('APPROVED', 'PENDING')
          AND b.deleted_at IS NULL
          AND NOT (b.end_time <= ? OR b.start_time >= ?)
        ORDER BY b.start_time ASC
      `, [room_id, mysqlStart, mysqlEnd])
    } catch (queryError: any) {
      // Fallback if requester_name column doesn't exist yet
      const msg = String(queryError?.message || '')
      if (msg.includes('Unknown column') && msg.includes('requester_name')) {
        conflicts = await allQuery(`
          SELECT
            b.id,
            b.event_name,
            b.start_time,
            b.end_time,
            b.status,
            u.full_name AS requester_name
          FROM bookings b
          LEFT JOIN users u ON b.user_id = u.id
          WHERE b.room_id = ?
            AND b.status IN ('APPROVED', 'PENDING')
            AND b.deleted_at IS NULL
            AND NOT (b.end_time <= ? OR b.start_time >= ?)
          ORDER BY b.start_time ASC
        `, [room_id, mysqlStart, mysqlEnd])
      } else {
        throw queryError
      }
    }

    // ── Format times to WIB via shared utility ────────────────────────────────
    const formattedConflicts = conflicts.map((c: any) => ({
      id: c.id,
      event_name: c.event_name,
      requester_name: c.requester_name || 'Tidak diketahui',
      start_time: dbToUtcIso(c.start_time),
      end_time: dbToUtcIso(c.end_time),
      start_formatted: dbToWibTimeStr(c.start_time),
      end_formatted: dbToWibTimeStr(c.end_time),
      status: c.status
    }))

    const hasApproved = formattedConflicts.some((c: any) => c.status === 'APPROVED')
    const hasPending  = formattedConflicts.some((c: any) => c.status === 'PENDING')

    return {
      available    : formattedConflicts.length === 0,
      hard_conflict: hasApproved,                         // APPROVED = tidak bisa pesan
      soft_conflict: !hasApproved && hasPending,          // hanya PENDING = peringatan saja
      conflicts    : formattedConflicts
    }
  } catch (error: any) {
    console.error('[CHECK AVAILABILITY] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memeriksa ketersediaan ruangan'
    })
  }
})
