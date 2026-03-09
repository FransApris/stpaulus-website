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

    // Get client information
    const clientIp = getClientIp(event)
    const userAgent = getHeader(event, 'user-agent') || ''
    const userSession = getClientFingerprint(event)

    // Record share interaction (allow multiple shares)
    await runQuery(
      `INSERT INTO news_interactions 
       (news_id, interaction_type, user_ip, user_agent, user_session) 
       VALUES (?, 'share', ?, ?, ?)`,
      [newsId, clientIp, userAgent, userSession]
    )
    
    // Increment shares_count
    await runQuery(
      'UPDATE news SET shares_count = shares_count + 1 WHERE id = ?',
      [newsId]
    )

    // Get updated count
    const updated = await getQuery(
      'SELECT shares_count FROM news WHERE id = ?',
      [newsId]
    )

    return {
      success: true,
      shares_count: updated?.shares_count || 0,
      message: 'Berhasil share berita'
    }
  } catch (error: any) {
    console.error('Error sharing news:', error)
    if (error.statusCode) throw error
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
