/**
 * API Endpoint: GET /api/parish-statistics
 * Purpose: Fetch parish statistics for public display
 * Used by: QuickStatsCounter.vue component
 */

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        const stats = await allQuery(`
      SELECT 
        id,
        stat_key,
        stat_value,
        stat_label,
        stat_subtitle,
        icon_type,
        display_order,
        DATE_FORMAT(updated_at, '%d %b %Y') as last_updated
      FROM parish_statistics
      WHERE is_active = TRUE
      ORDER BY display_order ASC
    `)

        return {
            success: true,
            data: stats,
            timestamp: new Date().toISOString()
        }
    } catch (error) {
        console.error('Error fetching parish statistics:', error)

        return {
            success: false,
            error: 'Failed to fetch parish statistics',
            data: []
        }
    }
})
