<template>
  <div>
    <PageMaintenance v-if="isMaintenance" title="Pemesanan Ruangan" />
    <div v-else>
  <div class="min-h-screen pt-16 bg-gray-50"
    style="overflow-x: hidden !important; max-width: 100vw !important; box-sizing: border-box;">
    <section class="py-16 bg-white"
      style="overflow-x: hidden !important; max-width: 100vw !important; box-sizing: border-box;">
      <div class="container mx-auto px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]"
        style="overflow-x: hidden !important; max-width: 100% !important; box-sizing: border-box;">
        <Breadcrumb title="Pemesanan Ruangan" />

        <div class="text-center mb-12">
          <h1 class="text-4xl font-cinzel text-[#882f1d] mb-4">Pemesanan Ruangan</h1>
          <p class="text-xl text-gray-600">Pesan ruangan gereja untuk kegiatan Anda.</p>
        </div>

        <!-- Login Required Message -->
        <div v-if="!isLoggedIn" class="max-w-2xl mx-auto mb-12">
          <div
            class="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl shadow-lg p-8 text-center border-2 border-blue-200">
            <div class="mb-6">
              <svg class="w-20 h-20 mx-auto text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 class="text-3xl font-cinzel font-bold text-[#882f1d] mb-4">Login Diperlukan</h2>
            <p class="text-lg text-gray-700 mb-6">
              Silakan login terlebih dahulu untuk mengakses pemesanan ruang paroki.
            </p>
            <div class="bg-white/60 rounded-lg p-4 mb-6">
              <p class="text-sm text-gray-600 mb-3">
                <strong>Belum punya akun?</strong> Login di beranda untuk mendapatkan akses ke:
              </p>
              <ul class="text-left text-sm text-gray-700 space-y-2 max-w-md mx-auto">
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                  Pemesanan ruang paroki
                </li>
                <li class="flex items-center">
                  <svg class="w-5 h-5 text-green-500 mr-2" fill="currentColor" viewBox="0 0 20 20">
                    <path fill-rule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clip-rule="evenodd" />
                  </svg>
                  Kelola kronik (Admin & Pengurus)
                </li>
              </ul>
            </div>
            <NuxtLink to="/"
              class="inline-flex items-center bg-[#882f1d] text-white px-8 py-4 rounded-xl hover:bg-[#6b2416] transition-all duration-300 shadow-md hover:shadow-xl font-semibold text-lg">
              <svg class="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
              </svg>
              Kembali ke Beranda untuk Login
            </NuxtLink>
          </div>
        </div>

        <!-- Booking Section -->
        <div v-else>
          <!-- User Info Card -->
          <div class="mb-8 bg-white rounded-2xl shadow-md border border-gray-100 overflow-hidden">
            <div class="bg-gradient-to-r from-[#882f1d] to-[#b8442a] px-6 py-4 flex items-center gap-3">
              <div class="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
                <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <div class="min-w-0">
                <p class="text-white font-semibold text-base leading-tight truncate">{{ user?.full_name || 'Memuat...'
                }}
                </p>
                <p class="text-red-200 text-xs mt-0.5">Pengguna Aktif</p>
              </div>
            </div>
            <div class="px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div class="flex flex-col sm:flex-row gap-3 sm:gap-6">
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 flex-shrink-0">
                    <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
                    </svg>
                  </span>
                  <div>
                    <p class="text-xs text-gray-400 leading-none">Kategori</p>
                    <p class="text-sm font-medium text-gray-800 mt-0.5">{{ displayUserCategory }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 flex-shrink-0">
                    <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                  </span>
                  <div>
                    <p class="text-xs text-gray-400 leading-none">Unit</p>
                    <p class="text-sm font-medium text-gray-800 mt-0.5">{{ user?.unit_name || '–' }}</p>
                  </div>
                </div>
                <!-- Kuota Pemesanan -->
                <div class="flex items-center gap-2">
                  <span class="inline-flex items-center justify-center w-7 h-7 rounded-lg bg-orange-50 flex-shrink-0">
                    <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                    </svg>
                  </span>
                  <div>
                    <p class="text-xs text-gray-400 leading-none">Kuota Bulan Ini</p>
                    <p class="text-sm font-medium mt-0.5"
                      :class="userQuota && !userQuota.is_unlimited && userQuota.monthly_count >= userQuota.max_allowed
                        ? 'text-red-600 font-bold'
                        : userQuota && userQuota.is_unlimited ? 'text-green-600' : 'text-gray-800'">
                      <template v-if="!userQuota">–</template>
                      <template v-else-if="userQuota.is_unlimited">∞ Tidak Terbatas</template>
                      <template v-else>{{ userQuota.monthly_count }} / {{ userQuota.max_allowed }}</template>
                    </p>
                    <p v-if="userQuota && userQuota.period" class="text-xs text-gray-400">{{ userQuota.period }}</p>
                  </div>
                </div>
              </div>
              <button @click="logout"
                class="flex items-center justify-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300 transition-all duration-200 text-sm font-medium w-full sm:w-auto">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                </svg>
                Logout
              </button>
            </div>
          </div>

          <!-- Petunjuk Penggunaan -->
          <div class="mb-8 bg-blue-50 border-l-4 border-blue-500 p-6 rounded-r-lg">
            <div class="flex items-start">
              <svg class="w-6 h-6 text-blue-500 mt-1 mr-3 flex-shrink-0" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <h3 class="text-lg font-semibold text-blue-900 mb-3">Cara Pemesanan Ruangan</h3>
                <ol class="space-y-2 text-blue-800">
                  <li class="flex items-start">
                    <span class="font-bold mr-2">1.</span>
                    <span><strong>Pilih Ruangan:</strong> Klik tombol "Pesan" pada ruangan yang tersedia di bawah</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">2.</span>
                    <span><strong>Isi Detail:</strong> Masukkan nama acara, tanggal, jam mulai, dan jam selesai</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">3.</span>
                    <span><strong>Konfirmasi:</strong> Klik "Konfirmasi Pemesanan" setelah mengisi semua data</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">4.</span>
                    <span><strong>Tunggu Persetujuan:</strong> Pemesanan Anda akan diproses oleh admin</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">5.</span>
                    <span><strong>Batalkan (Opsional):</strong> Anda dapat membatalkan pemesanan selama status masih
                      <span class="font-semibold">PENDING</span></span>
                  </li>
                </ol>
                <div class="mt-4 pt-4 border-t border-blue-200">
                  <!-- Peringatan kuota penuh -->
                  <div v-if="userQuota && !userQuota.is_unlimited && userQuota.monthly_count >= userQuota.max_allowed"
                    class="mb-3 flex items-center gap-2 text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2 text-sm">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>
                      <strong>Kuota bulan ini penuh!</strong>
                      Anda sudah memiliki {{ userQuota.monthly_count }} dari {{ userQuota.max_allowed }} pemesanan
                      di bulan <strong>{{ userQuota.period }}</strong>.
                      Kuota akan direset bulan depan.
                    </span>
                  </div>
                  <!-- Info kuota tidak terbatas untuk DPP/BGKP -->
                  <div v-else-if="userQuota && userQuota.is_unlimited"
                    class="mb-3 flex items-center gap-2 text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm">
                    <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span>Akun Anda (DPP/BGKP) tidak memiliki batas pemesanan bulanan.</span>
                  </div>
                  <p class="text-sm text-blue-700">
                    <strong>Tips:</strong> Lihat pemesanan Anda di bagian "Pemesanan Saya" di bawah. Status akan
                    berubah menjadi
                    <span
                      class="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">DISETUJUI</span>
                    atau
                    <span
                      class="inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-semibold">DITOLAK</span>
                    setelah ditinjau admin.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Kalender Mingguan ──────────────────────────────────────────── -->
          <div class="mb-10">
            <div class="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 class="text-xl font-bold text-gray-800">📅 Jadwal Mingguan Ruangan</h2>
              <div class="flex items-center gap-2">
                <button @click="navigateWeek(-1)"
                  class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all" title="Minggu sebelumnya">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="text-sm font-medium text-gray-700 min-w-max">
                  {{ weeklyData ? `${formatShortDate(weeklyData.week_start)} – ${formatShortDate(weeklyData.week_end)}` : 'Memuat...' }}
                </span>
                <button @click="navigateWeek(1)"
                  class="p-2 rounded-lg border border-gray-200 hover:bg-gray-50 transition-all" title="Minggu depan">
                  <svg class="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button @click="navigateWeek(0)"
                  class="text-xs px-3 py-1.5 rounded-lg bg-[#882f1d] text-white hover:bg-[#6b2416] transition-all">
                  Minggu Ini
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="weeklyLoading" class="flex items-center justify-center py-10 text-gray-400">
              <svg class="w-5 h-5 animate-spin mr-2 text-[#882f1d]" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              Memuat jadwal...
            </div>

            <!-- Calendar Grid (Desktop) -->
            <div v-else-if="weeklyData" class="overflow-x-auto rounded-xl border border-gray-200 hidden md:block">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="text-left px-3 py-3 text-gray-500 font-semibold border-b border-gray-200 min-w-[120px]">Ruangan</th>
                    <th v-for="day in weeklyData.days" :key="day"
                      class="px-2 py-3 text-center text-gray-600 font-semibold border-b border-gray-200 min-w-[100px]"
                      :class="isToday(day) ? 'bg-orange-50 text-[#882f1d]' : ''">
                      <div>{{ getDayName(day) }}</div>
                      <div class="text-xs font-normal text-gray-400">{{ formatShortDate(day) }}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in weeklyData.rooms" :key="room.id" class="border-b border-gray-100 hover:bg-gray-50/50">
                    <td class="px-3 py-2 font-medium text-gray-700 align-top">{{ room.name }}</td>
                    <td v-for="day in weeklyData.days" :key="day"
                      class="px-1 py-1 align-top border-l border-gray-100"
                      :class="isToday(day) ? 'bg-orange-50/30' : ''">
                      <div class="space-y-1">
                        <div v-for="b in getBookingsForCell(room.id, day)" :key="b.id"
                          :class="b.status === 'APPROVED' ? 'bg-green-100 border-green-300 text-green-800' : 'bg-yellow-100 border-yellow-300 text-yellow-800'"
                          class="border rounded px-1.5 py-1"
                          :title="`${b.event_name} — ${b.requester_name} (${b.start_formatted}–${b.end_formatted})`">
                          <div class="font-semibold truncate max-w-[90px]">{{ b.event_name }}</div>
                          <div class="text-xs opacity-75">{{ b.start_formatted }}–{{ b.end_formatted }}</div>
                        </div>
                        <div v-if="getBookingsForCell(room.id, day).length === 0"
                          class="text-gray-300 text-center py-1 text-xs">—</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile: list per-day -->
            <div v-else-if="weeklyData" class="md:hidden space-y-3">
              <div v-for="day in weeklyData.days" :key="day" class="rounded-xl border border-gray-200 overflow-hidden">
                <div class="px-4 py-2 font-semibold text-sm"
                  :class="isToday(day) ? 'bg-[#882f1d] text-white' : 'bg-gray-50 text-gray-700'">
                  {{ getDayName(day) }}, {{ formatShortDate(day) }}
                </div>
                <div class="divide-y divide-gray-100">
                  <template v-for="room in weeklyData.rooms" :key="room.id">
                    <div v-if="getBookingsForCell(room.id, day).length > 0" class="px-4 py-2">
                      <p class="text-xs font-semibold text-gray-500 mb-1">{{ room.name }}</p>
                      <div v-for="b in getBookingsForCell(room.id, day)" :key="b.id"
                        :class="b.status === 'APPROVED' ? 'bg-green-50 text-green-800' : 'bg-yellow-50 text-yellow-800'"
                        class="rounded px-2 py-1 text-xs mb-1">
                        <span class="font-semibold">{{ b.event_name }}</span>
                        <span class="text-xs opacity-75 ml-1">({{ b.start_formatted }}–{{ b.end_formatted }})</span>
                      </div>
                    </div>
                  </template>
                  <div v-if="weeklyData.rooms && !weeklyData.rooms.some(r => getBookingsForCell(r.id, day).length > 0)"
                    class="px-4 py-3 text-sm text-gray-400 text-center">Tidak ada pemesanan</div>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="flex items-center gap-4 mt-3 text-xs text-gray-500">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded bg-green-200 border border-green-300 inline-block"></span> Disetujui
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded bg-yellow-200 border border-yellow-300 inline-block"></span> Menunggu
              </div>
            </div>
          </div>
          <!-- ── End Kalender Mingguan ─────────────────────────────────────── -->

          <!-- Divider -->
          <div class="flex items-center gap-4 my-8">
            <div class="flex-1 h-px bg-gradient-to-r from-transparent via-[#882f1d]/30 to-[#882f1d]/60"></div>
            <div class="flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#882f1d]/30 bg-[#882f1d]/5">
              <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
              </svg>
              <span class="text-sm font-semibold text-[#882f1d] font-cinzel">Peta Pemesanan</span>
            </div>
            <div class="flex-1 h-px bg-gradient-to-l from-transparent via-[#882f1d]/30 to-[#882f1d]/60"></div>
          </div>

          <!-- Available Rooms -->
          <div class="mb-8 w-full overflow-x-hidden">
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Ruangan Tersedia</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <div v-for="room in rooms" :key="room.id"
                class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 w-full max-w-full overflow-hidden">
                <!-- Room Name & Status Badge -->
                <div class="flex items-start justify-between mb-4">
                  <h3 class="text-2xl font-bold text-gray-900">{{ room.name }}</h3>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex-shrink-0 ml-2">
                    <span class="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Siap Dipesan
                  </span>
                </div>


                <!-- Room Info -->
                <div class="space-y-3 mb-6">
                  <!-- Capacity -->
                  <div class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 text-[#882f1d] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <span class="text-base"><strong>{{ room.capacity }}</strong> orang</span>
                  </div>

                  <!-- Location -->
                  <div class="flex items-center text-gray-700">
                    <svg class="w-5 h-5 text-[#882f1d] mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                    </svg>
                    <span class="text-base">{{ room.location }}</span>
                  </div>

                  <!-- Facilities -->
                  <div v-if="room.facilities" class="flex items-start text-gray-700">
                    <svg class="w-5 h-5 text-[#882f1d] mr-3 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <span class="text-base">{{ parseFacilities(room.facilities).join(', ') }}</span>
                  </div>
                </div>

                <!-- Button -->
                <button @click="selectRoom(room)"
                  class="w-full bg-[#882f1d] text-white px-6 py-3.5 rounded-xl hover:bg-[#6b2416] transition-colors font-semibold text-base">
                  Pesan
                </button>
              </div>
            </div>
          </div>

          <!-- Booking Modal -->
          <div v-if="selectedRoom"
            class="fixed top-16 left-0 right-0 bottom-0 bg-black/50 flex items-center justify-center z-10 p-4"
            @click="closeBookingModal">
            <div
              class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto"
              @click.stop>
              <!-- Simple Header -->
              <div class="p-6 border-b border-gray-200">
                <div class="flex justify-between items-start">
                  <div>
                    <h2 class="text-2xl font-cinzel font-bold text-gray-800">Pesan Ruangan</h2>
                    <p class="text-sm text-gray-600 mt-1">
                      {{ selectedRoom.name }} • {{ selectedRoom.capacity }} orang • {{ selectedRoom.location }}
                    </p>
                  </div>
                  <button @click="closeBookingModal" class="text-gray-400 hover:text-gray-600 transition-colors">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form @submit.prevent="createBooking" class="p-6 space-y-5">
                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Nama Acara *</label>
                  <input v-model="bookingForm.event_name" type="text"
                    placeholder="Contoh: Rapat Komisi, Pertemuan Kelompok"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all"
                    required />
                </div>

                <div>
                  <label class="block text-sm font-semibold text-gray-700 mb-2">Tanggal Acara *</label>
                  <input v-model="bookingForm.event_date" type="date" :min="getTodayDate()"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all"
                    required />
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Waktu Mulai *</label>
                    <input v-model="bookingForm.start_time" type="time"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all"
                      required />
                  </div>
                  <div>
                    <label class="block text-sm font-semibold text-gray-700 mb-2">Waktu Selesai *</label>
                    <input v-model="bookingForm.end_time" type="time"
                      class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all"
                      required />
                  </div>
                </div>

                <div v-if="bookingMessage"
                  class="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg flex items-center">
                  <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ bookingMessage }}
                </div>
                <div v-if="bookingError"
                  class="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg flex items-center">
                  <svg class="w-5 h-5 mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  {{ bookingError }}
                </div>

                <!-- ── Real-time Slot Availability Panel ──────────────────── -->
                <!-- Checking spinner -->
                <div v-if="slotChecking" class="flex items-center gap-2 px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
                  <svg class="w-4 h-4 animate-spin text-[#882f1d] flex-shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span>Memeriksa ketersediaan ruangan...</span>
                </div>

                <!-- Available -->
                <div v-else-if="slotCheckResult && slotCheckResult.available"
                  class="flex items-center gap-2 px-4 py-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-700">
                  <svg class="w-5 h-5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <span class="font-medium">Slot waktu tersedia — Anda dapat melanjutkan pemesanan</span>
                </div>

                <!-- Soft conflict: only PENDING -->
                <div v-else-if="slotCheckResult && slotCheckResult.soft_conflict"
                  class="px-4 py-3 bg-yellow-50 border border-yellow-300 rounded-lg text-sm">
                  <div class="flex items-start gap-2 mb-2">
                    <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="font-semibold text-yellow-800">Ada pemesanan yang menunggu persetujuan di waktu ini</p>
                      <p class="text-yellow-700 mt-0.5">Anda masih dapat memesan, namun mungkin ada konflik jika disetujui.</p>
                    </div>
                  </div>
                  <ul class="mt-2 space-y-1.5 pl-7">
                    <li v-for="c in slotCheckResult.conflicts" :key="c.id"
                      class="flex items-center gap-2 text-yellow-800">
                      <svg class="w-3.5 h-3.5 text-yellow-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="6" />
                      </svg>
                      <span>
                        <strong>{{ c.event_name }}</strong> oleh {{ c.requester_name }}
                        — Pukul {{ c.start_formatted }} – {{ c.end_formatted }}
                        <span class="ml-1 px-1.5 py-0.5 bg-yellow-200 text-yellow-800 rounded text-xs font-semibold">MENUNGGU</span>
                      </span>
                    </li>
                  </ul>
                </div>

                <!-- Hard conflict: APPROVED bookings exist -->
                <div v-else-if="slotCheckResult && slotCheckResult.hard_conflict"
                  class="px-4 py-3 bg-red-50 border border-red-300 rounded-lg text-sm">
                  <div class="flex items-start gap-2 mb-2">
                    <svg class="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    <div>
                      <p class="font-semibold text-red-800">Ruangan sudah dipesan pada waktu ini</p>
                      <p class="text-red-700 mt-0.5">Silakan pilih waktu atau tanggal lain.</p>
                    </div>
                  </div>
                  <ul class="mt-2 space-y-1.5 pl-7">
                    <li v-for="c in slotCheckResult.conflicts" :key="c.id"
                      class="flex items-center gap-2 text-red-800">
                      <svg class="w-3.5 h-3.5 text-red-500 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="6" />
                      </svg>
                      <span>
                        <strong>{{ c.event_name }}</strong> oleh {{ c.requester_name }}
                        — Pukul {{ c.start_formatted }} – {{ c.end_formatted }}
                        <span :class="c.status === 'APPROVED' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'"
                          class="ml-1 px-1.5 py-0.5 rounded text-xs font-semibold">
                          {{ c.status === 'APPROVED' ? 'DISETUJUI' : 'MENUNGGU' }}
                        </span>
                      </span>
                    </li>
                  </ul>
                </div>
                <!-- ── End Availability Panel ─────────────────────────────── -->

                <div class="flex gap-3 pt-2">
                  <button type="submit" :disabled="bookingLoading || slotChecking || hasHardConflict"
                    :title="hasHardConflict ? 'Waktu ini sudah dipesan. Pilih waktu lain.' : ''"
                    class="flex-1 bg-[#882f1d] text-white px-6 py-3 rounded-lg hover:bg-[#6b2416] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all">
                    {{ bookingLoading ? 'Memproses...' : 'Konfirmasi Pemesanan' }}
                  </button>
                  <button type="button" @click="closeBookingModal"
                    class="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 font-medium transition-all">
                    Batal
                  </button>
                </div>
              </form>
            </div>
          </div>

          <!-- My Bookings -->
          <div class="mb-12 w-full overflow-x-hidden" id="pemesanan-saya">
            <!-- Header dengan tombol filter -->
            <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-3">
              <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d]">Pemesanan Saya</h2>

              <!-- Toggle Button -->
              <button @click="toggleHistory" :class="[
                'flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 shadow-sm',
                showHistory
                  ? 'bg-gray-600 hover:bg-gray-700 text-white'
                  : 'bg-[#882f1d] hover:bg-[#6b2416] text-white'
              ]">
                <svg v-if="!showHistory" class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <svg v-else class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
                <span>{{ showHistory ? 'Kembali ke Aktif' : 'Lihat Riwayat' }}</span>
              </button>
            </div>

            <!-- Info badge -->
            <div v-if="!showHistory"
              class="mb-4 bg-blue-50 border border-blue-200 rounded-lg p-3 flex items-start gap-2">
              <svg class="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-blue-800">
                Menampilkan pemesanan <strong>aktif dan akan datang</strong>. Klik "Lihat Riwayat" untuk melihat semua
                pemesanan termasuk yang sudah lewat.
              </p>
            </div>
            <div v-else class="mb-4 bg-gray-50 border border-gray-300 rounded-lg p-3 flex items-start gap-2">
              <svg class="w-5 h-5 text-gray-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor"
                viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p class="text-sm text-gray-700">
                Menampilkan <strong>semua riwayat pemesanan</strong> termasuk yang sudah selesai.
              </p>
            </div>

            <div v-if="filteredMyBookings.length === 0" class="text-center py-12 bg-gray-50 rounded-lg">
              <svg class="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
              <p class="text-gray-600 text-lg">
                {{ emptyStateTitle }}
              </p>
              <p class="text-gray-500 text-sm mt-2">
                {{ emptyStateMessage }}
              </p>
            </div>
            <div v-else class="grid md:grid-cols-2 lg:grid-cols-3 gap-4 w-full">
              <div v-for="booking in paginatedBookings" :key="booking.id"
                class="bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden cursor-pointer w-full max-w-full"
                @click="viewBookingDetail(booking)">
                <div class="p-5">
                  <div class="flex justify-between items-start mb-3">
                    <h3 class="font-bold text-lg text-gray-800 truncate flex-1 mr-2">{{ booking.event_name }}</h3>
                    <div class="flex flex-col gap-1 items-end">
                      <span :class="getStatusBadgeClass(booking.status)"
                        class="px-2.5 py-1 rounded-full text-xs font-semibold">
                        {{ getStatusText(booking.status, booking.start_time, booking.end_time) }}
                      </span>
                      <!-- Badge SELESAI untuk booking yang sudah lewat -->
                      <span v-if="isBookingPassed(booking.end_time) && showHistory"
                        class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-400 text-white">
                        SELESAI
                      </span>
                    </div>
                  </div>

                  <div class="space-y-2 mb-4">
                    <div class="flex items-center text-gray-600 text-sm">
                      <svg class="w-4 h-4 mr-2 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                      </svg>
                      <span>{{ booking.room_name }}</span>
                    </div>
                    <div class="flex items-center text-gray-600 text-sm">
                      <svg class="w-4 h-4 mr-2 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span>{{ formatBookingTime(booking.start_time, booking.end_time) }}</span>
                    </div>
                  </div>

                  <div v-if="booking.rejection_reason"
                    class="bg-red-50 border border-red-200 text-red-700 text-sm px-3 py-2 rounded mb-2">
                    <strong>Alasan penolakan:</strong> {{ booking.rejection_reason }}
                  </div>

                  <div class="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                    <button class="text-[#882f1d] text-sm font-medium hover:underline">
                      Lihat Detail →
                    </button>
                    <button v-if="booking.status === 'PENDING'" @click.stop="confirmCancelBooking(booking.id)"
                      class="text-red-600 text-sm font-medium hover:bg-red-50 px-3 py-1 rounded transition-colors">
                      ✕ Batalkan
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <!-- Pagination -->
            <div v-if="filteredMyBookings.length > 0" class="mt-6 space-y-3">
              <!-- Pagination Controls - only show if more than 1 page -->
              <div v-if="totalPages > 1" class="flex justify-center items-center gap-2">
                <!-- Previous Button -->
                <button @click="previousPage" :disabled="currentPage === 1"
                  class="px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  :class="currentPage === 1 ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>

                <!-- Page Numbers -->
                <div class="flex gap-1">
                  <button v-for="page in paginationPages" :key="page" @click="goToPage(page)" :disabled="page === '...'"
                    class="px-4 py-2 rounded-lg transition-colors font-medium" :class="[
                      page === currentPage
                        ? 'bg-[#882f1d] text-white'
                        : page === '...'
                          ? 'text-gray-400 cursor-default'
                          : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-100'
                    ]">
                    {{ page }}
                  </button>
                </div>

                <!-- Next Button -->
                <button @click="nextPage" :disabled="currentPage === totalPages"
                  class="px-3 py-2 rounded-lg border transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-100"
                  :class="currentPage === totalPages ? 'border-gray-200 text-gray-400' : 'border-gray-300 text-gray-700'">
                  <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>

              <!-- Pagination Info - always show when there are bookings -->
              <div class="text-center text-sm text-gray-600">
                <span v-if="totalPages > 1">
                  Menampilkan {{ (currentPage - 1) * itemsPerPage + 1 }} -
                  {{ Math.min(currentPage * itemsPerPage, filteredMyBookings.length) }}
                  dari {{ filteredMyBookings.length }} pemesanan
                </span>
                <span v-else>
                  Total {{ filteredMyBookings.length }} pemesanan
                </span>
              </div>
            </div>
          </div>

          <!-- Booking Detail Modal -->
          <div v-if="selectedBookingDetail"
            class="fixed top-16 left-0 right-0 bottom-0 bg-black bg-opacity-50 flex items-center justify-center z-10 p-4"
            @click="closeBookingDetail">
            <div class="bg-white rounded-lg shadow-xl max-w-lg w-full pointer-events-auto" @click.stop>
              <div class="bg-[#882f1d] text-white p-6 rounded-t-lg">
                <div class="flex justify-between items-center">
                  <h2 class="text-2xl font-cinzel font-bold">Detail Pemesanan</h2>
                  <button @click.stop="closeBookingDetail" class="text-white hover:text-gray-200">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div class="p-6 space-y-5">
                <div>
                  <label class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Nama Acara</label>
                  <p class="text-lg font-bold text-gray-800 mt-1">{{ selectedBookingDetail.event_name }}</p>
                </div>

                <div class="grid grid-cols-2 gap-4">
                  <div>
                    <label class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Ruangan</label>
                    <p class="text-gray-800 mt-1">{{ selectedBookingDetail.room_name }}</p>
                  </div>
                  <div>
                    <label class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Status</label>
                    <p class="mt-1">
                      <span :class="getStatusBadgeClass(selectedBookingDetail.status)"
                        class="inline-block px-3 py-1 rounded-full text-sm font-semibold">
                        {{ getStatusText(selectedBookingDetail.status, selectedBookingDetail.start_time, selectedBookingDetail.end_time) }}
                      </span>
                    </p>
                  </div>
                </div>

                <div>
                  <label class="text-sm font-semibold text-gray-500 uppercase tracking-wide">Tanggal & Waktu</label>
                  <div class="mt-2 bg-gray-50 p-4 rounded-lg">
                    <div class="flex items-center text-gray-700 mb-2">
                      <svg class="w-5 h-5 mr-2 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      <span class="font-medium">{{ formatDate(selectedBookingDetail.start_time) }}</span>
                    </div>
                    <div class="flex items-center text-gray-700">
                      <svg class="w-5 h-5 mr-2 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                      <span>{{ formatTime(selectedBookingDetail.start_time) }} - {{
                        formatTime(selectedBookingDetail.end_time) }}</span>
                    </div>
                  </div>
                </div>

                <div v-if="selectedBookingDetail.rejection_reason"
                  class="bg-red-50 border border-red-200 rounded-lg p-4">
                  <label class="text-sm font-semibold text-red-700 uppercase tracking-wide">Alasan Penolakan</label>
                  <p class="text-red-800 mt-1">{{ selectedBookingDetail.rejection_reason }}</p>
                </div>

                <div class="pt-4">
                  <button @click.stop="closeBookingDetail"
                    class="w-full bg-gray-100 hover:bg-gray-200 text-gray-700 px-6 py-3 rounded-lg font-medium transition-colors">
                    Tutup
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Room Availability Table -->
          <div class="overflow-x-hidden w-full">
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-4">Peta Pemesanan Ruangan</h2>

            <!-- Date Selector -->
            <div class="mb-4">
              <label class="block text-sm font-medium text-gray-700 mb-2">Pilih Tanggal</label>
              <div class="flex items-center gap-2">
                <button @click="navigateDate(-1)"
                  class="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                  title="Hari sebelumnya">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  Kemarin
                </button>
                <input v-model="selectedDate" type="date" @change="loadRoomAvailability" class="p-2 border rounded" />
                <button @click="navigateDate(1)"
                  class="flex items-center gap-1 px-3 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition-colors text-sm font-medium"
                  title="Hari berikutnya">
                  Besok
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Mobile View: Card Layout -->
            <div class="md:hidden space-y-4 mb-6 w-full overflow-x-hidden mobile-cards-only">
              <div v-for="room in roomAvailability" :key="room.id"
                class="bg-white border-2 border-gray-200 rounded-2xl p-5 shadow-md hover:shadow-xl hover:border-[#882f1d]/30 transition-all duration-300 w-full max-w-full overflow-hidden">
                <!-- Room Name with Icon -->
                <div class="flex items-center mb-4 pb-3 border-b-2 border-gray-100">
                  <div class="bg-[#882f1d]/10 p-2 rounded-lg mr-3">
                    <svg class="w-6 h-6 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                    </svg>
                  </div>
                  <h3 class="text-xl font-bold text-gray-900 truncate flex-1">
                    {{ room.name }}
                  </h3>
                </div>

                <!-- Room Info (2-column grid) -->
                <div class="grid grid-cols-2 gap-3 mb-4 w-full">
                  <div class="min-w-0 bg-gray-50 p-3 rounded-lg">
                    <div class="text-xs text-gray-500 uppercase font-semibold mb-2">Kapasitas</div>
                    <div class="font-bold text-gray-900 flex items-center text-base">
                      <svg class="w-5 h-5 mr-2 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                      </svg>
                      <span class="truncate">{{ room.capacity }}</span>
                    </div>
                  </div>
                  <div class="min-w-0 bg-gray-50 p-3 rounded-lg">
                    <div class="text-xs text-gray-500 uppercase font-semibold mb-2">Lokasi</div>
                    <div class="font-bold text-gray-900 flex items-center text-base">
                      <svg class="w-5 h-5 mr-2 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor"
                        viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                      </svg>
                      <span class="truncate">{{ room.location }}</span>
                    </div>
                  </div>
                </div>

                <!-- Facilities -->
                <div v-if="room.facilities" class="mb-4 pb-4 border-b border-gray-200 w-full overflow-hidden">
                  <div class="text-xs text-gray-500 uppercase font-semibold mb-2 flex items-center">
                    <svg class="w-4 h-4 mr-1 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                    Fasilitas
                  </div>
                  <div class="flex flex-wrap gap-2">
                    <span v-for="(facility, index) in parseFacilities(room.facilities)" :key="index"
                      class="inline-flex items-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded-full text-sm font-medium">
                      <svg class="w-3 h-3 mr-1.5" fill="currentColor" viewBox="0 0 20 20">
                        <circle cx="10" cy="10" r="3" />
                      </svg>
                      {{ facility }}
                    </span>
                  </div>
                </div>

                <!-- Status Badge -->
                <div class="mb-4">
                  <div class="flex items-center justify-between">
                    <span class="text-xs text-gray-500 uppercase font-semibold">Status</span>
                    <span :class="getAvailabilityStatusClass(room.status)"
                      class="inline-flex items-center px-4 py-2 rounded-lg text-sm font-bold shadow-sm">
                      <span class="w-2 h-2 rounded-full mr-2 animate-pulse" :class="{
                        'bg-green-400': room.status === 'Tersedia',
                        'bg-blue-400': room.status === 'Sedang Digunakan',
                        'bg-yellow-400': room.status === 'Sudah Dipesan',
                        'bg-orange-400': room.status === 'Menunggu Persetujuan'
                      }"></span>
                      {{ room.status }}
                    </span>
                  </div>
                  <div v-if="room.statusDetails" class="text-sm text-gray-600 mt-2 italic">
                    {{ room.statusDetails }}
                  </div>
                </div>

                <!-- Bookings Today (Collapsible) -->
                <div v-if="room.bookings && room.bookings.length > 0" class="border-t-2 border-gray-200 pt-4">
                  <button @click="toggleRoomBookings(room.id)"
                    class="flex items-center justify-between w-full text-base font-bold text-gray-800 mb-3 hover:text-[#882f1d] transition-colors bg-gray-50 p-3 rounded-lg">
                    <span class="flex items-center">
                      <svg class="w-5 h-5 mr-2 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Jadwal Hari Ini
                      <span class="ml-2 px-2 py-0.5 bg-[#882f1d] text-white rounded-full text-xs font-bold">
                        {{ room.bookings.length }}
                      </span>
                    </span>
                    <svg class="w-6 h-6 transition-transform duration-300"
                      :class="{ 'rotate-180': expandedRooms[room.id] }" fill="none" stroke="currentColor"
                      viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                    </svg>
                  </button>

                  <div v-show="expandedRooms[room.id]" class="space-y-3 mt-2 animate-fade-in w-full">
                    <div v-for="booking in room.bookings" :key="booking.id"
                      class="bg-gradient-to-r from-gray-50 to-gray-100 p-4 rounded-xl border-l-4 border-[#882f1d] w-full overflow-hidden shadow-sm">
                      <div class="font-bold text-base text-gray-900 mb-2 break-words">
                        {{ booking.event_name }}
                      </div>
                      <div class="text-sm text-gray-600 flex items-center mb-3">
                        <svg class="w-4 h-4 mr-2 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span class="font-semibold">{{ formatTime(booking.start_time) }} - {{
                          formatTime(booking.end_time) }}</span>
                      </div>
                      <span :class="getBookingStatusBadgeClass(booking.status)"
                        class="inline-flex items-center px-3 py-1.5 rounded-lg text-xs font-bold shadow-sm">
                        {{ getBookingStatusText(booking.status) }}
                      </span>
                    </div>
                  </div>
                </div>

                <!-- No Bookings Message -->
                <div v-else class="text-center py-6 bg-gray-50 rounded-xl border-2 border-dashed border-gray-300">
                  <svg class="w-12 h-12 mx-auto text-gray-400 mb-2" fill="none" stroke="currentColor"
                    viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                  </svg>
                  <p class="text-sm font-semibold text-gray-600">Tidak ada jadwal hari ini</p>
                  <p class="text-xs text-gray-500 mt-1">Ruangan tersedia untuk dipesan</p>
                </div>
              </div>
            </div>

            <!-- Desktop View: Table -->
            <div class="hidden md:block overflow-x-auto w-full table-desktop-only">
              <table class="w-full bg-white border border-gray-300">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="px-4 py-2 border-b text-left">Nama Ruangan</th>
                    <th class="px-4 py-2 border-b text-left">Kapasitas</th>
                    <th class="px-4 py-2 border-b text-left">Lokasi</th>
                    <th class="px-4 py-2 border-b text-left">Fasilitas</th>
                    <th class="px-4 py-2 border-b text-left">Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in roomAvailability" :key="room.id" class="hover:bg-gray-50">
                    <td class="px-4 py-2 border-b font-medium">{{ room.name }}</td>
                    <td class="px-4 py-2 border-b">{{ room.capacity }} orang</td>
                    <td class="px-4 py-2 border-b">{{ room.location }}</td>
                    <td class="px-4 py-2 border-b">
                      <div v-if="room.facilities" class="text-sm">
                        {{ parseFacilities(room.facilities).join(', ') }}
                      </div>
                      <span v-else class="text-gray-400">-</span>
                    </td>
                    <td class="px-4 py-2 border-b">
                      <div class="flex flex-col">
                        <span :class="getAvailabilityStatusClass(room.status)" class="font-medium">
                          {{ room.status }}
                        </span>
                        <div v-if="room.statusDetails" class="text-sm text-gray-600 mt-1">
                          {{ room.statusDetails }}
                        </div>
                        <div v-if="room.bookings && room.bookings.length > 0" class="mt-2">
                          <div class="text-xs text-gray-500 mb-1">Jadwal Hari Ini:</div>
                          <div v-for="booking in room.bookings.slice(0, 3)" :key="booking.id"
                            class="text-xs bg-gray-100 p-1 rounded mb-1">
                            <div class="font-medium">{{ booking.event_name }}</div>
                            <div class="text-gray-600">
                              {{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}
                              <span :class="getBookingStatusBadgeClass(booking.status)">
                                ({{ getBookingStatusText(booking.status) }})
                              </span>
                            </div>
                          </div>
                          <div v-if="room.bookings.length > 3" class="text-xs text-gray-500">
                            +{{ room.bookings.length - 3 }} lainnya...
                          </div>
                        </div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Legend -->
            <div class="mt-4 p-4 bg-gradient-to-br from-gray-50 to-gray-100 rounded-lg border border-gray-200">
              <h3 class="font-semibold text-gray-800 mb-3 flex items-center">
                <svg class="w-5 h-5 mr-2 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Keterangan Status:
              </h3>
              <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-sm">
                <div class="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span class="w-4 h-4 bg-green-500 rounded-full mr-2.5 flex-shrink-0"></span>
                  <span class="font-medium text-gray-700">Tersedia</span>
                </div>
                <div class="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span class="w-4 h-4 bg-blue-500 rounded-full mr-2.5 flex-shrink-0"></span>
                  <span class="font-medium text-gray-700">Sedang Digunakan</span>
                </div>
                <div class="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span class="w-4 h-4 bg-yellow-500 rounded-full mr-2.5 flex-shrink-0"></span>
                  <span class="font-medium text-gray-700">Sudah Dipesan</span>
                </div>
                <div class="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
                  <span class="w-4 h-4 bg-orange-500 rounded-full mr-2.5 flex-shrink-0"></span>
                  <span class="font-medium text-gray-700">Menunggu Persetujuan</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        <BackButton position="bottom" />
      </div>
    </section>
  </div>
    </div>
  </div>
</template>

<script setup>
const { isMaintenance } = useMaintenance('booking')
// Use composable to prevent horizontal scroll
usePreventHorizontalScroll();

// Helper function to safely parse facilities
const parseFacilities = (facilities) => {
  if (!facilities) return []

  try {
    // If already an array, return it
    if (Array.isArray(facilities)) return facilities

    // Try to parse as JSON
    const parsed = JSON.parse(facilities)
    return Array.isArray(parsed) ? parsed : [facilities]
  } catch {
    // If parse fails, treat as plain text
    return [facilities]
  }
}

const isLoggedIn = ref(false)
const user = ref({})
const rooms = ref([])
const myBookings = ref([])
const showHistory = ref(false) // Toggle untuk melihat riwayat
const selectedRoom = ref(null)
const selectedBookingDetail = ref(null)
const roomAvailability = ref([])
const selectedDate = ref('')
const expandedRooms = ref({}) // For mobile card collapse/expand

// \u2500\u2500 Kuota pemesanan user \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const userQuota = ref(null) // { active_count, max_allowed, remaining, can_book }

const loadUserQuota = async () => {
  try {
    const token = localStorage.getItem('auth_token')
    if (!token) return
    const result = await $fetch('/api/bookings/my-quota', {
      headers: { Authorization: `Bearer ${token}` }
    })
    userQuota.value = result
  } catch (err) {
    console.warn('[QUOTA] Failed to load quota:', err)
    userQuota.value = null
  }
}

// \u2500\u2500 Kalender Mingguan \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const weeklyData  = ref(null)
const weeklyLoading = ref(false)
const currentWeekStart = ref('') // YYYY-MM-DD of the Monday being displayed

const loadWeeklySchedule = async (startDate = '') => {
  weeklyLoading.value = true
  try {
    const params = startDate ? { start_date: startDate } : {}
    const data = await $fetch('/api/bookings/weekly-schedule', { query: params })
    weeklyData.value = data
    currentWeekStart.value = data.week_start
  } catch (err) {
    console.error('[WEEKLY SCHEDULE] Failed:', err)
    weeklyData.value = null
  } finally {
    weeklyLoading.value = false
  }
}

// Navigate week: direction -1 = prev, 0 = current, 1 = next
const navigateWeek = (direction: number) => {
  if (direction === 0) {
    loadWeeklySchedule('')
    return
  }
  const base = currentWeekStart.value
    ? new Date(`${currentWeekStart.value}T00:00:00`)
    : new Date()
  base.setDate(base.getDate() + direction * 7)
  const y = base.getFullYear()
  const m = String(base.getMonth() + 1).padStart(2, '0')
  const d = String(base.getDate()).padStart(2, '0')
  loadWeeklySchedule(`${y}-${m}-${d}`)
}

// Get all bookings for a specific room + date cell
const getBookingsForCell = (roomId: number, dateKey: string) => {
  if (!weeklyData.value?.bookings) return []
  return weeklyData.value.bookings.filter(
    (b: any) => b.room_id === roomId && b.date_key === dateKey
  )
}

// Format YYYY-MM-DD to "Sen 28 Jul"
const formatShortDate = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })
}

