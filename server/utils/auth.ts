import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getHeader, getCookie, setCookie, deleteCookie, getRouterParam, type H3Event } from 'h3'
import db, { getQuery, allQuery } from '../database/db'


// JWT_SECRET will be retrieved at runtime inside functions

// Types
interface User {
  id: number
  username: string
  email: string
  password_hash: string
  role: string
  role_id?: number
  created_at: string
  updated_at: string
}

interface AuthResult {
  user: {
    id: number
    username: string
    email: string
    role: string
    role_id?: number
  }
  accessToken: string
  refreshToken: string
}

interface AuthContext {
  userId: number
  permissions: string[]
}

// Password hashing
export const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10)
}

export const verifyPassword = async (password: string, hash: string): Promise<boolean> => {
  return await bcrypt.compare(password, hash)
}

// JWT token generation with security validation
export const generateAccessToken = (userId: number, role: string, username?: string): string => {
  const config = useRuntimeConfig()

  // Validate JWT secret strength
  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    throw new Error('❌ SECURITY ERROR: JWT_SECRET must be at least 32 characters for security. Please generate a strong secret in your .env file.')
  }

  const payload: any = { userId, role }
  if (username) {
    payload.username = username
  }
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '8h' })
}

export const generateRefreshToken = (userId: number, role: string, username?: string): string => {
  const config = useRuntimeConfig()

  // Validate JWT secret strength
  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    throw new Error('❌ SECURITY ERROR: JWT_SECRET must be at least 32 characters for security. Please generate a strong secret in your .env file.')
  }

  const payload: any = { userId, role }
  if (username) {
    payload.username = username
  }
  return jwt.sign(payload, config.jwtSecret, { expiresIn: '7d' })
}

export const generateToken = (userId: number, role: string, username?: string): string => {
  // Keep for backward compatibility, but use generateAccessToken for new code
  return generateAccessToken(userId, role, username)
}

export const verifyToken = (token: string): any => {
  const config = useRuntimeConfig()
  try {
    const decoded = jwt.verify(token, config.jwtSecret)
    return decoded
  } catch (error: any) {
    return null
  }
}

// Authentication middleware for API routes
export const requireAuth = (event: any) => {
  let token: string | undefined

  // 1. Cek Authorization Header terlebih dahulu (Bearer <token>)
  const authHeader = getHeader(event, 'authorization')
  if (authHeader && authHeader.startsWith('Bearer ')) {
    token = authHeader.substring(7)
  }

  // 2. Fallback ke Secure HttpOnly Cookie
  if (!token) {
    token = getCookie(event, 'auth_token') || getCookie(event, 'accessToken')
  }

  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized — Token autentikasi tidak ditemukan'
    })
  }

  const decoded = verifyToken(token)

  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token — Token tidak valid atau telah kadaluarsa'
    })
  }

  return decoded
}

// ─── Secure HttpOnly Cookie Helpers ──────────────────────────────────────────

/**
 * Menyetel HttpOnly, Secure, SameSite=Lax cookie untuk token autentikasi.
 * Mencegah token diekstrak melalui JavaScript (perlindungan XSS).
 */
export const setAuthCookies = (event: any, accessToken: string, refreshToken?: string) => {
  const isProduction = process.env.NODE_ENV === 'production'

  // Access Token Cookie (8 jam)
  setCookie(event, 'auth_token', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8, // 8 jam
    path: '/'
  })

  // Alias cookie nama 'accessToken' untuk kompatibilitas
  setCookie(event, 'accessToken', accessToken, {
    httpOnly: true,
    secure: isProduction,
    sameSite: 'lax',
    maxAge: 60 * 60 * 8,
    path: '/'
  })

  // Refresh Token Cookie (7 hari)
  if (refreshToken) {
    setCookie(event, 'refreshToken', refreshToken, {
      httpOnly: true,
      secure: isProduction,
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 7 hari
      path: '/'
    })
  }
}

/**
 * Membersihkan semua cookie autentikasi saat logout.
 */
export const clearAuthCookies = (event: any) => {
  deleteCookie(event, 'auth_token', { path: '/' })
  deleteCookie(event, 'accessToken', { path: '/' })
  deleteCookie(event, 'refreshToken', { path: '/' })
}


