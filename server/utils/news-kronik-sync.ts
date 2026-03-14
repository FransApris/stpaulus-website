// Utility: News-Kronik Auto Sync
// Purpose: Automatically sync news articles to kronik entries when published

import { runQuery, getQuery as getOne, allQuery } from '~/server/database/db'

interface NewsToKronikData {
  newsId: number
  title: string
  content: string
  excerpt?: string
  author?: string
  image?: string
  publishedAt: string
  categoryIds: number[]
}

/**
 * Check if a news article should be synced to kronik based on its categories
 * @param categoryIds Array of article category IDs
 * @returns Object with shouldSync flag and target kronik category ID
 */
export async function shouldSyncToKronik(categoryIds: number[]): Promise<{
  shouldSync: boolean
  kronikCategoryId: number | null
}> {
  if (!categoryIds || categoryIds.length === 0) {
    return { shouldSync: false, kronikCategoryId: null }
  }

  try {
    // Check if any of the news categories is marked for sync
    const placeholders = categoryIds.map(() => '?').join(',')
    const syncConfig = await getOne(
      `SELECT id, kronik_category_id 
       FROM article_categories 
       WHERE id IN (${placeholders}) 
       AND sync_to_kronik = TRUE 
       LIMIT 1`,
      categoryIds
    ) as { id: number; kronik_category_id: number } | undefined

    if (syncConfig && syncConfig.kronik_category_id) {
      return {
        shouldSync: true,
        kronikCategoryId: syncConfig.kronik_category_id
      }
    }
  } catch (error) {
    console.error('[News-Kronik Sync] Error checking sync config:', error)
  }

  return { shouldSync: false, kronikCategoryId: null }
}

/**
 * Sync news article to kronik entry
 * @param data News article data
 * @param kronikCategoryId Target kronik category ID
 * @returns Created kronik entry ID or null if failed
 */
export async function syncNewsToKronik(
  data: NewsToKronikData,
  kronikCategoryId: number
): Promise<number | null> {
  try {
    // Check if this news is already synced
    const existing = await getOne(
      'SELECT id FROM kronik_entries WHERE source_news_id = ?',
      [data.newsId]
    ) as { id: number } | undefined

    if (existing) {
      // Update existing kronik entry
      await runQuery(
        `UPDATE kronik_entries SET
          what_title = ?,
          what_description = ?,
          featured_image = ?,
          when_date = ?,
          sync_updated_at = NOW(),
          updated_at = NOW()
        WHERE id = ?`,
        [
          data.title,
          data.content || data.excerpt || '',
          data.image || null,
          data.publishedAt,
          existing.id
        ]
      )
      console.log(`[News-Kronik Sync] Updated existing kronik entry ${existing.id} from news ${data.newsId}`)
      return existing.id
    }

    // Create new kronik entry
    // Get author_id from news author name (if exists)
    let authorId: number | null = null
    if (data.author) {
      const user = await getOne(
        'SELECT id FROM users WHERE full_name = ? OR username = ? LIMIT 1',
        [data.author, data.author]
      ) as { id: number } | undefined
      if (user) {
        authorId = user.id
      }
    }

    // Default author_id to superadmin (user id = 111) if not found
    if (!authorId) {
      const superadmin = await getOne('SELECT id FROM users WHERE username = ? LIMIT 1', ['superadmin']) as { id: number } | undefined
      authorId = superadmin?.id || 111
    }

    const result = await runQuery(
      `INSERT INTO kronik_entries (
        category_id,
        section_id,
        what_title,
        what_description,
        when_date,
        featured_image,
        status,
        author_id,
        source_news_id,
        is_auto_synced,
        sync_updated_at,
        published_at,
        created_at,
        updated_at
      ) VALUES (?, NULL, ?, ?, ?, ?, 'published', ?, ?, TRUE, NOW(), ?, NOW(), NOW())`,
      [
        kronikCategoryId,
        data.title,
        data.content || data.excerpt || '',
        data.publishedAt,
        data.image || null,
        authorId,
        data.newsId,
        data.publishedAt
      ]
    )

    const kronikId = (result as any).insertId
    console.log(`[News-Kronik Sync] Created kronik entry ${kronikId} from news ${data.newsId}`)
    return kronikId
  } catch (error) {
    console.error('[News-Kronik Sync] Error syncing to kronik:', error)
    return null
  }
}

/**
 * Remove kronik entry when news is unpublished or deleted
 * @param newsId News article ID
 */
export async function unsyncNewsFromKronik(newsId: number): Promise<void> {
  try {
    const kronikEntry = await getOne(
      'SELECT id FROM kronik_entries WHERE source_news_id = ? AND is_auto_synced = TRUE',
      [newsId]
    ) as { id: number } | undefined

    if (kronikEntry) {
      // Cascade delete (views, comments will be deleted automatically)
      await runQuery('DELETE FROM kronik_views WHERE entry_id = ?', [kronikEntry.id])
      await runQuery('DELETE FROM kronik_comments WHERE entry_id = ?', [kronikEntry.id])
      await runQuery('DELETE FROM kronik_entries WHERE id = ?', [kronikEntry.id])
      console.log(`[News-Kronik Sync] Deleted kronik entry ${kronikEntry.id} for news ${newsId}`)
    }
  } catch (error) {
    console.error('[News-Kronik Sync] Error unsyncing from kronik:', error)
  }
}

/**
 * Auto-sync handler for news create/update
 * Call this after news is created or updated with status 'published'
 */
export async function handleNewsKronikSync(
  newsId: number,
  status: string,
  categoryIds: number[]
): Promise<void> {
  try {
    if (status !== 'published') {
      // If news is no longer published, remove from kronik
      await unsyncNewsFromKronik(newsId)
      return
    }

    // Check if should sync
    const { shouldSync, kronikCategoryId } = await shouldSyncToKronik(categoryIds)

    if (!shouldSync || !kronikCategoryId) {
      console.log(`[News-Kronik Sync] News ${newsId} not configured for kronik sync`)
      return
    }

    // Get news data
    const news = await getOne(
      `SELECT n.*, 
       GROUP_CONCAT(DISTINCT ncr.category_id) as category_ids
       FROM news n
       LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
       WHERE n.id = ?
       GROUP BY n.id`,
      [newsId]
    ) as any

    if (!news) {
      console.error(`[News-Kronik Sync] News ${newsId} not found`)
      return
    }

    // Sync to kronik
    await syncNewsToKronik(
      {
        newsId: news.id,
        title: news.title,
        content: news.content,
        excerpt: news.excerpt,
        author: news.author,
        image: news.image,
        publishedAt: news.published_at || new Date().toISOString().slice(0, 19).replace('T', ' '),
        categoryIds: news.category_ids ? news.category_ids.split(',').map(Number) : []
      },
      kronikCategoryId
    )
  } catch (error) {
    console.error('[News-Kronik Sync] Error in handleNewsKronikSync:', error)
  }
}
