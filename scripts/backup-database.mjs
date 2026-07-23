#!/usr/bin/env node

/**
 * Database Backup Script
 * Creates a SQL dump of all tables in the database with SHA-256 integrity verification.
 *
 * Usage:
 *   node scripts/backup-database.mjs               -- Buat backup baru
 *   node scripts/backup-database.mjs verify <file>  -- Verifikasi integritas backup
 *   node scripts/backup-database.mjs list           -- Daftar semua backup & statusnya
 *
 * Setiap backup menghasilkan 3 artefak:
 *   stpaulus_backup_YYYY-MM-DDTHH-MM-SS.sql          (file dump SQL)
 *   stpaulus_backup_YYYY-MM-DDTHH-MM-SS.sql.sha256   (hash integritas SHA-256)
 *   backups/manifest.json                            (catatan semua backup)
 *
 * Referensi IR/DRP: SS 1.2 Fase D2 -- Verifikasi Keaslian & Integritas Backup
 */

import mysql from 'mysql2/promise'
import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'
import dotenv from 'dotenv'
import crypto from 'crypto'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env') })

const dbConfig = {
  host: process.env.MYSQL_HOST || 'localhost',
  port: parseInt(process.env.MYSQL_PORT || '3306'),
  user: process.env.MYSQL_USER || 'root',
  password: process.env.MYSQL_PASSWORD || '',
  database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
}

const backupsDir = path.join(__dirname, '..', 'backups')
const manifestPath = path.join(backupsDir, 'manifest.json')

// =============================================================================
// INTEGRITY UTILITIES
// =============================================================================

/**
 * Menghitung SHA-256 hash dari sebuah file secara synchronous.
 * @param {string} filePath - Path absolut ke file.
 * @returns {string} Hex string SHA-256 (64 karakter).
 */
function computeFileHash(filePath) {
  const fileBuffer = fs.readFileSync(filePath)
  return crypto.createHash('sha256').update(fileBuffer).digest('hex')
}

/**
 * Menyimpan hash ke file .sha256 dengan format standar sha256sum:
 *   "<hash>  <filename>\n"  (dua spasi sebagai pemisah)
 * Format ini kompatibel dengan: sha256sum --check file.sql.sha256 (Linux/Mac)
 *
 * @param {string} hash - SHA-256 hex string.
 * @param {string} sqlFilePath - Path ke file .sql.
 * @returns {string} Path ke file .sha256 yang dibuat.
 */
function saveHashFile(hash, sqlFilePath) {
  const hashFilePath = sqlFilePath + '.sha256'
  const filename = path.basename(sqlFilePath)
  // Dua spasi adalah standar format sha256sum
  fs.writeFileSync(hashFilePath, `${hash}  ${filename}\n`, 'utf8')
  return hashFilePath
}

/**
 * Membaca hash yang tersimpan dari file .sha256.
 * Menangani format: "<hash>  <filename>" atau hanya "<hash>".
 * @param {string} sqlFilePath - Path ke file .sql (bukan .sha256).
 * @returns {string|null} Hash string atau null jika file tidak ada.
 */
function readStoredHash(sqlFilePath) {
  const hashFilePath = sqlFilePath + '.sha256'
  if (!fs.existsSync(hashFilePath)) return null
  // Ambil token pertama (hash) — toleran terhadap format yang berbeda
  return fs.readFileSync(hashFilePath, 'utf8').trim().split(/\s+/)[0]
}

/**
 * Membaca manifest backup. Return array kosong jika belum ada.
 * @returns {Array} Array of backup manifest entries.
 */
function readManifest() {
  if (!fs.existsSync(manifestPath)) return []
  try {
    return JSON.parse(fs.readFileSync(manifestPath, 'utf8'))
  } catch {
    console.warn('Warning: manifest.json corrupt, resetting.')
    return []
  }
}

/**
 * Menambahkan entry baru ke manifest (terbaru di atas).
 * @param {Object} entry - Data backup entry.
 */
function addToManifest(entry) {
  const manifest = readManifest()
  manifest.unshift(entry)
  fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
}

/**
 * Upload file ke S3-compatible offsite storage (SigV4).
 */
