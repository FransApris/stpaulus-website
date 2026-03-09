// Admin API: Create new DPP member
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
      auto_shift_order,
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

    // Auto-shift logic: If auto_shift_order is true, increment display_order of existing records
    if (auto_shift_order && display_order !== undefined) {
      let shiftConditions = [`display_order >= ?`]
      let shiftParams = [display_order]

      // Apply category-specific constraints for shifting
      if (position_category === 'pengurus_inti') {
        shiftConditions.push(`position_category = ?`)
        shiftParams.push('pengurus_inti')
      } else if (position_category === 'ketua_wilayah' || position_category === 'ketua_lingkungan') {
        shiftConditions.push(`position_category IN (?, ?)`)
        shiftParams.push('ketua_wilayah', 'ketua_lingkungan')
      } else if (bidang_name) {
        shiftConditions.push(`bidang_name = ?`)
        shiftParams.push(bidang_name)
      }

      const shiftSql = `
        UPDATE dpp_members 
        SET display_order = display_order + 1 
        WHERE ${shiftConditions.join(' AND ')}
      `

      await runQuery(shiftSql, shiftParams)
    }

    const sql = `
      INSERT INTO dpp_members (
        name, position, position_category, position_type, position_level,
        bidang_name, seksi_name, sub_seksi_name, wilayah_name, lingkungan_number,
        is_couple, couple_member_id, is_ex_officio, display_order,
        period_start_date, period_end_date, decree_number, decree_date,
        notes, is_active
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
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
      is_active !== undefined ? is_active : true
    ]

    const result = await runQuery(sql, params) as any

    return {
      success: true,
      message: 'DPP member created successfully' + (auto_shift_order ? ' (with order adjustment)' : ''),
      data: {
        id: result.insertId
      }
    }
  } catch (error: any) {
    console.error('Error creating DPP member:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to create DPP member',
      message: error.message
    })
  }
})
