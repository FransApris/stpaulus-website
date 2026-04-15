import { allQuery, getQuery as dbGetOne } from '../../database/db'
import { requireAuth } from '../../utils/auth'

export default defineEventHandler(async (event) => {
  const decoded = requireAuth(event)
  const userId = decoded.userId

  const admin = await dbGetOne(
    `SELECT r.name as role_name FROM users u LEFT JOIN roles r ON u.role_id = r.id WHERE u.id = ?`,
    [userId]
  ) as any

  if (!admin) throw createError({ statusCode: 403, statusMessage: 'Akses ditolak' })
  const role = admin.role_name

  const result: Record<string, any> = { role }

  // ── Super Admin & Admin Sekretariat ──────────────────────────────
  if (role === 'super_admin' || role === 'admin_sekretariat') {
    // Pending bookings count
    const pendingRows = await dbGetOne(
      `SELECT COUNT(*) as cnt FROM bookings WHERE status = 'PENDING' AND deleted_at IS NULL`, []
    ) as any
    result.pendingBookings = Number(pendingRows?.cnt) || 0

    // Upcoming agenda (next 7 days)
    const upcomingAgenda = await allQuery(`
      SELECT title, event_date, start_time, location
      FROM agenda
      WHERE event_date BETWEEN CURDATE() AND DATE_ADD(CURDATE(), INTERVAL 7 DAY)
      ORDER BY event_date ASC, start_time ASC
      LIMIT 5
    `, []).catch(() => [])
    result.upcomingAgenda = upcomingAgenda

    // Rooms booked today
    const todayBookings = await allQuery(`
      SELECT b.id, r.name as room_name, b.start_time, b.end_time,
             u.full_name as user_name, b.event_name
      FROM bookings b
      JOIN rooms r ON b.room_id = r.id
      JOIN users u ON b.user_id = u.id
      WHERE DATE(b.start_time) = CURDATE()
        AND b.status = 'APPROVED'
        AND b.deleted_at IS NULL
      ORDER BY b.start_time ASC
      LIMIT 8
    `, []).catch(() => [])
    result.todayBookings = todayBookings
  }

  // ── Super Admin only ─────────────────────────────────────────────
  if (role === 'super_admin') {
    // Pending user activations
    const pendingUsersRows = await dbGetOne(
      `SELECT COUNT(*) as cnt FROM users WHERE status = 'PENDING' AND (role_id IS NULL OR role_id = 0)`, []
    ) as any
    result.pendingUsers = Number(pendingUsersRows?.cnt) || 0

    // Recent admin activity (last 5 content changes)
    const recentActivity = await allQuery(`
      SELECT 'artikel' as type, title, author, updated_at FROM articles
      UNION ALL
      SELECT 'berita' as type, title, author, updated_at FROM news
      ORDER BY updated_at DESC
      LIMIT 5
    `, []).catch(() => [])
    result.recentActivity = recentActivity
  }

  // ── Admin Komsos only ────────────────────────────────────────────
  if (role === 'admin_komsos') {
    // Stale drafts (articles draft > 30 days)
    const staleDraftsRows = await dbGetOne(
      `SELECT COUNT(*) as cnt FROM articles WHERE status = 'draft' AND created_at < DATE_SUB(NOW(), INTERVAL 30 DAY)`, []
    ) as any
    result.staleDrafts = Number(staleDraftsRows?.cnt) || 0

    // Published this month
    const thisMonthRows = await dbGetOne(`
      SELECT
        SUM(CASE WHEN type='article' THEN 1 ELSE 0 END) as articles,
        SUM(CASE WHEN type='news' THEN 1 ELSE 0 END) as news
      FROM (
        SELECT 'article' as type FROM articles
        WHERE status='published' AND MONTH(published_at)=MONTH(NOW()) AND YEAR(published_at)=YEAR(NOW())
        UNION ALL
        SELECT 'news' as type FROM news
        WHERE status='published' AND MONTH(published_at)=MONTH(NOW()) AND YEAR(published_at)=YEAR(NOW())
      ) combined
    `, []).catch(() => null) as any
    result.publishedThisMonth = {
      articles: Number(thisMonthRows?.articles) || 0,
      news: Number(thisMonthRows?.news) || 0
    }

    // Active FAQ count
    const faqRows = await dbGetOne(
      `SELECT COUNT(*) as cnt FROM chatbot_faqs WHERE is_active = 1`, []
    ) as any
    result.activeFaq = Number(faqRows?.cnt) || 0

    // Latest kronik entries
    const latestKronik = await allQuery(`
      SELECT ke.what_title as title, ke.when_date, ks.title as section
      FROM kronik_entries ke
      LEFT JOIN kronik_sections ks ON ke.section_id = ks.id
      ORDER BY ke.created_at DESC
      LIMIT 3
    `, []).catch(() => [])
    result.latestKronik = latestKronik
  }

  return result
})
