<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Berita Paroki" />
    <div v-else>
  <div class="min-h-screen bg-gray-50">
    <!-- Pull to Refresh Indicator -->
    <div
      v-if="pullState.isPulling || pullState.isRefreshing"
      class="fixed top-20 left-0 right-0 z-40 bg-[#882f1d] text-white text-center py-2 transition-transform duration-200"
      :style="{
        transform: `translateY(${Math.max(0, pullState.pullDistance - 20)}px)`,
      }"
    >
      <div class="flex items-center justify-center space-x-2">
        <div
          v-if="pullState.isRefreshing"
          class="animate-spin rounded-full h-4 w-4 border-b-2 border-white"
        ></div>
        <span class="text-sm font-medium">
          {{
            pullState.isRefreshing
              ? "Memuat ulang..."
              : pullState.canRefresh
                ? "Lepaskan untuk memuat ulang"
                : `Tarik
          ke bawah untuk memuat ulang`
          }}
        </span>
      </div>
    </div>

    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Berita Paroki</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Update terbaru tentang kegiatan dan acara gereja kami
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Berita" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-4">
      <!-- Filter Panel -->
      <div
        class="bg-white rounded-xl shadow-sm border border-gray-100 p-4 mb-6"
      >
        <div class="flex items-center justify-between mb-3">
          <h3
            class="text-sm font-semibold text-gray-700 flex items-center gap-2"
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
                d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2a1 1 0 01-.293.707L13 13.414V19a1 1 0 01-.553.894l-4 2A1 1 0 017 21v-7.586L3.293 6.707A1 1 0 013 6V4z"
              />
            </svg>
            Filter Berita
          </h3>
          <button
            v-if="hasActiveFilter"
            @click="clearFilter"
            class="text-xs text-[#882f1d] hover:underline font-medium"
          >
            Hapus Filter
          </button>
        </div>

        <div class="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <!-- Filter Wilayah -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1"
              >Wilayah</label
            >
            <select
              v-model="activeFilter.wilayah_id"
              @change="onWilayahChange"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#882f1d] focus:border-[#882f1d] outline-none bg-white"
            >
              <option :value="null">Semua Wilayah</option>
              <option v-for="w in wilayahList" :key="w.id" :value="w.id">
                {{ w.nama }}
              </option>
            </select>
          </div>

          <!-- Filter Lingkungan -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1"
              >Lingkungan</label
            >
            <select
              v-model="activeFilter.lingkungan_id"
              @change="applyFilter"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#882f1d] focus:border-[#882f1d] outline-none bg-white"
            >
              <option :value="null">Semua Lingkungan</option>
              <option v-for="l in lingkunganList" :key="l.id" :value="l.id">
                {{ l.displayName }}
              </option>
            </select>
          </div>

          <!-- Filter Seksi -->
          <div>
            <label class="block text-xs font-medium text-gray-500 mb-1"
              >Seksi</label
            >
            <select
              v-model="activeFilter.seksi_id"
              @change="applyFilter"
              class="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-[#882f1d] focus:border-[#882f1d] outline-none bg-white"
            >
              <option :value="null">Semua Seksi</option>
              <template v-for="bidang in seksiGrouped" :key="bidang.nama">
                <optgroup :label="bidang.nama">
                  <option v-for="s in bidang.seksi" :key="s.id" :value="s.id">
                    {{ s.nama }}
                  </option>
                </optgroup>
              </template>
            </select>
          </div>

          <!-- Filter BGKP -->
          <div class="flex items-end">
            <label
              class="flex items-center gap-2 cursor-pointer w-full border border-gray-200 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
              :class="
                activeFilter.is_bgkp ? 'bg-amber-50 border-amber-300' : ''
              "
            >
              <input
                type="checkbox"
                v-model="activeFilter.is_bgkp"
                @change="applyFilter"
                class="w-4 h-4 text-[#882f1d] rounded border-gray-300"
              />
              <span class="text-sm font-medium text-gray-700">BGKP</span>
            </label>
          </div>
        </div>

        <!-- Active filter badges -->
        <div
          v-if="hasActiveFilter"
          class="flex flex-wrap gap-2 mt-3 pt-3 border-t border-gray-100"
        >
          <span
            v-if="activeFilter.wilayah_id"
            class="inline-flex items-center gap-1 bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full font-medium"
          >
            Wilayah:
            {{
              wilayahList.find((w) => w.id === activeFilter.wilayah_id)?.nama
            }}
            <button
              @click="
                activeFilter.wilayah_id = null;
                applyFilter();
              "
              class="hover:text-blue-900"
            >
              ×
            </button>
          </span>
          <span
            v-if="activeFilter.lingkungan_id"
            class="inline-flex items-center gap-1 bg-green-100 text-green-700 text-xs px-2 py-1 rounded-full font-medium"
          >
            Lingkungan:
            {{
              lingkunganList.find(
                (l: any) => l.id === activeFilter.lingkungan_id,
              )?.displayName
            }}
            <button
              @click="
                activeFilter.lingkungan_id = null;
                applyFilter();
              "
              class="hover:text-green-900"
            >
              ×
            </button>
          </span>
          <span
            v-if="activeFilter.seksi_id"
            class="inline-flex items-center gap-1 bg-purple-100 text-purple-700 text-xs px-2 py-1 rounded-full font-medium"
          >
            Seksi:
            {{ allSeksi.find((s) => s.id === activeFilter.seksi_id)?.nama }}
            <button
              @click="
                activeFilter.seksi_id = null;
                applyFilter();
              "
              class="hover:text-purple-900"
            >
              ×
            </button>
          </span>
          <span
            v-if="activeFilter.is_bgkp"
            class="inline-flex items-center gap-1 bg-amber-100 text-amber-700 text-xs px-2 py-1 rounded-full font-medium"
          >
            BGKP
            <button
              @click="
                activeFilter.is_bgkp = false;
                applyFilter();
              "
              class="hover:text-amber-900"
            >
              ×
            </button>
          </span>
        </div>
      </div>
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
      <!-- Skeleton Loading (Tahap 5) -->
      <div v-if="pending" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6" aria-label="Memuat berita..." aria-busy="true">
        <div v-for="i in 6" :key="i" class="bg-white rounded-xl shadow-sm overflow-hidden animate-pulse">
          <div class="w-full h-48 bg-gray-200"></div>
          <div class="p-4 space-y-3">
            <div class="flex gap-2">
              <div class="h-5 bg-gray-200 rounded-full w-16"></div>
              <div class="h-5 bg-gray-200 rounded-full w-20"></div>
            </div>
            <div class="h-5 bg-gray-200 rounded w-full"></div>
            <div class="h-5 bg-gray-200 rounded w-4/5"></div>
            <div class="h-4 bg-gray-200 rounded w-full"></div>
            <div class="h-4 bg-gray-200 rounded w-2/3"></div>
            <div class="h-3 bg-gray-200 rounded w-24 mt-2"></div>
          </div>
        </div>
      </div>

      <!-- Error State -->
      <div v-else-if="error" class="text-center py-12">
        <p class="text-red-500">Error memuat berita: {{ error.message }}</p>
        <NuxtLink to="/berita" class="mt-4 inline-block text-blue-500 hover:underline">Coba Lagi</NuxtLink>
      </div>

      <!-- Daftar Berita (Grid Card) -->
      <div
        v-else-if="posts && posts.length > 0"
        ref="contentRef"
        class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        <ArticleCard
          v-for="post in paginatedPosts"
          :key="post.id"
          :image="post.image"
          image-type="url"
          :title="post.title"
          :description="post.excerpt"
          :date="post.date"
          :to="`/berita/${post.slug}`"
          class="touch-manipulation"
        />
      </div>
      <div
        v-if="totalPages > 1"
        class="mt-8 flex items-center justify-center gap-2"
      >
        <button
          @click="goToPage(currentPage - 1)"
          :disabled="currentPage === 1"
          class="inline-flex items-center gap-1 rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          aria-label="Halaman Sebelumnya"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
          </svg>
          <span class="hidden sm:inline">Sebelumnya</span>
        </button>
        <button
          v-for="page in visiblePages"
          :key="page"
          @click="goToPage(page)"
          class="rounded border px-3 py-2 text-sm"
          :class="
            page === currentPage
              ? 'border-[#882f1d] bg-[#882f1d] text-white'
              : 'hover:bg-gray-50'
          "
        >
          {{ page }}
        </button>
        <button
          @click="goToPage(currentPage + 1)"
          :disabled="currentPage === totalPages"
          class="inline-flex items-center gap-1 rounded border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50"
          aria-label="Halaman Selanjutnya"
        >
          <span class="hidden sm:inline">Berikutnya</span>
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
          </svg>
        </button>
      </div>

      <!-- State Kosong -->
      <div v-else class="text-center py-12">
        <p class="text-gray-500 text-lg">
          Belum ada berita tersedia. Silakan cek lagi nanti!
        </p>
      </div>
    </div>
  </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, onMounted } from "vue";
