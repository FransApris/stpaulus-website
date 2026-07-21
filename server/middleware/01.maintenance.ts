/**
 * server/middleware/01.maintenance.ts
 * 
 * Global Middleware untuk Maintenance Mode.
 * Mencegah bypass dengan cara mengunci path di sisi server (SSR & API).
 */
import { readMaintenanceConfig, MANAGED_PAGES } from '~/server/utils/maintenance'
import { verifyToken } from '~/server/utils/auth'
import { getHeader } from 'h3'

export default defineEventHandler((event) => {
  // Ambil path request tanpa trailing slash (gunakan fallback untuk mencegah TS error strict mode)
  const basePath = (event.path || '').split('?')[0] || ''
  const path = basePath.replace(/\/$/, '') || '/'

  // Jangan blokir rute admin, login, atau aset statis
  if (path.startsWith('/admin') || path.startsWith('/_nuxt') || path.startsWith('/api/admin')) {
    return
  }

  const config = readMaintenanceConfig()

  // Periksa apakah path saat ini merupakan salah satu halaman yang dimanage
  const matchedPage = MANAGED_PAGES.find(p => p.path === path || (p.path !== '/' && path.startsWith(p.path + '/')))

  if (matchedPage && config[matchedPage.key]) {
    // Maintenance aktif untuk halaman ini.
    // Lakukan pengecekan Bypass Logic (khusus super_admin)
    let isSuperAdmin = false
    const authHeader = getHeader(event, 'authorization')

    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.substring(7)
      try {
        const decoded = verifyToken(token)
        if (decoded && decoded.role === 'super_admin') {
          isSuperAdmin = true
        }
      } catch (e) {
        // Abaikan error token tidak valid (akan dianggap bukan super_admin)
      }
    }

    if (!isSuperAdmin) {
      // Tolak akses jika bukan super_admin
      // Menggunakan status 503 (Service Unavailable) untuk mencegah Information Disclosure
      // dan memberikan sinyal yang tepat untuk SEO
      throw createError({
        statusCode: 503,
        statusMessage: 'Service Unavailable',
        message: 'Layanan sedang dalam perbaikan rutin.',
        data: {
          error: 'maintenance_mode',
          message: 'Layanan sedang dalam perbaikan rutin.'
        }
      })
    }
  }
})
