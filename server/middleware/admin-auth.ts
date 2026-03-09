import { requireAuth, getUserPermissions } from '../utils/auth'

export default defineEventHandler(async (event) => {
  // Hanya berlaku untuk rute API admin, kecuali login dan OPTIONS preflight requests
  if (event.node.req.url?.startsWith('/api/admin') && !event.node.req.url?.startsWith('/api/admin/login')) {
    console.log('Admin auth middleware triggered for:', event.method, event.node.req.url)

    // Skip auth check for OPTIONS preflight requests
    if (event.method === 'OPTIONS') {
      console.log('[Auth Middleware] Skipping auth check for OPTIONS preflight request');
      return;
    }

    try {
      const decoded = requireAuth(event)
      console.log('Token decoded successfully:', decoded)
      if (decoded) {
        // Create user object with role from JWT payload
        const user: any = { role_id: null, role: decoded.role }

        // Determine role_id based on role name for permission checking
        if (decoded.role === 'super_admin') {
          user.role_id = 1
        } else if (decoded.role === 'admin_komsos') {
          user.role_id = 2
        } else if (decoded.role === 'admin_sekretariat') {
          user.role_id = 3
        }

        try {
          const permissions = await getUserPermissions(user)
          console.log('User permissions:', permissions)
          // Simpan user dan permissions di dalam context event
          event.context.auth = {
            userId: decoded.userId,
            role: decoded.role,
            permissions: permissions
          }
        } catch (permError) {
          console.error('[Auth Middleware] Error getting permissions:', permError)
          // Set auth context with empty permissions and continue
          // Don't throw error here, let the endpoint handle authorization
          event.context.auth = {
            userId: decoded.userId,
            role: decoded.role,
            permissions: []
          }
        }
      }
    } catch (error) {
      // Log auth failures as info/warning instead of error (expected for invalid/expired tokens)
      const statusCode = error && typeof error === 'object' && 'statusCode' in error ? error.statusCode : 'unknown'
      const message = error instanceof Error ? error.message : String(error)

      // Only log detailed error for unexpected failures (not 401)
      if (statusCode !== 401) {
        console.error('[Auth Middleware] Unexpected auth failure:', {
          message,
          statusCode,
          url: event.node.req.url
        })
      } else {
        // 401 is expected when token is invalid/expired - just log as info
        console.log('[Auth Middleware] Auth check failed (invalid/expired token) for:', event.node.req.url)
      }

      // Jika auth gagal, throw error untuk ditangani oleh error handler
      throw error
    }
  }
})
