// Admin API: Create new BGKP member
import { defineEventHandler, createError, readBody } from 'h3'
import { runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    requireAuth(event)

    const body = await readBody(event)
    const {
      name,
      position,
      position_type,
      position_level,
      is_ex_officio,
      display_order,
      period_start_date,
      period_end_date,
      decree_number,
      decree_date,
      notes,
      is_active
    } = body

    // Validation
    if (!name || !position || !position_type) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, position, and position_type are required'
      })
    }

    const sql = `
      INSERT INTO bgkp_members (
        name, position, position_type, position_level, is_ex_officio,
        display_order, period_start_date, period_end_date, decree_number,
        decree_date, notes, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

    const params = [
      name,
      position,
      position_type,
      position_level || null,
      is_ex_officio || false,
      display_order || 0,
      period_start_date || null,
      period_end_date || null,
      decree_number || null,
      decree_date || null,
      notes || null,
      is_active !== undefined ? is_active : true
    ]

    const result = await runQuery(sql, params) as any

    return {
      success: true,
      message: 'BGKP member created successfully',
      data: {
        id: result.insertId
      }
    }
  } catch (error: any) {
    console.error('Error creating BGKP member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create BGKP member',
      message: error.message
    })
  }
})
