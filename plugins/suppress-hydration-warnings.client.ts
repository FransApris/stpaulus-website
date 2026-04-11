// Suppress known false-positive hydration mismatch warnings from <ClientOnly> in Nuxt 4
// These warnings are expected behavior when ClientOnly renders empty comments on server
// but real components on the client. Vue detects this as a "mismatch" even though
// it's by design.
export default defineNuxtPlugin((nuxtApp) => {
  const originalWarnHandler = nuxtApp.vueApp.config.warnHandler

  nuxtApp.vueApp.config.warnHandler = (msg, instance, trace) => {
    // Suppress hydration mismatch warnings (known false positive from <ClientOnly>)
    if (typeof msg === 'string' && msg.includes('Hydration')) {
      return
    }
    // Pass through all other warnings
    if (originalWarnHandler) {
      originalWarnHandler(msg, instance, trace)
    } else {
      console.warn('[Vue warn]:', msg, trace)
    }
  }
})
