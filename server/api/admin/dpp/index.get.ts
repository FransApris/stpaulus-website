// Admin API: Get all DPP members (including inactive)
import { allQuery } from '~/server/database/db'
import { requireAuth } from '~/server/utils/auth'

export default defineEventHandler(async (event) => {
  try {
    // Check authentication
    requireAuth(event)

    const sql = `
      SELECT 
        id,
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
        is_active,
        created_at,
        updated_at
      FROM dpp_members 
      ORDER BY display_order ASC, id ASC
    `

    const members = await allQuery(sql) as any[]

    return {
      success: true,
      data: members,
      total: members.length
    }
  } catch (error: any) {
    console.error('Error fetching DPP members:', error)
    throw createError({
      statusCode: error.statusCode || 500,
      statusMessage: error.statusMessage || 'Failed to fetch DPP members',
      message: error.message
    })
  }
})
