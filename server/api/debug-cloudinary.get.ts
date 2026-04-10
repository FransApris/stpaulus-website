/**
 * GET /api/admin/test-cloudinary
 * Debug endpoint — cek apakah Cloudinary credentials benar dan server bisa fetch dokumen.
 * Akses via browser: https://stpaulusjuanda.org/api/admin/test-cloudinary?doc_id=16
 */
import { defineEventHandler, getQuery } from 'h3'
import { v2 as cloudinary } from 'cloudinary'
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const docId = query.doc_id as string

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME
  const apiKey = process.env.CLOUDINARY_API_KEY
  const apiSecret = process.env.CLOUDINARY_API_SECRET

  const configured = !!(cloudName && apiKey && apiSecret)

  const result: Record<string, any> = {
    cloudinary_configured: configured,
    cloud_name: cloudName || '❌ NOT SET',
    api_key: apiKey ? `✅ SET (${apiKey.substring(0, 4)}...)` : '❌ NOT SET',
    api_secret: apiSecret ? `✅ SET (length: ${apiSecret.length})` : '❌ NOT SET',
  }

  if (!configured) {
    return { ...result, error: 'Credentials not set in Railway environment variables' }
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
    secure: true
  })

  // Test: generate signed URL untuk dokumen di database
  if (docId) {
    try {
      const docs = await allQuery(`SELECT id, file_path, original_filename FROM documents WHERE id = ?`, [docId]) as any[]
      if (docs.length === 0) {
        result.doc_test = `❌ Dokumen id=${docId} tidak ditemukan di database`
      } else {
        const doc = docs[0]
        result.doc_file_path = doc.file_path

        // Parse URL
        const url = new URL(doc.file_path)
        const parts = url.pathname.split('/').filter(Boolean)
        // parts: [cloud, resource_type, delivery_type, (v123...)?, ...publicId]
        const deliveryType = parts[2]
        const rest = parts.slice(3)
        let version: number | undefined
        let publicIdParts = rest
        if (rest[0] && /^v\d+$/.test(rest[0])) {
          version = parseInt(rest[0].substring(1))
          publicIdParts = rest.slice(1)
        }
        const publicId = publicIdParts.join('/')

        result.doc_parsed = { deliveryType, version, publicId }

        // Generate signed URL dengan expires_at (wajib untuk strict signed URLs)
        const expiresAt = Math.floor(Date.now() / 1000) + 3600
        try {
          // Strategy PRIMARY: private_download_url (Admin API signed — menyertakan expires_at dalam signature)
          const privateUrl = (cloudinary.utils as any).private_download_url(publicId, '', {
            resource_type: 'raw',
            type: deliveryType,
            expires_at: expiresAt,
            attachment: false
          })
          result.private_download_url = `✅ ${privateUrl.substring(0, 200)}...`

          const rPrivate = await fetch(privateUrl, { redirect: 'follow', signal: AbortSignal.timeout(15000) })
          result.fetch_private_status = rPrivate.status
          result.fetch_private_ok = rPrivate.ok
          if (!rPrivate.ok) result.fetch_private_body = (await rPrivate.text()).substring(0, 300)
          
          // Strategy FALLBACK: cloudinary.url() biasa (tidak bisa strict signed URLs)
          const signedUrlPlain = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: deliveryType as any,
            sign_url: true,
            secure: true,
            ...(version ? { version } : {})
          })
          result.signed_url_plain = `${signedUrlPlain.substring(0, 150)}...`

          const rPlain = await fetch(signedUrlPlain, { signal: AbortSignal.timeout(10000) })
          result.fetch_plain_signed_status = rPlain.status
          result.fetch_plain_signed_ok = rPlain.ok
          if (!rPlain.ok) result.fetch_plain_signed_body = (await rPlain.text()).substring(0, 300)
        } catch (e: any) {
          result.signed_url_error = e.message
        }

        // Juga coba fetch raw URL (tanpa signature)
        try {
          const res2 = await fetch(doc.file_path, { signal: AbortSignal.timeout(10000) })
          result.raw_url_fetch_status = res2.status
          result.raw_url_fetch_ok = res2.ok
        } catch (e: any) {
          result.raw_url_fetch_error = e.message
        }
      }
    } catch (e: any) {
      result.db_error = e.message
    }
  } else {
    result.hint = 'Tambahkan ?doc_id=16 untuk test fetch dokumen. Ganti 16 dengan ID dokumen yang ada.'
  }

  return result
})