// User authentication functions
export const authenticateUser = async (username: string, password: string): Promise<AuthResult | null> => {
  const normalizedLogin = String(username || '').trim()
  const user = await getQuery(
    'SELECT * FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?) LIMIT 1',
    [normalizedLogin, normalizedLogin]
  ) as User | undefined

  if (!user) {
    return null
  }

  const isValidPassword = await verifyPassword(password, user.password_hash)

  if (!isValidPassword) {
    return null
  }

  // Generate tokens with username
  const accessToken = generateAccessToken(user.id, user.role, user.username)
  const refreshToken = generateRefreshToken(user.id, user.role, user.username)

  return {
    user: {
      id: user.id,
      username: user.username,
      email: user.email,
      role: user.role,
      role_id: user.role_id
    },
    accessToken,
    refreshToken
  }
}

// RBAC Functions
export const getUserPermissions = async (user: any): Promise<string[]> => {
  // Super Admin (role_id = 1) gets all permissions
  if (user.role_id === 1) {
    try {
      const allPermissions = await allQuery('SELECT name FROM permissions', []) as { name: string }[]

      // If database has permissions, use them
      if (allPermissions && allPermissions.length > 0) {
        return allPermissions.map(p => p.name)
      }
    } catch (error) {
      console.log('[Auth] Error fetching super_admin permissions from database:', error)
    }

    // Fallback for super_admin if DB is empty or error
    return [
      'dashboard',
      'manage_users',
      'manage_articles',
      'manage_article_categories',
      'manage_news',
      'manage_gallery',
      'manage_gallery_categories',
      'manage_agenda',
      'manage_agenda_categories',
      'manage_bookings',
      'manage_rooms',
      'manage_documents',
      'manage_document_categories',
      'manage_chatbot_faqs',
      'manage_chatbot_faq_categories',
      'manage_contact_messages',
      'manage_footer_settings',
      'manage_hero_themes',
      'manage_liturgy_types',
      'manage_mass_schedules',
      'manage_regular_mass_schedules',
      'manage_pages',
      'manage_content',
      'manage_roles',
      'manage_users_komsos_sekretariat',
      'view_stats',
      'view_articles',
      'view_bookings',
      'view_agenda',
      'view_gallery'
    ]
  }

  if (!user.role_id) return []

  try {
    console.log('[Auth] Starting permission fetch for role_id:', user.role_id)
    
    const permissions = await allQuery(`
      SELECT p.name
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, [user.role_id]) as { name: string }[]

    console.log('[Auth] Raw query result type:', typeof permissions, 'isArray:', Array.isArray(permissions))
    console.log('[Auth] Raw query result:', permissions)
    console.log('[Auth] Raw query result count:', permissions?.length)

    if (permissions && permissions.length > 0) {
      const permNames = permissions.map(p => p.name)
      console.log('[Auth] Mapped permission names count:', permNames.length)
      console.log('[Auth] Mapped permission names:', permNames)
      return permNames
    } else {
      console.log('[Auth] Query returned empty or null result')
      return []
    }
  } catch (error) {
    console.log('[Auth] Error fetching role permissions from database:', error)
    return []
  }
}

export const requirePermission = (permission: string) => {
  return (event: any) => {
    const authContext = event.context.auth as AuthContext
    if (!authContext || !authContext.permissions?.includes(permission)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Forbidden: Insufficient permissions'
      })
    }
    return authContext
  }
}

export const requireUserManagementPermission = async (event: any) => {
  const authContext = event.context.auth as AuthContext
  if (!authContext) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const { userId, permissions } = authContext

  // Super Admin bisa manage semua
  if (permissions.includes('manage_users')) {
    return authContext
  }

  // Admin Sekretariat bisa manage user biasa, admin_komsos, dan admin_sekretariat
  if (permissions.includes('manage_users_komsos_sekretariat')) {
    // For list/create endpoint (no target user ID), allow access
    const targetUserId = getRouterParam(event, 'id')
    if (!targetUserId) {
      return authContext
    }
    // Cek apakah target user bukan super_admin
    const targetRole = await getQuery('SELECT r.name FROM roles r JOIN users u ON u.role_id = r.id WHERE u.id = ?', [targetUserId]) as { name: string } | undefined
    const allowedRoles = ['user', 'admin_komsos', 'admin_sekretariat']
    if (!targetRole || allowedRoles.includes(targetRole.name)) {
      return authContext
    }
  }

  throw createError({
    statusCode: 403,
    statusMessage: 'Forbidden: Cannot manage this user type'
  })
}

export const getUserById = async (userId: number) => {
  return await getQuery('SELECT id, username, email, role, created_at FROM users WHERE id = ?', [userId])
}
