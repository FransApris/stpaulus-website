export interface PullToRefreshOptions {
  threshold?: number
  onRefresh: () => Promise<void> | void
}

export interface PullState {
  isPulling: boolean
  pullDistance: number
  isRefreshing: boolean
  canRefresh: boolean
}

export const usePullToRefresh = (element: HTMLElement | null, pullOptions: PullToRefreshOptions) => {
  const { threshold = 80, onRefresh } = pullOptions

  const pullState = reactive<PullState>({
    isPulling: false,
    pullDistance: 0,
    isRefreshing: false,
    canRefresh: false
  })

  let startY = 0
  let currentY = 0

  const handleTouchStart = (event: TouchEvent) => {
    if (pullState.isRefreshing) return

    startY = event.touches[0].clientY
    pullState.isPulling = true
  }

  const handleTouchMove = (event: TouchEvent) => {
    if (!pullState.isPulling || pullState.isRefreshing) return

    currentY = event.touches[0].clientY
    const deltaY = currentY - startY

    // Only allow pull down from top
    if (deltaY > 0 && element && element.scrollTop === 0) {
      pullState.pullDistance = Math.min(deltaY * 0.5, threshold * 2) // Dampen the pull
      pullState.canRefresh = pullState.pullDistance >= threshold

      // Prevent default scrolling
      event.preventDefault()
    }
  }

  const handleTouchEnd = async () => {
    if (!pullState.isPulling || pullState.isRefreshing) return

    pullState.isPulling = false

    if (pullState.canRefresh) {
      pullState.isRefreshing = true
      pullState.canRefresh = false

      try {
        await onRefresh()
      } catch (error) {
        console.error('Pull to refresh failed:', error)
      } finally {
        pullState.isRefreshing = false
      }
    }

    // Reset pull distance
    pullState.pullDistance = 0
  }

  // Setup event listeners
  onMounted(() => {
    if (!element) return

    element.addEventListener('touchstart', handleTouchStart, { passive: false })
    element.addEventListener('touchmove', handleTouchMove, { passive: false })
    element.addEventListener('touchend', handleTouchEnd, { passive: true })
  })

  onUnmounted(() => {
    if (!element) return

    element.removeEventListener('touchstart', handleTouchStart)
    element.removeEventListener('touchmove', handleTouchMove)
    element.removeEventListener('touchend', handleTouchEnd)
  })

  return {
    pullState: readonly(pullState)
  }
}
