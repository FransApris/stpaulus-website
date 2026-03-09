import { allQuery } from '../database/db'

export default defineEventHandler(async (event) => {
  try {
    // Get footer settings
    const footerSettings = await allQuery('SELECT * FROM footer_settings ORDER BY id DESC LIMIT 1')

    // Get footer social links
    const socialLinks = await allQuery('SELECT * FROM footer_social_links WHERE is_active = 1 ORDER BY display_order ASC')

    // Get footer links grouped by column type
    const footerLinks = await allQuery('SELECT * FROM footer_links WHERE is_active = 1 ORDER BY column_type ASC, display_order ASC')

    // Group links by column type
    const groupedLinks = {
      legal: footerLinks.filter((link: any) => link.column_type === 'legal'),
      support: footerLinks.filter((link: any) => link.column_type === 'support'),
      content: footerLinks.filter((link: any) => link.column_type === 'content')
    }

    return {
      settings: footerSettings[0] || null,
      socialLinks,
      links: groupedLinks
    }
  } catch (error) {
    console.error('Error fetching footer settings:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Internal server error'
    })
  }
})
