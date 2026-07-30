import { runQuery, getQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check for manage_rooms permission
  requirePermission('manage_rooms')(event)

  const roomId = getRouterParam(event, 'id')
  if (!roomId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID ruangan diperlukan'
    })
  }

  // Check if room exists
  const room = await getQuery('SELECT * FROM rooms WHERE id = ?', [roomId]) as any
  if (!room) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Ruangan tidak ditemukan'
    })
  }

  // Check if room has active or past bookings
  const bookingCountResult = await getQuery(
    'SELECT COUNT(*) as count FROM bookings WHERE room_id = ? AND deleted_at IS NULL',
    [roomId]
  ) as any

  const bookingCount = Number(bookingCountResult?.count || 0)

  if (bookingCount > 0) {
    // If room has bookings, soft-deactivate instead of hard deleting to preserve historical data
    await runQuery(
      'UPDATE rooms SET is_active = 0, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
      [roomId]
    )

    return {
      success: true,
      deactivated: true,
      message: `Ruangan "${room.name}" memiliki ${bookingCount} histori pemesanan. Ruangan telah dinonaktifkan daripada dihapus permanen untuk menjaga keutuhan data.`
    }
  }

  // Hard delete if no bookings exist
  await runQuery('DELETE FROM rooms WHERE id = ?', [roomId])

  return {
    success: true,
    deactivated: false,
    message: `Ruangan "${room.name}" berhasil dihapus secara permanen.`
  }
})
