import { allQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  // T-1 Fix: endpoint ini harus terautentikasi — jangan ekspos info jadwal ke publik
  requireAuth(event)
  try {
    const body = await readBody(event)
    const { room_id, start_date, end_date, start_time, end_time, recurrence_pattern } = body

    if (!room_id || !start_date || !end_date || !start_time || !end_time || !recurrence_pattern) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Semua field parameter berulang harus diisi'
      })
    }

    // S-6 Fix: new Date("YYYY-MM-DD") diparse sebagai UTC midnight (off-by-one WIB).
    // Tambahkan T00:00:00+07:00 agar diparse sebagai WIB midnight yang benar.
    const startDt   = new Date(`${start_date}T00:00:00+07:00`)
    const endDt     = new Date(`${end_date}T23:59:59+07:00`)
    const maxFuture = new Date()
    maxFuture.setDate(maxFuture.getDate() + 90) // Max 90 days in future

    if (endDt <= startDt) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Tanggal selesai berulang harus setelah tanggal mulai'
      })
    }

    if (endDt > maxFuture) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Batas pemesanan berulang maksimal 90 hari (3 bulan) ke depan'
      })
    }

    // Generate occurrence dates
    const occurrenceDates: string[] = []
    let curr = new Date(startDt)

    while (curr <= endDt) {
      const year = curr.getFullYear()
      const month = String(curr.getMonth() + 1).padStart(2, '0')
      const day = String(curr.getDate()).padStart(2, '0')
      occurrenceDates.push(`${year}-${month}-${day}`)

      if (recurrence_pattern === 'WEEKLY') {
        curr.setDate(curr.getDate() + 7)
      } else if (recurrence_pattern === 'BIWEEKLY') {
        curr.setDate(curr.getDate() + 14)
      } else if (recurrence_pattern === 'MONTHLY') {
        curr.setMonth(curr.getMonth() + 1)
      } else {
        break
      }

      if (occurrenceDates.length >= 20) break // Safety cap 20 occurrences max
    }

    const results: any[] = []

    for (const dateStr of occurrenceDates) {
      // S-6 Fix: parse WIB time dengan timezone eksplisit
      const sDt = new Date(`${dateStr}T${start_time}:00+07:00`)
      const eDt = new Date(`${dateStr}T${end_time}:00+07:00`)

      // Simpan sebagai UTC MySQL string (sesuai konvensi datetime.ts)
      const mysqlStart = sDt.toISOString().slice(0, 19).replace('T', ' ')
      const mysqlEnd   = eDt.toISOString().slice(0, 19).replace('T', ' ')

      let conflicts: any[] = []
      try {
        conflicts = await allQuery(`
          SELECT id, event_name, status, start_time, end_time
          FROM bookings
          WHERE room_id = ?
            AND deleted_at IS NULL
            AND status IN ('APPROVED', 'PENDING')
            AND start_time < ?
            AND end_time > ?
        `, [room_id, mysqlEnd, mysqlStart])
      } catch (err) {
        conflicts = []
      }

      results.push({
        date: dateStr,
        startTime: sDt.toISOString(),
        endTime: eDt.toISOString(),
        available: conflicts.length === 0,
        conflict: conflicts.length > 0 ? conflicts[0] : null
      })
    }

    const availableCount = results.filter(r => r.available).length
    const conflictCount = results.filter(r => !r.available).length

    return {
      success: true,
      totalOccurrences: results.length,
      availableCount,
      conflictCount,
      occurrences: results
    }
  } catch (error: any) {
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: error.message || 'Terjadi kesalahan pengecekan slot berulang'
    })
  }
})
