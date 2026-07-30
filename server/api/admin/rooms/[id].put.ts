import { runQuery, getQuery, allQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check for manage_rooms permission
  requirePermission('manage_rooms')(event)

  const roomId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { name, capacity, location, facilities, description, photo_url, requires_approval, allowed_categories, is_active, is_dedicated, dedicated_to } = body

  // Log untuk debug
  console.log('Update room data:', {
    roomId,
    name,
    capacity,
    location,
    facilities,
    description,
    photo_url,
    requires_approval,
    allowed_categories,
    is_active,
    is_dedicated,
    dedicated_to
  })

  if (!name || !capacity || !location) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field yang diperlukan: name, capacity, location'
    })
  }

  // Check if room exists
  const existingRoom = await getQuery('SELECT * FROM rooms WHERE id = ?', [roomId])

  if (!existingRoom) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Ruangan tidak ditemukan'
    })
  }

  // Validate allowed_categories if provided
  if (allowed_categories) {
    try {
      const categories = typeof allowed_categories === 'string' ? JSON.parse(allowed_categories) : allowed_categories
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

  const activeVal = is_active !== undefined ? (is_active ? 1 : 0) : 1
  const dedicatedVal = is_dedicated ? 1 : 0
  const dedicatedToVal = is_dedicated ? (dedicated_to?.trim() || null) : null
  const categoriesStr = typeof allowed_categories === 'string' ? allowed_categories : (allowed_categories ? JSON.stringify(allowed_categories) : null)

  // Ensure columns exist in MySQL table
  const colMigrations = [
    `ALTER TABLE rooms ADD COLUMN description TEXT NULL`,
    `ALTER TABLE rooms ADD COLUMN photo_url TEXT NULL`,
    `ALTER TABLE rooms ADD COLUMN is_active TINYINT(1) NOT NULL DEFAULT 1`,
    `ALTER TABLE rooms ADD COLUMN is_dedicated TINYINT(1) NOT NULL DEFAULT 0`,
    `ALTER TABLE rooms ADD COLUMN dedicated_to VARCHAR(150) NULL`
  ]
  for (const sql of colMigrations) {
    try {
      await runQuery(sql)
    } catch (e: any) {}
  }

  try {
    await runQuery(`
      UPDATE rooms SET
        name = ?,
        capacity = ?,
        location = ?,
        facilities = ?,
        description = ?,
        photo_url = ?,
        requires_approval = ?,
        allowed_categories = ?,
        is_active = ?,
        is_dedicated = ?,
        dedicated_to = ?,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = ?
    `, [
      name,
      capacity,
      location,
      facilities || null,
      description || null,
      photo_url || null,
      requires_approval ? 1 : 0,
      categoriesStr,
      activeVal,
      dedicatedVal,
      dedicatedToVal,
      roomId
    ])
  } catch (dbErr: any) {
    console.error('Failed to update room:', dbErr)
    throw createError({
      statusCode: 500,
      statusMessage: dbErr?.message || 'Gagal memperbarui data ruangan'
    })
  }

  // Get updated room
  const rooms = await allQuery(`
    SELECT * FROM rooms WHERE id = ?
  `, [roomId])

  const updatedRoom = rooms[0]
  
  // Log updated room
  console.log('Updated room:', updatedRoom)

  return {
    room: updatedRoom,
    message: 'Ruangan berhasil diperbarui'
  }
})
