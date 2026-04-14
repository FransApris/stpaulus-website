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

  // Log env config
  const resendKey = process.env.RESEND_API_KEY
  const resendFrom = process.env.RESEND_FROM

  console.log('[Test Email] Resend config check:', {
    RESEND_API_KEY: resendKey ? `✅ set (${resendKey.length} chars)` : '❌ MISSING',
    RESEND_FROM: resendFrom || '(using default noreply@stpaulusjuanda.org)'
  })

  if (!resendKey) {
    return {
      success: false,
      message: 'RESEND_API_KEY belum dikonfigurasi. Daftar di resend.com lalu set variabel ini di Railway.',
      config: {
        RESEND_API_KEY: '❌ MISSING'
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
