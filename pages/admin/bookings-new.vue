<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h1 class="text-2xl font-bold text-gray-800 tracking-wide uppercase">KELOLA PEMESANAN</h1>
      <p class="text-gray-600 mt-1">Manajemen lengkap pemesanan ruangan</p>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-xl shadow-xs border border-gray-100 overflow-hidden">
      <div class="border-b border-gray-200 bg-gray-50/50">
        <nav class="flex -mb-px">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
            'flex-1 flex flex-col items-center justify-center gap-1 px-3 py-3.5 text-xs font-semibold border-b-2 transition-all duration-200 sm:flex-row sm:space-x-2 sm:px-5 sm:py-4 sm:text-sm cursor-pointer select-none',
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600 bg-white shadow-xs'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 hover:bg-gray-100/50'
          ]">
            <span class="text-base sm:text-sm leading-none transition-transform duration-200" :class="activeTab === tab.id ? 'scale-110' : ''">{{ tab.icon }}</span>
            <span class="whitespace-nowrap leading-tight text-center">{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" :class="activeTab === tab.id ? 'bg-blue-100 text-blue-700 font-bold' : 'bg-gray-200 text-gray-700'" class="px-2 py-0.5 rounded-full text-[10px] sm:text-xs transition-colors">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Tab 1: Daftar Pemesanan -->
        <div v-show="activeTab === 'list'" class="tab-pane animate-fade-in">
          <div class="space-y-4">
            <!-- Filter & Actions -->
            <div class="flex flex-wrap gap-4 items-center justify-between">
              <div class="flex gap-2 flex-wrap items-center">
                <select v-model="filterStatus" @change="loadBookings"
                  class="border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-blue-500">
                  <option value="">Semua Status</option>
                  <option value="PENDING">Pending</option>
                  <option value="APPROVED">Approved</option>
                  <option value="REJECTED">Rejected</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>

                <!-- Date range toggle -->
                <button @click="toggleCustomRange"
                  :class="useCustomRange ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'"
                  class="px-3 py-2 rounded-lg text-sm font-medium hover:opacity-90 transition">
                  📅 {{ useCustomRange ? 'Rentang Kustom Aktif' : 'Perluas Rentang Tanggal' }}
                </button>

                <template v-if="useCustomRange">
                  <div class="flex items-center gap-1 text-sm">
                    <label class="text-gray-600">Dari:</label>
                    <input v-model="customStartDate" type="date"
                      class="border border-gray-300 p-1.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      @change="loadBookings" />
                  </div>
                  <div class="flex items-center gap-1 text-sm">
                    <label class="text-gray-600">Sampai:</label>
                    <input v-model="customEndDate" type="date"
                      class="border border-gray-300 p-1.5 rounded-lg text-sm focus:ring-2 focus:ring-blue-500"
                      @change="loadBookings" />
                  </div>
                </template>

                <button @click="loadBookings" class="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                  🔄 Refresh
                </button>

                <!-- Sort Dropdown (desktop + mobile) -->
                <div class="flex items-center gap-1.5">
                  <label class="text-xs font-medium text-gray-600 whitespace-nowrap">Urutkan:</label>
                  <select v-model="sortBy" @change="bookingPage = 1"
                    class="border border-gray-300 p-2 rounded-lg text-sm focus:ring-2 focus:ring-blue-500">
                    <option value="start_time">Tanggal Acara</option>
                    <option value="created_at">Tanggal Daftar</option>
                    <option value="event_name">Judul Acara (A-Z)</option>
                    <option value="room_name">Ruangan (A-Z)</option>
                    <option value="status">Status</option>
                  </select>
                  <button @click="sortDir = sortDir === 'asc' ? 'desc' : 'asc'; bookingPage = 1"
                    :title="sortDir === 'asc' ? 'Urutan: Terlama → Terbaru (klik untuk balik)' : 'Urutan: Terbaru → Terlama (klik untuk balik)'"
                    class="p-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition text-base leading-none"
                    :class="sortDir === 'asc' ? 'text-blue-600' : 'text-orange-600'">
                    {{ sortDir === 'asc' ? '⬆️' : '⬇️' }}
                  </button>
                </div>
              </div>
              <button @click="exportToExcel"
                class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center gap-2">
                📊 Export Excel
              </button>
            </div>

            <!-- Info Box: Date Range -->
            <div :class="useCustomRange ? 'bg-yellow-50 border-yellow-300' : 'bg-blue-50 border-blue-200'"
              class="border rounded-lg p-4">
              <div class="flex items-start gap-3">
                <div class="text-2xl">📅</div>
                <div class="flex-1">
                  <p :class="useCustomRange ? 'text-yellow-900' : 'text-blue-900'"
                    class="text-sm font-semibold mb-1">Rentang Tanggal Pemesanan</p>
                  <p v-if="!useCustomRange" class="text-xs text-blue-700 leading-relaxed">
                    Menampilkan pemesanan dari <strong>30 hari yang lalu</strong> sampai <strong>365 hari ke
                      depan</strong> (termasuk yang sudah selesai).
                    Pemesanan di luar rentang ini tidak akan muncul. Total: <strong>{{ bookings.length }}
                      pemesanan</strong>.
                    <span class="ml-1 text-blue-600 underline cursor-pointer" @click="toggleCustomRange">
                      Perluas untuk rentang kustom →
                    </span>
                  </p>
                  <p v-else class="text-xs text-yellow-800 leading-relaxed">
                    Rentang kustom aktif: <strong>{{ customStartDate || '(tidak dibatasi)' }}</strong> s.d.
                    <strong>{{ customEndDate || '(tidak dibatasi)' }}</strong>.
                    Total: <strong>{{ bookings.length }} pemesanan</strong>.
                    ⚠️ Pastikan booking di luar rentang default sudah dicek sebelum approve.
                  </p>
                </div>
              </div>
            </div>

            <!-- Bookings List Loading Skeleton -->
            <div v-if="loading" class="space-y-4">
              <!-- Desktop Table Skeleton -->
              <div class="hidden md:block bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs animate-pulse">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase">Judul Acara</th>
                      <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase">Ruangan</th>
                      <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase">Pemesan & Unit</th>
                      <th class="px-6 py-3.5 text-left text-xs font-bold text-gray-400 uppercase">Tanggal & Waktu</th>
                      <th class="px-6 py-3.5 text-center text-xs font-bold text-gray-400 uppercase">Status</th>
                      <th class="px-6 py-3.5 text-center text-xs font-bold text-gray-400 uppercase">Aksi</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-200 bg-white">
                    <tr v-for="i in 5" :key="i">
                      <td class="px-6 py-4">
                        <div class="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div class="h-3 bg-gray-100 rounded w-1/2"></div>
                      </td>
                      <td class="px-6 py-4"><div class="h-4 bg-gray-200 rounded w-24"></div></td>
                      <td class="px-6 py-4">
                        <div class="h-4 bg-gray-200 rounded w-28 mb-1"></div>
                        <div class="h-3 bg-gray-100 rounded w-20"></div>
                      </td>
                      <td class="px-6 py-4">
                        <div class="h-4 bg-gray-200 rounded w-24 mb-1"></div>
                        <div class="h-3 bg-gray-100 rounded w-16"></div>
                      </td>
                      <td class="px-6 py-4 text-center"><div class="h-6 bg-gray-200 rounded-full w-20 mx-auto"></div></td>
                      <td class="px-6 py-4 text-center"><div class="h-8 bg-gray-100 rounded-lg w-24 mx-auto"></div></td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- Mobile Cards Skeleton -->
              <div class="md:hidden space-y-3 animate-pulse">
                <div v-for="i in 3" :key="i" class="bg-white border border-gray-200 rounded-xl p-4 space-y-3 shadow-xs">
                  <div class="flex justify-between items-center">
                    <div class="h-4 bg-gray-200 rounded w-1/3"></div>
                    <div class="h-6 bg-gray-200 rounded-full w-20"></div>
                  </div>
                  <div class="h-5 bg-gray-200 rounded w-3/4"></div>
                  <div class="space-y-2 pt-2 border-t border-gray-100">
                    <div class="h-3.5 bg-gray-200 rounded w-1/2"></div>
                    <div class="h-3.5 bg-gray-200 rounded w-2/3"></div>
                  </div>
                  <div class="h-10 bg-gray-100 rounded-lg w-full"></div>
                </div>
              </div>
            </div>
            <div v-else-if="bookings.length === 0" class="text-center py-12 text-gray-500 bg-gray-50/50 rounded-lg border border-dashed border-gray-200">
              <span class="text-3xl block mb-2">📋</span>
              <p class="font-medium text-gray-700">Belum ada pemesanan.</p>
              <p class="text-xs text-gray-400 mt-1">Gunakan filter status atau perluas rentang tanggal untuk melihat data lainnya.</p>
            </div>
            <div v-else class="space-y-4">
              <!-- Desktop View (Tabel) -->
              <div class="hidden md:block">
                <div class="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2.5">
                  <span>🖥️ TAMPILAN DESKTOP (TABEL)</span>
                </div>

                <div class="bg-white border border-gray-200 rounded-lg overflow-hidden shadow-xs">
                  <div class="overflow-x-auto">
                    <table class="min-w-full divide-y divide-gray-200">
                      <thead class="bg-gray-50">
                        <tr>
                          <!-- Judul Acara -->
                          <th scope="col"
                            class="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <button @click="toggleSort('event_name')"
                              class="flex items-center gap-1 group hover:text-blue-600 transition-colors">
                              Judul Acara
                              <span class="text-[11px] leading-none opacity-60 group-hover:opacity-100">{{ sortIcon('event_name') }}</span>
                            </button>
                          </th>

                          <!-- Ruangan -->
                          <th scope="col"
                            class="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <button @click="toggleSort('room_name')"
                              class="flex items-center gap-1 group hover:text-blue-600 transition-colors">
                              Ruangan
                              <span class="text-[11px] leading-none opacity-60 group-hover:opacity-100">{{ sortIcon('room_name') }}</span>
                            </button>
                          </th>

                          <!-- Pemesan -->
                          <th scope="col"
                            class="px-6 py-3.5 text-left text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Pemesan &amp; Unit
                          </th>

                          <!-- Tanggal & Waktu — sortable (primary sort column) -->
                          <th scope="col"
                            class="px-6 py-3.5 text-left text-xs font-bold uppercase tracking-wider cursor-pointer select-none transition-colors"
                            :class="sortBy === 'start_time' ? 'text-blue-600 bg-blue-50' : 'text-gray-600 hover:text-blue-600 hover:bg-gray-100'">
                            <button @click="toggleSort('start_time')" class="flex items-center gap-1.5 w-full">
                              <span>📅 Tanggal &amp; Waktu</span>
                              <span class="text-sm leading-none">
                                <span v-if="sortBy === 'start_time' && sortDir === 'asc'">⬆️</span>
                                <span v-else-if="sortBy === 'start_time' && sortDir === 'desc'">⬇️</span>
                                <span v-else class="opacity-40">↕️</span>
                              </span>
                            </button>
                          </th>

                          <!-- Status -->
                          <th scope="col"
                            class="px-6 py-3.5 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                            <button @click="toggleSort('status')"
                              class="flex items-center justify-center gap-1 w-full group hover:text-blue-600 transition-colors">
                              Status
                              <span class="text-[11px] leading-none opacity-60 group-hover:opacity-100">{{ sortIcon('status') }}</span>
                            </button>
                          </th>

                          <!-- Aksi -->
                          <th scope="col"
                            class="px-6 py-3.5 text-center text-xs font-bold text-gray-600 uppercase tracking-wider">
                            Aksi
                          </th>
                        </tr>
                      </thead>
                      <tbody class="bg-white divide-y divide-gray-200">
                        <tr v-for="booking in paginatedBookings" :key="booking.id" class="hover:bg-gray-50/80 transition-colors">
                          <!-- Judul Acara -->
                          <td class="px-6 py-4 text-sm">
                            <div class="font-bold text-gray-900 leading-snug">{{ booking.event_name }}</div>
                            <div v-if="booking.recurrence_pattern || booking.parent_booking_id" class="text-xs text-purple-700 font-semibold mt-1 flex items-center gap-1">
                              <span>🔄 Rutin: {{ getRecurrenceLabel(booking.recurrence_pattern) }}</span>
                              <span class="bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded text-[10px]">{{ booking.parent_booking_id ? 'Jadwal Seri' : 'Jadwal Utama' }}</span>
                            </div>
                            <div v-if="booking.rejection_reason" class="text-xs text-red-600 mt-1 bg-red-50 p-1.5 rounded border border-red-100">
                              ❌ <strong>Alasan Penolakan:</strong> {{ booking.rejection_reason }}
                            </div>
                            <div v-if="booking.cancellation_reason" class="text-xs text-orange-600 mt-1 bg-orange-50 p-1.5 rounded border border-orange-100">
                              🚫 <strong>Alasan Pembatalan:</strong> {{ booking.cancellation_reason }}
                            </div>
                          </td>

                          <!-- Ruangan -->
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-800 font-medium">
                            <div class="flex items-center gap-1.5">
                              <span class="text-base">🏢</span>
                              <span class="font-semibold text-gray-900">{{ booking.room_name }}</span>
                            </div>
                          </td>

                          <!-- Pemesan & Unit -->
                          <td class="px-6 py-4 text-sm text-gray-700">
                            <div class="font-semibold text-gray-900 flex items-center gap-1.5">
                              <span>👤</span>
                              <span>{{ booking.user_name }}</span>
                              <span class="text-xs text-gray-500 font-normal">({{ booking.user_category || '-' }})</span>
                            </div>
                            <div class="text-xs text-gray-600 mt-1 flex items-center gap-1">
                              <span>🏛️</span>
                              <span>{{ booking.unit_name || '-' }}</span>
                            </div>
                          </td>

                          <!-- Tanggal & Waktu -->
                          <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-700">
                            <div class="font-semibold text-gray-900 flex items-center gap-1.5">
                              <span>📅</span>
                              <span>{{ formatBookingDate(booking.start_time) }}</span>
                            </div>
                            <div class="text-xs text-gray-600 mt-1 flex items-center gap-1.5">
                              <span>⏰</span>
                              <span>{{ formatBookingTime(booking.start_time, booking.end_time) }}</span>
                            </div>
                          </td>

                          <!-- Status -->
                          <td class="px-6 py-4 whitespace-nowrap text-center">
                            <span :class="getStatusBadgeClass(booking.status)" class="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider inline-flex items-center gap-1 shadow-xs">
                              <span v-if="booking.status === 'PENDING'">⏳</span>
                              <span v-else-if="booking.status === 'APPROVED'">✅</span>
                              <span v-else-if="booking.status === 'REJECTED'">❌</span>
                              <span v-else-if="booking.status === 'CANCELLED'">🚫</span>
                              {{ booking.status }}
                            </span>
                          </td>

                          <!-- Aksi (Tombol Ikon Kecil Ringkas) -->
                          <td class="px-6 py-4 whitespace-nowrap text-center">
                            <div class="inline-flex items-center justify-center gap-1.5">
                              <!-- Biru: Waktu / History -->
                              <button @click="viewHistory(booking)" title="Atur Ulang Waktu / Lihat History"
                                class="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors shadow-xs focus:ring-2 focus:ring-blue-500 focus:outline-none">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </button>

                              <!-- Hijau: Check (Setujui - Only PENDING) -->
                              <button v-if="booking.status === 'PENDING'" @click="approveBooking(booking)" title="Setujui"
                                class="p-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors shadow-xs focus:ring-2 focus:ring-green-500 focus:outline-none">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                                </svg>
                              </button>

                              <!-- Merah: Silang (Tolak - Only PENDING) -->
                              <button v-if="booking.status === 'PENDING'" @click="rejectBooking(booking)" title="Tolak"
                                class="p-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors shadow-xs focus:ring-2 focus:ring-red-500 focus:outline-none">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                              </button>

                              <!-- Orange: Batalkan (Only APPROVED) -->
                              <button v-if="booking.status === 'APPROVED'" @click="cancelBooking(booking)" title="Batalkan"
                                class="p-2 bg-orange-600 hover:bg-orange-700 text-white rounded-lg transition-colors shadow-xs focus:ring-2 focus:ring-orange-500 focus:outline-none">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                              </button>

                              <!-- Abu-abu: Tong Sampah (Hapus) -->
                              <button @click="confirmDeleteBooking(booking)" title="Hapus"
                                class="p-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors shadow-xs focus:ring-2 focus:ring-gray-500 focus:outline-none">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                              </button>
                            </div>
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>

              <!-- Mobile View (Card) -->
              <div class="space-y-4 md:hidden">
                <div class="flex items-center gap-1.5 text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                  <span>📱 TAMPILAN PONSEL (CARD)</span>
                </div>

                <div v-for="booking in paginatedBookings" :key="booking.id"
                  class="bg-white border border-gray-200 rounded-xl p-5 shadow-sm space-y-4">
                  
                  <!-- Card Header: Title + Big Prominent Status Badge -->
                  <div class="flex items-start justify-between gap-3 border-b border-gray-100 pb-3">
                    <div class="flex-1 min-w-0">
                      <h3 class="font-bold text-lg text-gray-900 leading-snug break-words">{{ booking.event_name }}</h3>
                      <p v-if="booking.recurrence_pattern || booking.parent_booking_id" class="text-xs text-purple-700 font-semibold mt-1 flex items-center gap-1">
                        🔄 Rutin: {{ getRecurrenceLabel(booking.recurrence_pattern) }}
                        <span class="bg-purple-100 text-purple-800 px-1.5 py-0.2 rounded text-[10px]">{{ booking.parent_booking_id ? 'Jadwal Seri' : 'Jadwal Utama' }}</span>
                      </p>
                    </div>
                    <!-- Big Prominent Status Badge on Top -->
                    <span :class="getStatusBadgeClass(booking.status)" class="px-3.5 py-1.5 text-xs font-bold rounded-full uppercase tracking-wider shadow-xs flex-shrink-0">
                      {{ booking.status }}
                    </span>
                  </div>

                  <!-- Card Details with Icons -->
                  <div class="space-y-2.5 text-sm text-gray-700">
                    <div class="flex items-start gap-2.5">
                      <span class="text-base flex-shrink-0 mt-0.5">🏢</span>
                      <div>
                        <span class="text-xs text-gray-400 block uppercase font-semibold">Ruangan</span>
                        <span class="font-semibold text-gray-900">{{ booking.room_name }}</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5">
                      <span class="text-base flex-shrink-0 mt-0.5">👤</span>
                      <div>
                        <span class="text-xs text-gray-400 block uppercase font-semibold">Pemesan</span>
                        <span class="font-semibold text-gray-900">{{ booking.user_name }}</span>
                        <span class="text-xs text-gray-500 ml-1 font-normal">({{ booking.user_category || '-' }})</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5">
                      <span class="text-base flex-shrink-0 mt-0.5">🏛️</span>
                      <div>
                        <span class="text-xs text-gray-400 block uppercase font-semibold">Unit</span>
                        <span class="font-semibold text-gray-900">{{ booking.unit_name || '-' }}</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5">
                      <span class="text-base flex-shrink-0 mt-0.5">📅</span>
                      <div>
                        <span class="text-xs text-gray-400 block uppercase font-semibold">Tanggal</span>
                        <span class="font-semibold text-gray-900">{{ formatBookingDate(booking.start_time) }}</span>
                      </div>
                    </div>

                    <div class="flex items-start gap-2.5">
                      <span class="text-base flex-shrink-0 mt-0.5">⏰</span>
                      <div>
                        <span class="text-xs text-gray-400 block uppercase font-semibold">Waktu</span>
                        <span class="font-semibold text-gray-900">{{ formatBookingTime(booking.start_time, booking.end_time) }}</span>
                      </div>
                    </div>

                    <div v-if="booking.rejection_reason" class="p-3 bg-red-50 rounded-lg border border-red-200 text-xs text-red-700 leading-relaxed">
                      <strong>❌ Alasan Penolakan:</strong> {{ booking.rejection_reason }}
                    </div>

                    <div v-if="booking.cancellation_reason" class="p-3 bg-orange-50 rounded-lg border border-orange-200 text-xs text-orange-700 leading-relaxed">
                      <strong>🚫 Alasan Pembatalan:</strong> {{ booking.cancellation_reason }}
                    </div>
                  </div>

                  <!-- Mobile Action Buttons: 4 Big Full-Color Action Buttons Stacked Vertically -->
                  <div class="pt-3 border-t border-gray-100 space-y-2.5">
                    <!-- Biru: Atur Ulang Waktu -->
                    <button @click="viewHistory(booking)"
                      class="w-full py-2.5 px-4 bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-sm shadow-sm transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>Atur Ulang Waktu</span>
                    </button>

                    <!-- Hijau: Setujui (Only for PENDING) -->
                    <button v-if="booking.status === 'PENDING'" @click="approveBooking(booking)"
                      class="w-full py-2.5 px-4 bg-green-600 hover:bg-green-700 active:bg-green-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-sm shadow-sm transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                      </svg>
                      <span>Setujui</span>
                    </button>

                    <!-- Merah: Tolak (Only for PENDING) -->
                    <button v-if="booking.status === 'PENDING'" @click="rejectBooking(booking)"
                      class="w-full py-2.5 px-4 bg-red-600 hover:bg-red-700 active:bg-red-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-sm shadow-sm transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                      <span>Tolak</span>
                    </button>

                    <!-- Orange: Batalkan (Only for APPROVED) -->
                    <button v-if="booking.status === 'APPROVED'" @click="cancelBooking(booking)"
                      class="w-full py-2.5 px-4 bg-orange-600 hover:bg-orange-700 active:bg-orange-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-sm shadow-sm transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                      </svg>
                      <span>Batalkan Pemesanan</span>
                    </button>

                    <!-- Abu-abu: Hapus -->
                    <button @click="confirmDeleteBooking(booking)"
                      class="w-full py-2.5 px-4 bg-gray-600 hover:bg-gray-700 active:bg-gray-800 text-white font-bold rounded-lg flex items-center justify-center gap-2 text-sm shadow-sm transition-colors">
                      <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      <span>Hapus</span>
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="bookingTotalPages > 1" class="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-4">
                <p class="text-sm text-gray-600">Halaman {{ bookingPage }} dari {{ bookingTotalPages }}</p>
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <button @click="goToBookingPage(bookingPage - 1)" :disabled="bookingPage === 1"
                    class="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                    Sebelumnya
                  </button>
                  <button v-for="page in bookingVisiblePages" :key="page" @click="goToBookingPage(page)"
                    class="rounded border px-3 py-1 text-sm"
                    :class="page === bookingPage ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-gray-50'">
                    {{ page }}
                  </button>
                  <button @click="goToBookingPage(bookingPage + 1)" :disabled="bookingPage === bookingTotalPages"
                    class="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                    Berikutnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 2: Audit Log -->
        <div v-show="activeTab === 'audit'" class="tab-pane animate-fade-in">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">Log Aktivitas Sistem</h2>
              <button @click="loadAuditLogs" class="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                🔄 Refresh
              </button>
            </div>

            <div v-if="auditLogs.length === 0" class="text-center py-8 text-gray-500">
              Belum ada log aktivitas.
            </div>
            <div v-else>
              <!-- Mobile Card Layout -->
              <div class="space-y-3 md:hidden">
                <div v-for="log in paginatedAuditLogs" :key="log.id"
                  class="bg-white border border-gray-100 rounded-lg p-4 shadow-sm">
                  <!-- Badge + Waktu -->
                  <div class="flex items-center justify-between mb-2">
                    <span :class="getActionBadgeClass(log.action)" class="px-2 py-1 text-xs rounded-full font-medium">
                      {{ log.action }}
                    </span>
                    <span class="text-xs text-gray-400">{{ formatDateTime(log.created_at) }}</span>
                  </div>
                  <!-- User -->
                  <p class="text-sm font-semibold text-gray-800 mb-1">
                    👤 {{ log.user_name || 'System' }}
                  </p>
                  <!-- Description -->
                  <p class="text-sm text-gray-600 mb-2 leading-relaxed break-all">
                    {{ log.description }}
                  </p>
                  <!-- IP Address -->
                  <p class="text-xs text-gray-400">
                    🌐 IP: {{ log.ip_address || '-' }}
                  </p>
                </div>
              </div>

              <!-- Desktop Table Layout -->
              <div class="hidden md:block overflow-x-auto">
                <table class="min-w-full divide-y divide-gray-200">
                  <thead class="bg-gray-50">
                    <tr>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Waktu</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Aksi</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Detail</th>
                      <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">IP Address</th>
                    </tr>
                  </thead>
                  <tbody class="bg-white divide-y divide-gray-200">
                    <tr v-for="log in paginatedAuditLogs" :key="log.id" class="hover:bg-gray-50">
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ formatDateTime(log.created_at) }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{{ log.user_name || 'System' }}</td>
                      <td class="px-6 py-4 whitespace-nowrap">
                        <span :class="getActionBadgeClass(log.action)" class="px-2 py-1 text-xs rounded-full">
                          {{ log.action }}
                        </span>
                      </td>
                      <td class="px-6 py-4 text-sm text-gray-600 max-w-md truncate">{{ log.description }}</td>
                      <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{{ log.ip_address || '-' }}</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            <div v-if="auditTotalPages > 1" class="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-4">
              <p class="text-sm text-gray-600">Halaman {{ auditPage }} dari {{ auditTotalPages }}</p>
              <div class="flex flex-wrap items-center justify-center gap-2">
                <button @click="goToAuditPage(auditPage - 1)" :disabled="auditPage === 1"
                  class="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                  Sebelumnya
                </button>
                <button v-for="page in auditVisiblePages" :key="page" @click="goToAuditPage(page)"
                  class="rounded border px-3 py-1 text-sm"
                  :class="page === auditPage ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-gray-50'">
                  {{ page }}
                </button>
                <button @click="goToAuditPage(auditPage + 1)" :disabled="auditPage === auditTotalPages"
                  class="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                  Berikutnya
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 3: Deleted Bookings -->
        <div v-show="activeTab === 'deleted'" class="tab-pane animate-fade-in">
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <h2 class="text-lg font-semibold">Pemesanan yang Dihapus</h2>
              <button @click="loadDeletedBookings" class="bg-gray-100 px-4 py-2 rounded-lg hover:bg-gray-200">
                🔄 Refresh
              </button>
            </div>

            <div v-if="deletedBookings.length === 0" class="text-center py-8 text-gray-500">
              Tidak ada pemesanan yang dihapus.
            </div>
            <div v-else class="space-y-4">
              <div v-for="booking in paginatedDeletedBookings" :key="booking.id"
                class="border border-red-200 bg-red-50 p-4 rounded-lg">
                <div class="flex justify-between items-start">
                  <div class="flex-1">
                    <h3 class="font-semibold text-lg text-gray-800">{{ booking.event_name }}</h3>
                    <div class="mt-2 space-y-1 text-sm text-gray-600">
                      <p>🏢 Ruangan: {{ booking.room_name }}</p>
                      <p>👤 Pemesan: {{ booking.user_name }}</p>
                      <p>📅 Tanggal: {{ formatBookingDate(booking.start_time) }}</p>
                      <p class="text-red-600">🗑️ Dihapus oleh: {{ booking.deleter_name }} pada {{
                        formatDateTime(booking.deleted_at) }}</p>
                    </div>
                  </div>
                  <div class="ml-4 space-y-2 flex flex-col">
                    <button @click="restoreBooking(booking)"
                      class="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 text-sm">
                      ♻️ Restore
                    </button>
                    <button @click="permanentDeleteBooking(booking)"
                      class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 text-sm">
                      🗑️ Hapus Permanen
                    </button>
                  </div>
                </div>
              </div>
              <div v-if="deletedTotalPages > 1" class="flex flex-col md:flex-row items-center justify-between gap-4 border-t pt-4">
                <p class="text-sm text-gray-600">Halaman {{ deletedPage }} dari {{ deletedTotalPages }}</p>
                <div class="flex flex-wrap items-center justify-center gap-2">
                  <button @click="goToDeletedPage(deletedPage - 1)" :disabled="deletedPage === 1"
                    class="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                    Sebelumnya
                  </button>
                  <button v-for="page in deletedVisiblePages" :key="page" @click="goToDeletedPage(page)"
                    class="rounded border px-3 py-1 text-sm"
                    :class="page === deletedPage ? 'border-blue-600 bg-blue-600 text-white' : 'hover:bg-gray-50'">
                    {{ page }}
                  </button>
                  <button @click="goToDeletedPage(deletedPage + 1)" :disabled="deletedPage === deletedTotalPages"
                    class="rounded border px-3 py-1 text-sm disabled:cursor-not-allowed disabled:opacity-50 hover:bg-gray-50">
                    Berikutnya
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Tab 4: Statistik -->
        <div v-show="activeTab === 'stats'" class="tab-pane animate-fade-in">
          <div class="space-y-6">
            <h2 class="text-lg font-semibold">Statistik Pemesanan</h2>

            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div class="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <div class="text-3xl font-bold text-blue-600">{{ stats.pending }}</div>
                <div class="text-sm text-gray-600 mt-1">Pending</div>
              </div>
              <div class="bg-green-50 p-6 rounded-lg border border-green-200">
                <div class="text-3xl font-bold text-green-600">{{ stats.approved }}</div>
                <div class="text-sm text-gray-600 mt-1">Approved</div>
              </div>
              <div class="bg-red-50 p-6 rounded-lg border border-red-200">
                <div class="text-3xl font-bold text-red-600">{{ stats.rejected }}</div>
                <div class="text-sm text-gray-600 mt-1">Rejected</div>
              </div>
              <div class="bg-orange-50 p-6 rounded-lg border border-orange-200">
                <div class="text-3xl font-bold text-orange-600">{{ stats.cancelled }}</div>
                <div class="text-sm text-gray-600 mt-1">Cancelled</div>
              </div>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
              <div class="bg-purple-50 p-6 rounded-lg border border-purple-200">
                <div class="text-3xl font-bold text-purple-600">{{ stats.total }}</div>
                <div class="text-sm text-gray-600 mt-1">Total Pemesanan</div>
              </div>
              <div class="bg-gray-50 p-6 rounded-lg border border-gray-200">
                <div class="text-3xl font-bold text-gray-600">{{ stats.deleted }}</div>
                <div class="text-sm text-gray-600 mt-1">Dihapus (Soft Delete)</div>
              </div>
            </div>

            <button @click="loadStats" class="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 w-full">
              🔄 Refresh Statistik
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- History Modal -->
    <Transition name="modal">
      <div v-if="showHistoryModal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto" @click="showHistoryModal = false">
        <div class="modal-content-box bg-white p-6 rounded-2xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto border border-gray-100 my-auto" @click.stop>
          <div class="flex justify-between items-center mb-4 pb-3 border-b border-gray-100">
            <h3 class="text-lg font-bold text-gray-900 flex items-center gap-2">📜 History Pemesanan</h3>
            <button @click="showHistoryModal = false" class="text-gray-400 hover:text-gray-700 hover:bg-gray-100 p-1.5 rounded-lg transition-colors">✕</button>
          </div>

          <div v-if="selectedBooking" class="mb-4 p-4 bg-gray-50 border border-gray-100 rounded-xl">
            <h4 class="font-bold text-gray-900">{{ selectedBooking.event_name }}</h4>
            <p class="text-sm text-gray-600 mt-0.5">{{ selectedBooking.room_name }}</p>
          </div>

          <div v-if="bookingHistory.length === 0" class="text-center py-8 text-gray-500">
            Belum ada history untuk pemesanan ini.
          </div>
          <div v-else class="space-y-4">
            <div v-for="(history, index) in bookingHistory" :key="history.id" class="relative pl-8 pb-4">
              <!-- Timeline Line -->
              <div v-if="index !== bookingHistory.length - 1" class="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-200">
              </div>

              <!-- Timeline Dot -->
              <div class="absolute left-0 top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-xs"></div>

              <!-- History Content -->
              <div class="bg-white border border-gray-200 rounded-xl p-4 shadow-2xs">
                <div class="flex justify-between items-start mb-2">
                  <span :class="getStatusClass(history.new_status)" class="text-xs font-bold px-2.5 py-1 rounded-full">
                    {{ history.old_status }} → {{ history.new_status }}
                  </span>
                  <span class="text-xs text-gray-400">{{ formatDateTime(history.changed_at) }}</span>
                </div>
                <p class="text-sm text-gray-600">Oleh: <strong class="text-gray-800">{{ history.changed_by_name }}</strong></p>
                <p v-if="history.change_reason" class="text-sm text-gray-700 mt-2 bg-gray-50 p-2.5 rounded-lg border border-gray-100">
                  {{ history.change_reason }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Reject Modal -->
    <Transition name="modal">
      <div v-if="showRejectModal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto" @click="showRejectModal = false">
        <div class="modal-content-box bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 my-auto" @click.stop>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Tolak Pemesanan</h3>
          </div>
          <p class="text-sm text-gray-600 mb-3">Mohon masukkan alasan penolakan pemesanan ini:</p>
          <textarea v-model="rejectionReason"
            class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-red-500 focus:border-transparent outline-hidden text-sm" rows="3"
            placeholder="Tulis alasan penolakan..."
            required></textarea>
          <div class="flex justify-end space-x-2 mt-4">
            <button @click="showRejectModal = false"
              class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
            <button @click="confirmReject"
              class="bg-red-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-700 active:scale-95 transition-all">Tolak Pemesanan</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Cancel Modal -->
    <Transition name="modal">
      <div v-if="showCancelModal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto" @click="showCancelModal = false">
        <div class="modal-content-box bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 my-auto" @click.stop>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-amber-100 flex items-center justify-center shrink-0 text-amber-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Batalkan Pemesanan</h3>
          </div>
          <p class="mb-2 text-sm text-gray-700">Pemesanan yang sudah disetujui akan diubah statusnya menjadi dibatalkan.</p>
          <p class="mb-2 text-xs font-bold text-gray-600 uppercase">Alasan pembatalan (opsional):</p>
          <textarea v-model="cancellationReason"
            class="w-full border border-gray-300 p-3 rounded-xl focus:ring-2 focus:ring-amber-500 focus:border-transparent outline-hidden text-sm" rows="3"
            placeholder="Masukkan alasan pembatalan..."></textarea>
          <div class="flex justify-end space-x-2 mt-4">
            <button @click="showCancelModal = false"
              class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">Batal</button>
            <button @click="confirmCancel"
              class="bg-amber-600 text-white text-sm font-semibold px-4 py-2 rounded-xl hover:bg-amber-700 active:scale-95 transition-all">Batalkan Pemesanan</button>
          </div>
        </div>
      </div>
    </Transition>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" :class="[
        'fixed bottom-4 right-4 px-6 py-4 rounded-xl shadow-xl text-white z-50 flex items-center gap-3 backdrop-blur-xs',
        toast.type === 'success' ? 'bg-green-600/95' : toast.type === 'error' ? 'bg-red-600/95' : 'bg-blue-600/95'
      ]">
        <span class="text-2xl">{{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}</span>
        <span class="font-medium text-sm">{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <Transition name="modal">
      <div v-if="showDeleteModal" class="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 overflow-y-auto" @click="showDeleteModal = false">
        <div class="modal-content-box bg-white p-6 rounded-2xl shadow-2xl max-w-md w-full border border-gray-100 my-auto" @click.stop>
          <div class="flex items-center gap-3 mb-3">
            <div class="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center shrink-0 text-red-600">
              <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
            </div>
            <h3 class="text-lg font-bold text-gray-900">Konfirmasi Hapus Pemesanan</h3>
          </div>
          <div class="mb-4">
            <p class="text-gray-600 text-sm mb-3">Apakah Anda yakin ingin menghapus pemesanan ini?</p>
            <div class="bg-gray-50 p-3.5 rounded-xl border border-gray-200">
              <p class="text-sm font-bold text-gray-900">{{ selectedBooking?.event_name }}</p>
              <p class="text-xs text-gray-600 mt-0.5">{{ selectedBooking?.room_name }}</p>
              <p class="text-xs text-gray-500 mt-0.5">Pemohon: {{ selectedBooking?.user_name }}</p>
            </div>
            <p class="text-red-600 text-xs mt-2.5 font-medium flex items-center gap-1.5">
              <span>⚠️</span>
              <span>Pemesanan akan masuk ke "Soft Delete" dan dapat dipulihkan.</span>
            </p>
          </div>
          <div class="flex justify-end space-x-2">
            <button @click="showDeleteModal = false"
              class="px-4 py-2 text-sm font-semibold bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors">Batal</button>
            <button @click="deleteBooking" class="px-4 py-2 text-sm font-semibold bg-red-600 text-white rounded-xl hover:bg-red-700 active:scale-95 transition-all">Hapus
              Pemesanan</button>
          </div>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
definePageMeta({
  layout: 'admin',
  middleware: 'auth'
})
const {
  toUtcDate,
  formatWibDate,
  formatWibTime,
  formatWibTimeRange,
  formatWibDateTime
} = useDatetime()

// State
const activeTab = ref('list')
const bookings = useState('admin-bookings', () => [])
const auditLogs = useState('admin-bookings-audit-logs', () => [])
const deletedBookings = useState('admin-deleted-bookings', () => [])
const bookingHistory = ref([])
const filterStatus = ref('PENDING')
const loading = ref(false)
const bookingPage = useState('admin-bookings-page', () => 1)
const auditPage = useState('admin-bookings-audit-page', () => 1)
const deletedPage = useState('admin-bookings-deleted-page', () => 1)
const pageLimit = 10

// Custom date range state (Fix #4: allow admin to view bookings outside the default window)
const useCustomRange = ref(false)
const customStartDate = ref('')
const customEndDate = ref('')

// Sort state — default: tanggal acara terdekat dulu (asc)
const sortBy  = ref('start_time')  // 'start_time' | 'event_name' | 'room_name' | 'status' | 'created_at'
const sortDir = ref('asc')          // 'asc' | 'desc'

const toggleSort = (column) => {
  if (sortBy.value === column) {
    sortDir.value = sortDir.value === 'asc' ? 'desc' : 'asc'
  } else {
    sortBy.value  = column
    sortDir.value = column === 'start_time' ? 'asc' : 'asc'
  }
  bookingPage.value = 1  // reset ke halaman 1 setelah sort berubah
}

const sortIcon = (column) => {
  if (sortBy.value !== column) return '↕️'
  return sortDir.value === 'asc' ? '⬆️' : '⬇️'
}

const toggleCustomRange = () => {
  useCustomRange.value = !useCustomRange.value
  if (!useCustomRange.value) {
    customStartDate.value = ''
    customEndDate.value = ''
  } else {
    // Default custom range: last 12 months to next 12 months
    const now = new Date()
    const past = new Date(now); past.setMonth(past.getMonth() - 12)
    const future = new Date(now); future.setMonth(future.getMonth() + 12)
    customStartDate.value = past.toISOString().split('T')[0]
    customEndDate.value   = future.toISOString().split('T')[0]
  }
  loadBookings()
}

// Modals
const showRejectModal = ref(false)
const showCancelModal = ref(false)
const showDeleteModal = ref(false)
const showHistoryModal = ref(false)

// Form Data
const rejectionReason = ref('')
const cancellationReason = ref('')
const selectedBooking = ref(null)

// Stats
const stats = useState('admin-bookings-stats', () => ({
  pending: 0,
  approved: 0,
  rejected: 0,
  cancelled: 0,
  total: 0,
  deleted: 0
}))

// Toast Notification
const toast = ref({
  show: false,
  message: '',
  type: 'success' // 'success', 'error', 'info'
})

const showToast = (message, type = 'success') => {
  toast.value = { show: true, message, type }
  setTimeout(() => {
    toast.value.show = false
  }, 3000)
}

// Tabs Configuration
const tabs = computed(() => [
  { id: 'list', label: 'Daftar Pemesanan', icon: '📋', count: bookings.value.length },
  { id: 'audit', label: 'Audit Log', icon: '📜', count: auditLogs.value.length },
  { id: 'deleted', label: 'Soft Delete', icon: '🗑️', count: deletedBookings.value.length },
  { id: 'stats', label: 'Statistik', icon: '📊' }
])

const sortedBookings = computed(() => {
  const list = [...bookings.value]
  const dir = sortDir.value === 'asc' ? 1 : -1

  list.sort((a, b) => {
    let aVal
    let bVal

    switch (sortBy.value) {
      case 'start_time':
        // Bandingkan sebagai timestamp (numerik) untuk akurasi
        aVal = new Date(a.start_time || 0).getTime()
        bVal = new Date(b.start_time || 0).getTime()
        break
      case 'created_at':
        aVal = new Date(a.created_at || 0).getTime()
        bVal = new Date(b.created_at || 0).getTime()
        break
      case 'event_name':
        aVal = (a.event_name || '').toLowerCase()
        bVal = (b.event_name || '').toLowerCase()
        break
      case 'room_name':
        aVal = (a.room_name || '').toLowerCase()
        bVal = (b.room_name || '').toLowerCase()
        break
      case 'status': {
        // Urutkan PENDING > APPROVED > REJECTED > CANCELLED
        const order = { PENDING: 0, APPROVED: 1, REJECTED: 2, CANCELLED: 3 }
        aVal = order[a.status] ?? 99
        bVal = order[b.status] ?? 99
        break
      }
      default:
        aVal = 0; bVal = 0
    }

    if (aVal < bVal) return -1 * dir
    if (aVal > bVal) return 1  * dir
    return 0
  })

  return list
})

const bookingTotalPages = computed(() => Math.max(1, Math.ceil(sortedBookings.value.length / pageLimit)))
const auditTotalPages = computed(() => Math.max(1, Math.ceil(auditLogs.value.length / pageLimit)))
const deletedTotalPages = computed(() => Math.max(1, Math.ceil(deletedBookings.value.length / pageLimit)))
const paginatedBookings = computed(() => {
  const start = (bookingPage.value - 1) * pageLimit
  return sortedBookings.value.slice(start, start + pageLimit)
})
const paginatedAuditLogs = computed(() => {
  const start = (auditPage.value - 1) * pageLimit
  return auditLogs.value.slice(start, start + pageLimit)
})
const paginatedDeletedBookings = computed(() => {
  const start = (deletedPage.value - 1) * pageLimit
  return deletedBookings.value.slice(start, start + pageLimit)
})

const buildVisiblePages = (currentPage, totalPages) => {
  const pages = []
  const start = Math.max(1, currentPage - 2)
  const end = Math.min(totalPages, currentPage + 2)
  for (let page = start; page <= end; page++) pages.push(page)
  return pages
}

const bookingVisiblePages = computed(() => buildVisiblePages(bookingPage.value, bookingTotalPages.value))
const auditVisiblePages = computed(() => buildVisiblePages(auditPage.value, auditTotalPages.value))
const deletedVisiblePages = computed(() => buildVisiblePages(deletedPage.value, deletedTotalPages.value))

const scrollToTop = () => {
  nextTick(() => {
    const mainEl = document.querySelector('main')
    if (mainEl) {
      mainEl.scrollTo({ top: 0, behavior: 'smooth' })
    } else {
      window.scrollTo({ top: 0, behavior: 'smooth' })
    }
  })
}

const goToBookingPage = (page) => {
  if (page < 1 || page > bookingTotalPages.value) return
  bookingPage.value = page
  scrollToTop()
}

const goToAuditPage = (page) => {
  if (page < 1 || page > auditTotalPages.value) return
  auditPage.value = page
  scrollToTop()
}

const goToDeletedPage = (page) => {
  if (page < 1 || page > deletedTotalPages.value) return
  deletedPage.value = page
  scrollToTop()
}

// Load Data Functions
const loadBookings = async () => {
  loading.value = true
  try {
    let params = filterStatus.value ? `?status=${filterStatus.value}` : '?'

    if (useCustomRange.value && customStartDate.value && customEndDate.value) {
      // Convert custom date range to past_days / future_days params for the API
      const now = new Date()
      const start = new Date(customStartDate.value)
      const end = new Date(customEndDate.value)
      const pastDays = Math.max(0, Math.ceil((now.getTime() - start.getTime()) / 86400000))
      const futureDays = Math.max(0, Math.ceil((end.getTime() - now.getTime()) / 86400000))
      params += (params.endsWith('?') ? '' : '&') + `past_days=${pastDays}&days=${futureDays}`
    } else {
      // Default: 30 days past, 365 days future (agar booking jauh ke depan tetap terlihat)
      params += (params.endsWith('?') ? '' : '&') + 'past_days=30&days=365'
    }

    const response = await $fetch(`/api/admin/bookings${params}`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    if (response && typeof response === 'object' && 'bookings' in response) {
      bookings.value = response.bookings
      console.log('[Admin Panel] Date range:', response.date_range)
      console.log('[Admin Panel] Total bookings:', response.total)
    } else {
      bookings.value = response
    }
  } catch (err) {
    console.error('Failed to load bookings', err)
    showToast('Gagal memuat pemesanan', 'error')
  } finally {
    loading.value = false
  }
}

const loadAuditLogs = async () => {
  try {
    const response = await $fetch('/api/admin/audit-logs', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    auditLogs.value = response.logs || []
  } catch (err) {
    console.error('Failed to load audit logs', err)
  }
}

const loadDeletedBookings = async () => {
  try {
    deletedBookings.value = await $fetch('/api/admin/deleted-bookings', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load deleted bookings', err)
  }
}

const loadStats = async () => {
  try {
    const response = await $fetch('/api/admin/bookings', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    // Handle new response structure
    let allBookings
    if (response && typeof response === 'object' && 'bookings' in response) {
      allBookings = response.bookings

      // Use status_summary from API if available
      if (response.status_summary) {
        stats.value = {
          pending: response.status_summary.PENDING || 0,
          approved: response.status_summary.APPROVED || 0,
          rejected: response.status_summary.REJECTED || 0,
          cancelled: response.status_summary.CANCELLED || 0,
          total: response.total || 0,
          deleted: deletedBookings.value.length
        }
        return
      }
    } else {
      // Fallback for old response format
      allBookings = response
    }

    // Manual calculation if status_summary not available
    stats.value = {
      pending: allBookings.filter(b => b.status === 'PENDING').length,
      approved: allBookings.filter(b => b.status === 'APPROVED').length,
      rejected: allBookings.filter(b => b.status === 'REJECTED').length,
      cancelled: allBookings.filter(b => b.status === 'CANCELLED').length,
      total: allBookings.length,
      deleted: deletedBookings.value.length
    }
  } catch (err) {
    console.error('Failed to load stats', err)
  }
}

const viewHistory = async (booking) => {
  selectedBooking.value = booking
  showHistoryModal.value = true

  try {
    bookingHistory.value = await $fetch(`/api/bookings/${booking.id}/history`, {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
  } catch (err) {
    console.error('Failed to load history', err)
    showToast('Gagal memuat history pemesanan', 'error')
  }
}

// Action Functions
const approveBooking = async (booking) => {
  // Catat ID dan status asli sebelum optimistic update
  const targetId = booking.id
  const originalStatus = booking.status

  // Optimistic update: Langsung update UI menggunakan objek (bukan index)
  const targetBooking = bookings.value.find(b => b.id === targetId)
  if (targetBooking) {
    targetBooking.status = 'APPROVED'
    stats.value.pending--
    stats.value.approved++
  }

  try {
    await $fetch(`/api/bookings/${targetId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: { status: 'APPROVED' }
    })
    showToast('Pemesanan berhasil disetujui!')
  } catch (err) {
    console.error('Failed to approve booking', err)
    // Rollback by ID — aman meskipun list sudah berubah urutan
    const rollbackTarget = bookings.value.find(b => b.id === targetId)
    if (rollbackTarget) {
      rollbackTarget.status = originalStatus
      stats.value.pending++
      stats.value.approved--
    }
    showToast('Gagal menyetujui pemesanan', 'error')
  }
}

const rejectBooking = (booking) => {
  selectedBooking.value = booking
  showRejectModal.value = true
  rejectionReason.value = ''
}

const confirmReject = async () => {
  if (!rejectionReason.value.trim()) {
    showToast('Alasan penolakan harus diisi', 'error')
    return
  }

  // Catat ID dan status asli sebelum update & menutup modal
  const targetId = selectedBooking.value.id
  const originalStatus = selectedBooking.value.status
  const reasonSnapshot = rejectionReason.value

  // Optimistic update menggunakan referensi objek (bukan index)
  const targetBooking = bookings.value.find(b => b.id === targetId)
  if (targetBooking) {
    targetBooking.status = 'REJECTED'
    targetBooking.rejection_reason = reasonSnapshot
    if (originalStatus === 'PENDING') stats.value.pending--
    stats.value.rejected++
  }

  showRejectModal.value = false

  try {
    await $fetch(`/api/bookings/${targetId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: {
        status: 'REJECTED',
        rejection_reason: reasonSnapshot
      }
    })

    showToast('Pemesanan berhasil ditolak')
  } catch (err) {
    console.error('Failed to reject booking', err)
    // Rollback by ID — aman meskipun list sudah berubah urutan
    const rollbackTarget = bookings.value.find(b => b.id === targetId)
    if (rollbackTarget) {
      rollbackTarget.status = originalStatus
      rollbackTarget.rejection_reason = null
      if (originalStatus === 'PENDING') stats.value.pending++
      stats.value.rejected--
    }
    showToast('Gagal menolak pemesanan', 'error')
  }
}

const cancelBooking = (booking) => {
  selectedBooking.value = booking
  showCancelModal.value = true
  cancellationReason.value = ''
}

const confirmCancel = async () => {
  // Catat ID dan status asli sebelum update & menutup modal
  const targetId = selectedBooking.value.id
  const originalStatus = selectedBooking.value.status
  const reasonSnapshot = cancellationReason.value || 'Dibatalkan oleh admin'

  // Optimistic update menggunakan referensi objek (bukan index)
  const targetBooking = bookings.value.find(b => b.id === targetId)
  if (targetBooking) {
    targetBooking.status = 'CANCELLED'
    targetBooking.cancellation_reason = reasonSnapshot
    if (originalStatus === 'PENDING') stats.value.pending--
    else if (originalStatus === 'APPROVED') stats.value.approved--
    stats.value.cancelled++
  }

  showCancelModal.value = false

  try {
    await $fetch(`/api/bookings/${targetId}`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      body: {
        status: 'CANCELLED',
        cancellation_reason: reasonSnapshot
      }
    })

    showToast('Pemesanan berhasil dibatalkan')
  } catch (err) {
    console.error('Failed to cancel booking', err)
    // Rollback by ID — aman meskipun list sudah berubah urutan
    const rollbackTarget = bookings.value.find(b => b.id === targetId)
    if (rollbackTarget) {
      rollbackTarget.status = originalStatus
      rollbackTarget.cancellation_reason = null
      if (originalStatus === 'PENDING') stats.value.pending++
      else if (originalStatus === 'APPROVED') stats.value.approved++
      stats.value.cancelled--
    }
    showToast('Gagal membatalkan pemesanan', 'error')
  }
}

const confirmDeleteBooking = (booking) => {
  selectedBooking.value = booking
  showDeleteModal.value = true
}

const deleteBooking = async () => {
  // Catat ID sebelum optimistic update
  const targetId = selectedBooking.value.id

  // Optimistic update: Hapus dari list dan tambahkan ke deleted
  const index = bookings.value.findIndex(b => b.id === targetId)
  let removedBooking = null

  if (index !== -1) {
    removedBooking = { ...bookings.value[index] }
    bookings.value.splice(index, 1)

    // Update stats
    if (removedBooking.status === 'PENDING') stats.value.pending--
    else if (removedBooking.status === 'APPROVED') stats.value.approved--
    else if (removedBooking.status === 'REJECTED') stats.value.rejected--
    else if (removedBooking.status === 'CANCELLED') stats.value.cancelled--
    stats.value.total--
    stats.value.deleted++

    // Tambahkan ke deleted bookings
    deletedBookings.value.unshift({
      ...removedBooking,
      deleted_at: new Date().toISOString(),
      deleter_name: 'Admin'
    })
  }

  showDeleteModal.value = false

  try {
    await $fetch(`/api/bookings/${targetId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    showToast('Pemesanan berhasil dihapus (soft delete)')
  } catch (err) {
    console.error('Failed to delete booking', err)
    // Rollback on error: kembalikan ke posisi semula
    if (removedBooking) {
      // Sisipkan kembali di posisi asal (jika masih valid) atau di atas
      const insertIdx = Math.min(index, bookings.value.length)
      bookings.value.splice(insertIdx, 0, removedBooking)
      if (removedBooking.status === 'PENDING') stats.value.pending++
      else if (removedBooking.status === 'APPROVED') stats.value.approved++
      else if (removedBooking.status === 'REJECTED') stats.value.rejected++
      else if (removedBooking.status === 'CANCELLED') stats.value.cancelled++
      stats.value.total++
      stats.value.deleted--

      // Hapus dari deleted bookings menggunakan ID
      const deletedIdx = deletedBookings.value.findIndex(b => b.id === targetId)
      if (deletedIdx !== -1) {
        deletedBookings.value.splice(deletedIdx, 1)
      }
    }
    showToast('Gagal menghapus pemesanan', 'error')
  }
}

const restoreBooking = async (booking) => {
  if (!confirm(`Restore pemesanan "${booking.event_name}"?`)) return

  // Optimistic update: Hapus dari deleted list dan tambahkan ke main list
  const deletedIndex = deletedBookings.value.findIndex(b => b.id === booking.id)
  let restoredBooking = null

  if (deletedIndex !== -1) {
    restoredBooking = { ...deletedBookings.value[deletedIndex] }
    delete restoredBooking.deleted_at
    delete restoredBooking.deleted_by
    delete restoredBooking.deleter_name

    deletedBookings.value.splice(deletedIndex, 1)
    bookings.value.unshift(restoredBooking)

    // Update stats
    if (restoredBooking.status === 'PENDING') stats.value.pending++
    else if (restoredBooking.status === 'APPROVED') stats.value.approved++
    else if (restoredBooking.status === 'REJECTED') stats.value.rejected++
    else if (restoredBooking.status === 'CANCELLED') stats.value.cancelled++
    stats.value.total++
    stats.value.deleted--
  }

  try {
    await $fetch(`/api/bookings/${booking.id}/restore`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    showToast('Pemesanan berhasil direstore')
  } catch (err) {
    console.error('Failed to restore booking', err)
    // Rollback on error
    if (restoredBooking) {
      const mainIndex = bookings.value.findIndex(b => b.id === booking.id)
      if (mainIndex !== -1) {
        bookings.value.splice(mainIndex, 1)
      }
      deletedBookings.value.splice(deletedIndex, 0, booking)

      if (restoredBooking.status === 'PENDING') stats.value.pending--
      else if (restoredBooking.status === 'APPROVED') stats.value.approved--
      else if (restoredBooking.status === 'REJECTED') stats.value.rejected--
      else if (restoredBooking.status === 'CANCELLED') stats.value.cancelled--
      stats.value.total--
      stats.value.deleted++
    }
    showToast('Gagal restore pemesanan', 'error')
  }
}

const permanentDeleteBooking = async (booking) => {
  if (!confirm(`HAPUS PERMANEN pemesanan "${booking.event_name}"? Tindakan ini tidak dapat dibatalkan!`)) return

  // Optimistic update: Hapus dari deleted list
  const index = deletedBookings.value.findIndex(b => b.id === booking.id)
  let removedBooking = null

  if (index !== -1) {
    removedBooking = { ...deletedBookings.value[index] }
    deletedBookings.value.splice(index, 1)
    stats.value.deleted--
  }

  try {
    await $fetch(`/api/bookings/${booking.id}?permanent=true`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    showToast('Pemesanan berhasil dihapus permanen')
  } catch (err) {
    console.error('Failed to permanently delete booking', err)
    // Rollback on error
    if (removedBooking) {
      deletedBookings.value.splice(index, 0, removedBooking)
      stats.value.deleted++
    }
    showToast('Gagal menghapus permanen pemesanan', 'error')
  }
}

const exportToExcel = async () => {
  try {
    const blob = await $fetch('/api/admin/bookings/export', {
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('admin_access_token')}`
      },
      responseType: 'blob'
    })

    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `bookings-${new Date().toISOString().split('T')[0]}.xlsx`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)
  } catch (err) {
    console.error('Failed to export', err)
    showToast('Gagal export ke Excel', 'error')
  }
}

// Utility Functions — via useDatetime composable (single source of truth)
// toUtcDate sudah diimport dari useDatetime() di atas — tidak perlu dideklarasikan ulang.
// formatBookingDate, formatBookingTime, formatDateTime adalah alias ke composable.

const getRecurrenceLabel = (pattern) => {
  if (pattern === 'WEEKLY') return 'Mingguan'
  if (pattern === 'BIWEEKLY') return '2-Mingguan'
  if (pattern === 'MONTHLY') return 'Bulanan'
  return 'Rutin'
}

const formatBookingDate = formatWibDate
const formatBookingTime = formatWibTimeRange
const formatDateTime = formatWibDateTime


const getStatusClass = (status) => {
  const classes = {
    PENDING: 'text-amber-700 font-semibold',
    APPROVED: 'text-green-700 font-semibold',
    REJECTED: 'text-red-700 font-semibold',
    CANCELLED: 'text-orange-700 font-semibold'
  }
  return classes[status] || 'text-gray-600'
}

const getStatusBadgeClass = (status) => {
  const classes = {
    PENDING: 'bg-amber-100 text-amber-800 border border-amber-300',
    APPROVED: 'bg-green-100 text-green-800 border border-green-300',
    REJECTED: 'bg-red-100 text-red-800 border border-red-300',
    CANCELLED: 'bg-orange-100 text-orange-800 border border-orange-300'
  }
  return classes[status] || 'bg-gray-100 text-gray-800 border border-gray-300'
}

const getActionBadgeClass = (action) => {
  const classes = {
    CREATE: 'bg-green-100 text-green-800',
    UPDATE: 'bg-blue-100 text-blue-800',
    DELETE: 'bg-red-100 text-red-800',
    APPROVE: 'bg-green-100 text-green-800',
    REJECT: 'bg-red-100 text-red-800',
    CANCEL: 'bg-orange-100 text-orange-800',
    RESTORE: 'bg-purple-100 text-purple-800'
  }
  return classes[action] || 'bg-gray-100 text-gray-800'
}

// Watch tab changes
watch(activeTab, (newTab) => {
  bookingPage.value = 1
  auditPage.value = 1
  deletedPage.value = 1
  scrollToTop()

  if (newTab === 'audit' && auditLogs.value.length === 0) {
    loadAuditLogs()
  } else if (newTab === 'deleted' && deletedBookings.value.length === 0) {
    loadDeletedBookings()
  } else if (newTab === 'stats') {
    loadStats()
  }
})

// Initial Load
onMounted(() => {
  loadBookings()
  loadStats()
})

watch([filterStatus, customStartDate, customEndDate], () => {
  bookingPage.value = 1
  scrollToTop()
})

watch([bookingTotalPages, auditTotalPages, deletedTotalPages], ([bookingPages, auditPages, deletedPages]) => {
  if (bookingPage.value > bookingPages) bookingPage.value = bookingPages
  if (auditPage.value > auditPages) auditPage.value = auditPages
  if (deletedPage.value > deletedPages) deletedPage.value = deletedPages
})
</script>

<style scoped>
/* Add smooth scrolling for tab content */
.space-y-6 {
  scroll-behavior: smooth;
}

/* Toast transitions */
.toast-enter-active,
.toast-leave-active {
  transition: all 0.3s ease;
}

.toast-enter-from {
  opacity: 0;
  transform: translateY(1rem);
}

.toast-leave-to {
  opacity: 0;
  transform: translateX(10rem);
}

/* Modal Vue Transition (Smooth Zoom & Backdrop Fade) */
.modal-enter-active,
.modal-leave-active {
  transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from,
.modal-leave-to {
  opacity: 0;
}

.modal-enter-active .modal-content-box,
.modal-leave-active .modal-content-box {
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
}

.modal-enter-from .modal-content-box,
.modal-leave-to .modal-content-box {
  opacity: 0;
  transform: scale(0.95) translateY(10px);
}

/* Tab Pane Transitions */
.tab-pane {
  animation: tabFadeIn 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}

@keyframes tabFadeIn {
  from {
    opacity: 0;
    transform: translateY(6px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
</style>
