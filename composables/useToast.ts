/**
 * composables/useToast.ts
 *
 * Global Toast / Snackbar system — Mobile Snackbars (Tahap 6)
 * Supports: success, error, warning, info
 * Features: auto-dismiss, action button, swipe-to-dismiss, stacking, ARIA accessible
 */

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastAction {
  label: string
  onClick: () => void
}

export interface Toast {
  id: string
  type: ToastType
  message: string
  duration?: number   // ms, 0 = persistent
  action?: ToastAction
  dismissible?: boolean
  _timer?: ReturnType<typeof setTimeout>
}

// Shared reactive state (singleton pattern — same ref across all composable calls)
const toasts = ref<Toast[]>([])

let _idCounter = 0
function genId(): string {
  return `toast-${Date.now()}-${++_idCounter}`
}

export function useToast() {
  /**
   * Show a toast notification.
   */
  function show(
    message: string,
    type: ToastType = 'info',
    options: { duration?: number; action?: ToastAction; dismissible?: boolean } = {}
  ): string {
    const id = genId()
    const duration = options.duration !== undefined ? options.duration : (type === 'error' ? 6000 : 4000)
    const dismissible = options.dismissible !== false

    const toast: Toast = {
      id,
      type,
      message,
      duration,
      action: options.action,
      dismissible,
    }

    // Limit max visible toasts to 3
    if (toasts.value.length >= 3) {
      dismiss(toasts.value[0].id)
    }

    toasts.value.push(toast)

    if (duration > 0) {
      toast._timer = setTimeout(() => dismiss(id), duration)
    }

    return id
  }

  /** Dismiss a specific toast by id */
  function dismiss(id: string) {
    const idx = toasts.value.findIndex(t => t.id === id)
    if (idx !== -1) {
      const toast = toasts.value[idx]
      if (toast._timer) clearTimeout(toast._timer)
      toasts.value.splice(idx, 1)
    }
  }

  /** Dismiss all toasts */
  function dismissAll() {
    toasts.value.forEach(t => { if (t._timer) clearTimeout(t._timer) })
    toasts.value = []
  }

  // Convenience helpers
  const success = (message: string, options?: Parameters<typeof show>[2]) =>
    show(message, 'success', options)

  const error = (message: string, options?: Parameters<typeof show>[2]) =>
    show(message, 'error', { duration: 6000, ...options })

  const warning = (message: string, options?: Parameters<typeof show>[2]) =>
    show(message, 'warning', options)

  const info = (message: string, options?: Parameters<typeof show>[2]) =>
    show(message, 'info', options)

  return {
    toasts: readonly(toasts),
    show,
    dismiss,
    dismissAll,
    success,
    error,
    warning,
    info,
  }
}