// Day name for header
const getDayName = (dateStr: string) => {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('id-ID', { weekday: 'short', timeZone: 'Asia/Jakarta' })
}

// Check if a date string equals today
const isToday = (dateStr: string) => {
  const today = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
  return dateStr === today
}

// Pagination state
const currentPage = ref(1)
const itemsPerPage = ref(6) // Show 6 bookings per page (2 rows of 3 cards)

const loginForm = ref({
  username: '',
  password: ''
})

const bookingForm = ref({
  event_name: '',
  event_date: '',
  start_time: '',
  end_time: ''
})

const loginLoading = ref(false)
const bookingLoading = ref(false)
const loginError = ref('')
const bookingMessage = ref('')
const bookingError = ref('')

// ── Real-time slot availability check ────────────────────────────────────────
// null   = belum dicek (form belum lengkap)
// object = hasil dari API check-availability
const slotCheckResult = ref(null)
const slotChecking = ref(false)

// Debounce timer handle
let slotCheckTimer = null

// Cek apakah ada hard conflict (APPROVED) yang mencegah pemesanan
const hasHardConflict = computed(() => slotCheckResult.value?.hard_conflict === true)

// Fungsi cek ketersediaan slot, dipanggil setelah debounce
const checkSlotAvailability = async () => {
  const { event_date, start_time, end_time } = bookingForm.value
  const roomId = selectedRoom.value?.id

  // Reset jika form belum lengkap
  if (!roomId || !event_date || !start_time || !end_time) {
    slotCheckResult.value = null
    return
  }

  // Validasi dasar sebelum kirim request
  if (start_time >= end_time) {
    slotCheckResult.value = null
    return
  }

  slotChecking.value = true
  slotCheckResult.value = null

  try {
    const result = await $fetch('/api/bookings/check-availability', {
      query: {
        room_id: roomId,
        date: event_date,
        start_time,
        end_time
      }
    })
    slotCheckResult.value = result
  } catch (err) {
    // Jika API gagal, jangan blokir user — cukup reset
    slotCheckResult.value = null
    console.warn('[SLOT CHECK] Failed:', err)
  } finally {
    slotChecking.value = false
  }
}

