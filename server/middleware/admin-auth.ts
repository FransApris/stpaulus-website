import { requireAuth, getUserPermissions } from '../utils/auth'

// Role name → id mapping (must match the database)
const roleIdMap: Record<string, number> = {
  super_admin: 1,
  admin_komsos: 2,
  admin_sekretariat: 3
}

export default defineEventHandler(async (event) => {
  // Only applies to admin API routes, except login and OPTIONS preflight
  if (event.node.req.url?.startsWith('/api/admin') && !event.node.req.url?.startsWith('/api/admin/login')) {
    if (event.method === 'OPTIONS') {
      return
    }

    try {
      const decoded = requireAuth(event)
      if (decoded) {
        const roleId = roleIdMap[decoded.role] ?? null
        const user: any = { role_id: roleId, role: decoded.role }

        let permissions: string[]

        try {
          permissions = await getUserPermissions(user)
          console.log('[Auth Middleware] Permissions fetched - role:', decoded.role, 'role_id:', roleId, 'count:', permissions.length, 'perms:', permissions)
        } catch (permError) {
          console.error('[Auth Middleware] Error getting permissions:', permError)
          permissions = []
        }

        event.context.auth = {
          userId: decoded.userId,
          role: decoded.role,
          permissions
        }
        
        console.log('[Auth Middleware] Auth context set:', {
          userId: decoded.userId,
          role: decoded.role,
          permissionsCount: permissions.length
        })
      }
    } catch (error) {
      const statusCode = error && typeof error === 'object' && 'statusCode' in error ? (error as any).statusCode : 'unknown'
      if (statusCode !== 401) {
        console.error('[Auth Middleware] Unexpected auth failure:', {
          message: error instanceof Error ? error.message : String(error),
          statusCode,
          url: event.node.req.url
        })
      }
      throw error
    }
  }
})
