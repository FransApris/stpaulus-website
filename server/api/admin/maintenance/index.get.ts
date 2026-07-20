/**
 * GET /api/admin/maintenance
 * Membaca status maintenance semua halaman
 */
import { requireAuth } from '../../../utils/auth'
import { MANAGED_PAGES, readMaintenanceConfig } from '../../../utils/maintenance'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const config = readMaintenanceConfig()

  const pages = MANAGED_PAGES.map(page => ({
    ...page,
    active: config[page.key] === true,
  }))

  return { pages }
})
