<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Berita Paroki" />
    <div v-else>
      <ClientOnly>
        <ReadingProgressBar />
      </ClientOnly>
  <div class="min-h-screen pt-16 bg-gray-50">
    <!-- Loading -->
    <div v-if="pending" class="container mx-auto px-4 py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-paulus-blue"></div>
      <p class="mt-4 text-gray-500">Memuat berita...</p>
    </div>

    <!-- Content -->
    <article v-else-if="post" class="pb-20">
      <!-- Header Section -->
      <!-- Header Section -->
      <section class="bg-white border-b py-8 sm:py-12">
        <div class="container mx-auto px-4 max-w-4xl">
          <!-- Breadcrumb -->
          <nav class="text-xs sm:text-sm font-cinzel mb-4 sm:mb-6 overflow-hidden">
            <ol class="list-none p-0 inline-flex items-center flex-wrap gap-y-1">
              <li class="flex items-center">
                <NuxtLink to="/berita" class="text-gray-500 hover:text-paulus-blue flex-shrink-0">Berita</NuxtLink>
                <svg class="fill-current w-3 h-3 mx-2 text-gray-400 flex-shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
                </svg>
              </li>
              <li class="flex items-center min-w-0">
                <span class="text-gray-700 truncate max-w-[200px] sm:max-w-md inline-block">{{ post.title }}</span>
              </li>
            </ol>
          </nav>

          <!-- Title -->
          <h1 class="text-2xl sm:text-3xl md:text-4xl font-cinzel font-bold text-gray-900 mb-4 break-words leading-tight">
            {{ post.title }}
          </h1>

          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-3 sm:gap-4 text-xs sm:text-sm text-gray-600">
            <!-- Author -->
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>{{ post.author }}</span>
            </div>

            <!-- Date -->
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{{ post.date }}</span>
            </div>

            <!-- Views -->
            <div class="flex items-center gap-1.5">
              <svg class="w-4 h-4 text-gray-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>{{ post.views_count }} views</span>
            </div>

            <!-- Categories -->
            <div v-if="post.categories && post.categories.length" class="flex flex-wrap items-center gap-1.5">
              <span
                v-for="category in post.categories"
                :key="category.id"
                class="px-2.5 py-0.5 bg-blue-100 text-blue-700 rounded-full text-xs font-medium"
              >
                {{ category.name }}
              </span>
            </div>
          </div>
        </div>
      </section>

      <!-- Image -->
      <section v-if="post.image" class="container mx-auto px-4 max-w-4xl py-6 sm:py-8">
        <img 
          :src="post.image" 
          :alt="post.title" 
          class="w-full max-h-[450px] object-cover rounded-2xl shadow-lg"
        >
      </section>

      <!-- Social Actions -->
      <section class="container mx-auto px-4 max-w-4xl py-3 sm:py-4 sticky top-16 sm:top-20 z-10 bg-gray-50/95 backdrop-blur-sm">
        <div class="grid grid-cols-3 gap-1.5 sm:flex sm:items-center sm:justify-between sm:gap-2 bg-white shadow-md rounded-xl p-2 sm:px-6 sm:py-3.5 w-full">
          <!-- Like Button -->
          <button
            @click="toggleLike"
            :disabled="isLiking"
            class="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 disabled:opacity-50 text-xs sm:text-sm font-medium w-full sm:w-auto"
            :class="{
              'text-red-500': post.user_liked,
              'text-gray-600': !post.user_liked
            }"
          >
            <!-- Heart Icon -->
            <svg 
              class="w-4 h-4 sm:w-5 sm:h-5 transition-transform duration-200 flex-shrink-0"
              :class="{ 'scale-110': post.user_liked }"
              :fill="post.user_liked ? 'currentColor' : 'none'" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                stroke-linecap="round" 
                stroke-linejoin="round" 
                stroke-width="2" 
                d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
              ></path>
            </svg>
            <span>{{ post.user_liked ? 'Liked' : 'Like' }}</span>
            <span class="text-[10px] sm:text-xs bg-gray-100 px-1.5 py-0.5 rounded-full font-bold">
              {{ post.likes_count }}
            </span>
          </button>

          <!-- Share Button -->
          <button
            @click="shareNews"
            :disabled="isSharing"
            class="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50 text-xs sm:text-sm font-medium w-full sm:w-auto"
          >
            <!-- Paper Plane Icon -->
            <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <span>Share</span>
            <span class="text-[10px] sm:text-xs bg-gray-100 px-1.5 py-0.5 rounded-full font-bold">
              {{ post.shares_count }}
            </span>
          </button>

          <!-- Copy Link -->
          <button
            @click="copyLink"
            class="flex items-center justify-center gap-1 sm:gap-2 px-2 sm:px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 text-xs sm:text-sm font-medium w-full sm:w-auto"
          >
            <svg class="w-4 h-4 sm:w-5 sm:h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span>{{ copied ? 'Copied!' : 'Copy' }}<span class="hidden sm:inline"> Link</span></span>
          </button>
        </div>
      </section>

      <!-- Content -->
      <section class="container mx-auto px-4 max-w-4xl py-6 sm:py-8">
        <div class="bg-white shadow-lg rounded-2xl p-4 sm:p-6 md:p-8 overflow-hidden">
          <!-- Excerpt -->
          <p v-if="post.excerpt" class="text-base sm:text-xl text-gray-700 font-medium mb-6 italic border-l-4 border-paulus-blue pl-4 leading-relaxed break-words">
            {{ post.excerpt }}
          </p>

          <!-- Main Content -->
          <div class="article-content max-w-full overflow-hidden" v-html="post.content"></div>
        </div>
      </section>

      <!-- Back Button -->
      <section class="container mx-auto px-4 max-w-4xl py-8">
        <NuxtLink 
          to="/berita"
          class="inline-flex items-center gap-2 bg-paulus-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Kembali ke Daftar Berita
        </NuxtLink>
      </section>
    </article>

    <!-- Error -->
    <div v-else class="container mx-auto px-4 py-20 text-center">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 class="text-2xl font-bold text-gray-700 mb-2">Berita Tidak Ditemukan</h2>
      <p class="text-gray-500 mb-6">Maaf, berita yang Anda cari tidak tersedia.</p>
      <NuxtLink to="/berita" class="inline-flex items-center gap-2 bg-paulus-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Kembali ke Berita
      </NuxtLink>
    </div>

    <!-- Toast Notification -->
    <Transition name="slide-up">
      <div 
        v-if="showToast"
        class="fixed bottom-24 md:bottom-8 left-4 right-4 md:left-1/2 md:right-auto md:transform md:-translate-x-1/2 bg-gray-900 text-white px-5 py-3 md:px-6 rounded-xl md:rounded-lg shadow-2xl z-[100000] flex items-center gap-3"
      >
        <svg v-if="toastType === 'success'" class="w-5 h-5 text-green-400 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span class="text-sm md:text-base font-medium">{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('berita')
