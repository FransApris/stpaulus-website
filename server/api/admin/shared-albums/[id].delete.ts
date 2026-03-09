// DELETE /api/shared-albums/:id - Delete shared album
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
  
  if (!id || isNaN(Number(id))) {
    throw createError({
      statusCode: 400,
      message: 'Invalid album ID'
    });
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
    
    await connection.query(
      'DELETE FROM google_shared_albums WHERE id = ?',
      [id]
    );
    
    return {
      success: true,
      message: 'Album deleted successfully'
    };
  } catch (error: any) {
    console.error('Error deleting shared album:', error);
    throw createError({
      statusCode: error.statusCode || 500,
      message: error.message || 'Failed to delete album'
    });
  } finally {
    if (connection) {
      connection.release();
    }
  }
});
