export default defineNuxtPlugin((nuxtApp) => {
  const smoothScrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      if (document.documentElement) {
        document.documentElement.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
      if (document.body) {
        document.body.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
      const mainEl = document.querySelector('main')
      if (mainEl) {
        mainEl.scrollTo({ top: 0, left: 0, behavior: 'smooth' })
      }
    }
  }

  nuxtApp.hook('page:finish', () => {
    smoothScrollToTop()
    setTimeout(smoothScrollToTop, 100)
    setTimeout(smoothScrollToTop, 300)
  })
})
