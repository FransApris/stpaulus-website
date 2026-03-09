// PUT /api/shared-albums/:id - Update shared album
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
  
  const id = getRouterParam(event, 'id');
  const body = await readBody(event);
  const { title, description, share_url, thumbnail_url, is_active, display_order } = body;
  
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'Invalid album ID'
    });
  }
  
  // Validate Google Photos URL if provided
  if (share_url) {
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
  }
  
  let connection;
  try {
    connection = await getConnection();
    
    // Check if album exists
    const [existing] = await connection.query(
      'SELECT id FROM google_shared_albums WHERE id = ?',
      [id]
    );
    
    if ((existing as any[]).length === 0) {
      throw createError({
        statusCode: 404,
        message: 'Album not found'
      });
    }
    
    // Build update query dynamically
    const updates: string[] = [];
    const values: any[] = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      values.push(title);
    }
    if (description !== undefined) {
      updates.push('description = ?');
      values.push(description);
    }
    if (share_url !== undefined) {
      updates.push('share_url = ?');
      values.push(share_url);
    }
    if (thumbnail_url !== undefined) {
      updates.push('thumbnail_url = ?');
      values.push(thumbnail_url);
    }
    if (is_active !== undefined) {
      updates.push('is_active = ?');
      values.push(is_active);
    }
    if (display_order !== undefined) {
      updates.push('display_order = ?');
      values.push(display_order);
    }
    
    if (updates.length === 0) {
      throw createError({
        statusCode: 400,
        message: 'No fields to update'
      });
    }
    
    values.push(id);
    
    await connection.query(
      `UPDATE google_shared_albums SET ${updates.join(', ')} WHERE id = ?`,
      values
    );
    
    const [updatedAlbum] = await connection.query(
      'SELECT * FROM google_shared_albums WHERE id = ?',
      [id]
    );
    
    return {
      success: true,
      message: 'Album updated successfully',
      data: (updatedAlbum as any[])[0]
    };
  } catch (error: any) {
    console.error('Error updating shared album:', error);
    
    if (error.code === 'ER_DUP_ENTRY') {
      throw createError({
        statusCode: 409,
        message: 'This album URL already exists'
      });
    }
    
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to update album'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
