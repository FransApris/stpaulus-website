/**
 * API Endpoint: GET /api/admin/parish-statistics/history
 * Purpose: Get audit log history of statistics changes
 * Authentication: Required
 */

import { allQuery } from '~/server/database/db'
import { verifyToken } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
    try {
        // Check authentication
        const authHeader = getHeader(event, 'authorization')

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw createError({
                statusCode: 401,
                message: 'Unauthorized: Please login first'
            })
        }

        const token = authHeader.slice(7)
        const payload = verifyToken(token)

        if (!payload?.userId) {
            throw createError({
                statusCode: 401,
                message: 'Invalid token'
            })
        }

        // Get query parameters
        const queryParams = getQuery(event)
        const stat_key = queryParams.stat_key as string
        const limit = parseInt(queryParams.limit as string) || 50

        let sql = `
      SELECT 
        psl.*,
        ps.stat_label,
        DATE_FORMAT(psl.changed_at, '%d %b %Y %H:%i') as formatted_date
      FROM parish_statistics_log psl
      LEFT JOIN parish_statistics ps ON psl.stat_key = ps.stat_key
    `

        const params: any[] = []

        if (stat_key) {
            sql += ' WHERE psl.stat_key = ?'
            params.push(stat_key)
        }

        sql += ` ORDER BY psl.changed_at DESC LIMIT ${limit}`

        const history = await allQuery(sql, params)

        return {
            success: true,
            data: history,
            count: history.length
        }

    } catch (error: any) {
        console.error('Error fetching statistics history:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to fetch statistics history'
        })
    }
})
