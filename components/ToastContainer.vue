<template>
  <!-- Mobile Snackbars / Toast Container (Tahap 6) -->
  <Teleport to="body">
    <div
      role="region"
      aria-label="Notifikasi"
      aria-live="polite"
      aria-atomic="false"
      class="toast-container"
    >
      <TransitionGroup name="toast" tag="div" class="toast-stack">
        <div
          v-for="toast in toasts"
          :key="toast.id"
          :role="toast.type === 'error' ? 'alert' : 'status'"
          :aria-live="toast.type === 'error' ? 'assertive' : 'polite'"
          :class="['toast-item', `toast-${toast.type}`]"
          @touchstart="onTouchStart($event, toast.id)"
          @touchmove="onTouchMove"
          @touchend="onTouchEnd($event, toast.id)"
        >
          <!-- Icon -->
          <span class="toast-icon" aria-hidden="true">
            <svg v-if="toast.type === 'success'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <polyline points="20 6 9 17 4 12" />
            </svg>
            <svg v-else-if="toast.type === 'error'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="15" y1="9" x2="9" y2="15" /><line x1="9" y1="9" x2="15" y2="15" />
            </svg>
            <svg v-else-if="toast.type === 'warning'" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <path d="M10.29 3.86L1.82 18a2 2 0 001.71 3h16.94a2 2 0 001.71-3L13.71 3.86a2 2 0 00-3.42 0z" /><line x1="12" y1="9" x2="12" y2="13" /><line x1="12" y1="17" x2="12.01" y2="17" />
            </svg>
            <svg v-else viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <circle cx="12" cy="12" r="10" /><line x1="12" y1="8" x2="12" y2="12" /><line x1="12" y1="16" x2="12.01" y2="16" />
            </svg>
          </span>

          <!-- Message -->
          <p class="toast-message">{{ toast.message }}</p>

          <!-- Action button -->
          <button
            v-if="toast.action"
            class="toast-action-btn"
            @click="() => { toast.action!.onClick(); dismiss(toast.id) }"
          >
            {{ toast.action.label }}
          </button>

          <!-- Dismiss button -->
          <button
            v-if="toast.dismissible !== false"
            class="toast-dismiss-btn"
            :aria-label="`Tutup notifikasi: ${toast.message}`"
            @click="dismiss(toast.id)"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          <!-- Progress bar -->
          <div
            v-if="toast.duration && toast.duration > 0"
            class="toast-progress"
            :style="{ animationDuration: `${toast.duration}ms` }"
          />
        </div>
      </TransitionGroup>
    </div>
  </Teleport>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

const { toasts, dismiss } = useToast()

// Swipe-to-dismiss support
let touchStartX = 0
let touchStartY = 0

function onTouchStart(e: TouchEvent, _id: string) {
  touchStartX = e.touches[0]?.clientX ?? 0
  touchStartY = e.touches[0]?.clientY ?? 0
}

function onTouchMove(_e: TouchEvent) {
  // Could animate drag here in future
}

function onTouchEnd(e: TouchEvent, id: string) {
  const deltaX = (e.changedTouches[0]?.clientX ?? 0) - touchStartX
  const deltaY = Math.abs((e.changedTouches[0]?.clientY ?? 0) - touchStartY)

  // Horizontal swipe > 60px and not primarily vertical → dismiss
  if (Math.abs(deltaX) > 60 && deltaY < 40) {
    dismiss(id)
  }
}
</script>

<style scoped>
/* ── Container ─────────────────────────────────────────────── */
.toast-container {
  position: fixed;
  bottom: env(safe-area-inset-bottom, 0px);
  left: 0;
  right: 0;
  z-index: 9999;
  pointer-events: none;
  padding-bottom: max(80px, calc(env(safe-area-inset-bottom) + 72px));
}

.toast-stack {
  display: flex;
  flex-direction: column-reverse;
  align-items: center;
  gap: 8px;
  padding: 0 12px 12px;
}

/* ── Toast Item ────────────────────────────────────────────── */
.toast-item {
  pointer-events: auto;
  display: flex;
  align-items: center;
  gap: 10px;
  width: 100%;
  max-width: 480px;
  min-height: 52px;
  padding: 12px 14px;
  border-radius: 14px;
  box-shadow:
    0 4px 16px rgba(0, 0, 0, 0.18),
    0 1px 4px rgba(0, 0, 0, 0.10);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  overflow: hidden;
  position: relative;
  cursor: default;
  user-select: none;
  -webkit-user-select: none;
  touch-action: pan-y;
}

/* ── Type Colors ───────────────────────────────────────────── */
.toast-success {
  background: rgba(16, 120, 56, 0.95);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.toast-error {
  background: rgba(180, 28, 28, 0.95);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.toast-warning {
  background: rgba(161, 98, 7, 0.95);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

.toast-info {
  background: rgba(30, 64, 175, 0.95);
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.15);
}

/* ── Icon ──────────────────────────────────────────────────── */
.toast-icon {
  flex-shrink: 0;
  width: 22px;
  height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0.95;
}

.toast-icon svg {
  width: 20px;
  height: 20px;
}

/* ── Message ───────────────────────────────────────────────── */
.toast-message {
  flex: 1;
  font-size: 14px;
  font-weight: 500;
  line-height: 1.4;
  margin: 0;
  color: inherit;
}

/* ── Action Button ─────────────────────────────────────────── */
.toast-action-btn {
  flex-shrink: 0;
  background: rgba(255, 255, 255, 0.2);
  border: none;
  color: #fff;
  font-size: 13px;
  font-weight: 700;
  padding: 5px 12px;
  border-radius: 8px;
  cursor: pointer;
  touch-action: manipulation;
  transition: background 0.15s ease;
  white-space: nowrap;
}

.toast-action-btn:hover,
.toast-action-btn:active {
  background: rgba(255, 255, 255, 0.32);
}

/* ── Dismiss Button ────────────────────────────────────────── */
.toast-dismiss-btn {
  flex-shrink: 0;
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.75);
  cursor: pointer;
  padding: 4px;
  border-radius: 6px;
  display: flex;
  align-items: center;
  touch-action: manipulation;
  transition: color 0.15s ease;
}

.toast-dismiss-btn:hover,
.toast-dismiss-btn:active {
  color: #fff;
}

.toast-dismiss-btn svg {
  width: 16px;
  height: 16px;
}

/* ── Progress Bar ──────────────────────────────────────────── */
.toast-progress {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 3px;
  width: 100%;
  background: rgba(255, 255, 255, 0.4);
  transform-origin: left;
  animation: toast-progress-shrink linear forwards;
  border-radius: 0 0 14px 14px;
}

@keyframes toast-progress-shrink {
  from { transform: scaleX(1); }
  to   { transform: scaleX(0); }
}

/* ── TransitionGroup Animations ────────────────────────────── */
.toast-enter-active {
  transition: all 0.32s cubic-bezier(0.16, 1, 0.3, 1);
}

.toast-leave-active {
  transition: all 0.22s cubic-bezier(0.4, 0, 1, 1);
  position: absolute;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(100%) scale(0.92);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(110%) scale(0.95);
}

.toast-move {
  transition: transform 0.28s cubic-bezier(0.16, 1, 0.3, 1);
}

/* ── Accessibility: reduce motion ──────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .toast-enter-active,
  .toast-leave-active,
  .toast-move {
    transition: opacity 0.15s ease !important;
  }
  .toast-enter-from,
  .toast-leave-to {
    transform: none !important;
  }
  .toast-progress {
    animation: none !important;
    display: none;
  }
}
</style>
