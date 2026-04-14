import { getQuery } from '../../database/db'

/**
 * Public endpoint — let a registered user check their own account status.
 * Accepts ?username=xxx OR ?email=xxx
 * Only returns status (PENDING / ACTIVE / INACTIVE / NOT_FOUND) — no sensitive data.
 */
export default defineEventHandler(async (event) => {
  const query = getQuery(event) as { username?: string; email?: string }
  const username = query.username?.trim()
  const email = query.email?.trim()

  if (!username && !email) {
    throw createError({ statusCode: 400, statusMessage: 'Masukkan username atau email' })
  }

  try {
    let row: any

    if (username) {
      row = await getQuery(
        'SELECT account_status FROM users WHERE LOWER(username) = LOWER(?) AND (role_id IS NULL OR role_id = 0)',
        [username]
      )
    } else {
      row = await getQuery(
        'SELECT account_status FROM users WHERE LOWER(email) = LOWER(?) AND (role_id IS NULL OR role_id = 0)',
        [email!]
      )
    }

    if (!row) {
      return { status: 'NOT_FOUND' }
    }

    const status = row.account_status || 'ACTIVE'
    return { status }
  } catch (err) {
    console.error('[check-status] Error:', err)
    throw createError({ statusCode: 500, statusMessage: 'Gagal memeriksa status akun' })
  }
})