const route = useRoute();
const slug = route.params.id;

// Scroll-to-top sudah ditangani secara global oleh router.options.ts

// Fetch data
const { data: post, pending, error, refresh } = await useAsyncData(
  `berita-${slug}`,
  async () => {
    try {
      return await $fetch(`/api/berita/${slug}`)
    } catch (err) {
      console.error('Failed to fetch news detail:', err)
      return null
    }
  },
  {
    default: () => null,
    transform: (data) => data || null
  }
);

// Reactive states
const isLiking = ref(false);
const isSharing = ref(false);
const copied = ref(false);
const showToast = ref(false);
const toastMessage = ref('');
const toastType = ref('success');

// Toggle Like
const toggleLike = async () => {
  if (isLiking.value || !post.value) return;

  isLiking.value = true;
  try {
    const response = await $fetch(`/api/news/${post.value.id}/like`, {
      method: 'POST'
    });

    // Update local state
    post.value.user_liked = response.action === 'like';
    post.value.likes_count = response.likes_count;

    // Show toast
    showToastMessage(response.message);
  } catch (err) {
    console.error('Error toggling like:', err);
    showToastMessage('Gagal memproses like', 'error');
  } finally {
    isLiking.value = false;
  }
};

// Share News
const shareNews = async () => {
  if (isSharing.value || !post.value) return;

  // Try native share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: post.value.title,
        text: post.value.excerpt,
        url: window.location.href
      });

      // Record share
      isSharing.value = true;
      const response = await $fetch(`/api/news/${post.value.id}/share`, {
        method: 'POST'
      });
      post.value.shares_count = response.shares_count;
      showToastMessage('Berhasil share berita!');
    } catch (err) {
      if (err.name !== 'AbortError') {
        console.error('Error sharing:', err);
      }
    } finally {
      isSharing.value = false;
    }
  } else {
    // Fallback: Copy link
    await copyLink();
    
    // Record share
    isSharing.value = true;
    try {
      const response = await $fetch(`/api/news/${post.value.id}/share`, {
        method: 'POST'
      });
      post.value.shares_count = response.shares_count;
    } catch (err) {
      console.error('Error recording share:', err);
    } finally {
      isSharing.value = false;
    }
  }
};

// Copy Link
const copyLink = async () => {
  try {
    await navigator.clipboard.writeText(window.location.href);
    copied.value = true;
    showToastMessage('Link berhasil disalin!');
    
    setTimeout(() => {
      copied.value = false;
    }, 2000);
  } catch (err) {
    console.error('Error copying link:', err);
    showToastMessage('Gagal menyalin link', 'error');
  }
};

// Show Toast
const showToastMessage = (message, type = 'success') => {
  toastMessage.value = message;
  toastType.value = type;
  showToast.value = true;

  setTimeout(() => {
    showToast.value = false;
  }, 3000);
};
</script>

<style scoped>
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.3s ease;
}

.slide-up-enter-from {
  transform: translate(-50%, 100px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translate(-50%, 100px);
  opacity: 0;
}

.article-content {
  color: #374151;
  word-break: break-word;
  overflow-wrap: break-word;
}

.article-content p {
  margin-bottom: 1.25rem;
  line-height: 1.8;
}

.article-content h1,
.article-content h2,
.article-content h3,
.article-content h4 {
  font-weight: 700;
  margin-top: 1.75rem;
  margin-bottom: 0.75rem;
  color: #1f2937;
  line-height: 1.3;
}

.article-content h1 { font-size: 1.75rem; }
.article-content h2 { font-size: 1.4rem; }
.article-content h3 { font-size: 1.2rem; }

.article-content ul,
.article-content ol {
  margin-left: 1.25rem;
  margin-bottom: 1.25rem;
}

.article-content li {
  margin-bottom: 0.5rem;
}

/* Responsive elements inside rich text */
.article-content img {
  max-width: 100% !important;
  height: auto !important;
  border-radius: 0.75rem;
  margin: 1rem 0;
  object-fit: cover;
}

.article-content iframe,
.article-content video {
  max-width: 100% !important;
  border-radius: 0.75rem;
  margin: 1rem 0;
}

.article-content table {
  width: 100% !important;
  display: block;
  overflow-x: auto;
  margin: 1rem 0;
}
</style>
