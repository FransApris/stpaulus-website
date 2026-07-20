/**
 * POST /api/admin/maintenance
 * Toggle status maintenance untuk satu halaman
 * Body: { key: string, active: boolean }
 */
import { requireAuth } from '../../../utils/auth'
import { MANAGED_PAGES, readMaintenanceConfig, saveMaintenanceConfig } from '~/server/utils/maintenance'

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const body = await readBody(event)
  const { key, active } = body

  if (!key || typeof active !== 'boolean') {
    throw createError({
      statusCode: 400,
      statusMessage: 'Parameter "key" dan "active" (boolean) wajib diisi'
    })
  }

  const validKeys = MANAGED_PAGES.map(p => p.key)
  if (!validKeys.includes(key)) {
    throw createError({
      statusCode: 400,
      statusMessage: `Halaman "${key}" tidak dikenal`
    })
  }

  const config = readMaintenanceConfig()
  config[key] = active
  saveMaintenanceConfig(config)

  return {
    success: true,
    key,
    active,
    message: active
      ? `Mode maintenance halaman "${key}" diaktifkan`
      : `Mode maintenance halaman "${key}" dinonaktifkan`
  }
})
