<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="bg-white p-6 rounded-lg shadow">
      <h1 class="text-2xl font-bold text-gray-800">Kelola Pemesanan</h1>
      <p class="text-gray-600 mt-1">Manajemen lengkap pemesanan ruangan</p>
    </div>

    <!-- Tab Navigation -->
    <div class="bg-white rounded-lg shadow">
      <div class="border-b border-gray-200">
        <nav class="flex -mb-px overflow-x-auto">
          <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id" :class="[
            'flex items-center space-x-2 px-6 py-4 text-sm font-medium border-b-2 whitespace-nowrap transition-colors',
            activeTab === tab.id
              ? 'border-blue-600 text-blue-600'
              : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
          ]">
            <span>{{ tab.icon }}</span>
            <span>{{ tab.label }}</span>
            <span v-if="tab.count !== undefined" class="bg-gray-200 text-gray-700 px-2 py-0.5 rounded-full text-xs">
              {{ tab.count }}
            </span>
          </button>
        </nav>
      </div>

      <!-- Tab Content -->
      <div class="p-6">
        <!-- Tab 1: Daftar Pemesanan -->
        <div v-show="activeTab === 'list'">
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

            <!-- Bookings List -->
            <div v-if="loading" class="text-center py-8 text-gray-500">
              Loading...
            </div>
            <div v-else-if="bookings.length === 0" class="text-center py-8 text-gray-500">
              Belum ada pemesanan.
            </div>
            <div v-else class="space-y-4">
              <div v-for="booking in paginatedBookings" :key="booking.id"
                class="border border-gray-200 p-4 rounded-lg hover:shadow-md transition-shadow">
                <!-- Card Body: Info -->
                <div class="mb-3">
                  <h3 class="font-semibold text-base text-gray-800 leading-snug">{{ booking.event_name }}</h3>
                  <div class="mt-2 space-y-1 text-sm text-gray-600">
                    <p>🏢 Ruangan: <span class="font-medium">{{ booking.room_name }}</span></p>
                    <p>👤 Pemesan: <span class="font-medium">{{ booking.user_name }}</span> ({{ booking.user_category }})</p>
                    <p>🏛️ Unit: <span class="font-medium">{{ booking.unit_name }}</span></p>
                    <p>📅 Tanggal: <span class="font-medium">{{ formatBookingDate(booking.start_time) }}</span></p>
                    <p>⏰ Waktu: <span class="font-medium">{{ formatBookingTime(booking.start_time, booking.end_time) }}</span></p>
                    <p>📊 Status: <span :class="getStatusClass(booking.status)">{{ booking.status }}</span></p>
                    <p v-if="booking.recurrence_pattern || booking.parent_booking_id" class="text-purple-700 font-semibold flex items-center gap-1">
                      🔄 Rutin: <span>{{ getRecurrenceLabel(booking.recurrence_pattern) }}</span>
                      <span class="text-xs bg-purple-100 text-purple-800 px-1.5 py-0.5 rounded font-medium">{{ booking.parent_booking_id ? 'Jadwal Seri' : 'Jadwal Utama' }}</span>
                    </p>
                    <p v-if="booking.rejection_reason" class="text-red-600">❌ Alasan Penolakan: {{ booking.rejection_reason }}</p>
                    <p v-if="booking.cancellation_reason" class="text-orange-600">🚫 Alasan Pembatalan: {{ booking.cancellation_reason }}</p>
                  </div>
                </div>

                <!-- Card Footer: Action Icons (horizontal, bottom) -->
                <div class="flex items-center gap-2 pt-3 border-t border-gray-100">
                  <!-- View History Button -->
                  <button @click="viewHistory(booking)" title="Lihat History"
                    class="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 inline-flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  <!-- Approve Button - Only for PENDING -->
                  <button v-if="booking.status === 'PENDING'" @click="approveBooking(booking)" title="Setujui"
                    class="flex-1 bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 inline-flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
                    </svg>
                  </button>

                  <!-- Reject Button - Only for PENDING -->
                  <button v-if="booking.status === 'PENDING'" @click="rejectBooking(booking)" title="Tolak"
                    class="flex-1 bg-red-600 text-white py-2 rounded-lg hover:bg-red-700 inline-flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>

                  <!-- Cancel Button - Only for APPROVED -->
                  <button v-if="booking.status === 'APPROVED'" @click="cancelBooking(booking)" title="Batalkan"
                    class="flex-1 bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 inline-flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                    </svg>
                  </button>

                  <!-- Delete Button -->
                  <button @click="confirmDeleteBooking(booking)" title="Hapus"
                    class="flex-1 bg-gray-600 text-white py-2 rounded-lg hover:bg-gray-700 inline-flex items-center justify-center">
                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                  </button>
                </div>
              </div>
              <div v-if="bookingTotalPages > 1" class="flex items-center justify-between border-t pt-4">
                <p class="text-sm text-gray-600">Halaman {{ bookingPage }} dari {{ bookingTotalPages }}</p>
                <div class="flex items-center gap-2">
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
        <div v-show="activeTab === 'audit'">
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

            <div v-if="auditTotalPages > 1" class="flex items-center justify-between border-t pt-4">
              <p class="text-sm text-gray-600">Halaman {{ auditPage }} dari {{ auditTotalPages }}</p>
              <div class="flex items-center gap-2">
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
        <div v-show="activeTab === 'deleted'">
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
              <div v-if="deletedTotalPages > 1" class="flex items-center justify-between border-t pt-4">
                <p class="text-sm text-gray-600">Halaman {{ deletedPage }} dari {{ deletedTotalPages }}</p>
                <div class="flex items-center gap-2">
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
        <div v-show="activeTab === 'stats'">
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
    <div v-if="showHistoryModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-2xl w-full max-h-[80vh] overflow-y-auto">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold">📜 History Pemesanan</h3>
          <button @click="showHistoryModal = false" class="text-gray-500 hover:text-gray-700">✕</button>
        </div>

        <div v-if="selectedBooking" class="mb-4 p-4 bg-gray-50 rounded">
          <h4 class="font-semibold">{{ selectedBooking.event_name }}</h4>
          <p class="text-sm text-gray-600">{{ selectedBooking.room_name }}</p>
        </div>

        <div v-if="bookingHistory.length === 0" class="text-center py-8 text-gray-500">
          Belum ada history untuk pemesanan ini.
        </div>
        <div v-else class="space-y-4">
          <div v-for="(history, index) in bookingHistory" :key="history.id" class="relative pl-8 pb-4">
            <!-- Timeline Line -->
            <div v-if="index !== bookingHistory.length - 1" class="absolute left-2 top-8 bottom-0 w-0.5 bg-gray-300">
            </div>

            <!-- Timeline Dot -->
            <div class="absolute left-0 top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white"></div>

            <!-- History Content -->
            <div class="bg-white border border-gray-200 rounded-lg p-4">
              <div class="flex justify-between items-start mb-2">
                <span :class="getStatusClass(history.new_status)" class="text-sm font-semibold">
                  {{ history.old_status }} → {{ history.new_status }}
                </span>
                <span class="text-xs text-gray-500">{{ formatDateTime(history.changed_at) }}</span>
              </div>
              <p class="text-sm text-gray-600">Oleh: {{ history.changed_by_name }}</p>
              <p v-if="history.change_reason" class="text-sm text-gray-700 mt-2 bg-gray-50 p-2 rounded">
                {{ history.change_reason }}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Reject Modal -->
    <div v-if="showRejectModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Tolak Pemesanan</h3>
        <p class="mb-4">Alasan penolakan:</p>
        <textarea v-model="rejectionReason"
          class="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-red-500" rows="3"
          required></textarea>
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="showRejectModal = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
          <button @click="confirmReject"
            class="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700">Tolak</button>
        </div>
      </div>
    </div>

    <!-- Cancel Modal -->
    <div v-if="showCancelModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <h3 class="text-lg font-semibold mb-4">Batalkan Pemesanan</h3>
        <p class="mb-2 text-gray-700">Pemesanan yang sudah disetujui akan dibatalkan.</p>
        <p class="mb-4 text-sm text-gray-600">Alasan pembatalan (opsional):</p>
        <textarea v-model="cancellationReason"
          class="w-full border border-gray-300 p-2 rounded-lg focus:ring-2 focus:ring-orange-500" rows="3"
          placeholder="Masukkan alasan pembatalan..."></textarea>
        <div class="flex justify-end space-x-2 mt-4">
          <button @click="showCancelModal = false"
            class="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg">Batal</button>
          <button @click="confirmCancel"
            class="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700">Batalkan Pemesanan</button>
        </div>
      </div>
    </div>

    <!-- Toast Notification -->
    <Transition name="toast">
      <div v-if="toast.show" :class="[
        'fixed bottom-4 right-4 px-6 py-4 rounded-lg shadow-lg text-white z-50 flex items-center gap-3',
        toast.type === 'success' ? 'bg-green-600' : toast.type === 'error' ? 'bg-red-600' : 'bg-blue-600'
      ]">
        <span class="text-2xl">{{ toast.type === 'success' ? '✅' : toast.type === 'error' ? '❌' : 'ℹ️' }}</span>
        <span>{{ toast.message }}</span>
      </div>
    </Transition>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div class="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div class="flex items-center mb-4">
          <svg class="w-6 h-6 text-red-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h3 class="text-lg font-semibold text-gray-900">Konfirmasi Hapus Pemesanan</h3>
        </div>
        <div class="mb-4">
          <p class="text-gray-700 mb-2">Apakah Anda yakin ingin menghapus pemesanan ini?</p>
          <div class="bg-gray-50 p-3 rounded border border-gray-200">
            <p class="text-sm font-semibold text-gray-900">{{ selectedBooking?.event_name }}</p>
            <p class="text-sm text-gray-600">{{ selectedBooking?.room_name }}</p>
            <p class="text-sm text-gray-600">{{ selectedBooking?.user_name }}</p>
          </div>
          <p class="text-red-600 text-sm mt-2 font-medium">⚠️ Pemesanan akan masuk ke "Soft Delete"</p>
        </div>
        <div class="flex justify-end space-x-2">
          <button @click="showDeleteModal = false"
            class="px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300">Batal</button>
          <button @click="deleteBooking" class="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700">Hapus
            Pemesanan</button>
        </div>
      </div>
    </div>
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

const bookingTotalPages = computed(() => Math.max(1, Math.ceil(bookings.value.length / pageLimit)))
const auditTotalPages = computed(() => Math.max(1, Math.ceil(auditLogs.value.length / pageLimit)))
const deletedTotalPages = computed(() => Math.max(1, Math.ceil(deletedBookings.value.length / pageLimit)))
const paginatedBookings = computed(() => {
  const start = (bookingPage.value - 1) * pageLimit
  return bookings.value.slice(start, start + pageLimit)
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

const goToBookingPage = (page) => {
  if (page < 1 || page > bookingTotalPages.value) return
  bookingPage.value = page
}

const goToAuditPage = (page) => {
  if (page < 1 || page > auditTotalPages.value) return
  auditPage.value = page
}

const goToDeletedPage = (page) => {
  if (page < 1 || page > deletedTotalPages.value) return
  deletedPage.value = page
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
    PENDING: 'text-yellow-600 font-semibold',
    APPROVED: 'text-green-600 font-semibold',
    REJECTED: 'text-red-600 font-semibold',
    CANCELLED: 'text-orange-600 font-semibold'
  }
  return classes[status] || 'text-gray-600'
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

watch(filterStatus, () => {
  bookingPage.value = 1
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
</style>
