// Public API: Get all active BGKP members
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
    const sql = `
      SELECT 
        id,
        name,
        position,
        position_type,
        position_level,
        is_ex_officio,
        display_order,
        period_start_date,
        period_end_date,
        decree_number,
        decree_date
      FROM bgkp_members 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, id ASC
    `

    const members = await allQuery(sql) as any[]

    // Group by position type for better display
    const grouped = {
      ketua: members.filter(m => m.position_type === 'ketua'),
      wakil_ketua: members.filter(m => m.position_type === 'wakil_ketua'),
      sekretaris: members.filter(m => m.position_type === 'sekretaris'),
      bendahara: members.filter(m => m.position_type === 'bendahara'),
      anggota: members.filter(m => m.position_type === 'anggota')
    }

    return {
      success: true,
      data: {
        all: members,
        grouped: grouped,
        total: members.length
      }
    }
  } catch (error: any) {
    console.error('Error fetching BGKP members:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch BGKP members',
      message: error.message
    })
  }
})
