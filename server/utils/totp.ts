/**
 * server/utils/totp.ts
 *
 * Lightweight, zero-dependency TOTP (Time-Based One-Time Password) implementation.
 * RFC 6238 / RFC 4226 compliant.
 * Compatible with Google Authenticator, Authy, 1Password, Bitwarden, Microsoft Authenticator.
 *
 * Referensi IR/DRP: Gap #2 — Multi-Factor Authentication (MFA/2FA) untuk Akun Admin.
 */

import crypto from 'crypto'

const BASE32_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ234567'

/**
 * Encodes a buffer to Base32 string.
 */
function base32Encode(buffer: Buffer): string {
  let bits = 0
  let value = 0
  let output = ''

  for (let i = 0; i < buffer.length; i++) {
    value = (value << 8) | (buffer[i] || 0)
    bits += 8

    while (bits >= 5) {
      output += BASE32_CHARS[(value >>> (bits - 5)) & 31]
      bits -= 5
    }
  }

  if (bits > 0) {
    output += BASE32_CHARS[(value << (5 - bits)) & 31]
  }

  return output
}

/**
 * Decodes a Base32 string to Buffer.
 */
function base32Decode(base32: string): Buffer {
  const clean = base32.toUpperCase().replace(/=+$/, '').replace(/[^A-Z2-7]/g, '')
  const bytes: number[] = []
  let bits = 0
  let value = 0

  for (let i = 0; i < clean.length; i++) {
    const char = clean[i]
    if (!char) continue
    const idx = BASE32_CHARS.indexOf(char)
    if (idx === -1) continue

    value = (value << 5) | idx
    bits += 5

    if (bits >= 8) {
      bytes.push((value >>> (bits - 8)) & 255)
      bits -= 8
    }
  }

  return Buffer.from(bytes)
}

/**
 * Generates dynamic 6-digit OTP for a given counter value and secret.
 */
function generateOtpForCounter(secretBuffer: Buffer, counter: number): string {
  const counterBuffer = Buffer.alloc(8)
  // Write counter as 64-bit big-endian integer
  counterBuffer.writeUInt32BE(Math.floor(counter / 0x100000000), 0)
  counterBuffer.writeUInt32BE(counter % 0x100000000, 4)

  const hmac = crypto.createHmac('sha1', secretBuffer).update(counterBuffer).digest()
  const offset = (hmac[hmac.length - 1] || 0) & 0x0f

  const binary =
    (((hmac[offset] || 0) & 0x7f) << 24) |
    (((hmac[offset + 1] || 0) & 0xff) << 16) |
    (((hmac[offset + 2] || 0) & 0xff) << 8) |
    ((hmac[offset + 3] || 0) & 0xff)

  const otp = binary % 1000000
  return String(otp).padStart(6, '0')
}

// ─── Public TOTP API ──────────────────────────────────────────────────────────

/**
 * Generates a new random TOTP secret (Base32) and otpauth URI.
 *
 * @param username - Account username for display in authenticator apps
 * @returns { secret, otpauthUrl }
 */
export function generateTotpSecret(username: string): { secret: string; otpauthUrl: string } {
  // 20 random bytes (160 bits) = 32 Base32 characters (standard recommendation)
  const randomBytes = crypto.randomBytes(20)
  const secret = base32Encode(randomBytes)
  const issuer = 'StPaulusJuanda'

  const otpauthUrl = `otpauth://totp/${encodeURIComponent(issuer)}:${encodeURIComponent(username)}?secret=${secret}&issuer=${encodeURIComponent(issuer)}&algorithm=SHA1&digits=6&period=30`

  return { secret, otpauthUrl }
}

/**
 * Verifies a 6-digit TOTP code against a secret key.
 * Allows slight clock drift (default window = 1, meaning +/- 30 seconds).
 *
 * @param secret - Base32 encoded secret key
 * @param token - 6-digit code entered by user
 * @param window - Number of 30-second steps to check backward/forward
 * @returns boolean - True if token is valid
 */
export function verifyTotpToken(secret: string, token: string, window = 1): boolean {
  if (!secret || !token || token.length !== 6 || !/^\d{6}$/.test(token)) {
    return false
  }

  const secretBuffer = base32Decode(secret)
  const currentStep = Math.floor(Date.now() / 1000 / 30)

  for (let i = -window; i <= window; i++) {
    const step = currentStep + i
    const validOtp = generateOtpForCounter(secretBuffer, step)

    // Constant-time string comparison to prevent timing side-channel attacks
    if (crypto.timingSafeEqual(Buffer.from(validOtp), Buffer.from(token))) {
      return true
    }
  }

  return false
}

/**
 * Generates 8 random single-use recovery/backup codes.
 * Each code is 8 hex characters formatted as XXXX-XXXX.
 *
 * @returns Array of 8 plain text recovery codes
 */
export function generateBackupCodes(): string[] {
  const codes: string[] = []
  for (let i = 0; i < 8; i++) {
    const raw = crypto.randomBytes(4).toString('hex').toLowerCase()
    codes.push(`${raw.slice(0, 4)}-${raw.slice(4)}`)
  }
  return codes
}

/**
 * Hashes a backup code for secure storage in database.
 */
export function hashBackupCode(code: string): string {
  const cleanCode = code.replace(/[^a-f0-9]/gi, '').toLowerCase()
  return crypto.createHash('sha256').update(cleanCleanCode(cleanCode)).digest('hex')
}

function cleanCleanCode(code: string): string {
  return code.replace(/[^a-f0-9]/gi, '').toLowerCase()
}

/**
 * Checks if a provided backup code matches any of the stored hashed backup codes.
 * If matched, returns the index of the matched code (so it can be removed after use).
 * Returns -1 if no match.
 */
export function checkBackupCode(providedCode: string, hashedCodes: string[]): number {
  const hashedInput = hashBackupCode(providedCode)
  return hashedCodes.findIndex(storedHash => storedHash === hashedInput)
}
