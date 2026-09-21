<template>
  <!-- ── ShareButton.vue ──────────────────────────────────────────────────────
       Tombol "Bagikan" yang cerdas:
       • Mobile / browser modern  → Web Share API (native sheet)
       • Desktop / browser lama   → Dropdown custom (WhatsApp + Copy Link)
  ──────────────────────────────────────────────────────────────────────────── -->
  <div class="share-btn-wrapper" ref="wrapperRef">

    <!-- ── Tombol Utama ──────────────────────────────────────────────────── -->
    <button
      id="share-button-main"
      @click="handleShare"
      :disabled="isLoading"
      :aria-expanded="dropdownOpen"
      aria-haspopup="true"
      :aria-label="`Bagikan: ${title}`"
      class="share-btn"
      :class="{ 'share-btn--active': dropdownOpen, 'share-btn--loading': isLoading }"
    >
      <!-- Spinner saat loading -->
      <svg
        v-if="isLoading"
        class="share-btn__icon share-btn__icon--spin"
        fill="none" viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="3"/>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"/>
      </svg>

      <!-- Icon Share (normal) -->
      <svg
        v-else
        class="share-btn__icon"
        fill="none" stroke="currentColor" stroke-width="2"
        stroke-linecap="round" stroke-linejoin="round"
        viewBox="0 0 24 24"
      >
        <circle cx="18" cy="5" r="3"/>
        <circle cx="6" cy="12" r="3"/>
        <circle cx="18" cy="19" r="3"/>
        <line x1="8.59" y1="13.51" x2="15.42" y2="17.49"/>
        <line x1="15.41" y1="6.51" x2="8.59" y2="10.49"/>
      </svg>

      <span class="share-btn__label">{{ label }}</span>

      <!-- Badge jumlah share (opsional) -->
      <span v-if="count !== undefined" class="share-btn__badge">
        {{ formatCount(count) }}
      </span>

      <!-- Chevron kecil untuk desktop dropdown -->
      <svg
        v-if="!supportsNativeShare"
        class="share-btn__chevron"
        :class="{ 'share-btn__chevron--open': dropdownOpen }"
        fill="none" stroke="currentColor" stroke-width="2.5"
        viewBox="0 0 24 24"
      >
        <polyline points="6 9 12 15 18 9"/>
      </svg>
    </button>

    <!-- ── Dropdown Fallback (Desktop) ──────────────────────────────────── -->
    <Transition name="share-dropdown">
      <div
        v-if="dropdownOpen"
        role="menu"
        aria-label="Opsi berbagi"
        class="share-dropdown"
        :class="dropdownPosition"
      >
        <!-- Panah dekoratif -->
        <div class="share-dropdown__arrow" :class="arrowPosition" aria-hidden="true"/>

        <!-- ── WhatsApp ─────────────────────────────────────────── -->
        <a
          :href="whatsappUrl"
          target="_blank"
          rel="noopener noreferrer"
          role="menuitem"
          class="share-dropdown__item share-dropdown__item--whatsapp"
          @click="onDropdownItemClick('whatsapp')"
        >
          <!-- WhatsApp SVG Icon -->
          <svg class="share-dropdown__item-icon" viewBox="0 0 24 24" fill="currentColor">
            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
            <path d="M12 0C5.373 0 0 5.373 0 12c0 2.123.555 4.116 1.527 5.845L.057 23.885a.5.5 0 00.615.612l6.155-1.603A11.943 11.943 0 0012 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.9 0-3.68-.494-5.224-1.36l-.375-.214-3.893 1.014.976-3.773-.232-.39A9.952 9.952 0 012 12C2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z"/>
          </svg>
          <div class="share-dropdown__item-text">
            <span class="share-dropdown__item-title">Bagikan ke WhatsApp</span>
            <span class="share-dropdown__item-sub">Kirim langsung ke kontak / grup</span>
          </div>
          <!-- External link icon -->
          <svg class="share-dropdown__item-ext" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
          </svg>
        </a>

        <!-- Divider -->
        <div class="share-dropdown__divider" role="separator" aria-hidden="true"/>

        <!-- ── Copy Link ────────────────────────────────────────── -->
        <button
          role="menuitem"
          class="share-dropdown__item"
          :class="{ 'share-dropdown__item--copied': justCopied }"
          @click="copyLink"
        >
          <!-- Copied state -->
          <svg v-if="justCopied" class="share-dropdown__item-icon share-dropdown__item-icon--success" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24">
            <polyline points="20 6 9 17 4 12"/>
          </svg>
          <!-- Default state -->
          <svg v-else class="share-dropdown__item-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"/>
          </svg>
          <div class="share-dropdown__item-text">
            <span class="share-dropdown__item-title">{{ justCopied ? 'Tautan Tersalin! ✓' : 'Salin Tautan' }}</span>
            <span class="share-dropdown__item-sub">{{ justCopied ? 'Siap ditempelkan di mana saja' : 'Tempel di mana saja' }}</span>
          </div>
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
import { useToast } from '~/composables/useToast'

