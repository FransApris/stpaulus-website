/**
 * composables/useBottomSheet.ts
 *
 * Global Bottom Sheet / Mobile Drawer system
 * Supports: dynamic content, swipe-to-dismiss, snap points, ARIA
 */

export interface BottomSheetOptions {
  title?: string
  /** Height preset: 'auto' | 'half' | 'full' */
  size?: 'auto' | 'half' | 'full'
  /** Whether backdrop click closes the sheet */
  closeOnBackdrop?: boolean
  /** Whether the sheet can be swiped down to close */
  swipeToClose?: boolean
}

interface BottomSheetState {
  isOpen: boolean
  title: string
  size: 'auto' | 'half' | 'full'
  closeOnBackdrop: boolean
  swipeToClose: boolean
  // Slot content identifier — consumers use a named slot or pass content via open()
  contentId: string
}

const state = ref<BottomSheetState>({
  isOpen: false,
  title: '',
  size: 'auto',
  closeOnBackdrop: true,
  swipeToClose: true,
  contentId: '',
})

// Callback registry for programmatic content
const _onCloseCallbacks: Array<() => void> = []

export function useBottomSheet() {
  function open(options: BottomSheetOptions & { contentId?: string } = {}) {
    state.value = {
      isOpen: true,
      title: options.title ?? '',
      size: options.size ?? 'auto',
      closeOnBackdrop: options.closeOnBackdrop !== false,
      swipeToClose: options.swipeToClose !== false,
      contentId: options.contentId ?? '',
    }

    if (process.client) {
      document.body.style.overflow = 'hidden'
    }
  }

  function close() {
    state.value.isOpen = false
    if (process.client) {
      document.body.style.overflow = ''
    }
    _onCloseCallbacks.forEach(cb => cb())
    _onCloseCallbacks.length = 0
  }

  function onClose(cb: () => void) {
    _onCloseCallbacks.push(cb)
  }

  return {
    sheetState: readonly(state),
    open,
    close,
    onClose,
  }
}
