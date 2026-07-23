/**
 * composables/useFormHelper.ts
 *
 * Form UX Enhancement Composable.
 * Provides auto-scroll & auto-focus to the first invalid field when form submission fails.
 * Eliminates friction and guesswork during long administrative form entries.
 */
export const useFormHelper = () => {
  /**
   * Smooth-scrolls the viewport and focuses on the first element with an error state.
   *
   * @param containerSelector - Optional CSS selector to restrict search scope
   */
  const scrollToFirstError = (containerSelector?: string) => {
    if (typeof window === 'undefined') return

    setTimeout(() => {
      const root = containerSelector ? document.querySelector(containerSelector) : document
      if (!root) return

      const firstErrorEl = root.querySelector<HTMLElement>(
        '.border-red-500, .border-red-600, .text-red-600, [aria-invalid="true"], :invalid'
      )

      if (firstErrorEl) {
        firstErrorEl.scrollIntoView({ behavior: 'smooth', block: 'center' })
        if (typeof firstErrorEl.focus === 'function') {
          firstErrorEl.focus()
        }
      }
    }, 100)
  }

  return {
    scrollToFirstError
  }
}
