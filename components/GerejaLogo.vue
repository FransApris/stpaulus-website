<template>
  <div class="flex items-center space-x-3 transition-all duration-200" :class="customClasses">
    <!-- Logo Image -->
    <img
      v-if="resolvedLogoSrc"
      :src="resolvedLogoSrc"
      alt="Logo Paroki St. Paulus"
      :class="[logoSize, 'object-contain flex-shrink-0']"
      loading="lazy"
      width="64"
      height="64"
      @error="onImageError"
    />
    <!-- Fallback Icon -->
    <div v-else :class="[logoSize, 'bg-paulus-blue flex items-center justify-center flex-shrink-0 relative fallback-icon']">
      <svg class="h-3/4 w-3/4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 2l3.09 6.26L22 9.27l-5 15.56-1.33-4.4L12 22l-5.67 1.83-1.33 4.4L2 15.27l-5-15.56L8.91 8.26L12 2z" />
      </svg>
    </div>
    
    <!-- Teks Judul dan Subtitle (Tampilkan hanya jika showText === true) -->
    <div v-if="showText" class="flex flex-col min-w-0">
      <h1 class="font-bold truncate" :class="[titleFont, titleSize, titleClasses]">{{ titleText }}</h1>
      <p class="text-sm text-gray-600 dark:text-gray-400 truncate" :class="subtitleFont">{{ subtitleText }}</p>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  logoSrc: {
    type: String,
    default: '/images/logo-paulus-juanda.png'
  },
  titleText: {
    type: String,
    default: 'PAROKI ST.PAULUS'
  },
  subtitleText: {
    type: String,
    default: 'JUANDA-SIDOARJO'
  },
  customClasses: {
    type: String,
    default: ''
  },
  titleClasses: {
    type: String,
    default: 'text-gray-900 dark:text-white'
  },
  titleSize: {
    type: String,
    default: 'text-xl'
  },
  logoSize: {
    type: String,
    default: 'h-12 md:h-16 lg:h-20'
  },
  titleFont: {
    type: String,
    default: 'font-cinzel'  // Cinzel untuk title
  },
  subtitleFont: {
    type: String,
    default: 'font-lora'
  },
  showText: {
    type: Boolean,
    default: true
  }
})

// Resolve src
const resolvedLogoSrc = computed(() => {
  if (!props.logoSrc || props.logoSrc.startsWith('http')) {
    return props.logoSrc
  }
  return props.logoSrc
})

// Handler error
const onImageError = (event) => {
  console.error('GerejaLogo: Image failed to load:', event.target.src)
  event.target.style.display = 'none'
}
</script>

<style scoped>
/* Custom font classes */
.font-cinzel {
  font-family: 'Cinzel', Georgia, serif;
  font-weight: 600;
  letter-spacing: 0.5px;
}

.font-lora {
  font-family: 'Lora', Georgia, serif;  /* Lora utama, fallback serif */
  font-weight: 400;  /* Normal untuk subtitle */
  letter-spacing: 0.2px;  /* Spacing halus untuk readability */
}

/* Fallback jika fonts gagal load */
h1 {
  font-family: serif;
}
p {
  font-family: serif;
}
</style>