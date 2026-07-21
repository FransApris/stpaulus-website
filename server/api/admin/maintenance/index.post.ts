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
  try {
    // BFLA: Autentikasi dan Otorisasi secara eksplisit (Server-side)
    const user = requireAuth(event)
    if (user.role !== 'super_admin') {
      throw createError({ 
        statusCode: 403, 
        statusMessage: 'Forbidden: Only super admin can access maintenance settings',
        data: { error: 'forbidden', message: 'Akses ditolak.' }
      })
    }

    let body
    try {
      body = await readBody(event)
    } catch (parseError) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid JSON Payload',
        data: { error: 'invalid_payload', message: 'Format payload tidak valid.' }
      })
    }

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

    const config = await readMaintenanceConfig()
    config[key] = active
    await saveMaintenanceConfig(config)

    return {
      success: true,
      key,
      active,
      message: active
        ? `Mode maintenance halaman "${key}" diaktifkan`
        : `Mode maintenance halaman "${key}" dinonaktifkan`
    }
  } catch (error: any) {
    // Log error di console server untuk keperluan debugging (Permission denied, DB error, dll)
    console.error('[API Error] /api/admin/maintenance POST:', error)

    // Jika error sudah merupakan instance dari H3Error (createError), lempar kembali
    if (error.statusCode) {
      throw error
    }

    // Jika terjadi error tidak terduga (misal: tabel DB belum di-migrate, gagal tulis file)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal Server Error',
      data: {
        error: 'internal_server_error',
        message: 'Gagal memperbarui status maintenance. Pastikan migrasi database sudah dijalankan atau periksa log server untuk detailnya.',
        // Hindari membocorkan stack trace ke publik di production
        detail: process.env.NODE_ENV === 'development' ? error.message : undefined
      }
    })
  }
})
