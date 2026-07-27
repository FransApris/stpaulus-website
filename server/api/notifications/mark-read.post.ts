import { runQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const userId = decoded.userId

    await runQuery(`
      UPDATE bookings 
      SET is_read = 1 
      WHERE user_id = ? AND deleted_at IS NULL AND is_read = 0
    `, [userId])

    return {
      success: true,
      message: 'Notifikasi berhasil ditandai telah dibaca'
    }
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Gagal memperbarui notifikasi'
    }
  }
})
