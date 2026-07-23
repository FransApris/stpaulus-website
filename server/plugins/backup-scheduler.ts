/**
 * server/plugins/backup-scheduler.ts
 *
 * Nitro Plugin: Menginisialisasi backup otomatis terjadwal saat server start.
 *
 * Plugin ini berjalan HANYA di environment production dan staging.
 * Di development (local), backup otomatis dimatikan untuk menghindari gangguan.
 *
 * Untuk aktifkan di local development (opsional), set environment variable:
 *   ENABLE_BACKUP_SCHEDULER=true
 *
 * Jadwal:
 *   - Production : setiap 6 jam (RPO target: 6 jam)
 *   - Staging    : setiap 12 jam
 */

import { startBackupScheduler, stopBackupScheduler } from '../utils/scheduler'
import { logger } from '../utils/logger'

export default defineNitroPlugin((nitroApp) => {
  const env = process.env.NODE_ENV || 'development'
  const forceEnable = process.env.ENABLE_BACKUP_SCHEDULER === 'true'

  // Hanya aktif di production, staging, atau jika di-force enable
  const shouldRun = env === 'production' || env === 'staging' || forceEnable

  if (!shouldRun) {
    logger.info('[BackupScheduler] Scheduler dinonaktifkan di development.', {
      event: 'SCHEDULER_SKIPPED',
      environment: env,
      tip: 'Set ENABLE_BACKUP_SCHEDULER=true untuk aktifkan di local'
    })
    return
  }

  // Baca interval dari env variable (default: 6 jam di production, 12 jam di staging)
  const defaultHours = env === 'production' ? 6 : 12
  const intervalHours = parseInt(process.env.BACKUP_INTERVAL_HOURS || String(defaultHours))
  const intervalMs = intervalHours * 60 * 60 * 1000

  logger.info(`[BackupScheduler] Menginisialisasi scheduler (${intervalHours} jam)...`, {
    event: 'SCHEDULER_INIT',
    environment: env,
    intervalHours
  })

  try {
    startBackupScheduler({
      intervalMs,
      // Di production: jangan backup saat server pertama start
      // (biasanya sudah ada backup dari deploy sebelumnya)
      runImmediately: false
    })

    logger.info(`[BackupScheduler] Scheduler aktif. Backup pertama dalam ${intervalHours} jam.`, {
      event: 'SCHEDULER_ACTIVE',
      nextBackupIn: `${intervalHours} jam`,
      retentionPolicy: '30 hari'
    })
  } catch (error: any) {
    logger.error('[BackupScheduler] Gagal menginisialisasi scheduler!', {
      event: 'SCHEDULER_INIT_FAILED',
      error: error.message
    })
  }

  // Graceful shutdown: hentikan scheduler saat server mau mati
  // Mencegah backup berjalan di tengah-tengah saat server di-restart
  nitroApp.hooks.hook('close', () => {
    logger.info('[BackupScheduler] Server shutdown — menghentikan scheduler...', {
      event: 'SCHEDULER_SHUTDOWN'
    })
    stopBackupScheduler()
  })
})
