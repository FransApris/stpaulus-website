import { runQuery, getQuery, allQuery } from '../../../database/db'
import { requireAuth, hashPassword } from '../../../utils/auth'
import { isCategoryUnlimited } from '../../../utils/quota'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const adminId = decoded.userId

    // Check admin's role using RBAC
    const admin = await getQuery(
      'SELECT u.id, r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?',
      [adminId]
    ) as any

    if (!admin) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Akses ditolak'
      })
    }

    const body = await readBody(event)
    console.log('[Create User] ===== START CREATE USER =====')
    console.log('[Create User] Request body:', JSON.stringify(body, null, 2))
    
    const { username, email, password, full_name, contact_phone, user_category, role } = body

    console.log('[Create User] Parsed fields:', {
      username,
      email,
      hasPassword: !!password,
      full_name,
      contact_phone,
      user_category,
      role
    })

    if (!username || !email || !password || !full_name || !user_category) {
      console.log('[Create User] Missing required fields!')
      throw createError({
        statusCode: 400,
        statusMessage: 'Field yang diperlukan: username, email, password, full_name, user_category'
      })
    }

    // Validate user_category against dynamic categories
    console.log('[Create User] Validating user_category...')
    const validCategories = await allQuery('SELECT name FROM user_categories WHERE is_active = 1') as { name: string }[]
    const validCategoryNames = validCategories.map(c => c.name)
    console.log('[Create User] Valid categories:', validCategoryNames)
    console.log('[Create User] Received category:', user_category)
    
    if (!validCategoryNames.includes(user_category)) {
      console.log('[Create User] Invalid category!')
      throw createError({
        statusCode: 400,
        statusMessage: `Kategori pengguna tidak valid. Valid: ${validCategoryNames.join(', ')}`
      })
    }

    // ── Security fix: only super_admin can assign unlimited-quota categories ──
    const categoryIsUnlimited = await isCategoryUnlimited(user_category)
    if (categoryIsUnlimited && admin.role_name !== 'super_admin') {
      console.warn('[Create User] SECURITY: non-super-admin tried to assign unlimited category:', user_category)
      throw createError({
        statusCode: 403,
        statusMessage: 'Hanya Super Admin yang dapat membuat akun dengan kategori kuota unlimited (DPP/BGKP)'
      })
    }

    // Validate and set role
    let roleId: number | null = null
    let roleString: string = 'user'

    console.log('[Create User] Validating role:', role)

    if (role) {
      const normalizedRole = role.toLowerCase()
      console.log('[Create User] Normalized role:', normalizedRole)
      
      // If role is 'user', set role_id to NULL (booking user)
      if (normalizedRole === 'user') {
        roleId = null
        roleString = 'user'
        console.log('[Create User] Setting as booking user (role_id = NULL)')
      } else {
        // For admin roles, get role_id from roles table
        console.log('[Create User] Looking up admin role...')
        const roleRecord = await getQuery('SELECT id, name FROM roles WHERE LOWER(name) = ?', [normalizedRole]) as { id?: number; name?: string } | undefined

        console.log('[Create User] Role record found:', roleRecord)

        if (roleRecord?.id) {
          // Check permissions for role assignment
          console.log('[Create User] Current admin role:', admin.role_name)
          if (admin.role_name !== 'super_admin') {
            // Non-super-admins can only create specific roles
            if (admin.role_name === 'admin_komsos' && normalizedRole === 'kontributor_berita') {
              // Allow admin_komsos to create kontributor_berita
            } else {
              console.log('[Create User] Permission denied - not super admin and not allowed role')
              throw createError({
                statusCode: 403,
                statusMessage: 'Anda tidak memiliki izin untuk membuat akun dengan role ini'
              })
            }
          }
          roleId = roleRecord.id
          roleString = roleRecord.name || normalizedRole
          console.log('[Create User] Setting as admin (role_id =', roleId, ')')
        } else {
          console.log('[Create User] Invalid role!')
          throw createError({
            statusCode: 400,
            statusMessage: `Role tidak valid: ${role}. Valid roles: user, super_admin, admin_komsos, admin_sekretariat, kontributor_berita`
          })
        }
      }
    }

    // Hash password
    const passwordHash = await hashPassword(password)

    console.log('[Create User] Attempting to insert user:', {
      username,
      email,
      full_name,
      user_category,
      roleString,
      roleId
    })

    // Sanitize data: convert undefined/empty to proper SQL values
    // IMPORTANT: MySQL doesn't accept undefined, must be null
    const sanitizedData = {
      username: username || null,
      email: email || null,
      passwordHash: passwordHash || null,
      full_name: full_name || null,
      // For optional fields, explicitly set to null if empty
      contact_phone: contact_phone ? String(contact_phone) : null,
      user_category: user_category || null,
      roleString: roleString || 'user',
      roleId: roleId === undefined || roleId === null ? null : roleId
    }

    console.log('[Create User] Sanitized data:', sanitizedData)

    // Validate sanitized data doesn't contain undefined
    for (const [key, value] of Object.entries(sanitizedData)) {
      if (value === undefined) {
        console.error(`[Create User] ERROR: ${key} is undefined!`)
        throw createError({
          statusCode: 400,
          statusMessage: `Field ${key} tidak valid (undefined)`
        })
      }
    }

    // Insert user — admin-created users are immediately ACTIVE
    const result = await runQuery(
      'INSERT INTO users (username, email, password_hash, full_name, contact_phone, user_category, role, role_id, account_status) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [
        sanitizedData.username,
        sanitizedData.email,
        sanitizedData.passwordHash,
        sanitizedData.full_name,
        sanitizedData.contact_phone,
        sanitizedData.user_category,
        sanitizedData.roleString,
        sanitizedData.roleId,
        'ACTIVE'
      ]
    )

    console.log('[Create User] Insert result:', result)
    console.log('[Create User] Insert ID:', result?.insertId)
    
    const newUserId = result?.insertId

    if (!newUserId) {
      console.error('[Create User] ERROR: No insert ID returned!')
      console.error('[Create User] Result object:', JSON.stringify(result))
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal mendapatkan ID user baru'
      })
    }

    console.log('[Create User] Insert successful, ID:', newUserId)

    // Fetch the newly created user to return complete data
    const newUser = await getQuery(`
      SELECT 
        u.id, 
        u.username, 
        u.email, 
        u.full_name, 
        u.contact_phone, 
        u.user_category, 
        u.role, 
        u.role_id,
        r.name as role_name, 
        r.display_name as role_display_name, 
        u.created_at
      FROM users u
      LEFT JOIN roles r ON u.role_id = r.id
      WHERE u.id = ?
    `, [newUserId])

    console.log('[Create User] User created successfully:', newUser)

    return {
      message: 'Pengguna berhasil dibuat',
      user: newUser
    }
  } catch (error: any) {
    console.error('[Create User] ===== ERROR =====')
    console.error('[Create User] Error type:', error.constructor.name)
    console.error('[Create User] Error message:', error.message)
    console.error('[Create User] Error code:', error.code)
    console.error('[Create User] Error statusCode:', error.statusCode)
    console.error('[Create User] Error statusMessage:', error.statusMessage)
    console.error('[Create User] Full error:', error)
    console.error('[Create User] Stack trace:', error.stack)
    
    // Check for duplicate key error
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username atau email sudah digunakan'
      })
    }
    
    // If it's already a createError, rethrow it
    if (error.statusCode) {
      throw error
    }
    
    // Generic error
    throw createError({
      statusCode: 500,
      statusMessage: `Gagal membuat pengguna: ${error.message}`
    })
  }
})