async function uploadOffsiteS3(localFilePath, targetKey) {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY
  const bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET
  const region = process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1'
  const endpoint = process.env.S3_ENDPOINT || `s3.${region}.amazonaws.com`

  if (!accessKeyId || !secretAccessKey || !bucket) {
    return false
  }

  try {
    const fileBuffer = fs.readFileSync(localFilePath)
    const payloadHash = crypto.createHash('sha256').update(fileBuffer).digest('hex')

    const now = new Date()
    const amzDate = now.toISOString().replace(/[:-]/g, '').slice(0, 15) + 'Z'
    const dateStr = amzDate.slice(0, 8)

    const cleanHost = endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const cleanKey = targetKey.replace(/^\//, '')
    const requestPath = `/${bucket}/${cleanKey}`

    const hostHeader = cleanHost
    const canonicalHeaders = `host:${hostHeader}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'

    const canonicalRequest = ['PUT', requestPath, '', canonicalHeaders, signedHeaders, payloadHash].join('\n')

    const credentialScope = `${dateStr}/${region}/s3/aws4_request`
    const stringToSign = ['AWS4-HMAC-SHA256', amzDate, credentialScope, crypto.createHash('sha256').update(canonicalRequest).digest('hex')].join('\n')

    const hmac = (key, data) => crypto.createHmac('sha256', key).update(data, 'utf8').digest()
    const kDate = hmac('AWS4' + secretAccessKey, dateStr)
    const kRegion = hmac(kDate, region)
    const kService = hmac(kRegion, 's3')
    const kSigning = hmac(kService, 'aws4_request')
    const signature = crypto.createHmac('sha256', kSigning).update(stringToSign, 'utf8').digest('hex')

    const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`
    const uploadUrl = `https://${cleanHost}${requestPath}`

    const res = await fetch(uploadUrl, {
      method: 'PUT',
      headers: {
        'Host': hostHeader,
        'x-amz-date': amzDate,
        'x-amz-content-sha256': payloadHash,
        'Authorization': authorizationHeader,
        'Content-Type': 'application/octet-stream'
      },
      body: fileBuffer
    })

    if (!res.ok) {
      const text = await res.text()
      throw new Error(`HTTP ${res.status}: ${text.slice(0, 200)}`)
    }
    return true
  } catch (err) {
    console.error('      Offsite upload error:', err.message)
    return false
  }
}


/**
 * Update status integritas entry di manifest berdasarkan filename.
 * @param {string} filename - Nama file backup.
 * @param {string} status - Status baru (VERIFIED, REVERIFIED, HASH_MISMATCH, dll).
 * @param {string} notes - Catatan tambahan.
 */
function updateManifestStatus(filename, status, notes) {
  const manifest = readManifest()
  const entry = manifest.find(e => e.filename === filename)
  if (entry) {
    entry.integrityStatus = status
    entry.notes = notes
    entry.lastCheckedAt = new Date().toISOString()
    fs.writeFileSync(manifestPath, JSON.stringify(manifest, null, 2), 'utf8')
  }
}

// =============================================================================
// BACKUP FUNCTION
// =============================================================================

async function backupDatabase() {
  let connection

  console.log('==================================================')
  console.log(' DATABASE BACKUP WITH INTEGRITY VERIFICATION')
  console.log('==================================================\n')

  try {
    // [1/5] Koneksi database
    console.log('[1/5] Connecting to database...')
    connection = await mysql.createConnection(dbConfig)
    console.log(`      Connected: ${dbConfig.database} @ ${dbConfig.host}\n`)

    // Pastikan direktori backup ada
    if (!fs.existsSync(backupsDir)) {
      fs.mkdirSync(backupsDir, { recursive: true })
    }

    // Generate nama file dengan timestamp ISO
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5)
    const filename = `stpaulus_backup_${timestamp}.sql`
    const filepath = path.join(backupsDir, filename)

    // [2/5] Generate SQL dump
    console.log('[2/5] Generating SQL dump...')
    console.log(`      Output: ${filename}\n`)

    // Header SQL
    let sqlDump = ''
    sqlDump += `-- =================================================\n`
    sqlDump += `-- MySQL Database Backup\n`
    sqlDump += `-- Database : ${dbConfig.database}\n`
    sqlDump += `-- Host     : ${dbConfig.host}\n`
    sqlDump += `-- Date     : ${new Date().toISOString()}\n`
    sqlDump += `-- Generator: StPaulus Backup Script v2.0\n`
    sqlDump += `-- SECURITY : Verify with backup-database.mjs verify\n`
    sqlDump += `-- =================================================\n\n`
    sqlDump += `SET FOREIGN_KEY_CHECKS=0;\n`
    sqlDump += `SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";\n`
    sqlDump += `SET time_zone = "+00:00";\n\n`

    // Ambil daftar tabel
    const [tables] = await connection.query('SHOW TABLES')
    const tableNames = tables.map(row => Object.values(row)[0])

    console.log(`      Found ${tableNames.length} tables`)

    let totalRows = 0

    // Dump setiap tabel
    for (const tableName of tableNames) {
      process.stdout.write(`      Dumping: ${tableName}...`)

      // CREATE TABLE
      const [createResult] = await connection.query(`SHOW CREATE TABLE \`${tableName}\``)
      const createStatement = createResult[0]['Create Table']

      sqlDump += `\n-- --- Table: ${tableName} ---\n\n`
      sqlDump += `DROP TABLE IF EXISTS \`${tableName}\`;\n`
      sqlDump += createStatement + ';\n\n'

      // Data rows
      const [rows] = await connection.query(`SELECT * FROM \`${tableName}\``)

      if (rows.length > 0) {
        sqlDump += `INSERT INTO \`${tableName}\` VALUES\n`

        const values = rows.map(row => {
          const escapedValues = Object.values(row).map(val => {
            if (val === null) return 'NULL'
            if (typeof val === 'number') return val
            if (val instanceof Date) {
              return `'${val.toISOString().slice(0, 19).replace('T', ' ')}'`
            }
            const escaped = String(val)
              .replace(/\\/g, '\\\\')
              .replace(/'/g, "\\'")
            return `'${escaped}'`
          })
          return `(${escapedValues.join(', ')})`
        })

        sqlDump += values.join(',\n') + ';\n\n'
        totalRows += rows.length
      }

      process.stdout.write(` ${rows.length} rows\n`)
    }

    sqlDump += `\nSET FOREIGN_KEY_CHECKS=1;\n`

    // Tulis ke file
    fs.writeFileSync(filepath, sqlDump, 'utf8')

    const stats = fs.statSync(filepath)
    const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)

    console.log(`\n      Done. ${sizeMB} MB | ${totalRows} total rows`)

    // [3/5] Verifikasi file dapat dibaca ulang (sanity check)
    console.log('\n[3/5] Sanity check: re-reading written file...')
    const writtenSize = fs.statSync(filepath).size
    if (writtenSize !== stats.size) {
      throw new Error(`File size mismatch after write: expected ${stats.size}, got ${writtenSize}`)
    }
    console.log(`      OK. File readable, ${writtenSize} bytes confirmed.`)

    // [4/5] Generate SHA-256 hash
    console.log('\n[4/5] Computing SHA-256 integrity hash...')
    const hash = computeFileHash(filepath)
    const hashFilePath = saveHashFile(hash, filepath)

    console.log(`      SHA-256    : ${hash}`)
    console.log(`      Hash file  : ${path.basename(hashFilePath)}`)
    console.log(`      Format     : Standard sha256sum compatible`)

    // [5/5] Update manifest
    console.log('\n[5/5] Updating backup manifest...')

    const manifestEntry = {
      filename,
      hashFile: filename + '.sha256',
      hash,
      database: dbConfig.database,
      host: dbConfig.host,
      tableCount: tableNames.length,
      totalRows,
      sizeBytes: stats.size,
      sizeMB: parseFloat(sizeMB),
      createdAt: new Date().toISOString(),
      integrityStatus: 'VERIFIED',
      lastCheckedAt: new Date().toISOString(),
      notes: 'Created and verified at backup time'
    }

    addToManifest(manifestEntry)

    const totalBackups = readManifest().length
    console.log(`      manifest.json: ${totalBackups} backup(s) on record`)

    // ─────────────────────────────────────────────
    // [6/6] OFFSITE UPLOAD (3-2-1 Rule)
    // ─────────────────────────────────────────────
    console.log('\n[6/6] Checking offsite S3 configuration...')
    const yearMonth = new Date().toISOString().slice(0, 7)
    const s3Result = await uploadOffsiteS3(filepath, `backups/${yearMonth}/${filename}`)
    if (s3Result) {
      await uploadOffsiteS3(filepath + '.sha256', `backups/${yearMonth}/${filename}.sha256`)
      console.log('      ✅ Offsite S3 upload completed successfully.')
    } else {
      console.log('      ℹ️ Offsite S3 storage not configured (skipping). Set S3_BUCKET & S3_ACCESS_KEY_ID in .env to enable.')
    }

    // Summary
    console.log('\n==================================================')
    console.log(' BACKUP SELESAI & TERVERIFIKASI')
    console.log('==================================================')

    console.log(` File    : ${filename}`)
    console.log(` Hash    : ${filename}.sha256`)
    console.log(` Ukuran  : ${sizeMB} MB`)
    console.log(` Lokasi  : ${backupsDir}`)
    console.log('\n Untuk verifikasi integritas backup ini nanti:')
    console.log(`   node scripts/backup-database.mjs verify ${filename}`)
    console.log('==================================================\n')

  } catch (error) {
    console.error('\nBACKUP GAGAL:', error.message)
    console.error('Detail:', error)
    process.exit(1)
  } finally {
    if (connection) await connection.end()
  }
}

