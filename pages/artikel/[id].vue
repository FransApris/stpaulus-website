<template>
  <div class="min-h-screen pt-16 bg-gray-50">
    <!-- Loading -->
    <div v-if="pending" class="container mx-auto px-4 py-20 text-center">
      <div class="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-paulus-blue"></div>
      <p class="mt-4 text-gray-500">Memuat artikel...</p>
    </div>

    <!-- Content -->
    <article v-else-if="article" class="pb-20">
      <!-- Header Section -->
      <section class="bg-white border-b py-12">
        <div class="container mx-auto px-4 max-w-4xl">
          <!-- Breadcrumb -->
          <nav class="text-sm font-cinzel mb-6">
            <ol class="list-none p-0 inline-flex">
              <li class="flex items-center">
                <NuxtLink to="/artikel" class="text-gray-500 hover:text-paulus-blue">Artikel</NuxtLink>
                <svg class="fill-current w-3 h-3 mx-3" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512">
                  <path d="M285.476 272.971L91.132 467.314c-9.373 9.373-24.569 9.373-33.941 0l-22.667-22.667c-9.357-9.357-9.375-24.522-.04-33.901L188.505 256 34.484 101.255c-9.335-9.379-9.317-24.544.04-33.901l22.667-22.667c9.373-9.373 24.569-9.373 33.941 0L285.475 239.03c9.373 9.372 9.373 24.568.001 33.941z"/>
                </svg>
              </li>
              <li class="flex items-center">
                <span class="text-gray-700">{{ article.title }}</span>
              </li>
            </ol>
          </nav>

          <!-- Title -->
          <h1 class="text-3xl md:text-4xl font-cinzel font-bold text-gray-900 mb-4">
            {{ article.title }}
          </h1>

          <!-- Meta Info -->
          <div class="flex flex-wrap items-center gap-4 text-sm text-gray-600">
            <!-- Author -->
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
              </svg>
              <span>{{ article.author }}</span>
            </div>

            <!-- Date -->
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
              </svg>
              <span>{{ article.date }}</span>
            </div>

            <!-- Views -->
            <div class="flex items-center gap-2">
              <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"></path>
              </svg>
              <span>{{ article.views_count }} views</span>
            </div>

            <!-- Categories -->
            <div v-if="article.categories && article.categories.length" class="flex items-center gap-2">
              <NuxtLink
                v-for="category in article.categories"
                :key="category.slug"
                :to="`/artikel/kategori/${category.slug}`"
                class="px-3 py-1 bg-[#882f1d] text-white rounded-full text-xs font-medium hover:bg-[#6b2416] transition-colors duration-200"
              >
                {{ category.name }}
              </NuxtLink>
            </div>
          </div>
        </div>
      </section>

      <!-- Social Actions -->
      <section class="container mx-auto px-4 max-w-4xl py-6 sticky top-20 z-10 bg-gray-50">
        <div class="flex items-center justify-between bg-white shadow-md rounded-lg px-6 py-4">
          <!-- Like Button -->
          <button
            @click="toggleLike"
            :disabled="isLiking"
            class="flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-200 hover:bg-gray-100 disabled:opacity-50"
            :class="{
              'text-red-500': article.user_liked,
              'text-gray-600': !article.user_liked
            }"
          >
            <!-- Heart Icon -->
            <svg 
              class="w-6 h-6 transition-transform duration-200"
              :class="{ 'scale-110': article.user_liked }"
              :fill="article.user_liked ? 'currentColor' : 'none'" 
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
            <span class="font-medium">
              {{ article.user_liked ? 'Liked' : 'Like' }}
            </span>
            <span class="text-sm bg-gray-100 px-2 py-1 rounded-full">
              {{ article.likes_count }}
            </span>
          </button>

          <!-- Share Button -->
          <button
            @click="shareArticle"
            :disabled="isSharing"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200 disabled:opacity-50"
          >
            <!-- Paper Plane Icon -->
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path>
            </svg>
            <span class="font-medium">Share</span>
            <span class="text-sm bg-gray-100 px-2 py-1 rounded-full">
              {{ article.shares_count }}
            </span>
          </button>

          <!-- Copy Link -->
          <button
            @click="copyLink"
            class="flex items-center gap-2 px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 transition-all duration-200"
          >
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"></path>
            </svg>
            <span class="font-medium">{{ copied ? 'Copied!' : 'Copy Link' }}</span>
          </button>
        </div>
      </section>

      <!-- Content -->
      <section class="container mx-auto px-4 max-w-4xl py-8">
        <div class="bg-white shadow-lg rounded-lg p-8">
          <!-- Excerpt -->
          <p v-if="article.excerpt" class="text-xl text-gray-700 font-medium mb-6 italic border-l-4 border-paulus-blue pl-4">
            {{ article.excerpt }}
          </p>

          <!-- Main Content -->
          <div class="article-content" v-html="article.content"></div>
        </div>
      </section>

      <!-- Back Button -->
      <section class="container mx-auto px-4 max-w-4xl py-8">
        <NuxtLink 
          to="/artikel"
          class="inline-flex items-center gap-2 bg-paulus-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors shadow-md"
        >
          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
          </svg>
          Kembali ke Daftar Artikel
        </NuxtLink>
      </section>
    </article>

    <!-- Error -->
    <div v-else class="container mx-auto px-4 py-20 text-center">
      <svg class="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
      </svg>
      <h2 class="text-2xl font-bold text-gray-700 mb-2">Artikel Tidak Ditemukan</h2>
      <p class="text-gray-500 mb-6">Maaf, artikel yang Anda cari tidak tersedia.</p>
      <NuxtLink to="/artikel" class="inline-flex items-center gap-2 bg-paulus-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors">
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
        </svg>
        Kembali ke Artikel
      </NuxtLink>
    </div>

    <!-- Toast Notification -->
    <Transition name="slide-up">
      <div 
        v-if="showToast"
        class="fixed bottom-8 left-1/2 transform -translate-x-1/2 bg-gray-900 text-white px-6 py-3 rounded-lg shadow-xl z-50 flex items-center gap-2"
      >
        <svg v-if="toastType === 'success'" class="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
        </svg>
        <span>{{ toastMessage }}</span>
      </div>
    </Transition>
  </div>
