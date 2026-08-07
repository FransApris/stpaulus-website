import type { RouterConfig } from '@nuxt/schema'

/**
 * Custom Vue Router Scroll Behavior for Nuxt
 * Ensures that whenever a user navigates to a new page (e.g. clicking 'Baca Selengkapnya'),
 * the scroll position is reset to the top of the page (0, 0).
 */
export default <RouterConfig>{
  scrollBehavior(to, from, savedPosition) {
    // If navigating back/forward in browser history, restore saved scroll position
    if (savedPosition) {
      return savedPosition
    }

    // If navigating to an anchor hash (e.g. #section-name)
    if (to.hash) {
      return {
        el: to.hash,
        top: 80,
        behavior: 'smooth'
      }
    }

    // Default: Always scroll smoothly to top of the page on route change
    return { top: 0, left: 0, behavior: 'smooth' }
  }
}