// Watcher: trigger debounced check setiap kali tanggal atau waktu berubah
watch(
  () => [bookingForm.value.event_date, bookingForm.value.start_time, bookingForm.value.end_time],
  () => {
    // Reset hasil lama
    slotCheckResult.value = null
    if (slotCheckTimer) clearTimeout(slotCheckTimer)
    slotCheckTimer = setTimeout(checkSlotAvailability, 600)
  }
)

// Computed: Menampilkan kategori user dengan format yang mudah dibaca
const displayUserCategory = computed(() => {
  const cat = user.value?.user_category
  if (!cat) return '–'
  // Capitalize first letter of each word
  return String(cat)
    .split(/[_\s]+/)
    .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase())
    .join(' ')
})

// Computed: Empty state messages
const emptyStateTitle = computed(() =>
  showHistory.value
    ? 'Belum ada riwayat pemesanan'
    : 'Tidak ada pemesanan aktif'
)

const emptyStateMessage = computed(() =>
  showHistory.value
    ? 'Semua pemesanan Anda akan muncul di sini'
    : 'Pilih ruangan di atas untuk membuat pemesanan pertama Anda'
)

// Toggle room bookings visibility (mobile cards)
const toggleRoomBookings = (roomId) => {
  expandedRooms.value[roomId] = !expandedRooms.value[roomId]
}

