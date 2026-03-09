/**
 * API Endpoint: Get Google Photos Sync Logs
 * Returns history of sync operations
 */

import { executeQuery } from '~/server/database/db'
import type { RowDataPacket } from 'mysql2'

export default defineEventHandler(async (event) => {
    try {
        const rows = await executeQuery(
            `SELECT 
        l.id,
        l.album_id,
        l.sync_type,
        l.photos_added,
        l.photos_updated,
        l.status,
        l.error_message,
        l.synced_at,
        a.title as albumTitle
       FROM google_photos_sync_logs l
       LEFT JOIN gallery_albums a ON l.album_id = a.id
       ORDER BY l.synced_at DESC
       LIMIT 50`
        ) as RowDataPacket[]

        return rows || []
    } catch (error: any) {
        console.error('[Sync Logs Error]', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})
