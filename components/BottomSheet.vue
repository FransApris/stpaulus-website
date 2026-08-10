<template>
  <!-- Bottom Sheet / Mobile Drawer — rendered globally via Teleport -->
  <ClientOnly>
    <Teleport to="body">
      <!-- Backdrop -->
      <Transition name="bs-backdrop">
        <div
          v-if="sheetState.isOpen"
          class="bs-backdrop"
          aria-hidden="true"
          @click="onBackdropClick"
        />
      </Transition>

      <!-- Sheet Panel -->
      <Transition name="bs-sheet">
        <div
          v-if="sheetState.isOpen"
          ref="sheetEl"
          role="dialog"
          aria-modal="true"
          :aria-label="sheetState.title || 'Panel informasi'"
          :class="['bs-panel', `bs-size-${sheetState.size}`]"
          :style="dragStyle"
          @touchstart.passive="onTouchStart"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd"
        >
          <!-- Drag handle -->
          <div class="bs-drag-handle" aria-hidden="true">
            <div class="bs-drag-indicator" />
          </div>

          <!-- Header -->
          <div v-if="sheetState.title" class="bs-header">
            <h2 class="bs-title">{{ sheetState.title }}</h2>
            <button
              class="bs-close-btn"
              aria-label="Tutup panel"
              @click="close"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
                <line x1="18" y1="6" x2="6" y2="18" />
                <line x1="6" y1="6" x2="18" y2="18" />
              </svg>
            </button>
          </div>

          <!-- Content via slot -->
          <div class="bs-body">
            <slot />
          </div>
        </div>
      </Transition>
    </Teleport>
  </ClientOnly>
</template>

<script setup lang="ts">
import { useBottomSheet } from '~/composables/useBottomSheet'

const { sheetState, close } = useBottomSheet()

const sheetEl = ref<HTMLElement | null>(null)

// ── Swipe-to-dismiss ───────────────────────────────────────────
const dragY = ref(0)
let touchStartY = 0
let isDragging = false

const dragStyle = computed(() => {
  if (dragY.value <= 0) return {}
  return { transform: `translateY(${dragY.value}px)`, transition: 'none' }
})

function onTouchStart(e: TouchEvent) {
  if (!sheetState.value.swipeToClose) return
  touchStartY = e.touches[0]?.clientY ?? 0
  isDragging = true
}

function onTouchMove(e: TouchEvent) {
  if (!isDragging || !sheetState.value.swipeToClose) return
  const currentY = e.touches[0]?.clientY ?? 0
  const delta = currentY - touchStartY
  if (delta > 0) {
    dragY.value = delta
    e.preventDefault()
  }
}

function onTouchEnd(e: TouchEvent) {
  if (!isDragging) return
  isDragging = false
  const currentY = e.changedTouches[0]?.clientY ?? 0
  const delta = currentY - touchStartY

  if (delta > 80) {
    // Swiped down enough → close
    close()
  }
  // Spring back
  dragY.value = 0
}

function onBackdropClick() {
  if (sheetState.value.closeOnBackdrop) close()
}

// Close on Escape
if (process.client) {
  useEventListener('keydown', (e: KeyboardEvent) => {
    if (e.key === 'Escape' && sheetState.value.isOpen) close()
  })
}
</script>

<style scoped>
/* ── Backdrop ────────────────────────────────────────────────── */
.bs-backdrop {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.5);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
  z-index: 10000;
  touch-action: none;
}

/* ── Panel ───────────────────────────────────────────────────── */
.bs-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  z-index: 10001;
  background: #fff;
  border-radius: 20px 20px 0 0;
  box-shadow: 0 -4px 32px rgba(0, 0, 0, 0.18);
  display: flex;
  flex-direction: column;
  overflow: hidden;
  /* Safe area for iPhone Home Indicator */
  padding-bottom: env(safe-area-inset-bottom, 0px);
  /* Smooth spring-back after swipe release */
  transition: transform 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  will-change: transform;
  touch-action: pan-x;
}

/* Size presets */
.bs-size-auto {
  max-height: 90vh;
}

.bs-size-half {
  height: 50vh;
}

.bs-size-full {
  height: 92vh;
}

/* ── Drag Handle ─────────────────────────────────────────────── */
.bs-drag-handle {
  display: flex;
  justify-content: center;
  padding: 12px 0 4px;
  cursor: grab;
  flex-shrink: 0;
}

.bs-drag-indicator {
  width: 40px;
  height: 4px;
  border-radius: 2px;
  background: #d1d5db;
}

/* ── Header ──────────────────────────────────────────────────── */
.bs-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 8px 20px 12px;
  border-bottom: 1px solid #f3f4f6;
  flex-shrink: 0;
}

.bs-title {
  font-size: 17px;
  font-weight: 700;
  color: #111827;
  margin: 0;
}

.bs-close-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #f3f4f6;
  border: none;
  cursor: pointer;
  transition: background 0.15s ease;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.bs-close-btn:hover {
  background: #e5e7eb;
}

.bs-close-btn svg {
  width: 16px;
  height: 16px;
  color: #374151;
}

/* ── Body ────────────────────────────────────────────────────── */
.bs-body {
  flex: 1;
  overflow-y: auto;
  -webkit-overflow-scrolling: touch;
  overscroll-behavior: contain;
  padding: 16px 20px 24px;
}

/* ── Transitions ─────────────────────────────────────────────── */
.bs-backdrop-enter-active,
.bs-backdrop-leave-active {
  transition: opacity 0.28s ease;
}
.bs-backdrop-enter-from,
.bs-backdrop-leave-to {
  opacity: 0;
}

.bs-sheet-enter-active {
  transition: transform 0.38s cubic-bezier(0.16, 1, 0.3, 1);
}
.bs-sheet-leave-active {
  transition: transform 0.26s cubic-bezier(0.4, 0, 1, 1);
}
.bs-sheet-enter-from,
.bs-sheet-leave-to {
  transform: translateY(100%);
}

/* ── Reduce motion ───────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .bs-backdrop-enter-active,
  .bs-backdrop-leave-active,
  .bs-sheet-enter-active,
  .bs-sheet-leave-active {
    transition: opacity 0.15s ease !important;
  }
  .bs-sheet-enter-from,
  .bs-sheet-leave-to {
    transform: none !important;
    opacity: 0 !important;
  }
}
</style>
