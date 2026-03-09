/**
 * API Endpoint: PUT /api/admin/parish-statistics
 * Purpose: Update parish statistics (Admin only)
 * Authentication: Required
 */

import { allQuery, runQuery, getQuery } from '~/server/database/db'
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

        if (!payload?.userId || !payload?.username) {
            throw createError({
                statusCode: 401,
                message: 'Invalid token'
            })
        }

        // Get request body
        const body = await readBody(event)
        const { stat_key, stat_value, stat_label, stat_subtitle, change_reason } = body

        // Validate required fields
        if (!stat_key || stat_value === undefined) {
            throw createError({
                statusCode: 400,
                message: 'Missing required fields: stat_key and stat_value'
            })
        }

        // Validate stat_value is a number
        const numValue = parseInt(stat_value)
        if (isNaN(numValue) || numValue < 0) {
            throw createError({
                statusCode: 400,
                message: 'stat_value must be a positive number'
            })
        }

        // Get old value for audit log
        const oldData = await getQuery(
            'SELECT stat_value FROM parish_statistics WHERE stat_key = ?',
            [stat_key]
        )

        // Update statistics
        const updateFields = ['stat_value = ?', 'updated_by = ?', 'updated_at = NOW()']
        const updateValues = [numValue, payload.username]

        if (stat_label) {
            updateFields.push('stat_label = ?')
            updateValues.push(stat_label)
        }

        if (stat_subtitle) {
            updateFields.push('stat_subtitle = ?')
            updateValues.push(stat_subtitle)
        }

        updateValues.push(stat_key) // For WHERE clause

        await runQuery(
            `UPDATE parish_statistics 
       SET ${updateFields.join(', ')}
       WHERE stat_key = ?`,
            updateValues
        )

        // Insert audit log
        if (oldData && oldData.stat_value !== numValue) {
            await runQuery(
                `INSERT INTO parish_statistics_log 
         (stat_key, old_value, new_value, changed_by, change_reason) 
         VALUES (?, ?, ?, ?, ?)`,
                [
                    stat_key,
                    oldData.stat_value,
                    numValue,
                    payload.username,
                    change_reason || 'Updated via admin panel'
                ]
            )
        }

        // Fetch updated data
        const updated = await getQuery(
            'SELECT * FROM parish_statistics WHERE stat_key = ?',
            [stat_key]
        )

        return {
            success: true,
            message: 'Statistics updated successfully',
            data: updated
        }

    } catch (error: any) {
        console.error('Error updating parish statistics:', error)

        if (error.statusCode) {
            throw error
        }

        throw createError({
            statusCode: 500,
            message: 'Failed to update parish statistics'
        })
    }
})
