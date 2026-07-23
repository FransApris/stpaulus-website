/**
 * server/api/admin/security/scheduler.get.ts
 *
 * API endpoint untuk melihat status backup scheduler.
 * Hanya bisa diakses oleh super_admin.
 *
 * GET /api/admin/security/scheduler
 */
import { requireAuth } from '../../../utils/auth'
import { getSchedulerStatus, runScheduledBackup, runBackupCleanup } from '../../../utils/scheduler'
import { logger } from '../../../utils/logger'
import fs from 'fs'
import path from 'path'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  if (decoded.role !== 'super_admin') {
    throw createError({
      statusCode: 403,
      statusMessage: 'Akses ditolak. Hanya Super Admin yang dapat melihat status scheduler.'
    })
  }

  const query = getQuery(event)

  // Trigger manual backup on-demand
  if (query.action === 'backup-now') {
    logger.security('Manual backup triggered by admin', {
      event: 'ADMIN_MANUAL_BACKUP',
      adminId: decoded.userId,
      adminUsername: decoded.username
    })

    const result = await runScheduledBackup()
    return {
      action: 'backup-now',
      success: result.success,
      filename: result.filename,
      hash: result.hash,
      sizeMB: result.sizeMB,
      error: result.error
    }
  }

  // Trigger manual cleanup on-demand
  if (query.action === 'cleanup-now') {
    logger.security('Manual cleanup triggered by admin', {
      event: 'ADMIN_MANUAL_CLEANUP',
      adminId: decoded.userId
    })
    runBackupCleanup()
    return { action: 'cleanup-now', success: true }
  }

  // Baca manifest untuk info backup terakhir
  const backupsDir = path.join(process.cwd(), 'backups')
  const manifestPath = path.join(backupsDir, 'manifest.json')
  let recentBackups: any[] = []

  try {
    if (fs.existsSync(manifestPath)) {
      const manifest = JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
      // Tampilkan 5 backup terbaru saja
      recentBackups = manifest.slice(0, 5).map((entry: any) => ({
        ...entry,
        fileExists: fs.existsSync(path.join(backupsDir, entry.filename)),
        hashFileExists: entry.hashFile
          ? fs.existsSync(path.join(backupsDir, entry.hashFile))
          : false
      }))
    }
  } catch { /* ignore */ }

  return {
    scheduler: getSchedulerStatus(),
    recentBackups,
    config: {
      backupDirectory: backupsDir,
      manifestFile: manifestPath,
      manifestExists: fs.existsSync(manifestPath),
      totalBackupsOnDisk: recentBackups.length
    }
  }
})
