import { runQuery, getQuery as getDbQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'
import DOMPurify from 'isomorphic-dompurify'

// Bug #5 Fix: Konfigurasi sanitasi HTML — izinkan tag/atribut aman untuk konten artikel WYSIWYG
// Tag berbahaya seperti <script>, event handler (onerror, onload, onclick) otomatis diblokir.
const ALLOWED_TAGS = [
  'p', 'br', 'strong', 'em', 'u', 's', 'b', 'i',
  'h1', 'h2', 'h3', 'h4', 'h5', 'h6',
  'ul', 'ol', 'li', 'blockquote', 'pre', 'code',
  'a', 'img', 'figure', 'figcaption',
  'table', 'thead', 'tbody', 'tr', 'th', 'td',
  'hr', 'div', 'span'
]
const ALLOWED_ATTR = ['href', 'src', 'alt', 'title', 'class', 'target', 'rel', 'width', 'height', 'colspan', 'rowspan']

function sanitizeHtml(dirty: string): string {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS,
    ALLOWED_ATTR,
    FORBID_ATTR: ['style', 'onerror', 'onload', 'onclick', 'onmouseover', 'onfocus'],
    KEEP_CONTENT: true
  })
}

// Bug #4 Fix: Whitelist status yang valid
const ALLOWED_STATUSES = ['draft', 'published', 'archived'] as const
type ArticleStatus = typeof ALLOWED_STATUSES[number]

function createSlug(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '') // Remove special characters
    .replace(/[\s_-]+/g, '-') // Replace spaces and underscores with hyphens
    .replace(/^-+|-+$/g, '') // Remove leading/trailing hyphens
}

export default defineEventHandler(async (event) => {
  // Bug #1 Fix: Tambahkan requirePermission — sebelumnya TIDAK ADA
  requireAuth(event)
  requirePermission('manage_articles')(event)

  try {
    const body = await readBody(event)
    const { title, slug, excerpt, content, author, status, category_ids, image } = body

    // Validation
    if (!title || !content) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    // Bug #4 Fix: Validasi whitelist untuk status
    const safeStatus: ArticleStatus = ALLOWED_STATUSES.includes(status) ? status : 'draft'
    if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
      console.warn(`[Article Create] Status tidak valid '${status}' dibuang, diganti 'draft'`)
    }

    const safeExcerpt = excerpt !== undefined ? excerpt : null
    const safeAuthor  = author  !== undefined ? author  : null
    const safeImage   = image   !== undefined ? image   : null

    // Bug #5 Fix: Sanitasi konten HTML dari WYSIWYG editor sebelum disimpan ke DB
    const safeContent = sanitizeHtml(content)

    // Juga sanitasi excerpt jika ada HTML di dalamnya
    const safeExcerptSanitized = safeExcerpt ? DOMPurify.sanitize(safeExcerpt, { ALLOWED_TAGS: [], KEEP_CONTENT: true }) : null

    // Generate slug if not provided
    const finalSlug = slug || createSlug(title)

    // Check if slug already exists
    const existingArticle = await getDbQuery('SELECT id FROM articles WHERE slug = ?', [finalSlug])
    if (existingArticle) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Slug already exists'
      })
    }

    // Validate category_ids if provided
    if (category_ids && Array.isArray(category_ids)) {
      for (const categoryId of category_ids) {
        const category = await getDbQuery('SELECT id FROM article_categories WHERE id = ?', [categoryId])
        if (!category) {
          throw createError({
            statusCode: 400,
            statusMessage: `Category with ID ${categoryId} does not exist`
          })
        }
      }
    }

    // Insert article
    const publishedAt = safeStatus === 'published' ? new Date().toISOString().slice(0, 19).replace('T', ' ') : null

    const result: any = await runQuery(
      `INSERT INTO articles (title, slug, content, excerpt, author, status, image, published_at, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())`,
      [title, finalSlug, safeContent, safeExcerptSanitized || '', safeAuthor || '', safeStatus, safeImage, publishedAt]
    )

    // Handle different database result formats
    const articleId = result.insertId || result.lastInsertRowid || result[0]?.insertId

    console.log('[Article Create] Insert result:', { result, articleId })

    // Insert category relations if provided
    if (category_ids && Array.isArray(category_ids) && category_ids.length > 0) {
      for (const categoryId of category_ids) {
        await runQuery(
          'INSERT INTO article_category_relations (article_id, category_id) VALUES (?, ?)',
          [articleId, categoryId]
        )
      }
    }

    return {
      id: articleId,
      title,
      slug: finalSlug,
      content: safeContent,
      excerpt: safeExcerptSanitized || '',
      author: safeAuthor || '',
      status: safeStatus,
      image: safeImage,
      published_at: publishedAt,
      message: 'Article created successfully'
    }
  } catch (error: any) {
    console.error('[Article Create] Error:', error)
    // Re-throw createError as-is (sudah memiliki statusCode)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal membuat artikel. Silakan coba lagi.'
    })
  }
})
