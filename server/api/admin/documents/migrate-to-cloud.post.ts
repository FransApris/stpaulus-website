import { allQuery, runQuery } from '../../../database/db'
import { requireAuth } from '../../../utils/auth'
import { isCloudinaryEnabled, uploadDocumentToCloudinary } from '../../../utils/cloudinary'
import fs from 'fs'
import path from 'path'

function getUploadBasePath() {
  if (process.env.UPLOAD_BASE_PATH) {
    return process.env.UPLOAD_BASE_PATH
  }
  return path.join(process.cwd(), 'public', 'uploads')
}

/**
 * POST /api/admin/documents/migrate-to-cloud
 *
 * Migrates all documents whose file_path is a local path (starts with /uploads/)
 * to Cloudinary and updates the database record with the new cloud URL.
 *
 * Only super_admin / admin_sekretariat with manage_documents permission can run this.
 * Safe to run multiple times — already-migrated documents (https:// URLs) are skipped.
 */
export default defineEventHandler(async (event) => {
  requireAuth(event)

  const user = event.context.auth
  if (!user || !user.permissions?.includes('manage_documents')) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Only Super Admin and Admin Sekretariat can migrate documents'
    })
  }

  if (!isCloudinaryEnabled()) {
    throw createError({
      statusCode: 503,
      statusMessage: 'Cloudinary belum dikonfigurasi. Tambahkan CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, dan CLOUDINARY_API_SECRET di environment variables.'
    })
  }

  // Fetch only local documents (not yet migrated)
  const localDocs = await allQuery(`
    SELECT id, filename, original_filename, file_path, mime_type
    FROM documents
    WHERE file_path NOT LIKE 'https://%'
      AND file_path NOT LIKE 'http://%'
  `)

  const results = {
    total: localDocs.length,
    migrated: 0,
    skipped: 0,
    failed: [] as Array<{ id: number; original_filename: string; error: string }>
  }

  for (const doc of localDocs as Array<{ id: number; filename: string; original_filename: string; file_path: string; mime_type: string }>) {
    // Resolve physical file path
    const relativeFilePath = doc.file_path.replace(/^\/uploads/, '')
    const filePath = path.join(getUploadBasePath(), relativeFilePath)

    if (!fs.existsSync(filePath)) {
      console.warn(`[Migrate] File missing on disk, skipping id=${doc.id}: ${filePath}`)
      results.skipped++
      results.failed.push({ id: doc.id, original_filename: doc.original_filename, error: 'File tidak ditemukan di disk' })
      continue
    }

    try {
      const fileBuffer = fs.readFileSync(filePath)
      const cloudUrl = await uploadDocumentToCloudinary(fileBuffer, 'documents', doc.original_filename)

      await runQuery(`UPDATE documents SET file_path = ? WHERE id = ?`, [cloudUrl, doc.id])

      console.log(`[Migrate] ✓ id=${doc.id} → ${cloudUrl}`)
      results.migrated++
    } catch (err: any) {
      console.error(`[Migrate] ✗ id=${doc.id}:`, err)
      results.failed.push({ id: doc.id, original_filename: doc.original_filename, error: err?.message || 'Upload gagal' })
    }
  }

  return {
    success: true,
    message: `Migrasi selesai: ${results.migrated} berhasil, ${results.skipped} tidak ditemukan di disk, ${results.failed.length} gagal.`,
    ...results
  }
})
