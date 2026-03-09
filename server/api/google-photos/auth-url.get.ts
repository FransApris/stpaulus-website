/**
 * Get Google Photos OAuth URL
 * Endpoint untuk memulai OAuth flow
 */

import { createGooglePhotosService } from '~/server/utils/google-photos'

export default defineEventHandler(async (event) => {
    try {
        const service = createGooglePhotosService()
        const authUrl = service.getAuthUrl()

        return {
            success: true,
            authUrl
        }
    } catch (error: any) {
        throw createError({
            statusCode: 500,
            statusMessage: error.message
        })
    }
})
