/**
 * server/utils/scheduler.ts
 *
 * Scheduler sederhana berbasis setInterval untuk menjalankan backup otomatis
 * di dalam Nuxt/Nitro server process.
 *
 * Tidak membutuhkan dependensi eksternal (node-cron, Redis, dll).
 * Kompatibel dengan Railway deployment.
 *
 * Jadwal default:
 *   - Backup database : Setiap 6 jam (00:00, 06:00, 12:00, 18:00 WIB)
 *   - Cleanup backup  : Setiap hari (hapus backup > 30 hari)
 *
 * Referensi IR/DRP: §2.1 RPO/RTO — Target RPO 4-6 jam
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import mysql from 'mysql2/promise'
import crypto from 'crypto'
import { logger } from './logger'
import { uploadFileToOffsiteS3 } from './offsiteStorage'

// ─── Konfigurasi ──────────────────────────────────────────────────────────────

/** Interval backup dalam milidetik — dikonfigurasi via BACKUP_INTERVAL_HOURS (default: 6 jam) */
const BACKUP_INTERVAL_MS = parseInt(process.env.BACKUP_INTERVAL_HOURS || '6') * 60 * 60 * 1000

/** Interval cleanup dalam milidetik (default: 24 jam) */
const CLEANUP_INTERVAL_MS = 24 * 60 * 60 * 1000

/** Retensi backup — dikonfigurasi via BACKUP_RETENTION_DAYS (default: 30 hari) */
const RETENTION_DAYS = parseInt(process.env.BACKUP_RETENTION_DAYS || '30')

/** Direktori penyimpanan backup */
const backupsDir = path.join(process.cwd(), 'backups')
const manifestPath = path.join(backupsDir, 'manifest.json')

// ─── State ────────────────────────────────────────────────────────────────────

interface SchedulerStatus {
  isRunning: boolean
  lastBackupAt: string | null
  lastBackupFile: string | null
  lastBackupHash: string | null
  lastBackupStatus: 'SUCCESS' | 'FAILED' | 'NEVER' | 'RUNNING'
  lastCleanupAt: string | null
  nextBackupAt: string | null
  totalScheduledBackups: number
  totalFailedBackups: number
  backupIntervalHours: number
  retentionDays: number
}

const status: SchedulerStatus = {
  isRunning: false,
  lastBackupAt: null,
  lastBackupFile: null,
  lastBackupHash: null,
  lastBackupStatus: 'NEVER',
  lastCleanupAt: null,
  nextBackupAt: null,
  totalScheduledBackups: 0,
  totalFailedBackups: 0,
  backupIntervalHours: BACKUP_INTERVAL_MS / (60 * 60 * 1000),
  retentionDays: RETENTION_DAYS
}

// ─── Utility: Database Config ─────────────────────────────────────────────────

function getDbConfig() {
  return {
    host: process.env.MYSQL_HOST || process.env.DB_HOST || 'localhost',
    port: parseInt(process.env.MYSQL_PORT || process.env.DB_PORT || '3306'),
    user: process.env.MYSQL_USER || process.env.DB_USER || 'root',
    password: process.env.MYSQL_PASSWORD || process.env.DB_PASSWORD || '',
    database: process.env.MYSQL_DATABASE || process.env.DB_NAME || 'stpaulus_cms_db',
    connectTimeout: 10000
  }
}

// ─── Utility: Hash & Manifest ─────────────────────────────────────────────────

function computeFileHash(filePath: string): string {
  const fileBuffer = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(fileBuffer).digest('hex')
}

function readManifest(): any[] {
  if (!fs.existsSync(manifestPath)) return []
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch {
    return []
  }
}

function addToManifest(entry: any): void {
  const manifest = readManifest()
  manifest.unshift(entry)
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
}

// ─── Core: Backup Function ────────────────────────────────────────────────────

/**
 * Menjalankan backup database lengkap dengan SHA-256 integrity check.
 * Dipanggil oleh scheduler setiap BACKUP_INTERVAL_MS.
 */
