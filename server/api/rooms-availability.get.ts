import { allQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const date = query.date as string

  // If no date provided, use current date
  const targetDate = date ? new Date(date) : new Date()
  const dateStr = targetDate.toISOString().split('T')[0] // YYYY-MM-DD format

  // Get all active rooms
  const rooms = await allQuery(`
    SELECT id, name, capacity, location, facilities
    FROM rooms
    WHERE is_active = 1
    ORDER BY name ASC
  `)

  const getBookingsForDate = async () => {
    // Hitung awal dan akhir hari yang diminta (UTC midnight-to-midnight)
    // karena data disimpan sebagai UTC di database.
    const dayStart = dateStr + ' 00:00:00'
    const dayEnd   = dateStr + ' 23:59:59'

    try {
      // Fix: query lama hanya cek date(start_time) = ? — tidak mendeteksi
      // booking lintas tengah malam (misal: mulai 22:00 selesai 02:00 besok).
      // Sekarang menggunakan kondisi overlap standar:
      // sebuah booking tumpang-tindih dengan hari ini jika start_time <= akhir_hari AND end_time >= awal_hari
      return await allQuery(`
        SELECT
          b.room_id,
          b.start_time,
          b.end_time,
          b.status,
          b.event_name,
          b.requester_name,
          u.full_name as user_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.status IN ('APPROVED', 'PENDING')
          AND b.deleted_at IS NULL
          AND b.start_time <= ?
          AND b.end_time   >= ?
        ORDER BY b.start_time ASC
      `, [dayEnd, dayStart])
    } catch (error: any) {
      const message = String(error?.message || '')
      const isMissingRequesterName = message.includes('Unknown column') && message.includes('requester_name')

      if (!isMissingRequesterName) {
        throw error
      }

      console.warn('[Rooms Availability API] requester_name column missing, using legacy fallback query')

      return await allQuery(`
        SELECT
          b.room_id,
          b.start_time,
          b.end_time,
          b.status,
          b.event_name,
          NULL as requester_name,
          u.full_name as user_name
        FROM bookings b
        LEFT JOIN users u ON b.user_id = u.id
        WHERE b.status IN ('APPROVED', 'PENDING')
          AND b.deleted_at IS NULL
          AND b.start_time <= ?
          AND b.end_time   >= ?
        ORDER BY b.start_time ASC
      `, [dayEnd, dayStart])
    }
  }

  // Get bookings for the target date
  const rawBookings = await getBookingsForDate()

  // Helper: normalize DB datetime strings (stored as UTC) by appending 'Z'
  // so that browsers parse them as UTC instead of local time.
  const toUTC = (s: any) => s ? String(s).replace(' ', 'T') + 'Z' : null

  const bookings = rawBookings.map((b: any) => ({
    ...b,
    start_time: toUTC(b.start_time),
    end_time: toUTC(b.end_time)
  }))

  // Group bookings by room
  const bookingsByRoom: Record<number, any[]> = {}
  bookings.forEach((booking: any) => {
    if (!bookingsByRoom[booking.room_id]) {
      bookingsByRoom[booking.room_id] = []
    }
    bookingsByRoom[booking.room_id]!.push(booking)
  })

  // Combine rooms with their bookings
  const roomsWithAvailability = rooms.map((room: any) => {
    const roomBookings = bookingsByRoom[room.id as number] ? bookingsByRoom[room.id as number] : []
    const now = new Date()

    // Determine current status
    let status = 'Tersedia'
    let statusDetails: string | null = null

    if (roomBookings && roomBookings.length > 0) {
      // Check if any booking is currently active
      const activeBooking = roomBookings.find((booking: any) => {
        const start = new Date(booking.start_time)
        const end = new Date(booking.end_time)
        return start <= now && end > now && booking.status === 'APPROVED'
      })

      if (activeBooking) {
        status = 'Sedang Digunakan'
        statusDetails = `${activeBooking.event_name} (${activeBooking.requester_name || activeBooking.user_name})`
      } else {
        // Check for upcoming bookings today
        const upcomingBooking = roomBookings.find((booking: any) => {
          const start = new Date(booking.start_time)
          return start > now && booking.status === 'APPROVED'
        })

        if (upcomingBooking) {
          const startTime = new Date(upcomingBooking.start_time)
          const endTime = new Date(upcomingBooking.end_time)
          status = 'Sudah Dipesan'
          const startStr = startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
          const endStr = endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit', timeZone: 'Asia/Jakarta' })
          statusDetails = `${upcomingBooking.event_name} pada ${startStr} - ${endStr} (${upcomingBooking.requester_name || upcomingBooking.user_name})`
        } else {
          // Check for pending bookings
          const pendingBooking = roomBookings.find((booking: any) => booking.status === 'PENDING')
          if (pendingBooking) {
            status = 'Menunggu Persetujuan'
            statusDetails = `${pendingBooking.event_name} (${pendingBooking.requester_name || pendingBooking.user_name})`
          }
        }
      }
    }

    return {
      ...room,
      status,
      statusDetails,
      bookings: roomBookings
    }
  })

  return {
    date: dateStr,
    rooms: roomsWithAvailability
  }
})
