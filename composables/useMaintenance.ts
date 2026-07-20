/**
 * useMaintenance.ts
 * ─────────────────────────────────────────────────────────────
 * Sistem Maintenance Terpusat - Paroki St. Paulus Juanda
 *
 * CARA PAKAI:
 * 1. Tambahkan entry halaman di MAINTENANCE_CONFIG di bawah
 * 2. Setel `active: true` untuk mengaktifkan mode maintenance
 * 3. Setel kembali `active: false` (atau hapus entry) untuk menonaktifkan
 *
 * Di halaman Vue mana pun, cukup tambahkan:
 *
 *   const { isInMaintenance, maintenanceInfo } = useMaintenance()
 *
 * lalu di template:
 *
 *   <PageMaintenance v-if="isInMaintenance" v-bind="maintenanceInfo" />
 *   <div v-else> ... konten asli ... </div>
 * ─────────────────────────────────────────────────────────────
 */

export interface MaintenancePageConfig {
  /** Apakah halaman sedang dalam mode maintenance */
  active: boolean
  /** Judul halaman (ditampilkan di header & kartu) */
  pageTitle: string
  /** Deskripsi singkat di bawah judul header */
  pageSubtitle?: string
  /** Pesan utama yang ditampilkan di kartu maintenance */
  message?: string
  /** Pesan kedua / permintaan maaf */
  subMessage?: string
}

/**
 * ═══════════════════════════════════════════════════════════════
 *  KONFIGURASI MAINTENANCE — EDIT DI SINI
 * ═══════════════════════════════════════════════════════════════
 *
 *  Key  : path halaman (sesuai nama route Nuxt, tanpa leading slash)
 *         Contoh: 'sejarah', 'dpp-paroki', 'data-statistika-paroki'
 *
 *  Value: objek MaintenancePageConfig
 *         - active: true  → halaman tampil maintenance
 *         - active: false → halaman tampil normal
 * ═══════════════════════════════════════════════════════════════
 */
const MAINTENANCE_CONFIG: Record<string, MaintenancePageConfig> = {

  sejarah: {
    active: true,
    pageTitle: 'Sejarah Paroki',
    pageSubtitle: 'Sebuah perjalanan iman yang unik, dari pengadaan lahan hingga menjadi komunitas Paroki yang mandiri',
  },

  // ─── Contoh halaman lain (nonaktif) ─────────────────────────
  // 'data-statistika-paroki': {
  //   active: false,
  //   pageTitle: 'Data Statistika Paroki',
  //   pageSubtitle: 'Statistik dan data kependudukan umat Paroki St. Paulus Juanda',
  // },

  // 'dpp-paroki': {
  //   active: false,
  //   pageTitle: 'DPP Paroki',
  //   pageSubtitle: 'Dewan Pastoral Paroki St. Paulus Juanda',
  // },

  // 'bgkp-paroki': {
  //   active: false,
  //   pageTitle: 'BGKP Paroki',
  //   pageSubtitle: 'Badan Gereja Katolik Paroki',
  // },

  // 'jadwal-misa': {
  //   active: false,
  //   pageTitle: 'Jadwal Misa',
  //   pageSubtitle: 'Jadwal Perayaan Ekaristi Paroki St. Paulus Juanda',
  // },

  // 'dokumen-paroki': {
  //   active: false,
  //   pageTitle: 'Dokumen Paroki',
  //   pageSubtitle: 'Arsip dan dokumen resmi Paroki St. Paulus Juanda',
  // },

  // 'teritorial-paroki': {
  //   active: false,
  //   pageTitle: 'Teritorial Paroki',
  //   pageSubtitle: 'Peta wilayah dan teritorial Paroki St. Paulus Juanda',
  // },

} // ← Tambahkan halaman baru di atas baris ini

/**
 * Composable utama — gunakan di dalam <script setup> halaman Nuxt
 *
 * @example
 * const { isInMaintenance, maintenanceInfo } = useMaintenance()
 */
export function useMaintenance() {
  const route = useRoute()

  // Ambil key dari route path (hilangkan leading slash)
  const routeKey = computed(() => {
    return route.path.replace(/^\//, '').replace(/\/$/, '') || 'index'
  })

  // Cek apakah halaman ini terdaftar & aktif maintenance
  const isInMaintenance = computed(() => {
    const config = MAINTENANCE_CONFIG[routeKey.value]
    return config?.active === true
  })

  // Info yang dioper ke komponen PageMaintenance
  const maintenanceInfo = computed(() => {
    return MAINTENANCE_CONFIG[routeKey.value] ?? null
  })

  return {
    isInMaintenance,
    maintenanceInfo,
    routeKey,
  }
}
