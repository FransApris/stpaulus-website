// GET /api/shared-albums - List all shared albums
import { getConnection } from '~/server/database/db';

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
    sql += ' ORDER BY display_order ASC, created_at DESC';
    
    const [albums] = await connection.query(sql);
    
    return {
      success: true,
      data: albums
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
