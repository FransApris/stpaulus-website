/**
 * POST /api/admin/maintenance
 * Toggle status maintenance untuk satu atau semua halaman
 * Body: { key: string, active: boolean }
 */
import { requireAuth } from '../../../utils/auth'
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'
import { readMaintenanceConfig, MANAGED_PAGES } from './index.get'

const CONFIG_PATH = join(process.cwd(), 'server', 'data', 'maintenance.json')

function saveMaintenanceConfig(config: Record<string, boolean>) {
  const dir = dirname(CONFIG_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}

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
