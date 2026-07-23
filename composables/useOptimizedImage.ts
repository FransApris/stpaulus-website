/**
 * composables/useOptimizedImage.ts
 *
 * Cloudinary & Static Image Optimization Helper.
 * Automatically injects Cloudinary transformations (f_auto, q_auto, w_800, c_limit)
 * to deliver auto WebP/AVIF compressed images.
 * Eliminates "Improve image delivery" Lighthouse penalties.
 */
export const useOptimizedImage = () => {
  /**
   * Transforms image URLs with auto-format and auto-quality parameters.
   *
   * @param url - Raw image URL or Cloudinary path
   * @param width - Max width constraint (default 800px)
   */
  const optimizeImageUrl = (url?: string, width = 800): string => {
    if (!url || typeof url !== 'string') return ''

    // Inject Cloudinary f_auto,q_auto,w_800 transformation
    if (url.includes('res.cloudinary.com') && url.includes('/upload/')) {
      if (!url.includes('f_auto') && !url.includes('q_auto')) {
        return url.replace('/upload/', `/upload/f_auto,q_auto,w_${width},c_limit/`)
      }
    }

    return url
  }

  return {
    optimizeImageUrl
  }
}
