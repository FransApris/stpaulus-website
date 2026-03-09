// API: Create new church announcement
// Path: POST /api/admin/announcements
// Permission: manage_church_announcements

import { runQuery } from '~/server/database/db'
import { requireAuth, requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    const decoded = requireAuth(event)
    requirePermission('manage_church_announcements')(event)

    try {
        const body = await readBody(event)
        const { title, description, activity_type, thumbnail, event_date, event_time, is_active, display_order } = body

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

        const result = await runQuery(
            `INSERT INTO church_announcements 
       (title, description, activity_type, thumbnail, event_date, event_time, is_active, display_order, created_by, updated_by)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                title,
                description || null,
                activity_type || 'Kegiatan',
                thumbnail || null,
                event_date,
                event_time,
                is_active !== false ? 1 : 0,
                display_order || 0,
                decoded.userId,
                decoded.userId
            ]
        )

        const insertId = (result as any).insertId

        // Fetch created announcement
        const created = await runQuery(
            'SELECT * FROM church_announcements WHERE id = ?',
            [insertId]
        ) as any[]

        console.log('[Announcements API] Created:', insertId)

        return {
            success: true,
            message: 'Pengumuman berhasil ditambahkan',
            data: created[0]
        }
    } catch (error: any) {
        console.error('[Announcements API] Error creating:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to create announcement'
        })
    }
})