// Computed: Filter pemesanan berdasarkan waktu
const filteredMyBookings = computed(() => {
  if (showHistory.value) {
    // Tampilkan semua riwayat
    return myBookings.value
  } else {
    // Hanya tampilkan pemesanan sekarang dan akan datang (tidak termasuk yang sudah lewat)
    const now = new Date()
    return myBookings.value.filter(booking => {
      const bookingEndTime = new Date(booking.end_time)
      return bookingEndTime >= now // Hanya yang belum selesai
    })
  }
})

// Computed: Pagination
const totalPages = computed(() => {
  return Math.ceil(filteredMyBookings.value.length / itemsPerPage.value)
})

const paginatedBookings = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return filteredMyBookings.value.slice(start, end)
})

const paginationPages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  // Always show first page
  pages.push(1)

  if (total <= 7) {
    // If 7 or fewer pages, show all
    for (let i = 2; i <= total; i++) {
      pages.push(i)
    }
  } else {
    // Show pages with ellipsis
    if (current > 3) {
      pages.push('...')
    }

    // Show pages around current
    const start = Math.max(2, current - 1)
    const end = Math.min(total - 1, current + 1)

    for (let i = start; i <= end; i++) {
      if (!pages.includes(i)) {
        pages.push(i)
      }
    }

    if (current < total - 2) {
      pages.push('...')
    }

    // Always show last page
    if (!pages.includes(total)) {
      pages.push(total)
    }
  }

  return pages
})

