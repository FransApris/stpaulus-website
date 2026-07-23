/**
 * server/utils/offsiteStorage.ts
 *
 * Offsite S3-Compatible Storage Uploader (AWS S3, Backblaze B2, Cloudflare R2, MinIO).
 * Uses pure Node.js crypto + fetch with AWS Signature Version 4 (SigV4).
 * Zero extra npm dependencies required.
 *
 * Referensi IR/DRP: §2.3 Aturan 3-2-1 & Immutable Offsite Backup
 */

import crypto from 'crypto'
import fs from 'fs'
import path from 'path'
import { logger } from './logger'

export interface S3Config {
  endpoint: string         // e.g. "s3.ap-southeast-1.amazonaws.com" or "s3.us-west-004.backblazeb2.com"
  region: string           // e.g. "ap-southeast-1" or "us-west-004"
  bucket: string           // e.g. "stpaulus-offsite-backup"
  accessKeyId: string
  secretAccessKey: string
}

/**
 * Reads S3 configuration from environment variables.
 * Returns null if S3 is not configured.
 */
export function getS3Config(): S3Config | null {
  const accessKeyId = process.env.S3_ACCESS_KEY_ID || process.env.AWS_ACCESS_KEY_ID
  const secretAccessKey = process.env.S3_SECRET_ACCESS_KEY || process.env.AWS_SECRET_ACCESS_KEY
  const bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET
  const region = process.env.S3_REGION || process.env.AWS_REGION || 'us-east-1'
  const endpoint = process.env.S3_ENDPOINT || `s3.${region}.amazonaws.com`

  if (!accessKeyId || !secretAccessKey || !bucket) {
    return null
  }

  return { accessKeyId, secretAccessKey, bucket, region, endpoint }
}

// ─── SigV4 Crypto Helpers ─────────────────────────────────────────────────────

function hmac(key: string | Buffer, data: string): Buffer {
  return crypto.createHmac('sha256', key).update(data, 'utf8').digest()
}

function hashHex(data: string | Buffer): string {
  return crypto.createHash('sha256').update(data).digest('hex')
}

function getSigningKey(secretKey: string, dateStr: string, regionName: string, serviceName: string): Buffer {
  const kDate = hmac('AWS4' + secretKey, dateStr)
  const kRegion = hmac(kDate, regionName)
  const kService = hmac(kRegion, serviceName)
  const kSigning = hmac(kService, 'aws4_request')
  return kSigning
}

/**
 * Uploads a local file to S3-compatible offsite storage using AWS SigV4 REST API.
 * Silently skips if S3 credentials are not configured.
 *
 * @param localFilePath - Absolute path to local file
 * @param targetKey - Remote S3 object key (e.g. "backups/2026/07/stpaulus_backup.sql")
 * @returns Promise<boolean> - True if uploaded, false if skipped or failed
 */
export async function uploadFileToOffsiteS3(localFilePath: string, targetKey: string): Promise<boolean> {
  const config = getS3Config()
  if (!config) {
    logger.info('[OffsiteBackup] S3 credentials not configured — skipping offsite backup upload', {
      event: 'OFFSITE_BACKUP_SKIPPED',
      file: path.basename(localFilePath)
    })
    return false
  }

  if (!fs.existsSync(localFilePath)) {
    logger.error('[OffsiteBackup] Local file does not exist for offsite upload', {
      event: 'OFFSITE_FILE_NOT_FOUND',
      path: localFilePath
    })
    return false
  }

  try {
    const fileBuffer = fs.readFileSync(localFilePath)
    const payloadHash = hashHex(fileBuffer)

    const now = new Date()
    const amzDate = now.toISOString().replace(/[:-]/g, '').slice(0, 15) + 'Z' // YYYYMMDDTHHMMSSZ
    const dateStr = amzDate.slice(0, 8) // YYYYMMDD

    // Host & Path preparation
    const cleanHost = config.endpoint.replace(/^https?:\/\//, '').replace(/\/$/, '')
    const cleanKey = targetKey.replace(/^\//, '')
    const requestPath = `/${config.bucket}/${cleanKey}`

    const hostHeader = cleanHost
    const canonicalHeaders = `host:${hostHeader}\nx-amz-content-sha256:${payloadHash}\nx-amz-date:${amzDate}\n`
    const signedHeaders = 'host;x-amz-content-sha256;x-amz-date'

    const canonicalRequest = [
      'PUT',
      requestPath,
      '', // CanonicalQueryString
      canonicalHeaders,
      signedHeaders,
      payloadHash
    ].join('\n')

    const credentialScope = `${dateStr}/${config.region}/s3/aws4_request`
    const stringToSign = [
      'AWS4-HMAC-SHA256',
      amzDate,
      credentialScope,
      hashHex(canonicalRequest)
    ].join('\n')

    const signingKey = getSigningKey(config.secretAccessKey, dateStr, config.region, 's3')
    const signature = crypto.createHmac('sha256', signingKey).update(stringToSign, 'utf8').digest('hex')

    const authorizationHeader = `AWS4-HMAC-SHA256 Credential=${config.accessKeyId}/${credentialScope}, SignedHeaders=${signedHeaders}, Signature=${signature}`

    const uploadUrl = `https://${cleanHost}${requestPath}`

    const response = await fetch(uploadUrl, {
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

    if (!response.ok) {
      const responseText = await response.text()
      throw new Error(`HTTP ${response.status}: ${responseText.slice(0, 300)}`)
    }

    logger.info(`[OffsiteBackup] Successfully uploaded to offsite S3 bucket "${config.bucket}"`, {
      event: 'OFFSITE_BACKUP_SUCCESS',
      targetKey,
      file: path.basename(localFilePath),
      bucket: config.bucket
    })
    return true

  } catch (error: any) {
    logger.error('[OffsiteBackup] Offsite S3 upload failed', {
      event: 'OFFSITE_BACKUP_FAILED',
      error: error.message,
      file: path.basename(localFilePath)
    })
    return false
  }
}
