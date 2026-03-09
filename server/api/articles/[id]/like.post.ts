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

    // Get client information for duplicate detection
    const clientIp = getClientIp(event)
    const userAgent = getHeader(event, 'user-agent') || ''
    const userSession = getClientFingerprint(event)

    // Check if user already liked this article
    const existing = await getQuery(
      `SELECT id FROM article_interactions 
       WHERE article_id = ? AND interaction_type = 'like' 
       AND user_session = ? AND user_ip = ?`,
      [articleId, userSession, clientIp]
    )

    let action = 'like'
    
    if (existing) {
      // Unlike: Remove the like
      await runQuery(
        'DELETE FROM article_interactions WHERE id = ?',
        [existing.id]
      )
      
      // Decrement likes_count
      await runQuery(
        'UPDATE articles SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?',
        [articleId]
      )
      
      action = 'unlike'
    } else {
      // Like: Add new like
      await runQuery(
        `INSERT INTO article_interactions 
         (article_id, interaction_type, user_ip, user_agent, user_session) 
         VALUES (?, 'like', ?, ?, ?)`,
        [articleId, clientIp, userAgent, userSession]
      )
      
      // Increment likes_count
      await runQuery(
        'UPDATE articles SET likes_count = likes_count + 1 WHERE id = ?',
        [articleId]
      )
    }

    // Get updated count
    const updated = await getQuery(
      'SELECT likes_count FROM articles WHERE id = ?',
      [articleId]
    )

    return {
      success: true,
      action,
      likes_count: updated?.likes_count || 0,
      message: action === 'like' ? 'Berhasil menyukai artikel' : 'Batal menyukai artikel'
    }
  } catch (error: any) {
    console.error('Error toggling article like:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
