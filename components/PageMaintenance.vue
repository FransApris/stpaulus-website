<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Page Header -->
    <div class="bg-[#882f1d] text-white relative overflow-hidden">
      <!-- Subtle decorative overlay -->
      <div
        class="absolute inset-0 pointer-events-none"
        style="
          background-image:
            radial-gradient(
              circle at 15% 60%,
              rgba(255, 255, 255, 0.08) 0%,
              transparent 45%
            ),
            radial-gradient(
              circle at 85% 25%,
              rgba(255, 255, 255, 0.06) 0%,
              transparent 40%
            );
        "
      ></div>
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 relative">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">{{ pageTitle }}</h1>
          <p v-if="pageSubtitle" class="text-xl text-red-100 max-w-2xl mx-auto">
            {{ pageSubtitle }}
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <Breadcrumb :title="pageTitle" />
    </div>

    <!-- Maintenance Card Section -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-16">
      <div class="max-w-2xl mx-auto">
        <div
          class="bg-white rounded-2xl shadow-md overflow-hidden border border-gray-100"
        >
          <!-- Top accent bar -->
          <div
            class="h-1.5 bg-gradient-to-r from-[#882f1d] via-[#c0473a] to-[#882f1d]"
          ></div>

          <div class="px-8 py-12 text-center">
            <!-- Animated icon -->
            <div class="relative inline-flex items-center justify-center mb-8">
              <div
                class="absolute w-24 h-24 rounded-full bg-red-50 opacity-40 pm-pulse-ring"
              ></div>
              <div
                class="relative w-20 h-20 bg-red-50 rounded-full flex items-center justify-center border-2 border-red-100"
              >
                <svg
                  class="w-10 h-10 text-[#882f1d]"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                  xmlns="http://www.w3.org/2000/svg"
                  aria-hidden="true"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>

            <!-- Status badge -->
            <div
              class="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-sm font-medium px-4 py-1.5 rounded-full mb-6"
            >
              <span
                class="w-2 h-2 rounded-full bg-amber-400 pm-dot-pulse"
              ></span>
              Sedang Dalam Pembaruan
            </div>

            <!-- Main heading -->
            <h2 class="text-2xl font-cinzel font-bold text-gray-800 mb-4">
              Konten Sedang Disempurnakan
            </h2>

            <!-- Primary message -->
            <p class="text-gray-600 leading-relaxed mb-3">
              {{ displayMessage }}
            </p>

            <!-- Sub message -->
            <p class="text-gray-500 leading-relaxed mb-8 text-sm">
              {{ displaySubMessage }}
            </p>

            <!-- Divider -->
            <div class="flex items-center gap-4 mb-7">
              <div class="flex-1 h-px bg-gray-100"></div>
              <span
                class="text-gray-300 text-xs font-semibold uppercase tracking-widest"
                >Butuh Informasi?</span
              >
              <div class="flex-1 h-px bg-gray-100"></div>
            </div>

            <!-- Contact info box -->
            <div class="bg-gray-50 rounded-xl p-5 mb-8 text-left">
              <p
                class="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3"
              >
                Hubungi Sekretariat Paroki
              </p>
              <div class="space-y-3">
                <!-- Phone -->
                <a
                  href="tel:0813-3496-0525"
                  class="flex items-center gap-3 text-sm text-gray-600 hover:text-[#882f1d] transition-colors group"
                >
                  <span
                    class="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 transition-colors"
                  >
                    <svg
                      class="w-4 h-4 text-[#882f1d]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"
                      />
                    </svg>
                  </span>
                  <span>0813-3496-0525</span>
                </a>
                <!-- Email -->
                <a
                  href="mailto:stpaulus.sekretariat@gmail.com"
                  class="flex items-center gap-3 text-sm text-gray-600 hover:text-[#882f1d] transition-colors group"
                >
                  <span
                    class="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 transition-colors"
                  >
                    <svg
                      class="w-4 h-4 text-[#882f1d]"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                  </span>
                  <span>stpaulus.sekretariat@gmail.com</span>
                </a>
                <!-- WhatsApp -->
                <a
                  href="https://wa.me/6285649779883"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="flex items-center gap-3 text-sm text-gray-600 hover:text-[#882f1d] transition-colors group"
                >
                  <span
                    class="w-8 h-8 rounded-lg bg-white shadow-sm border border-gray-100 flex items-center justify-center flex-shrink-0 group-hover:bg-red-50 transition-colors"
                  >
                    <svg
                      class="w-4 h-4 text-[#882f1d]"
                      fill="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"
                      />
                    </svg>
                  </span>
                  <span>WhatsApp Sekretariat</span>
                </a>
              </div>
            </div>

            <!-- CTA Buttons -->
            <div class="flex flex-col sm:flex-row gap-3 justify-center">
              <NuxtLink
                to="/"
                class="inline-flex items-center justify-center gap-2 bg-[#882f1d] hover:bg-[#6b2416] text-white font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md text-sm"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
                  />
                </svg>
                Kembali ke Beranda
              </NuxtLink>
              <NuxtLink
                to="/kontak"
                class="inline-flex items-center justify-center gap-2 bg-white hover:bg-red-50 text-[#882f1d] font-semibold px-6 py-3 rounded-xl transition-all duration-200 shadow-sm hover:shadow-md border border-red-100 text-sm"
              >
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                  />
                </svg>
                Hubungi Sekretariat
              </NuxtLink>
            </div>
          </div>

          <!-- Footer of card -->
          <div
            class="h-px bg-gradient-to-r from-transparent via-red-100 to-transparent"
          ></div>
          <div class="px-8 py-4 bg-gray-50 text-center">
            <p class="text-xs text-gray-400">
              Paroki St. Paulus Juanda &bull; Jl. Raya Bandara Juanda No.10,
              Sidoarjo, Jawa Timur
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { MaintenancePageConfig } from "~/composables/useMaintenance";

const props = defineProps<{
  pageTitle: string;
  pageSubtitle?: string;
  message?: string;
  subMessage?: string;
}>();

// Default messages jika tidak disediakan
const displayMessage = computed(
  () =>
    props.message ??
    `Halaman ${props.pageTitle} saat ini sedang dalam tahap penyempurnaan dan pembaruan isi oleh tim pengelola website.`,
);

const displaySubMessage = computed(
  () =>
    props.subMessage ??
    `Kami mohon maaf atas ketidaknyamanan ini. Halaman ini akan segera hadir kembali dengan informasi yang lebih lengkap, akurat, dan terstruktur.`,
);
</script>

<style scoped>
@keyframes pm-ping {
  0% {
    transform: scale(1);
    opacity: 0.4;
  }
  70%,
  100% {
    transform: scale(1.7);
    opacity: 0;
  }
}
.pm-pulse-ring {
  animation: pm-ping 2.2s cubic-bezier(0, 0, 0.2, 1) infinite;
}

@keyframes pm-dot {
  0%,
  100% {
    opacity: 1;
  }
  50% {
    opacity: 0.3;
  }
}
.pm-dot-pulse {
  animation: pm-dot 1.5s ease-in-out infinite;
}
</style>
