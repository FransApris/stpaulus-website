import * as bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'
import { getHeader, getRouterParam } from 'h3'
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
  const authHeader = getHeader(event, 'authorization')
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized'
    })
  }

  const token = authHeader.substring(7)
  const decoded = verifyToken(token)

  if (!decoded) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid token'
    })
  }

  return decoded
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
    const permissions = await allQuery(`
      SELECT p.name
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      WHERE rp.role_id = ?
    `, [user.role_id]) as { name: string }[]

    console.log('[Auth] getUserPermissions - role_id:', user.role_id, 'fetched count:', permissions.length)
    if (permissions && permissions.length > 0) {
      const permNames = permissions.map(p => p.name)
      console.log('[Auth] Permission names:', permNames)
      return permNames
    }
  } catch (error) {
    console.log('[Auth] Error fetching role permissions from database:', error)
  }

  // Fallback for other roles
  return []
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

  // Admin Sekretariat hanya bisa manage admin_komsos dan admin_sekretariat
  if (permissions.includes('manage_users_komsos_sekretariat')) {
    // For list endpoint (no target user), allow access
    const targetUserId = getRouterParam(event, 'id')
    if (!targetUserId) {
      return authContext
    }
    // Cek apakah target user adalah admin_komsos atau admin_sekretariat
    const targetRole = await getQuery('SELECT r.name FROM roles r JOIN users u ON u.role_id = r.id WHERE u.id = ?', [targetUserId]) as { name: string } | undefined
    if (targetRole && ['admin_komsos', 'admin_sekretariat'].includes(targetRole.name)) {
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