import { useMaintenance } from '~/composables/useMaintenance';
const { isMaintenance } = useMaintenance('berita')

// 1. Definisikan Cetak Biru (Interface) agar TypeScript mengenali properti data Anda
interface Wilayah {
  id: number;
  nama: string;
}
interface Lingkungan {
  id: number;
  nama: string;
}
interface Seksi {
  id: number;
  nama: string;
  bidang?: string;
}
interface Post {
  id: number | string;
  title: string;
  excerpt: string;
  slug: string;
  date: string;
  image: string;
}

const currentPage = useState<number>("public-news-page", () => 1);
const pageLimit = 10;

// 2. Berikan tipe eksplisit pada filter agar tidak terkunci sebagai "null"
const activeFilter = ref({
  wilayah_id: null as number | null,
  lingkungan_id: null as number | null,
  seksi_id: null as number | null,
  is_bgkp: false,
});

const hasActiveFilter = computed(
  () =>
    activeFilter.value.wilayah_id !== null ||
    activeFilter.value.lingkungan_id !== null ||
    activeFilter.value.seksi_id !== null ||
    activeFilter.value.is_bgkp,
);

// 3. Tambahkan tipe Generics (<Tipe>) pada $fetch dan computed
// Ubah endpoint wilayah menjadi API publik (hilangkan /admin/)
const { data: wilayahRaw } = await useAsyncData("filter-wilayah", () =>
  $fetch<any>("/api/wilayah").catch(() => []),
);
const wilayahList = computed<Wilayah[]>(() => {
  const res = wilayahRaw.value;
  if (!res) return [];
  // Ekstrak array dengan aman, apakah langsung array atau di dalam properti .data
  return Array.isArray(res) ? res : res.data || [];
});

