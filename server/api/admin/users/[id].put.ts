import { runQuery, getQuery, allQuery } from '../../../database/db'
import { requireAuth, requireUserManagementPermission } from '../../../utils/auth'
import { hashPassword } from '../../../utils/auth'
import { isCategoryUnlimited } from '../../../utils/quota'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  await requireUserManagementPermission(event)

  const targetUserId = getRouterParam(event, 'id')
  const body = await readBody(event)
  const { username, email, full_name, contact_phone, user_category, unit_name, role } = body

  // Validate required fields
  if (!username || !full_name) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username dan nama lengkap diperlukan'
    })
  }

  // Validate user_category against dynamic categories if provided
  if (user_category) {
    const validCategories = await allQuery('SELECT name FROM user_categories WHERE is_active = 1')
    if (!Array.isArray(validCategories)) {
      console.error('[Update User] Invalid categories data:', validCategories)
      throw createError({
        statusCode: 500,
        statusMessage: 'Invalid user categories data from database'
      })
    }
    const validCategoryNames = validCategories.map((c: any) => c.name)
    if (!validCategoryNames.includes(user_category)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Kategori pengguna tidak valid'
      })
    }

    // ── Security fix: only super_admin can assign unlimited-quota categories ──
    const currentUserRole = await getQuery(
      'SELECT r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [userId]
    ) as { role_name?: string } | undefined

    const categoryIsUnlimited = await isCategoryUnlimited(user_category)
    if (categoryIsUnlimited && currentUserRole?.role_name !== 'super_admin') {
      console.warn('[Update User] SECURITY: non-super-admin tried to assign unlimited category:', user_category)
      throw createError({
        statusCode: 403,
        statusMessage: 'Hanya Super Admin yang dapat mengubah kategori ke kuota unlimited (DPP/BGKP)'
      })
    }
  }

  // Check if user exists
  const existingUser = await getQuery('SELECT id, role_id FROM users WHERE id = ?', [targetUserId]) as any
  if (!existingUser) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Pengguna tidak ditemukan'
    })
  }

  // Check if username/email is already taken by another user
  // Only check email if it's not empty (email is optional for booking users)
  const duplicateCheckQuery = email
    ? `SELECT id FROM users WHERE (username = ? OR email = ?) AND id != ?`
    : `SELECT id FROM users WHERE username = ? AND id != ?`
  const duplicateCheckParams = email
    ? [username, email, targetUserId]
    : [username, targetUserId]
  const duplicateCheck = await getQuery(duplicateCheckQuery, duplicateCheckParams) as any

  if (duplicateCheck) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Username atau email sudah digunakan'
    })
  }

  // Get current user's role to determine what they can edit
  const currentUserRole = await getQuery(`
    SELECT r.name as role_name
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [userId]) as { role_name?: string } | undefined

  // Prepare update data
  const updateData: any = {
    username,
    email,
    full_name,
    contact_phone: contact_phone || null,
    user_category: user_category || null,
    unit_name: unit_name || null,
    updated_at: new Date().toISOString().slice(0, 19).replace('T', ' ')
  }

  // Handle role updates - only super_admin can change roles
  if (role) {
    if (currentUserRole?.role_name !== 'super_admin') {
      throw createError({
        statusCode: 403,
        statusMessage: 'Hanya super admin yang dapat mengubah role pengguna'
      })
    }
    
    // Normalize role to lowercase for validation
    const normalizedRole = role.toLowerCase()
    
    // Special case: 'user' role means booking user (no role_id)
    if (normalizedRole === 'user') {
      updateData.role_id = null
      updateData.role = 'user'
    } else {
      // Get role_id from roles table for admin roles (case insensitive)
      const roleRecord = await getQuery('SELECT id, name FROM roles WHERE LOWER(name) = ?', [normalizedRole]) as { id?: number; name?: string } | undefined
      
      if (roleRecord?.id) {
        updateData.role_id = roleRecord.id
        // Also update legacy role field for backward compatibility
        updateData.role = roleRecord.name || normalizedRole
      } else {
        console.error('[Update User] Invalid role requested:', normalizedRole)
        throw createError({
          statusCode: 400,
          statusMessage: `Role tidak valid: ${role}. Role yang valid: user, super_admin, admin_komsos, admin_sekretariat`
        })
      }
    }
  }

  // Build update query
  const fields = Object.keys(updateData)
  const values = Object.values(updateData)
  const setClause = fields.map(field => `${field} = ?`).join(', ')

  await runQuery(`
    UPDATE users SET ${setClause} WHERE id = ?
  `, [...values, targetUserId])

  // Fetch updated user data to return
  const updatedUser = await getQuery(`
    SELECT 
      u.id, 
      u.username, 
      u.email, 
      u.full_name, 
      u.contact_phone, 
      u.user_category, 
      u.unit_name, 
      u.role, 
      u.role_id,
      r.name as role_name, 
      r.display_name as role_display_name, 
      u.created_at
    FROM users u
    LEFT JOIN roles r ON u.role_id = r.id
    WHERE u.id = ?
  `, [targetUserId])

  return {
    message: 'Pengguna berhasil diperbarui',
    user: updatedUser
  }
})
