import { getQuery, runQuery } from '../../../database/db'
import { getClientIp, getClientFingerprint } from '~/server/utils/client-info'

export default defineEventHandler(async (event) => {
  const articleId = getRouterParam(event, 'id')
  
  if (!articleId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Article ID is required'
    })
  }

  try {
    // Check if article exists and is published
    const article = await getQuery(
      'SELECT id, slug, title FROM articles WHERE id = ? AND status = "published"',
      [articleId]
    )

    if (!article) {
      throw createError({
        statusCode: 404,
        statusMessage: 'Article not found'
      })
    }

    // Get client information
    const clientIp = getClientIp(event)
    const userAgent = getHeader(event, 'user-agent') || ''
    const userSession = getClientFingerprint(event)

    // Record share interaction (allow multiple shares)
    await runQuery(
      `INSERT INTO article_interactions 
       (article_id, interaction_type, user_ip, user_agent, user_session) 
       VALUES (?, 'share', ?, ?, ?)`,
      [articleId, clientIp, userAgent, userSession]
    )
    
    // Increment shares_count
    await runQuery(
      'UPDATE articles SET shares_count = shares_count + 1 WHERE id = ?',
      [articleId]
    )

    // Get updated count
    const updated = await getQuery(
      'SELECT shares_count FROM articles WHERE id = ?',
      [articleId]
    )

    return {
      success: true,
      shares_count: updated?.shares_count || 0,
      message: 'Berhasil share artikel'
    }
  } catch (error: any) {
    console.error('Error sharing article:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
