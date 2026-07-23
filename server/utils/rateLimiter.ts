/**
 * server/utils/rateLimiter.ts
 *
 * In-memory Rate Limiter untuk proteksi endpoint sensitif (login, dll).
 * Tidak butuh Redis — state disimpan di Map() di memori Nuxt server process.
 *
 * Cara kerja:
 *   - Setiap IP yang gagal login dicatat beserta timestamp-nya.
 *   - Jika jumlah kegagalan mencapai MAX_ATTEMPTS dalam window WINDOW_MS,
 *     IP tersebut diblokir selama BLOCK_DURATION_MS.
 *   - Setelah durasi blokir habis, counter di-reset otomatis.
 *   - Login BERHASIL me-reset counter IP tersebut.
 *
 * Referensi IR/DRP: §1.1 Fase B — Mencegah Brute Force Credential
 */

import { logger } from './logger'

// ─── Konfigurasi ──────────────────────────────────────────────────────────────

/** Jumlah maksimal kegagalan login sebelum IP diblokir */
const MAX_ATTEMPTS = 5

/** Window waktu pencatatan kegagalan (15 menit) */
const WINDOW_MS = 15 * 60 * 1000

/** Durasi pemblokiran setelah melewati MAX_ATTEMPTS (30 menit) */
const BLOCK_DURATION_MS = 30 * 60 * 1000

/** Interval pembersihan entry kadaluarsa dari Map (setiap 10 menit) */
const CLEANUP_INTERVAL_MS = 10 * 60 * 1000

// ─── Tipe Data ────────────────────────────────────────────────────────────────

interface AttemptRecord {
  /** Jumlah percobaan gagal dalam window saat ini */
  count: number
  /** Timestamp percobaan gagal pertama dalam window ini */
  firstAttemptAt: number
  /** Timestamp kapan IP ini diblokir (null = belum diblokir) */
  blockedAt: number | null
  /** Total kegagalan sepanjang masa (untuk laporan keamanan) */
  totalFailures: number
}

// ─── Store ────────────────────────────────────────────────────────────────────

/**
 * Map utama yang menyimpan catatan percobaan per IP.
 * Key: IP address string. Value: AttemptRecord.
 */
const attemptStore = new Map<string, AttemptRecord>()

// ─── Auto-Cleanup ─────────────────────────────────────────────────────────────

/**
 * Membersihkan entry kadaluarsa dari store secara periodik.
 * Entry dihapus jika: blokir sudah habis DAN window sudah lewat.
 */
function startCleanupTimer() {
  setInterval(() => {
    const now = Date.now()
    let cleaned = 0

    for (const [ip, record] of attemptStore.entries()) {
      const isBlockExpired = record.blockedAt
        ? (now - record.blockedAt) > BLOCK_DURATION_MS
        : true
      const isWindowExpired = (now - record.firstAttemptAt) > WINDOW_MS

      if (isBlockExpired && isWindowExpired) {
        attemptStore.delete(ip)
        cleaned++
      }
    }

    if (cleaned > 0) {
      logger.info(`[RateLimiter] Cleanup: removed ${cleaned} expired entries`, {
        event: 'RATE_LIMITER_CLEANUP',
        remainingEntries: attemptStore.size
      })
    }
  }, CLEANUP_INTERVAL_MS)
}

// Jalankan cleanup timer saat modul diload
startCleanupTimer()

// ─── Fungsi Publik ────────────────────────────────────────────────────────────

/**
 * Cek apakah IP sedang diblokir dan masih dalam periode blokir.
 *
 * @param ip - IP address yang dicek
 * @returns Object { blocked: boolean, remainingMs: number, retryAfter: string }
 */
export function isBlocked(ip: string): {
  blocked: boolean
  remainingMs: number
  retryAfter: string
} {
  const record = attemptStore.get(ip)

  if (!record || !record.blockedAt) {
    return { blocked: false, remainingMs: 0, retryAfter: '' }
  }

  const elapsed = Date.now() - record.blockedAt
  const remainingMs = BLOCK_DURATION_MS - elapsed

  if (remainingMs <= 0) {
    // Blokir sudah habis — reset record ini
    attemptStore.delete(ip)
    return { blocked: false, remainingMs: 0, retryAfter: '' }
  }

  const remainingMinutes = Math.ceil(remainingMs / 60000)
  return {
    blocked: true,
    remainingMs,
    retryAfter: `${remainingMinutes} menit`
  }
}

/**
 * Mencatat satu kegagalan login untuk IP tertentu.
 * Jika mencapai MAX_ATTEMPTS, IP otomatis diblokir dan dicatat ke security log.
 *
 * @param ip - IP address yang gagal login
 * @param username - Username yang dicoba (untuk log)
 * @returns Object { blocked: boolean, attemptsLeft: number, retryAfter: string }
 */