// ── Props ──────────────────────────────────────────────────────────────────────
const props = withDefaults(defineProps<{
  /** Judul konten (dibawa ke Web Share API & WhatsApp) */
  title: string
  /** Deskripsi singkat (dibawa ke Web Share API) */
  description?: string
  /**
   * URL yang akan dibagikan.
   * Jika tidak diisi, diambil dari window.location.href secara otomatis.
   */
  url?: string
  /** Label pada tombol */
  label?: string
  /** Jumlah share (opsional, untuk badge counter) */
  count?: number
  /** Posisi dropdown: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right' */
  dropdownAlign?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}>(), {
  label: 'Bagikan',
  dropdownAlign: 'bottom-left',
})

// ── Emits ──────────────────────────────────────────────────────────────────────
const emit = defineEmits<{
  /** Diemit setiap kali user berhasil share/copy, untuk tracking di parent */
  (e: 'shared', method: 'native' | 'whatsapp' | 'copy'): void
}>()

// ── Internal state ─────────────────────────────────────────────────────────────
const { success, error: toastError } = useToast()
const dropdownOpen = ref(false)
const isLoading    = ref(false)
const justCopied   = ref(false)
const wrapperRef   = ref<HTMLElement | null>(null)

// ── Deteksi Web Share API ──────────────────────────────────────────────────────
// Dicek saat runtime (bukan SSR) agar aman di Nuxt 3
const supportsNativeShare = computed<boolean>(() => {
  if (process.server) return false
  return typeof navigator !== 'undefined' && typeof navigator.share === 'function'
})

// ── URL yang akan dibagikan ────────────────────────────────────────────────────
const resolvedUrl = computed<string>(() => {
  if (props.url) return props.url
  if (process.client) return window.location.href
  return ''
})

// ── WhatsApp URL ───────────────────────────────────────────────────────────────
const whatsappUrl = computed<string>(() => {
  const text = `${props.title}\n\n${resolvedUrl.value}`
  return `https://api.whatsapp.com/send?text=${encodeURIComponent(text)}`
})

// ── Posisi Dropdown ────────────────────────────────────────────────────────────
const dropdownPosition = computed(() => ({
  'share-dropdown--bottom-left':  props.dropdownAlign === 'bottom-left',
  'share-dropdown--bottom-right': props.dropdownAlign === 'bottom-right',
  'share-dropdown--top-left':     props.dropdownAlign === 'top-left',
  'share-dropdown--top-right':    props.dropdownAlign === 'top-right',
}))
const arrowPosition = computed(() => ({
  'share-dropdown__arrow--left':  props.dropdownAlign.endsWith('left'),
  'share-dropdown__arrow--right': props.dropdownAlign.endsWith('right'),
  'share-dropdown__arrow--top':   props.dropdownAlign.startsWith('top'),
  'share-dropdown__arrow--bottom':props.dropdownAlign.startsWith('bottom'),
}))

// ── Handler Klik Tombol Utama ──────────────────────────────────────────────────
async function handleShare() {
  if (supportsNativeShare.value) {
    // ── Path 1: Web Share API (Mobile/Modern) ──────────────────────────────
    isLoading.value = true
    try {
      await navigator.share({
        title: props.title,
        text:  props.description || props.title,
        url:   resolvedUrl.value,
      })
      success('Berhasil dibagikan!')
      emit('shared', 'native')
    } catch (err: unknown) {
      // AbortError = user menutup share sheet → bukan error nyata
      if (err instanceof Error && err.name !== 'AbortError') {
        console.warn('[ShareButton] navigator.share error:', err)
        toastError('Gagal membagikan, coba lagi.')
      }
    } finally {
      isLoading.value = false
    }
  } else {
    // ── Path 2: Toggle Dropdown Custom (Desktop) ───────────────────────────
    dropdownOpen.value = !dropdownOpen.value
  }
}

