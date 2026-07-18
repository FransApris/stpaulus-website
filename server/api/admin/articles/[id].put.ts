import { runQuery, getQuery as getDbQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'
import DOMPurify from 'isomorphic-dompurify'

// Bug #5 Fix: Konfigurasi sanitasi HTML — sama dengan index.post.ts
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
  // Bug #2 Fix: Tambahkan requirePermission — sebelumnya TIDAK ADA
  requireAuth(event)
  requirePermission('manage_articles')(event)

  try {
    const id = getRouterParam(event, 'id')
    if (!id) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Article ID is required'
      })
    }

    const body = await readBody(event)
    const { title, slug, excerpt, content, author, status, category_ids, image } = body

    // Check if article exists
    const existingArticle = await getDbQuery('SELECT * FROM articles WHERE id = ?', [id]) as any
    if (!existingArticle) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    const finalTitle   = title   ?? existingArticle.title
    const finalExcerpt = excerpt ?? existingArticle.excerpt ?? ''
    const finalAuthor  = author  ?? existingArticle.author  ?? ''
    const finalImage   = image   ?? existingArticle.image   ?? null

    // Bug #4 Fix: Validasi whitelist untuk status
    const rawStatus = status ?? existingArticle.status ?? 'draft'
    const finalStatus: ArticleStatus = ALLOWED_STATUSES.includes(rawStatus) ? rawStatus : 'draft'
    if (status !== undefined && !ALLOWED_STATUSES.includes(status)) {
      console.warn(`[Article Update] Status tidak valid '${status}' dibuang, diganti '${finalStatus}'`)
    }

    // Bug #5 Fix: Sanitasi konten HTML dari WYSIWYG sebelum disimpan
    const rawContent   = content ?? existingArticle.content
    const finalContent = sanitizeHtml(rawContent)

    // Sanitasi excerpt juga (strip semua HTML di excerpt)
    const finalExcerptSanitized = finalExcerpt
      ? DOMPurify.sanitize(finalExcerpt, { ALLOWED_TAGS: [], KEEP_CONTENT: true })
      : ''

    // Validation (supports partial updates by falling back to existing values)
    if (!finalTitle || !finalContent) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Title and content are required'
      })
    }

    // Generate slug if not provided
    const finalSlug = slug || createSlug(finalTitle)

    // Check if slug already exists (excluding current article)
    const slugCheck = await getDbQuery('SELECT id FROM articles WHERE slug = ? AND id != ?', [finalSlug, id])
    if (slugCheck) {
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

    // Update published_at based on status
    let publishedAt = null
    if (finalStatus === 'published') {
      const currentArticle = await getDbQuery('SELECT status, published_at FROM articles WHERE id = ?', [id]) as { status: string, published_at: string | null } | undefined
      if (currentArticle && currentArticle.status !== 'published') {
        publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      } else if (currentArticle && currentArticle.published_at) {
        publishedAt = currentArticle.published_at
      } else {
        publishedAt = new Date().toISOString().slice(0, 19).replace('T', ' ')
      }
    }

    console.log('[Article Update] Update data:', { id, title: finalTitle, status: finalStatus, publishedAt })

    // Update article
    try {
      await runQuery(
        `UPDATE articles SET title = ?, slug = ?, content = ?, excerpt = ?, author = ?, status = ?, image = ?, published_at = ?, updated_at = NOW() WHERE id = ?`,
        [finalTitle, finalSlug, finalContent, finalExcerptSanitized, finalAuthor, finalStatus, finalImage, publishedAt, id]
      )
    } catch (queryError: any) {
      // Bug #6 Fix: Log detail ke server, kirim pesan generik ke client (jangan bocorkan queryError.message)
      console.error('[Article Update] DB query error:', queryError.message, '| Article ID:', id)
      throw createError({
        statusCode: 500,
        statusMessage: 'Gagal memperbarui artikel. Silakan coba lagi.'
      })
    }

    // Update category relations
    if (category_ids !== undefined) {
      await runQuery('DELETE FROM article_category_relations WHERE article_id = ?', [id])
      if (Array.isArray(category_ids) && category_ids.length > 0) {
        for (const categoryId of category_ids) {
          await runQuery(
            'INSERT INTO article_category_relations (article_id, category_id) VALUES (?, ?)',
            [id, categoryId]
          )
        }
      }
    }

    console.log('[Article Update] Successfully updated article:', id)

    return {
      id: parseInt(id),
      title: finalTitle,
      slug: finalSlug,
      content: finalContent,
      excerpt: finalExcerptSanitized,
      author: finalAuthor,
      status: finalStatus,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
      message: 'Article updated successfully'
    }
  } catch (error: any) {
    console.error('[Article Update] Error:', error.message)
    // Re-throw createError as-is (sudah memiliki statusCode dan pesan yang aman)
    if (error.statusCode) throw error
    // Bug #6 Fix: Jangan bocorkan error.message internal ke client
    throw createError({
      statusCode: 500,
      statusMessage: 'Gagal memperbarui artikel. Silakan coba lagi.'
    })
  }
})
