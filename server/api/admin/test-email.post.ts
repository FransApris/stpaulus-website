import { requireAuth } from '../../utils/auth'
import { sendAccountApprovedEmail } from '../../utils/email'

/**
 * POST /api/admin/test-email
 * Super admin only — sends a test email to verify SMTP config.
 * Body: { to: string }
 */
export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)

  // Only super_admin
  const authCtx = event.context.auth
  if (!authCtx?.permissions?.includes('manage_roles')) {
    throw createError({ statusCode: 403, statusMessage: 'Hanya super_admin yang dapat menguji email' })
  }

  const body = await readBody(event)
  const to = body?.to?.trim()

  if (!to || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(to)) {
    throw createError({ statusCode: 400, statusMessage: 'Alamat email tujuan tidak valid' })
  }

  // Log env config (without showing full password)
  const smtpHost = process.env.SMTP_HOST
  const smtpUser = process.env.SMTP_USER
  const smtpPass = process.env.SMTP_PASS
  const smtpFrom = process.env.SMTP_FROM

  console.log('[Test Email] SMTP config check:', {
    SMTP_HOST: smtpHost || '❌ MISSING',
    SMTP_PORT: process.env.SMTP_PORT || '587 (default)',
    SMTP_USER: smtpUser || '❌ MISSING',
    SMTP_PASS: smtpPass ? `✅ set (${smtpPass.length} chars)` : '❌ MISSING',
    SMTP_FROM: smtpFrom || '❌ MISSING'
  })

  if (!smtpHost || !smtpUser || !smtpPass) {
    return {
      success: false,
      message: 'SMTP belum dikonfigurasi. Pastikan SMTP_HOST, SMTP_USER, dan SMTP_PASS sudah di-set di Railway Variables.',
      config: {
        SMTP_HOST: smtpHost ? '✅' : '❌ MISSING',
        SMTP_USER: smtpUser ? '✅' : '❌ MISSING',
        SMTP_PASS: smtpPass ? '✅' : '❌ MISSING'
      }
    }
  }

  const sent = await sendAccountApprovedEmail({
    to,
    username: 'test_user',
    fullName: 'Test User'
  })

  if (sent) {
    return { success: true, message: `Email test berhasil dikirim ke ${to}` }
  } else {
    return { success: false, message: 'Email gagal dikirim. Cek Railway logs untuk detail error.' }
  }
})
