/**
 * server/utils/cryptoField.ts
 *
 * AES-256-GCM Field-Level Encryption & PII Masking Utility.
 * Provides authenticated symmetric encryption for sensitive database fields and PII sanitization for logs.
 *
 * Referensi IR/DRP: Gap #2 — Perlindungan Data At Rest & PII Sanitization (Compliance 10/10)
 */

import crypto from 'crypto'

/**
 * Derives a 32-byte (256-bit) encryption key from the environment JWT_SECRET.
 */
function getDerivedKey(): Buffer {
  const secret = process.env.JWT_SECRET || 'stpaulus_fallback_secure_encryption_key_min32chars'
  return crypto.createHash('sha256').update(secret).digest()
}

/**
 * Encrypts a plain text string using AES-256-GCM with a random 12-byte IV.
 * Format output: "iv_hex:authTag_hex:ciphertext_hex"
 *
 * @param text - Plain text data to encrypt
 * @returns Encrypted string format iv:tag:ciphertext
 */
export function encryptField(text: string): string {
  if (!text) return ''

  const key = getDerivedKey()
  const iv = crypto.randomBytes(12) // 96-bit IV recommended for GCM
  const cipher = crypto.createCipheriv('aes-256-gcm', key, iv)

  let encrypted = cipher.update(text, 'utf8', 'hex')
  encrypted += cipher.final('hex')

  const authTag = cipher.getAuthTag().toString('hex')

  return `${iv.toString('hex')}:${authTag}:${encrypted}`
}

/**
 * Decrypts an AES-256-GCM encrypted string created by encryptField.
 *
 * @param encryptedData - Encrypted string format "iv:authTag:ciphertext"
 * @returns Decrypted plain text or empty string on failure
 */
export function decryptField(encryptedData: string): string {
  if (!encryptedData || !encryptedData.includes(':')) return encryptedData

  try {
    const parts = encryptedData.split(':')
    if (parts.length !== 3) return encryptedData

    const [ivHex, authTagHex, cipherHex] = parts
    const key = getDerivedKey()

    const iv = Buffer.from(ivHex, 'hex')
    const authTag = Buffer.from(authTagHex, 'hex')

    const decipher = crypto.createDecipheriv('aes-256-gcm', key, iv)
    decipher.setAuthTag(authTag)

    let decrypted = decipher.update(cipherHex, 'hex', 'utf8')
    decrypted += decipher.final('utf8')

    return decrypted
  } catch (error) {
    console.error('[CryptoField] Decryption failed:', error)
    return ''
  }
}

// ─── PII MASKING HELPERS ──────────────────────────────────────────────────────

/**
 * Masks an email address for public or log output.
 * Example: "fransapris@gmail.com" -> "f***s@gmail.com"
 */
export function maskEmail(email: string): string {
  if (!email || !email.includes('@')) return email || ''
  const [user, domain] = email.split('@')
  if (user.length <= 2) {
    return `${user[0]}*@${domain}`
  }
  return `${user[0]}***${user[user.length - 1]}@${domain}`
}

/**
 * Masks a phone number for public or log output.
 * Example: "081234567890" -> "0812****7890"
 */
export function maskPhone(phone: string): string {
  if (!phone || phone.length < 7) return '****'
  const prefix = phone.slice(0, 4)
  const suffix = phone.slice(-4)
  return `${prefix}****${suffix}`
}

/**
 * Recursively masks PII and sensitive fields (passwords, tokens, keys) in objects.
 * Useful for log sanitization.
 */
export function sanitizeLogMeta(obj: any): any {
  if (!obj || typeof obj !== 'object') return obj

  if (Array.isArray(obj)) {
    return obj.map(sanitizeLogMeta)
  }

  const sensitiveKeys = ['password', 'passwd', 'secret', 'token', 'jwt', 'auth', 'authorization', 'bearer', 'totp_secret']
  const sanitized: Record<string, any> = {}

  for (const [key, val] of Object.entries(obj)) {
    const lowerKey = key.toLowerCase()

    if (sensitiveKeys.some(k => lowerKey.includes(k))) {
      sanitized[key] = '***MASKED***'
    } else if (lowerKey === 'email' && typeof val === 'string') {
      sanitized[key] = maskEmail(val)
    } else if ((lowerKey.includes('phone') || lowerKey.includes('no_hp')) && typeof val === 'string') {
      sanitized[key] = maskPhone(val)
    } else if (typeof val === 'object' && val !== null) {
      sanitized[key] = sanitizeLogMeta(val)
    } else {
      sanitized[key] = val
    }
  }

  return sanitized
}