const { data: lingkunganRaw } = await useAsyncData("filter-lingkungan", () =>
  $fetch<any>("/api/lingkungan").catch(() => []),
);

// Semua lingkungan yang sudah diformat dengan displayName
const allLingkunganFormatted = computed(() => {
  const res = lingkunganRaw.value;
  if (!res) return [];

  const rawArray: any[] = Array.isArray(res) ? res : (res.data || []);

  return rawArray.map((l: any) => {
    // /api/lingkungan menyediakan: wilayah_display, wilayah_nama, no, nama
    const namaWilayah: string =
      l.wilayah_display ||
      l.wilayah_nama ||
      l.wilayah?.nama ||
      "";

    const nomorLingkungan: string | number =
      l.no != null
        ? l.no
        : String(l.nama ?? "").replace(/^Lingkungan\s*/i, "").trim();

    return {
      ...l,
      displayName: namaWilayah
        ? `${namaWilayah} ${nomorLingkungan}`
        : (l.nama ?? `Lingkungan ${nomorLingkungan}`),
    };
  });
});

// Dependent dropdown: filter lingkungan berdasarkan wilayah yang dipilih.
// Jika wilayah_id null → tampilkan semua lingkungan.
const lingkunganList = computed(() => {
  const selectedWilayah = activeFilter.value.wilayah_id;
  if (!selectedWilayah) return allLingkunganFormatted.value;
  return allLingkunganFormatted.value.filter(
    (l: any) => l.wilayah_id === selectedWilayah,
  );
});

