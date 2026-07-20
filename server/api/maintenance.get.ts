/**
 * GET /api/maintenance
 * Endpoint publik — dibaca oleh composable useMaintenance.ts di sisi klien
 * Tidak memerlukan autentikasi
 */
import { readMaintenanceConfig } from '../utils/maintenance'

export default defineEventHandler(async (_event) => {
  return readMaintenanceConfig()
})
