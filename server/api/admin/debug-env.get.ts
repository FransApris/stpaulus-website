/**
 * server/api/admin/debug-env.get.ts
 *
 * ⚠️  ENDPOINT DIAGNOSTIK SEMENTARA — HAPUS SETELAH MASALAH TERIDENTIFIKASI
 *
 * Endpoint ini hanya dapat diakses dari IP lokal / dev environment.
 * Mengecek apakah semua environment variable penting sudah terkonfigurasi
 * dengan benar di Railway tanpa mengekspos nilai sensitifnya.
 *
 * Akses: GET /api/admin/debug-env
 */

export default defineEventHandler(async (event) => {
  // ── KEAMANAN: Hanya izinkan dari localhost ─────────────────────────────
  const ip: string =
    event.node.req.headers['x-forwarded-for']?.toString().split(',')[0]?.trim() ??
    event.node.req.socket?.remoteAddress ??
    'unknown'

  // Hanya izinkan akses lokal (hapus ini setelah selesai debug)
  const ALLOWED_IPS = ['127.0.0.1', '::1', 'localhost']
  const isLocal = ALLOWED_IPS.some(allowed => ip.includes(allowed))

  // Untuk Railway/Production: tambahkan IP Anda di sini sementara
  // const TEMP_DEBUG_IP = process.env.DEBUG_ALLOWED_IP
  // if (!isLocal && ip !== TEMP_DEBUG_IP) {
  if (!isLocal && process.env.NODE_ENV === 'production') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden — Endpoint diagnostik tidak tersedia di production'
    })
  }
  // ─────────────────────────────────────────────────────────────────────────

  const config = useRuntimeConfig()

  // ── Cek semua environment variable kritis ──────────────────────────────
  const checks = {
    // JWT
    JWT_SECRET: {
      set: !!config.jwtSecret,
      length: config.jwtSecret?.length || 0,
      valid: (config.jwtSecret?.length || 0) >= 32,
      status: !config.jwtSecret ? '❌ TIDAK ADA' : (config.jwtSecret.length < 32 ? '⚠️ TERLALU PENDEK' : '✅ OK')
    },

    // Database
    MYSQL_HOST: {
      set: !!(process.env.MYSQL_HOST || process.env.MYSQLHOST),
      value: (process.env.MYSQL_HOST || process.env.MYSQLHOST || '').replace(/./g, '●').slice(0, -4) +
             (process.env.MYSQL_HOST || process.env.MYSQLHOST || '').slice(-4),
      status: !!(process.env.MYSQL_HOST || process.env.MYSQLHOST) ? '✅ OK' : '❌ TIDAK ADA'
    },
    MYSQL_PORT: {
      set: !!(process.env.MYSQL_PORT || process.env.MYSQLPORT),
      value: process.env.MYSQL_PORT || process.env.MYSQLPORT || '(default 3306)',
      status: '✅ OK (menggunakan default jika kosong)'
    },
    MYSQL_USER: {
      set: !!(process.env.MYSQL_USER || process.env.MYSQLUSER),
      value: process.env.MYSQL_USER || process.env.MYSQLUSER || '',
      status: !!(process.env.MYSQL_USER || process.env.MYSQLUSER) ? '✅ OK' : '❌ TIDAK ADA'
    },
    MYSQL_PASSWORD: {
      set: !!(process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD),
      length: (process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD || '').length,
      status: !!(process.env.MYSQL_PASSWORD || process.env.MYSQLPASSWORD || process.env.MYSQL_ROOT_PASSWORD)
        ? '✅ OK'
        : '❌ TIDAK ADA — KEMUNGKINAN PENYEBAB HTTP 500!'
    },
    MYSQL_DATABASE: {
      set: !!(process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE),
      value: process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE || '',
      status: !!(process.env.MYSQL_DATABASE || process.env.MYSQLDATABASE) ? '✅ OK' : '❌ TIDAK ADA'
    },
    MYSQL_SSL: {
      value: process.env.MYSQL_SSL || '(tidak di-set, default: true di production)',
      status: '✅ INFO'
    },

    // Environment
    NODE_ENV: {
      value: process.env.NODE_ENV || '(tidak di-set)',
      status: process.env.NODE_ENV === 'production' ? '✅ production' : '⚠️ bukan production'
    }
  }

  // ── Uji koneksi database secara langsung ──────────────────────────────
  let dbConnectionTest: { success: boolean; error?: string; latencyMs?: number } = { success: false }
  try {
    const { getConnection } = await import('~/server/database/db')
    const start = Date.now()
    const conn = await getConnection()
    await conn.query('SELECT 1')
    conn.release()
    dbConnectionTest = { success: true, latencyMs: Date.now() - start }
  } catch (err: any) {
    dbConnectionTest = {
      success: false,
      error: `${err?.code || 'UNKNOWN'}: ${err?.message || String(err)}`
    }
  }

  return {
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV,
    diagnostics: checks,
    dbConnectionTest,
    summary: {
      allCriticalVarsSet: checks.JWT_SECRET.valid &&
        checks.MYSQL_HOST.set &&
        checks.MYSQL_USER.set &&
        checks.MYSQL_PASSWORD.set &&
        checks.MYSQL_DATABASE.set,
      dbConnected: dbConnectionTest.success,
      recommendation: !checks.JWT_SECRET.valid
        ? '🔴 Set JWT_SECRET minimal 32 karakter di Railway Variables'
        : !dbConnectionTest.success
          ? '🔴 Koneksi database gagal — periksa MYSQL_* variables di Railway'
          : '🟢 Semua konfigurasi terlihat OK'
    }
  }
})
