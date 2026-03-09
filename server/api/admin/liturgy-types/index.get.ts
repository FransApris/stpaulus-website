import { allQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication context
    if (!event.context.auth) {
      console.error('[Liturgy Types GET] No auth context found')
      throw createError({
        statusCode: 401,
        statusMessage: 'Authentication required'
      })
    }

    console.log('[Liturgy Types GET] Auth context:', {
      userId: event.context.auth.userId,
      role: event.context.auth.role,
      permissionsCount: event.context.auth.permissions?.length || 0
    })

    // Check permission
    try {
      requirePermission('manage_liturgy_types')(event)
    } catch (permError) {
      console.error('[Liturgy Types GET] Permission check failed:', permError)
      throw permError
    }

    // Fetch liturgy types
    const liturgyTypes = await allQuery(`
      SELECT id, name, slug, icon, color, description, display_order, is_active, created_at, updated_at
      FROM liturgy_types
      ORDER BY display_order ASC, name ASC
    `)

    console.log('[Liturgy Types GET] Fetched', liturgyTypes.length, 'liturgy types')
    return liturgyTypes
  } catch (error) {
    console.error('[Liturgy Types GET] Error:', error)

    // If error is already a createError, rethrow it
    if (error && typeof error === 'object' && 'statusCode' in error) {
      throw error
    }

    // Otherwise create a 500 error
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch liturgy types: ' + (error instanceof Error ? error.message : String(error))
    })
  }
})
