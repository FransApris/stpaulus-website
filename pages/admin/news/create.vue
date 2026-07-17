<template>
  <div class="min-h-screen bg-gray-50 py-8">
    <div class="max-w-5xl mx-auto px-4">
      <!-- Header -->
      <div class="mb-8">
        <div class="flex items-center justify-between">
          <div>
            <h1 class="text-3xl font-bold text-gray-900 mb-2">
              Buat Berita Baru
            </h1>
            <p class="text-gray-600">
              Lengkapi informasi 5W1H untuk generate narasi dengan AI
            </p>
          </div>
          <button
            @click="$router.push('/admin/news')"
            class="flex items-center text-gray-600 hover:text-gray-900"
          >
            <svg
              class="w-5 h-5 mr-1"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M10 19l-7-7m0 0l7-7m-7 7h18"
              />
            </svg>
            Kembali
          </button>
        </div>
      </div>

      <!-- Alert Messages -->
      <div
        v-if="successMessage"
        class="mb-6 bg-green-50 border border-green-200 rounded-lg p-4"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-green-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-green-800">{{ successMessage }}</span>
        </div>
      </div>

      <div
        v-if="errorMessage"
        class="mb-6 bg-red-50 border border-red-200 rounded-lg p-4"
      >
        <div class="flex items-center">
          <svg
            class="w-5 h-5 text-red-500 mr-2"
            fill="currentColor"
            viewBox="0 0 20 20"
          >
            <path
              fill-rule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
              clip-rule="evenodd"
            />
          </svg>
          <span class="text-red-800">{{ errorMessage }}</span>
        </div>
      </div>

      <!-- Main Form -->
      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- Basic Info Card -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <svg
              class="w-6 h-6 mr-2 text-blue-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            Informasi Dasar
          </h2>

          <div class="space-y-4">
            <!-- Title -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Judul Berita <span class="text-red-500">*</span>
              </label>
              <input
                v-model="form.title"
                type="text"
                required
                placeholder="Contoh: Perayaan Paskah Paroki St. Paulus 2026"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            <!-- Category -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Kategori <span class="text-red-500">*</span>
              </label>
              <div
                class="space-y-2 max-h-40 overflow-y-auto border border-gray-300 rounded-lg p-3"
              >
                <label
                  v-for="category in categories"
                  :key="category.id"
                  class="flex items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                >
                  <input
                    type="checkbox"
                    :value="category.id"
                    v-model="form.category_ids"
                    class="mr-2 h-4 w-4 text-blue-600"
                  />
                  <span class="text-sm">{{ category.name }}</span>
                  <span
                    v-if="category.sync_to_kronik"
                    class="ml-2 text-xs text-blue-600"
                  >
                    🔄 Auto-sync Kronik
                  </span>
                </label>
              </div>
              <p v-if="willSyncToKronik" class="mt-2 text-sm text-blue-600">
                ℹ️ Berita ini akan otomatis masuk ke Kronik saat dipublish
              </p>
            </div>

            <!-- Tag Organisasi -->
            <div
              class="border border-dashed border-gray-300 rounded-lg p-4 bg-gray-50"
            >
              <h3
                class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2"
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
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                </svg>
                Tag Organisasi
                <span class="text-xs font-normal text-gray-500"
                  >(opsional, untuk filtering)</span
                >
              </h3>
              <div class="space-y-4">
                <!-- Wilayah -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Wilayah</label
                  >
                  <div
                    class="max-h-28 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white grid grid-cols-2 gap-1"
                  >
                    <label
                      v-for="w in allWilayah"
                      :key="w.id"
                      class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5"
                    >
                      <input
                        type="checkbox"
                        :value="w.id"
                        v-model="form.wilayah_ids"
                        class="h-3.5 w-3.5 text-[#882f1d] rounded border-gray-300"
                      />
                      <span class="text-xs">{{ w.nama }}</span>
                    </label>
                    <span
                      v-if="allWilayah.length === 0"
                      class="text-xs text-gray-400 col-span-2 p-1"
                      >Memuat...</span
                    >
                  </div>
                </div>
                <!-- Lingkungan -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Lingkungan</label
                  >
                  <div
                    class="max-h-28 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white grid grid-cols-2 gap-1"
                  >
                    <label
                      v-for="l in allLingkungan"
                      :key="l.id"
                      class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5"
                    >
                      <input
                        type="checkbox"
                        :value="l.id"
                        v-model="form.lingkungan_ids"
                        class="h-3.5 w-3.5 text-[#882f1d] rounded border-gray-300"
                      />
                      <span class="text-xs">{{ l.nama }}</span>
                    </label>
                    <span
                      v-if="allLingkungan.length === 0"
                      class="text-xs text-gray-400 col-span-2 p-1"
                      >Memuat...</span
                    >
                  </div>
                </div>
                <!-- Seksi -->
                <div>
                  <label class="block text-sm font-medium text-gray-600 mb-1"
                    >Seksi / Bidang</label
                  >
                  <div
                    class="max-h-36 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-white space-y-2"
                  >
                    <div v-for="bidang in seksiGrouped" :key="bidang.nama">
                      <p
                        class="text-xs font-semibold text-gray-400 uppercase tracking-wide px-1 mb-0.5"
                      >
                        {{ bidang.nama }}
                      </p>
                      <div class="grid grid-cols-2 gap-1">
                        <label
                          v-for="s in bidang.seksi"
                          :key="s.id"
                          class="flex items-center gap-2 cursor-pointer hover:bg-gray-50 rounded px-1 py-0.5"
                        >
                          <input
                            type="checkbox"
                            :value="s.id"
                            v-model="form.seksi_ids"
                            class="h-3.5 w-3.5 text-[#882f1d] rounded border-gray-300"
                          />
                          <span class="text-xs">{{ s.nama }}</span>
                        </label>
                      </div>
                    </div>
                    <span
                      v-if="seksiGrouped.length === 0"
                      class="text-xs text-gray-400 p-1"
                      >Memuat...</span
                    >
                  </div>
                </div>
                <!-- BGKP -->
                <div>
                  <label class="flex items-center gap-3 cursor-pointer w-fit">
                    <input
                      type="checkbox"
                      v-model="form.is_bgkp"
                      class="h-4 w-4 text-[#882f1d] rounded border-gray-300"
                    />
                    <span class="text-sm font-medium text-gray-700"
                      >Tandai sebagai berita <strong>BGKP</strong></span
                    >
                  </label>
                </div>
              </div>
            </div>

            <!-- Author -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Penulis
              </label>
              <input
                v-model="form.author"
                type="text"
                placeholder="Nama penulis (opsional)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <!-- Excerpt -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                Ringkasan
              </label>
              <textarea
                v-model="form.excerpt"
                rows="3"
                placeholder="Ringkasan singkat berita (opsional)"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- 5W1H Section -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <svg
              class="w-6 h-6 mr-2 text-green-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Detail Peristiwa (5W1H)
          </h2>
          <p class="text-sm text-gray-600 mb-4">
            Isi detail di bawah untuk bahan generate narasi AI
          </p>

          <div class="space-y-4">
            <!-- When (Date + Time) -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  📅 Kapan (Tanggal)
                </label>
                <input
                  v-model="form.when_date"
                  type="date"
                  :max="maxDate"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">
                  🕐 Jam
                </label>
                <input
                  v-model="form.when_time"
                  type="text"
                  placeholder="Contoh: 08.00 - 12.00 WIB"
                  class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <!-- Where -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                📍 Dimana (Lokasi)
              </label>
              <textarea
                v-model="form.where_location"
                rows="2"
                placeholder="Contoh: Gereja Paroki St. Paulus, Jl. Raya Paroki No. 123"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <!-- Who -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                👥 Siapa (Peserta/Pelaku)
              </label>
              <textarea
                v-model="form.who_participants"
                rows="2"
                placeholder="Contoh: Seluruh umat Paroki St. Paulus, dipimpin oleh Romo Paroki"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <!-- Why -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                🎯 Mengapa (Tujuan/Alasan)
              </label>
              <textarea
                v-model="form.why_purpose"
                rows="2"
                placeholder="Contoh: Merayakan kebangkitan Yesus Kristus dan mempererat persaudaraan umat"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>

            <!-- How -->
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2">
                ⚙️ Bagaimana (Proses/Rangkaian)
              </label>
              <textarea
                v-model="form.how_process"
                rows="3"
                placeholder="Contoh: Misa diawali dengan prosesi lilin, dilanjutkan liturgi sabda, dan ditutup dengan ekaristi kudus"
                class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              ></textarea>
            </div>
          </div>

          <!-- AI Generate Button -->
          <div class="mt-6 pt-6 border-t border-gray-200">
            <button
              type="button"
              @click="generateNarasi"
              :disabled="aiGenerating || !form.title"
              class="w-full bg-gradient-to-r from-purple-500 to-blue-500 text-white px-6 py-3 rounded-lg hover:from-purple-600 hover:to-blue-600 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-all"
            >
              <svg
                v-if="aiGenerating"
                class="animate-spin h-5 w-5 mr-2"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              <svg
                v-else
                class="w-5 h-5 mr-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M13 10V3L4 14h7v7l9-11h-7z"
                />
              </svg>
              {{
                aiGenerating
                  ? "Generating dengan AI..."
                  : "✨ Generate Narasi dengan AI"
              }}
            </button>
            <p class="mt-2 text-sm text-gray-500 text-center">
              AI akan membuat narasi berita berdasarkan data 5W1H di atas
            </p>
          </div>
        </div>

        <!-- Content Section -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <svg
              class="w-6 h-6 mr-2 text-purple-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"
              />
            </svg>
            Narasi Berita
          </h2>

          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Konten Berita <span class="text-red-500">*</span>
            </label>
            <ClientOnly>
              <LazyCKEditorWrapper
                v-model="form.content"
                placeholder="Tulis narasi berita di sini, atau klik tombol 'Generate Narasi dengan AI' di atas..."
              />
              <template #fallback>
                <div
                  class="border border-gray-300 rounded-lg p-4 min-h-[300px] bg-gray-50 flex items-center justify-center"
                >
                  <div class="text-center">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"
                    ></div>
                    <p class="mt-2 text-sm text-gray-500">Memuat editor...</p>
                  </div>
                </div>
              </template>
            </ClientOnly>
            <p class="mt-1 text-sm text-gray-500">
              {{ getContentLength() }} karakter
            </p>
          </div>
        </div>

        <!-- Images Section -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <h2 class="text-xl font-semibold mb-4 flex items-center">
            <svg
              class="w-6 h-6 mr-2 text-orange-500"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
              />
            </svg>
            Gambar
          </h2>

          <!-- Featured Image -->
          <AdminImageUpload
            v-model="form.image"
            label="Gambar Utama/Thumbnail"
            helper-text="Gambar utama yang akan ditampilkan sebagai thumbnail"
            type="news"
            class="mb-6"
          />

          <!-- Gallery Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">
              Gallery (Multiple)
            </label>
            <input
              type="file"
              accept="image/*"
              multiple
              @change="handleGalleryUpload"
              ref="galleryInput"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <p class="mt-1 text-xs text-gray-500">
              Upload beberapa foto sekaligus untuk gallery
            </p>

            <div
              v-if="galleryPreviews.length > 0"
              class="mt-4 grid grid-cols-4 gap-4"
            >
              <div
                v-for="(preview, index) in galleryPreviews"
                :key="index"
                class="relative"
              >
                <img
                  :src="preview"
                  class="w-full h-24 object-cover rounded-lg shadow"
                />
                <button
                  type="button"
                  @click="removeGalleryImage(index)"
                  class="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
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
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Status & Actions -->
        <div class="bg-white rounded-lg shadow-sm p-6">
          <div class="flex items-center justify-between">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-2"
                >Status Publikasi</label
              >
              <select
                v-model="form.status"
                class="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
              >
                <option value="draft">Draft</option>
                <option value="published">Published</option>
              </select>
            </div>

            <div class="flex gap-4">
              <button
                type="button"
                @click="$router.push('/admin/news')"
                class="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Batal
              </button>
              <button
                type="submit"
                :disabled="submitting"
                class="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center"
              >
                <svg
                  v-if="submitting"
                  class="animate-spin h-4 w-4 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    class="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    stroke-width="4"
                  ></circle>
                  <path
                    class="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                {{ submitting ? "Menyimpan..." : "Simpan Berita" }}
              </button>
            </div>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

