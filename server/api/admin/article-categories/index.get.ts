import { allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

interface Category {
  id: number
  name: string
  slug: string
  parent_id: number | null
  parent_name?: string
  description?: string
  created_at: string
  updated_at: string
  children: Category[]
}

export default defineEventHandler(async (event) => {
  // Check authentication and permissions
  requireAuth(event)
  requirePermission('manage_article_categories')(event)

  try {
    const categories = await allQuery(`
      SELECT
        ac.*,
        parent.name as parent_name
      FROM article_categories ac
      LEFT JOIN article_categories parent ON ac.parent_id = parent.id
      ORDER BY ac.name ASC
    `)

    // Build hierarchical structure
    const categoryMap = new Map<number, Category>()
    const rootCategories: Category[] = []

    // First pass: create category objects
    categories.forEach((category: any) => {
      const cat: Category = {
        id: category.id,
        name: category.name,
        slug: category.slug,
        parent_id: category.parent_id,
        parent_name: category.parent_name,
        description: category.description,
        created_at: category.created_at,
        updated_at: category.updated_at,
        children: []
      }
      categoryMap.set(category.id, cat)
    })

    // Second pass: build hierarchy
    categoryMap.forEach((category) => {
      if (category.parent_id) {
        const parent = categoryMap.get(category.parent_id)
        if (parent) {
          parent.children.push(category)
        }
      } else {
        rootCategories.push(category)
      }
    })

    return rootCategories
  } catch (error) {
    console.error('Error fetching article categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
