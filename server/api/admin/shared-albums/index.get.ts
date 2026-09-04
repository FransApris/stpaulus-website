// GET /api/shared-albums - List all shared albums
import { getConnection } from '~/server/database/db';
import { existsSync } from 'node:fs';
import { join } from 'node:path';

const normalizeThumbnailUrl = (url?: string | null): string | null => {
  if (!url) return null;

  let normalized = url.trim();
  if (!normalized) return null;

  if (normalized.startsWith('http://')) {
    normalized = `https://${normalized.slice(7)}`;
  }

  if (normalized.startsWith('/uploads/')) {
    const localPath = join(process.cwd(), 'public', normalized.replace(/^\//, ''));
    if (!existsSync(localPath)) {
      return null;
    }
  }

  return normalized;
};

export default defineEventHandler(async (event) => {
  const query = getQuery(event);
  const activeOnly = query.active === 'true';

  let connection;
  try {
    connection = await getConnection();

    let sql = 'SELECT * FROM google_shared_albums';
    if (activeOnly) {
      sql += ' WHERE is_active = TRUE';
    }
    // Urutkan dari album terbaru ke terlama (kronologis)
    sql += ' ORDER BY created_at DESC';

    const [albums] = await connection.query(sql);
    const normalizedAlbums = (albums as any[]).map((album) => ({
      ...album,
      thumbnail_url: normalizeThumbnailUrl(album.thumbnail_url)
    }));

    return {
      success: true,
      data: normalizedAlbums
    };
  } catch (error: any) {
    console.error('Error fetching shared albums:', error);
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to fetch albums'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
