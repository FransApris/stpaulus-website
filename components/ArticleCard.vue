<template>
  <article
    class="group relative bg-white border border-gray-100/90 rounded-2xl shadow-xs hover:shadow-xl hover:border-[#882f1d]/20 transition-all duration-300 transform hover:-translate-y-1.5 overflow-hidden flex flex-col justify-between touch-feedback-subtle"
  >
    <!-- Top accent bar on hover -->
    <div class="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-[#882f1d] to-[#c58229] opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10"></div>

    <!-- Image Section -->
    <div
      v-if="image"
      class="w-full h-48 bg-gradient-to-br from-[#882f1d] to-[#c58229] relative flex items-center justify-center overflow-hidden"
    >
      <img
        v-if="imageType === 'url'"
        :src="imageSrc"
        :alt="title"
        class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        @error="handleImageError"
      />
      <div
        v-else
        class="absolute inset-0 flex items-center justify-center bg-black/20"
      >
        <span
          class="text-white text-lg font-semibold font-cinzel drop-shadow-md"
          >{{ image }}</span
        >
        <div
          v-if="showClock"
          class="absolute top-4 right-4 w-8 h-8 bg-white/20 rounded-full flex items-center justify-center"
        >
          <svg
            class="w-5 h-5 text-white"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
        </div>
      </div>
    </div>

    <!-- Content Section -->
    <div class="p-6 flex flex-col flex-1 justify-between">
      <div>
        <h3 class="text-xl font-semibold text-[#882f1d] mb-2 group-hover:text-[#6b2416] transition-colors">{{ title }}</h3>
        <p class="text-gray-600 mb-4 leading-relaxed text-sm sm:text-base">{{ truncatedDescription }}</p>
      </div>

      <div v-if="date" class="flex justify-between items-center pt-3 border-t border-gray-100 text-sm">
        <span class="text-gray-500">{{ date }}</span>
        <NuxtLink :to="to" class="text-[#882f1d] group-hover:text-[#6b2416] font-semibold inline-flex items-center gap-1 transition-all">
          <span>{{ linkText }}</span>
        </NuxtLink>
      </div>
      <div v-else class="text-right pt-3 border-t border-gray-100 text-sm">
        <NuxtLink :to="to" class="text-[#882f1d] group-hover:text-[#6b2416] font-semibold inline-flex items-center gap-1 transition-all">
          <span>{{ linkText }}</span>
        </NuxtLink>
      </div>
    </div>
  </article>
</template>

<script setup>
import { computed, ref, watch } from "#imports";

const props = defineProps({
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    default: null,
  },
  imageType: {
    type: String,
    default: "gradient", // 'url' or 'gradient'
  },
  showClock: {
    type: Boolean,
    default: false,
  },
  date: {
    type: String,
    default: null,
  },
  to: {
    type: String,
    required: true,
  },
  linkText: {
    type: String,
    default: "Baca Selengkapnya →",
  },
});

const { optimizeImageUrl } = useOptimizedImage();
const imageSrc = ref(optimizeImageUrl(props.image || "/images/default-article.jpg", 600));

watch(
  () => props.image,
  (newImage) => {
    imageSrc.value = optimizeImageUrl(newImage || "/images/default-article.jpg", 600);
  },
  { immediate: true },
);

const handleImageError = () => {
  console.log(
    "[ArticleCard] Image failed to load, using fallback:",
    props.image,
  );
  imageSrc.value = "/images/default-article.jpg";
};

// Truncate to 2 sentences
const truncatedDescription = computed(() => {
  if (!props.description) return "";

  // Match sentences ending with ., !, or ?
  const sentences = props.description.match(/[^.!?]+[.!?]+/g);

  if (!sentences || sentences.length === 0) {
    // If no sentences found, truncate by characters (150 chars)
    return props.description.length > 150
      ? props.description.substring(0, 150) + "..."
      : props.description;
  }

  // Return first 2 sentences
  const firstTwoSentences = sentences.slice(0, 2).join(" ").trim();
  return firstTwoSentences;
});
</script>
