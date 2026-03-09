import { allQuery } from '../../database/db'
import { requireAuth, requirePermission } from '../../utils/auth'
import { readdir, stat } from 'node:fs/promises'
import { join } from 'node:path'

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  // Allow read access for content management permissions
  const authContext = event.context.auth
  if (!authContext || !authContext.permissions?.some((perm: string) =>
    ['manage_articles', 'manage_news', 'manage_gallery', 'manage_agenda', 'manage_users', 'manage_rooms', 'manage_bookings'].includes(perm)
  )) {
    throw createError({
      statusCode: 403,
      statusMessage: 'Forbidden: Insufficient permissions'
    })
  }

  try {
    // Get article count with status breakdown
    const articlesResult = await allQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status='published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status='draft' THEN 1 ELSE 0 END) as draft
      FROM articles
    `, [])
    
    // Get news count with status breakdown
    const newsResult = await allQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status='published' THEN 1 ELSE 0 END) as published,
        SUM(CASE WHEN status='draft' THEN 1 ELSE 0 END) as draft
      FROM news
    `, [])

    // Get agenda count
    const agendaResult = await allQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN start_date >= CURDATE() THEN 1 ELSE 0 END) as upcoming
      FROM agendas
    `, [])

    // Get bookings count
    const bookingsResult = await allQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN status='pending' THEN 1 ELSE 0 END) as pending,
        SUM(CASE WHEN status='approved' THEN 1 ELSE 0 END) as approved
      FROM bookings
    `, [])

    // Get documents count
    const documentsResult = await allQuery(`
      SELECT COUNT(*) as total FROM documents
    `, [])

    // Get users count (no is_active column in users table)
    const usersResult = await allQuery(`
      SELECT COUNT(*) as total
      FROM users
    `, [])

    // Get rooms count (is_active, not is_available)
    const roomsResult = await allQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_active=1 THEN 1 ELSE 0 END) as available
      FROM rooms
    `, [])

    // Get mass schedules count
    const massSchedulesResult = await allQuery(`
      SELECT 
        (SELECT COUNT(*) FROM regular_mass_schedules WHERE is_active=1) as regular_schedules,
        (SELECT COUNT(*) FROM liturgy_schedules WHERE status='active') as special_schedules
    `, [])

    // Get contact messages count (is_read boolean, not status field)
    const messagesResult = await allQuery(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN is_read=0 THEN 1 ELSE 0 END) as unread
      FROM contact_messages
    `, [])

    // Get albums and photos count from filesystem (matching gallery API)
    let albums = 0
    let photos = 0

    try {
      const albumsBaseDir = 'public/images/album'
      const albumFolders = await readdir(albumsBaseDir)

      for (const folderName of albumFolders) {
        const albumPath = join(albumsBaseDir, folderName)
        const itemStat = await stat(albumPath)

        if (itemStat.isDirectory()) {
          albums++

          // Count photos in this album
          const photoFiles = await readdir(albumPath)
          const imageFiles = photoFiles.filter(file => /\.(jpg|jpeg|png|gif|webp)$/i.test(file))
          photos += imageFiles.length
        }
      }
    } catch (error) {
      console.warn('Could not read gallery directory for stats:', error)
      // Continue with 0 values if directory doesn't exist
    }

    return {
      // Content stats
      articles: parseInt((articlesResult[0] as any)?.total || 0),
      articlesPublished: parseInt((articlesResult[0] as any)?.published || 0),
      articlesDraft: parseInt((articlesResult[0] as any)?.draft || 0),
      news: parseInt((newsResult[0] as any)?.total || 0),
      newsPublished: parseInt((newsResult[0] as any)?.published || 0),
      newsDraft: parseInt((newsResult[0] as any)?.draft || 0),
      
      // Media stats
      albums,
      photos,
      documents: parseInt((documentsResult[0] as any)?.total || 0),
      
      // Operations stats
      agenda: parseInt((agendaResult[0] as any)?.total || 0),
      agendaUpcoming: parseInt((agendaResult[0] as any)?.upcoming || 0),
      bookings: parseInt((bookingsResult[0] as any)?.total || 0),
      bookingsPending: parseInt((bookingsResult[0] as any)?.pending || 0),
      bookingsApproved: parseInt((bookingsResult[0] as any)?.approved || 0),
      rooms: parseInt((roomsResult[0] as any)?.total || 0),
      roomsAvailable: parseInt((roomsResult[0] as any)?.available || 0),
      massSchedulesRegular: parseInt((massSchedulesResult[0] as any)?.regular_schedules || 0),
      massSchedulesSpecial: parseInt((massSchedulesResult[0] as any)?.special_schedules || 0),
      
      // Community stats
      users: parseInt((usersResult[0] as any)?.total || 0),
      usersActive: 0, // users table doesn't have is_active column
      contactMessages: parseInt((messagesResult[0] as any)?.total || 0),
      unreadMessages: parseInt((messagesResult[0] as any)?.unread || 0)
    }
  } catch (error) {
    console.error('Error fetching stats:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch statistics'
    })
  }
})
