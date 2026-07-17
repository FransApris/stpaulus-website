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
 */
export async function shouldSyncToKronik(categoryIds: number[]): Promise<{
  shouldSync: boolean
  kronikCategoryId: number | null
}> {
  if (!categoryIds || categoryIds.length === 0) {
    return { shouldSync: false, kronikCategoryId: null }
  }

  try {
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
 * Helper to get or create a kronik section dynamically based on category and name.
 * Useful for auto-creating Wilayah or Lingkungan sections.
 */
async function getOrCreateSection(categoryId: number, sectionName: string): Promise<number | null> {
  if (!sectionName) return null;
  
  try {
    const existing = await getOne(
      'SELECT id FROM kronik_sections WHERE category_id = ? AND name = ?',
      [categoryId, sectionName]
    ) as { id: number } | undefined;

    if (existing) return existing.id;

    // Create new section
    const maxOrderRes = await getOne(
      'SELECT MAX(order_index) as max_order FROM kronik_sections WHERE category_id = ?',
      [categoryId]
    ) as { max_order: number | null } | undefined;
    
    const nextOrder = (maxOrderRes?.max_order || 0) + 1;

    const result = await runQuery(
      'INSERT INTO kronik_sections (category_id, name, order_index, is_active) VALUES (?, ?, ?, TRUE)',
      [categoryId, sectionName, nextOrder]
    ) as any;

    return result.insertId;
  } catch (err) {
    console.error('[News-Kronik Sync] Error in getOrCreateSection:', err);
    return null;
  }
}

/**
 * Sync news article to kronik entry
 */
export async function syncNewsToKronik(
  data: NewsToKronikData,
  kronikCategoryId: number,
  kronikSectionId: number | null = null
): Promise<number | null> {
  try {
    const existing = await getOne(
      'SELECT id FROM kronik_entries WHERE source_news_id = ?',
      [data.newsId]
    ) as { id: number } | undefined

    if (existing) {
      await runQuery(
        `UPDATE kronik_entries SET
          category_id = ?,
          section_id = ?,
          what_title = ?,
          what_description = ?,
          featured_image = ?,
          when_date = ?,
          sync_updated_at = NOW(),
          updated_at = NOW()
        WHERE id = ?`,
        [
          kronikCategoryId,
          kronikSectionId,
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

    let authorId: number | null = null
    if (data.author) {
      const user = await getOne(
        'SELECT id FROM users WHERE full_name = ? OR username = ? LIMIT 1',
        [data.author, data.author]
      ) as { id: number } | undefined
      if (user) authorId = user.id
    }

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
      ) VALUES (?, ?, ?, ?, ?, ?, 'published', ?, ?, TRUE, NOW(), ?, NOW(), NOW())`,
      [
        kronikCategoryId,
        kronikSectionId,
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

export async function unsyncNewsFromKronik(newsId: number): Promise<void> {
  try {
    const kronikEntry = await getOne(
      'SELECT id FROM kronik_entries WHERE source_news_id = ? AND is_auto_synced = TRUE',
      [newsId]
    ) as { id: number } | undefined

    if (kronikEntry) {
      await runQuery('DELETE FROM kronik_views WHERE entry_id = ?', [kronikEntry.id])
      await runQuery('DELETE FROM kronik_comments WHERE entry_id = ?', [kronikEntry.id])
      await runQuery('DELETE FROM kronik_entries WHERE id = ?', [kronikEntry.id])
      console.log(`[News-Kronik Sync] Deleted kronik entry ${kronikEntry.id} for news ${newsId}`)
    }
  } catch (error) {
    console.error('[News-Kronik Sync] Error unsyncing from kronik:', error)
  }
}

export async function handleNewsKronikSync(
  newsId: number,
  status: string,
  categoryIds: number[]
): Promise<void> {
  try {
    if (status !== 'published') {
      await unsyncNewsFromKronik(newsId)
      return
    }

    // Determine target category and section dynamically based on organization tags
    let targetCategoryId: number | null = null;
    let targetSectionId: number | null = null;

    // Check Lingkungan first (Priority 1)
    const lingkungan = await getOne(
      'SELECT l.nama FROM news_lingkungan_relations nlr JOIN lingkungan l ON nlr.lingkungan_id = l.id WHERE nlr.news_id = ? LIMIT 1',
      [newsId]
    ) as { nama: string } | undefined;

    // Check Wilayah (Priority 2)
    const wilayah = await getOne(
      'SELECT w.nama FROM news_wilayah_relations nwr JOIN wilayah w ON nwr.wilayah_id = w.id WHERE nwr.news_id = ? LIMIT 1',
      [newsId]
    ) as { nama: string } | undefined;

    // Check Seksi (Priority 3)
    const seksi = await getOne(
      'SELECT s.nama FROM news_seksi_relations nsr JOIN seksi s ON nsr.seksi_id = s.id WHERE nsr.news_id = ? LIMIT 1',
      [newsId]
    ) as { nama: string } | undefined;

    // Fetch news details to check BGKP and get data
    const news = await getOne(
      `SELECT n.*, 
       GROUP_CONCAT(DISTINCT ncr.category_id) as category_ids
       FROM news n
       LEFT JOIN news_category_relations ncr ON n.id = ncr.news_id
       WHERE n.id = ?
       GROUP BY n.id`,
      [newsId]
    ) as any;

    if (!news) {
      console.error(`[News-Kronik Sync] News ${newsId} not found`);
      return;
    }

    const isBgkp = news.is_bgkp === 1;

    if (lingkungan) {
      targetCategoryId = 5; // Lingkungan Category ID
      targetSectionId = await getOrCreateSection(targetCategoryId, lingkungan.nama);
    } else if (wilayah) {
      targetCategoryId = 4; // Wilayah Category ID
      targetSectionId = await getOrCreateSection(targetCategoryId, wilayah.nama);
    } else if (seksi) {
      // Find matching section in kronik_sections (mostly category_id 2 or 3)
      const existingSection = await getOne(
        "SELECT id, category_id FROM kronik_sections WHERE name LIKE CONCAT('%', ?, '%') LIMIT 1",
        [seksi.nama]
      ) as { id: number, category_id: number } | undefined;
      
      if (existingSection) {
        targetCategoryId = existingSection.category_id;
        targetSectionId = existingSection.id;
      } else {
        // Fallback: create in DPP (category 2)
        targetCategoryId = 2;
        targetSectionId = await getOrCreateSection(targetCategoryId, seksi.nama);
      }
    } else if (isBgkp) {
      targetCategoryId = 3; // BGKP
      targetSectionId = null;
    } else {
      // Fallback to legacy article_categories mapping (Gereja/Paroki)
      const syncCheck = await shouldSyncToKronik(categoryIds);
      if (syncCheck.shouldSync && syncCheck.kronikCategoryId) {
        targetCategoryId = syncCheck.kronikCategoryId;
      } else {
        // Not configured for sync
        console.log(`[News-Kronik Sync] News ${newsId} has no tags for kronik sync`);
        return;
      }
    }

    if (!targetCategoryId) return;

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
      targetCategoryId,
      targetSectionId
    );

  } catch (error) {
    console.error('[News-Kronik Sync] Error in handleNewsKronikSync:', error);
  }
}