export function recordFailedAttempt(ip: string, username: string): {
  blocked: boolean
  attemptsLeft: number
  retryAfter: string
} {
  const now = Date.now()
  const existing = attemptStore.get(ip)

  let record: AttemptRecord

  if (!existing) {
    // Percobaan pertama dari IP ini
    record = {
      count: 1,
      firstAttemptAt: now,
      blockedAt: null,
      totalFailures: 1
    }
  } else {
    // Cek apakah window sudah kadaluarsa
    const windowExpired = (now - existing.firstAttemptAt) > WINDOW_MS

    if (windowExpired) {
      // Reset window — mulai hitungan baru
      record = {
        count: 1,
        firstAttemptAt: now,
        blockedAt: null,
        totalFailures: existing.totalFailures + 1
      }
    } else {
      // Masih dalam window yang sama — tambahkan counter
      record = {
        ...existing,
        count: existing.count + 1,
        totalFailures: existing.totalFailures + 1
      }
    }
  }

  // Simpan record yang sudah diupdate
  attemptStore.set(ip, record)

  // Cek apakah perlu diblokir
  if (record.count >= MAX_ATTEMPTS && !record.blockedAt) {
    record.blockedAt = now
    attemptStore.set(ip, record)

    const blockDurationMinutes = BLOCK_DURATION_MS / 60000

    // Log CRITICAL — ini adalah brute force terdeteksi
    logger.critical(`[RateLimiter] IP DIBLOKIR setelah ${MAX_ATTEMPTS} kegagalan login`, {
      event: 'BRUTE_FORCE_BLOCKED',
      ip,
      username,
      attempts: record.count,
      totalFailures: record.totalFailures,
      blockedUntil: new Date(now + BLOCK_DURATION_MS).toISOString(),
      blockDurationMinutes,
      action: 'IP_BLOCKED'
    })

    return {
      blocked: true,
      attemptsLeft: 0,
      retryAfter: `${blockDurationMinutes} menit`
    }
  }

  const attemptsLeft = Math.max(0, MAX_ATTEMPTS - record.count)

  // Log WARNING saat mendekati batas
  if (attemptsLeft <= 2 && attemptsLeft > 0) {
    logger.warn(`[RateLimiter] IP mendekati batas login`, {
      event: 'LOGIN_ATTEMPTS_WARNING',
      ip,
      username,
      attempts: record.count,
      attemptsLeft,
      maxAttempts: MAX_ATTEMPTS
    })
  }

  return {
    blocked: false,
    attemptsLeft,
    retryAfter: ''
  }
}

/**
 * Me-reset counter kegagalan untuk IP tertentu.
 * Dipanggil saat login BERHASIL — membersihkan riwayat gagal sebelumnya.
 *
 * @param ip - IP address yang berhasil login
 */
export function resetAttempts(ip: string): void {
  if (attemptStore.has(ip)) {
    attemptStore.delete(ip)
    logger.info(`[RateLimiter] Counter reset setelah login berhasil`, {
      event: 'RATE_LIMITER_RESET',
      ip
    })
  }
}

/**
 * Mendapatkan status saat ini semua IP yang sedang dipantau.
 * Berguna untuk dashboard monitoring keamanan admin.
 *
 * @returns Array of { ip, count, blocked, blockedUntil, totalFailures }
 */
export function getRateLimiterStatus(): Array<{
  ip: string
  count: number
  attemptsLeft: number
  blocked: boolean
  blockedUntil: string | null
  firstAttemptAt: string
  totalFailures: number
}> {
  const now = Date.now()
  const result = []

  for (const [ip, record] of attemptStore.entries()) {
    const isCurrentlyBlocked = record.blockedAt
      ? (now - record.blockedAt) < BLOCK_DURATION_MS
      : false

    result.push({
      ip,
      count: record.count,
      attemptsLeft: Math.max(0, MAX_ATTEMPTS - record.count),
      blocked: isCurrentlyBlocked,
      blockedUntil: record.blockedAt && isCurrentlyBlocked
        ? new Date(record.blockedAt + BLOCK_DURATION_MS).toISOString()
        : null,
      firstAttemptAt: new Date(record.firstAttemptAt).toISOString(),
      totalFailures: record.totalFailures
    })
  }

  return result.sort((a, b) => b.count - a.count)
}

/**
 * Memblokir IP secara manual (oleh admin).
 * Berguna untuk blokir cepat saat insiden dideteksi manual.
 *
 * @param ip - IP yang ingin diblokir secara manual
 * @param reason - Alasan pemblokiran (untuk log)
 */
export function manualBlock(ip: string, reason: string): void {
  const now = Date.now()
  const existing = attemptStore.get(ip)

  attemptStore.set(ip, {
    count: MAX_ATTEMPTS,
    firstAttemptAt: existing?.firstAttemptAt ?? now,
    blockedAt: now,
    totalFailures: existing?.totalFailures ?? 0
  })

  logger.critical(`[RateLimiter] IP diblokir secara manual oleh admin`, {
    event: 'MANUAL_IP_BLOCK',
    ip,
    reason,
    blockedUntil: new Date(now + BLOCK_DURATION_MS).toISOString()
  })
}

/**
 * Membuka blokir IP secara manual (oleh admin / whitelist).
 *
 * @param ip - IP yang ingin di-unblock
 */
export function manualUnblock(ip: string): void {
  if (attemptStore.has(ip)) {
    attemptStore.delete(ip)
    logger.security(`[RateLimiter] IP di-unblock secara manual`, {
      event: 'MANUAL_IP_UNBLOCK',
      ip
    })
  }
}

// ─── Ekspor Konfigurasi (untuk referensi di luar modul) ───────────────────────
export const RATE_LIMIT_CONFIG = {
  MAX_ATTEMPTS,
  WINDOW_MS,
  BLOCK_DURATION_MS,
  WINDOW_MINUTES: WINDOW_MS / 60000,
  BLOCK_DURATION_MINUTES: BLOCK_DURATION_MS / 60000
} as const
