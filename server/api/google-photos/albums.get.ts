/**
 * List Google Photos Albums
 * Retrieve albums dari Google Photos account
 */

import { createGooglePhotosService } from '~/server/utils/google-photos'
import { executeQuery } from '~/server/database/db'
import type { RowDataPacket } from 'mysql2'

export default defineEventHandler(async (event) => {
    try {
        // Get stored tokens dari database
        const userEmail = process.env.GOOGLE_PHOTOS_USER_EMAIL || 'pubdok.stpaulusjuanda@gmail.com'

        const rows = await executeQuery(
            'SELECT access_token, refresh_token, expires_at FROM google_photos_tokens WHERE user_email = ? LIMIT 1',
            [userEmail]
        ) as RowDataPacket[]

        if (!rows || rows.length === 0) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Google Photos not connected. Please authenticate first.'
            })
        }

        const tokenData = rows[0]
        
        if (!tokenData) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Invalid token data'
            })
        }
        
        const service = createGooglePhotosService({
            accessToken: tokenData.access_token,
            refreshToken: tokenData.refresh_token,
            expiresAt: tokenData.expires_at
        })

        // Get albums dari Google Photos
        const albums = await service.listAlbums()

        // Check if token was refreshed and update database
        const currentTokens = service.getTokens()
        if (currentTokens.accessToken !== tokenData.access_token) {
            console.log('[Google Photos] Token refreshed, updating database')
            await executeQuery(
                `UPDATE google_photos_tokens 
         SET access_token = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE user_email = ?`,
                [currentTokens.accessToken, currentTokens.expiresAt, userEmail]
            )
        }

        return {
            success: true,
            count: albums.length,
            albums: albums.map(album => ({
                id: album.id,
                title: album.title,
                mediaItemsCount: album.mediaItemsCount,
                coverPhotoUrl: album.coverPhotoBaseUrl
                    ? service.getThumbnailUrl(album.coverPhotoBaseUrl, 400)
                    : null,
                productUrl: album.productUrl
            }))
        }
    } catch (error: any) {
        console.error('[Google Photos List Albums Error]', error)
        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message
        })
    }
})
