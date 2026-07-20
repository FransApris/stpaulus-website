/**
 * server/utils/maintenance.ts
 * Shared utility untuk sistem maintenance — digunakan oleh API routes
 */
import { readFileSync, writeFileSync, existsSync, mkdirSync } from 'fs'
import { join, dirname } from 'path'

// Daftar semua halaman yang bisa dikelola maintenance-nya
export const MANAGED_PAGES = [
  // 1. Beranda & Informasi Utama
  { key: 'beranda',               label: 'Beranda / Home',          path: '/' },
  { key: 'about-us',              label: 'Tentang Kami',            path: '/about-us' },
  { key: 'sejarah',               label: 'Sejarah Paroki',          path: '/sejarah' },
  { key: 'kontak',                label: 'Kontak & Sekretariat',    path: '/kontak' },
  { key: 'contact-us',            label: 'Contact Us',              path: '/contact-us' },
  { key: 'help-center',           label: 'Pusat Bantuan / FAQ',     path: '/help-center' },

  // 2. Berita, Artikel & Blog
  { key: 'artikel',               label: 'Artikel Paroki',          path: '/artikel' },
  { key: 'berita',                label: 'Berita Paroki',           path: '/berita' },
  { key: 'blog',                  label: 'Blog Utama',              path: '/blog' },

  // 3. Kegiatan & Jadwal
  { key: 'jadwal-misa',           label: 'Jadwal Misa',             path: '/jadwal-misa' },
  { key: 'misa',                  label: 'Informasi Misa',          path: '/misa' },
  { key: 'agenda',                label: 'Agenda Paroki',           path: '/agenda' },
  { key: 'romo-bertugas',         label: 'Romo Bertugas',           path: '/romo-bertugas' },

  // 4. Pelayanan & Dokumen
  { key: 'booking',               label: 'Pemesanan Ruangan',       path: '/booking' },
  { key: 'pemesanan-ruang',       label: 'Pemesanan Alternatif',    path: '/pemesanan-ruang' },
  { key: 'cek-status',            label: 'Cek Status Pesanan',      path: '/cek-status' },
  { key: 'dokumen-paroki',        label: 'Dokumen Paroki',          path: '/dokumen-paroki' },

  // 5. Struktur & Data Paroki
  { key: 'dpp-paroki',            label: 'DPP Paroki',              path: '/dpp-paroki' },
  { key: 'bgkp-paroki',           label: 'BGKP Paroki',             path: '/bgkp-paroki' },
  { key: 'teritorial-paroki',     label: 'Teritorial Paroki',       path: '/teritorial-paroki' },
  { key: 'data-statistika-paroki',label: 'Data Statistika Paroki',  path: '/data-statistika-paroki' },
  { key: 'kronik-gereja',         label: 'Kronik Gereja',           path: '/kronik-gereja' },

  // 6. Multimedia & Lainnya
  { key: 'galeri',                label: 'Galeri Foto',             path: '/galeri' },
  { key: 'search',                label: 'Pencarian / Search',      path: '/search' },
]

const CONFIG_PATH = join(process.cwd(), 'server', 'data', 'maintenance.json')

export function readMaintenanceConfig(): Record<string, boolean> {
  if (!existsSync(CONFIG_PATH)) return {}
  try {
    return JSON.parse(readFileSync(CONFIG_PATH, 'utf-8'))
  } catch {
    return {}
  }
}

export function saveMaintenanceConfig(config: Record<string, boolean>) {
  const dir = dirname(CONFIG_PATH)
  if (!existsSync(dir)) mkdirSync(dir, { recursive: true })
  writeFileSync(CONFIG_PATH, JSON.stringify(config, null, 2), 'utf-8')
}
