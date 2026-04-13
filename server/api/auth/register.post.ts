import { runQuery, getQuery, allQuery } from '../../database/db'
import { hashPassword } from '../../utils/auth'

// Ensure account_status column exists (auto-migrate if not yet run)
async function ensureAccountStatusColumn() {
  try {
    await runQuery(`
      ALTER TABLE users 
      ADD COLUMN IF NOT EXISTS account_status VARCHAR(20) NOT NULL DEFAULT 'ACTIVE'
    `)
    // Set existing users to ACTIVE so they are not blocked
    await runQuery(`
      UPDATE users SET account_status = 'ACTIVE' 
      WHERE account_status IS NULL OR account_status = ''
    `)
  } catch (_) {
    // Column already exists or DB doesn't support IF NOT EXISTS — safe to ignore
  }
}

export default defineEventHandler(async (event) => {
  try {
    // Auto-apply migration if needed
    await ensureAccountStatusColumn()
    const body = await readBody(event)
    const { username, email, password, full_name, contact_phone, user_category, unit_name } = body

    // --- Validasi field wajib ---
    if (!username || !email || !password || !full_name || !user_category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Field wajib: username, email, password, nama lengkap, kategori'
      })
    }

    // --- Validasi format email ---
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      throw createError({ statusCode: 400, statusMessage: 'Format email tidak valid' })
    }

    // --- Validasi panjang password ---
    if (password.length < 6) {
      throw createError({ statusCode: 400, statusMessage: 'Password minimal 6 karakter' })
    }

    // --- Cek kategori valid ---
    const validCategories = await allQuery(
      'SELECT name FROM user_categories WHERE is_active = 1'
    ) as { name: string }[]
    const validNames = validCategories.map(c => c.name)
    if (!validNames.includes(user_category)) {
      throw createError({
        statusCode: 400,
        statusMessage: `Kategori tidak valid. Pilihan: ${validNames.join(', ')}`
      })
    }

    // --- Cek username / email sudah ada ---
    const existing = await getQuery(
      'SELECT id FROM users WHERE LOWER(username) = LOWER(?) OR LOWER(email) = LOWER(?)',
      [username, email]
    ) as any
    if (existing) {
      throw createError({ statusCode: 409, statusMessage: 'Username atau email sudah digunakan' })
    }

    const passwordHash = await hashPassword(password)

    await runQuery(
      `INSERT INTO users 
        (username, email, password_hash, full_name, contact_phone, user_category, unit_name, role, role_id, account_status)
       VALUES (?, ?, ?, ?, ?, ?, ?, 'user', NULL, 'PENDING')`,
      [
        username.trim(),
        email.trim().toLowerCase(),
        passwordHash,
        full_name.trim(),
        contact_phone ? String(contact_phone).trim() : null,
        user_category,
        unit_name ? unit_name.trim() : null
      ]
    )

    console.log('[Register] New user registered, awaiting approval:', username)

    return {
      success: true,
      message: 'Pendaftaran berhasil! Akun Anda sedang menunggu persetujuan admin. Anda akan dapat login setelah disetujui.'
    }
  } catch (error: any) {
    console.error('[Register] Error:', error)
    throw error
  }
})
