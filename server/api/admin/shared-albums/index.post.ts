// POST /api/shared-albums - Create new shared album
import { getConnection } from '~/server/database/db';
import { requireAuth } from '~/server/utils/auth';

export default defineEventHandler(async (event) => {
  // Verify admin authentication - middleware already verified token
  const auth = event.context.auth;
  if (!auth?.role || !['admin', 'super_admin', 'admin_komsos', 'admin_sekretariat'].includes(auth.role)) {
    throw createError({
      statusCode: 403,
      message: 'Admin access required'
    });
  }
  
  const body = await readBody(event);
  const { title, description, share_url, thumbnail_url, is_active, display_order } = body;
  
  // Validation
  if (!title || !share_url) {
    throw createError({
      statusCode: 400,
      message: 'Title and share URL are required'
    });
  }
  
  // Validate Google Photos URL
  const validUrlPatterns = [
    /^https:\/\/photos\.app\.goo\.gl\/.+/,
    /^https:\/\/photos\.google\.com\/share\/.+/
  ];
  
  const isValidUrl = validUrlPatterns.some(pattern => pattern.test(share_url));
  if (!isValidUrl) {
    throw createError({
      statusCode: 400,
      message: 'Invalid Google Photos share URL'
    });
  }
  
  let connection;
  try {
    connection = await getConnection();
    
    const [result] = await connection.query(
      `INSERT INTO google_shared_albums 
       (title, description, share_url, thumbnail_url, is_active, display_order) 
       VALUES (?, ?, ?, ?, ?, ?)`,
      [
        title,
        description || null,
        share_url,
        thumbnail_url || null,
        is_active !== undefined ? is_active : true,
        display_order || 0
      ]
    );
    
    const [newAlbum] = await connection.query(
      'SELECT * FROM google_shared_albums WHERE id = ?',
      [(result as any).insertId]
    );
    
    return {
      success: true,
      message: 'Album created successfully',
      data: (newAlbum as any[])[0]
    };
  } catch (error: any) {
    console.error('Error creating shared album:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 409,
        message: 'This album URL already exists'
      });
    }
    
    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to create album'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
