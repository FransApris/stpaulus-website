import { onMounted, onUnmounted, nextTick } from '#imports'

export const useScrollReveal = (selector = '.reveal-on-scroll', options = {}) => {
  let io: IntersectionObserver | null = null
  let mo: MutationObserver | null = null

  const observeElements = () => {
    if (!process.client || !io) return

    const elements = document.querySelectorAll(selector)
    elements.forEach((el) => {
      if (el.classList.contains('is-revealed')) return

      const rect = el.getBoundingClientRect()
      // If already in visible viewport, reveal immediately
      if (rect.top < window.innerHeight && rect.bottom > 0) {
        el.classList.add('is-revealed')
      } else {
        io?.observe(el)
      }
    })
  }

  const initObserver = () => {
    if (!process.client) return

    const defaultOptions: IntersectionObserverInit = {
      threshold: 0.08,
      rootMargin: '0px 0px -20px 0px',
      ...options
    }

    io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed')
          io?.unobserve(entry.target)
        }
      })
    }, defaultOptions)

    observeElements()

    // Setup MutationObserver for dynamically rendered cards/content
    if (window.MutationObserver) {
      mo = new MutationObserver(() => {
        observeElements()
      })
      mo.observe(document.body, { childList: true, subtree: true })
    }
  }

  onMounted(() => {
    nextTick(() => {
      initObserver()
    })
  })

  onUnmounted(() => {
    io?.disconnect()
    mo?.disconnect()
  })

  return {
    initObserver,
    observeElements
  }
}
