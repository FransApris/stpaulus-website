import { requireAuth, getUserPermissions } from '../utils/auth'

// In-memory cache for permissions per role_id (keyed by role_id number)
// Avoids a DB round-trip on every admin API request
const permissionsCacheTTL = 5 * 60 * 1000 // 5 minutes
const permissionsCache = new Map<number, { permissions: string[], expiresAt: number }>()

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

        // Check cache first (avoid DB query on every request)
        const cacheKey = roleId ?? decoded.role
        const cached = permissionsCache.get(cacheKey as number)
        if (cached && Date.now() < cached.expiresAt) {
          permissions = cached.permissions
        } else {
          try {
            permissions = await getUserPermissions(user)
            permissionsCache.set(cacheKey as number, {
              permissions,
              expiresAt: Date.now() + permissionsCacheTTL
            })
          } catch (permError) {
            console.error('[Auth Middleware] Error getting permissions:', permError)
            permissions = []
          }
        }

        event.context.auth = {
          userId: decoded.userId,
          role: decoded.role,
          permissions
        }
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
