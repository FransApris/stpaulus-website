import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requirePermission('manage_rooms')(event)

  const rooms = allQuery(`
    SELECT id, name, capacity, location, facilities, photo_url, requires_approval, allowed_categories, is_active, created_at
    FROM rooms
    ORDER BY created_at DESC
  `)

  return rooms
})
