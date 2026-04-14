import { Resend } from 'resend'

// Resend client — lazily created
function getResend(): Resend | null {
  const apiKey = process.env.RESEND_API_KEY
  if (!apiKey) {
    console.warn('[Email] RESEND_API_KEY not set — skipping email')
    return null
  }
  return new Resend(apiKey)
}

const FROM_NAME = 'Paroki Santo Paulus Juanda'
const FROM_EMAIL = process.env.RESEND_FROM || 'noreply@stpaulusjuanda.org'
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://stpaulusjuanda.org'

/**
 * Send email via Resend HTTP API — silently skips if not configured.
 * Returns true if sent, false if skipped/error.
 */
async function sendMail(options: { to: string; subject: string; html: string }): Promise<boolean> {
  const resend = getResend()
  if (!resend) return false
  try {
    const { error } = await resend.emails.send({
      from: `${FROM_NAME} <${FROM_EMAIL}>`,
      to: options.to,
      subject: options.subject,
      html: options.html
    })
    if (error) {
      console.error('[Email] Resend error:', error)
      return false
    }
    console.log(`[Email] Sent "${options.subject}" to ${options.to}`)
    return true
  } catch (err) {
    console.error('[Email] Failed to send email:', err)
    return false
  }
}

// ─── Template helpers ────────────────────────────────────────────────────────

function baseTemplate(body: string) {
  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f9fafb; padding: 24px;">
      <div style="background: #166534; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
        <h1 style="color: white; margin: 0; font-size: 20px;">Paroki Santo Paulus Sinaboi</h1>
      </div>
      <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e5e7eb; border-top: none;">
        ${body}
      </div>
      <p style="text-align: center; color: #9ca3af; font-size: 12px; margin-top: 16px;">
        Email ini dikirim otomatis. Jangan membalas email ini.
      </p>
    </div>
  `
}

// ─── Public email functions ───────────────────────────────────────────────────

/**
 * Notify user that their registration is awaiting approval.
 */
export async function sendRegistrationPendingEmail(params: {
  to: string
  username: string
  fullName: string
}): Promise<void> {
  await sendMail({
    to: params.to,
    subject: 'Pendaftaran Diterima — Menunggu Persetujuan',
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${params.fullName}!</h2>
      <p style="color: #374151;">Terima kasih telah mendaftar di sistem pemesanan ruangan <strong>Paroki Santo Paulus Sinaboi</strong>.</p>
      <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #713f12;">
          ⏳ <strong>Akun Anda sedang menunggu persetujuan</strong> dari admin sekretariat paroki.
          Anda akan menerima email lagi setelah akun diproses.
        </p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Username Anda: <strong>${params.username}</strong></p>
      <p style="color: #6b7280; font-size: 14px;">Untuk pertanyaan, hubungi sekretariat paroki.</p>
      <a href="${SITE_URL}/cek-status" style="display: inline-block; background: #166534; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 8px;">
        Cek Status Akun
      </a>
    `)
  })
}

/**
 * Notify user that their account has been approved.
 */
export async function sendAccountApprovedEmail(params: {
  to: string
  username: string
  fullName: string
}): Promise<void> {
  await sendMail({
    to: params.to,
    subject: '✅ Akun Anda Telah Disetujui',
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${params.fullName}!</h2>
      <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #14532d;">
          ✅ <strong>Akun Anda telah disetujui!</strong> Sekarang Anda dapat login dan membuat pemesanan ruangan.
        </p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Username Anda: <strong>${params.username}</strong></p>
      <a href="${SITE_URL}/booking" style="display: inline-block; background: #166534; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 8px;">
        Login & Pesan Ruangan
      </a>
    `)
  })
}

/**
 * Notify user that their registration has been rejected.
 */
export async function sendAccountRejectedEmail(params: {
  to: string
  username: string
  fullName: string
}): Promise<void> {
  await sendMail({
    to: params.to,
    subject: 'Pendaftaran Tidak Dapat Diproses',
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${params.fullName}!</h2>
      <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #7f1d1d;">
          ❌ <strong>Pendaftaran Anda tidak dapat diproses.</strong>
          Akun Anda tidak disetujui oleh admin sekretariat paroki.
        </p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Untuk informasi lebih lanjut, silakan hubungi sekretariat paroki secara langsung.</p>
    `)
  })
}
