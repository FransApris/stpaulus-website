import { defineEventHandler } from 'h3'
import { allQuery } from '~/server/database/db'

export default defineEventHandler(async (event) => {
  const categories = await allQuery(`
    SELECT id, name, slug, description, color, display_order, is_active, created_at, updated_at
    FROM document_categories
    WHERE is_active = 1
    ORDER BY display_order ASC, name ASC
  `)

  return categories
})
