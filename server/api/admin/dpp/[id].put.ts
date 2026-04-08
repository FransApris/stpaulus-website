// Admin API: Update DPP member
import { defineEventHandler, createError, readBody, getRouterParam } from 'h3'
import { runQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    requireAuth(event)

    const id = getRouterParam(event, 'id')
    const body = await readBody(event)
    
    console.log('[DPP UPDATE] ID:', id, 'Body:', JSON.stringify(body, null, 2))
    
    const {
      name,
      position,
      position_category,
      position_type,
      position_level,
      bidang_name,
      seksi_name,
      sub_seksi_name,
      wilayah_name,
      lingkungan_number,
      is_couple,
      couple_member_id,
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
    if (!name || !position || !position_category) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Name, position, and position_category are required'
      })
    }

    const sql = `
      UPDATE dpp_members 
      SET 
        name = ?,
        position = ?,
        position_category = ?,
        position_type = ?,
        position_level = ?,
        bidang_name = ?,
        seksi_name = ?,
        sub_seksi_name = ?,
        wilayah_name = ?,
        lingkungan_number = ?,
        is_couple = ?,
        couple_member_id = ?,
        is_ex_officio = ?,
        display_order = ?,
        period_start_date = ?,
        period_end_date = ?,
        decree_number = ?,
        decree_date = ?,
        notes = ?,
        is_active = ?
      WHERE id = ?
    `

    const params = [
      name,
      position,
      position_category,
      position_type || null,
      position_level || null,
      bidang_name || null,
      seksi_name || null,
      sub_seksi_name || null,
      wilayah_name || null,
      lingkungan_number || null,
      is_couple || false,
      couple_member_id || null,
      is_ex_officio || false,
      display_order || 0,
      period_start_date || null,
      period_end_date || null,
      decree_number || null,
      decree_date || null,
      notes || null,
      is_active !== undefined ? is_active : true,
      id
    ]

    console.log('[DPP UPDATE] SQL Params:', params)

    await runQuery(sql, params)

    console.log('[DPP UPDATE] Success for ID:', id)

    return {
      success: true,
      message: 'DPP member updated successfully'
    }
  } catch (error: any) {
    console.error('[DPP UPDATE ERROR]:', error)
    console.error('[DPP UPDATE ERROR] Stack:', error.stack)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to update DPP member',
      message: error.message
    })
  }
})
