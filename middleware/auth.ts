// middleware/auth.ts
// Auth guard for admin routes.
//
// Strategy: useAuth composable is the SINGLE source of truth for user/permissions data.
// This middleware reads from useAuth state (useState) first. Only if the state is empty
// (first load / page refresh) does it trigger fetchUserData() — which itself has
// in-flight deduplication built in, so concurrent calls are collapsed into one request.
//
// The old module-level `userDataCache` has been REMOVED to eliminate the dual-cache
// problem where middleware and useAuth maintained independent caches of the same data.

export default defineNuxtRouteMiddleware(async (to, _from) => {
  if (!process.client) return

  const accessToken = sessionStorage.getItem('admin_access_token')
  if (!accessToken) {
    return navigateTo('/admin/login')
  }

  const cleanPath = to.path.replace(/\/$/, '')

  try {
    const auth = useAuth()

    // ── Read from useAuth state first ────────────────────────────────────────
    // If init-auth.client.ts plugin already fetched user data (or a previous
    // middleware call cached it), use it directly — no network request needed.
    //
    // fetchUserData() internally skips the fetch when:
    //   • user.value is already populated AND
    //   • the cached token matches the current token
    // So calling it here is always safe; it only hits the network when necessary.
    await auth.fetchUserData()

    const userPermissions = auth.permissions.value

    // ── Route → Permission mapping ────────────────────────────────────────────
    const routePermissions: Record<string, string[]> = {
      '/admin/dashboard': [],
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

    // Longest-prefix match (more specific routes win)
    const matchedRoute = Object.keys(routePermissions)
      .sort((a, b) => b.length - a.length)
      .find(route => cleanPath === route || cleanPath.startsWith(`${route}/`))

    const requiredPermissions = matchedRoute ? routePermissions[matchedRoute] : []

    // Hardcode restriction for maintenance route
    if (cleanPath === '/admin/maintenance' || cleanPath.startsWith('/admin/maintenance/')) {
      if (auth.user.value?.role_name !== 'super_admin') {
        console.log(`[AUTH DENY] ❌ ${cleanPath} → redirecting to dashboard (not super_admin)`)
        return navigateTo('/admin/dashboard')
      }
    }

    const hasAccess =
      requiredPermissions.length === 0 ||
      requiredPermissions.some((perm: string) => userPermissions.includes(perm))

    console.log(`[AUTH CHECK] ${cleanPath} | required: ${JSON.stringify(requiredPermissions)} | perms: ${userPermissions.length} | access: ${hasAccess}`)

    if (!hasAccess) {
      console.log(`[AUTH DENY] ❌ ${cleanPath} → redirecting to dashboard`)
      return navigateTo('/admin/dashboard')
    }

    console.log(`[AUTH ALLOW] ✅ ${cleanPath}`)
  } catch (error) {
    console.error('Auth middleware error:', error)
    return navigateTo('/admin/login')
  }
})
