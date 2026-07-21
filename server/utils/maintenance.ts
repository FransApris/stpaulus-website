/**
 * server/utils/maintenance.ts
 * Shared utility untuk sistem maintenance — digunakan oleh API routes
 */
// fs and path imports removed (using DB now)

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
  { key: 'layar-tv',              label: 'Layar TV / Signage',      path: '/layar-tv' },
  { key: 'search',                label: 'Pencarian / Search',      path: '/search' },
]

import { getQuery, runQuery } from '../database/db'

export async function readMaintenanceConfig(): Promise<Record<string, boolean>> {
  try {
    const result = await getQuery(
      'SELECT setting_value FROM app_settings WHERE setting_key = ?',
      ['maintenance_config']
    )
    if (result && result.setting_value) {
      // Depending on mysql2 version, JSON columns might be returned as parsed objects or strings
      return typeof result.setting_value === 'string' 
        ? JSON.parse(result.setting_value) 
        : result.setting_value
    }
  } catch (error) {
    console.error('Error reading maintenance config from DB:', error)
  }
  return {}
}

export async function saveMaintenanceConfig(config: Record<string, boolean>) {
  try {
    await runQuery(
      `INSERT INTO app_settings (setting_key, setting_value) 
       VALUES ('maintenance_config', ?) 
       ON DUPLICATE KEY UPDATE setting_value = ?`,
      [JSON.stringify(config), JSON.stringify(config)]
    )
  } catch (error) {
    console.error('Error saving maintenance config to DB:', error)
    throw new Error('Gagal menyimpan konfigurasi maintenance ke database')
  }
}
