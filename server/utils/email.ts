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

const FROM_NAME = 'Paroki St. Paulus - Juanda'
const FROM_EMAIL = process.env.RESEND_FROM || 'noreply@stpaulusjuanda.org'
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL || 'https://stpaulusjuanda.org'

/**
 * Escape HTML special characters untuk mencegah XSS dalam template email.
 * WAJIB digunakan untuk semua nilai yang berasal dari user/admin input.
 * @see OWASP XSS Prevention Cheat Sheet
 */
function esc(unsafe: string | null | undefined): string {
  if (unsafe === null || unsafe === undefined) return ''
  return String(unsafe)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

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
        <h1 style="color: white; margin: 0; font-size: 20px;">Paroki Santo Paulus Juanda</h1>
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
}): Promise<boolean> {
  return sendMail({
    to: params.to,
    subject: 'Pendaftaran Diterima — Menunggu Persetujuan',
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${esc(params.fullName)}!</h2>
      <p style="color: #374151;">Terima kasih telah mendaftar di sistem pemesanan ruangan <strong>Paroki St. Paulus - Juanda</strong>.</p>
      <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #713f12;">
          ⏳ <strong>Akun Anda sedang menunggu persetujuan</strong> dari admin sekretariat paroki.
          Anda akan menerima email lagi setelah akun diproses.
        </p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Username Anda: <strong>${esc(params.username)}</strong></p>
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
}): Promise<boolean> {
  return sendMail({
    to: params.to,
    subject: '✅ Akun Anda Telah Disetujui',
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${esc(params.fullName)}!</h2>
      <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 16px; margin: 20px 0;">
        <p style="margin: 0; color: #14532d;">
          ✅ <strong>Akun Anda telah disetujui!</strong> Sekarang Anda dapat login dan membuat pemesanan ruangan.
        </p>
      </div>
      <p style="color: #6b7280; font-size: 14px;">Username Anda: <strong>${esc(params.username)}</strong></p>
      <a href="${SITE_URL}/booking" style="display: inline-block; background: #166534; color: white; padding: 10px 20px; border-radius: 6px; text-decoration: none; margin-top: 8px;">
        Login &amp; Pesan Ruangan
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
}): Promise<boolean> {
  return sendMail({
    to: params.to,
    subject: 'Pendaftaran Tidak Dapat Diproses',
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${esc(params.fullName)}!</h2>
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

/**
 * Send password reset link email.
 */
export async function sendPasswordResetEmail(params: {
  to: string
  fullName: string
  resetLink: string
}): Promise<boolean> {
  return sendMail({
    to: params.to,
    subject: '🔑 Reset Password Akun Anda',
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${esc(params.fullName)}!</h2>
      <p style="color: #374151;">Kami menerima permintaan untuk mereset password akun Anda di sistem
      <strong>Paroki St. Paulus - Juanda</strong>.</p>
      <div style="text-align: center; margin: 28px 0;">
        <a href="${SITE_URL}/reset-password"
           style="display: inline-block; background: #166534; color: white; padding: 14px 32px;
                  border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
          Reset Password Saya
        </a>
      </div>
      <div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 8px; padding: 14px; margin: 20px 0;">
        <p style="margin: 0; color: #713f12; font-size: 13px;">
          ⚠️ Jika Anda tidak meminta reset password, abaikan email ini. Akun Anda tetap aman.
        </p>
      </div>
      <p style="color: #9ca3af; font-size: 12px;">Link reset password berlaku selama 1 jam.</p>
    `)
  })
}

/**
 * Send real-time security alert email to admins when a CRITICAL security event occurs.
 */
export async function sendSecurityAlertEmail(params: {
  level: string
  message: string
  meta?: any
  timestamp: string
}): Promise<boolean> {
  const alertRecipient = process.env.SECURITY_ALERT_EMAIL || process.env.ADMIN_EMAIL || process.env.RESEND_FROM
  if (!alertRecipient) {
    console.warn('[Email] SECURITY_ALERT_EMAIL not configured — skipping security alert email')
    return false
  }

  const metaJson = params.meta ? JSON.stringify(params.meta, null, 2) : 'Tidak ada metadata'
  // esc() diperlukan karena metaJson bisa mengandung < > & dari nilai IP atau path
  const metaHtml = `<pre style="background: #1e293b; color: #38bdf8; padding: 12px; border-radius: 6px; font-size: 12px; overflow-x: auto; white-space: pre-wrap;">${esc(metaJson)}</pre>`

  return sendMail({
    to: alertRecipient,
    subject: `🚨 [SECURITY ALERT] ${esc(params.level)}: ${esc(params.message)}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 650px; margin: 0 auto; background: #f8fafc; padding: 24px;">
        <div style="background: #dc2626; padding: 20px; border-radius: 8px 8px 0 0; text-align: center;">
          <h1 style="color: white; margin: 0; font-size: 20px;">🚨 CRITICAL SECURITY ALERT</h1>
          <p style="color: #fca5a5; margin: 4px 0 0 0; font-size: 13px;">Paroki St. Paulus Juanda — Security Monitoring System</p>
        </div>
        <div style="background: white; padding: 28px; border-radius: 0 0 8px 8px; border: 1px solid #e2e8f0; border-top: none;">
          <div style="background: #fef2f2; border-left: 4px solid #ef4444; padding: 16px; margin-bottom: 20px;">
            <strong style="color: #991b1b; font-size: 16px;">${esc(params.message)}</strong>
            <p style="margin: 6px 0 0 0; color: #7f1d1d; font-size: 13px;">Waktu Kejadian: ${esc(params.timestamp)}</p>
          </div>
          
          <h3 style="color: #334155; margin-top: 20px; font-size: 14px;">Detail Metadata Insiden:</h3>
          ${metaHtml}

          <div style="margin-top: 24px; padding-top: 16px; border-top: 1px solid #e2e8f0;">
            <p style="margin: 0; color: #64748b; font-size: 12px;">
              💡 <strong>Tindakan yang Direkomendasikan:</strong><br/>
              1. Cek status rate limiter: <code>/api/admin/security/rate-limiter</code><br/>
              2. Cek status backup: <code>/api/admin/security/scheduler</code><br/>
              3. Eksekusi lockdown jika ada serangan aktif: <code>npm run lockdown</code>
            </p>
          </div>
        </div>
      </div>
    `
  })
}

// ─── Booking Notification Emails ─────────────────────────────────────────────

/**
 * Notify admin when a new booking is submitted (status PENDING).
 * Recipient: ADMIN_BOOKING_EMAIL env var (falls back to SECURITY_ALERT_EMAIL).
 */
export async function sendBookingCreatedEmail(params: {
  adminEmail: string
  requesterName: string
  eventName: string
  roomName: string
  startFormatted: string
  endFormatted: string
  dateFormatted: string
  bookingId: number | string
}): Promise<boolean> {
  const adminUrl = `${SITE_URL}/admin/bookings-new`
  return sendMail({
    to: params.adminEmail,
    subject: `📋 Pemesanan Ruangan Baru: "${params.eventName}"`,
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Pemesanan Ruangan Baru</h2>
      <p style="color: #374151;">Ada pemesanan ruangan baru yang menunggu persetujuan Anda.</p>
      <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #1e3a5f;">
          <tr><td style="padding: 6px 0; font-weight: bold; width: 140px;">Nama Acara</td><td>${esc(params.eventName)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Pemohon</td><td>${esc(params.requesterName)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Ruangan</td><td>${esc(params.roomName)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Tanggal</td><td>${esc(params.dateFormatted)}</td></tr>
          <tr><td style="padding: 6px 0; font-weight: bold;">Waktu</td><td>${esc(params.startFormatted)} – ${esc(params.endFormatted)} WIB</td></tr>
        </table>
      </div>
      <div style="text-align: center; margin: 24px 0;">
        <a href="${adminUrl}"
           style="display: inline-block; background: #882f1d; color: white; padding: 12px 28px;
                  border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 15px;">
          Tinjau &amp; Setujui Pemesanan
        </a>
      </div>
      <p style="color: #9ca3af; font-size: 12px; text-align: center;">ID Pemesanan: #${esc(String(params.bookingId))}</p>
    `)
  })
}

/**
 * Notify user that their booking has been APPROVED.
 */
export async function sendBookingApprovedEmail(params: {
  to: string
  fullName: string
  eventName: string
  roomName: string
  startFormatted: string
  endFormatted: string
  dateFormatted: string
}): Promise<boolean> {
  return sendMail({
    to: params.to,
    subject: `✅ Pemesanan Ruangan Disetujui: "${params.eventName}"`,
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${esc(params.fullName)}!</h2>
      <p style="color: #374151;">Kabar baik! Pemesanan ruangan Anda telah <strong>disetujui</strong> oleh admin paroki.</p>
      <div style="background: #dcfce7; border: 1px solid #86efac; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0 0 12px 0; color: #14532d; font-weight: bold; font-size: 15px;">✅ Pemesanan Dikonfirmasi</p>
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #14532d;">
          <tr><td style="padding: 5px 0; font-weight: bold; width: 120px;">Nama Acara</td><td>${esc(params.eventName)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Ruangan</td><td>${esc(params.roomName)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Tanggal</td><td>${esc(params.dateFormatted)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Waktu</td><td>${esc(params.startFormatted)} – ${esc(params.endFormatted)} WIB</td></tr>
        </table>
      </div>
      <p style="color: #374151; font-size: 14px;">
        Harap tiba tepat waktu dan tinggalkan ruangan dalam kondisi bersih setelah selesai.
        Untuk pembatalan, silakan hubungi sekretariat atau batalkan melalui
        <a href="${SITE_URL}/booking" style="color: #882f1d;">halaman pemesanan</a>.
      </p>
    `)
  })
}

/**
 * Notify user that their booking has been REJECTED.
 */
export async function sendBookingRejectedEmail(params: {
  to: string
  fullName: string
  eventName: string
  roomName: string
  startFormatted: string
  endFormatted: string
  dateFormatted: string
  rejectionReason?: string
}): Promise<boolean> {
  // esc() wajib: rejectionReason berasal dari input admin — cegah XSS
  const reasonHtml = params.rejectionReason
    ? `<div style="background: #fef9c3; border: 1px solid #fde047; border-radius: 6px; padding: 14px; margin: 16px 0;">
         <p style="margin: 0; color: #713f12; font-size: 14px;"><strong>Alasan:</strong> ${esc(params.rejectionReason)}</p>
       </div>`
    : ''

  return sendMail({
    to: params.to,
    subject: `❌ Pemesanan Ruangan Tidak Disetujui: "${esc(params.eventName)}"`,
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${esc(params.fullName)}!</h2>
      <p style="color: #374151;">Mohon maaf, pemesanan ruangan Anda <strong>tidak dapat disetujui</strong>.</p>
      <div style="background: #fee2e2; border: 1px solid #fca5a5; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #7f1d1d;">
          <tr><td style="padding: 5px 0; font-weight: bold; width: 120px;">Nama Acara</td><td>${esc(params.eventName)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Ruangan</td><td>${esc(params.roomName)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Tanggal</td><td>${esc(params.dateFormatted)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Waktu</td><td>${esc(params.startFormatted)} – ${esc(params.endFormatted)} WIB</td></tr>
        </table>
      </div>
      ${reasonHtml}
      <p style="color: #374151; font-size: 14px;">
        Untuk pertanyaan, hubungi sekretariat paroki atau buat pemesanan baru di
        <a href="${SITE_URL}/booking" style="color: #882f1d;">halaman pemesanan</a>.
      </p>
    `)
  })
}

/**
 * Notify user that their booking has been CANCELLED.
 */
export async function sendBookingCancelledEmail(params: {
  to: string
  fullName: string
  eventName: string
  roomName: string
  startFormatted: string
  endFormatted: string
  dateFormatted: string
  cancellationReason?: string
}): Promise<boolean> {
  // esc() wajib: cancellationReason berasal dari input user/admin — cegah XSS
  const reasonHtml = params.cancellationReason
    ? `<div style="background: #f3f4f6; border: 1px solid #e5e7eb; border-radius: 6px; padding: 14px; margin: 16px 0;">
         <p style="margin: 0; color: #374151; font-size: 14px;"><strong>Alasan Pembatalan:</strong> ${esc(params.cancellationReason)}</p>
       </div>`
    : ''

  return sendMail({
    to: params.to,
    subject: `⚠️ Pemesanan Ruangan Dibatalkan: "${esc(params.eventName)}"`,
    html: baseTemplate(`
      <h2 style="color: #1f2937;">Halo, ${esc(params.fullName)}!</h2>
      <p style="color: #374151;">Pemesanan ruangan Anda telah <strong>dibatalkan</strong>.</p>
      <div style="background: #f3f4f6; border: 1px solid #d1d5db; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <table style="width: 100%; border-collapse: collapse; font-size: 14px; color: #374151;">
          <tr><td style="padding: 5px 0; font-weight: bold; width: 120px;">Nama Acara</td><td>${esc(params.eventName)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Ruangan</td><td>${esc(params.roomName)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Tanggal</td><td>${esc(params.dateFormatted)}</td></tr>
          <tr><td style="padding: 5px 0; font-weight: bold;">Waktu</td><td>${esc(params.startFormatted)} – ${esc(params.endFormatted)} WIB</td></tr>
        </table>
      </div>
      ${reasonHtml}
      <p style="color: #374151; font-size: 14px;">
        Jika Anda memerlukan jadwal lain, silakan lakukan pemesanan kembali melalui
        <a href="${SITE_URL}/booking" style="color: #882f1d;">halaman pemesanan</a>.
      </p>
    `)
  })
}
