<template>
  <div ref="mapContainer" class="map-container">
    <!-- Static Thumbnail Preview (show before map loads) -->
    <div v-if="!mapActivated" @click="activateAndLoadMap"
      class="relative rounded-lg overflow-hidden shadow-lg cursor-pointer group bg-gray-200"
      :style="{ height: `${actualHeight}px` }">
      <!-- Real Map Thumbnail Image -->
      <img :src="mapThumbnailUrl" :alt="title" class="w-full h-full transition-opacity duration-300"
        :class="imageError ? 'opacity-0' : 'opacity-100'" style="object-fit: cover; object-position: center;"
        @error="handleImageError" @load="handleImageLoad" />

      <!-- Fallback if image fails to load -->
      <div v-if="imageError"
        class="absolute inset-0 bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center">
        <svg class="w-32 h-32 text-blue-300 opacity-50" fill="currentColor" viewBox="0 0 24 24">
          <path
            d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" />
        </svg>
      </div>

      <!-- Dark overlay on hover -->
      <div class="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300"></div>

      <!-- Center play button overlay -->
      <div class="absolute inset-0 flex flex-col items-center justify-center gap-6">
        <!-- Play button card -->
        <div
          class="bg-white px-6 py-4 rounded-2xl shadow-2xl flex flex-col items-center gap-3 transform group-hover:scale-110 transition-all duration-300">
          <!-- Play Icon -->
          <div
            class="w-16 h-16 bg-[#882f1d] rounded-full flex items-center justify-center shadow-lg group-hover:bg-[#6b2416] transition-colors">
            <svg class="w-8 h-8 text-white ml-1" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
          <div class="text-center">
            <p class="text-gray-900 font-bold text-lg">Klik untuk memuat peta</p>
            <p class="text-gray-600 text-sm">Peta Teritorial Interaktif</p>
          </div>
        </div>

        <!-- Location badge - moved below button -->
        <div class="bg-white px-4 py-2 rounded-full shadow-xl flex items-center gap-2">
          <svg class="w-5 h-5 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
          </svg>
          <span class="text-gray-800 font-medium text-sm">{{ address }}</span>
        </div>
      </div>
    </div>

    <!-- Loading Skeleton (show when activating map) -->
    <div v-else-if="isLoading && !hasError"
      class="animate-pulse bg-gradient-to-br from-blue-100 to-blue-200 rounded-lg flex items-center justify-center"
      :style="{ height: `${actualHeight}px` }">
      <div class="text-center">
        <svg class="w-12 h-12 text-blue-400 mx-auto mb-2 animate-bounce" fill="none" stroke="currentColor"
          viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        <p class="text-gray-500 text-sm">{{ loadingText }}</p>
      </div>
    </div>

    <!-- Error State -->
    <div v-else-if="hasError"
      class="bg-red-50 border border-red-200 rounded-lg p-8 text-center flex flex-col items-center justify-center"
      :style="{ height: `${actualHeight}px` }">
      <svg class="w-12 h-12 text-red-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
      <p class="text-red-600 mb-4 font-medium">Gagal memuat peta</p>
      <p class="text-red-500 text-sm mb-4">Silakan periksa koneksi internet Anda</p>
      <button @click="retry" class="bg-red-600 text-white px-6 py-2 rounded hover:bg-red-700 transition-colors">
        Coba Lagi
      </button>
    </div>

    <!-- Map Iframe (load ONLY after click) -->
    <div v-else-if="shouldLoadMap" class="relative"
      :class="{ 'opacity-0': isLoading, 'opacity-100 transition-opacity duration-500': !isLoading }">
      <div class="rounded-lg overflow-hidden shadow-lg bg-gray-100 relative">
        <iframe ref="mapIframe" :src="mapUrl" :width="width" :height="actualHeight" style="border:0;display:block;"
          allowfullscreen="" loading="eager" referrerpolicy="no-referrer-when-downgrade" :title="title" @load="onLoad"
          @error="onError" :class="{ 'pointer-events-none': !isMapActive }"></iframe>

        <!-- Overlay to prevent scroll capture until clicked -->
        <div v-if="!isMapActive" @click.stop="activateMap"
          class="absolute inset-0 cursor-pointer flex items-center justify-center bg-black/5 hover:bg-black/10 transition-colors group">
          <div
            class="bg-white/95 backdrop-blur-sm px-6 py-3 rounded-full shadow-lg flex items-center gap-2 transform group-hover:scale-105 transition-transform pointer-events-none">
            <svg class="w-5 h-5 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
            </svg>
            <span class="text-gray-800 font-medium">Klik untuk mengaktifkan peta</span>
          </div>
        </div>
      </div>

      <!-- Zoom Hint (First Time Only) -->
      <transition name="fade">
        <div v-if="showHint"
          class="absolute top-4 left-1/2 transform -translate-x-1/2 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg text-sm font-medium z-10">
          💡 Klik dan seret untuk navigasi peta
        </div>
      </transition>
    </div>

    <!-- Action Buttons -->
    <div v-if="!isLoading && !hasError" class="mt-4 flex flex-wrap gap-3 justify-center">
      <a :href="googleMapsUrl" target="_blank"
        class="inline-flex items-center gap-2 text-[#882f1d] hover:text-[#6b2416] font-medium transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        Buka di Google Maps
      </a>

      <button @click="getDirections"
        class="inline-flex items-center gap-2 text-[#882f1d] hover:text-[#6b2416] font-medium transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7" />
        </svg>
        Petunjuk Arah
      </button>

      <button @click="shareLocation"
        class="inline-flex items-center gap-2 text-[#882f1d] hover:text-[#6b2416] font-medium transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
        </svg>
        Bagikan Lokasi
      </button>
    </div>

    <!-- Success message for share -->
    <transition name="fade">
      <div v-if="shareSuccess" class="mt-3 text-center text-green-600 text-sm font-medium">
        ✓ Link lokasi berhasil disalin!
      </div>
    </transition>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onBeforeUnmount, onUnmounted } from '#imports'

