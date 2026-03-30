// Admin API: Update kronik entry
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { getRouterParam, readBody } from 'h3'

export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  if (!id) {
    throw createError({
      statusCode: 400,
      message: 'Entry ID is required'
    })
  }

  try {
    const body = await readBody(event)

    const {
      category_id,
      section_id,
      what_title,
      what_description,
      who_involved,
      when_date,
      when_duration,
      where_location,
      where_address,
      why_purpose,
      how_process,
      featured_image,
      gallery,
      status
    } = body

    // Validate required fields
    if (!category_id || !what_title || !what_description || !when_date) {
      throw createError({
        statusCode: 400,
        message: 'Missing required fields: category_id, what_title, what_description, when_date'
      })
    }

    // PROTECTION: Verify category_id has not changed
    const existingEntry = await getOne('SELECT category_id FROM kronik_entries WHERE id = ?', [id])
    if (!existingEntry) {
      throw createError({
        statusCode: 404,
        message: 'Entry not found'
      })
    }

    if (Number(existingEntry.category_id) !== Number(category_id)) {
      throw createError({
        statusCode: 403,
        message: 'Kategori tidak dapat diubah. Kategori dipilih otomatis berdasarkan profil pembuat.'
      })
    }

    // Update the entry (category_id excluded from UPDATE since it cannot change)
    await runQuery(
      `UPDATE kronik_entries 
       SET 
         section_id = ?,
         what_title = ?,
         what_description = ?,
         who_involved = ?,
         when_date = ?,
         when_duration = ?,
         where_location = ?,
         where_address = ?,
         why_purpose = ?,
         how_process = ?,
         featured_image = ?,
         gallery = ?,
         status = ?,
         updated_at = NOW()
       WHERE id = ?`,
      [
        section_id || null,
        what_title,
        what_description,
        who_involved || null,
        when_date,
        when_duration || null,
        where_location || null,
        where_address || null,
        why_purpose || null,
        how_process || null,
        featured_image || null,
        gallery || null,
        status || 'pending',
        id
      ]
    )

    // Update published_at if status is published
    if (status === 'published') {
      await runQuery(
        'UPDATE kronik_entries SET published_at = NOW() WHERE id = ? AND published_at IS NULL',
        [id]
      )
    }

    return {
      success: true,
      message: 'Kronik entry updated successfully'
    }
  } catch (error: any) {
    console.error('Error updating kronik entry:', error)

    if (error.statusCode) {
      throw error
    }

    throw createError({
      statusCode: 500,
      message: error.message || 'Failed to update kronik entry'
    })
  }
})
