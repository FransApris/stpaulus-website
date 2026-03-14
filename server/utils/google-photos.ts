/**
 * Google Photos Integration Utility
 * Hybrid Storage: Local thumbnails + Google Photos full images
 */

interface GooglePhotosConfig {
    clientId: string
    clientSecret: string
    redirectUri: string
}

interface GooglePhoto {
    id: string
    baseUrl: string
    filename: string
    mimeType: string
    creationTime: string
    width: number
    height: number
}

interface GoogleAlbum {
    id: string
    title: string
    productUrl: string
    mediaItemsCount: number
    coverPhotoBaseUrl?: string
}

export class GooglePhotosService {
    private accessToken: string = ''
    private refreshToken: string = ''
    private expiresAt: Date | null = null

    constructor(
        private config: GooglePhotosConfig,
        tokens?: { accessToken: string; refreshToken: string; expiresAt?: Date }
    ) {
        if (tokens) {
            this.accessToken = tokens.accessToken
            this.refreshToken = tokens.refreshToken
            this.expiresAt = tokens.expiresAt || null
        }
    }

    /**
     * Generate OAuth URL untuk authenticate
     */
    getAuthUrl(): string {
        const params = new URLSearchParams({
            client_id: this.config.clientId,
            redirect_uri: this.config.redirectUri,
            response_type: 'code',
            scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
            access_type: 'offline',
            prompt: 'consent'
        })

        return `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`
    }

    /**
     * Exchange authorization code untuk access token
     */
    async exchangeCode(code: string): Promise<{
        accessToken: string
        refreshToken: string
        expiresIn: number
    }> {
        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                code,
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                redirect_uri: this.config.redirectUri,
                grant_type: 'authorization_code'
            })
        })

        if (!response.ok) {
            throw new Error(`Failed to exchange code: ${response.statusText}`)
        }

        const data = await response.json()

        this.accessToken = data.access_token
        this.refreshToken = data.refresh_token
        this.expiresAt = new Date(Date.now() + data.expires_in * 1000)

        return {
            accessToken: data.access_token,
            refreshToken: data.refresh_token,
            expiresIn: data.expires_in
        }
    }

    /**
     * Refresh access token
     */
    async refreshAccessToken(): Promise<string> {
        if (!this.refreshToken) {
            throw new Error('No refresh token available')
        }

        const response = await fetch('https://oauth2.googleapis.com/token', {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: new URLSearchParams({
                refresh_token: this.refreshToken,
                client_id: this.config.clientId,
                client_secret: this.config.clientSecret,
                grant_type: 'refresh_token'
            })
        })

        if (!response.ok) {
            throw new Error(`Failed to refresh token: ${response.statusText}`)
        }

        const data = await response.json()
        this.accessToken = data.access_token
        this.expiresAt = new Date(Date.now() + data.expires_in * 1000)

        return this.accessToken
    }

    /**
     * Check jika token expired dan refresh jika perlu
     */
    private async ensureValidToken(): Promise<void> {
        if (!this.expiresAt || this.expiresAt <= new Date()) {
            await this.refreshAccessToken()
        }
    }

    /**
     * List semua albums
     */
    async listAlbums(pageSize: number = 50): Promise<GoogleAlbum[]> {
        await this.ensureValidToken()

        const response = await fetch(
            `https://photoslibrary.googleapis.com/v1/albums?pageSize=${pageSize}`,
            {
                headers: {
                    Authorization: `Bearer ${this.accessToken}`
                }
            }
        )

        if (!response.ok) {
            const errorBody = await response.text()
            console.error('[Google Photos API Error]', {
                status: response.status,
                statusText: response.statusText,
                body: errorBody
            })
            throw new Error(`Failed to list albums: ${response.statusText} - ${errorBody}`)
        }

        const data = await response.json()
        return data.albums || []
    }

    /**
     * Get photos dari specific album
     */
    async getAlbumPhotos(albumId: string, pageSize: number = 100): Promise<GooglePhoto[]> {
        await this.ensureValidToken()

        const response = await fetch(
            'https://photoslibrary.googleapis.com/v1/mediaItems:search',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${this.accessToken}`,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    albumId,
                    pageSize
                })
            }
        )

        if (!response.ok) {
            throw new Error(`Failed to get album photos: ${response.statusText}`)
        }

        const data = await response.json()
        return data.mediaItems || []
    }

    /**
     * Generate URL untuk photo dengan size tertentu
     */
    getPhotoUrl(baseUrl: string, options?: {
        width?: number
        height?: number
        crop?: boolean
    }): string {
        const params: string[] = []

        if (options?.width) params.push(`w${options.width}`)
        if (options?.height) params.push(`h${options.height}`)
        if (options?.crop) params.push('c')

        return params.length > 0
            ? `${baseUrl}=${params.join('-')}`
            : baseUrl
    }

    /**
     * Get thumbnail URL (optimized untuk loading cepat)
     */
    getThumbnailUrl(baseUrl: string, size: number = 300): string {
        return this.getPhotoUrl(baseUrl, { width: size, height: size, crop: true })
    }

    /**
     * Get full HD URL
     */
    getFullUrl(baseUrl: string): string {
        return this.getPhotoUrl(baseUrl, { width: 1920, height: 1080 })
    }

    /**
     * Get current tokens (useful after refresh)
     */
    getTokens(): { accessToken: string; refreshToken: string; expiresAt: Date | null } {
        return {
            accessToken: this.accessToken,
            refreshToken: this.refreshToken,
            expiresAt: this.expiresAt
        }
    }
}

/**
 * Create Google Photos Service instance
 */
export function createGooglePhotosService(tokens?: {
    accessToken: string
    refreshToken: string
    expiresAt?: Date
}): GooglePhotosService {
    const config = useRuntimeConfig()

    return new GooglePhotosService(
        {
            clientId: config.googlePhotos?.clientId || process.env.GOOGLE_PHOTOS_CLIENT_ID || '',
            clientSecret: config.googlePhotos?.clientSecret || process.env.GOOGLE_PHOTOS_CLIENT_SECRET || '',
            redirectUri: config.googlePhotos?.redirectUri || process.env.GOOGLE_PHOTOS_REDIRECT_URI || ''
        },
        tokens
    )
}
