import { runQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export default defineEventHandler(async (event) => {
  // 1. Authenticate
  const decoded = requireAuth(event)
  
  const allowedRoles = ['kontributor_berita', 'user_kontributor', 'admin_komsos', 'super_admin']
  if (!allowedRoles.includes(decoded.role)) {
    throw createError({ statusCode: 403, statusMessage: 'Role tidak diizinkan membuat berita via portal kontributor' })
  }

  try {
    const body = await readBody(event)
    const {
      title, content, category_ids, image,
      gallery_images, wilayah_ids, lingkungan_ids, seksi_ids,
      when_date, when_time, where_location, who_participants, why_purpose, how_process,
      // Status is intentionally IGNORED from body to prevent bypassing
    } = body

    const contentText = content?.replace(/<[^>]*>/g, '').trim()
    if (!title || !contentText || contentText.length === 0) {
      throw createError({ statusCode: 400, statusMessage: 'Judul dan Konten tidak boleh kosong' })
    }

    // Bug Fix #8: Max length validation to prevent oversized payloads
    if (title.length > 500) {
      throw createError({ statusCode: 400, statusMessage: 'Judul terlalu panjang (maksimal 500 karakter)' })
    }
    if (content.length > 200000) {
      throw createError({ statusCode: 400, statusMessage: 'Konten terlalu panjang (maksimal 200.000 karakter)' })
    }

    const finalSlug = createSlug(title) + '-' + Date.now().toString().slice(-6)
    
    // Status is FORCED to draft for contributors
    const status = 'draft'
    
    // Set author details based on token and form input
    const author_id = decoded.userId
    const inputAuthor = body.author?.trim()
    const inputOrigin = body.author_origin?.trim()
    
    let authorName = inputAuthor || decoded.username || 'Kontributor'
    if (inputOrigin) {
      authorName = `${authorName} (${inputOrigin})`
    }

    const params = [
      title,
      finalSlug,
      content,
      authorName,
      author_id,
      status,
      image || null,
      gallery_images ? JSON.stringify(gallery_images) : null,
      when_date || null,
      when_time || null,
      where_location || null,
      who_participants || null,
      why_purpose || null,
      how_process || null
    ]

    const result = await runQuery(
      `INSERT INTO news (
        title, slug, content, author, author_id, status, image, gallery_images,
        when_date, when_time, where_location, who_participants, why_purpose, how_process,
        created_at, updated_at
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      params
    )

    const newsId = (result as any).insertId

    // Insert category relations
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      const categoryPromises = category_ids.map(categoryId =>
        runQuery('INSERT INTO news_category_relations (news_id, category_id) VALUES (?, ?)', [newsId, categoryId])
      )
      await Promise.all(categoryPromises)
    }

    // Insert organization relations
    const finalWilayahIds = Array.isArray(wilayah_ids) ? wilayah_ids : []
    const finalLingkunganIds = Array.isArray(lingkungan_ids) ? lingkungan_ids : []
    const finalSeksiIds = Array.isArray(seksi_ids) ? seksi_ids : []

    if (finalWilayahIds.length > 0) {
      await Promise.all(finalWilayahIds.map((wid: number) =>
        runQuery('INSERT IGNORE INTO news_wilayah_relations (news_id, wilayah_id) VALUES (?, ?)', [newsId, wid])
      ))
    }
    if (finalLingkunganIds.length > 0) {
      await Promise.all(finalLingkunganIds.map((lid: number) =>
        runQuery('INSERT IGNORE INTO news_lingkungan_relations (news_id, lingkungan_id) VALUES (?, ?)', [newsId, lid])
      ))
    }
    if (finalSeksiIds.length > 0) {
      await Promise.all(finalSeksiIds.map((sid: number) =>
        runQuery('INSERT IGNORE INTO news_seksi_relations (news_id, seksi_id) VALUES (?, ?)', [newsId, sid])
      ))
    }

    return {
      success: true,
      message: 'Berita berhasil disimpan sebagai DRAFT dan menunggu review dari Admin Komsos.',
      data: { id: newsId, status: 'draft' }
    }
  } catch (error: any) {
    throw createError({
      statusCode: error?.statusCode || 500,
      statusMessage: error?.statusMessage || error?.message || 'Internal server error'
    })
  }
})
