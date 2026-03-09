import { runQuery, allQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check for manage_rooms permission
  requirePermission('manage_rooms')(event)

  const body = await readBody(event)
  const { name, capacity, location, facilities, requires_approval, allowed_categories } = body

  if (!name || !capacity || !location) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field yang diperlukan: name, capacity, location'
    })
  }

  // Validate allowed_categories if provided
  if (allowed_categories) {
    try {
      const categories = JSON.parse(allowed_categories)
      if (!Array.isArray(categories)) {
        throw new Error()
      }
    } catch {
      throw createError({
        statusCode: 400,
        statusMessage: 'allowed_categories harus berupa array JSON yang valid'
      })
    }
  }

  // Insert room
  const result = await runQuery(`
    INSERT INTO rooms (name, capacity, location, facilities, requires_approval, allowed_categories)
    VALUES (?, ?, ?, ?, ?, ?)
  `, [name, capacity, location, facilities || null, requires_approval ? 1 : 0, allowed_categories || null])

  // Get the newly created room
  const rooms = await allQuery(`
    SELECT * FROM rooms WHERE id = ?
  `, [result.insertId])

  return {
    room: rooms[0],
    message: 'Ruangan berhasil dibuat'
  }
})
