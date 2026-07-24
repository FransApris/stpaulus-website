import { runQuery, getQuery } from '../../../../database/db'
import { requireAuth } from '../../../../utils/auth'
import { sendAccountApprovedEmail, sendAccountRejectedEmail } from '../../../../utils/email'

export default defineEventHandler(async (event) => {
  try {
    const decoded = requireAuth(event)
    const adminId = decoded.userId

    // Only super_admin and admin_sekretariat can approve/reject
    const admin = await getQuery(
      `SELECT u.id, r.name as role_name 
       FROM users u LEFT JOIN roles r ON u.role_id = r.id 
       WHERE u.id = ?`,
      [adminId]
    ) as any

    if (!admin || !['super_admin', 'admin_sekretariat'].includes(admin.role_name)) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Hanya Super Admin dan Admin Sekretariat yang dapat menyetujui pendaftaran'
      })
    }

    const targetId = getRouterParam(event, 'id')
    const body = await readBody(event)
    const { action } = body // 'approve' | 'reject'

    if (!['approve', 'reject'].includes(action)) {
      throw createError({ statusCode: 400, statusMessage: 'Action harus "approve" atau "reject"' })
    }

    const targetUser = await getQuery(
      'SELECT id, username, email, full_name, account_status, role_id FROM users WHERE id = ?',
      [targetId]
    ) as any

    if (!targetUser) {
      throw createError({ statusCode: 404, statusMessage: 'Pengguna tidak ditemukan' })
    }

    // Admin sekretariat cannot approve/reject other admins
    if (targetUser.role_id && targetUser.role_id > 0) {
      throw createError({
        statusCode: 403,
        statusMessage: 'Admin sekretariat tidak dapat mengelola akun admin'
      })
    }

    const newStatus = action === 'approve' ? 'ACTIVE' : 'INACTIVE'
    await runQuery(
      'UPDATE users SET account_status = ? WHERE id = ?',
      [newStatus, targetId]
    )

    console.log(`[User Approval] User ${targetUser.username} ${action}d by admin ${adminId}`)

    // Kirim notifikasi email (non-blocking — kegagalan email tidak membatalkan proses approval)
    if (targetUser.email) {
      const emailParams = {
        to: targetUser.email,
        username: targetUser.username,
        fullName: targetUser.full_name || targetUser.username
      }
      if (action === 'approve') {
        sendAccountApprovedEmail(emailParams).catch((err) => {
          console.error('[User Approval] Failed to send approval email to:', targetUser.email, err?.message || err)
        })
      } else {
        sendAccountRejectedEmail(emailParams).catch((err) => {
          console.error('[User Approval] Failed to send rejection email to:', targetUser.email, err?.message || err)
        })
      }
    }

    return {
      success: true,
      message: action === 'approve'
        ? `Akun ${targetUser.username} berhasil disetujui`
        : `Akun ${targetUser.username} berhasil ditolak`
    }
  } catch (error: any) {
    console.error('[User Approval] Error:', error)
    throw error
  }
})
