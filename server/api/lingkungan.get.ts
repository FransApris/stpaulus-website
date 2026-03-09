// API: Get all lingkungan (public endpoint)
// Path: GET /api/lingkungan
// Purpose: Fetch visible lingkungan for public display, merged with DPP ketua data

import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        console.log('[Lingkungan API] Fetching visible lingkungan and DPP ketua')

        // Fetch visible lingkungan from database
        const dbLingkunganSql = `
            SELECT 
                l.id,
                l.no,
                l.nama,
                l.wilayah_id,
                l.wilayah_text,
                w.nama as wilayah_nama,
                COALESCE(w.nama, l.wilayah_text) as wilayah_display,
                l.ketua,
                l.telp,
                l.no_hp_pengurus,
                l.email,
                l.jumlah_kk,
                l.jumlah_jiwa,
                l.color,
                l.keterangan
            FROM lingkungan l
            LEFT JOIN wilayah w ON l.wilayah_id = w.id
            WHERE l.is_visible = 1
        `

        // Fetch ketua lingkungan from DPP
        const dppKetuaSql = `
            SELECT 
                dpp.id,
                dpp.name as ketua,
                dpp.wilayah_name,
                dpp.lingkungan_number as no,
                w.id as wilayah_id
            FROM dpp_members dpp
            LEFT JOIN wilayah w ON w.nama = dpp.wilayah_name
            WHERE dpp.position_category = 'ketua_lingkungan'
            AND dpp.is_active = 1
            ORDER BY dpp.display_order ASC
        `

        const [dbLingkungan, dppKetua] = await Promise.all([
            allQuery(dbLingkunganSql, []) as Promise<any[]>,
            allQuery(dppKetuaSql, []) as Promise<any[]>
        ])

        console.log(`[Lingkungan API] Found ${dbLingkungan.length} DB lingkungan and ${dppKetua.length} DPP ketua`)

        // Merge data: DB lingkungan + DPP ketua info
        const mergedList = []
        const processedKeys = new Set()

        // Step 1: Add DB lingkungan with DPP ketua overlay
        dbLingkungan.forEach(ling => {
            const wilayahName = ling.wilayah_display || ling.wilayah_nama || ling.wilayah_text
            const key = `${wilayahName}-${ling.no}`
            
            // Find matching DPP ketua
            const dppMatch = dppKetua.find(d => 
                d.wilayah_name === wilayahName && 
                parseInt(d.no) === parseInt(ling.no)
            )

            processedKeys.add(key)
            
            mergedList.push({
                id: ling.id,
                no: ling.no,
                nama: ling.nama,
                wilayah_id: ling.wilayah_id,
                wilayah_text: ling.wilayah_text,
                wilayah_nama: ling.wilayah_nama,
                wilayah_display: wilayahName,
                ketua: dppMatch?.ketua || ling.ketua || '-',
                telp: ling.no_hp_pengurus || ling.telp,
                no_hp_pengurus: ling.no_hp_pengurus,
                email: ling.email,
                jumlah_kk: ling.jumlah_kk || 0,
                jumlah_jiwa: ling.jumlah_jiwa || 0,
                color: ling.color || '#3B82F6',
                keterangan: ling.keterangan,
                has_dpp_ketua: !!dppMatch
            })
        })

        // Step 2: Add DPP-only ketua lingkungan (not in DB yet)
        dppKetua.forEach(dpp => {
            const key = `${dpp.wilayah_name}-${dpp.no}`
            
            if (!processedKeys.has(key)) {
                processedKeys.add(key)
                
                mergedList.push({
                    id: `dpp_${dpp.id}`,
                    no: parseInt(dpp.no),
                    nama: `Lingkungan ${dpp.no}`,
                    wilayah_id: dpp.wilayah_id,
                    wilayah_text: dpp.wilayah_name,
                    wilayah_nama: dpp.wilayah_name,
                    wilayah_display: dpp.wilayah_name,
                    ketua: dpp.ketua || '-',
                    telp: null,
                    no_hp_pengurus: null,
                    email: null,
                    jumlah_kk: 0,
                    jumlah_jiwa: 0,
                    color: '#3B82F6',
                    keterangan: null,
                    has_dpp_ketua: true,
                    source: 'dpp'
                })
            }
        })

        // Sort by wilayah and then by no
        mergedList.sort((a, b) => {
            const wilayahCompare = (a.wilayah_display || '').localeCompare(b.wilayah_display || '')
            if (wilayahCompare !== 0) return wilayahCompare
            return (a.no || 0) - (b.no || 0)
        })

        console.log(`[Lingkungan API] Merged result: ${mergedList.length} lingkungan total`)

        // Calculate totals
        const stats = {
            totalLingkungan: mergedList.length,
            totalKK: mergedList.reduce((sum, l) => sum + (l.jumlah_kk || 0), 0),
            totalJiwa: mergedList.reduce((sum, l) => sum + (l.jumlah_jiwa || 0), 0),
            totalWilayah: new Set(mergedList.map(l => l.wilayah_display).filter(Boolean)).size
        }

        return {
            success: true,
            data: mergedList,
            stats
        }

    } catch (error: any) {
        console.error('[Lingkungan API] Error fetching lingkungan:', error)
        console.error('[Lingkungan API] Error stack:', error.stack)

        throw createError({
            statusCode: 500,
            message: 'Failed to fetch lingkungan',
            data: error.message
        })
    }
})
