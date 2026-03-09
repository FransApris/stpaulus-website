/**
 * Google Photos OAuth Callback
 * Handle OAuth callback dan simpan tokens ke database
 */

import { createGooglePhotosService } from '~/server/utils/google-photos'
import { executeQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const query = getQuery(event)
        const code = query.code as string

        if (!code) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Authorization code is required'
            })
        }

        // Exchange code untuk tokens
        const service = createGooglePhotosService()
        const tokens = await service.exchangeCode(code)

        // Simpan tokens ke database
        // Note: Dalam production, simpan dengan user authentication
        const userEmail = process.env.GOOGLE_PHOTOS_USER_EMAIL || 'pubdok.stpaulusjuanda@gmail.com'

        await executeQuery(
            `INSERT INTO google_photos_tokens (user_email, access_token, refresh_token, expires_at)
       VALUES (?, ?, ?, ?)
       ON DUPLICATE KEY UPDATE
         access_token = VALUES(access_token),
         refresh_token = VALUES(refresh_token),
         expires_at = VALUES(expires_at),
         updated_at = CURRENT_TIMESTAMP`,
            [
                userEmail,
                tokens.accessToken,
                tokens.refreshToken,
                new Date(Date.now() + tokens.expiresIn * 1000)
            ]
        )

        // Redirect back to the admin gallery page with success message
        return await sendRedirect(event, '/admin/gallery?success=true', 302)
    } catch (error: any) {
        console.error('[Google Photos Callback Error]', error)
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})