const router = useRouter();

// Form data
const form = ref({
  title: "",
  content: "",
  excerpt: "",
  author: "",
  category_ids: [] as number[],
  image: "",
  gallery_images: [] as string[],
  status: "published",
  when_date: "",
  when_time: "",
  where_location: "",
  who_participants: "",
  why_purpose: "",
  how_process: "",
  ai_generated: false,
  ai_prompt: "",
  wilayah_ids: [] as number[],
  lingkungan_ids: [] as number[],
  seksi_ids: [] as number[],
  is_bgkp: false,
});

// State
const categories = ref<any[]>([]);
const allWilayah = ref<any[]>([]);
const allLingkungan = ref<any[]>([]);
const formattedLingkungan = computed(() => {
  return allLingkungan.value.map((l) => {
    let namaWilayah = "";
    if (l.wilayah && l.wilayah.nama) {
      namaWilayah = l.wilayah.nama;
    } else if (l.wilayah_id && allWilayah.value.length > 0) {
      const w = allWilayah.value.find((x) => x.id === l.wilayah_id);
      if (w) namaWilayah = w.nama;
    }

    if (namaWilayah) {
      const nomorLingkungan = l.nama.replace("Lingkungan ", "");
      return { ...l, displayName: `${namaWilayah} ${nomorLingkungan}` };
    }
    return { ...l, displayName: l.nama };
  });
});
const allSeksi = ref<any[]>([]);
const seksiGrouped = computed(() => {
  const groups: Record<string, { nama: string; seksi: any[] }> = {};
  for (const s of allSeksi.value) {
    const b = s.bidang || "Lainnya";
    if (!groups[b]) groups[b] = { nama: b, seksi: [] };
    groups[b].seksi.push(s);
  }
  return Object.values(groups);
});
const galleryPreviews = ref<string[]>([]);
const galleryFiles = ref<File[]>([]);
const aiGenerating = ref(false);
const submitting = ref(false);
const successMessage = ref("");
const errorMessage = ref("");
const maxDate = new Date().toISOString().split('T')[0];

