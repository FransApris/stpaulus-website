import { runQuery, getQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  // Check permissions using RBAC
  requirePermission('manage_chatbot_faqs')(event)

  const body = await readBody(event)
  const { question, answer, category, keywords } = body

  if (!question || !answer) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pertanyaan dan jawaban diperlukan'
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

  const result = await runQuery(`
    INSERT INTO chatbot_faqs (question, answer, category, keywords)
    VALUES (?, ?, ?, ?)
  `, [question, answer, category || null, keywordsJson])

  const insertId = (result as any).insertId

  // Fetch created data to return
  const createdFaq = await getQuery('SELECT * FROM chatbot_faqs WHERE id = ?', [insertId])

  return {
    success: true,
    message: 'FAQ berhasil ditambahkan',
    data: createdFaq
  }
})
