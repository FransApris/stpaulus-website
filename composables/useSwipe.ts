/**
 * composables/useSwipe.ts
 *
 * Reusable swipe gesture detection for mobile carousels & interactions.
 * Fixed: removed invalid defineEmits() call (only valid inside component setup).
 * Uses callback pattern instead.
 */

export interface SwipeOptions {
  threshold?: number
  passive?: boolean
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onSwipeStart?: (state: SwipeState) => void
  onSwipeEnd?: (state: SwipeState) => void
}

export interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isSwiping: boolean
  direction: 'left' | 'right' | 'up' | 'down' | null
  deltaX: number
  deltaY: number
}

export function useSwipe(
  elementRef: Ref<HTMLElement | null> | (() => HTMLElement | null),
  options: SwipeOptions = {}
) {
  const { threshold = 50, passive = true } = options

  const swipeState = reactive<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
    direction: null,
    deltaX: 0,
    deltaY: 0,
  })

  function getElement(): HTMLElement | null {
    return typeof elementRef === 'function' ? elementRef() : elementRef.value
  }

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    if (!touch) return
    swipeState.startX = touch.clientX
    swipeState.startY = touch.clientY
    swipeState.currentX = touch.clientX
    swipeState.currentY = touch.clientY
    swipeState.isSwiping = true
    swipeState.direction = null
    swipeState.deltaX = 0
    swipeState.deltaY = 0
    options.onSwipeStart?.({ ...swipeState })
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!swipeState.isSwiping) return
    const touch = event.touches[0]
    if (!touch) return
    swipeState.currentX = touch.clientX
    swipeState.currentY = touch.clientY
    swipeState.deltaX = swipeState.currentX - swipeState.startX
    swipeState.deltaY = swipeState.currentY - swipeState.startY

    if (Math.abs(swipeState.deltaX) > Math.abs(swipeState.deltaY)) {
      swipeState.direction = swipeState.deltaX > 0 ? 'right' : 'left'
    } else {
      swipeState.direction = swipeState.deltaY > 0 ? 'down' : 'up'
    }
  }

  const handleTouchEnd = (_event: TouchEvent) => {
    if (!swipeState.isSwiping) return

    const { deltaX, deltaY } = swipeState
    const absX = Math.abs(deltaX)
    const absY = Math.abs(deltaY)

    if (absX > threshold || absY > threshold) {
      options.onSwipeEnd?.({ ...swipeState })

      if (absX > absY) {
        if (deltaX > threshold) options.onSwipeRight?.()
        else if (deltaX < -threshold) options.onSwipeLeft?.()
      } else {
        if (deltaY > threshold) options.onSwipeDown?.()
        else if (deltaY < -threshold) options.onSwipeUp?.()
      }
    }

    swipeState.isSwiping = false
    swipeState.direction = null
  }

  onMounted(() => {
    const el = getElement()
    if (!el) return
    el.addEventListener('touchstart', handleTouchStart, { passive })
    el.addEventListener('touchmove', handleTouchMove, { passive })
    el.addEventListener('touchend', handleTouchEnd, { passive })
  })

  onUnmounted(() => {
    const el = getElement()
    if (!el) return
    el.removeEventListener('touchstart', handleTouchStart)
    el.removeEventListener('touchmove', handleTouchMove)
    el.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    swipeState: readonly(swipeState),
  }
}