// Toggle untuk menampilkan/menyembunyikan riwayat
const toggleHistory = () => {
  showHistory.value = !showHistory.value
  currentPage.value = 1 // Reset to first page when toggling
}

// Pagination functions
const goToPage = (page) => {
  if (page === '...' || page < 1 || page > totalPages.value) return
  currentPage.value = page

  // Scroll to bookings section
  const bookingsSection = document.querySelector('#pemesanan-saya')
  if (bookingsSection) {
    bookingsSection.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }
}

const previousPage = () => {
  if (currentPage.value > 1) {
    goToPage(currentPage.value - 1)
  }
}

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    goToPage(currentPage.value + 1)
  }
}

// Check if booking has passed
const isBookingPassed = (endTime) => {
  const now = new Date()
  const bookingEndTime = new Date(endTime)
  return bookingEndTime < now
}

// Helper functions
const getTodayDate = () => {
  const today = new Date()
  const year = today.getFullYear()
  const month = String(today.getMonth() + 1).padStart(2, '0')
  const day = String(today.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const viewBookingDetail = (booking) => {
  console.log('[VIEW DETAIL] Opening booking detail:', booking)
  selectedBookingDetail.value = booking
}

const closeBookingDetail = () => {
  console.log('[CLOSE DETAIL] Closing booking detail modal')
  selectedBookingDetail.value = null
  // NOTE: tidak perlu reload data hanya karena modal detail ditutup;
  // reload hanya dilakukan setelah tindakan yang mengubah data (booking baru, cancel, dll.)
}

const formatDate = (dateTime) => {
  const date = new Date(dateTime)
  const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' }
  return date.toLocaleDateString('id-ID', options)
}

const formatTime = (dateTime) => {
  const date = new Date(dateTime)
  return date.toLocaleTimeString('id-ID', {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }).replace('.', ':')
}

const getStatusBadgeClass = (status) => {
  const classes = {
    'PENDING': 'bg-yellow-100 text-yellow-800',
    'APPROVED': 'bg-green-100 text-green-800',
    'REJECTED': 'bg-red-100 text-red-800',
    'COMPLETED': 'bg-blue-100 text-blue-800',
    'CANCELLED': 'bg-gray-100 text-gray-800'
  }
  return classes[status] || 'bg-gray-100 text-gray-800'
}

// Check if logged in
onMounted(async () => {
  console.log('[MOUNTED] Checking for existing token...')

  // FORCE FIX HORIZONTAL SCROLL
  if (process.client) {
    setTimeout(() => {
      // Force overflow hidden on all containers
      const containers = ['html', 'body', '#__nuxt', 'main', 'section'];
      containers.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          el.style.setProperty('overflow-x', 'hidden', 'important');
          el.style.setProperty('max-width', '100vw', 'important');
          el.style.setProperty('width', '100%', 'important');
        }
      });

      // Fix all wide elements
      document.querySelectorAll('*').forEach(el => {
        if (el.scrollWidth > window.innerWidth) {
          el.style.setProperty('max-width', '100%', 'important');
          el.style.setProperty('overflow-x', 'hidden', 'important');
        }
      });

      console.log('✅ Horizontal scroll fix applied');
    }, 100);
  }

  const token = localStorage.getItem('auth_token')
  if (token) {
    console.log('[MOUNTED] Token found, fetching user data...')
    try {
      const response = await $fetch('/api/me', {
        headers: { Authorization: `Bearer ${token}` }
      })
      console.log('[MOUNTED] User data loaded:', response)

      // Check if user is admin - redirect to admin panel
      // Only redirect confirmed admin roles (NOT generic role_id check which is too broad)
      const isAdmin = response.role === 'super_admin' ||
        response.role === 'admin_komsos' ||
        response.role === 'admin_sekretariat'

      if (isAdmin) {
        console.log('[MOUNTED] Admin user detected, redirecting to admin panel...')
        await navigateTo('/admin/bookings-new')
        return
      }

      user.value = response
      isLoggedIn.value = true
      // Load booking data, quota, and weekly calendar in parallel
      await Promise.all([
        loadData(),
        loadUserQuota(),
        loadWeeklySchedule()
      ])
    } catch (error) {
      console.error('[MOUNTED] Token invalid, removing:', error)
      localStorage.removeItem('auth_token')
    }
  } else {
    console.log('[MOUNTED] No token found')
  }

  // Set default date to today
  const today = new Date().toISOString().split('T')[0]
  selectedDate.value = today

  // Add window resize listener to reapply fix
  if (process.client) {
    window.addEventListener('resize', () => {
      const containers = ['html', 'body', '#__nuxt', 'main'];
      containers.forEach(selector => {
        const el = document.querySelector(selector);
        if (el) {
          el.style.setProperty('overflow-x', 'hidden', 'important');
          el.style.setProperty('max-width', '100vw', 'important');
        }
      });
    });
  }
})

