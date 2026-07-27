import { allQuery } from '~/server/database/db'

/**
 * GET /api/bookings/weekly-schedule
 * Returns all bookings for all rooms within a 7-day window.
 *
 * Query params:
 *   start_date : string  YYYY-MM-DD  (default: current Monday)
 *
 * Response:
 *   {
 *     week_start : string (YYYY-MM-DD)
 *     week_end   : string (YYYY-MM-DD)
 *     days       : string[]   (7 dates)
 *     rooms      : Room[]
 *     bookings   : BookingSlot[]
 *   }
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event)

  // ── Determine week start (Monday) ─────────────────────────────────────────
  let weekStart: Date

  if (query.start_date && typeof query.start_date === 'string') {
    weekStart = new Date(`${query.start_date}T00:00:00`)
  } else {
    // Default to current Monday (WIB)
    const now = new Date(new Date().toLocaleString('en-US', { timeZone: 'Asia/Jakarta' }))
    const dayOfWeek = now.getDay() // 0=Sun, 1=Mon
    const diffToMonday = (dayOfWeek === 0 ? -6 : 1 - dayOfWeek)
    weekStart = new Date(now)
    weekStart.setDate(now.getDate() + diffToMonday)
    weekStart.setHours(0, 0, 0, 0)
  }

  const weekEnd = new Date(weekStart)
  weekEnd.setDate(weekStart.getDate() + 6)
  weekEnd.setHours(23, 59, 59, 999)

  // Format for MySQL (treat as local WIB dates)
  const toLocalDateStr = (d: Date) => {
    const y = d.getFullYear()
    const m = String(d.getMonth() + 1).padStart(2, '0')
    const day = String(d.getDate()).padStart(2, '0')
    return `${y}-${m}-${day}`
  }

  const weekStartStr = toLocalDateStr(weekStart)
  const weekEndStr   = toLocalDateStr(weekEnd)

  // Generate array of 7 date strings
  const days: string[] = []
  for (let i = 0; i < 7; i++) {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    days.push(toLocalDateStr(d))
  }

  try {
    // ── Fetch all rooms ──────────────────────────────────────────────────────
    const rooms = await allQuery(`
      SELECT id, name, capacity, location, color
      FROM rooms
      WHERE is_active = 1
      ORDER BY name ASC
    `)

    // ── Fetch bookings in this week ──────────────────────────────────────────
    // We compare DATE(start_time) because times are stored in UTC but we
    // display in WIB. For a 1-week window, +/- 1 day buffer avoids edge cases.
    const startBuffer = new Date(weekStart)
    startBuffer.setDate(startBuffer.getDate() - 1)
    const endBuffer = new Date(weekEnd)
    endBuffer.setDate(endBuffer.getDate() + 1)

    const mysqlStart = startBuffer.toISOString().slice(0, 19).replace('T', ' ')
    const mysqlEnd   = endBuffer.toISOString().slice(0, 19).replace('T', ' ')

    const bookings = await allQuery(`
      SELECT
        b.id,
        b.room_id,
        b.event_name,
        b.start_time,
        b.end_time,
        b.status,
        COALESCE(b.requester_name, u.full_name) AS requester_name
      FROM bookings b
      LEFT JOIN users u ON b.user_id = u.id
      WHERE b.status IN ('APPROVED', 'PENDING')
        AND b.deleted_at IS NULL
        AND b.start_time < ?
        AND b.end_time > ?
      ORDER BY b.start_time ASC
    `, [mysqlEnd, mysqlStart])

    // ── Format booking times to WIB ──────────────────────────────────────────
    const toUTCStr = (s: any): string =>
      s ? String(s).replace(' ', 'T') + (String(s).endsWith('Z') ? '' : 'Z') : ''

    const fmtTime = (raw: any) => {
      if (!raw) return ''
      return new Date(toUTCStr(raw)).toLocaleTimeString('id-ID', {
        hour: '2-digit', minute: '2-digit',
        timeZone: 'Asia/Jakarta', hour12: false
      }).replace(':', '.')
    }

    const fmtDateKey = (raw: any): string => {
      if (!raw) return ''
      return new Date(toUTCStr(raw)).toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
      // en-CA returns YYYY-MM-DD format
    }

    const formattedBookings = (bookings as any[]).map(b => ({
      id         : b.id,
      room_id    : b.room_id,
      event_name : b.event_name,
      requester_name: b.requester_name || 'Tidak diketahui',
      date_key   : fmtDateKey(b.start_time),   // YYYY-MM-DD in WIB
      start_time : toUTCStr(b.start_time),
      end_time   : toUTCStr(b.end_time),
      start_formatted: fmtTime(b.start_time),
      end_formatted  : fmtTime(b.end_time),
      status     : b.status
    }))

    return {
      week_start: weekStartStr,
      week_end  : weekEndStr,
      days,
      rooms,
      bookings  : formattedBookings
    }
  } catch (error: any) {
    console.error('[WEEKLY SCHEDULE] Error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal mengambil jadwal mingguan'
    })
  }
})
