<template>
  <!-- Single root wrapper required by Vue / Nuxt for Transition support -->
  <div>
  <!-- Add News Button -->
  <div class="mb-6">
    <button
      @click="showAddModal = true"
      class="bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-6 py-3 rounded-md text-sm font-medium shadow-lg flex items-center"
    >
      <svg
        class="w-5 h-5 mr-2"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          stroke-linecap="round"
          stroke-linejoin="round"
          stroke-width="2"
          d="M12 4v16m8-8H4"
        />
      </svg>
      ✨ Tambah Berita (dengan AI)
    </button>
  </div>

  <!-- News List -->
  <div class="px-4 py-6 sm:px-0">
    <!-- News List -->
    <div class="bg-white shadow rounded-lg">
      <div class="px-4 py-5 sm:p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">
            Daftar Berita
          </h3>
          <div class="flex space-x-2">
            <select
              v-model="filterStatus"
              @change="fetchNews"
              class="border border-gray-300 rounded-md px-3 py-2 text-sm"
            >
              <option value="">Semua Status</option>
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>
        </div>

        <div v-if="loading" class="text-center py-8">
          <div
            class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"
          ></div>
          <p class="mt-2 text-sm text-gray-500">Memuat berita...</p>
        </div>

        <div v-else-if="news.length === 0" class="text-center py-8">
          <svg
            class="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z"
            ></path>
          </svg>
          <h3 class="mt-2 text-sm font-medium text-gray-900">
            Belum ada berita
          </h3>
          <p class="mt-1 text-sm text-gray-500">
            Mulai dengan membuat berita pertama Anda.
          </p>
        </div>

        <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-1 gap-4">
          <div
            v-for="newsItem in news"
            :key="`news-${newsItem.id}-${newsItem.status}`"
            class="bg-white border border-gray-200 rounded-xl p-4 sm:p-5 hover:shadow-md hover:border-[#882f1d]/30 transition-all duration-200 group flex flex-col sm:flex-row gap-4 sm:gap-5 items-start"
          >
            <!-- Thumbnail & Main Info Wrapper (for mobile row) -->
            <div class="flex flex-row gap-4 flex-1 w-full min-w-0">
              <!-- Thumbnail -->
              <div v-if="newsItem.image" class="flex-shrink-0">
                <img
                  :src="newsItem.image"
                  :alt="newsItem.title"
                  class="w-24 h-24 sm:w-32 sm:h-24 object-cover rounded-lg shadow-sm group-hover:shadow-md transition-shadow"
                />
              </div>
              <div
                v-else
                class="flex-shrink-0 w-24 h-24 sm:w-32 sm:h-24 bg-gray-100 border border-gray-200 rounded-lg flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow"
              >
                <svg
                  class="w-8 h-8 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                  ></path>
                </svg>
              </div>

              <!-- Info -->
              <div class="flex-1 min-w-0 flex flex-col justify-center">
                <h4 class="text-base sm:text-lg font-bold text-gray-900 group-hover:text-[#882f1d] transition-colors line-clamp-2">
                  {{ newsItem.title }}
                </h4>
                <p class="text-xs sm:text-sm text-gray-500 mt-1 sm:mt-1.5 line-clamp-2">
                  {{ newsItem.excerpt || "Tidak ada ringkasan" }}
                </p>
                
                <!-- Desktop Meta (hidden on mobile to save space, moved below) -->
                <div class="hidden sm:flex items-center flex-wrap gap-x-4 gap-y-2 mt-2.5 text-xs text-gray-500 font-medium">
                  <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>{{ newsItem.author || "Tidak diketahui" }}</span>
                  <span class="flex items-center gap-1"><svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>{{ formatDate(newsItem.created_at) }}</span>
                  <span
                    :class="getStatusClass(newsItem.status)"
                    class="px-2.5 py-0.5 rounded-full text-[10px] sm:text-xs font-bold uppercase tracking-wider shadow-sm"
                  >
                    {{ getStatusText(newsItem.status) }}
                  </span>
                </div>
              </div>
            </div>
            
            <!-- Mobile Meta (visible only on mobile) -->
            <div class="sm:hidden w-full flex items-center justify-between flex-wrap gap-2 pt-3 border-t border-gray-100">
                <div class="flex flex-col gap-1 text-[11px] text-gray-500 font-medium">
                  <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>{{ newsItem.author || "Tidak diketahui" }}</span>
                  <span class="flex items-center gap-1"><svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>{{ formatDate(newsItem.created_at) }}</span>
                </div>
                <span
                  :class="getStatusClass(newsItem.status)"
                  class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider shadow-sm"
                >
                  {{ getStatusText(newsItem.status) }}
                </span>
            </div>

            <!-- Actions -->
            <div class="w-full sm:w-auto flex items-center justify-end space-x-2 pt-3 sm:pt-0 sm:pl-4 border-t sm:border-t-0 sm:border-l border-gray-100 sm:border-gray-200 mt-2 sm:mt-0 flex-shrink-0">
                <button
                  @click="editNews(newsItem)"
                  title="Edit"
                  class="flex-1 sm:flex-none bg-blue-50 text-blue-600 hover:bg-blue-600 hover:text-white border border-blue-200 hover:border-transparent p-2 sm:p-2.5 rounded-lg text-sm inline-flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
                <button
                  @click="togglePublish(newsItem)"
                  :title="newsItem.status === 'published' ? 'Unpublish' : 'Publish'"
                  :class="
                    newsItem.status === 'published'
                      ? 'bg-yellow-50 text-yellow-600 hover:bg-yellow-600 border-yellow-200'
                      : 'bg-green-50 text-green-600 hover:bg-green-600 border-green-200'
                  "
                  class="flex-1 sm:flex-none hover:text-white border hover:border-transparent p-2 sm:p-2.5 rounded-lg text-sm inline-flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      v-if="newsItem.status === 'published'"
                      stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21"
                    />
                    <path
                      v-else
                      stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                </button>
                <button
                  @click="deleteNews(newsItem)"
                  title="Hapus"
                  class="flex-1 sm:flex-none bg-red-50 text-red-600 hover:bg-red-600 hover:text-white border border-red-200 hover:border-transparent p-2 sm:p-2.5 rounded-lg text-sm inline-flex items-center justify-center transition-colors"
                >
                  <svg class="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
            </div>
          </div>
        </div>

        <!-- Pagination -->
        <div
          v-if="totalPages > 1"
          class="flex items-center justify-between border-t border-gray-200 pt-4 mt-4"
        >
          <div class="text-sm text-gray-500">
            Halaman {{ currentPage }} dari {{ totalPages }} ({{
              (currentPage - 1) * pageLimit + 1
            }}–{{ Math.min(currentPage * pageLimit, totalItems) }} dari
            {{ totalItems }})
          </div>
          <div class="flex items-center space-x-1">
            <button
              @click="goToPage(currentPage - 1)"
              :disabled="currentPage === 1"
              class="px-3 py-1 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              ‹
            </button>
            <button
              v-for="p in visiblePages"
              :key="p"
              @click="goToPage(p)"
              :class="
                p === currentPage
                  ? 'bg-[#882f1d] text-white border-[#882f1d]'
                  : 'hover:bg-gray-100 border-gray-300'
              "
              class="px-3 py-1 rounded border text-sm min-w-[36px]"
            >
              {{ p }}
            </button>
            <button
              @click="goToPage(currentPage + 1)"
              :disabled="currentPage === totalPages"
              class="px-3 py-1 rounded border text-sm disabled:opacity-40 disabled:cursor-not-allowed hover:bg-gray-100"
            >
              ›
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>

  <!-- Add/Edit News Modal -->
  <!-- v-if on newsForm ensures all child bindings (v-model="newsForm.*") are
       only evaluated after the form object is fully populated, preventing
       "Cannot read properties of undefined" on initial render. -->
  <div
    v-if="(showAddModal || editingNews) && newsForm"
    class="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50"
  >
    <div
      class="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white"
    >
      <div class="mt-3">
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ editingNews ? "Edit Berita" : "Tambah Berita Baru" }}
        </h3>

        <form @submit.prevent="saveNews" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Judul</label>
            <input
              v-model="newsForm.title"
              type="text"
              required
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
            />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Slug
              <span class="text-xs text-gray-500">(otomatis dari judul)</span>
            </label>
            <input
              v-model="newsForm.slug"
              type="text"
              required
              readonly
              disabled
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 bg-gray-100 text-gray-600 cursor-not-allowed"
              title="Slug otomatis dibuat dari judul"
            />
            <p class="mt-1 text-xs text-gray-500">
              🔒 Slug dibuat otomatis dari judul dan tidak dapat diedit
            </p>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Ringkasan</label
            >
            <textarea
              v-model="newsForm.excerpt"
              rows="3"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
            ></textarea>
          </div>

          <!-- 5W1H Section -->
          <div class="border-t border-gray-200 pt-4">
            <h4
              class="text-md font-semibold text-gray-900 mb-3 flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2 text-green-600"
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
              Detail Peristiwa (5W1H) - Opsional
            </h4>
            <p class="text-xs text-gray-500 mb-3">
              Isi detail untuk generate narasi dengan AI
            </p>

            <div class="space-y-3">
              <!-- When (Date + Time) -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >📅 Kapan (Tanggal)</label
                  >
                  <input
                    v-model="newsForm.when_date"
                    type="date"
                    :max="maxDate"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
                  />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700"
                    >🕐 Jam</label
                  >
                  <input
                    v-model="newsForm.when_time"
                    type="text"
                    placeholder="08.00 - 12.00 WIB"
                    class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
                  />
                </div>
              </div>

              <!-- Where -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >📍 Dimana (Lokasi)</label
                >
                <textarea
                  v-model="newsForm.where_location"
                  rows="2"
                  placeholder="Gereja Paroki St. Paulus"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
                ></textarea>
              </div>

              <!-- Who -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >👥 Siapa (Peserta)</label
                >
                <textarea
                  v-model="newsForm.who_participants"
                  rows="2"
                  placeholder="Seluruh umat paroki"
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
                ></textarea>
              </div>

              <!-- Why -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >🎯 Mengapa (Tujuan)</label
                >
                <textarea
                  v-model="newsForm.why_purpose"
                  rows="2"
                  placeholder="Merayakan..."
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
                ></textarea>
              </div>

              <!-- How -->
              <div>
                <label class="block text-sm font-medium text-gray-700"
                  >⚙️ Bagaimana (Proses)</label
                >
                <textarea
                  v-model="newsForm.how_process"
                  rows="2"
                  placeholder="Dimulai dengan..."
                  class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
                ></textarea>
              </div>
            </div>

            <!-- AI Generate Button -->
            <div class="mt-4">
              <button
                type="button"
                @click="generateNarasi"
                :disabled="aiGenerating || !newsForm.title"
                class="w-full bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
              >
                <svg
                  v-if="aiGenerating"
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
                <svg
                  v-else
                  class="w-4 h-4 mr-2"
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
                    ? "Generating..."
                    : "✨ Generate Narasi dengan AI"
                }}
              </button>
              <p class="mt-1 text-xs text-gray-500 text-center">
                AI akan membuat narasi dari data 5W1H
              </p>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Konten</label
            >
            <ClientOnly>
              <LazyCKEditorWrapper
                v-model="newsForm.content"
                placeholder="Tulis konten berita di sini..."
              />
              <template #fallback>
                <div
                  class="mt-1 border border-gray-300 rounded-md shadow-sm p-3 min-h-[300px] bg-gray-50 flex items-center justify-center"
                >
                  <div class="text-center">
                    <div
                      class="animate-spin rounded-full h-8 w-8 border-b-2 border-red-800 mx-auto"
                    ></div>
                    <p class="mt-2 text-sm text-gray-500">Memuat editor...</p>
                  </div>
                </div>
              </template>
            </ClientOnly>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Penulis</label
            >
            <input
              v-model="newsForm.author"
              type="text"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
            />
          </div>

          <!-- IMAGE UPLOAD COMPONENT -->
          <AdminImageUpload
            v-model="newsForm.image"
            label="Gambar/Thumbnail Berita"
            helper-text="Gambar akan tampil sebagai thumbnail di halaman utama dan detail berita"
            type="news"
          />

          <!-- Gallery Images -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Gallery (Multiple)</label
            >
            <input
              type="file"
              accept="image/*"
              multiple
              @change="handleGalleryUpload"
              ref="galleryInput"
              class="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
            />
            <div
              v-if="galleryPreviews.length > 0"
              class="mt-3 grid grid-cols-4 gap-2"
            >
              <div
                v-for="(preview, index) in galleryPreviews"
                :key="index"
                class="relative"
              >
                <img
                  :src="preview"
                  class="w-full h-20 object-cover rounded shadow"
                />
                <button
                  type="button"
                  @click="removeGalleryImage(index)"
                  class="absolute -top-1 -right-1 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <svg
                    class="w-3 h-3"
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

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Kategori</label
            >
            <div
              class="mt-1 max-h-32 overflow-y-auto border border-gray-300 rounded-md p-2"
            >
              <div
                v-for="category in allCategories"
                :key="category.id"
                class="flex items-center"
              >
                <input
                  :id="`category-${category.id}`"
                  v-model="newsForm.category_ids"
                  :value="category.id"
                  type="checkbox"
                  class="h-4 w-4 text-[#882f1d] focus:ring-[#882f1d] border-gray-300 rounded"
                />
                <label
                  :for="`category-${category.id}`"
                  class="ml-2 block text-sm text-gray-900"
                >
                  {{ category.name }}
                </label>
              </div>
            </div>
            <p class="mt-1 text-sm text-gray-500">
              Pilih satu atau lebih kategori untuk berita ini
            </p>
          </div>

          <!-- ===== SEKSI ORGANISASI ===== -->
          <div class="border-t border-gray-200 pt-4">
            <h4
              class="text-md font-semibold text-gray-900 mb-3 flex items-center"
            >
              <svg
                class="w-5 h-5 mr-2 text-[#882f1d]"
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
              Tag Organisasi (untuk filtering)
            </h4>

            <!-- Wilayah (single select dropdown) -->
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Wilayah</label
              >
              <select
                v-model="newsForm.wilayah_id"
                class="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#882f1d] focus:border-[#882f1d] outline-none bg-white"
              >
                <option :value="null">-- Pilih Wilayah --</option>
                <option v-for="w in allWilayah" :key="w.id" :value="w.id">
                  {{ w.nama }}
                </option>
              </select>
            </div>

            <!-- Lingkungan (single select, depends on wilayah) -->
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Lingkungan
                <span v-if="!newsForm.wilayah_id" class="text-xs text-gray-400 font-normal">
                  (pilih wilayah terlebih dahulu)
                </span>
              </label>
              <select
                v-model="newsForm.lingkungan_id"
                :disabled="!newsForm.wilayah_id"
                class="w-full border border-gray-200 rounded-md px-3 py-2 text-sm focus:ring-2 focus:ring-[#882f1d] focus:border-[#882f1d] outline-none bg-white disabled:bg-gray-100 disabled:cursor-not-allowed"
              >
                <option :value="null">-- Pilih Lingkungan --</option>
                <option v-for="l in formattedLingkungan" :key="l.id" :value="l.id">
                  {{ l.displayName }}
                </option>
              </select>
            </div>

            <!-- Seksi -->
            <div class="mb-3">
              <label class="block text-sm font-medium text-gray-700 mb-1"
                >Seksi / Bidang</label
              >
              <div
                class="max-h-36 overflow-y-auto border border-gray-200 rounded-md p-2 space-y-2"
              >
                <div v-for="bidang in seksiGrouped" :key="bidang.nama">
                  <p
                    class="text-xs font-semibold text-gray-500 uppercase tracking-wide px-1 mb-1"
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
                        v-model="newsForm.seksi_ids"
                        class="h-3.5 w-3.5 text-[#882f1d] rounded border-gray-300"
                      />
                      <span class="text-xs text-gray-700">{{ s.nama }}</span>
                    </label>
                  </div>
                </div>
              </div>
            </div>

            <!-- BGKP -->
            <div>
              <label class="flex items-center gap-3 cursor-pointer w-fit">
                <input
                  type="checkbox"
                  v-model="newsForm.is_bgkp"
                  class="h-4 w-4 text-[#882f1d] rounded border-gray-300"
                />
                <span class="text-sm font-medium text-gray-700"
                  >Tandai sebagai berita <strong>BGKP</strong> (Badan Gereja
                  Katolik Paroki)</span
                >
              </label>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700"
              >Status</label
            >
            <select
              v-model="newsForm.status"
              class="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-[#882f1d] focus:border-[#882f1d]"
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
              <option value="archived">Archived</option>
            </select>
          </div>

          <div class="flex justify-end space-x-3 pt-4">
            <button
              type="button"
              @click="closeModal"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-md text-sm font-medium"
            >
              Batal
            </button>
            <button
              type="submit"
              :disabled="saving"
              class="bg-[#882f1d] hover:bg-[#a55e1f] text-white px-4 py-2 rounded-md text-sm font-medium disabled:opacity-50"
            >
              {{ saving ? "Menyimpan..." : "Simpan" }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
  </div><!-- end single root wrapper -->
</template>

<script setup>
definePageMeta({
  middleware: "auth",
  layout: "admin",
});

import { watch } from "#imports";

// Components are auto-imported by Nuxt, no need for defineAsyncComponent
// Just wrap them in <ClientOnly> in the template

const news = useState("admin-news", () => []);
const loading = ref(false);
const showAddModal = ref(false);
const editingNews = ref(null);
const saving = ref(false);
const filterStatus = ref("");
const imageError = ref(false);
const maxDate = new Date().toISOString().split('T')[0];
const galleryInput = ref(null);

// Pagination state
const currentPage = useState("admin-news-page", () => 1);
const totalItems = useState("admin-news-total", () => 0);
const totalPages = useState("admin-news-total-pages", () => 1);
const pageLimit = 20;

const visiblePages = computed(() => {
  const pages = [];
  const start = Math.max(1, currentPage.value - 2);
  const end = Math.min(totalPages.value, currentPage.value + 2);
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

const goToPage = (page) => {
  if (page < 1 || page > totalPages.value) return;
  currentPage.value = page;
  fetchNews();
};

const newsForm = ref({
  title: "",
  slug: "",
  excerpt: "",
  content: "",
  author: "",
  image: "",
  gallery_images: [],
  status: "published",
  category_ids: [],
  when_date: "",
  when_time: "",
  where_location: "",
  who_participants: "",
  why_purpose: "",
  how_process: "",
  ai_generated: false,
  ai_prompt: "",
  wilayah_id: null,       // single select (number | null)
  lingkungan_id: null,    // single select (number | null)
  seksi_ids: [],
  is_bgkp: false,
});

// Data for organization dropdowns
const allWilayah = ref([]);
const allLingkungan = ref([]);
// Semua lingkungan diformat dengan displayName "NamaWilayah Nomor"
const allLingkunganFormatted = computed(() => {
  return allLingkungan.value.map((l) => {
    const namaWilayah =
      l.wilayah_display ||
      l.wilayah_nama ||
      (l.wilayah && l.wilayah.nama) ||
      (l.wilayah_id && allWilayah.value.length > 0
        ? (allWilayah.value.find((x) => x.id === l.wilayah_id) || {}).nama || ""
        : "");

    const nomorLingkungan =
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

// Dependent dropdown: filter lingkungan berdasarkan wilayah tunggal yang dipilih.
// Jika wilayah_id null → tampilkan semua lingkungan.
const formattedLingkungan = computed(() => {
  const selectedWilayahId = newsForm.value.wilayah_id;
  if (!selectedWilayahId) return allLingkunganFormatted.value;
  return allLingkunganFormatted.value.filter(
    (l) => l.wilayah_id === selectedWilayahId,
  );
});

// Watcher: saat wilayah berubah, reset lingkungan_id agar tidak ada
// state tidak valid (lingkungan dari wilayah lain masih terpilih).
watch(
  () => newsForm.value.wilayah_id,
  () => {
    newsForm.value.lingkungan_id = null;
  },
);
const allSeksi = ref([]);
const seksiGrouped = computed(() => {
  const groups = {};
  for (const s of allSeksi.value) {
    const b = s.bidang || "Lainnya";
    if (!groups[b]) groups[b] = { nama: b, seksi: [] };
    groups[b].seksi.push(s);
  }
  return Object.values(groups);
});

const galleryPreviews = ref([]);
const galleryFiles = ref([]);
const aiGenerating = ref(false);

const allCategories = ref([]);

// Auto-generate slug from title
watch(
  () => newsForm.value.title,
  (newTitle) => {
    if (newTitle && !editingNews.value) {
      const slug = newTitle
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "") // Remove non-alphanumeric except spaces and hyphens
        .replace(/\s+/g, "-") // Replace spaces with hyphens
        .replace(/-+/g, "-") // Replace multiple hyphens with single hyphen
        .replace(/^-|-$/g, ""); // Remove leading/trailing hyphens
      newsForm.value.slug = slug;
    }
  },
);

const handleLogout = () => {
  sessionStorage.removeItem("admin_access_token");
  localStorage.removeItem("admin_refresh_token");
  navigateTo("/admin/login");
};

// Fetch news
const fetchNews = async () => {
  const hasCache = news.value.length > 0;
  if (!hasCache) loading.value = true;
  try {
    const params = new URLSearchParams({
      page: String(currentPage.value),
      limit: String(pageLimit),
    });
    if (filterStatus.value) params.set("status", filterStatus.value);
    const response = await $fetch(`/api/admin/news?${params}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("admin_access_token")}`,
      },
    });
    news.value = response.data;
    totalItems.value = response.total;
    totalPages.value = response.totalPages;
  } catch (error) {
    console.error("Failed to fetch news:", error);
    if (!hasCache) alert("Gagal memuat berita");
  } finally {
    loading.value = false;
  }
};

// Fetch organization data for dropdowns
const fetchOrganizationData = async () => {
  try {
    const token = sessionStorage.getItem("admin_access_token");
    const [wilayahRes, lingkunganRes, seksiRes] = await Promise.all([
      $fetch("/api/admin/wilayah", {
        headers: { Authorization: `Bearer ${token}` },
      }).catch(() => []),
      $fetch("/api/lingkungan").catch(() => []),
      $fetch("/api/seksi").catch(() => []),
    ]);

    // Ekstrak data dengan aman: jika langsung array pakai array-nya, jika dibungkus '.data' ambil isinya
    allWilayah.value = Array.isArray(wilayahRes)
      ? wilayahRes
      : wilayahRes?.data || [];
    allLingkungan.value = Array.isArray(lingkunganRes)
      ? lingkunganRes
      : lingkunganRes?.data || [];
    allSeksi.value = Array.isArray(seksiRes) ? seksiRes : seksiRes?.data || [];
  } catch (error) {
    console.error("Failed to fetch organization data:", error);
  }
};

// Fetch categories
const fetchCategories = async () => {
  try {
    const response = await $fetch("/api/admin/article-categories", {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("admin_access_token")}`,
      },
    });

    // Flatten categories for checkbox selection
    const flattenCategories = (cats) => {
      let result = [];
      cats.forEach((cat) => {
        result.push({ id: cat.id, name: cat.name });
        if (cat.children) {
          result = result.concat(flattenCategories(cat.children));
        }
      });
      return result;
    };
    allCategories.value = flattenCategories(response);
  } catch (error) {
    console.error("Failed to fetch categories:", error);
  }
};

// Generate narasi with AI
const generateNarasi = async () => {
  if (!newsForm.value.title) {
    alert("Judul harus diisi terlebih dahulu");
    return;
  }

  aiGenerating.value = true;
  try {
    const response = await $fetch("/api/news/ai/generate-narasi", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${sessionStorage.getItem("admin_access_token")}`,
      },
      body: {
        what_title: newsForm.value.title,
        when_date: newsForm.value.when_date,
        when_time: newsForm.value.when_time,
        where_location: newsForm.value.where_location,
        who_participants: newsForm.value.who_participants,
        why_purpose: newsForm.value.why_purpose,
        how_process: newsForm.value.how_process,
      },
    });

    if (response.success) {
      newsForm.value.content = response.narasi;
      newsForm.value.ai_generated = true;
      newsForm.value.ai_prompt = response.prompt;
      alert("✅ Narasi berhasil di-generate dengan AI!");
    }
  } catch (error) {
    console.error("AI Generate Error:", error);
    alert(
      "Gagal generate narasi dengan AI: " +
        (error.data?.message || error.message),
    );
  } finally {
    aiGenerating.value = false;
  }
};

// Handle gallery upload
const handleGalleryUpload = (event) => {
  const files = Array.from(event.target.files || []);

  files.forEach((file) => {
    galleryFiles.value.push(file);
    const reader = new FileReader();
    reader.onload = (e) => {
      galleryPreviews.value.push(e.target?.result);
    };
    reader.readAsDataURL(file);
  });
};

// Remove gallery image
const removeGalleryImage = (index) => {
  galleryFiles.value.splice(index, 1);
  galleryPreviews.value.splice(index, 1);
  if (newsForm.value.gallery_images[index]) {
    newsForm.value.gallery_images.splice(index, 1);
  }
};

// Upload gallery images
const uploadGalleryImages = async () => {
  if (galleryFiles.value.length === 0) return [];

  const formData = new FormData();
  galleryFiles.value.forEach((file) => {
    formData.append("files", file);
  });

  try {
    const response = await $fetch("/api/news/upload-images", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("admin_access_token")}`,
      },
      body: formData,
    });

    return response.success ? response.files : [];
  } catch (error) {
    console.error("Gallery upload error:", error);
    return [];
  }
};

// Save news
const saveNews = async () => {
  saving.value = true;
  try {
    // Upload gallery images first
    const uploadedGallery = await uploadGalleryImages();
    if (uploadedGallery.length > 0) {
      newsForm.value.gallery_images = uploadedGallery;
    }

    const url = editingNews.value
      ? `/api/admin/news/${editingNews.value.id}`
      : "/api/admin/news";
    const method = editingNews.value ? "PUT" : "POST";

    await $fetch(url, {
      method,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("admin_access_token")}`,
        "Content-Type": "application/json",
      },
      body: newsForm.value,
    });

    closeModal();
    await fetchNews();
    alert(
      editingNews.value
        ? "Berita berhasil diperbarui"
        : "Berita berhasil ditambahkan",
    );
  } catch (error) {
    console.error("Failed to save news:", error);
    alert("Gagal menyimpan berita");
  } finally {
    saving.value = false;
  }
};

