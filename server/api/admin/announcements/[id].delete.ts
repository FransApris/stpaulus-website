// API: Delete church announcement
// Path: DELETE /api/admin/announcements/[id]
// Permission: manage_church_announcements

import { runQuery, getQuery as getDbQuery } from '~/server/database/db'
import { requireAuth, requirePermission } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    requireAuth(event)
    requirePermission('manage_church_announcements')(event)

    try {
        const id = getRouterParam(event, 'id')
        if (!id) {
            throw createError({
                statusCode: 400,
                statusMessage: 'ID diperlukan'
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

        await runQuery('DELETE FROM church_announcements WHERE id = ?', [id])

        console.log('[Announcements API] Deleted:', id)

        return {
            success: true,
            message: 'Pengumuman berhasil dihapus'
        }
    } catch (error: any) {
        console.error('[Announcements API] Error deleting:', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || 'Failed to delete announcement'
        })
    }
})
