/**
 * server/middleware/03.cacheControl.ts
 *
 * Cache-Control middleware for static assets (images, fonts, uploads).
 * Sets browser caching headers (immutable / max-age) for maximum performance score.
 */
export default defineEventHandler((event) => {
  const path = event.path || ''

  // Cache static image assets & uploads for 1 year
  if (
    path.startsWith('/images/') ||
    path.startsWith('/uploads/') ||
    path.endsWith('.png') ||
    path.endsWith('.jpg') ||
    path.endsWith('.jpeg') ||
    path.endsWith('.webp') ||
    path.endsWith('.svg') ||
    path.endsWith('.ico')
  ) {
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  }

  // Cache static font files for 1 year
  if (
    path.includes('/fonts') ||
    path.endsWith('.woff2') ||
    path.endsWith('.woff') ||
    path.endsWith('.ttf')
  ) {
    setHeader(event, 'Cache-Control', 'public, max-age=31536000, immutable')
  }
})
