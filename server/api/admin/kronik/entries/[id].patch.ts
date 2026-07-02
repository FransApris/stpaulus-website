// Admin API: Quick status update for kronik entry
import { runQuery, getQuery as getOne } from '~/server/database/db'
import { getRouterParam, readBody } from 'h3'
import { requireAuth } from '~/server/utils/auth'

const VALID_STATUSES = ['published', 'draft', 'pending', 'archived']

export default defineEventHandler(async (event) => {
    requireAuth(event)
    const id = getRouterParam(event, 'id')

    if (!id) {
        throw createError({ statusCode: 400, message: 'Entry ID is required' })
    }

    const body = await readBody(event)
    const { status } = body

    if (!status || !VALID_STATUSES.includes(status)) {
        throw createError({
            statusCode: 400,
            message: `Status tidak valid. Pilihan: ${VALID_STATUSES.join(', ')}`
        })
    }

    const existing = await getOne('SELECT id FROM kronik_entries WHERE id = ?', [id])
    if (!existing) {
        throw createError({ statusCode: 404, message: 'Entry tidak ditemukan' })
    }

    await runQuery(
        'UPDATE kronik_entries SET status = ?, updated_at = NOW() WHERE id = ?',
        [status, id]
    )

    return { success: true, message: 'Status berhasil diperbarui', status }
})