const login = async () => {
  loginLoading.value = true
  loginError.value = ''
  try {
    const response = await $fetch('/api/auth/login', {
      method: 'POST',
      body: loginForm.value
    })

    console.log('[Booking Login] Response:', response)

    // Use accessToken from response
    const token = response.accessToken
    localStorage.setItem('auth_token', token)

    // Fetch complete user details after login
    const userResponse = await $fetch('/api/me', {
      headers: { Authorization: `Bearer ${token}` }
    })

    console.log('[Booking Login] User response:', userResponse)

    // Check if user is admin - redirect to admin panel
    // Only redirect confirmed admin roles (NOT generic role_id check which is too broad)
    const isAdmin = userResponse.role === 'super_admin' ||
      userResponse.role === 'admin_komsos' ||
      userResponse.role === 'admin_sekretariat'

    if (isAdmin) {
      console.log('[Booking Login] Admin user detected, redirecting to admin panel...')
      await navigateTo('/admin/bookings-new')
      return
    }

    user.value = userResponse
    isLoggedIn.value = true
    await Promise.all([
      loadData(),
      loadUserQuota(),
      loadWeeklySchedule()
    ])
  } catch (error) {
    console.error('[Booking Login] Error:', error)
    loginError.value = error.data?.statusMessage || 'Login gagal'
  } finally {
    loginLoading.value = false
  }
}