// Refs
const galleryInput = ref<HTMLInputElement>();

// Computed
const willSyncToKronik = computed(() => {
  return categories.value.some(
    (c: any) => form.value.category_ids.includes(c.id) && c.sync_to_kronik,
  );
});

// Get content length
const getContentLength = () => {
  if (!form.value.content) return 0;
  // Strip HTML tags
  const text = form.value.content.replace(/<[^>]*>/g, "");
  return text.length;
};

// Fetch categories
onMounted(async () => {
  try {
    const token = sessionStorage.getItem("admin_access_token");
    const response = await $fetch("/api/admin/article-categories", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    // Endpoint returns hierarchical array; flatten for checkbox list
    const flattenCategories = (cats: any[]): any[] => {
      let result: any[] = [];
      cats.forEach((cat: any) => {
        result.push({
          id: cat.id,
          name: cat.name,
          sync_to_kronik: !!cat.sync_to_kronik,
        });
        if (Array.isArray(cat.children) && cat.children.length > 0) {
          result = result.concat(flattenCategories(cat.children));
        }
      });
      return result;
    };

    categories.value = flattenCategories((response as any[]) || []);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
    errorMessage.value = "Gagal memuat kategori berita";
  }

  // Fetch organization data
  try {
    const token = sessionStorage.getItem("admin_access_token");
    const [wilayahRes, lingkunganRes, seksiRes] = await Promise.all([
      // Hapus /admin/ pada wilayah agar konsisten dengan API publik jika diperlukan,
      // atau biarkan jika endpoint admin memang ada. Tapi yang terpenting adalah cara ekstrak datanya di bawah.
      $fetch("/api/admin/wilayah", {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => []),
      $fetch("/api/lingkungan").catch(() => []),
      $fetch("/api/seksi").catch(() => []),
    ]);

    // Ekstrak data dengan aman untuk menangani format array langsung [...] maupun objek { data: [...] }
    allWilayah.value = Array.isArray(wilayahRes)
      ? wilayahRes
      : (wilayahRes as any)?.data || [];
    allLingkungan.value = Array.isArray(lingkunganRes)
      ? lingkunganRes
      : (lingkunganRes as any)?.data || [];
    allSeksi.value = Array.isArray(seksiRes)
      ? seksiRes
      : (seksiRes as any)?.data || [];
  } catch (error) {
    console.error("Failed to fetch organization data:", error);
  }
});

// Handle gallery upload
const handleGalleryUpload = (event: Event) => {
  const target = event.target as HTMLInputElement;
  const files = Array.from(target.files || []);

  files.forEach((file) => {
    galleryFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      galleryPreviews.value.push(e.target?.result as string);
    };
    reader.readAsDataURL(file);
  });
};

// Remove gallery image
const removeGalleryImage = (index: number) => {
  galleryFiles.value.splice(index, 1);
  galleryPreviews.value.splice(index, 1);
  form.value.gallery_images.splice(index, 1);
};

// Generate narasi with AI
const generateNarasi = async () => {
  if (!form.value.title) {
    errorMessage.value = "Judul harus diisi terlebih dahulu";
    setTimeout(() => (errorMessage.value = ""), 3000);
    return;
  }

  aiGenerating.value = true;
  errorMessage.value = "";

  try {
    const token = sessionStorage.getItem("admin_access_token");

    const response = await $fetch("/api/news/ai/generate-narasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: {
        what_title: form.value.title,
        when_date: form.value.when_date,
        when_time: form.value.when_time,
        where_location: form.value.where_location,
        who_participants: form.value.who_participants,
        why_purpose: form.value.why_purpose,
        how_process: form.value.how_process,
      },
    });

    const result = response as any;

    if (result.success) {
      form.value.content = result.narasi;
      form.value.ai_generated = true;
      form.value.ai_prompt = result.prompt;
      successMessage.value = "✅ Narasi berhasil di-generate dengan AI!";
      setTimeout(() => (successMessage.value = ""), 5000);
    }
  } catch (error: any) {
    console.error("AI Generate Error:", error);
    errorMessage.value =
      error.data?.message || "Gagal generate narasi dengan AI";
  } finally {
    aiGenerating.value = false;
  }
};

