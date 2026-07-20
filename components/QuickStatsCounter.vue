<template>
  <section class="py-12 bg-gradient-to-br from-[#882f1d] to-[#6b2416] relative overflow-hidden">
    <!-- Decorative background -->
    <div class="absolute inset-0 opacity-10">
      <div class="absolute top-0 left-0 w-64 h-64 bg-white rounded-full -translate-x-1/2 -translate-y-1/2"></div>
      <div class="absolute bottom-0 right-0 w-96 h-96 bg-white rounded-full translate-x-1/2 translate-y-1/2"></div>
    </div>

    <div class="container mx-auto px-4 relative z-10">
      <div class="text-center mb-8">
        <h2 class="text-3xl font-cinzel text-white mb-2">Paroki St. Paulus dalam Angka</h2>
        <p class="text-white/80 text-sm">Data terkini Paroki kami</p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
        <!-- Stat 1: Jumlah Umat -->
        <div
          class="bg-white/95 backdrop-blur rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          :class="{ 'animate-fade-in-up': isVisible }">
          <div class="mb-3">
            <svg class="w-12 h-12 mx-auto text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
              </path>
            </svg>
          </div>
          <div class="text-4xl font-bold text-[#882f1d] mb-1">
            <span v-if="isVisible">{{ animatedUmat }}</span>
            <span v-else>0</span>
          </div>
          <div class="text-sm text-gray-600 font-medium">Jiwa Umat</div>
          <div class="text-xs text-gray-400 mt-1">Terdaftar aktif</div>
        </div>

        <!-- Stat 2: Jumlah Lingkungan -->
        <div
          class="bg-white/95 backdrop-blur rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          :class="{ 'animate-fade-in-up': isVisible }" style="animation-delay: 0.1s">
          <div class="mb-3">
            <svg class="w-12 h-12 mx-auto text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6">
              </path>
            </svg>
          </div>
          <div class="text-4xl font-bold text-[#882f1d] mb-1">
            <span v-if="isVisible">{{ animatedLingkungan }}</span>
            <span v-else>0</span>
          </div>
          <div class="text-sm text-gray-600 font-medium">Lingkungan</div>
          <div class="text-xs text-gray-400 mt-1">Wilayah teritorial</div>
        </div>

        <!-- Stat 3: Kegiatan Bulanan -->
        <div
          class="bg-white/95 backdrop-blur rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          :class="{ 'animate-fade-in-up': isVisible }" style="animation-delay: 0.2s">
          <div class="mb-3">
            <svg class="w-12 h-12 mx-auto text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
            </svg>
          </div>
          <div class="text-4xl font-bold text-[#882f1d] mb-1">
            <span v-if="isVisible">{{ animatedKegiatan }}+</span>
            <span v-else>0</span>
          </div>
          <div class="text-sm text-gray-600 font-medium">Kegiatan</div>
          <div class="text-xs text-gray-400 mt-1">Per bulan</div>
        </div>

        <!-- Stat 4: Sakramen Tahun Ini (Disembunyikan sementara) -->
        <div v-if="false"
          class="bg-white/95 backdrop-blur rounded-xl p-6 text-center transform hover:scale-105 transition-all duration-300 shadow-xl hover:shadow-2xl"
          :class="{ 'animate-fade-in-up': isVisible }" style="animation-delay: 0.3s">
          <div class="mb-3">
            <svg class="w-12 h-12 mx-auto text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
            </svg>
          </div>
          <div class="text-4xl font-bold text-[#882f1d] mb-1">
            <span v-if="isVisible">{{ animatedSakramen }}+</span>
            <span v-else>0</span>
          </div>
          <div class="text-sm text-gray-600 font-medium">Sakramen</div>
          <div class="text-xs text-gray-400 mt-1">Tahun {{ currentYear }}</div>
        </div>
      </div>

      <!-- Additional Info -->
      <div class="mt-8 text-center">
        <p class="text-white/70 text-sm">
          <svg class="w-4 h-4 inline-block mr-1" fill="currentColor" viewBox="0 0 20 20">
            <path fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clip-rule="evenodd"></path>
          </svg>
          Diperbarui: {{ lastUpdated }}
        </p>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from '#imports'

// State
const isVisible = ref(false)
const animatedUmat = ref(0)
const animatedLingkungan = ref(0)
const animatedKegiatan = ref(0)
const animatedSakramen = ref(0)
const statistics = ref([])
const loading = ref(true)

// Target values - will be loaded from API
const targetUmat = ref(3500)
const targetLingkungan = ref(25)
const targetKegiatan = ref(40)
const targetSakramen = ref(180)

// Current year
const currentYear = new Date().getFullYear()

// Last updated
const lastUpdated = computed(() => {
  if (statistics.value.length > 0 && statistics.value[0].last_updated) {
    return statistics.value[0].last_updated
  }
  const now = new Date()
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des']
  return `${now.getDate()} ${months[now.getMonth()]} ${now.getFullYear()}`
})

// Fetch statistics from API
const fetchStatistics = async () => {
  try {
    const response = await $fetch('/api/parish-statistics')

    if (response.success && response.data.length > 0) {
      statistics.value = response.data

      // Map API data to target values
      response.data.forEach(stat => {
        switch (stat.stat_key) {
          case 'umat':
            targetUmat.value = stat.stat_value
            break
          case 'lingkungan':
            targetLingkungan.value = stat.stat_value
            break
          case 'kegiatan':
            targetKegiatan.value = stat.stat_value
            break
          case 'sakramen':
            targetSakramen.value = stat.stat_value
            break
        }
      })
    }
  } catch (error) {
    console.error('Error fetching parish statistics:', error)
    // Fallback to hardcoded values if API fails
  } finally {
    loading.value = false
  }
}

// Animation function
const animateValue = (ref, target, duration = 2000) => {
  const startTime = Date.now()
  const startValue = 0

  const animate = () => {
    const currentTime = Date.now()
    const elapsed = currentTime - startTime
    const progress = Math.min(elapsed / duration, 1)

    // Easing function (ease-out)
    const easeOut = 1 - Math.pow(1 - progress, 3)

    ref.value = Math.floor(startValue + (target - startValue) * easeOut)

    if (progress < 1) {
      requestAnimationFrame(animate)
    } else {
      ref.value = target
    }
  }

  animate()
}

// Intersection Observer for scroll animation
const startAnimation = () => {
  isVisible.value = true

  // Start counter animations with delays
  setTimeout(() => animateValue(animatedUmat, targetUmat.value, 2000), 200)
  setTimeout(() => animateValue(animatedLingkungan, targetLingkungan.value, 1500), 300)
  setTimeout(() => animateValue(animatedKegiatan, targetKegiatan.value, 1800), 400)
  setTimeout(() => animateValue(animatedSakramen, targetSakramen.value, 2200), 500)
}

onMounted(async () => {
  // Fetch statistics from API first
  await fetchStatistics()

  // Then setup scroll animation
  if (process.client) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isVisible.value) {
            startAnimation()
            observer.disconnect()
          }
        })
      },
      { threshold: 0.3 }
    )

    const section = document.querySelector('.py-12.bg-gradient-to-br')
    if (section) {
      observer.observe(section)
    }
  }
})
</script>

<style scoped>
@keyframes fade-in-up {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in-up {
  animation: fade-in-up 0.6s ease-out forwards;
}
</style>
