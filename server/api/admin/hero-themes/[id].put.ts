import { runQuery, getQuery } from '../../../database/db'
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

const toPublicFilePath = (imagePath: string) => {
  const relativePath = imagePath.replace(/^\/+/, '').replace(/\\/g, '/')
  return path.join(process.cwd(), 'public', ...relativePath.split('/'))
}

export default defineEventHandler(async (event) => {
  // Check permissions using RBAC
  requirePermission('manage_hero_themes')(event)

  const id = parseInt(event.context.params?.id || '0')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid theme ID'
    })
  }

  const contentType = getHeader(event, 'content-type') || ''
  let name = ''
  let imageFile: { filename?: string, type?: string, data: Buffer } | undefined

  if (contentType.includes('multipart/form-data')) {
    const formData = await readMultipartFormData(event)
    if (!formData) {
      throw createError({
        statusCode: 400,
        statusMessage: 'No form data provided'
      })
    }

    name = formData.find(item => item.name === 'name')?.data?.toString()?.trim() || ''
    const uploadedImage = formData.find(item => item.name === 'image')
    if (uploadedImage?.data) {
      imageFile = {
        filename: uploadedImage.filename,
        type: uploadedImage.type,
        data: uploadedImage.data
      }
    }
  } else {
    const body = await readBody(event)
    name = typeof body?.name === 'string' ? body.name.trim() : ''
  }

  if (!name || name.length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name is required'
    })
  }

  if (name.length < 2 || name.length > 100) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Name must be between 2 and 100 characters'
    })
  }

  if (imageFile) {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(imageFile.type || '')) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Invalid image type. Only JPEG, PNG, and WebP are allowed'
      })
    }

    const maxSize = 5 * 1024 * 1024
    if (imageFile.data.length > maxSize) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Image size too large. Maximum size is 5MB'
      })
    }
  }

  // Check if theme exists
  const existingTheme = await getQuery(`
    SELECT id, image_path FROM hero_themes WHERE id = ?
  `, [id]) as { id: number, image_path: string | null } | undefined

  if (!existingTheme) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Theme not found'
    })
  }

  let nextImagePath: string | null = existingTheme.image_path
  let uploadedFilePath: string | null = null

  if (imageFile) {
    const extension = path.extname(imageFile.filename || 'image.jpg')
    const filename = `hero-theme-${Date.now()}-${Math.random().toString(36).substring(2)}${extension}`

    try {
      if (isCloudinaryEnabled()) {
        console.log('[Hero Theme Update] Uploading to Cloudinary...')
        const cloudinaryUrl = await uploadToCloudinary(
          Buffer.from(imageFile.data),
          'hero-themes',
          imageFile.filename || filename
        )
        nextImagePath = cloudinaryUrl
        console.log('[Hero Theme Update] Cloudinary success:', cloudinaryUrl)
      } else {
        console.log('[Hero Theme Update] Cloudinary not configured, saving to local storage...')
        const uploadDir = getUploadsPath('hero-themes')
        uploadedFilePath = path.join(uploadDir, filename)
        nextImagePath = normalizeImagePath(`/uploads/hero-themes/${filename}`)
        await fs.mkdir(uploadDir, { recursive: true })
        await fs.writeFile(uploadedFilePath, imageFile.data)
      }
    } catch (error) {
      console.error('Error saving new theme image:', error)
      throw createError({
        statusCode: 500,
        statusMessage: 'Failed to save uploaded image'
      })
    }
  }

  try {
    if (nextImagePath) {
      await runQuery(`
        UPDATE hero_themes
        SET name = ?, image_path = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, nextImagePath, id])
    } else {
      await runQuery(`
        UPDATE hero_themes
        SET name = ?, updated_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `, [name, id])
    }

    // Cleanup old local image only when replacement succeeded (skip for Cloudinary URLs).
    if (imageFile && existingTheme.image_path && existingTheme.image_path !== nextImagePath) {
      const oldPath = normalizeImagePath(existingTheme.image_path)
      if (oldPath.startsWith('/uploads/hero-themes/') || oldPath.startsWith('/images/themes/')) {
        try {
          await fs.unlink(toPublicFilePath(oldPath))
        } catch {
          // Ignore cleanup failure, DB update already succeeded.
        }
      }
    }

    return {
      success: true,
      message: 'Theme updated successfully'
    }
  } catch (error) {
    if (uploadedFilePath) {
      try {
        await fs.unlink(uploadedFilePath)
      } catch {
        // Ignore cleanup failure.
      }
    }

    console.error('Error updating theme:', error)

    if (error && typeof error === 'object' && 'message' in error && typeof (error as any).message === 'string' && ((error as any).message.includes('UNIQUE constraint failed') || (error as any).message.includes('Duplicate entry'))) {
      throw createError({
        statusCode: 409,
        statusMessage: 'A theme with this name already exists'
      })
    }

    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to update theme'
    })
  }
})
