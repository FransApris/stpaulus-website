/**
 * useDatetime.ts — Client-side datetime composable (Single Source of Truth)
 *
 * KONVENSI WAJIB:
 *   • API mengirim datetime dalam format ISO UTC ("YYYY-MM-DDTHH:MM:SSZ")
 *   • Semua tampilan waktu kepada user menggunakan WIB (Asia/Jakarta = UTC+7)
 *   • Jangan pernah membuat konversi datetime inline di file .vue lain!
 *   • Selalu import fungsi dari composable ini.
 *
 * DILARANG di file .vue lain:
 *   ✗  new Date(str) tanpa memastikan str mengandung 'Z' atau '+07:00'
 *   ✗  toLocaleTimeString('id-ID', { timeZone: 'Asia/Jakarta' }) inline
 *   ✗  str.replace(' ', 'T') + 'Z' inline
 *   ✗  new Date("YYYY-MM-DD")         ← diparse sebagai UTC, bukan local!
 *   ✗  new Date().getHours()          ← timezone browser, bukan WIB!
 *   ✗  toISOString().split('T')[0]    ← UTC date, bisa beda 1 hari dari WIB!
 */

export const WIB_TZ = 'Asia/Jakarta'

export function useDatetime() {
  // ───────────────────────────────────────────────────────────────────────────
  // PARSE STRING KE DATE OBJECT (UTC-AWARE)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Parse string datetime (dari DB atau API) ke Date object yang UTC-aware.
   * Menambahkan 'Z' jika belum ada timezone info agar browser tidak
   * menginterpretasikannya sebagai waktu lokal.
   *
   * @example
   *   toUtcDate("2026-08-21T01:00:00Z")  → Date (UTC: 01:00, WIB: 08:00)
   *   toUtcDate("2026-08-21 01:00:00")   → Date (UTC: 01:00, WIB: 08:00) ← raw DB
   *   toUtcDate(null)                    → Date(NaN)
   */
  const toUtcDate = (s: any): Date => {
    if (!s) return new Date(NaN)
    if (s instanceof Date) return s
    const str = String(s).trim()
    if (str.endsWith('Z') || str.includes('+')) return new Date(str)
    return new Date(str.replace(' ', 'T') + 'Z')
  }

  // ───────────────────────────────────────────────────────────────────────────
  // FORMAT TAMPILAN WIB
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Format tanggal panjang dalam WIB.
   * @example "Jumat, 21 Agustus 2026"
   */
  const formatWibDate = (s: any): string => {
    const d = toUtcDate(s)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleDateString('id-ID', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      timeZone: WIB_TZ
    })
  }

  /**
   * Format waktu WIB sebagai "HH:MM".
   * @example "08:00"
   */
  const formatWibTime = (s: any): string => {
    const d = toUtcDate(s)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleTimeString('id-ID', {
      hour: '2-digit',
      minute: '2-digit',
      timeZone: WIB_TZ
    }).replace('.', ':')
  }

  /**
   * Format rentang waktu WIB sebagai "HH:MM - HH:MM".
   * @example "08:00 - 10:00"
   */
  const formatWibTimeRange = (start: any, end: any): string => {
    return `${formatWibTime(start)} - ${formatWibTime(end)}`
  }

  /**
   * Format tanggal + rentang waktu WIB.
   * @example "Jumat, 21 Agustus 2026 (08:00 - 10:00)"
   */
  const formatWibBookingTime = (start: any, end: any): string => {
    const dateStr = formatWibDate(start)
    const timeStr = formatWibTimeRange(start, end)
    return `${dateStr} (${timeStr})`
  }

  /**
   * Format datetime pendek WIB.
   * @example "21 Agu 2026, 08:00"
   */
  const formatWibDateTime = (s: any): string => {
    const d = toUtcDate(s)
    if (isNaN(d.getTime())) return '-'
    return d.toLocaleString('id-ID', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      timeZone: WIB_TZ
    })
  }

  // ───────────────────────────────────────────────────────────────────────────
  // HELPER LOGIKA
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Ambil date key YYYY-MM-DD dalam WIB dari ISO datetime string.
   * Gunakan untuk mencocokkan `date_key` dari API weekly-schedule.
   *
   * @example
   *   wibDateKey("2026-08-21T01:00:00Z") → "2026-08-21"  (08:00 WIB)
   */
  const wibDateKey = (s: any): string => {
    const d = toUtcDate(s)
    if (isNaN(d.getTime())) return ''
    return d.toLocaleDateString('en-CA', { timeZone: WIB_TZ })
  }

  /**
   * Hari ini dalam WIB (YYYY-MM-DD). Gunakan sebagai default date di form.
   * @example "2026-08-21"
   */
  const todayWibStr = (): string => {
    return new Date().toLocaleDateString('en-CA', { timeZone: WIB_TZ })
  }

  /**
   * Cek apakah booking sudah berakhir berdasarkan end_time UTC.
   */
  const isBookingPassed = (endTime: any): boolean => {
    const d = toUtcDate(endTime)
    if (isNaN(d.getTime())) return false
    return d < new Date()
  }

  // ───────────────────────────────────────────────────────────────────────────
  // FORM INPUT HELPERS (pengganti antipattern timezone-unsafe)
  // ───────────────────────────────────────────────────────────────────────────

  /**
   * Parse string YYYY-MM-DD dari input <input type="date"> sebagai local midnight.
   * WAJIB digunakan sebagai pengganti: new Date("YYYY-MM-DD")
   *
   * Masalah: new Date("2026-08-03") → diparse sebagai UTC midnight
   *          = jam 07:00 WIB, sehingga perbandingan dengan today (00:00 lokal)
   *          selalu menghasilkan tanggal yang lebih besar dari seharusnya.
   *
   * @example
   *   wibDateFromForm("2026-08-03") → Date(2026-08-03T00:00:00)  // local midnight ✅
   *   new Date("2026-08-03")        → Date(2026-08-03T00:00:00Z) // UTC midnight ❌
   */
  const wibDateFromForm = (dateStr: string): Date => {
    return new Date(`${dateStr}T00:00:00`)
  }

  /**
   * Total menit sejak tengah malam WIB saat ini.
   * WAJIB digunakan sebagai pengganti: new Date().getHours() * 60 + getMinutes()
   *
   * Masalah: getHours() bergantung pada timezone browser pengguna.
   *          User yang browsing dari luar WIB akan mendapat validasi yang salah.
   *
   * @example
   *   nowWibTotalMinutes() → 870  // kalau WIB 14:30 (14*60+30)
   */
  const nowWibTotalMinutes = (): number => {
    const parts = new Intl.DateTimeFormat('en-US', {
      timeZone: WIB_TZ,
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    }).formatToParts(new Date())
    const h = parseInt(parts.find(p => p.type === 'hour')?.value   ?? '0', 10)
    const m = parseInt(parts.find(p => p.type === 'minute')?.value ?? '0', 10)
    return h * 60 + m
  }

  return {
    toUtcDate,
    formatWibDate,
    formatWibTime,
    formatWibTimeRange,
    formatWibBookingTime,
    formatWibDateTime,
    wibDateKey,
    todayWibStr,
    isBookingPassed,
    // Form helpers — gunakan ini, bukan inline
    wibDateFromForm,
    nowWibTotalMinutes
  }
}