const logout = () => {
  localStorage.removeItem('auth_token')
  isLoggedIn.value = false
  user.value = {}
  rooms.value = []
  myBookings.value = []
}

const confirmCancelBooking = (bookingId) => {
  if (confirm('Apakah Anda yakin ingin membatalkan pemesanan ini?')) {
    cancelBooking(bookingId)
  }
}

const cancelBooking = async (bookingId) => {
  try {
    const token = localStorage.getItem('auth_token')
    await $fetch(`/api/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`
      }
    })

    // Remove from list optimistically
    myBookings.value = myBookings.value.filter(b => b.id !== bookingId)

    alert('Pemesanan berhasil dibatalkan')
  } catch (err) {
    console.error('Error canceling booking:', err)
    alert('Gagal membatalkan pemesanan. Silakan coba lagi.')
  }
}

const loadData = async () => {
  try {
    const token = localStorage.getItem('auth_token')

    console.log('[LOAD DATA] Fetching rooms and bookings...')

    const [roomsRes, bookingsRes] = await Promise.all([
      $fetch('/api/rooms'),
      $fetch('/api/bookings', {
        headers: { Authorization: `Bearer ${token}` }
      })
    ])

    rooms.value = roomsRes

    console.log('[LOAD DATA] API Response:', {
      success: bookingsRes.success,
      total: bookingsRes.data?.length || 0,
      hasAdminAccess: bookingsRes.meta?.has_admin_access
    })

    console.log('[LOAD DATA] Current user:', {
      id: user.value?.id,
      name: user.value?.full_name,
      email: user.value?.email
    })

    // Use data from API response
    if (bookingsRes.success && bookingsRes.data) {
      // Sort by latest first
      myBookings.value = bookingsRes.data.sort((a, b) => {
        return new Date(b.created_at || b.start_time) - new Date(a.created_at || a.start_time)
      })

      console.log('[LOAD DATA] Bookings loaded:', myBookings.value.length)

      // Log summary by status
      const statusSummary = myBookings.value.reduce((acc, b) => {
        acc[b.status] = (acc[b.status] || 0) + 1
        return acc
      }, {})
      console.log('[LOAD DATA] Status summary:', statusSummary)

      // Log first few bookings
      if (myBookings.value.length > 0) {
        console.log('[LOAD DATA] Sample bookings:', myBookings.value.slice(0, 3).map(b => ({
          id: b.id,
          event_name: b.event_name,
          status: b.status,
          is_own: b.is_own_booking,
          user_email: b.user_email
        })))
      }
    } else {
      console.error('[LOAD DATA] Invalid response format:', bookingsRes)
      myBookings.value = []
    }

    await loadRoomAvailability()
  } catch (error) {
    console.error('[LOAD DATA] Error:', error)
    myBookings.value = []
  }
}

const loadRoomAvailability = async () => {
  try {
    const params = selectedDate.value ? `?date=${selectedDate.value}` : ''
    const availabilityRes = await $fetch(`/api/rooms-availability${params}`)
    roomAvailability.value = availabilityRes.rooms
  } catch (error) {
    console.error('Failed to load room availability', error)
  }
}

const selectRoom = (room) => {
  selectedRoom.value = room
  // Reset form dan pesan error/sukses agar tidak terbawa dari ruangan sebelumnya
  bookingError.value = ''
  bookingMessage.value = ''
  bookingForm.value = { event_name: '', event_date: '', start_time: '', end_time: '' }
  // Reset slot availability check
  slotCheckResult.value = null
  slotChecking.value = false
  if (slotCheckTimer) {
    clearTimeout(slotCheckTimer)
    slotCheckTimer = null
  }
}

