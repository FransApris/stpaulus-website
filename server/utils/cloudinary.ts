import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME
const apiKey = process.env.CLOUDINARY_API_KEY
const apiSecret = process.env.CLOUDINARY_API_SECRET

// Check if Cloudinary is configured
export const isCloudinaryEnabled = () => {
  return !!(cloudName && apiKey && apiSecret)
}

// Initialize Cloudinary if configured
if (isCloudinaryEnabled()) {
  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  })
  console.log('[Cloudinary] ✓ Configured with cloud:', cloudName)
} else {
  console.log('[Cloudinary] ⚠ Not configured - using local storage fallback')
}

/**
 * Upload image to Cloudinary
 * @param buffer - Image buffer
 * @param folder - Cloudinary folder (e.g., 'articles', 'gallery', 'pastors')
 * @param filename - Original filename for metadata
 * @returns Cloudinary URL
 */
export const uploadToCloudinary = (buffer: Buffer, folder: string = 'uploads', filename?: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    if (!isCloudinaryEnabled()) {
      reject(new Error('Cloudinary is not configured'))
      return
    }

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: `stpaulus/${folder}`,
        resource_type: 'auto',
        use_filename: true,
        unique_filename: true,
        overwrite: false,
        // Optimize images
        transformation: [
          { quality: 'auto:good' },
          { fetch_format: 'auto' }
        ]
      },
      (error, result) => {
        if (error) {
          console.error('[Cloudinary] Upload error:', error)
          reject(error)
        } else if (result) {
          console.log('[Cloudinary] Upload success:', result.secure_url)
          resolve(result.secure_url)
        } else {
          reject(new Error('Upload failed - no result'))
        }
      }
    )

    uploadStream.end(buffer)
  })
}

/**
 * Delete image from Cloudinary
 * @param publicId - Cloudinary public ID
 */
export const deleteFromCloudinary = async (publicId: string): Promise<void> => {
  if (!isCloudinaryEnabled()) {
    throw new Error('Cloudinary is not configured')
  }

  try {
    await cloudinary.uploader.destroy(publicId)
    console.log('[Cloudinary] Deleted:', publicId)
  } catch (error) {
    console.error('[Cloudinary] Delete error:', error)
    throw error
  }
}

export default cloudinary
