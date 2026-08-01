import { authenticateUser, setAuthCookies } from '../../utils/auth'
import { getQuery, runQuery } from '../../database/db'
import { logger } from '../../utils/logger'
import { isBlocked, recordFailedAttempt, resetAttempts } from '../../utils/rateLimiter'
import { verifyTotpToken, checkBackupCode } from '../../utils/totp'
import { getRequestHeader } from 'h3'


export default defineEventHandler(async (event) => {
  // ── [PRE-CHECK] Validasi environment sebelum proses apapun ──────────────
  const config = useRuntimeConfig()
  if (!config.jwtSecret || config.jwtSecret.length < 32) {
    logger.critical('[Admin Login] FATAL: JWT_SECRET tidak dikonfigurasi atau terlalu pendek (< 32 karakter). Periksa file .env server.', {
      event: 'JWT_SECRET_MISSING',
      action: 'Tambahkan JWT_SECRET ke .env dengan nilai minimal 32 karakter'
    })
    throw createError({
      statusCode: 500,
      statusMessage: 'Konfigurasi server tidak lengkap. Hubungi Tim IT Paroki.'
    })
  }
  // ─────────────────────────────────────────────────────────────────────────

  const ip = getRequestHeader(event, 'x-forwarded-for')?.split(',')[0].trim()
    || getRequestHeader(event, 'x-real-ip')
    || 'unknown'

  // ── [RATE LIMITER] Cek blokir IP sebelum proses apapun ───────────────────
  const blockStatus = isBlocked(ip)
  if (blockStatus.blocked) {
    logger.security('Blocked IP attempted login', {
      event: 'LOGIN_ATTEMPT_FROM_BLOCKED_IP',
      ip,
      remainingMs: blockStatus.remainingMs
    })
    throw createError({
      statusCode: 429,
      statusMessage: `Terlalu banyak percobaan login. Coba lagi dalam ${blockStatus.retryAfter}.`
    })
  }
  // ─────────────────────────────────────────────────────────────────────────

  try {
    const body = await readBody(event)

    const { username, password, totp_code, backup_code } = body


    if (!username || !password) {
      logger.security('Admin login attempt with missing credentials', { ip })
      throw createError({
        statusCode: 400,
        statusMessage: 'Username dan password diperlukan'
      })
    }

    console.log('[Admin Login] Attempting login for:', username)

    const result = await authenticateUser(username, password)

    if (!result) {
      // ── [RATE LIMITER] Catat kegagalan login ─────────────────────────────
      const attemptResult = recordFailedAttempt(ip, username)
      // ─────────────────────────────────────────────────────────────────────

      logger.logFailedLogin(username, ip, 'Invalid credentials')

      if (attemptResult.blocked) {
        // Baru saja melewati batas — blokir aktif
        throw createError({
          statusCode: 429,
          statusMessage: `Terlalu banyak percobaan login. Akun sementara diblokir selama ${attemptResult.retryAfter}.`
        })
      }

      // Berikan peringatan sisa percobaan jika mendekati batas
      const warningMsg = attemptResult.attemptsLeft <= 2
        ? ` Sisa percobaan: ${attemptResult.attemptsLeft}.`
        : ''

      throw createError({
        statusCode: 401,
        statusMessage: `Username atau password salah.${warningMsg}`
      })
    }

    // Check if user has admin role, password reset flag, and 2FA status
    let userDetails: {
      role_id?: number
      role?: string
      requires_password_reset?: number
      totp_enabled?: number
      totp_secret?: string
      totp_backup_codes?: string
    } | undefined = undefined

    try {
      userDetails = await getQuery(
        'SELECT role_id, role, requires_password_reset, totp_enabled, totp_secret, totp_backup_codes FROM users WHERE id = ?',
        [result.user.id]
      ) as any
    } catch (dbErr: any) {
      console.warn('[Admin Login] Extended columns query failed, falling back to basic role check:', dbErr?.message)
      userDetails = await getQuery(
        'SELECT role_id, role FROM users WHERE id = ?',
        [result.user.id]
      ) as any
    }

    console.log('[Admin Login] User details:', userDetails)

    // Check if password reset is forced (Clean Slate policy)
    if (userDetails && userDetails.requires_password_reset === 1) {
      console.log('[Admin Login] Access denied - Password reset required for:', username)
      logger.logUnauthorizedAccess('/api/admin/login', ip, result.user.id)
      logger.security('User attempted login but requires password reset', { username, ip, userId: result.user.id })
      throw createError({
        statusCode: 403,
        statusMessage: 'Demi keamanan paska-insiden, akun Anda diwajibkan untuk melakukan reset password. Silakan hubungi Super Admin Sekretariat.'
      })
    }

    // Admin must have role_id (assigned to roles table)
    // Users with only 'user' role (role_id = NULL or 0) cannot access admin panel
    // Kontributor Berita is also blocked from Admin CMS (they must use the Kontributor portal)
    if (!userDetails || !userDetails.role_id || userDetails.role_id === 0 || userDetails.role === 'kontributor_berita') {
      console.log('[Admin Login] Access denied - User is not an admin or is a contributor:', username)
      logger.logUnauthorizedAccess('/api/admin/login', ip, result.user.id)
      logger.security('Non-admin or contributor user attempted admin login', { username, ip, userId: result.user.id })
      throw createError({
        statusCode: 403,
        statusMessage: 'Akses ditolak. Anda tidak memiliki akses ke panel admin. Jika Anda Kontributor Berita, silakan login di /kontributor/login.'
      })
    }

    // ── [2FA / MFA ENFORCEMENT] ───────────────────────────────────────────────
    if (userDetails.totp_enabled === 1 && userDetails.totp_secret) {
      if (!totp_code && !backup_code) {
        // Minta kode 2FA dari frontend (jangan berikan JWT token dulu)
        return {
          requires2FA: true,
          username: result.user.username,
          message: 'Akun Anda dilindungi 2FA. Silakan masukkan kode 6-digit dari aplikasi authenticator Anda.'
        }
      }

      let is2FAValid = false

      if (totp_code) {
        is2FAValid = verifyTotpToken(userDetails.totp_secret, String(totp_code).trim())
      } else if (backup_code) {
        let storedHashedCodes: string[] = []
        try {
          storedHashedCodes = userDetails.totp_backup_codes ? JSON.parse(userDetails.totp_backup_codes) : []
        } catch { /* ignore */ }

        const matchedIndex = checkBackupCode(String(backup_code).trim(), storedHashedCodes)
        if (matchedIndex !== -1) {
          is2FAValid = true
          // Hapus backup code yang sudah terpakai agar tidak bisa digunakan ulang
          storedHashedCodes.splice(matchedIndex, 1)
          await runQuery('UPDATE users SET totp_backup_codes = ? WHERE id = ?', [JSON.stringify(storedHashedCodes), result.user.id])
          logger.security('User logged in using a 2FA backup recovery code', {
            event: '2FA_BACKUP_CODE_USED',
            userId: result.user.id,
            username: result.user.username,
            remainingBackupCodes: storedHashedCodes.length
          })
        }
      }

      if (!is2FAValid) {
        recordFailedAttempt(ip, username)
        logger.security('Invalid 2FA code presented during admin login', {
          event: '2FA_VERIFICATION_FAILED',
          userId: result.user.id,
          username: result.user.username,
          ip
        })
        throw createError({
          statusCode: 401,
          statusMessage: 'Kode 2FA atau Backup Code salah. Pastikan jam perangkat Anda akurat.'
        })
      }

      logger.security('2FA verification successful during admin login', {
        event: '2FA_VERIFICATION_SUCCESS',
        userId: result.user.id,
        username: result.user.username
      })
    }
    // ─────────────────────────────────────────────────────────────────────────


    console.log('[Admin Login] Login successful for admin:', username)
    // ── [RATE LIMITER & COOKIE] Reset counter & Set HttpOnly Cookies ─────
    resetAttempts(ip)
    setAuthCookies(event, result.accessToken, result.refreshToken)
    // ─────────────────────────────────────────────────────────────────────

    return result

  } catch (error: any) {
    // Jika error sudah berupa H3Error (memiliki statusCode), langsung lempar ulang agar status & pesan aslinya terjaga
    if (error?.statusCode) {
      throw error
    }

    // ── Deteksi error koneksi database ────────────────────────────────────
    const isDbError =
      error?.message?.includes('Database connection pool is not available') ||
      error?.message?.includes('ECONNREFUSED') ||
      error?.message?.includes('ETIMEDOUT') ||
      error?.message?.includes('ENOTFOUND') ||
      error?.code === 'ECONNREFUSED' ||
      error?.code === 'ETIMEDOUT' ||
      error?.code === 'ER_ACCESS_DENIED_ERROR' ||
      error?.code === 'ENOTFOUND'

    if (isDbError) {
      logger.critical('[Admin Login] DATABASE CONNECTION FAILED — tidak bisa melakukan query login', {
        event: 'LOGIN_DB_CONNECTION_ERROR',
        errorMessage: error?.message,
        errorCode: error?.code,
        ip,
        hint: 'Periksa variabel MYSQL_HOST, MYSQL_USER, MYSQL_PASSWORD, MYSQL_DATABASE di Railway Variables'
      })
      throw createError({
        statusCode: 503,
        statusMessage: 'Server sedang tidak dapat terhubung ke database. Coba beberapa saat lagi atau hubungi Tim IT Paroki.'
      })
    }
    // ─────────────────────────────────────────────────────────────────────

    // Error sistem / tak terduga — log detail untuk debugging
    logger.critical('[Admin Login] UNEXPECTED SERVER ERROR (HTTP 500)', {
      event: 'LOGIN_500_ERROR',
      errorMessage: error?.message || String(error),
      errorName: error?.name,
      stack: error?.stack?.split('\n').slice(0, 5).join(' | '), // 5 baris pertama stack
      ip
    })
    console.error('[Admin Login] 500 Error Detail:', error)

    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan sistem pada server. Tim IT Paroki telah menerima notifikasi. Coba beberapa saat lagi.'
    })
  }
})
