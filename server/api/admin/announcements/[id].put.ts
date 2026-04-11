// API: Update church announcement
// Path: PUT /api/admin/announcements/[id]
// Permission: manage_church_announcements

import { runQuery, getQuery as getDbQuery } from '~/server/database/db'
import { requireAuth, requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const decoded = requireAuth(event)
    requirePermission('manage_church_announcements')(event)

    try {
        const id = getRouterParam(event, 'id')
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID diperlukan'
            })
        }

        const body = await readBody(event)
        const { title, description, activity_type, thumbnail, event_date, event_time, is_active, display_order, agenda_id } = body

        // Validation
        if (!title || !event_date || !event_time) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Judul, tanggal, dan jam harus diisi'
            })
        }

        // Validate activity_type
        if (activity_type && !['Kegiatan', 'Sakramen'].includes(activity_type)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Jenis kegiatan harus "Kegiatan" atau "Sakramen"'
            })
        }

        // Check if exists
        const existing = await getDbQuery('SELECT id FROM church_announcements WHERE id = ?', [id])
        if (!existing) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Pengumuman tidak ditemukan'
            })
        }

        await runQuery(
            `UPDATE church_announcements 
       SET title = ?, description = ?, activity_type = ?, thumbnail = ?, event_date = ?, event_time = ?, 
           is_active = ?, display_order = ?, agenda_id = ?, updated_by = ?
       WHERE id = ?`,
            [
                title,
                description || null,
                activity_type || 'Kegiatan',
                thumbnail || null,
                event_date,
                event_time,
                is_active !== false ? 1 : 0,
                display_order || 0,
                agenda_id || null,
                decoded.userId,
                id
            ]
        )

        // Fetch updated announcement
        const updated = await runQuery(
            'SELECT * FROM church_announcements WHERE id = ?',
            [id]
        ) as any[]

        console.log('[Announcements API] Updated:', id)

        return {
            success: true,
            message: 'Pengumuman berhasil diupdate',
            data: updated[0]
        }
    } catch (error: any) {
        console.error('[Announcements API] Error updating:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to update announcement'
        })
    }
})
