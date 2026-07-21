/**
 * GET /api/admin/maintenance
 * Membaca status maintenance semua halaman
 */
import { requireAuth } from '../../../utils/auth'
import { MANAGED_PAGES, readMaintenanceConfig } from '~/server/utils/maintenance'

export default defineEventHandler(async (event) => {
  const user = requireAuth(event)
  if (user.role !== 'super_admin') {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden: Only super admin can access maintenance settings' })
  }

  const config = await readMaintenanceConfig()

  const pages = MANAGED_PAGES.map(page => ({
    ...page,
    active: config[page.key] === true,
  }))

  return { pages }
})
