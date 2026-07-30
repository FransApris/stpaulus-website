import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requirePermission('manage_rooms')(event)

  let rooms = []
  try {
    rooms = await allQuery(`
      SELECT id, name, capacity, location, facilities, description, photo_url, requires_approval, allowed_categories, is_active, is_dedicated, dedicated_to, created_at
      FROM rooms
      ORDER BY created_at DESC
    `)
  } catch (err: any) {
    // Fallback if is_dedicated or description column is missing in legacy schema
    rooms = await allQuery(`
      SELECT id, name, capacity, location, facilities, photo_url, requires_approval, allowed_categories, is_active, created_at
      FROM rooms
      ORDER BY created_at DESC
    `)
  }

  return rooms
})
