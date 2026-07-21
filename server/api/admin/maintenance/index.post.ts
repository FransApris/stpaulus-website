/**
 * POST /api/admin/maintenance
 * Toggle status maintenance untuk satu halaman
 * Body: { key: string, active: boolean }
 * 
 * SECURITY NOTES (Audit):
 * 1. CSRF Protection: Aplikasi ini menggunakan pola Token-Based Auth (Bearer JWT) 
 *    di mana token disimpan dalam sessionStorage, bukan Cookie otomatis.
 *    Oleh karena itu, endpoint ini secara bawaan aman dari serangan CSRF.
 * 2. BFLA (Broken Function Level Authorization): Role secara eksplisit dicek
 *    di level fungsi ini. Hanya 'super_admin' yang diizinkan memutasi state.
 */
import { requireAuth } from '../../../utils/auth'
import { MANAGED_PAGES, readMaintenanceConfig, saveMaintenanceConfig } from '~/server/utils/maintenance'

export default defineEventHandler(async (event) => {
  // BFLA: Autentikasi dan Otorisasi secara eksplisit (Server-side)
  const user = requireAuth(event)
  if (user.role !== 'super_admin') {
    throw createError({ 
      statusCode: 403, 
      statusMessage: 'Forbidden: Only super admin can access maintenance settings',
      data: { error: 'forbidden', message: 'Akses ditolak.' }
    })
  }

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
