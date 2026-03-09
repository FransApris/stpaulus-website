import { allQuery } from '../../../database/db'

export default defineEventHandler(async (event) => {
  try {
    const categories = await allQuery('SELECT * FROM agenda_categories ORDER BY name ASC')

    return categories.map((category: any) => ({
      id: category.id,
      name: category.name,
      slug: category.slug,
      description: category.description,
      color: category.color
    }))
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
