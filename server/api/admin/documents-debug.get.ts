import { allQuery } from '../../database/db'
import { requireAuth } from '../../utils/auth'

// Temporary debug endpoint - shows raw document count and data from DB
export default defineEventHandler(async (event) => {
  requireAuth(event)

  const total = await allQuery(`SELECT COUNT(*) as count FROM documents`)
  const sample = await allQuery(`
    SELECT d.id, d.title, d.category_id, d.file_path, d.created_at,
           dc.name as category_name, dc.is_active as category_active
    FROM documents d
    LEFT JOIN document_categories dc ON d.category_id = dc.id
    ORDER BY d.created_at DESC
    LIMIT 20
  `)

  const categories = await allQuery(`SELECT id, name, is_active FROM document_categories ORDER BY id`)

  return {
    total_documents: total[0]?.count ?? 0,
    categories,
    sample_documents: sample
  }
})
