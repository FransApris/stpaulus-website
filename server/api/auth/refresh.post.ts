import { verifyToken, generateAccessToken, generateRefreshToken, getUserPermissions } from '../../utils/auth'
import { getQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { refreshToken } = body

  if (!refreshToken) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Refresh token diperlukan'
    })
  }

  // Verify refresh token
  const decoded = verifyToken(refreshToken)
  if (!decoded || !decoded.userId || !decoded.role) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Invalid refresh token'
    })
  }

  // Verify user still exists
  const user = await getQuery('SELECT id, username, email, role, role_id FROM users WHERE id = ?', [decoded.userId])
  if (!user) {
    throw createError({
      statusCode: 401,
      statusMessage: 'User not found'
    })
  }

  // Generate new tokens
  const newAccessToken = generateAccessToken(user.id, user.role)
  const newRefreshToken = generateRefreshToken(user.id, user.role)

  // Add permissions to user object
  const permissions = await getUserPermissions(user)
  ;(user as any).permissions = permissions

  return {
    user,
    accessToken: newAccessToken,
    refreshToken: newRefreshToken
  }
})
