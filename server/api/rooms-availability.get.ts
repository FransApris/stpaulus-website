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

  // Get bookings for the target date
  const bookings = await allQuery(`
    SELECT
      b.room_id,
      b.start_time,
      b.end_time,
      b.status,
      b.event_name,
      u.full_name as user_name
    FROM bookings b
    JOIN users u ON b.user_id = u.id
    WHERE b.status IN ('APPROVED', 'PENDING')
    AND date(b.start_time) = ?
    ORDER BY b.start_time ASC
  `, [dateStr])

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
        statusDetails = `${activeBooking.event_name} (${activeBooking.user_name})`
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
          statusDetails = `${upcomingBooking.event_name} pada ${startTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} - ${endTime.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} (${upcomingBooking.user_name})`
        } else {
          // Check for pending bookings
          const pendingBooking = roomBookings.find((booking: any) => booking.status === 'PENDING')
          if (pendingBooking) {
            status = 'Menunggu Persetujuan'
            statusDetails = `${pendingBooking.event_name} (${pendingBooking.user_name})`
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