const props = defineProps({
  mapId: {
    type: String,
    default: '18ysqVOVWT_ynb_DwhlxG_ZasT675kas'
  },
  width: {
    type: String,
    default: '100%'
  },
  height: {
    type: [String, Number],
    default: 480
  },
  title: {
    type: String,
    default: 'Peta Lokasi Paroki St. Paulus Juanda'
  },
  address: {
    type: String,
    default: 'Paroki St Paulus Juanda Sidoarjo'
  },
  // Coordinates for static map
  lat: {
    type: Number,
    default: -7.3917066
  },
  lng: {
    type: Number,
    default: 112.7296374
  },
  // Custom thumbnail image (optional)
  thumbnailImage: {
    type: String,
    default: ''
  },
  // Desktop thumbnail (landscape)
  thumbnailDesktop: {
    type: String,
    default: ''
  },
  // Mobile thumbnail (portrait/square)
  thumbnailMobile: {
    type: String,
    default: ''
  }
})

const isLoading = ref(false)
const hasError = ref(false)
const showHint = ref(false)
const shareSuccess = ref(false)
const mapIframe = ref(null)
const mapContainer = ref(null)
const shouldLoadMap = ref(false)
const isMapActive = ref(false)
const mapActivated = ref(false)
const imageError = ref(false)
const loadingText = ref('Memuat peta...')
const isMobile = ref(false)
const windowWidth = ref(0) // Track window width for responsive height
let loadingTimer = null
let activationTime = 0
let isComponentMounted = true

// Detect mobile/desktop on mount and resize
onMounted(() => {
  if (process.client) {
    windowWidth.value = window.innerWidth
    isMobile.value = window.innerWidth < 768
    window.addEventListener('resize', handleResize)
  }
})

onBeforeUnmount(() => {
  if (process.client) {
    window.removeEventListener('resize', handleResize)
  }
})

const handleResize = () => {
  windowWidth.value = window.innerWidth
  isMobile.value = window.innerWidth < 768
}

// Map thumbnail URL selection - RESPONSIVE
const mapThumbnailUrl = computed(() => {
  // Priority 1: Use responsive thumbnails if provided (NEW!)
  if (isMobile.value && props.thumbnailMobile) {
    console.log('[MapEmbed] Using mobile thumbnail:', props.thumbnailMobile)
    return props.thumbnailMobile
  }
  if (!isMobile.value && props.thumbnailDesktop) {
    console.log('[MapEmbed] Using desktop thumbnail:', props.thumbnailDesktop)
    return props.thumbnailDesktop
  }

  // Priority 2: Use single custom thumbnail if provided (fallback)
  if (props.thumbnailImage) {
    console.log('[MapEmbed] Using custom thumbnail:', props.thumbnailImage)
    return props.thumbnailImage
  }

  // Priority 3: Prefer local JPEG screenshot (map-thumbnail.jpg)
  // If not present, the image element will fall back to the SVG below.
  // To use a real screenshot save it as: /public/images/map-thumbnail.jpg
  const jpgPath = '/images/map-thumbnail.jpg'
  console.log('[MapEmbed] Preferring local JPG thumbnail (will fallback to SVG if missing):', jpgPath)
  return jpgPath
})

