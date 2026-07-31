/**
 * datetime.ts — Server-side datetime utility (Single Source of Truth)
 *
 * KONVENSI WAJIB:
 *   • Semua datetime di database disimpan sebagai UTC (format MySQL: "YYYY-MM-DD HH:MM:SS")
 *   • Semua tampilan waktu kepada user menggunakan WIB (Asia/Jakarta = UTC+7)
 *   • Jangan pernah membuat konversi datetime inline di file API lain!
 *   • Selalu import fungsi dari file ini.
 *
 * DILARANG di file lain:
 *   ✗  String(s).replace(' ', 'T') + 'Z'
 *   ✗  new Date().toISOString().split('T')[0]
 *   ✗  toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }) secara inline
 */

export const WIB_TZ = 'Asia/Jakarta'

// ─────────────────────────────────────────────────────────────────────────────
// RAW DB → UTC ISO STRING
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Konversi raw DB datetime string (tanpa timezone info) ke ISO UTC string.
 * MySQL mengembalikan "YYYY-MM-DD HH:MM:SS" — kita tambahkan 'Z' agar
 * JavaScript memparsanya sebagai UTC, bukan waktu lokal server.
 *
 * @example
 *   dbToUtcIso("2026-08-21 01:00:00") → "2026-08-21T01:00:00Z"
 *   dbToUtcIso(null)                  → null
 */
export const dbToUtcIso = (raw: any): string | null => {
  if (!raw) return null
  if (raw instanceof Date) return raw.toISOString()
  const str = String(raw).trim()
  if (str.endsWith('Z') || str.includes('+')) return str // sudah ada TZ info
  // Ganti spasi MySQL dengan 'T' dan tambahkan 'Z' (UTC marker)
  return str.replace(' ', 'T') + 'Z'
}

// ─────────────────────────────────────────────────────────────────────────────
// UTC ISO → TAMPILAN WIB
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Ambil tanggal WIB (YYYY-MM-DD) dari raw DB datetime.
 * Gunakan ini untuk `date_key` di kalender mingguan.
 *
 * @example
 *   dbToWibDate("2026-08-21 01:00:00") → "2026-08-21"  (08:00 WIB, hari sama)
 *   dbToWibDate("2026-08-20 17:00:00") → "2026-08-21"  (00:00 WIB, hari berikutnya!)
 */
export const dbToWibDate = (raw: any): string => {
  const iso = dbToUtcIso(raw)
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('en-CA', { timeZone: WIB_TZ })
}

/**
 * Format waktu WIB dari raw DB datetime sebagai "HH.MM" (format Indonesia).
 *
 * @example
 *   dbToWibTimeStr("2026-08-21 01:00:00") → "08.00"
 */
export const dbToWibTimeStr = (raw: any): string => {
  const iso = dbToUtcIso(raw)
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: WIB_TZ,
    hour12: false
  }).replace(':', '.')
}

/**
 * Format waktu WIB dari raw DB datetime sebagai "HH:MM" (format jam:menit).
 *
 * @example
 *   dbToWibTimeColon("2026-08-21 01:00:00") → "08:00"
 */
export const dbToWibTimeColon = (raw: any): string => {
  const iso = dbToUtcIso(raw)
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: WIB_TZ,
    hour12: false
  })
}

/**
 * Format tanggal WIB panjang (id-ID) dari raw DB datetime.
 *
 * @example
 *   dbToWibDateLong("2026-08-21 01:00:00") → "Jumat, 21 Agustus 2026"
 */
export const dbToWibDateLong = (raw: any): string => {
  const iso = dbToUtcIso(raw)
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: WIB_TZ
  })
}

/**
 * Format datetime WIB pendek dari raw DB datetime.
 *
 * @example
 *   dbToWibDateTimeShort("2026-08-21 01:00:00") → "21 Agu 2026, 08.00"
 */
export const dbToWibDateTimeShort = (raw: any): string => {
  const iso = dbToUtcIso(raw)
  if (!iso) return ''
  const d = new Date(iso)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleString('id-ID', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    timeZone: WIB_TZ
  })
}

// ─────────────────────────────────────────────────────────────────────────────
// TANGGAL & BATAS WAKTU UNTUK QUERY MYSQL
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Tanggal hari ini dalam WIB, format YYYY-MM-DD.
 * Gunakan ini sebagai default date di API yang butuh "hari ini".
 *
 * @example
 *   todayWib() → "2026-08-21"  (bukan UTC date yang bisa berbeda 1 hari)
 */
export const todayWib = (): string => {
  return new Date().toLocaleDateString('en-CA', { timeZone: WIB_TZ })
}

/**
 * Hitung batas awal dan akhir sebuah hari WIB dalam format UTC MySQL.
 * Gunakan ini untuk filter WHERE di query yang menyimpan datetime sebagai UTC.
 *
 * DB menyimpan UTC, jadi:
 *   WIB 2026-08-21 00:00:00 = UTC 2026-08-20 17:00:00
 *   WIB 2026-08-21 23:59:59 = UTC 2026-08-21 16:59:59
 *
 * @param wibDateStr  tanggal dalam WIB (YYYY-MM-DD)
 * @returns { dayStart, dayEnd } dalam format MySQL UTC "YYYY-MM-DD HH:MM:SS"
 *
 * @example
 *   wibDayBoundariesUtc("2026-08-21")
 *   → { dayStart: "2026-08-20 17:00:00", dayEnd: "2026-08-21 16:59:59" }
 */
export const wibDayBoundariesUtc = (wibDateStr: string): { dayStart: string; dayEnd: string } => {
  const wibStart = new Date(`${wibDateStr}T00:00:00+07:00`)
  const wibEnd   = new Date(`${wibDateStr}T23:59:59+07:00`)
  const toMysql  = (d: Date) => d.toISOString().slice(0, 19).replace('T', ' ')
  return {
    dayStart: toMysql(wibStart),
    dayEnd:   toMysql(wibEnd)
  }
}

/**
 * Konversi tanggal WIB + waktu WIB (HH:MM) ke MySQL UTC datetime string.
 * Gunakan ini saat menyimpan booking ke database.
 *
 * @param wibDateStr  "YYYY-MM-DD"
 * @param wibTimeStr  "HH:MM"
 * @returns MySQL UTC string "YYYY-MM-DD HH:MM:SS"
 *
 * @example
 *   localWibToUtcMysql("2026-08-21", "10:00") → "2026-08-21 03:00:00"
 */
export const localWibToUtcMysql = (wibDateStr: string, wibTimeStr: string): string => {
  const dt = new Date(`${wibDateStr}T${wibTimeStr}:00+07:00`)
  return dt.toISOString().slice(0, 19).replace('T', ' ')
}

/**
 * Konversi ISO UTC string (dari toISOString()) ke MySQL UTC datetime string.
 *
 * @example
 *   isoToMysql("2026-08-21T03:00:00.000Z") → "2026-08-21 03:00:00"
 */
export const isoToMysql = (isoStr: string): string => {
  return isoStr.slice(0, 19).replace('T', ' ')
}
