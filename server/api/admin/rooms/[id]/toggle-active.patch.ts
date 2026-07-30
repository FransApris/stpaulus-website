import { runQuery, getQuery, allQuery } from '../../../../database/db'
import { requirePermission } from '../../../../utils/auth'

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

  const newStatus = room.is_active ? 0 : 1

  await runQuery(
    'UPDATE rooms SET is_active = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?',
    [newStatus, roomId]
  )

  const updatedRooms = await allQuery('SELECT * FROM rooms WHERE id = ?', [roomId])

  return {
    success: true,
    room: updatedRooms[0],
    message: `Status ruangan "${room.name}" berhasil diubah menjadi ${newStatus ? 'Aktif' : 'Nonaktif'}.`
  }
})