// Track whether we've already attempted the SVG fallback
const _triedSvgFallback = ref(false)

// Handle image load error - attempt JPG -> SVG fallback before showing generic error
const handleImageError = (event) => {
  const src = event?.target?.src || ''
  console.warn('[MapEmbed] Map thumbnail failed to load (src):', src)

  // If the failed src looks like the JPG we prefer, try the SVG fallback once
  if (!_triedSvgFallback.value && src.includes('map-thumbnail.jpg')) {
    _triedSvgFallback.value = true
    const fallback = '/images/map-thumbnail.svg'
    console.log('[MapEmbed] Retrying with SVG fallback:', fallback)
    // Replace image src directly to trigger another load
    try {
      event.target.src = fallback
      return
    } catch (e) {
      // ignore and fall through to error handling
    }
  }

  // Otherwise mark as failed and show gradient fallback
  console.error('[MapEmbed] Map thumbnail failed to load and no further fallback available:', { src, lat: props.lat, lng: props.lng })
  imageError.value = true
}

// Handle successful image load
const handleImageLoad = (event) => {
  console.log('[MapEmbed] Map thumbnail loaded successfully:', {
    src: event?.target?.src,
    width: event?.target?.naturalWidth,
    height: event?.target?.naturalHeight
  })
  imageError.value = false
}

// Activate and load map on click
const activateAndLoadMap = () => {
  console.log('[MapEmbed] User clicked - activating map load')
  mapActivated.value = true
  shouldLoadMap.value = true
  isLoading.value = true

  // Preconnect to Google domains for faster loading
  if (process.client) {
    const preconnectDomains = [
      'https://www.google.com',
      'https://maps.google.com',
      'https://maps.googleapis.com'
    ]

    preconnectDomains.forEach(domain => {
      const link = document.createElement('link')
      link.rel = 'preconnect'
      link.href = domain
      link.crossOrigin = 'anonymous'
      document.head.appendChild(link)
    })
  }

  // Start loading timer with progress messages
  let loadStartTime = Date.now()
  loadingTimer = setInterval(() => {
    if (!isComponentMounted) return
    if (isLoading.value) {
      const elapsedSeconds = Math.floor((Date.now() - loadStartTime) / 1000)
      const messages = [
        'Memuat peta...',
        'Menghubungi server Google...',
        'Mengunduh data peta...',
        'Hampir selesai...'
      ]
      const index = Math.min(Math.floor(elapsedSeconds / 2), messages.length - 1)
      loadingText.value = messages[index]
    }
  }, 1000)

  // Safety timeout - if loading takes too long, show error
  setTimeout(() => {
    if (isLoading.value && isComponentMounted) {
      console.warn('[MapEmbed] Loading timeout - map took too long')
      // Don't show error, just stop loading animation and show iframe anyway
      isLoading.value = false
      if (loadingTimer) {
        clearInterval(loadingTimer)
        loadingTimer = null
      }
    }
  }, 15000) // 15 seconds timeout
}

// Responsive height for better map fitting across devices
const actualHeight = computed(() => {
  // If custom height provided, use it
  if (props.height && props.height !== 480) {
    return typeof props.height === 'number' ? props.height : parseInt(props.height)
  }

  // Responsive breakpoints for optimal viewing (use windowWidth.value for reactivity)
  const width = windowWidth.value || (process.client ? window.innerWidth : 1024)
  if (width >= 1024) return 600  // Desktop: larger view
  if (width >= 768) return 500   // Tablet landscape
  if (width >= 640) return 450   // Tablet portrait
  return 350                      // Mobile: compact view
})

const mapUrl = computed(() =>
  `https://www.google.com/maps/d/embed?mid=${props.mapId}&ehbc=2E312F`
)

const googleMapsUrl = computed(() =>
  `https://maps.google.com/?q=${encodeURIComponent(props.address)}`
)

// Smart Intersection Observer for optimal loading
onMounted(() => {
  console.log('[MapEmbed] Component mounted - showing thumbnail only')

  // Add click outside listener for map deactivation
  if (process.client) {
    document.addEventListener('click', handleClickOutside)
  }

  // NO AUTO-LOADING - map will only load when user clicks
  // This dramatically improves initial page load performance
})

