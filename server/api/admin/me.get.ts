import { verifyToken, getUserPermissions } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  const authHeader = getHeader(event, 'authorization')
  
  console.log('[Admin ME] Request received, has auth header:', !!authHeader)
  
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({ statusCode: 401, statusMessage: 'Unauthorized' })
  }

  const token = authHeader.slice(7)
  
  console.log('[Admin ME] Token length:', token.length)
  
  try {
    const payload = verifyToken(token)
    
    console.log('[Admin ME] Token payload:', {
      userId: payload.userId,
      username: payload.username,
      role: payload.role
    })
    
    // Determine role_id based on role name (since token only has role string, not role_id)
    let role_id: number | null = null
    if (payload.role === 'super_admin') {
      role_id = 1
    } else if (payload.role === 'admin_komsos') {
      role_id = 2
    } else if (payload.role === 'admin_sekretariat') {
      role_id = 3
    }
    
    const permissions = await getUserPermissions({ id: payload.userId, role_id: role_id })
    
    console.log('[Admin ME] Fetched permissions for role_id:', role_id, 'count:', permissions.length)
    console.log('[Admin ME] Permission list:', permissions)
    
    // Return complete user data
    return {
      id: payload.userId,
      username: payload.username || 'Admin',
      email: payload.email || '',
      role: payload.role,
      role_id: role_id,
      permissions: permissions
    }
  } catch (error) {
    throw createError({ statusCode: 401, statusMessage: 'Invalid token' })
  }
})
