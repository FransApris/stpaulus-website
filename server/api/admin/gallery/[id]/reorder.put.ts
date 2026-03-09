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

    const albumId = getRouterParam(event, 'id')
    if (!albumId) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Album ID is required'
      })
    }

    const body = await readBody(event)
    const { photoIds } = body

    if (!Array.isArray(photoIds)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'photoIds must be an array'
      })
    }

    const albumPath = join(process.cwd(), 'public', 'images', 'album', albumId)
    const metaPath = join(albumPath, 'meta.json')

    // Read current meta
    let meta: AlbumMeta
    try {
      const metaContent = await readFile(metaPath, 'utf-8')
      meta = JSON.parse(metaContent)
    } catch (error) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Album not found'
      })
    }

    // Validate that all photoIds exist in the album
    const existingPhotoIds = meta.photos.map(p => p.filename)
    const invalidIds = photoIds.filter(id => !existingPhotoIds.includes(id))

    if (invalidIds.length > 0) {
      throw createError({
        statusCode: 400,
        statusMessage: `Invalid photo IDs: ${invalidIds.join(', ')}`
      })
    }

    // Reorder photos according to the new order
    const reorderedPhotos: PhotoMeta[] = photoIds.map((photoId, index) => {
      const existingPhoto = meta.photos.find(p => p.filename === photoId)!
      return {
        ...existingPhoto,
        order: index
      }
    })

    meta.photos = reorderedPhotos

    // Save updated meta
    await writeFile(metaPath, JSON.stringify(meta, null, 2))

    return {
      success: true,
      message: 'Photo order updated successfully',
      photos: reorderedPhotos.map(photo => ({
        id: photo.filename,
        filename: photo.filename,
        url: `/images/album/${albumId}/${photo.filename}`,
        title: photo.title,
        alt: photo.alt,
        description: photo.description,
        order: photo.order
      }))
    }
  } catch (error: any) {
    console.error('Error reordering photos:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Internal server error'
    })
  }
})
