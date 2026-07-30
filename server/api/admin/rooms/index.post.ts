import { runQuery, allQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check for manage_rooms permission
  requirePermission('manage_rooms')(event)

  const body = await readBody(event)
  const { name, capacity, location, facilities, description, photo_url, requires_approval, allowed_categories, is_active, is_dedicated, dedicated_to } = body

  if (!name || !capacity || !location) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Field yang diperlukan: name, capacity, location'
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

  let result: any
  try {
    // Attempt insert with is_dedicated and dedicated_to
    result = await runQuery(`
      INSERT INTO rooms (name, capacity, location, facilities, description, photo_url, requires_approval, allowed_categories, is_active, is_dedicated, dedicated_to)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `, [
      name,
      capacity,
      location,
      facilities || null,
      description || null,
      photo_url || null,
      requires_approval ? 1 : 0,
      typeof allowed_categories === 'string' ? allowed_categories : (allowed_categories ? JSON.stringify(allowed_categories) : null),
      activeVal,
      dedicatedVal,
      dedicatedToVal
    ])
  } catch (dbErr: any) {
    console.error('Failed to create room:', dbErr)
    throw createError({
      statusCode: 500,
      statusMessage: dbErr?.message || 'Gagal membuat ruangan baru'
    })
  }

  // Get the newly created room
  const rooms = await allQuery(`
    SELECT * FROM rooms WHERE id = ?
  `, [result.insertId])

  return {
    room: rooms[0],
    message: 'Ruangan berhasil dibuat'
  }
})
