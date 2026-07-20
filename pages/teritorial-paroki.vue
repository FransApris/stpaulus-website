<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Teritorial Paroki" />
    <div v-else>
  <div class="min-h-screen bg-gray-50">
    <!-- Header -->
    <div class="bg-[#882f1d] text-white">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div class="text-center">
          <h1 class="text-4xl font-cinzel font-bold mb-4">Teritorial Paroki</h1>
          <p class="text-xl text-gray-200 max-w-2xl mx-auto">
            Peta wilayah dan informasi lingkungan Paroki St. Paulus Juanda
          </p>
        </div>
      </div>
    </div>

    <!-- Breadcrumb -->
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <Breadcrumb title="Teritorial Paroki" />
    </div>

    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <!-- Statistik Wilayah -->
        <div class="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12 max-w-5xl mx-auto">
          <div
            class="bg-gradient-to-br from-blue-50 to-blue-100 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-blue-600 mb-1">{{ apiStats.totalLingkungan || 0 }}</div>
            <div class="text-xs md:text-sm text-blue-800 font-medium">Total Lingkungan</div>
          </div>
          <div
            class="bg-gradient-to-br from-green-50 to-green-100 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-green-600 mb-1">{{ apiStats.totalKK || 0 }}+</div>
            <div class="text-xs md:text-sm text-green-800 font-medium">Kepala Keluarga</div>
          </div>
          <div
            class="bg-gradient-to-br from-purple-50 to-purple-100 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-purple-600 mb-1">{{ apiStats.totalJiwa || 0 }}+</div>
            <div class="text-xs md:text-sm text-purple-800 font-medium">Jiwa</div>
          </div>
          <div
            class="bg-gradient-to-br from-orange-50 to-orange-100 p-4 md:p-6 rounded-xl shadow-md hover:shadow-lg transition-shadow">
            <div class="text-3xl md:text-4xl font-bold text-orange-600 mb-1">{{ apiStats.totalWilayah || 0 }}+</div>
            <div class="text-xs md:text-sm text-orange-800 font-medium">Wilayah</div>
          </div>
        </div>

        <!-- Deskripsi Wilayah -->
        <div
          class="mb-8 md:mb-12 bg-white rounded-xl shadow-md p-6 md:p-8 max-w-5xl mx-auto border-l-4 border-[#882f1d]">
          <h2 class="text-xl md:text-2xl font-cinzel font-bold text-[#882f1d] mb-4 flex items-center gap-2">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Tentang Wilayah Paroki
          </h2>
          <div class="prose max-w-none text-gray-700 leading-relaxed">
            <p class="mb-3">
              Paroki St. Paulus Juanda melayani umat Katolik di wilayah <strong>Sidoarjo bagian utara</strong>,
              mencakup beberapa kecamatan dengan total <strong>{{ apiStats.totalLingkungan || 12 }} lingkungan</strong>
              yang tersebar di berbagai wilayah.
            </p>
            <p>
              Setiap lingkungan memiliki ketua dan pengurus yang aktif dalam melayani umat,
              mengkoordinasikan kegiatan rohani, dan membangun komunitas yang solid.
            </p>
          </div>
        </div>

        <!-- Google My Maps Embed -->
        <div class="max-w-7xl mx-auto mb-8 md:mb-12">
          <h2 class="text-xl md:text-2xl font-cinzel font-bold text-[#882f1d] mb-4 text-center">📍 Peta Wilayah
            Interaktif</h2>
          <!-- wrapper: full lebar di mobile, 50% di desktop -->
          <div class="flex justify-center">
            <div class="w-full md:w-1/2">
              <MapEmbed :height="600" title="Peta Wilayah Teritorial Paroki St. Paulus Juanda"
                address="Paroki St Paulus Juanda Sidoarjo" />
            </div>
          </div>
        </div>

        <!-- Daftar Lingkungan -->
        <div class="max-w-7xl mx-auto mb-8">
          <div class="text-center mb-8">
            <h2 class="text-xl md:text-2xl font-cinzel font-bold text-[#882f1d] mb-2">📋 Daftar Wilayah & Lingkungan
            </h2>
            <p class="text-gray-600">
              Jelajahi {{ Object.keys(groupedByWilayah).length }} wilayah dengan {{ filteredLingkungan.length }}
              lingkungan di Paroki St. Paulus
            </p>
          </div>

          <!-- Quick Summary (only in grouped view) -->
          <div v-if="viewMode === 'grouped' && !searchQuery"
            class="mb-6 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl p-6 border border-blue-100">
            <div class="flex items-center justify-center gap-8 flex-wrap">
              <div class="text-center">
                <p class="text-3xl font-bold text-[#882f1d]">{{ Object.keys(groupedByWilayah).length }}</p>
                <p class="text-sm text-gray-600">Wilayah</p>
              </div>
              <div class="hidden md:block w-px h-12 bg-gray-300"></div>
              <div class="text-center">
                <p class="text-3xl font-bold text-blue-600">{{ filteredLingkungan.length }}</p>
                <p class="text-sm text-gray-600">Lingkungan</p>
              </div>
              <div class="hidden md:block w-px h-12 bg-gray-300"></div>
              <div class="text-center">
                <p class="text-3xl font-bold text-green-600">
                  {{filteredLingkungan.reduce((sum, l) => sum + l.jumlahKK, 0)}}
                </p>
                <p class="text-sm text-gray-600">Total KK</p>
              </div>
              <div class="hidden md:block w-px h-12 bg-gray-300"></div>
              <div class="text-center">
                <p class="text-3xl font-bold text-purple-600">
                  {{filteredLingkungan.reduce((sum, l) => sum + (l.jumlahKK * 3), 0)}}
                </p>
                <p class="text-sm text-gray-600">Total Jiwa</p>
              </div>
            </div>
          </div>

          <!-- Search Bar and View Toggle -->
          <div class="mb-6 max-w-4xl mx-auto">
            <div class="flex flex-col md:flex-row gap-4 items-center">
              <!-- Search -->
              <div class="relative flex-1 w-full">
                <input v-model="searchQuery" type="text" placeholder="Cari lingkungan atau wilayah..."
                  class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all" />
                <svg class="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none"
                  stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>

              <!-- View Mode Toggle -->
              <div class="flex bg-gray-100 rounded-lg p-1">
                <button @click="viewMode = 'all'" :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  viewMode === 'all'
                    ? 'bg-white text-[#882f1d] shadow'
                    : 'text-gray-600 hover:text-gray-800'
                ]">
                  📋 Semua
                </button>
                <button @click="viewMode = 'grouped'" :class="[
                  'px-4 py-2 rounded-md text-sm font-medium transition-all',
                  viewMode === 'grouped'
                    ? 'bg-white text-[#882f1d] shadow'
                    : 'text-gray-600 hover:text-gray-800'
                ]">
                  🗺️ Per Wilayah
                </button>
              </div>
            </div>
          </div>

          <!-- View: All Lingkungan (Grid) -->
          <div v-if="viewMode === 'all'" class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
            <div v-for="ling in filteredLingkungan" :key="ling.id"
              class="bg-white rounded-xl shadow-md p-5 md:p-6 hover:shadow-xl transition-all duration-300 border-t-4"
              :style="{ borderColor: ling.color }">
              <div class="flex items-start gap-4">
                <div class="w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 shadow-md"
                  :style="{ backgroundColor: ling.color }">
                  <span class="text-white font-bold text-lg">{{ ling.no }}</span>
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-base md:text-lg text-[#882f1d] mb-1">{{ ling.nama }}</h3>
                  <p class="text-sm text-gray-600 mb-3">{{ ling.wilayah }}</p>
                  <div class="text-xs text-gray-500 space-y-1">
                    <p class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                      <strong>Ketua:</strong> {{ ling.ketua }}
                    </p>
                    <p v-if="ling.telp" class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                      </svg>
                      {{ ling.telp }}
                    </p>
                    <p class="flex items-center gap-2">
                      <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <strong>{{ ling.jumlahKK }} KK</strong> (± {{ ling.jumlahKK * 3 }} jiwa)
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- View: Grouped by Wilayah -->
          <div v-if="viewMode === 'grouped'" class="space-y-6">
            <div v-for="(lingkunganList, wilayahName) in groupedByWilayah" :key="wilayahName"
              class="bg-white rounded-2xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-xl transition-all">

              <!-- Wilayah Header -->
              <div class="bg-gradient-to-r from-[#882f1d] to-[#a63b28] px-6 py-5">
                <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <!-- Wilayah Info -->
                  <div class="flex items-center gap-4">
                    <div
                      class="w-14 h-14 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center shadow-lg">
                      <span class="text-3xl">🗺️</span>
                    </div>
                    <div>
                      <h3 class="text-2xl font-bold text-white mb-1">{{ wilayahName }}</h3>
                      <p class="text-white/90 text-sm flex items-center gap-2">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {{ wilayahStats[wilayahName].totalLingkungan }} Lingkungan
                      </p>
                    </div>
                  </div>

                  <!-- Statistics -->
                  <div class="flex gap-3">
                    <div class="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg">
                      <p class="text-white/80 text-xs mb-1">Total KK</p>
                      <p class="text-white text-2xl font-bold">
                        {{ wilayahStats[wilayahName].totalKK }}
                      </p>
                    </div>
                    <div class="bg-white/20 backdrop-blur-sm px-5 py-3 rounded-xl shadow-lg">
                      <p class="text-white/80 text-xs mb-1">Total Jiwa</p>
                      <p class="text-white text-2xl font-bold">
                        {{ wilayahStats[wilayahName].totalJiwa }}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <!-- Lingkungan Cards -->
              <div class="p-6">
                <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
                  <div v-for="ling in lingkunganList" :key="ling.id"
                    class="group bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-5 hover:shadow-lg transition-all duration-300 border-l-4 relative overflow-hidden"
                    :style="{ borderColor: ling.color }">

                    <!-- Background Pattern -->
                    <div class="absolute inset-0 opacity-5 pointer-events-none">
                      <div class="absolute top-0 right-0 w-32 h-32 rounded-full"
                        :style="{ backgroundColor: ling.color }"></div>
                    </div>

                    <div class="relative flex gap-4">
                      <!-- Lingkungan Badge -->
                      <div class="flex-shrink-0">
                        <div
                          class="w-14 h-14 rounded-xl flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform"
                          :style="{ backgroundColor: ling.color }">
                          <span class="text-white font-bold text-xl">{{ ling.no }}</span>
                        </div>
                      </div>

                      <!-- Lingkungan Info -->
                      <div class="flex-1 min-w-0">
                        <h4
                          class="font-bold text-lg text-[#882f1d] mb-2 truncate group-hover:text-[#6b2416] transition-colors">
                          {{ ling.nama }}
                        </h4>

                        <div class="space-y-2 text-sm text-gray-600">
                          <!-- Ketua -->
                          <div class="flex items-start gap-2">
                            <svg class="w-4 h-4 mt-0.5 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            <div class="flex-1 min-w-0">
                              <p class="text-xs text-gray-500">Ketua Lingkungan</p>
                              <p class="font-medium truncate">{{ ling.ketua }}</p>
                            </div>
                          </div>

                          <!-- Telepon -->
                          <div v-if="ling.telp" class="flex items-center gap-2">
                            <svg class="w-4 h-4 flex-shrink-0 text-gray-400" fill="none" stroke="currentColor"
                              viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                            </svg>
                            <a :href="'tel:' + ling.telp" class="hover:text-[#882f1d] transition-colors font-medium">
                              {{ ling.telp }}
                            </a>
                          </div>

                          <!-- KK & Jiwa -->
                          <div class="flex items-center gap-4 pt-2 border-t border-gray-200">
                            <div class="flex items-center gap-2">
                              <svg class="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                              </svg>
                              <span class="font-bold text-gray-700">{{ ling.jumlahKK }}</span>
                              <span class="text-xs text-gray-500">KK</span>
                            </div>
                            <div class="flex items-center gap-2">
                              <svg class="w-4 h-4 text-purple-500" fill="none" stroke="currentColor"
                                viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                              </svg>
                              <span class="font-bold text-gray-700">{{ ling.jumlahKK * 3 }}</span>
                              <span class="text-xs text-gray-500">Jiwa</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Empty State -->
          <div v-if="filteredLingkungan.length === 0" class="text-center py-16">
            <div class="max-w-md mx-auto">
              <div class="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg class="w-12 h-12 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9.172 16.172a4 4 0 015.656 0M9 10h.01M15 10h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 class="text-xl font-bold text-gray-700 mb-2">Tidak Ada Hasil</h3>
              <p class="text-gray-500 mb-6">
                Tidak ada lingkungan yang sesuai dengan pencarian "<strong>{{ searchQuery }}</strong>"
              </p>
              <button @click="searchQuery = ''"
                class="inline-flex items-center gap-2 bg-[#882f1d] text-white px-6 py-2 rounded-lg hover:bg-[#6b2416] transition-colors">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
                Hapus Pencarian
              </button>
            </div>
          </div>

          <!-- Info: Grouped View Notice -->
          <div
            v-if="viewMode === 'grouped' && filteredLingkungan.length > 0 && Object.keys(groupedByWilayah).length > 0"
            class="mt-6 text-center">
            <p class="text-sm text-gray-500">
              💡 <strong>Tip:</strong> Gunakan mode "📋 Semua" untuk melihat semua lingkungan dalam satu tampilan grid
            </p>
          </div>
        </div>

        <!-- Info Kontak -->
        <div
          class="max-w-5xl mx-auto bg-gradient-to-r from-[#882f1d]/5 to-[#882f1d]/10 rounded-xl p-6 md:p-8 text-center">
          <h3 class="text-lg md:text-xl font-bold text-[#882f1d] mb-3">Butuh Informasi Lebih Lanjut?</h3>
          <p class="text-gray-700 mb-4">
            Untuk informasi detail tentang lingkungan Anda atau pendaftaran sebagai anggota paroki,
            silakan hubungi sekretariat paroki.
          </p>
          <NuxtLink to="/contact-us"
            class="inline-flex items-center gap-2 bg-[#882f1d] text-white px-6 py-3 rounded-lg hover:bg-[#6b2416] transition-colors font-medium">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
            </svg>
            Hubungi Kami
          </NuxtLink>
        </div>

        <!-- Back Button -->
        <BackButton position="bottom" />
      </div>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('teritorial-paroki')
import { ref, computed } from '#imports'

// Page meta
definePageMeta({
  title: 'Teritorial Paroki - St. Paulus'
})

// SEO
useHead({
  title: 'Teritorial Paroki - St. Paulus Juanda Sidoarjo',
  meta: [
    {
      name: 'description',
      content: 'Peta wilayah dan daftar 12 lingkungan Paroki St. Paulus Juanda Sidoarjo dengan informasi kontak dan statistik umat.'
    },
    {
      property: 'og:title',
      content: 'Teritorial Paroki - St. Paulus Juanda'
    },
    {
      property: 'og:description',
      content: 'Peta wilayah dan informasi lengkap 12 lingkungan Paroki St. Paulus Juanda Sidoarjo'
    },
    {
      property: 'og:image',
      content: '/images/map-thumbnail.jpg'
    }
  ]
})

// Search functionality
const searchQuery = ref('')

// Fetch lingkungan data from API
const { data: lingkunganData } = await useFetch('/api/lingkungan', {
  default: () => ({ data: [], stats: {} }),
  transform: (data) => data || { data: [], stats: {} }
})

// Extract data and stats
const lingkunganList = ref(lingkunganData.value?.data || [])
const apiStats = lingkunganData.value?.stats || {}

// Map API data to display format
const displayLingkungan = computed(() => {
  return lingkunganList.value.map(ling => ({
    id: ling.id,
    no: ling.no,
    nama: ling.nama,
    wilayah: ling.wilayah_display || ling.wilayah_nama || ling.wilayah_text || '-',
    ketua: ling.ketua || '-',
    telp: ling.no_hp_pengurus || ling.telp,
    jumlahKK: ling.jumlah_kk || 0,
    color: ling.color || '#3B82F6'
  }))
})

// Filtered lingkungan based on search
const filteredLingkungan = computed(() => {
  if (!searchQuery.value) return displayLingkungan.value

  const query = searchQuery.value.toLowerCase()
  return displayLingkungan.value.filter(ling =>
    ling.nama.toLowerCase().includes(query) ||
    ling.wilayah.toLowerCase().includes(query) ||
    ling.ketua.toLowerCase().includes(query) ||
    ling.no.toString().includes(query)
  )
})

// Group lingkungan by wilayah
const groupedByWilayah = computed(() => {
  const groups = {}

  filteredLingkungan.value.forEach(ling => {
    const wilayahName = ling.wilayah || 'Lainnya'
    if (!groups[wilayahName]) {
      groups[wilayahName] = []
    }
    groups[wilayahName].push(ling)
  })

  // Sort each group by lingkungan number
  Object.keys(groups).forEach(key => {
    groups[key].sort((a, b) => a.no - b.no)
  })

  return groups
})

// Wilayah statistics
const wilayahStats = computed(() => {
  const stats = {}
  Object.entries(groupedByWilayah.value).forEach(([wilayahName, lingkunganList]) => {
    stats[wilayahName] = {
      totalLingkungan: lingkunganList.length,
      totalKK: lingkunganList.reduce((sum, l) => sum + l.jumlahKK, 0),
      totalJiwa: lingkunganList.reduce((sum, l) => sum + (l.jumlahKK * 3), 0)
    }
  })
  return stats
})

// View mode toggle
const viewMode = ref('grouped') // Default: 'grouped', bisa diganti 'all'
</script>

<style scoped>
.prose {
  color: #374151;
}

/* Smooth fade transition for search results */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
