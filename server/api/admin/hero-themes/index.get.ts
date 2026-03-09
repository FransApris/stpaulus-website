import { allQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_hero_themes')(event)

  const themes = await allQuery(`
    SELECT id, name, image_path, is_active, created_at, updated_at
    FROM hero_themes
    ORDER BY created_at DESC
  `, [])

  return {
    success: true,
    data: themes
  }
})
