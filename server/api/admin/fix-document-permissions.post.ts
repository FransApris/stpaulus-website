/**
 * POST /api/admin/fix-document-permissions
 *
 * Endpoint satu kali untuk memperbaiki dokumen lama yang tersimpan di Cloudinary
 * dengan tipe 'authenticated' (tidak bisa diakses publik).
 *
 * Strategi:
 *   1. Query semua dokumen dengan URL Cloudinary bertipe 'authenticated'
 *   2. Rename resource di Cloudinary dari type='authenticated' -> type='upload' (publik)
 *   3. Update URL di database dari 'authenticated' -> 'upload'
 *
 * Endpoint ini memerlukan auth admin. Jalankan sekali saja dari admin panel.
 */
import { defineEventHandler, createError, readBody } from 'h3'
import type { H3Event } from 'h3'
import { allQuery, runQuery } from '~/server/database/db'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
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

function extractPublicIdFromAuthUrl(url: string): { publicId: string; version?: number } | null {
  try {
    const pathname = new URL(url).pathname
    // e.g. /duxit8q2c/raw/authenticated/v1712345678/stpaulus/documents/myfile.pdf
    const parts = pathname.split('/').filter(Boolean)
    if (parts.length < 4) return null
    // parts: [cloud, resource_type, type, (v123...)?, ...publicId]
    const rest = parts.slice(3)
    let version: number | undefined
    let publicIdParts = rest
    if (rest[0] && /^v\d+$/.test(rest[0])) {
      version = parseInt(rest[0].substring(1))
      publicIdParts = rest.slice(1)
    }
    return { publicId: publicIdParts.join('/'), version }
  } catch {
    return null
  }
}

export default defineEventHandler(async (event: H3Event) => {
  // Auth check handled by admin-auth middleware

  if (!CLOUDINARY_CONFIGURED) {
    throw createError({
      statusCode: 500,
      statusMessage: 'Cloudinary credentials (CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_API_SECRET) tidak terset di environment variables'
    })
  }

  // Query semua dokumen dengan URL Cloudinary yang bertipe 'authenticated'
  const docs = await allQuery(`
    SELECT id, file_path, original_filename
    FROM documents
    WHERE file_path LIKE '%res.cloudinary.com%/authenticated/%'
  `, []) as Array<{ id: number; file_path: string; original_filename: string }>

  if (docs.length === 0) {
    return {
      success: true,
      message: 'Tidak ada dokumen bertipe authenticated di database. Semua dokumen sudah OK.',
      fixed: 0,
      failed: 0,
      results: []
    }
  }

  const results: Array<{ id: number; filename: string; status: string; newUrl?: string; error?: string }> = []
  let fixed = 0
  let failed = 0

  for (const doc of docs) {
    const parsed = extractPublicIdFromAuthUrl(doc.file_path)
    if (!parsed) {
      results.push({ id: doc.id, filename: doc.original_filename, status: 'skip', error: 'Tidak bisa parse URL' })
      failed++
      continue
    }

    const { publicId } = parsed

    try {
      // Rename di Cloudinary: ubah dari type=authenticated ke type=upload (publik)
      const renamed = await cloudinary.uploader.rename(publicId, publicId, {
        resource_type: 'raw',
        type: 'authenticated',
        to_type: 'upload',
        invalidate: true,
        overwrite: true
      }) as { secure_url: string }

      const newUrl = renamed.secure_url
      // Update URL di database
      await runQuery('UPDATE documents SET file_path = ? WHERE id = ?', [newUrl, doc.id])

      results.push({ id: doc.id, filename: doc.original_filename, status: 'fixed', newUrl })
      fixed++
      console.log(`[FixDocPerms] ✓ id=${doc.id} "${doc.original_filename}" → ${newUrl}`)
    } catch (err: any) {
      const errMsg = err?.message || String(err)
      results.push({ id: doc.id, filename: doc.original_filename, status: 'failed', error: errMsg })
      failed++
      console.error(`[FixDocPerms] ✗ id=${doc.id} "${doc.original_filename}": ${errMsg}`)
    }
  }

  return {
    success: failed === 0,
    message: `Selesai. ${fixed} dokumen berhasil diperbaiki, ${failed} gagal.`,
    total: docs.length,
    fixed,
    failed,
    results
  }
})
