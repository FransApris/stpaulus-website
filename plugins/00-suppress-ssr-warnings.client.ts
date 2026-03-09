// plugins/suppress-ssr-warnings.client.ts
// Suppress false-positive SSR warnings from Nuxt internals
// Named with '00-' prefix to run first
export default defineNuxtPlugin(() => {
  if (process.client) {
    // Save original console methods ASAP
    const originalWarn = console.warn
    const originalLog = console.log
    
    const isSSRWarning = (msg: any): boolean => {
      if (typeof msg !== 'string') return false
      return (
        msg.includes('ssr:warn') ||
        (msg.includes('useAsyncData') && 
         msg.includes('must return a value') &&
         msg.includes('node_modules')) ||
        msg.includes('Extraneous non-props attributes') ||
        msg.includes('<Suspense> is an experimental feature')
      )
    }
    
    // Intercept console.warn
    console.warn = function(...args: any[]) {
      if (isSSRWarning(args[0])) return
      return originalWarn.apply(console, args)
    }
    
    // Intercept console.log (for forwarded SSR logs)
    console.log = function(...args: any[]) {
      if (isSSRWarning(args[0])) return
      return originalLog.apply(console, args)
    }
  }
})