const createBooking = async () => {
  bookingLoading.value = true
  bookingMessage.value = ''
  bookingError.value = ''

  // Frontend validation
  const eventDate = new Date(bookingForm.value.event_date)
  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (eventDate < today) {
    bookingError.value = 'Tanggal acara tidak boleh di masa lalu'
    bookingLoading.value = false
    return
  }

  if (bookingForm.value.start_time >= bookingForm.value.end_time) {
    bookingError.value = 'Waktu selesai harus lebih besar dari waktu mulai'
    bookingLoading.value = false
    return
  }

  // Validasi durasi minimum 30 menit (Saran 4)
  const timeToMinutes = (t) => { const [h, m] = t.split(':'); return +h * 60 + +m }
  const startMinutes = timeToMinutes(bookingForm.value.start_time)
  const endMinutes = timeToMinutes(bookingForm.value.end_time)
  if (endMinutes - startMinutes < 30) {
    bookingError.value = 'Durasi pemesanan minimal 30 menit'
    bookingLoading.value = false
    return
  }

  // Validasi tidak boleh waktu yang sudah lewat hari ini (Saran 4)
  const isToday = bookingForm.value.event_date === getTodayDate()
  if (isToday) {
    const now = new Date()
    // Pastikan mengambil jam dan menit lokal, bukan UTC
    const nowMinutes = now.getHours() * 60 + now.getMinutes()
    if (startMinutes < nowMinutes) {
      bookingError.value = 'Waktu mulai tidak boleh di masa lalu'
      bookingLoading.value = false
      return
    }
  }

  try {
    // Combine date and time into DateTime objects
    const startDateTime = new Date(`${bookingForm.value.event_date}T${bookingForm.value.start_time}`)
    const endDateTime = new Date(`${bookingForm.value.event_date}T${bookingForm.value.end_time}`)

    const token = localStorage.getItem('auth_token')
    console.log('[CREATE BOOKING] Token exists:', !!token)
    console.log('[CREATE BOOKING] Request:', {
      event_name: bookingForm.value.event_name,
      start_time: startDateTime.toISOString(),
      end_time: endDateTime.toISOString(),
      room_id: selectedRoom.value.id
    })

    const response = await $fetch('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        event_name: bookingForm.value.event_name,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        room_id: selectedRoom.value.id
      }
    })
    bookingMessage.value = response.message

    // Refresh data immediately after successful booking
    await loadData()

    // Close modal and reset form after showing success message
    setTimeout(() => {
      selectedRoom.value = null
      bookingForm.value = { event_name: '', event_date: '', start_time: '', end_time: '' }
      bookingMessage.value = ''
    }, 2500)

  } catch (error) {
    bookingError.value = error.data?.statusMessage || 'Pemesanan gagal'
  } finally {
    bookingLoading.value = false
  }
}

const closeBookingModal = () => {
  selectedRoom.value = null
  bookingForm.value = { event_name: '', event_date: '', start_time: '', end_time: '' }
  bookingMessage.value = ''
  bookingError.value = ''
  // Reset slot check state
  slotCheckResult.value = null
  slotChecking.value = false
  if (slotCheckTimer) {
    clearTimeout(slotCheckTimer)
    slotCheckTimer = null
  }
}

const getStatusClass = (status) => {
  switch (status) {
    case 'APPROVED': return 'text-green-600'
    case 'PENDING': return 'text-yellow-600'
    case 'REJECTED': return 'text-red-600'
    case 'CANCELLED': return 'text-gray-600'
    default: return 'text-gray-600'
  }
}

// BUG FIX: Gunakan end_time (bukan start_time) untuk menentukan apakah acara sudah selesai.
// Sebelumnya menggunakan start_time sehingga status "Selesai" muncul saat acara masih berjalan.
const getStatusText = (status, startTime, endTime) => {
  const now = new Date()
  const eventEnd = endTime ? new Date(endTime) : new Date(startTime)

  if (status === 'APPROVED' && eventEnd < now) {
    return 'Selesai Digunakan'
  }

  switch (status) {
    case 'APPROVED': return 'Disetujui'
    case 'PENDING': return 'Menunggu Persetujuan'
    case 'REJECTED': return 'Ditolak'
    case 'CANCELLED': return 'Dibatalkan'
    default: return status
  }
}

const getAvailabilityStatusClass = (status) => {
  switch (status) {
    case 'Tersedia': return 'text-green-600'
    case 'Sedang Digunakan': return 'text-blue-600'
    case 'Sudah Dipesan': return 'text-yellow-600'
    case 'Menunggu Persetujuan': return 'text-orange-600'
    default: return 'text-gray-600'
  }
}

const getBookingStatusBadgeClass = (status) => {
  switch (status) {
    case 'APPROVED': return ' text-green-600'
    case 'PENDING': return ' text-orange-600'
    case 'REJECTED': return ' text-red-600'
    case 'CANCELLED': return ' text-gray-600'
    default: return ' text-gray-600'
  }
}

const getBookingStatusText = (status) => {
  switch (status) {
    case 'APPROVED': return 'Disetujui'
    case 'PENDING': return 'Menunggu'
    case 'REJECTED': return 'Ditolak'
    case 'CANCELLED': return 'Dibatalkan'
    default: return status
  }
}

const formatBookingTime = (startTime, endTime) => {
  const start = new Date(startTime)
  const end = new Date(endTime)

  const dateOptions = {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    timeZone: 'Asia/Jakarta'
  }

  const timeOptions = {
    hour: '2-digit',
    minute: '2-digit',
    timeZone: 'Asia/Jakarta'
  }

  const dateStr = start.toLocaleDateString('id-ID', dateOptions)
  const startTimeStr = start.toLocaleTimeString('id-ID', timeOptions).replace('.', ':')
  const endTimeStr = end.toLocaleTimeString('id-ID', timeOptions).replace('.', ':')

  return `${dateStr} (${startTimeStr} - ${endTimeStr})`
}

// Navigate date by days offset (-1 = kemarin, +1 = besok)
const navigateDate = (offset) => {
  const current = selectedDate.value
    ? new Date(selectedDate.value + 'T00:00:00')
    : new Date()

  current.setDate(current.getDate() + offset)

  const year = current.getFullYear()
  const month = String(current.getMonth() + 1).padStart(2, '0')
  const day = String(current.getDate()).padStart(2, '0')

  selectedDate.value = `${year}-${month}-${day}`
  loadRoomAvailability()
}
</script>

<style scoped>
/* Modal animations */
.fixed {
  animation: fadeIn 0.2s ease-out;
}

/* Unified fadeIn: fade in with slight upward movement */
@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.fixed>div {
  animation: slideUp 0.3s ease-out;
}

/* slideUp: used for modal inner panel and mobile cards */
@keyframes slideUp {
  from {
    opacity: 0;
    transform: translateY(20px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

.animate-fade-in {
  animation: fadeIn 0.3s ease-out;
}

/* Mobile card animations */
.mobile-cards-only>* {
  animation: slideUp 0.4s ease-out backwards;
}

.mobile-cards-only>*:nth-child(1) {
  animation-delay: 0.1s;
}

.mobile-cards-only>*:nth-child(2) {
  animation-delay: 0.2s;
}

.mobile-cards-only>*:nth-child(3) {
  animation-delay: 0.3s;
}

.mobile-cards-only>*:nth-child(4) {
  animation-delay: 0.4s;
}

.mobile-cards-only>*:nth-child(5) {
  animation-delay: 0.5s;
}

/* Global box-sizing */
*,
*::before,
*::after {
  box-sizing: border-box !important;
}

/* Force hide horizontal scroll on ALL devices first */
body,
html {
  overflow-x: hidden !important;
  max-width: 100vw !important;
  width: 100% !important;
}

/* Mobile specific overrides */
@media (max-width: 767px) {

  /* FORCE HIDE TABLE ON MOBILE - NO EXCEPTIONS */
  .table-desktop-only,
  .table-desktop-only *,
  .md\:block {
    display: none !important;
    visibility: hidden !important;
    height: 0 !important;
    width: 0 !important;
    overflow: hidden !important;
  }

  /* Ensure mobile cards are visible and full width */
  .mobile-cards-only,
  .md\:hidden {
    display: block !important;
    visibility: visible !important;
    width: 100% !important;
  }

  /* Prevent any element from exceeding viewport */
  *:not(svg):not(path) {
    max-width: 100vw !important;
  }

  /* Force all containers */
  div,
  section,
  table,
  td,
  th {
    max-width: 100% !important;
    overflow-x: hidden !important;
  }
}

/* Card hover effects */
.hover\:shadow-md {
  transition: all 0.3s ease;
}

/* Smooth transitions */
* {
  transition-property: background-color, border-color, color, fill, stroke, opacity, box-shadow, transform;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
}
</style>
