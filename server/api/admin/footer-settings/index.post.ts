import { runQuery, allQuery } from '../../../database/db'
import { requireAuth, requirePermission } from '../../../utils/auth'

export default defineEventHandler(async (event) => {
  try {
    requireAuth(event)
    requirePermission('manage_footer')(event)

    const body = await readBody(event)
    const { copyright_entity, footer_description, physical_address, social_links, footer_links } = body

    // Validation
    if (footer_description && footer_description.length > 1000) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Footer description must be less than 1000 characters'
      })
    }

    if (physical_address && physical_address.length > 500) {
      throw createError({
        statusCode: 400,
        statusMessage: 'Physical address must be less than 500 characters'
      })
    }

    // Update footer settings
    await runQuery(
      'UPDATE footer_settings SET copyright_entity = ?, footer_description = ?, physical_address = ?, updated_at = CURRENT_TIMESTAMP WHERE id = 1',
      [copyright_entity, footer_description, physical_address]
    )

    // Update social links
    if (social_links && Array.isArray(social_links)) {
      // First, deactivate all existing links
      await runQuery('UPDATE footer_social_links SET is_active = 0')

      // Insert or update social links
      for (const link of social_links) {
        await runQuery(
          `INSERT INTO footer_social_links
           (id, platform_name, platform_icon, url, display_order, is_active, updated_at)
           VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
           ON DUPLICATE KEY UPDATE
           platform_name = VALUES(platform_name),
           platform_icon = VALUES(platform_icon),
           url = VALUES(url),
           display_order = VALUES(display_order),
           is_active = 1,
           updated_at = CURRENT_TIMESTAMP`,
          [link.id, link.platform_name, link.platform_icon, link.url, link.display_order]
        )
      }
    }

    // Update footer links
    if (footer_links && Array.isArray(footer_links)) {
      // First, deactivate all existing links
      await runQuery('UPDATE footer_links SET is_active = 0')

      // Insert or update footer links
      for (const link of footer_links) {
        await runQuery(
          `INSERT INTO footer_links
           (id, title, url, column_type, display_order, is_active, updated_at)
           VALUES (?, ?, ?, ?, ?, 1, CURRENT_TIMESTAMP)
           ON DUPLICATE KEY UPDATE
           title = VALUES(title),
           url = VALUES(url),
           column_type = VALUES(column_type),
           display_order = VALUES(display_order),
           is_active = 1,
           updated_at = CURRENT_TIMESTAMP`,
          [link.id, link.title, link.url, link.column_type, link.display_order]
        )
      }
    }

    return { success: true, message: 'Footer settings updated successfully' }
  } catch (error) {
    console.error('Error updating footer settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