// ── Salin Tautan ───────────────────────────────────────────────────────────────
async function copyLink() {
  try {
    await navigator.clipboard.writeText(resolvedUrl.value)
    justCopied.value = true
    success('Tautan berhasil disalin!')
    emit('shared', 'copy')

    setTimeout(() => {
      justCopied.value = false
      dropdownOpen.value = false
    }, 2200)
  } catch (err) {
    console.error('[ShareButton] clipboard error:', err)
    toastError('Gagal menyalin tautan. Coba salin URL secara manual.')
  }
}

// ── Tracking klik WhatsApp ─────────────────────────────────────────────────────
function onDropdownItemClick(method: 'whatsapp' | 'copy') {
  emit('shared', method)
  if (method === 'whatsapp') {
    setTimeout(() => { dropdownOpen.value = false }, 300)
  }
}

// ── Format angka badge ─────────────────────────────────────────────────────────
function formatCount(n: number): string {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`
  return String(n)
}

// ── Tutup dropdown saat klik di luar ──────────────────────────────────────────
function onOutsideClick(e: MouseEvent) {
  if (wrapperRef.value && !wrapperRef.value.contains(e.target as Node)) {
    dropdownOpen.value = false
  }
}

// ── Tutup dropdown saat Escape ─────────────────────────────────────────────────
function onKeydown(e: KeyboardEvent) {
  if (e.key === 'Escape') dropdownOpen.value = false
}

onMounted(() => {
  document.addEventListener('click', onOutsideClick, { passive: true })
  document.addEventListener('keydown', onKeydown, { passive: true })
})

onUnmounted(() => {
  document.removeEventListener('click', onOutsideClick)
  document.removeEventListener('keydown', onKeydown)
})
</script>

<style scoped>
/* ── Wrapper ──────────────────────────────────────────────────────────────── */
.share-btn-wrapper {
  position: relative;
  display: inline-flex;
}

/* ── Tombol Utama ─────────────────────────────────────────────────────────── */
.share-btn {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 8px 16px;
  border-radius: 10px;
  border: none;
  cursor: pointer;
  font-size: 14px;
  font-weight: 600;
  color: #374151;
  background: #f3f4f6;
  transition:
    background 0.18s ease,
    color 0.18s ease,
    transform 0.12s ease,
    box-shadow 0.18s ease;
  user-select: none;
  touch-action: manipulation;
  -webkit-tap-highlight-color: transparent;
}

.share-btn:hover:not(:disabled) {
  background: #e5e7eb;
  color: #111827;
  box-shadow: 0 2px 8px rgba(0,0,0,0.08);
}

.share-btn:active:not(:disabled) {
  transform: scale(0.97);
}

.share-btn--active {
  background: #1e3a5f;
  color: #fff;
  box-shadow: 0 4px 12px rgba(30,58,95,0.3);
}

.share-btn--active:hover:not(:disabled) {
  background: #162e4d;
  color: #fff;
}

.share-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* ── Elemen dalam tombol ──────────────────────────────────────────────────── */
.share-btn__icon {
  width: 18px;
  height: 18px;
  flex-shrink: 0;
}

.share-btn__icon--spin {
  animation: spin 0.8s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.share-btn__label {
  white-space: nowrap;
}

.share-btn__badge {
  font-size: 11px;
  font-weight: 700;
  background: rgba(0,0,0,0.08);
  border-radius: 20px;
  padding: 1px 7px;
  min-width: 22px;
  text-align: center;
  line-height: 1.6;
}

.share-btn--active .share-btn__badge {
  background: rgba(255,255,255,0.2);
}

.share-btn__chevron {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  transition: transform 0.2s ease;
  opacity: 0.6;
}

.share-btn__chevron--open {
  transform: rotate(180deg);
  opacity: 1;
}

/* ── Dropdown ─────────────────────────────────────────────────────────────── */
.share-dropdown {
  position: absolute;
  z-index: 9999;
  min-width: 240px;
  background: #fff;
  border-radius: 16px;
  box-shadow:
    0 8px 32px rgba(0,0,0,0.14),
    0 2px 8px rgba(0,0,0,0.08),
    0 0 0 1px rgba(0,0,0,0.06);
  overflow: hidden;
  padding: 6px;
}

/* ── Posisi Dropdown ──────────────────────────────────────────────────────── */
.share-dropdown--bottom-left  { top: calc(100% + 10px); left: 0; }
.share-dropdown--bottom-right { top: calc(100% + 10px); right: 0; }
.share-dropdown--top-left     { bottom: calc(100% + 10px); left: 0; }
.share-dropdown--top-right    { bottom: calc(100% + 10px); right: 0; }

/* ── Panah dekoratif ──────────────────────────────────────────────────────── */
.share-dropdown__arrow {
  position: absolute;
  width: 12px;
  height: 12px;
  background: #fff;
  border-top: 1px solid rgba(0,0,0,0.06);
  border-left: 1px solid rgba(0,0,0,0.06);
  transform: rotate(45deg);
}

.share-dropdown__arrow--bottom.share-dropdown__arrow--left  { top: -7px; left: 18px; }
.share-dropdown__arrow--bottom.share-dropdown__arrow--right { top: -7px; right: 18px; }
.share-dropdown__arrow--top.share-dropdown__arrow--left     { bottom: -7px; left: 18px; transform: rotate(225deg); }
.share-dropdown__arrow--top.share-dropdown__arrow--right    { bottom: -7px; right: 18px; transform: rotate(225deg); }

/* ── Item Dropdown ────────────────────────────────────────────────────────── */
.share-dropdown__item {
  display: flex;
  align-items: center;
  gap: 12px;
  width: 100%;
  padding: 10px 12px;
  border-radius: 10px;
  border: none;
  background: transparent;
  cursor: pointer;
  text-align: left;
  text-decoration: none;
  color: #1f2937;
  transition: background 0.15s ease;
  -webkit-tap-highlight-color: transparent;
}

.share-dropdown__item:hover {
  background: #f3f4f6;
}

.share-dropdown__item:active {
  background: #e5e7eb;
}

.share-dropdown__item--whatsapp:hover {
  background: #f0fdf4;
}

.share-dropdown__item--copied {
  background: #f0fdf4 !important;
  color: #15803d;
}

/* ── Konten Item ──────────────────────────────────────────────────────────── */
.share-dropdown__item-icon {
  width: 22px;
  height: 22px;
  flex-shrink: 0;
  color: #6b7280;
}

.share-dropdown__item--whatsapp .share-dropdown__item-icon {
  color: #25d366;
}

.share-dropdown__item--copied .share-dropdown__item-icon,
.share-dropdown__item-icon--success {
  color: #16a34a;
}

.share-dropdown__item-text {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 1px;
}

.share-dropdown__item-title {
  font-size: 14px;
  font-weight: 600;
  line-height: 1.3;
}

.share-dropdown__item-sub {
  font-size: 11px;
  color: #9ca3af;
  line-height: 1.3;
}

.share-dropdown__item--copied .share-dropdown__item-sub {
  color: #86efac;
}

.share-dropdown__item-ext {
  width: 14px;
  height: 14px;
  flex-shrink: 0;
  color: #9ca3af;
}

/* ── Divider ──────────────────────────────────────────────────────────────── */
.share-dropdown__divider {
  height: 1px;
  background: #f3f4f6;
  margin: 4px 0;
}

/* ── Animasi Dropdown ─────────────────────────────────────────────────────── */
.share-dropdown-enter-active {
  transition: all 0.22s cubic-bezier(0.16, 1, 0.3, 1);
  transform-origin: top left;
}

.share-dropdown-leave-active {
  transition: all 0.16s cubic-bezier(0.4, 0, 1, 1);
  transform-origin: top left;
}

.share-dropdown-enter-from {
  opacity: 0;
  transform: scale(0.88) translateY(-6px);
}

.share-dropdown-leave-to {
  opacity: 0;
  transform: scale(0.92) translateY(-4px);
}

/* ── Aksesibilitas: reduce motion ─────────────────────────────────────────── */
@media (prefers-reduced-motion: reduce) {
  .share-dropdown-enter-active,
  .share-dropdown-leave-active {
    transition: opacity 0.12s ease !important;
  }
  .share-dropdown-enter-from,
  .share-dropdown-leave-to {
    transform: none !important;
  }
}
</style>
