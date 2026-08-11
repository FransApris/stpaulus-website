/**
 * useMaintenance.ts
 * ─────────────────────────────────────────────────────────────
 * Sistem Maintenance Terpusat - Paroki St. Paulus Juanda
 *
 * Status maintenance dibaca dari API server (/api/maintenance)
 * dan dapat dikendalikan melalui halaman Admin → Maintenance.
 *
 * Di halaman Vue mana pun, cukup tambahkan:
 *
 *   const { isInMaintenance, maintenanceInfo } = useMaintenance()
 *
 * lalu di template:
 *
 *   <PageMaintenance v-if="isInMaintenance && maintenanceInfo" v-bind="maintenanceInfo" />
 *   <div v-else> ... konten asli ... </div>
 * ─────────────────────────────────────────────────────────────
 */
import type { Ref } from 'vue'

export interface MaintenancePageConfig {
  active: boolean
  pageTitle: string
  pageSubtitle?: string
  message?: string
  subMessage?: string
}

/**
 * Metadata statis per halaman (judul, subtitle)
 * Status aktif/nonaktif diambil dari API server secara dinamis
 */
const PAGE_META: Record<string, Omit<MaintenancePageConfig, 'active'>> = {
  'sejarah': {
    pageTitle: 'Sejarah Paroki',
    pageSubtitle: 'Sebuah perjalanan iman yang unik, dari pengadaan lahan hingga menjadi komunitas Paroki yang mandiri',
  },
  'dpp-paroki': {
    pageTitle: 'DPP Paroki',
    pageSubtitle: 'Dewan Pastoral Paroki St. Paulus Juanda',
  },
  'bgkp-paroki': {
    pageTitle: 'BGKP Paroki',
    pageSubtitle: 'Badan Gereja Katolik Paroki',
  },
  'data-statistika-paroki': {
    pageTitle: 'Data Statistika Paroki',
    pageSubtitle: 'Statistik dan data kependudukan umat Paroki St. Paulus Juanda',
  },
  'jadwal-misa': {
    pageTitle: 'Jadwal Misa',
    pageSubtitle: 'Jadwal Perayaan Ekaristi Paroki St. Paulus Juanda',
  },
  'dokumen-paroki': {
    pageTitle: 'Dokumen Paroki',
    pageSubtitle: 'Arsip dan dokumen resmi Paroki St. Paulus Juanda',
  },
  'teritorial-paroki': {
    pageTitle: 'Teritorial Paroki',
    pageSubtitle: 'Peta wilayah dan teritorial Paroki St. Paulus Juanda',
  },
  'romo-bertugas': {
    pageTitle: 'Romo Bertugas',
    pageSubtitle: 'Jadwal tugas Pastor Paroki St. Paulus Juanda',
  },
  'kronik-gereja': {
    pageTitle: 'Kronik Gereja',
    pageSubtitle: 'Catatan perjalanan dan peristiwa Gereja',
  },
  'agenda': {
    pageTitle: 'Agenda Paroki',
    pageSubtitle: 'Kegiatan dan agenda Paroki St. Paulus Juanda',
  },
  'galeri': {
    pageTitle: 'Galeri Foto',
    pageSubtitle: 'Dokumentasi kegiatan Paroki St. Paulus Juanda',
  },
  'kontak': {
    pageTitle: 'Kontak & Sekretariat',
    pageSubtitle: 'Hubungi paroki untuk informasi lebih lanjut',
  },
}

/**
 * Composable utama — gunakan di dalam <script setup> halaman Nuxt
 *
 * @example
 * const { isInMaintenance, maintenanceInfo } = useMaintenance()
 */
export function useMaintenance(customRouteKey?: string) {
  const route = useRoute()

  // Ambil key dari parameter jika ada, atau dari route path (hilangkan leading/trailing slash)
  const routeKey = computed(() => {
    if (customRouteKey) return customRouteKey
    return route.path.replace(/^\//, '').replace(/\/$/, '') || 'index'
  })

  // Fetch status dari API server (di-cache per halaman)
  // server:false → hanya fetch di client, menghindari SSR/client mismatch.
  // Cast eksplisit ke Ref<Record<string, boolean>> untuk menghindari:
  //   TS2589: Type instantiation is excessively deep and possibly infinite.
  //   TS7053: Element implicitly has 'any' type (string index on complex union).
  const { data: _maintenanceRaw } = useAsyncData(
    'maintenance-status',
    // Cast URL ke `any` untuk mencegah Nuxt's typed $fetch overload resolver
    // mencocokkan '/api/maintenance' dengan generated route types (TS2589).
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    () => $fetch('/api/maintenance' as any) as Promise<Record<string, boolean>>,
    {
      server: false,
      lazy: true,
      default: () => ({}) as Record<string, boolean>
    }
  )
  // Cast ke Ref eksplisit agar TypeScript tahu tipe index-nya
  const maintenanceStatus = _maintenanceRaw as Ref<Record<string, boolean>>

  // Cek apakah halaman ini sedang maintenance
  const isInMaintenance = computed(() => {
    // Cast value ke Record sebelum indexing agar tidak TS7053
    const status = maintenanceStatus.value as Record<string, boolean>
    return status?.[routeKey.value] === true
  })

  // Gabungkan metadata statis + status dinamis dari server
  const maintenanceInfo = computed((): MaintenancePageConfig | null => {
    const meta = PAGE_META[routeKey.value]
    if (!meta) return null
    return {
      ...meta,
      active: isInMaintenance.value,
    }
  })

  return {
    isInMaintenance,
    isMaintenance: isInMaintenance,
    maintenanceInfo,
    routeKey,
  }
}
