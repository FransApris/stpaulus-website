import { authenticateUser, getUserPermissions } from '../../utils/auth'
import { getQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  try {
    const body = await readBody(event)

    const { username, password } = body

    if (!username || !password) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Username dan password diperlukan'
      })
    }

    console.log('[User Login] Attempting login for:', username)

    const result = await authenticateUser(username, password)

    if (!result) {
      console.log('[User Login] Authentication failed for:', username)
      throw createError({
        statusCode: 401,
        statusMessage: 'Username atau password salah'
      })
    }

    // Check user type - booking users should NOT have role_id (or role_id should be NULL)
    const userDetails = await getQuery('SELECT role_id, role FROM users WHERE id = ?', [result.user.id]) as { role_id?: number; role?: string } | undefined
    
    console.log('[User Login] User details:', userDetails)

    // Booking users should have role_id = NULL or 0
    // Users with admin roles (role_id > 0) cannot login to booking system
    if (userDetails && userDetails.role_id && userDetails.role_id > 0) {
      console.log('[User Login] Access denied - User is an admin:', username)
      throw createError({
        statusCode: 403,
        statusMessage: 'Akses ditolak. Akun admin tidak dapat digunakan untuk pemesanan ruangan. Silakan gunakan panel admin.'
      })
    }

    // Add permissions to user object (for regular users, this will be minimal)
    const permissions = await getUserPermissions(result.user)
    ;(result.user as any).permissions = permissions

    console.log('[User Login] Login successful for booking user:', username)

    return result
  } catch (error: any) {
    console.error('[User Login] Error:', error)
    throw error
  }
})