const onLoad = () => {
  console.log('[MapEmbed] Map loaded successfully')

  // Clear loading timer
  if (loadingTimer) {
    clearInterval(loadingTimer)
    loadingTimer = null
  }

  isLoading.value = false

  // Show hint for first-time visitors
  if (process.client) {
    const hasSeenHint = localStorage.getItem('map-hint-seen')
    if (!hasSeenHint) {
      showHint.value = true
      setTimeout(() => {
        showHint.value = false
        localStorage.setItem('map-hint-seen', 'true')
      }, 5000)
    }
  }
}

const onError = () => {
  console.error('[MapEmbed] Failed to load map')

  // Clear loading timer
  if (loadingTimer) {
    clearInterval(loadingTimer)
    loadingTimer = null
  }

  isLoading.value = false
  hasError.value = true
}

const retry = () => {
  console.log('[MapEmbed] Retrying map load')
  hasError.value = false
  isLoading.value = true
  shouldLoadMap.value = false
  isMapActive.value = false
  mapActivated.value = false // Reset to show thumbnail again
  loadingText.value = 'Memuat peta...'

  // Clear existing timer
  if (loadingTimer) {
    clearInterval(loadingTimer)
  }

  // User can click thumbnail again to retry
}

// Activate map for interaction (prevent scroll capture)
const activateMap = () => {
  console.log('[MapEmbed] Map activated for interaction')
  isMapActive.value = true
  activationTime = Date.now() // Record activation time
}

const getDirections = () => {
  if (process.client && navigator.geolocation) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords
        const directionsUrl = `https://www.google.com/maps/dir/${latitude},${longitude}/${encodeURIComponent(props.address)}`
        window.open(directionsUrl, '_blank')
      },
      () => {
        // Fallback jika user tidak izinkan location
        console.log('[MapEmbed] Location permission denied, opening default directions')
        window.open(googleMapsUrl.value, '_blank')
      }
    )
  } else {
    window.open(googleMapsUrl.value, '_blank')
  }
}

const shareLocation = async () => {
  const shareData = {
    title: props.title,
    text: `Lokasi: ${props.address}`,
    url: googleMapsUrl.value
  }

  try {
    if (process.client && navigator.share) {
      await navigator.share(shareData)
      console.log('[MapEmbed] Location shared successfully')
    } else {
      // Fallback: Copy to clipboard
      if (process.client && navigator.clipboard) {
        await navigator.clipboard.writeText(googleMapsUrl.value)
        shareSuccess.value = true
        setTimeout(() => {
          shareSuccess.value = false
        }, 3000)
        console.log('[MapEmbed] Location link copied to clipboard')
      }
    }
  } catch (error) {
    if (error.name !== 'AbortError') {
      console.error('[MapEmbed] Error sharing:', error)
    }
  }
}

// Optional: Deactivate map when clicking outside (better UX for scrolling)
const handleClickOutside = (event) => {
  // Only deactivate if:
  // 1. Map is currently active
  // 2. Click is outside map container
  // 3. At least 300ms has passed since activation (prevent immediate deactivation)
  const timeSinceActivation = Date.now() - activationTime

  if (isMapActive.value &&
    mapContainer.value &&
    !mapContainer.value.contains(event.target) &&
    timeSinceActivation > 300) {
    console.log('[MapEmbed] Map deactivated (clicked outside)')
    isMapActive.value = false
  }
}

// Cleanup before unmount
onBeforeUnmount(() => {
  console.log('[MapEmbed] Component unmounting, cleaning up...')
  isComponentMounted = false // Prevent further ref updates

  if (loadingTimer) {
    clearInterval(loadingTimer)
    loadingTimer = null
  }

  // Remove click outside listener
  if (process.client) {
    document.removeEventListener('click', handleClickOutside)
  }
})

// Cleanup
onUnmounted(() => {
  if (mapIframe.value) {
    mapIframe.value.src = ''
  }
})
</script>

<style scoped>
.map-container {
  width: 100%;
}

.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .map-container iframe {
    min-height: 300px;
  }
}

/* Smooth hover effects */
button,
a {
  transition: all 0.2s ease;
}

button:hover,
a:hover {
  transform: translateY(-1px);
}

button:active,
a:active {
  transform: translateY(0);
}

/* Optimize iframe rendering */
iframe {
  display: block;
  will-change: contents;
}
</style>
