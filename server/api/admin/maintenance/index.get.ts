/**
 * GET /api/admin/maintenance
 * Membaca status maintenance semua halaman dari file konfigurasi
 */
import { requireAuth } from '../../../utils/auth'
import { readFileSync, existsSync } from 'fs'
import { join } from 'path'

// Daftar semua halaman yang bisa dikelola maintenance-nya
export const MANAGED_PAGES = [
  { key: 'sejarah',               label: 'Sejarah Paroki',          path: '/sejarah' },
  { key: 'dpp-paroki',            label: 'DPP Paroki',              path: '/dpp-paroki' },
  { key: 'bgkp-paroki',           label: 'BGKP Paroki',             path: '/bgkp-paroki' },
  { key: 'data-statistika-paroki',label: 'Data Statistika Paroki',  path: '/data-statistika-paroki' },
  { key: 'jadwal-misa',           label: 'Jadwal Misa',             path: '/jadwal-misa' },
  { key: 'dokumen-paroki',        label: 'Dokumen Paroki',          path: '/dokumen-paroki' },
  { key: 'teritorial-paroki',     label: 'Teritorial Paroki',       path: '/teritorial-paroki' },
  { key: 'romo-bertugas',         label: 'Romo Bertugas',           path: '/romo-bertugas' },
  { key: 'kronik-gereja',         label: 'Kronik Gereja',           path: '/kronik-gereja' },
  { key: 'agenda',                label: 'Agenda Paroki',           path: '/agenda' },
  { key: 'galeri',                label: 'Galeri Foto',             path: '/galeri' },
  { key: 'kontak',                label: 'Kontak & Sekretariat',    path: '/kontak' },
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

export default defineEventHandler(async (event) => {
  requireAuth(event)

  const config = readMaintenanceConfig()

  const pages = MANAGED_PAGES.map(page => ({
    ...page,
    active: config[page.key] === true,
  }))

  return { pages }
})
