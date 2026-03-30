// Simple cache to avoid fetching user data on every navigation
let userDataCache: { data: any; timestamp: number; token: string } | null = null
const CACHE_DURATION = 300000 // 5 minutes

export default defineNuxtRouteMiddleware(async (to, from) => {
  if (process.client) {
    // Only check for admin token - users should NOT access admin area
    const accessToken = localStorage.getItem('admin_access_token')

    if (!accessToken) {
      return navigateTo('/admin/login')
    }

    // Normalize route path to handle trailing slashes
    const cleanPath = to.path.replace(/\/$/, "")

    try {
      // Check cache first
      const now = Date.now()
      let userData

      if (userDataCache &&
        userDataCache.token === accessToken &&
        (now - userDataCache.timestamp) < CACHE_DURATION) {
        // Use cached data
        userData = userDataCache.data
      } else {
        // Fetch user permissions from admin API
        const response = await fetch('/api/admin/me', {
          headers: {
            'Authorization': `Bearer ${accessToken}`
          }
        })

        if (!response.ok) {
          if (response.status === 401) {
            userDataCache = null // Clear cache
            localStorage.removeItem('admin_access_token')
            return navigateTo('/admin/login')
          }
          throw new Error('Failed to fetch user data')
        }

        userData = await response.json()
        // Update cache
        userDataCache = {
          data: userData,
          timestamp: now,
          token: accessToken
        }
      }

      const userPermissions = userData.permissions || []

      // Define route to permission mapping
      const routePermissions: Record<string, string[]> = {
        '/admin/dashboard': [], // Empty array = accessible to any authenticated admin
        '/admin/articles': ['manage_articles'],
        '/admin/article-categories': ['manage_article_categories'],
        '/admin/news': ['manage_news'],
        '/admin/gallery': ['manage_gallery'],
        '/admin/gallery-categories': ['manage_gallery_categories'],
        '/admin/agenda': ['manage_agenda'],
        '/admin/categories': ['manage_agenda_categories'],
        '/admin/users': ['manage_users', 'manage_users_komsos_sekretariat'],
        '/admin/user-categories': ['manage_users', 'manage_users_komsos_sekretariat'],
        '/admin/rooms': ['manage_rooms'],
        '/admin/bookings': ['manage_bookings'],
        '/admin/bookings-new': ['manage_bookings'],
        '/admin/documents': ['manage_documents'],
        '/admin/document-categories': ['manage_document_categories'],
        '/admin/contact-messages': ['manage_contact_messages'],
        '/admin/chatbot-faqs': ['manage_chatbot_faqs', 'manage_chatbot'],
        '/admin/chatbot-faq-categories': ['manage_chatbot_faqs', 'manage_chatbot'],
        '/admin/footer-settings': ['manage_footer'],
        '/admin/hero-themes': ['manage_hero_themes'],
        '/admin/liturgy-types': ['manage_liturgy_types'],
        '/admin/mass-schedules': ['manage_mass_schedules'],
        '/admin/regular-mass-schedules': ['manage_regular_mass_schedules'],
        '/admin/pages': ['manage_pages'],
        '/admin/announcements': ['manage_church_announcements'],
        '/admin/church-announcements': ['manage_church_announcements'],
        '/admin/backup': ['manage_content'],
        '/admin/restore': ['manage_content'],
        '/admin/kronik': ['kronik.gereja.view', 'kronik.dpp.view', 'kronik.bgkp.view', 'kronik.wilayah.view', 'kronik.lingkungan.view'],
        '/admin/bgkp': ['kronik.bgkp.view'],
        '/admin/dpp': ['kronik.dpp.view'],
        '/admin/teritorial': ['kronik.wilayah.view', 'kronik.lingkungan.view'],
        '/admin/pastors': ['manage_mass_schedules'],
        '/admin/parish-statistics': ['manage_users_komsos_sekretariat']
      }

      // Check if the route requires specific permissions (supports nested routes)
      const matchedRoute = Object.keys(routePermissions)
        .sort((a, b) => b.length - a.length)
        .find(route => cleanPath === route || cleanPath.startsWith(`${route}/`))

      const requiredPermissions = matchedRoute ? routePermissions[matchedRoute] : []

      // Allow access if:
      // 1. Route requires no permissions (empty array) = anyone can access
      // 2. User has at least one of the required permissions
      const hasAccess = requiredPermissions.length === 0 ||
        requiredPermissions.some((perm: string) => userPermissions.includes(perm))

      console.log(`[AUTH CHECK] Path: ${cleanPath} | Required: ${JSON.stringify(requiredPermissions)} | User has: ${userPermissions.length} permissions | Has Access: ${hasAccess}`)

      // If no access, redirect to dashboard
      if (!hasAccess) {
        console.log(`[AUTH DENY] ❌ Redirecting ${cleanPath} to dashboard (missing permissions)`)
        return navigateTo('/admin/dashboard')
      }

      // Access granted - allow navigation to continue
      console.log(`[AUTH ALLOW] ✅ Allowing access to ${cleanPath}`)
      return
    } catch (error) {
      console.error('Auth middleware error:', error)
      return navigateTo('/admin/login')
    }
  }
})