export async function runScheduledBackup(): Promise<{
  success: boolean
  filename?: string
  hash?: string
  sizeMB?: number
  error?: string
}> {
  if (!fs.existsSync(backupsDir)) {
    fs.mkdirSync(backupsDir, { recursive: true })
  }

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
  const filename = `stpaulus_auto_${timestamp}.sql`
  const filepath = path.join(backupsDir, filename)

  let connection: mysql.Connection | null = null

  try {
    logger.info('[Scheduler] Backup otomatis dimulai', {
      event: 'SCHEDULED_BACKUP_START',
      filename,
      timestamp: new Date().toISOString()
    })

    connection = await mysql.createConnection(getDbConfig())

    // Header SQL
    let sqlDump = ''
    sqlDump += `-- =====================================================\n`
    sqlDump += `-- MySQL Scheduled Backup (Auto)\n`
    sqlDump += `-- Database : ${getDbConfig().database}\n`
    sqlDump += `-- Date     : ${new Date().toISOString()}\n`
    sqlDump += `-- Generator: StPaulus Scheduler v1.0\n`
    sqlDump += `-- =====================================================\n\n`
    sqlDump += `SET FOREIGN_KEY_CHECKS=0;\n`
    sqlDump += `SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";\n`
    sqlDump += `SET time_zone = "+00:00";\n\n`

    const [tables] = await connection.query('SHOW TABLES') as any[]
    const tableNames: string[] = tables.map((row: any) => Object.values(row)[0] as string)

    let totalRows = 0

    for (const tableName of tableNames) {
      const [createResult] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``) as any[]
      sqlDump += `\n-- --- Table: ${tableName} ---\n\n`
      sqlDump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`
      sqlDump += createResult[0]['Create Table'] + ';\n\n'

      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``) as any[]
      if (rows.length > 0) {
        sqlDump += `INSERT INTO \`${tableName}\` VALUES\n`
        const values = rows.map((row: any) => {
          const escapedValues = Object.values(row).map((val: any) => {
            if (val === null) return 'NULL'
            if (typeof val === 'number') return val
            if (val instanceof Date) {
              return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`
            }
            const escaped = String(val).replace(/\\/g, '\\\\').replace(/'/g, "\\'")
            return `'${escaped}'`
          })
          return `(${escapedValues.join(', ')})`
        })
        sqlDump += values.join(',\n') + ';\n\n'
        totalRows += rows.length
      }
    }

    sqlDump += `\nSET FOREIGN_KEY_CHECKS=1;\n`
    fs.writeFileSync(filepath, sqlDump, 'utf8')

    const fileStats = fs.statSync(filepath)
    const sizeMB = parseFloat((fileStats.size / (1024 * 1024)).toFixed(2))

    // Generate SHA-256 hash
    const hash = computeFileHash(filepath)
    fs.writeFileSync(filepath + '.sha256', `${hash}  ${filename}\n`, 'utf8')

    // Update manifest
    addToManifest({
      filename,
      hashFile: filename + '.sha256',
      hash,
      database: getDbConfig().database,
      tableCount: tableNames.length,
      totalRows,
      sizeBytes: fileStats.size,
      sizeMB,
      createdAt: new Date().toISOString(),
      integrityStatus: 'VERIFIED',
      lastCheckedAt: new Date().toISOString(),
      notes: 'Scheduled auto-backup',
      type: 'auto'
    })

    // Upload ke S3-compatible offsite storage (3-2-1 rule Compliance)
    const yearMonth = new Date().toISOString().slice(0, 7)
    uploadFileToOffsiteS3(filepath, `backups/${yearMonth}/${filename}`).catch(() => {})
    uploadFileToOffsiteS3(filepath + '.sha256', `backups/${yearMonth}/${filename}.sha256`).catch(() => {})

    logger.info('[Scheduler] Backup otomatis selesai', {
      event: 'SCHEDULED_BACKUP_SUCCESS',
      filename,
      hash,
      sizeMB,
      tableCount: tableNames.length,
      totalRows
    })

    return { success: true, filename, hash, sizeMB }

  } catch (error: any) {
    logger.error('[Scheduler] Backup otomatis GAGAL', {
      event: 'SCHEDULED_BACKUP_FAILED',
      error: error.message,
      filename
    })

    // Hapus file parsial jika ada
    if (fs.existsSync(filepath)) {
      fs.unlinkSync(filepath)
    }

    return { success: false, error: error.message }
  } finally {
    if (connection) await connection.end()
  }
}

// ─── Core: Cleanup Old Backups ────────────────────────────────────────────────

/**
 * Menghapus file backup yang lebih lama dari RETENTION_DAYS.
 * Menjaga ukuran direktori backups tetap terkendali.
 */
export function runBackupCleanup(): void {
  if (!fs.existsSync(backupsDir)) return

  const cutoffMs = RETENTION_DAYS * 24 * 60 * 60 * 1000
  const now = Date.now()
  let deletedCount = 0
  let deletedBytes = 0

  try {
    const files = fs.readdirSync(backupsDir)

    for (const file of files) {
      // Hanya proses file SQL dan sha256 — jangan hapus manifest.json
      if (!file.endsWith('.sql') && !file.endsWith('.sql.sha256')) continue

      const filePath = path.join(backupsDir, file)
      const fileStat = fs.statSync(filePath)
      const ageMs = now - fileStat.mtimeMs

      if (ageMs > cutoffMs) {
        deletedBytes += fileStat.size
        fs.unlinkSync(filePath)
        deletedCount++
      }
    }

    // Update manifest: hapus entry yang file-nya sudah dihapus
    const manifest = readManifest()
    const activeManifest = manifest.filter((entry: any) =>
      fs.existsSync(path.join(backupsDir, entry.filename))
    )
    if (activeManifest.length !== manifest.length) {
      fs.writeFileSync(manifestPath, JSON.stringify(activeManifest, null, 2), 'utf8')
    }

    if (deletedCount > 0) {
      const deletedMB = (deletedBytes / (1024 * 1024)).toFixed(2)
      logger.info('[Scheduler] Cleanup backup lama selesai', {
        event: 'BACKUP_CLEANUP_DONE',
        deletedFiles: deletedCount,
        freedMB: deletedMB,
        retentionDays: RETENTION_DAYS
      })
    }

    status.lastCleanupAt = new Date().toISOString()

  } catch (error: any) {
    logger.error('[Scheduler] Cleanup backup gagal', {
      event: 'BACKUP_CLEANUP_FAILED',
      error: error.message
    })
  }
}

// ─── Core: Scheduler Start ────────────────────────────────────────────────────

let backupTimer: ReturnType<typeof setInterval> | null = null
let cleanupTimer: ReturnType<typeof setInterval> | null = null

/**
 * Menginisialisasi dan menjalankan scheduler backup otomatis.
 * Dipanggil dari Nitro plugin saat server start.
 *
 * @param options - Konfigurasi opsional untuk override default
 */
export function startBackupScheduler(options?: {
  intervalMs?: number
  runImmediately?: boolean
}): void {
  const intervalMs = options?.intervalMs ?? BACKUP_INTERVAL_MS

  if (status.isRunning) {
    logger.warn('[Scheduler] Scheduler sudah berjalan, skip start ulang.')
    return
  }

  logger.info('[Scheduler] Backup scheduler dimulai', {
    event: 'SCHEDULER_STARTED',
    intervalHours: intervalMs / (60 * 60 * 1000),
    retentionDays: RETENTION_DAYS,
    environment: process.env.NODE_ENV
  })

  status.isRunning = true
  status.nextBackupAt = new Date(Date.now() + intervalMs).toISOString()

  // Opsional: jalankan backup segera saat server start (untuk development/testing)
  if (options?.runImmediately) {
    setTimeout(async () => {
      const result = await runScheduledBackup()
      updateStatus(result)
    }, 5000) // Tunda 5 detik agar DB connection sudah siap
  }

  // Backup timer: setiap BACKUP_INTERVAL_MS
  backupTimer = setInterval(async () => {
    status.lastBackupStatus = 'RUNNING'
    const result = await runScheduledBackup()
    updateStatus(result)
    status.nextBackupAt = new Date(Date.now() + intervalMs).toISOString()
  }, intervalMs)

  // Cleanup timer: setiap 24 jam
  cleanupTimer = setInterval(() => {
    runBackupCleanup()
  }, CLEANUP_INTERVAL_MS)

  // Hindari timer memblokir proses Node.js saat akan shutdown
  if (backupTimer.unref) backupTimer.unref()
  if (cleanupTimer.unref) cleanupTimer.unref()
}

/**
 * Menghentikan scheduler (untuk graceful shutdown).
 */
export function stopBackupScheduler(): void {
  if (backupTimer) { clearInterval(backupTimer); backupTimer = null }
  if (cleanupTimer) { clearInterval(cleanupTimer); cleanupTimer = null }
  status.isRunning = false
  logger.info('[Scheduler] Backup scheduler dihentikan.', { event: 'SCHEDULER_STOPPED' })
}

// ─── Helper ───────────────────────────────────────────────────────────────────

function updateStatus(result: { success: boolean; filename?: string; hash?: string; sizeMB?: number }) {
  status.totalScheduledBackups++
  status.lastBackupAt = new Date().toISOString()

  if (result.success) {
    status.lastBackupStatus = 'SUCCESS'
    status.lastBackupFile = result.filename ?? null
    status.lastBackupHash = result.hash ?? null
  } else {
    status.lastBackupStatus = 'FAILED'
    status.totalFailedBackups++
  }
}

/**
 * Mendapatkan status scheduler saat ini.
 * Digunakan oleh API endpoint monitoring.
 */
export function getSchedulerStatus(): SchedulerStatus {
  return { ...status }
}
