// GET /api/shared-albums/:id - Get single shared album
import { getConnection } from '~/server/database/db';

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id');
  
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'Invalid album ID'
    });
  }
  
  let connection;
  try {
    connection = await getConnection();
    
    const [albums] = await connection.query(
      'SELECT * FROM google_shared_albums WHERE id = ?',
      [id]
    );
    
    if ((albums as any[]).length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Album not found'
      });
    }
    
    return {
      success: true,
      data: (albums as any[])[0]
    };
  } catch (error: any) {
    console.error('Error fetching shared album:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to fetch album'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
