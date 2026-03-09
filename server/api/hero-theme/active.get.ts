import { allQuery } from '../../database/db'

export default defineEventHandler(async (event) => {
  try {
    const themes = await allQuery(`
      SELECT id, name, image_path
      FROM hero_themes
      WHERE is_active = TRUE
      LIMIT 1
    `)

    if (!themes || themes.length === 0) {
      // Return null if no active theme (will use default in frontend)
      return null
    }

    // Return direct object without nested structure
    return themes[0]
  } catch (error) {
    console.error('Error fetching active hero theme:', error)
    // Return null on error instead of throwing (graceful degradation)
    return null
  }
})
