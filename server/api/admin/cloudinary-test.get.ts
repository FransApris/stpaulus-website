/**
 * GET /api/admin/cloudinary-test?doc_id=14
 * Admin-only endpoint to diagnose Cloudinary access for a specific document.
 * Returns JSON with full diagnostic info — does NOT stream the file.
 */
import { defineEventHandler, createError, getQuery as h3GetQuery } from 'h3'
import { getQuery as dbGetQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'
import { v2 as cloudinary } from 'cloudinary'

const CLOUDINARY_CONFIGURED = !!(
  process.env.CLOUDINARY_CLOUD_NAME &&
  process.env.CLOUDINARY_API_KEY &&
  process.env.CLOUDINARY_API_SECRET
)
if (CLOUDINARY_CONFIGURED) {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure: true
  })
}

export default defineEventHandler(async (event) => {
  requireAuth(event)
  const user = event.context.auth
  if (!user || !['super_admin', 'admin_sekretariat'].includes(user.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Forbidden' })
  }

  const query = h3GetQuery(event)
  const docId = query.doc_id as string
  if (!docId) {
    throw createError({ statusCode: 400, statusMessage: 'doc_id query param required' })
  }

  const doc = await dbGetQuery(`SELECT id, file_path, original_filename FROM documents WHERE id = ?`, [docId])
  if (!doc) {
    return { error: 'Document not found in DB', doc_id: docId }
  }

  const storedUrl = doc.file_path as string
  const result: Record<string, any> = {
    doc_id: docId,
    original_filename: doc.original_filename,
    stored_url: storedUrl,
    cloudinary_configured: CLOUDINARY_CONFIGURED,
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key_set: !!process.env.CLOUDINARY_API_KEY,
    api_secret_set: !!process.env.CLOUDINARY_API_SECRET
  }

  if (!storedUrl.startsWith('http')) {
    return { ...result, note: 'Not a cloud URL — stored locally' }
  }

  // Parse URL
  let pathname: string
  try { pathname = new URL(storedUrl).pathname } catch { return { ...result, error: 'Invalid URL' } }

  const parts = pathname.split('/').filter(Boolean)
  result.url_parts = parts
  // parts: [cloud, resource_type, delivery_type, version?, ...publicId]
  if (parts.length < 3) return { ...result, error: 'URL too short' }

  const deliveryType = parts[2]
  const rest = parts.slice(3)
  let version: number | undefined
  let publicIdParts = rest
  if (rest[0] && /^v\d+$/.test(rest[0])) {
    version = parseInt(rest[0].substring(1))
    publicIdParts = rest.slice(1)
  }
  const publicId = publicIdParts.join('/')

  result.parsed = { deliveryType, version, publicId }

  // Test 1: direct fetch
  try {
    const r1 = await fetch(storedUrl)
    result.direct_fetch = { status: r1.status, ok: r1.ok }
    if (!r1.ok) result.direct_fetch.body = (await r1.text()).substring(0, 300)
  } catch (e: any) {
    result.direct_fetch = { error: e.message }
  }

  if (!CLOUDINARY_CONFIGURED) return result

  // Test 2: signed URL fetch (with version)
  try {
    const signedUrl = cloudinary.url(publicId, {
      resource_type: 'raw',
      type: deliveryType as any,
      sign_url: true,
      secure: true,
      ...(version ? { version } : {})
    })
    result.signed_url = signedUrl
    const r2 = await fetch(signedUrl)
    result.signed_fetch = { status: r2.status, ok: r2.ok }
    if (!r2.ok) result.signed_fetch.body = (await r2.text()).substring(0, 300)
  } catch (e: any) {
    result.signed_url_error = e.message
  }

  // Test 3: Cloudinary Admin API resource info
  try {
    const info = await cloudinary.api.resource(publicId, {
      resource_type: 'raw',
      type: deliveryType as any
    })
    result.admin_api_resource = {
      public_id: info.public_id,
      type: info.type,
      access_mode: info.access_mode,
      secure_url: info.secure_url,
      bytes: info.bytes
    }
  } catch (e: any) {
    result.admin_api_error = e.message || String(e)
  }

  return result
})
