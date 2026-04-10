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
          // Strategy 1: long signature + expires_at
          const signedUrlLong = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: deliveryType as any,
            sign_url: true,
            long_url_signature: true,
            expires_at: expiresAt,
            secure: true,
            ...(version ? { version } : {})
          })
          result.signed_url_long = `✅ ${signedUrlLong.substring(0, 150)}...`

          const r1 = await fetch(signedUrlLong, { signal: AbortSignal.timeout(10000) })
          result.fetch_long_signed_status = r1.status
          result.fetch_long_signed_ok = r1.ok
          if (!r1.ok) result.fetch_long_signed_body = (await r1.text()).substring(0, 300)

          // Strategy 2: short signature + expires_at
          const signedUrlShort = cloudinary.url(publicId, {
            resource_type: 'raw',
            type: deliveryType as any,
            sign_url: true,
            long_url_signature: false,
            expires_at: expiresAt,
            secure: true,
            ...(version ? { version } : {})
          })
          result.signed_url_short = `✅ ${signedUrlShort.substring(0, 150)}...`

          const r2 = await fetch(signedUrlShort, { signal: AbortSignal.timeout(10000) })
          result.fetch_short_signed_status = r2.status
          result.fetch_short_signed_ok = r2.ok
          if (!r2.ok) result.fetch_short_signed_body = (await r2.text()).substring(0, 300)
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
