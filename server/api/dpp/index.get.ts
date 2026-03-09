// Public API: Get all active DPP members
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  try {
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
        is_ex_officio,
        display_order,
        period_start_date,
        period_end_date,
        decree_number,
        decree_date
      FROM dpp_members 
      WHERE is_active = TRUE 
      ORDER BY display_order ASC, id ASC
    `

    const members = await allQuery(sql) as any[]

    // Group by position category for better display
    const grouped = {
      pengurus_inti: members.filter(m => m.position_category === 'pengurus_inti'),
      bidang_pembinaan: members.filter(m => m.position_category === 'bidang_pembinaan'),
      bidang_sumber: members.filter(m => m.position_category === 'bidang_sumber'),
      bidang_kerasulan_khusus: members.filter(m => m.position_category === 'bidang_kerasulan_khusus'),
      bidang_kerasulan_umum: members.filter(m => m.position_category === 'bidang_kerasulan_umum'),
      ketua_wilayah: members.filter(m => m.position_category === 'ketua_wilayah'),
      ketua_lingkungan: members.filter(m => m.position_category === 'ketua_lingkungan')
    }

    // Group wilayah members
    const wilayahGroups: any = {}
    members.filter(m => m.wilayah_name).forEach(m => {
      if (!wilayahGroups[m.wilayah_name]) {
        wilayahGroups[m.wilayah_name] = []
      }
      wilayahGroups[m.wilayah_name].push(m)
    })

    return {
      success: true,
      data: {
        all: members,
        grouped: grouped,
        wilayah: wilayahGroups,
        total: members.length
      }
    }
  } catch (error: any) {
    console.error('Error fetching DPP members:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Failed to fetch DPP members',
      message: error.message
    })
  }
})