// Handler saat wilayah berubah:
// 1. Reset lingkungan_id agar tidak ada state tidak valid
// 2. Terapkan filter ke API
const onWilayahChange = async () => {
  activeFilter.value.lingkungan_id = null;
  await applyFilter();
};

const { data: allSeksiRaw } = await useAsyncData("filter-seksi", () =>
  $fetch<any>("/api/seksi").catch(() => []),
);
const allSeksi = computed<Seksi[]>(() => {
  const res = allSeksiRaw.value;
  if (!res) return [];
  return Array.isArray(res) ? res : res.data || [];
});

const seksiGrouped = computed(() => {
  const groups: Record<string, { nama: string; seksi: Seksi[] }> = {};
  for (const s of allSeksi.value) {
    const b = s.bidang || "Lainnya";
    if (!groups[b]) groups[b] = { nama: b, seksi: [] };
    groups[b].seksi.push(s);
  }
  return Object.values(groups);
});

// Fetch data berita dengan filter
const fetchParams = ref<Record<string, any>>({});

// 4. Definisikan bahwa data yang kembali adalah Array of Post (Post[])
const {
  data: posts,
  pending,
  error,
  refresh,
} = await useAsyncData<Post[]>(
  "posts",
  async () => {
    try {
      return await $fetch<Post[]>("/api/berita", { params: fetchParams.value });
    } catch (err) {
      console.error("Failed to fetch news:", err);
      return [];
    }
  },
  {
    default: () => [],
    transform: (data) => data || [],
  },
);

const applyFilter = async () => {
  currentPage.value = 1;
  const params: Record<string, any> = {};
  if (activeFilter.value.wilayah_id)
    params.wilayah_id = activeFilter.value.wilayah_id;
  if (activeFilter.value.lingkungan_id)
    params.lingkungan_id = activeFilter.value.lingkungan_id;
  if (activeFilter.value.seksi_id)
    params.seksi_id = activeFilter.value.seksi_id;
  if (activeFilter.value.is_bgkp) params.is_bgkp = "1";
  fetchParams.value = params;
  await refresh();
};

const clearFilter = async () => {
  activeFilter.value = {
    wilayah_id: null,
    lingkungan_id: null,
    seksi_id: null,
    is_bgkp: false,
  };
  fetchParams.value = {};
  currentPage.value = 1;
  await refresh();
};

const totalPages = computed(() =>
  Math.max(1, Math.ceil((posts.value?.length || 0) / pageLimit)),
);

// 5. Pastikan hasil paginasi bertipe Post[]
const paginatedPosts = computed<Post[]>(() => {
  const list = posts.value || [];
  const start = (currentPage.value - 1) * pageLimit;
  return list.slice(start, start + pageLimit);
});

const visiblePages = computed(() => {
  const pages: number[] = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let page = start; page <= end; page++) pages.push(page);
  return pages;
});

// 6. Tambahkan tipe "number" pada parameter page
const goToPage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
};

watch(totalPages, (pageCount) => {
  if (currentPage.value > pageCount) {
    currentPage.value = pageCount;
  }
});

// Pull to refresh setup
const contentRef = ref<HTMLElement | null>(null);
let pullToRefreshInstance: any = null;

const pullState = ref({
  isPulling: false,
  pullDistance: 0,
  isRefreshing: false,
  canRefresh: false,
});

onMounted(() => {
  // Scroll-to-top sudah ditangani secara global oleh router.options.ts
  if (contentRef.value) {
    // Gunakan ts-ignore jika auto-import composable usePullToRefresh belum memiliki file deklarasi .d.ts
    // @ts-ignore
    pullToRefreshInstance = usePullToRefresh(contentRef.value, {
      threshold: 80,
      onRefresh: async () => {
        await refresh();
      },
    });

    if (pullToRefreshInstance) {
      pullState.value = pullToRefreshInstance.pullState;
    }
  }
});
</script>
