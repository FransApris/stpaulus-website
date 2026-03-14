import { runQuery } from '../../../database/db'
import { requirePermission } from '../../../utils/auth'
import { promises as fs } from 'fs'
import * as path from 'path'
import { getUploadsPath } from '../../../utils/paths'
import { isCloudinaryEnabled, uploadToCloudinary } from '../../../utils/cloudinary'

const normalizeImagePath = (imagePath: string) => {
  const cleaned = imagePath.trim().replace(/\\/g, '/')
  if (!cleaned) {
    return ''
  }
  if (/^https?:\/\//i.test(cleaned) || cleaned.startsWith('//')) {
    return cleaned
  }
  return cleaned.startsWith('/') ? cleaned : `/${cleaned}`
}

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_hero_themes')(event)

  const body = await readMultipartFormData(event)

  if (!body) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No form data provided'
    })
  }

  // Extract form fields
  const name = body.find(item => item.name === 'name')?.data?.toString()?.trim()
  const imageFile = body.find(item => item.name === 'image')

  if (!name || !imageFile) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name and image are required'
    })
  }

  // Validate name length
  if (name.length < 2 || name.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name must be between 2 and 100 characters'
    })
  }

  // Validate image type
  const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
  if (!allowedTypes.includes(imageFile.type || '')) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid image type. Only JPEG, PNG, and WebP are allowed'
    })
  }

  // Validate image size (max 5MB)
  const maxSize = 5 * 1024 * 1024 // 5MB
  if (imageFile.data.length > maxSize) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Image size too large. Maximum size is 5MB'
    })
  }

  // Generate unique filename
  const extension = path.extname(imageFile.filename || 'image.jpg')
  const filename = `hero-theme-${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`

  let imagePath: string
  let localFilePath: string | null = null

  try {
    if (isCloudinaryEnabled()) {
      console.log('[Hero Theme Create] Uploading to Cloudinary...')
      const cloudinaryUrl = await uploadToCloudinary(
        Buffer.from(imageFile.data),
        'hero-themes',
        imageFile.filename || filename
      )
      imagePath = cloudinaryUrl
      console.log('[Hero Theme Create] Cloudinary success:', cloudinaryUrl)
    } else {
      console.log('[Hero Theme Create] Cloudinary not configured, saving to local storage...')
      const uploadDir = getUploadsPath('hero-themes')
      await fs.mkdir(uploadDir, { recursive: true })
      localFilePath = path.join(uploadDir, filename)
      await fs.writeFile(localFilePath, imageFile.data)
      imagePath = normalizeImagePath(`/uploads/hero-themes/${filename}`)
    }

    // Insert theme into database
    const result = await runQuery(`
      INSERT INTO hero_themes (name, image_path, is_active)
      VALUES (?, ?, ?)
    `, [name, imagePath, 0]) as any

    return {
      success: true,
      message: 'Theme created successfully',
      data: {
        id: result.insertId,
        name,
        image_path: imagePath,
        is_active: false
      }
    }
  } catch (error) {
    console.error('Error creating theme:', error)

    // Clean up uploaded local file if database insert failed
    if (localFilePath) {
      try {
        await fs.unlink(localFilePath)
      } catch (cleanupError) {
        console.error('Error cleaning up file:', cleanupError)
      }
    }

    // Check for specific database errors (MySQL duplicate entry)
    if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string' && ((error as any).message.includes('UNIQUE constraint failed') || (error as any).message.includes('Duplicate entry'))) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A theme with this name already exists'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to create theme'
    })
  }
})
