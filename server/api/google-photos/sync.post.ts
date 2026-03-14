/**
 * Sync Google Photos Album to Local Database
 * Download metadata dan simpan ke database lokal
 * Hybrid: Thumbnail lokal + Full image dari Google Photos
 */

import { createGooglePhotosService } from '~/server/utils/google-photos'
import { executeQuery } from '~/server/database/db'
import type { RowDataPacket, ResultSetHeader } from 'mysql2'
import { writeFile, mkdir } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
    const body = await readBody(event)
    const { googleAlbumId, albumId, downloadThumbnails = true } = body

    try {
        if (!googleAlbumId) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Google Album ID is required'
            })
        }

        // Get stored tokens
        const userEmail = process.env.GOOGLE_PHOTOS_USER_EMAIL || 'pubdok.stpaulusjuanda@gmail.com'
        const tokenRows = await executeQuery(
            'SELECT access_token, refresh_token, expires_at FROM google_photos_tokens WHERE user_email = ? LIMIT 1',
            [userEmail]
        ) as RowDataPacket[]

        if (!tokenRows || tokenRows.length === 0) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Google Photos not connected'
            })
        }

        const tokenData = tokenRows[0]
        
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

        // Get photos dari Google Photos
        const photos = await service.getAlbumPhotos(googleAlbumId)

        // Check if token was refreshed and update database
        const currentTokens = service.getTokens()
        if (currentTokens.accessToken !== tokenData.access_token) {
            console.log('[Google Photos Sync] Token refreshed, updating database')
            await executeQuery(
                `UPDATE google_photos_tokens 
         SET access_token = ?, expires_at = ?, updated_at = CURRENT_TIMESTAMP 
         WHERE user_email = ?`,
                [currentTokens.accessToken, currentTokens.expiresAt, userEmail]
            )
        }

        if (!photos || photos.length === 0) {
            return {
                success: true,
                message: 'No photos found in album',
                photosAdded: 0,
                photosUpdated: 0
            }
        }

        let photosAdded = 0
        let photosUpdated = 0

        // Create upload directory untuk thumbnails
        const thumbnailDir = join('public/uploads/gallery/thumbnails')
        await mkdir(thumbnailDir, { recursive: true })

        // Process setiap photo
        for (const photo of photos) {
            try {
                // Check if photo already exists
                const existing = await executeQuery(
                    'SELECT id FROM gallery_photos WHERE google_photo_id = ? LIMIT 1',
                    [photo.id]
                ) as RowDataPacket[]

                const thumbnailUrl = service.getThumbnailUrl(photo.baseUrl, 400)
                const fullUrl = service.getFullUrl(photo.baseUrl)

                let localThumbnailPath: string | null = null

                // Download thumbnail ke server lokal (optional)
                if (downloadThumbnails) {
                    try {
                        const thumbnailResponse = await fetch(thumbnailUrl)
                        if (thumbnailResponse.ok) {
                            const buffer = await thumbnailResponse.arrayBuffer()
                            const filename = `google_${photo.id}.jpg`
                            localThumbnailPath = `/uploads/gallery/thumbnails/${filename}`

                            await writeFile(
                                join(thumbnailDir, filename),
                                Buffer.from(buffer)
                            )
                        }
                    } catch (downloadError) {
                        console.warn(`Failed to download thumbnail for ${photo.id}:`, downloadError)
                        // Continue tanpa thumbnail lokal
                    }
                }

                if (existing && existing.length > 0) {
                    // Update existing photo
                    await executeQuery(
                        `UPDATE gallery_photos 
             SET google_url = ?,
                 thumbnail_url = ?,
                 path = ?,
                 mime_type = ?,
                 last_synced_at = CURRENT_TIMESTAMP
             WHERE google_photo_id = ?`,
                        [
                            fullUrl,
                            thumbnailUrl,
                            localThumbnailPath || thumbnailUrl,
                            photo.mimeType,
                            photo.id
                        ]
                    )
                    photosUpdated++
                } else {
                    // Insert new photo
                    const result = await executeQuery(
                        `INSERT INTO gallery_photos 
             (album_id, filename, original_filename, path, google_photo_id, 
              google_album_id, source_type, google_url, thumbnail_url, 
              mime_type, last_synced_at, created_at)
             VALUES (?, ?, ?, ?, ?, ?, 'hybrid', ?, ?, ?, CURRENT_TIMESTAMP, ?)`,
                        [
                            albumId,
                            `google_${photo.id}.jpg`,
                            photo.filename,
                            localThumbnailPath || thumbnailUrl,
                            photo.id,
                            googleAlbumId,
                            fullUrl,
                            thumbnailUrl,
                            photo.mimeType,
                            photo.creationTime
                        ]
                    ) as ResultSetHeader
                    photosAdded++
                }
            } catch (photoError) {
                console.error(`Error processing photo ${photo.id}:`, photoError)
                // Continue dengan photo berikutnya
            }
        }

        // Update album dengan Google Photos info
        if (albumId) {
            await executeQuery(
                `UPDATE gallery_albums 
         SET google_album_id = ?,
             last_synced_at = CURRENT_TIMESTAMP
         WHERE id = ?`,
                [googleAlbumId, albumId]
            )
        }

        // Log sync activity
        await executeQuery(
            `INSERT INTO google_photos_sync_logs 
       (album_id, sync_type, photos_added, photos_updated, status, synced_at)
       VALUES (?, 'manual', ?, ?, 'success', CURRENT_TIMESTAMP)`,
            [albumId, photosAdded, photosUpdated]
        )

        return {
            success: true,
            message: 'Photos synced successfully',
            photosAdded,
            photosUpdated,
            totalPhotos: photos.length
        }
    } catch (error: any) {
        console.error('[Google Photos Sync Error]', error)

        // Log error jika album_id tersedia
        if (albumId) {
            try {
                await executeQuery(
                    `INSERT INTO google_photos_sync_logs 
           (album_id, sync_type, status, error_message, synced_at)
           VALUES (?, 'manual', 'failed', ?, CURRENT_TIMESTAMP)`,
                    [albumId, error.message]
                )
            } catch (logError) {
                console.error('Failed to log sync error:', logError)
            }
        }

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.message
        })
    }
})
