import { allQuery, getQuery as dbGetQuery } from '~/server/database/db'
import { requireAuth, requirePermission, getUserPermissions } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Verify authentication - admin only
    const decoded = requireAuth(event)
    const userId = decoded.userId

    // Set auth context for permission checking
    const user = await dbGetQuery('SELECT role_id FROM users WHERE id = ?', [userId])
    if (!user) {
      throw createError({
        statusCode: 401,
        statusMessage: 'User not found'
      })
    }
    const permissions = await getUserPermissions(user)
    event.context.auth = {
      userId: userId,
      permissions: permissions
    }

    // Check permissions - admin only
    requirePermission('manage_bookings')(event)

    const query = getQuery(event)
    const limit = Number(query.limit) || 50
    const offset = Number(query.offset) || 0
    const action = query.action as string | undefined
    const userIdFilter = query.user_id as string | undefined

    // Build the SQL query
    let sql = 'SELECT al.id, al.user_id, al.action, al.entity_type as target_type, al.entity_id as target_id, al.old_value, al.new_value, al.new_value as description, al.ip_address, al.user_agent, al.created_at, u.full_name as user_name, u.email as user_email FROM audit_logs al LEFT JOIN users u ON al.user_id = u.id WHERE 1=1'
    const params: any[] = []

    if (action) {
      sql += ' AND al.action = ?'
      params.push(action)
    }

    if (userIdFilter) {
      sql += ' AND al.user_id = ?'
      params.push(userIdFilter)
    }

    sql += ` ORDER BY al.created_at DESC LIMIT ${limit} OFFSET ${offset}`

    // Get audit logs
    const logs = await allQuery(sql, params)

    // Get total count
    let countSql = 'SELECT COUNT(*) as total FROM audit_logs WHERE 1=1'
    const countParams: any[] = []

    if (action) {
      countSql += ' AND action = ?'
      countParams.push(action)
    }

    if (userIdFilter) {
      countSql += ' AND user_id = ?'
      countParams.push(userIdFilter)
    }

    const countResult = await dbGetQuery(countSql, countParams)
    const total = countResult?.total || 0

    return {
      success: true,
      logs: logs || [],
      pagination: {
        limit,
        offset,
        total,
      },
    }
  } catch (error: any) {
    console.error('[AUDIT_LOGS] Error fetching audit logs:', error)
    console.error('[AUDIT_LOGS] Error message:', error.message)
    console.error('[AUDIT_LOGS] SQL Error:', error.sqlMessage || 'N/A')
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.sqlMessage || error.message || 'Failed to fetch audit logs',
    })
  }
})
