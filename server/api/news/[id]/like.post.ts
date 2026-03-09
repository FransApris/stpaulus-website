import { getQuery, runQuery } from '../../../database/db'
import { getClientIp, getClientFingerprint } from '~/server/utils/client-info'

export default defineEventHandler(async (event) => {
  const newsId = getRouterParam(event, 'id')
  
  if (!newsId) {
    throw createError({
      statusCode: 400,
      statusMessage: 'News ID is required'
    })
  }

  try {
    // Check if news exists and is published
    const news = await getQuery(
      'SELECT id, slug, title FROM news WHERE id = ? AND status = "published"',
      [newsId]
    )

    if (!news) {
      throw createError({
        statusCode: 404,
        statusMessage: 'News not found'
      })
    }

    // Get client information for duplicate detection
    const clientIp = getClientIp(event)
    const userAgent = getHeader(event, 'user-agent') || ''
    const userSession = getClientFingerprint(event)

    // Check if user already liked this news
    const existing = await getQuery(
      `SELECT id FROM news_interactions 
       WHERE news_id = ? AND interaction_type = 'like' 
       AND user_session = ? AND user_ip = ?`,
      [newsId, userSession, clientIp]
    )

    let action = 'like'
    
    if (existing) {
      // Unlike: Remove the like
      await runQuery(
        'DELETE FROM news_interactions WHERE id = ?',
        [existing.id]
      )
      
      // Decrement likes_count
      await runQuery(
        'UPDATE news SET likes_count = GREATEST(likes_count - 1, 0) WHERE id = ?',
        [newsId]
      )
      
      action = 'unlike'
    } else {
      // Like: Add new like
      await runQuery(
        `INSERT INTO news_interactions 
         (news_id, interaction_type, user_ip, user_agent, user_session) 
         VALUES (?, 'like', ?, ?, ?)`,
        [newsId, clientIp, userAgent, userSession]
      )
      
      // Increment likes_count
      await runQuery(
        'UPDATE news SET likes_count = likes_count + 1 WHERE id = ?',
        [newsId]
      )
    }

    // Get updated count
    const updated = await getQuery(
      'SELECT likes_count FROM news WHERE id = ?',
      [newsId]
    )

    return {
      success: true,
      action,
      likes_count: updated?.likes_count || 0,
      message: action === 'like' ? 'Berhasil menyukai berita' : 'Batal menyukai berita'
    }
  } catch (error: any) {
    console.error('Error toggling news like:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
