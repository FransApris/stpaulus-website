import { allQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'

const normalizeImagePath = (imagePath: string | null) => {
  if (!imagePath) {
    return imagePath
  }

  const cleaned = imagePath.trim().replace(/\\/g, '/')
  if (!cleaned) {
    return null
  }
  if (/^https?:\/\//i.test(cleaned) || cleaned.startsWith('//')) {
    return cleaned
  }
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

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
    data: (themes || []).map((theme: any) => ({
      ...theme,
      image_path: normalizeImagePath(theme.image_path)
    }))
  }
})