</template>

<script setup>
const route = useRoute();
const slug = route.params.id;

// Fetch data
const { data: article, pending, error, refresh } = await useAsyncData(
  `artikel-${slug}`,
  async () => {
    try {
      return await $fetch(`/api/artikel/${slug}`)
    } catch (err) {
      console.error('Failed to fetch article detail:', err)
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
  if (isLiking.value || !article.value) return;

  isLiking.value = true;
  try {
    const response = await $fetch(`/api/articles/${article.value.id}/like`, {
      method: 'POST'
    });

    // Update local state
    article.value.user_liked = response.action === 'like';
    article.value.likes_count = response.likes_count;

    // Show toast
    showToastMessage(response.message);
  } catch (err) {
    console.error('Error toggling like:', err);
    showToastMessage('Gagal memproses like', 'error');
  } finally {
    isLiking.value = false;
  }
};

// Share Article
const shareArticle = async () => {
  if (isSharing.value || !article.value) return;

  // Try native share API first
  if (navigator.share) {
    try {
      await navigator.share({
        title: article.value.title,
        text: article.value.excerpt,
        url: window.location.href
      });

      // Record share
      isSharing.value = true;
      const response = await $fetch(`/api/articles/${article.value.id}/share`, {
        method: 'POST'
      });
      article.value.shares_count = response.shares_count;
      showToastMessage('Berhasil share artikel!');
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
      const response = await $fetch(`/api/articles/${article.value.id}/share`, {
        method: 'POST'
      });
      article.value.shares_count = response.shares_count;
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

// Meta tags
useHead(() => ({
  title: article.value ? `${article.value.title}` : 'Detail Artikel',
  meta: [{ 
    name: 'description', 
    content: article.value?.excerpt || 'Artikel rohani dari Gereja Katolik St. Paulus Juanda.' 
  }]
}));
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

.prose {
  color: #374151;
}

.prose p {
  margin-bottom: 1.5rem;
  line-height: 1.8;
}

.prose h2 {
  font-size: 1.875rem;
  font-weight: 700;
  margin-top: 2rem;
  margin-bottom: 1rem;
  color: #1f2937;
}

.prose h3 {
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 1.5rem;
  margin-bottom: 0.75rem;
  color: #374151;
}

.prose ul,
.prose ol {
  margin-left: 1.5rem;
  margin-bottom: 1.5rem;
}

.prose li {
  margin-bottom: 0.5rem;
}
</style>
