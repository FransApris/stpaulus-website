// API: Create new pastor
// Path: POST /api/admin/pastors
// Purpose: Add new pastor to database

import { runQuery, getQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
    try {
        // TODO: Add authentication check
        // const user = await requireAuth(event)
        // if (!user || !user.isAdmin) throw createError({ statusCode: 403, message: 'Forbidden' })

        const body = await readBody(event)

        // Validate required fields
        if (!body.name || !body.start_year) {
            throw createError({
                statusCode: 400,
                message: 'Name and start year are required'
            })
        }

        // Prepare data - convert undefined to null
        const pastorData = {
            name: body.name,
            full_name: body.full_name || null,
            title: body.title || null,
            position_type: body.position_type || 'kepala_paroki',
            start_year: body.start_year,
            end_year: body.end_year || null,
            status: body.status || 'alumni',
            photo_url: body.photo_url || null,
            bio: body.bio || null,
            quote: body.quote || null,
            achievements: body.achievements || null,
            email: body.email || null,
            phone: body.phone || null,
            birth_place: body.birth_place || null,
            birth_date: body.birth_date || null,
            ordination_date: body.ordination_date || null,
            display_order: body.display_order || 0,
            is_visible: body.is_visible !== undefined ? body.is_visible : true,
            created_by: null, // TODO: Add user.id when auth is implemented
            updated_by: null
        }

        // Insert into database
        const sql = `
      INSERT INTO pastors (
        name, full_name, title, position_type, start_year, end_year, status,
        photo_url, bio, quote, achievements, email, phone,
        birth_place, birth_date, ordination_date,
        display_order, is_visible, created_by, updated_by
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `

        const values = [
            pastorData.name,
            pastorData.full_name,
            pastorData.title,
            pastorData.position_type,
            pastorData.start_year,
            pastorData.end_year,
            pastorData.status,
            pastorData.photo_url,
            pastorData.bio,
            pastorData.quote,
            pastorData.achievements,
            pastorData.email,
            pastorData.phone,
            pastorData.birth_place,
            pastorData.birth_date,
            pastorData.ordination_date,
            pastorData.display_order,
            pastorData.is_visible,
            pastorData.created_by,
            pastorData.updated_by
        ]

        const result = await runQuery(sql, values)

        console.log(`[Admin Pastors API] Created pastor ID: ${result.insertId}`)

        // Fetch the created pastor
        const created = await getQuery('SELECT * FROM pastors WHERE id = ?', [result.insertId]) as any

        return {
            success: true,
            message: 'Pastor created successfully',
            data: created
        }

    } catch (error: any) {
        console.error('[Admin Pastors API] Error creating pastor:', error)

        throw createError({
            statusCode: 500,
            message: 'Failed to create pastor',
            data: error.message
        })
    }
})
