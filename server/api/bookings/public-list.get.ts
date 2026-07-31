import { allQuery } from '~/server/database/db'
import { dbToUtcIso, dbToWibDate, dbToWibTimeColon, todayWib } from '~/server/utils/datetime'

export default defineEventHandler(async (event) => {
  // Get query parameters for filtering
  const query = getQuery(event)
  const limit = parseInt(query.limit as string) || 100 // Default limit 100 untuk menampilkan lebih banyak data
  const days = parseInt(query.days as string) || 90 // Show bookings for next 90 days (increased from 30)

  // Hitung date range — pakai WIB date agar tidak off-by-one
  const todayStr = todayWib()
  const nowWib = new Date(`${todayStr}T00:00:00+07:00`)
  const startDate = new Date(nowWib)
  startDate.setDate(nowWib.getDate() - 30)
  const endDate = new Date(nowWib)
  endDate.setDate(nowWib.getDate() + days)

  const startDateStr = startDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
  const endDateStr = endDate.toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })

  // Only use placeholders for WHERE conditions
  const params = [startDateStr, endDateStr]

  const runPublicBookingsQuery = async () => {
    try {
      return await allQuery(`
        SELECT
          b.id,
          r.name as room_name,
          r.location as room_location,
          b.event_name,
          b.requester_name,
          u.username,
          u.full_name as user_name,
          b.start_time,
          b.end_time,
          b.status,
          b.created_at
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.deleted_at IS NULL
        AND b.status IN ('APPROVED', 'PENDING', 'REJECTED', 'CANCELLED')
        AND DATE(b.start_time) BETWEEN ? AND ?
        ORDER BY b.start_time ASC
      `, params)
    } catch (error: any) {
      const message = String(error?.message || '')
      const isMissingRequesterName = message.includes('Unknown column') && message.includes('requester_name')

      if (!isMissingRequesterName) {
        throw error
      }

      console.warn('[Public Bookings API] requester_name column missing, using legacy fallback query')

      return await allQuery(`
        SELECT
          b.id,
          r.name as room_name,
          r.location as room_location,
          b.event_name,
          NULL as requester_name,
          u.username,
          u.full_name as user_name,
          b.start_time,
          b.end_time,
          b.status,
          b.created_at
        FROM bookings b
        LEFT JOIN rooms r ON b.room_id = r.id
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.deleted_at IS NULL
        AND b.status IN ('APPROVED', 'PENDING', 'REJECTED', 'CANCELLED')
        AND DATE(b.start_time) BETWEEN ? AND ?
        ORDER BY b.start_time ASC
      `, params)
    }
  }

  // Get public booking list and include requester identity fields for display.
  // Falls back cleanly if production schema is behind.
  const bookings = await runPublicBookingsQuery()

  // Apply limit in JavaScript to avoid SQL injection
  const limitedBookings = bookings.slice(0, limit)

  // Semua konversi UTC→WIB via shared utility
  const formattedBookings = limitedBookings.map((booking: any) => {
    const startTimeUTC = dbToUtcIso(booking.start_time)
    const endTimeUTC   = dbToUtcIso(booking.end_time)
    const eventDateStr = dbToWibDate(booking.start_time)
    const startTimeStr = dbToWibTimeColon(booking.start_time)
    const endTimeStr   = dbToWibTimeColon(booking.end_time)

    return {
      id: booking.id,
      room_name: booking.room_name,
      room_location: booking.room_location,
      event_name: booking.event_name,
      requester_name: booking.requester_name,
      username: booking.username,
      user_name: booking.user_name,
      event_date: eventDateStr,
      start_time: startTimeStr,
      end_time: endTimeStr,
      // Also include full UTC ISO strings for accurate client-side filtering
      start_time_utc: startTimeUTC,
      end_time_utc: endTimeUTC,
      status: booking.status,
      created_at: booking.created_at
    }
  })

  return {
    bookings: formattedBookings,
    date_range: {
      start: startDateStr,
      end: endDateStr
    },
    total: formattedBookings.length
  }
})