// Edit news
const editNews = (newsItem) => {
  editingNews.value = newsItem;
  imageError.value = false;

  // Parse gallery_images if it's a JSON string
  let galleryImages = [];
  if (newsItem.gallery_images) {
    try {
      galleryImages =
        typeof newsItem.gallery_images === "string"
          ? JSON.parse(newsItem.gallery_images)
          : newsItem.gallery_images;
    } catch (e) {
      console.error("Failed to parse gallery_images:", e);
      galleryImages = [];
    }
  }

  // Set gallery previews
  galleryPreviews.value = Array.isArray(galleryImages)
    ? [...galleryImages]
    : [];
  galleryFiles.value = [];

  newsForm.value = {
    title: newsItem.title,
    slug: newsItem.slug,
    excerpt: newsItem.excerpt || "",
    content: newsItem.content,
    author: newsItem.author || "",
    image: newsItem.image || "",
    gallery_images: galleryImages,
    status: newsItem.status,
    category_ids: newsItem.categories
      ? newsItem.categories.map((cat) => cat.id)
      : [],
    when_date: newsItem.when_date || "",
    when_time: newsItem.when_time || "",
    where_location: newsItem.where_location || "",
    who_participants: newsItem.who_participants || "",
    why_purpose: newsItem.why_purpose || "",
    how_process: newsItem.how_process || "",
    ai_generated: newsItem.ai_generated || false,
    ai_prompt: newsItem.ai_prompt || "",
    wilayah_id: newsItem.wilayah_id ?? newsItem.wilayah_ids?.[0] ?? null,
    lingkungan_id: newsItem.lingkungan_id ?? newsItem.lingkungan_ids?.[0] ?? null,
    seksi_ids: newsItem.seksi_ids || [],
    is_bgkp: !!newsItem.is_bgkp,
  };
};

