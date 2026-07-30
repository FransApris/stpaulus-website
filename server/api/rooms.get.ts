import { allQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  let rooms = []
  try {
    rooms = await allQuery(`
      SELECT id, name, capacity, location, facilities, description, photo_url, requires_approval, allowed_categories, is_dedicated, dedicated_to
      FROM rooms
      WHERE is_active = 1
      ORDER BY name ASC
    `)
  } catch (err: any) {
    rooms = await allQuery(`
      SELECT id, name, capacity, location, facilities, photo_url, requires_approval, allowed_categories
      FROM rooms
      WHERE is_active = 1
      ORDER BY name ASC
    `)
  }

  return rooms
})
