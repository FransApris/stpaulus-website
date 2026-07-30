import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'
import { clearFAQCache } from '../../../utils/faqCache'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requirePermission('manage_chatbot_faqs')(event)

  const id = getRouterParam(event, 'id')
  if (!id) {
    throw createError({
      statusCode: 400,
      statusMessage: 'ID diperlukan'
    })
  }

  const body = await readBody(event)
  const { question, answer, category, keywords, is_active } = body

  if (!question || !answer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pertanyaan dan jawaban diperlukan'
    })
  }

  // Check if FAQ exists
  const existing = await getQuery('SELECT id FROM chatbot_faqs WHERE id = ?', [id]) as any
  if (!existing) {
    throw createError({
      statusCode: 404,
      statusMessage: 'FAQ tidak ditemukan'
    })
  }

  // Validate keywords is array if provided
  let keywordsJson = null
  if (keywords) {
    if (!Array.isArray(keywords)) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Keywords harus berupa array'
      })
    }
    keywordsJson = JSON.stringify(keywords)
  }

  await runQuery(`
    UPDATE chatbot_faqs
    SET question = ?, answer = ?, category = ?, keywords = ?, is_active = ?, updated_at = CURRENT_TIMESTAMP
    WHERE id = ?
  `, [question, answer, category || null, keywordsJson, is_active !== undefined ? (is_active ? 1 : 0) : 1, id])

  // Clear global chatbot FAQ cache
  clearFAQCache()

  // Fetch updated data to return
  const updatedFaq = await getQuery('SELECT * FROM chatbot_faqs WHERE id = ?', [id])

  return {
    success: true,
    message: 'FAQ berhasil diperbarui',
    data: updatedFaq
  }
})