// Toggle publish status
const togglePublish = async (newsItem) => {
  try {
    const newStatus = newsItem.status === "published" ? "draft" : "published";

    console.log("[Toggle Publish] newsItem:", newsItem);
    console.log("[Toggle Publish] newsItem.image:", newsItem.image);
    console.log(
      "[Toggle Publish] Before:",
      newsItem.status,
      "→ After:",
      newStatus,
    );

    await $fetch(`/api/admin/news/${newsItem.id}`, {
      method: "PUT",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("admin_access_token")}`,
        "Content-Type": "application/json",
      },
      body: {
        title: newsItem.title,
        slug: newsItem.slug,
        excerpt: newsItem.excerpt || "",
        content: newsItem.content,
        author: newsItem.author || "",
        status: newStatus,
        image: newsItem.image || null,
        category_ids: newsItem.categories
          ? newsItem.categories.map((cat) => cat.id)
          : [],
      },
    });

    console.log("[Toggle Publish] API success, waiting 100ms...");

    // Small delay to ensure database is updated
    await new Promise((resolve) => setTimeout(resolve, 100));

    // Force refresh list from server with cache bust
    await fetchNews();

    console.log(
      "[Toggle Publish] List refreshed, new data:",
      news.value.find((n) => n.id === newsItem.id),
    );
  } catch (error) {
    console.error("Failed to toggle publish status:", error);
    alert("Gagal mengubah status berita");
  }
};

// Delete news
const deleteNews = async (newsItem) => {
  if (
    !confirm(`Apakah Anda yakin ingin menghapus berita "${newsItem.title}"?`)
  ) {
    return;
  }

  try {
    await $fetch(`/api/admin/news/${newsItem.id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem("admin_access_token")}`,
      },
    });

    await fetchNews();
    alert("Berita berhasil dihapus");
  } catch (error) {
    console.error("Failed to delete news:", error);
    alert("Gagal menghapus berita");
  }
};

// Close modal
const closeModal = () => {
  showAddModal.value = false;
  editingNews.value = null;
  galleryPreviews.value = [];
  galleryFiles.value = [];
  aiGenerating.value = false;
  newsForm.value = {
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    author: "",
    image: "",
    gallery_images: [],
    status: "published",
    category_ids: [],
    when_date: "",
    when_time: "",
    where_location: "",
    who_participants: "",
    why_purpose: "",
    how_process: "",
    ai_generated: false,
    ai_prompt: "",
    wilayah_id: null,
    lingkungan_id: null,
    seksi_ids: [],
    is_bgkp: false,
  };
};

// Helper functions
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("id-ID", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
};

const getStatusClass = (status) => {
  switch (status) {
    case "published":
      return "bg-green-100 text-green-800";
    case "draft":
      return "bg-yellow-100 text-yellow-800";
    case "archived":
      return "bg-gray-100 text-gray-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getStatusText = (status) => {
  switch (status) {
    case "published":
      return "Published";
    case "draft":
      return "Draft";
    case "archived":
      return "Archived";
    default:
      return status;
  }
};

// Check authentication and fetch data on mount
onMounted(async () => {
  const token = sessionStorage.getItem("admin_access_token");
  if (!token) {
    navigateTo("/admin/login");
    return;
  }

  await Promise.all([fetchNews(), fetchCategories(), fetchOrganizationData()]);
});

// Reset to page 1 when status filter changes
watch(filterStatus, () => {
  currentPage.value = 1;
  fetchNews();
});
</script>