// Upload gallery images
const uploadGalleryImages = async () => {
  if (galleryFiles.value.length === 0) return [];

  const token = sessionStorage.getItem("admin_access_token");
  const formData = new FormData();

  galleryFiles.value.forEach((file: File) => {
    formData.append("files", file);
  });

  try {
    const response = await $fetch("/api/news/upload-images", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: formData,
    });

    const result = response as any;
    return result.success ? result.files : [];
  } catch (error) {
    console.error("Gallery upload error:", error);
    return [];
  }
};

// Handle submit
const handleSubmit = async () => {
  submitting.value = true;
  errorMessage.value = "";
  successMessage.value = "";

  try {
    // Validate
    if (!form.value.title || !form.value.content) {
      throw new Error("Judul dan konten harus diisi");
    }

    if (form.value.category_ids.length === 0) {
      throw new Error("Pilih minimal 1 kategori");
    }

    // Upload gallery images
    const uploadedGallery = await uploadGalleryImages();
    if (uploadedGallery.length > 0) {
      form.value.gallery_images = uploadedGallery;
    }

    const token = sessionStorage.getItem("admin_access_token");

    await $fetch("/api/admin/news", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: form.value,
    });

    successMessage.value = "✅ Berita berhasil dibuat!";

    setTimeout(() => {
      router.push("/admin/news");
    }, 2000);
  } catch (error: any) {
    console.error("Submit Error:", error);
    errorMessage.value =
      error.message || error.data?.message || "Gagal menyimpan berita";
  } finally {
    submitting.value = false;
  }
};
</script>
