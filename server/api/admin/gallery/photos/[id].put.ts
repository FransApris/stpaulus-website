import { writeFile, readFile } from 'fs/promises'
import { join } from 'path'
import { requireAuth } from '~/server/utils/auth'

interface PhotoMeta {
  filename: string
  title: string
  alt: string
  description: string
  order: number
}

interface AlbumMeta {
  photos: PhotoMeta[]
}

export default defineEventHandler(async (event) => {
  try {
    // Check authentication using JWT
    requireAuth(event)

    const photoId = getRouterParam(event, 'id')
    if (!photoId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Photo ID is required'
      })
    }

    const body = await readBody(event)
    const { title, alt, description } = body

    // Find album containing this photo
    const albumsDir = join(process.cwd(), 'public', 'images', 'album')
    const { readdir } = await import('fs/promises')

    let albumId = null
    let metaPath = null

    try {
      const albums = await readdir(albumsDir)
      for (const album of albums) {
        const albumPath = join(albumsDir, album)
        const metaFile = join(albumPath, 'meta.json')

        try {
          const metaContent = await readFile(metaFile, 'utf-8')
          const meta: AlbumMeta = JSON.parse(metaContent)

          const photoExists = meta.photos.some(p => p.filename === photoId)
          if (photoExists) {
            albumId = album
            metaPath = metaFile
            break
          }
        } catch (error) {
          // Continue to next album
        }
      }
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Photo not found'
      })
    }

    if (!albumId || !metaPath) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Photo not found'
      })
    }

    // Update photo metadata
    const metaContent = await readFile(metaPath, 'utf-8')
    const meta: AlbumMeta = JSON.parse(metaContent)

    const photoIndex = meta.photos.findIndex(p => p.filename === photoId)
    if (photoIndex === -1) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Photo not found'
      })
    }

    // Update photo metadata
    const existingPhoto = meta.photos[photoIndex]!
    meta.photos[photoIndex] = {
      filename: existingPhoto.filename,
      title: title || existingPhoto.title || '',
      alt: alt || existingPhoto.alt || '',
      description: description || existingPhoto.description || '',
      order: existingPhoto.order
    }

    // Save updated meta
    await writeFile(metaPath, JSON.stringify(meta, null, 2))

    const updatedPhoto = meta.photos[photoIndex]
    return {
      success: true,
      photo: {
        id: photoId,
        filename: updatedPhoto.filename,
        url: `/images/album/${albumId}/${photoId}`,
        title: updatedPhoto.title,
        alt: updatedPhoto.alt,
        description: updatedPhoto.description,
        order: updatedPhoto.order
      }
    }
  } catch (error: any) {
    console.error('Error updating photo:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