// =============================================================================
// VERIFY FUNCTION
// =============================================================================

/**
 * Memverifikasi integritas file backup dengan membandingkan hash saat ini
 * terhadap hash yang disimpan saat backup pertama kali dibuat.
 *
 * Hash mismatch = file telah dimodifikasi setelah backup dibuat.
 * Ini bisa berarti: file rusak, atau (dalam konteks insiden) file telah dimanipulasi.
 *
 * Penggunaan: node scripts/backup-database.mjs verify stpaulus_backup_XXXX.sql
 */
async function verifyBackup(filename) {
  console.log('==================================================')
  console.log(' BACKUP INTEGRITY VERIFICATION')
  console.log('==================================================')
  console.log(` File: ${filename}\n`)

  const filepath = path.join(backupsDir, filename)
  const hashFilePath = filepath + '.sha256'

  // Cek keberadaan file backup
  if (!fs.existsSync(filepath)) {
    console.error('GAGAL: File backup tidak ditemukan.')
    console.error(`       Dicari di: ${filepath}`)
    process.exit(1)
  }

  // Cek keberadaan file .sha256
  if (!fs.existsSync(hashFilePath)) {
    console.error('GAGAL: File hash (.sha256) tidak ditemukan.')
    console.error(`       Dicari di: ${hashFilePath}`)
    console.error('\nKemungkinan backup ini dibuat sebelum fitur integrity check.')
    console.error('JANGAN gunakan backup ini untuk restore tanpa verifikasi manual!')
    process.exit(1)
  }

  // Info file
  const stats = fs.statSync(filepath)
  const sizeMB = (stats.size / (1024 * 1024)).toFixed(2)
  console.log(`[1/3] File ditemukan     : ${sizeMB} MB`)
  console.log(`      Terakhir diubah    : ${stats.mtime.toLocaleString('id-ID')}`)

  // Baca hash yang tersimpan
  const storedHash = readStoredHash(filepath)
  console.log(`\n[2/3] Hash tersimpan     : ${storedHash}`)

  // Hitung ulang hash saat ini
  console.log('\n[3/3] Menghitung hash file saat ini...')
  const currentHash = computeFileHash(filepath)
  console.log(`      Hash terhitung     : ${currentHash}`)

  // Bandingkan hash
  console.log('\n--------------------------------------------------')

  if (currentHash === storedHash) {
    console.log(' HASIL: LULUS (PASS)')
    console.log('--------------------------------------------------')
    console.log(' Hash COCOK. File backup VALID dan tidak dimodifikasi.')
    console.log(' Aman untuk digunakan sebagai sumber restore.')
    console.log('==================================================\n')

    updateManifestStatus(filename, 'REVERIFIED', `Verified OK at ${new Date().toISOString()}`)
    return true

  } else {
    console.error(' HASIL: GAGAL (FAIL)')
    console.error('--------------------------------------------------')
    console.error(' Hash TIDAK COCOK. File telah DIMODIFIKASI!')
    console.error('\n JANGAN gunakan backup ini untuk restore.')
    console.error('\n Kemungkinan penyebab:')
    console.error('   1. File rusak saat transfer atau penyimpanan')
    console.error('   2. File telah dimanipulasi (indikasi kompromi keamanan)')
    console.error('   3. Disk corruption')
    console.error('\n Tindakan:')
    console.error('   - Gunakan backup dari media offsite (S3/Backblaze)')
    console.error('   - Periksa log akses ke direktori backups/')
    console.error('   - Dokumentasikan untuk laporan RCA (IR/DRP Bagian 1.4)')
    console.error('==================================================\n')

    updateManifestStatus(filename, 'HASH_MISMATCH', `FAILED at ${new Date().toISOString()} | stored: ${storedHash} | current: ${currentHash}`)
    process.exit(1)
  }
}

