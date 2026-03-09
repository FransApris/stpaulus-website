export interface SwipeOptions {
  threshold?: number
  passive?: boolean
}

export interface SwipeState {
  startX: number
  startY: number
  currentX: number
  currentY: number
  isSwiping: boolean
  direction: 'left' | 'right' | 'up' | 'down' | null
}

export const useSwipe = (element: HTMLElement | null, options: SwipeOptions = {}) => {
  const { threshold = 50, passive = true } = options

  const swipeState = reactive<SwipeState>({
    startX: 0,
    startY: 0,
    currentX: 0,
    currentY: 0,
    isSwiping: false,
    direction: null
  })

  const emit = defineEmits<{
    swipeStart: [state: SwipeState]
    swipeMove: [state: SwipeState]
    swipeEnd: [state: SwipeState]
    swipeLeft: [state: SwipeState]
    swipeRight: [state: SwipeState]
    swipeUp: [state: SwipeState]
    swipeDown: [state: SwipeState]
  }>()

  const handleTouchStart = (event: TouchEvent) => {
    const touch = event.touches[0]
    swipeState.startX = touch.clientX
    swipeState.startY = touch.clientY
    swipeState.currentX = touch.clientX
    swipeState.currentY = touch.clientY
    swipeState.isSwiping = true
    swipeState.direction = null

    emit('swipeStart', { ...swipeState })
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!swipeState.isSwiping) return

    const touch = event.touches[0]
    swipeState.currentX = touch.clientX
    swipeState.currentY = touch.clientY

    const deltaX = swipeState.currentX - swipeState.startX
    const deltaY = swipeState.currentY - swipeState.startY

    // Determine direction based on larger movement
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeState.direction = deltaX > 0 ? 'right' : 'left'
    } else {
      swipeState.direction = deltaY > 0 ? 'down' : 'up'
    }

    emit('swipeMove', { ...swipeState })
  }

  const handleTouchEnd = (event: TouchEvent) => {
    if (!swipeState.isSwiping) return

    const deltaX = swipeState.currentX - swipeState.startX
    const deltaY = swipeState.currentY - swipeState.startY

    // Check if swipe meets threshold
    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      emit('swipeEnd', { ...swipeState })

      // Emit specific direction events
      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) {
          emit('swipeRight', { ...swipeState })
        } else if (deltaX < -threshold) {
          emit('swipeLeft', { ...swipeState })
        }
      } else {
        if (deltaY > threshold) {
          emit('swipeDown', { ...swipeState })
        } else if (deltaY < -threshold) {
          emit('swipeUp', { ...swipeState })
        }
      }
    }

    // Reset state
    swipeState.isSwiping = false
    swipeState.direction = null
  }

  // Mouse events for desktop testing
  const handleMouseDown = (event: MouseEvent) => {
    swipeState.startX = event.clientX
    swipeState.startY = event.clientY
    swipeState.currentX = event.clientX
    swipeState.currentY = event.clientY
    swipeState.isSwiping = true
    swipeState.direction = null

    emit('swipeStart', { ...swipeState })
  }

  const handleMouseMove = (event: MouseEvent) => {
    if (!swipeState.isSwiping) return

    swipeState.currentX = event.clientX
    swipeState.currentY = event.clientY

    const deltaX = swipeState.currentX - swipeState.startX
    const deltaY = swipeState.currentY - swipeState.startY

    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      swipeState.direction = deltaX > 0 ? 'right' : 'left'
    } else {
      swipeState.direction = deltaY > 0 ? 'down' : 'up'
    }

    emit('swipeMove', { ...swipeState })
  }

  const handleMouseUp = (event: MouseEvent) => {
    if (!swipeState.isSwiping) return

    const deltaX = swipeState.currentX - swipeState.startX
    const deltaY = swipeState.currentY - swipeState.startY

    if (Math.abs(deltaX) > threshold || Math.abs(deltaY) > threshold) {
      emit('swipeEnd', { ...swipeState })

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        if (deltaX > threshold) {
          emit('swipeRight', { ...swipeState })
        } else if (deltaX < -threshold) {
          emit('swipeLeft', { ...swipeState })
        }
      } else {
        if (deltaY > threshold) {
          emit('swipeDown', { ...swipeState })
        } else if (deltaY < -threshold) {
          emit('swipeUp', { ...swipeState })
        }
      }
    }

    swipeState.isSwiping = false
    swipeState.direction = null
  }

  // Setup event listeners
  onMounted(() => {
    if (!element) return

    // Touch events
    element.addEventListener('touchstart', handleTouchStart, { passive })
    element.addEventListener('touchmove', handleTouchMove, { passive })
    element.addEventListener('touchend', handleTouchEnd, { passive })

    // Mouse events for desktop
    element.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  })

  onUnmounted(() => {
    if (!element) return

    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)

    element.removeEventListener('mousedown', handleMouseDown)
    document.removeEventListener('mousemove', handleMouseMove)
    document.removeEventListener('mouseup', handleMouseUp)
  })

  return {
    swipeState: readonly(swipeState),
    emit
  }
}
