import { runQuery, getQuery } from '../../../../database/db'
import { requireAuth, hashPassword } from '../../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const adminId = decoded.userId
  const targetUserId = getRouterParam(event, 'id')

  if (!targetUserId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID pengguna diperlukan'
    })
  }

  // Check if admin is super_admin
  const admin = await getQuery(`
    SELECT u.id, r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [adminId]) as any

  if (!admin || admin.role_name !== 'super_admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Hanya super admin yang dapat me-reset password'
    })
  }

  // Check if target user exists
  const targetUser = await getQuery('SELECT id, username FROM users WHERE id = ?', [targetUserId]) as any
  if (!targetUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pengguna tidak ditemukan'
    })
  }

  const body = await readBody(event)
  const { newPassword } = body

  if (!newPassword || typeof newPassword !== 'string' || newPassword.length < 6) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Password baru diperlukan dan minimal 6 karakter'
    })
  }

  // Hash new password
  const passwordHash = await hashPassword(newPassword)

  // Update password
  const result = await runQuery('UPDATE users SET password_hash = ? WHERE id = ?', [passwordHash, targetUserId])

  if ((result as any).affectedRows === 0) {
    // Check if user still exists (in case it was deleted concurrently)
    const check = await getQuery('SELECT id FROM users WHERE id = ?', [targetUserId])
    if (!check) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Pengguna tidak ditemukan'
      })
    }
    // If exists but no changes, still success
  }

  return {
    message: `Password untuk pengguna ${targetUser.username} berhasil diubah`
  }
})