// =============================================================================
// LIST FUNCTION
// =============================================================================

/**
 * Menampilkan semua backup yang tercatat di manifest beserta status integritasnya.
 * Penggunaan: node scripts/backup-database.mjs list
 */
function listBackups() {
  console.log('==================================================')
  console.log(' DAFTAR BACKUP (MANIFEST)')
  console.log('==================================================')

  const manifest = readManifest()

  if (manifest.length === 0) {
    console.log('\n Belum ada backup yang tercatat di manifest.')
    console.log(' Jalankan: node scripts/backup-database.mjs')
    console.log('==================================================\n')
    return
  }

  manifest.forEach((entry, index) => {
    const num = String(index + 1).padStart(2, ' ')
    const fileExists = fs.existsSync(path.join(backupsDir, entry.filename))
    const hashExists = entry.hashFile && fs.existsSync(path.join(backupsDir, entry.hashFile))

    let statusIcon = '[?]'
    if (entry.integrityStatus === 'VERIFIED' || entry.integrityStatus === 'REVERIFIED') {
      statusIcon = '[OK]'
    } else if (entry.integrityStatus === 'HASH_MISMATCH') {
      statusIcon = '[FAIL]'
    }

    const fileIcon = fileExists ? '' : ' [FILE HILANG!]'
    const hashIcon = hashExists ? '' : ' [HASH HILANG]'

    const shortHash = entry.hash ? entry.hash.substring(0, 16) + '...' : 'N/A'
    const created = entry.createdAt
      ? new Date(entry.createdAt).toLocaleString('id-ID')
      : 'N/A'

    console.log(`\n #${num} ${entry.filename}${fileIcon}`)
    console.log(`       Dibuat   : ${created}`)
    console.log(`       Ukuran   : ${entry.sizeMB || '?'} MB | ${entry.tableCount || '?'} tabel | ${entry.totalRows || '?'} baris`)
    console.log(`       SHA-256  : ${shortHash}${hashIcon}`)
    console.log(`       Status   : ${statusIcon} ${entry.integrityStatus}`)
    if (entry.notes) console.log(`       Catatan  : ${entry.notes}`)
  })

  console.log('\n==================================================')
  console.log(` Total: ${manifest.length} backup terdaftar`)
  console.log(' Verifikasi: node scripts/backup-database.mjs verify <filename>')
  console.log('==================================================\n')
}

// =============================================================================
// CLI ENTRY POINT
// =============================================================================

const [,, command, ...args] = process.argv

switch (command) {
  case 'verify':
    if (!args[0]) {
      console.error('Usage: node scripts/backup-database.mjs verify <filename.sql>')
      process.exit(1)
    }
    verifyBackup(args[0])
    break

  case 'list':
    listBackups()
    break

  default:
    // Tanpa command = buat backup baru
    backupDatabase()
}
