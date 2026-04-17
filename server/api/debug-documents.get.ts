import { allQuery } from '~/server/database/db'

// Temporary public debug endpoint - safe to expose (no sensitive data)
export default defineEventHandler(async (event) => {
  const total = await allQuery(`SELECT COUNT(*) as count FROM documents`, [])
  const categories = await allQuery(`SELECT id, name, is_active FROM document_categories ORDER BY id`, [])
  const sample = await allQuery(`
    SELECT d.id, d.title, d.category_id, 
           LEFT(d.file_path, 60) as file_path_preview,
           d.created_at
    FROM documents d
    ORDER BY d.created_at DESC
    LIMIT 10
  `, [])

  return {
    total_documents: total[0]?.count ?? 0,
    categories,
    sample
  }
})
