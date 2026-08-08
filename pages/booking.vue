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
                    <p class="text-xs text-gray-400 leading-none">Pemakaian Bulan Ini</p>
                    <p class="text-sm font-medium mt-0.5"
                      :class="userQuota && !userQuota.is_unlimited && userQuota.monthly_count >= userQuota.max_allowed
                        ? 'text-red-600 font-bold'
                        : userQuota && userQuota.is_unlimited ? 'text-green-600' : 'text-gray-800'">
                      <template v-if="!userQuota">–</template>
                      <template v-else-if="userQuota.is_unlimited">
                        Pemakaian: {{ userQuota.monthly_count }} <span class="text-xs font-normal">(Unlimited ∞)</span>
                      </template>
                      <template v-else>Pemakaian: {{ userQuota.monthly_count }} / {{ userQuota.max_allowed }}</template>
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
                <h3 class="text-lg font-semibold text-blue-900 mb-3">Cara & Panduan Pemesanan Ruangan</h3>
                <ol class="space-y-2.5 text-blue-800 text-sm">
                  <li class="flex items-start">
                    <span class="font-bold mr-2">1.</span>
                    <span><strong>Pilih Ruangan:</strong> Klik tombol "Pesan" pada ruangan yang tersedia di bawah</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">2.</span>
                    <span><strong>Isi Detail:</strong> Masukkan nama acara, tanggal, jam mulai, dan jam selesai.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">3.</span>
                    <span><strong>Pemesanan Berulang (Rutin):</strong> Untuk kegiatan rutin (misal rapat mingguan), centang <em>"Pemesanan Berulang"</em> dan pilih frekuensi (Mingguan, 2-Mingguan, atau Bulanan) serta batas tanggal pengulangan.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">4.</span>
                    <span><strong>Konfirmasi:</strong> Klik <em>"Konfirmasi Pemesanan"</em> setelah seluruh data terisi dengan benar.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">5.</span>
                    <span><strong>Notifikasi In-App & Email:</strong> Perubahan status pemesanan (<span class="font-semibold text-green-700">DISETUJUI</span> / <span class="font-semibold text-red-700">DITOLAK</span> / <span class="font-semibold text-gray-700">DIBATALKAN</span>) akan dikirimkan otomatis ke <strong>Email Akun Anda</strong> serta muncul di <strong>Ikon Lonceng Notifikasi (Bell)</strong> pada Navbar atas.</span>
                  </li>
                  <li class="flex items-start">
                    <span class="font-bold mr-2">6.</span>
                    <span><strong>Batalkan (Wajib Alasan):</strong> Anda dapat membatalkan pemesanan PENDING dengan menekan tombol <em>"Batalkan"</em> dan mengisi alasan pembatalan pada form konfirmasi. Konfirmasi pembatalan juga akan dikirimkan via email.</span>
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
                    <strong>Tips:</strong> Cek kotak masuk Email Anda atau pantau notifikasi lonceng di Navbar atas. Status pemesanan akan
                    berubah menjadi
                    <span
                      class="inline-block px-2 py-0.5 bg-green-100 text-green-800 rounded text-xs font-semibold">DISETUJUI</span>
                    atau
                    <span
                      class="inline-block px-2 py-0.5 bg-red-100 text-red-800 rounded text-xs font-semibold">DITOLAK</span>
                    setelah ditinjau oleh admin sekretariat paroki.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <!-- ── Kalender Mingguan ──────────────────────────────────────────── -->
          <div class="bg-white rounded-2xl border border-gray-200 shadow-sm p-4 sm:p-6 mb-10">
            <!-- Header & Week Controls -->
            <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-5 pb-4 border-b border-gray-100">
              <div>
                <div class="flex items-center gap-2">
                  <span class="text-2xl">🗓️</span>
                  <h2 class="text-xl sm:text-2xl font-cinzel font-bold text-gray-900">Jadwal Mingguan Ruangan</h2>
                </div>
                <p class="text-xs sm:text-sm text-gray-500 mt-1">Cek jadwal pemakaian dan ketersediaan ruangan setiap hari</p>
              </div>

              <!-- Week Navigation Bar -->
              <div class="flex items-center justify-between sm:justify-end gap-1.5 sm:gap-2 bg-gray-50 p-1.5 rounded-xl border border-gray-200">
                <button @click="navigateWeek(-1)"
                  class="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-[#882f1d] hover:text-white hover:border-[#882f1d] transition-all shadow-xs active:scale-95"
                  title="Minggu sebelumnya">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M15 19l-7-7 7-7" />
                  </svg>
                </button>
                <span class="text-xs sm:text-sm font-semibold text-gray-800 px-2 text-center whitespace-nowrap">
                  {{ weeklyData ? `${formatShortDate(weeklyData.week_start)} – ${formatShortDate(weeklyData.week_end)}` : 'Memuat...' }}
                </span>
                <button @click="navigateWeek(1)"
                  class="p-2 rounded-lg bg-white border border-gray-200 text-gray-700 hover:bg-[#882f1d] hover:text-white hover:border-[#882f1d] transition-all shadow-xs active:scale-95"
                  title="Minggu depan">
                  <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
                <button @click="navigateWeek(0)"
                  class="text-xs font-semibold px-3 py-2 rounded-lg bg-[#882f1d] text-white hover:bg-[#6b2416] transition-all shadow-xs active:scale-95 ml-1 whitespace-nowrap">
                  Minggu Ini
                </button>
              </div>
            </div>

            <!-- Loading -->
            <div v-if="weeklyLoading" class="flex items-center justify-center py-12 text-gray-500 gap-3">
              <svg class="w-6 h-6 animate-spin text-[#882f1d]" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
              </svg>
              <span class="text-sm font-medium">Memuat jadwal mingguan...</span>
            </div>

            <!-- Calendar Grid (Desktop Tablet LG) -->
            <div v-if="weeklyData" class="overflow-x-auto rounded-xl border border-gray-200 hidden md:block">
              <table class="w-full text-xs border-collapse">
                <thead>
                  <tr class="bg-gray-50">
                    <th class="text-left px-3 py-3 text-gray-600 font-semibold border-b border-gray-200 min-w-[130px]">Ruangan</th>
                    <th v-for="day in weeklyData.days" :key="day"
                      class="px-2 py-3 text-center font-semibold border-b border-gray-200 min-w-[105px]"
                      :class="isToday(day) ? 'bg-amber-50 text-[#882f1d]' : 'text-gray-700'">
                      <div class="uppercase tracking-wider text-[11px] font-bold">{{ getDayName(day) }}</div>
                      <div class="text-xs font-medium" :class="isToday(day) ? 'text-[#882f1d]' : 'text-gray-500'">{{ formatShortDate(day) }}</div>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr v-for="room in weeklyData.rooms" :key="room.id" class="border-b border-gray-100 hover:bg-gray-50/60 transition-colors">
                    <td class="px-3 py-2.5 font-medium text-gray-800 align-top">
                      <div class="font-bold text-gray-900">{{ room.name }}</div>
                      <div class="text-[11px] text-gray-400">📍 {{ room.location }}</div>
                    </td>
                    <td v-for="day in weeklyData.days" :key="day"
                      class="px-1.5 py-1.5 align-top border-l border-gray-100"
                      :class="isToday(day) ? 'bg-amber-50/20' : ''">
                      <div class="space-y-1.5">
                        <div v-for="b in getBookingsForCell(room.id, day)" :key="b.id"
                          :class="b.status === 'APPROVED' ? 'bg-emerald-50 border-emerald-300 text-emerald-900' : 'bg-amber-50 border-amber-300 text-amber-900'"
                          class="border rounded-lg p-1.5 shadow-2xs"
                          :title="`${b.event_name} — ${b.requester_name} (${b.start_formatted}–${b.end_formatted})`">
                          <div class="font-bold text-[11px] leading-tight break-words">{{ b.event_name }}</div>
                          <div class="text-[10px] opacity-80 mt-0.5 font-medium">⏰ {{ b.start_formatted }}–{{ b.end_formatted }}</div>
                          <div class="text-[9px] text-gray-500 truncate">👤 {{ b.requester_name }}</div>
                        </div>
                        <div v-if="getBookingsForCell(room.id, day).length === 0"
                          class="text-gray-300 text-center py-2 text-xs">—</div>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <!-- Mobile View: 7-Day Grid & Responsive Day Cards -->
            <div v-if="weeklyData" class="md:hidden space-y-4">
              <!-- 7-Day Interactive Grid Selector -->
              <div class="grid grid-cols-7 gap-1 sm:gap-1.5">
                <button
                  v-for="day in weeklyData.days"
                  :key="day"
                  @click="selectedMobileDay = day"
                  :class="[
                    selectedMobileDay === day
                      ? 'bg-gradient-to-b from-[#882f1d] to-[#6b2416] text-white shadow-md ring-2 ring-[#882f1d]/30 font-bold scale-[1.02]'
                      : isToday(day)
                        ? 'bg-amber-50 text-[#882f1d] border-2 border-[#882f1d]/40 font-semibold hover:bg-amber-100'
                        : 'bg-gray-50 text-gray-700 hover:bg-gray-100 border border-gray-200'
                  ]"
                  class="flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all text-center relative group min-h-[58px]"
                >
                  <!-- Day Name (e.g. SEN, SEL) -->
                  <span class="text-[10px] uppercase font-medium tracking-tight"
                    :class="selectedMobileDay === day ? 'text-white/90' : 'text-gray-500'">
                    {{ getDayName(day) }}
                  </span>

                  <!-- Date Number (e.g. 10, 11) -->
                  <span class="text-sm font-bold leading-tight my-0.5">
                    {{ formatShortDate(day).split(' ')[0] }}
                  </span>

                  <!-- Booking Indicator Dot -->
                  <div class="flex items-center justify-center gap-0.5 mt-0.5">
                    <span v-if="getDayBookingCount(day) > 0"
                      :class="selectedMobileDay === day ? 'bg-amber-300' : 'bg-[#882f1d]'"
                      class="w-1.5 h-1.5 rounded-full inline-block"></span>
                    <span v-else class="w-1.5 h-1.5 rounded-full inline-block opacity-0"></span>
                  </div>
                </button>
              </div>

              <!-- Active Day Status Banner -->
              <div class="bg-gradient-to-r from-gray-50 to-amber-50/30 border border-gray-200 rounded-xl p-3.5 flex items-center justify-between gap-2">
                <div class="flex items-center gap-2.5">
                  <div class="w-2.5 h-2.5 rounded-full bg-[#882f1d] ring-4 ring-[#882f1d]/20 shrink-0"></div>
                  <div>
                    <h3 class="font-bold text-gray-900 text-sm">
                      {{ formatFullDate(selectedMobileDay) }}
                    </h3>
                    <p class="text-xs text-gray-500">
                      {{ getDayBookingCount(selectedMobileDay) > 0 
                        ? `${getDayBookingCount(selectedMobileDay)} agenda pemesanan terjadwal` 
                        : 'Semua ruangan bebas dipesan' }}
                    </p>
                  </div>
                </div>
                <span v-if="isToday(selectedMobileDay)" 
                  class="text-[10px] font-bold px-2.5 py-1 bg-amber-100 text-[#882f1d] rounded-full border border-amber-300 shrink-0 shadow-2xs">
                  HARI INI
                </span>
              </div>

              <!-- Room Schedule Cards for Selected Day -->
              <div class="space-y-3">
                <template v-for="room in weeklyData.rooms" :key="room.id">
                  <div v-if="getBookingsForCell(room.id, selectedMobileDay).length > 0"
                    class="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs hover:shadow-md transition-shadow">
                    <!-- Room Header -->
                    <div class="bg-gradient-to-r from-gray-50 to-white px-4 py-2.5 border-b border-gray-100 flex items-center justify-between">
                      <div class="flex items-center gap-2">
                        <span class="text-base">🏢</span>
                        <span class="font-bold text-gray-800 text-sm">{{ room.name }}</span>
                      </div>
                      <span class="text-xs text-gray-600 bg-white px-2.5 py-0.5 rounded-full border border-gray-200 shadow-2xs font-medium">
                        📍 {{ room.location }}
                      </span>
                    </div>

                    <!-- Room Bookings -->
                    <div class="p-3 space-y-2.5">
                      <div v-for="b in getBookingsForCell(room.id, selectedMobileDay)" :key="b.id"
                        :class="b.status === 'APPROVED' ? 'bg-emerald-50/80 border-emerald-200' : 'bg-amber-50/80 border-amber-200'"
                        class="p-3 rounded-xl border flex flex-col gap-2">
                        <div class="flex items-start justify-between gap-2">
                          <span class="font-bold text-gray-900 text-sm leading-snug break-words flex-1">{{ b.event_name }}</span>
                          <span :class="b.status === 'APPROVED' ? 'bg-emerald-100 text-emerald-800 border-emerald-300' : 'bg-amber-100 text-amber-800 border-amber-300'"
                            class="px-2.5 py-0.5 rounded-full text-[10px] font-bold border shrink-0">
                            {{ b.status === 'APPROVED' ? '✓ DISETUJUI' : '⏳ MENUNGGU' }}
                          </span>
                        </div>
                        <div class="flex flex-wrap items-center justify-between text-xs text-gray-600 pt-2 border-t border-black/5 gap-2">
                          <span class="flex items-center gap-1.5 text-gray-700 font-medium">
                            <svg class="w-3.5 h-3.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                            {{ b.requester_name }}
                          </span>
                          <span class="font-bold text-gray-800 bg-white px-2.5 py-1 rounded-lg border border-gray-200 shadow-2xs">
                            ⏰ {{ b.start_formatted }} – {{ b.end_formatted }} WIB
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </template>

                <!-- Empty State for Selected Day -->
                <div v-if="weeklyData.rooms && !weeklyData.rooms.some(r => getBookingsForCell(r.id, selectedMobileDay).length > 0)"
                  class="bg-gradient-to-b from-gray-50/50 to-emerald-50/30 rounded-2xl border border-dashed border-gray-300 p-6 sm:p-8 text-center">
                  <div class="w-12 h-12 rounded-full bg-emerald-100/80 text-emerald-700 flex items-center justify-center mx-auto mb-3">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <h4 class="text-sm sm:text-base font-bold text-gray-800">Tidak ada pemesanan ruangan pada hari ini</h4>
                  <p class="text-xs text-gray-500 mt-1 max-w-sm mx-auto">Semua ruangan kosong dan bebas untuk diajukan pemesanan.</p>
                </div>
              </div>
            </div>

            <!-- Legend -->
            <div class="flex items-center gap-4 mt-5 pt-3 border-t border-gray-100 text-xs text-gray-500">
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-emerald-400 inline-block"></span> Disetujui
              </div>
              <div class="flex items-center gap-1.5">
                <span class="w-3 h-3 rounded-full bg-amber-400 inline-block"></span> Menunggu
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
          <div class="mb-8 w-full overflow-x-hidden scroll-mt-28" id="katalog-ruangan">
            <h2 class="text-2xl font-cinzel font-semibold text-[#882f1d] mb-6">Ruangan Tersedia</h2>
            <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
              <div v-for="room in rooms" :key="room.id"
                class="bg-white rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 p-6 border border-gray-100 w-full max-w-full overflow-hidden">
                <!-- Room Name & Status Badge -->
                <div class="flex items-start justify-between mb-3">
                  <h3 class="text-2xl font-bold text-gray-900">{{ room.name }}</h3>
                  <span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 flex-shrink-0 ml-2">
                    <span class="w-2 h-2 mr-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                    Siap Dipesan
                  </span>
                </div>

                <!-- Dedicated Room Badge -->
                <div v-if="room.is_dedicated" class="mb-4 px-3 py-1.5 bg-amber-50 border border-amber-300 rounded-xl flex items-center gap-1.5 text-xs text-amber-900 font-semibold shadow-xs">
                  <span class="text-sm">🔒</span>
                  <span>Khusus Permanen: {{ room.dedicated_to ? room.dedicated_to : 'Seksi / Kelompok' }}</span>
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
            class="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 transition-all duration-300 overflow-y-auto">
            <div
              class="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto pointer-events-auto border border-gray-100 transform transition-all animate-fadeIn my-auto"
              @click.stop>
              <!-- Modal Header -->
              <div class="p-6 border-b border-gray-200 bg-gray-50/50 sticky top-0 bg-white z-10">
                <div class="flex justify-between items-start">
                  <div>
                    <h2 class="text-2xl font-cinzel font-bold text-gray-800">Pesan Ruangan</h2>
                    <p class="text-sm text-gray-600 mt-1 flex items-center gap-2 flex-wrap">
                      <span class="font-semibold text-gray-900">{{ selectedRoom.name }}</span>
                      <span>•</span>
                      <span>{{ selectedRoom.capacity }} orang</span>
                      <span>•</span>
                      <span class="text-[#882f1d] font-medium">{{ selectedRoom.location }}</span>
                    </p>

                    <!-- User Quota Badge -->
                    <div class="mt-2.5 flex items-center gap-2 flex-wrap">
                      <span v-if="userQuota?.is_unlimited"
                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
                        <svg class="w-3.5 h-3.5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"/>
                        </svg>
                        Dewan Paroki / BGKP — Kuota Tanpa Batas
                      </span>
                      <span v-else-if="userQuota"
                            :class="userQuota.remaining > 0 ? 'bg-blue-50 text-blue-800 border-blue-200' : 'bg-amber-50 text-amber-800 border-amber-200'"
                            class="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold border">
                        <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 7h.01M7 11h.01M7 15h.01M13 7h.01M13 11h.01M13 15h.01M19 7h.01M19 11h.01M19 15h.01M4 21h16a2 2 0 002-2V5a2 2 0 00-2-2H4a2 2 0 00-2 2v14a2 2 0 002 2z"/>
                        </svg>
                        Sisa Kuota Anda: {{ userQuota.remaining }} dari {{ userQuota.max_allowed }} pemesanan (Bulan Ini)
                      </span>
                    </div>

                    <!-- Facilities & Description Summary -->
                    <div v-if="selectedRoom.facilities || selectedRoom.description" class="mt-2.5 text-xs text-gray-500 bg-white p-2.5 rounded-lg border border-gray-200 space-y-1">
                      <p v-if="selectedRoom.facilities" class="flex items-center gap-1.5">
                        <strong class="text-gray-700 font-semibold">📍 Fasilitas:</strong>
                        <span>{{ parseFacilities(selectedRoom.facilities).join(', ') }}</span>
                      </p>
                      <p v-if="selectedRoom.description" class="flex items-center gap-1.5 text-amber-700">
                        <strong class="font-semibold">⚠️ Tata Tertib:</strong>
                        <span>{{ selectedRoom.description }}</span>
                      </p>
                    </div>

                    <!-- Dedicated Room Notice -->
                    <div v-if="selectedRoom.is_dedicated" class="mt-2.5 p-2.5 bg-amber-100/90 border border-amber-300 rounded-lg text-xs text-amber-950 font-medium flex items-start gap-1.5">
                      <span class="text-base leading-none">🔒</span>
                      <div>
                        <strong class="font-bold">Ruangan Hak Pakai Permanen: {{ selectedRoom.dedicated_to || 'Seksi / Kelompok' }}</strong>
                        <p class="text-[11px] opacity-90 mt-0.5">Pemesanan oleh pihak luar memerlukan persetujuan khusus dari Sekretariat / Admin.</p>
                      </div>
                    </div>
                  </div>

                  <button @click="closeBookingModal" class="text-gray-400 hover:text-gray-600 transition-colors p-1">
                    <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <form @submit.prevent="createBooking" class="p-6 space-y-5">
                <div>
                  <label class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                    <span>Nama Acara *</span>
                  </label>
                  <input v-model="bookingForm.event_name" type="text"
                    placeholder="Contoh: Rapat Komisi, Pertemuan Kelompok, Gladi Misa"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all outline-none"
                    required />
                </div>

                <div>
                  <label class="flex items-center gap-1.5 text-sm font-semibold text-gray-700 mb-1.5">
                    <span>Tanggal Acara *</span>
                  </label>
                  <input v-model="bookingForm.event_date" type="date" :min="getTodayDate()"
                    class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all outline-none"
                    required />
                </div>

                <div>
                  <div class="grid grid-cols-2 gap-4">
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1.5">Waktu Mulai *</label>
                      <input v-model="bookingForm.start_time" type="time"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all outline-none"
                        required />
                    </div>
                    <div>
                      <label class="block text-sm font-semibold text-gray-700 mb-1.5">Waktu Selesai *</label>
                      <input v-model="bookingForm.end_time" type="time"
                        class="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#882f1d] focus:border-transparent transition-all outline-none"
                        required />
                    </div>
                  </div>

                  <!-- Presets Cepat Durasi & Sesi Waktu -->
                  <div class="mt-2.5 flex items-center gap-1.5 flex-wrap">
                    <span class="text-xs font-semibold text-gray-500 mr-1">⚡ Preset Cepat:</span>
                    <button type="button" @click="applyTimePreset(1)" 
                            class="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors border border-gray-200">
                      +1 Jam
                    </button>
                    <button type="button" @click="applyTimePreset(2)" 
                            class="px-2.5 py-1 text-xs font-medium bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-md transition-colors border border-gray-200">
                      +2 Jam
                    </button>
                    <button type="button" @click="applySessionPreset('09:00', '12:00')" 
                            class="px-2.5 py-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200">
                      Pagi (09:00–12:00)
                    </button>
                    <button type="button" @click="applySessionPreset('13:00', '16:00')" 
                            class="px-2.5 py-1 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 rounded-md transition-colors border border-blue-200">
                      Siang (13:00–16:00)
                    </button>
                    <button type="button" @click="applySessionPreset('19:00', '21:00')" 
                            class="px-2.5 py-1 text-xs font-medium bg-purple-50 hover:bg-purple-100 text-purple-700 rounded-md transition-colors border border-purple-200">
                      Malam (19:00–21:00)
                    </button>
                  </div>
                </div>

                <!-- Opsi Pemesanan Berulang (Recurring Booking) -->
                <div class="border-t border-gray-200 pt-4">
                  <label class="flex items-center gap-2 text-sm font-semibold text-gray-800 cursor-pointer">
                    <input v-model="bookingForm.is_recurring" type="checkbox" class="w-4 h-4 text-[#882f1d] rounded border-gray-300 focus:ring-[#882f1d]" />
                    <span>Pemesanan Berulang / Rutin (Recurring)</span>
                  </label>

                  <div v-if="bookingForm.is_recurring" class="mt-3 p-4 bg-amber-50/80 border border-amber-200 rounded-xl space-y-3">
                    <div class="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Frekuensi Pengulangan</label>
                        <select v-model="bookingForm.recurrence_pattern" class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-[#882f1d] outline-none bg-white">
                          <option value="WEEKLY">Mingguan (Setiap minggu)</option>
                          <option value="BIWEEKLY">2 Mingguan (Setiap 2 minggu)</option>
                          <option value="MONTHLY">Bulanan (Setiap bulan)</option>
                        </select>
                      </div>
                      <div>
                        <label class="block text-xs font-semibold text-gray-700 mb-1">Ulangi Sampai Tanggal (Maks 90 Hari)</label>
                        <input v-model="bookingForm.repeat_until" type="date" :min="bookingForm.event_date" class="w-full p-2.5 text-sm border border-gray-300 rounded-lg focus:ring-[#882f1d] outline-none bg-white" />
                      </div>
                    </div>

                    <!-- Live Recurring Summary Dates Preview -->
                    <div v-if="recurringSummaryDates.length > 0" class="mt-2 pt-2 border-t border-amber-200/60">
                      <p class="text-xs font-bold text-amber-900 mb-1.5 flex items-center gap-1">
                        <span>ℹ️ Perkiraan {{ recurringSummaryDates.length }} jadwal yang akan dipesan:</span>
                      </p>
                      <div class="flex flex-wrap gap-1">
                        <span v-for="(dt, dIdx) in recurringSummaryDates" :key="dIdx"
                              class="inline-block bg-white text-amber-900 border border-amber-300 text-[11px] font-medium px-2 py-0.5 rounded-md">
                          {{ dt.toLocaleDateString('id-ID', { weekday: 'short', day: 'numeric', month: 'short' }) }}
                        </span>
                      </div>
                    </div>
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

                <!-- ── Quota Exhausted Alert Card ────────────────────── -->
                <div v-if="hasQuotaExhausted" class="px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-900 flex items-start gap-2.5">
                  <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p class="font-bold text-amber-900">Kuota Pemesanan Bulan Ini Habis ({{ userQuota.monthly_count }}/{{ userQuota.max_allowed }})</p>
                    <p class="text-xs text-amber-800 mt-0.5">Kategori Anda dibatasi maksimal {{ userQuota.max_allowed }} pemesanan per bulan kalender. Pemesanan baru tidak dapat dibuat untuk bulan ini.</p>
                  </div>
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
                  <svg class="w-5 h-5 flex-shrink-0 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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

                <!-- Admin Notice Box -->
                <div v-if="isCurrentUserAdmin"
                  class="flex items-start gap-3 px-4 py-3 bg-amber-50 border border-amber-300 rounded-lg text-sm text-amber-900">
                  <svg class="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p class="font-bold text-amber-900">Akses Admin Terdeteksi</p>
                    <p class="text-xs text-amber-800 mt-0.5">Admin tidak dapat membuat booking melalui halaman publik. Gunakan <strong>Admin Panel</strong> untuk membuat dan mengelola pemesanan ruangan.</p>
                    <NuxtLink to="/admin/bookings-new" class="inline-flex items-center gap-1.5 mt-2 text-xs font-semibold text-amber-900 hover:text-amber-700 underline">
                      <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                      </svg>
                      Buka Admin Panel Pemesanan
                    </NuxtLink>
                  </div>
                </div>

                <div class="flex gap-3 pt-2">
                  <button type="submit" :disabled="bookingLoading || slotChecking || hasHardConflict || hasQuotaExhausted || isCurrentUserAdmin"
                    :title="isCurrentUserAdmin ? 'Admin harus menggunakan Admin Panel untuk booking' : (hasQuotaExhausted ? 'Kuota pemesanan Anda bulan ini sudah habis' : (hasHardConflict ? 'Waktu ini sudah dipesan. Pilih waktu lain.' : ''))"
                    class="flex-1 bg-[#882f1d] text-white px-6 py-3 rounded-lg hover:bg-[#6b2416] disabled:opacity-50 disabled:cursor-not-allowed font-medium transition-all flex items-center justify-center gap-2">
                    <svg v-if="bookingLoading" class="w-4 h-4 animate-spin text-white" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                      <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                    </svg>
                    <span>{{ isCurrentUserAdmin ? 'Gunakan Admin Panel untuk Booking' : (bookingLoading ? 'Memproses...' : 'Konfirmasi Pemesanan') }}</span>
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
          <div class="mb-12 w-full overflow-x-hidden scroll-mt-28" id="pemesanan-saya">
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
                    <h3 class="font-bold text-base sm:text-lg text-gray-800 flex-1 mr-2 leading-snug break-words">{{ booking.event_name }}</h3>
                    <div class="flex flex-col gap-1 items-end shrink-0">
                      <span :class="getStatusBadgeClass(booking.status)"
                        class="px-2.5 py-1 rounded-full text-xs font-semibold">
                        {{ getStatusText(booking.status, booking.start_time, booking.end_time) }}
                      </span>
                      <!-- Badge SELESAI untuk booking yang sudah lewat -->
                      <span v-if="isBookingPassed(booking.end_time) && showHistory"
                        class="px-2.5 py-1 rounded-full text-xs font-semibold bg-gray-400 text-white">
                        SELESAI
                      </span>
                      <!-- Badge Pemesanan Berulang / Rutin -->
                      <span v-if="booking.recurrence_pattern"
                        class="px-2 py-0.5 rounded-full text-[11px] font-medium bg-purple-100 text-purple-800 flex items-center gap-1">
                        <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        {{ getRecurrenceLabel(booking.recurrence_pattern) }}
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

                <!-- Info Pemesanan Berulang / Rutin -->
                <div v-if="selectedBookingDetail.recurrence_pattern || selectedBookingDetail.parent_booking_id">
                  <label class="text-sm font-semibold text-purple-800 uppercase tracking-wide">Tipe Pemesanan</label>
                  <div class="mt-1 bg-purple-50 border border-purple-200 rounded-lg p-3 flex items-center justify-between">
                    <div class="flex items-center text-purple-900 text-sm font-medium">
                      <svg class="w-4 h-4 mr-2 text-purple-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                      </svg>
                      <span>{{ getRecurrenceLabel(selectedBookingDetail.recurrence_pattern) }}</span>
                    </div>
                    <span class="text-xs text-purple-700 bg-purple-100 px-2 py-0.5 rounded font-semibold">
                      {{ selectedBookingDetail.parent_booking_id ? 'Jadwal Seri' : 'Jadwal Utama' }}
                    </span>
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
          <!-- Modal Konfirmasi Pembatalan dengan Alasan Wajib -->
          <div v-if="cancelBookingId" class="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" @click="cancelBookingId = null">
            <div class="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl" @click.stop>
              <h3 class="text-xl font-bold text-gray-900 mb-2">Konfirmasi Pembatalan</h3>
              <p class="text-sm text-gray-600 mb-4">
                Apakah Anda yakin ingin membatalkan pemesanan ini? Mohon berikan alasan pembatalan untuk kebutuhan evaluasi pengurus paroki.
              </p>

              <div class="mb-4">
                <label class="block text-xs font-bold text-gray-700 uppercase mb-1">Alasan Pembatalan *</label>
                <textarea v-model="cancellationReasonInput" rows="3" placeholder="Tuliskan alasan pembatalan (minimal 5 karakter)..."
                  class="w-full p-3 border border-gray-300 rounded-xl text-sm focus:ring-2 focus:ring-[#882f1d] focus:border-transparent"></textarea>
                <p v-if="cancelError" class="text-xs text-red-600 mt-1.5 font-medium">{{ cancelError }}</p>
              </div>

              <div class="flex items-center justify-end gap-2">
                <button @click="cancelBookingId = null" type="button" class="px-4 py-2 text-sm font-semibold text-gray-600 hover:bg-gray-100 rounded-xl transition-colors">
                  Batal
                </button>
                <button @click="submitCancellation" :disabled="cancelLoading || !cancellationReasonInput || cancellationReasonInput.trim().length < 5"
                  type="button" class="px-4 py-2 text-sm font-semibold text-white bg-red-600 hover:bg-red-700 disabled:opacity-50 rounded-xl transition-colors flex items-center gap-2">
                  <svg v-if="cancelLoading" class="w-4 h-4 animate-spin" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"/>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"/>
                  </svg>
                  <span>Ya, Batalkan Pemesanan</span>
                </button>
              </div>
            </div>
          </div>

          <!-- Room Availability Table -->
          <div class="w-full max-w-full overflow-x-hidden">
            <h2 class="text-xl sm:text-2xl font-cinzel font-semibold text-[#882f1d] mb-4 break-words">Peta Pemesanan Ruangan</h2>

            <!-- Date Selector -->
            <div class="mb-5 w-full">
              <label class="block text-xs sm:text-sm font-medium text-gray-700 mb-2">Pilih Tanggal</label>
              
              <!-- Mobile Layout (< sm): 2 Rows -->
              <div class="sm:hidden space-y-2 w-full">
                <!-- Date Input Full Width -->
                <input v-model="selectedDate" type="date" @change="loadRoomAvailability"
                  class="w-full p-2.5 border rounded-xl text-sm font-semibold text-center text-gray-800 bg-white border-gray-300 focus:ring-2 focus:ring-[#882f1d] shadow-2xs" />
                
                <!-- Prev / Next Navigation Buttons 50/50 -->
                <div class="grid grid-cols-2 gap-2 w-full">
                  <button @click="navigateDate(-1)"
                    class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 active:bg-gray-100 transition-colors text-xs font-semibold shadow-2xs"
                    title="Hari sebelumnya">
                    <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                    </svg>
                    <span>Kemarin</span>
                  </button>
                  <button @click="navigateDate(1)"
                    class="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 active:bg-gray-100 transition-colors text-xs font-semibold shadow-2xs"
                    title="Hari berikutnya">
                    <span>Besok</span>
                    <svg class="w-4 h-4 text-gray-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
              </div>

              <!-- Desktop / Tablet Layout (>= sm): Single Row -->
              <div class="hidden sm:flex items-center gap-2 w-full">
                <button @click="navigateDate(-1)"
                  class="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex-shrink-0"
                  title="Hari sebelumnya">
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                  </svg>
                  <span>Kemarin</span>
                </button>
                <input v-model="selectedDate" type="date" @change="loadRoomAvailability"
                  class="p-2 border rounded-xl text-sm font-semibold text-center text-gray-800 bg-white border-gray-300 flex-1 focus:ring-2 focus:ring-[#882f1d]" />
                <button @click="navigateDate(1)"
                  class="flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 transition-colors text-sm font-medium flex-shrink-0"
                  title="Hari berikutnya">
                  <span>Besok</span>
                  <svg class="w-4 h-4 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>

            <!-- Mobile View: Card Layout -->
            <div class="md:hidden space-y-4 mb-6 w-full max-w-full overflow-x-hidden mobile-cards-only">
              <div v-for="room in roomAvailability" :key="room.id"
                class="bg-white border-2 border-gray-200 rounded-2xl p-4 sm:p-5 shadow-md hover:shadow-xl hover:border-[#882f1d]/30 transition-all duration-300 w-full max-w-full overflow-hidden">
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
// RBAC Guard: Hanya role 'user' biasa yang boleh mengakses halaman booking.
// Admin group diarahkan ke /admin/dashboard, kontributor ke /kontributor.
definePageMeta({
  middleware: 'user-auth'
})

const { isMaintenance } = useMaintenance('booking')
const {
  toUtcDate,
  formatWibDate,
  formatWibTime,
  formatWibTimeRange,
  formatWibBookingTime,
  formatWibDateTime,
  wibDateKey,
  todayWibStr,
  isBookingPassed,
  wibDateFromForm,
  nowWibTotalMinutes
} = useDatetime()
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

// --- Kuota pemesanan user ---------------------------------------------
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

// --- Kalender Mingguan ------------------------------------------------
const weeklyData  = ref(null)
const weeklyLoading = ref(false)
const currentWeekStart = ref('') // YYYY-MM-DD of the Monday being displayed

const selectedMobileDay = ref('')

const loadWeeklySchedule = async (startDate = '') => {
  weeklyLoading.value = true
  try {
    const params = startDate ? { start_date: startDate } : {}
    const data = await $fetch('/api/bookings/weekly-schedule', { query: params })
    weeklyData.value = data
    currentWeekStart.value = data.week_start

    // Set selectedMobileDay to today (if in week) or first day
    if (data?.days?.length) {
      const todayStr = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })
      if (data.days.includes(todayStr)) {
        selectedMobileDay.value = todayStr
      } else {
        selectedMobileDay.value = data.days[0]
      }
    }
  } catch (err) {
    console.error('[WEEKLY SCHEDULE] Failed:', err)
    weeklyData.value = null
  } finally {
    weeklyLoading.value = false
  }
}

// Navigate week: direction -1 = prev, 0 = current, 1 = next
const navigateWeek = (direction) => {
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
const getBookingsForCell = (roomId, dateKey) => {
  if (!weeklyData.value?.bookings) return []
  return weeklyData.value.bookings.filter(
    (b) => b.room_id === roomId && b.date_key === dateKey
  )
}

// Format YYYY-MM-DD to "Sen 28 Jul"
const formatShortDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', timeZone: 'Asia/Jakarta' })
}

// Format YYYY-MM-DD to "Selasa, 11 Agustus 2026"
const formatFullDate = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric', timeZone: 'Asia/Jakarta' })
}

// Day name for header (e.g. "Sen", "Sel")
const getDayName = (dateStr) => {
  if (!dateStr) return ''
  const d = new Date(`${dateStr}T00:00:00`)
  return d.toLocaleDateString('id-ID', { weekday: 'short', timeZone: 'Asia/Jakarta' })
}

// Hitung total booking aktif pada tanggal tertentu
const getDayBookingCount = (dateKey) => {
  if (!weeklyData.value?.bookings) return 0
  return weeklyData.value.bookings.filter((b) => b.date_key === dateKey).length
}

// Check if a date string equals today
const isToday = (dateStr) => {
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
  end_time: '',
  is_recurring: false,
  recurrence_pattern: 'WEEKLY',
  repeat_until: ''
})

const cancelBookingId = ref(null)
const cancellationReasonInput = ref('')
const cancelLoading = ref(false)
const cancelError = ref('')

const confirmCancelBooking = (bookingId) => {
  cancelBookingId.value = bookingId
  cancellationReasonInput.value = ''
  cancelError.value = ''
}

const submitCancellation = async () => {
  if (!cancelBookingId.value) return
  if (!cancellationReasonInput.value || cancellationReasonInput.value.trim().length < 5) {
    cancelError.value = 'Alasan pembatalan wajib diisi (minimal 5 karakter).'
    return
  }

  cancelLoading.value = true
  cancelError.value = ''

  try {
    const token = localStorage.getItem('auth_token')
    // Bug #7A fix: gunakan PATCH dengan action 'cancel' agar body tidak dibuang oleh proxy.
    // Sebelumnya menggunakan DELETE + body yang bisa dibuang oleh beberapa reverse proxy/CDN.
    await $fetch(`/api/bookings/${cancelBookingId.value}`, {
      method: 'PATCH',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        status: 'CANCELLED',
        cancellation_reason: cancellationReasonInput.value.trim()
      }
    })

    cancelBookingId.value = null
    cancellationReasonInput.value = ''
    // Bug #7C fix: reset error state setelah sukses
    cancelError.value = ''
    // Bug #2C fix: refresh kalender mingguan juga setelah pembatalan
    await Promise.all([loadData(), loadWeeklySchedule()])
  } catch (err) {
    // Bug #7B fix: fallback ke berbagai properti error agar pesan lebih informatif
    cancelError.value = (err && err.data && err.data.statusMessage) || (err && err.statusMessage) || (err && err.message) || 'Gagal membatalkan pemesanan'
  } finally {
    cancelLoading.value = false
  }
}

const loginLoading = ref(false)
const bookingLoading = ref(false)
const loginError = ref('')
const bookingMessage = ref('')
const bookingError = ref('')

// --- Quick time preset helpers for booking modal -----------------------
const applyTimePreset = (hours) => {
  if (!bookingForm.value.start_time) {
    bookingForm.value.start_time = '09:00'
  }
  const parts = bookingForm.value.start_time.split(':')
  if (parts.length < 2) return
  let h = parseInt(parts[0], 10) || 0
  let m = parseInt(parts[1], 10) || 0

  h = (h + hours) % 24
  const endH = String(h).padStart(2, '0')
  const endM = String(m).padStart(2, '0')
  bookingForm.value.end_time = `${endH}:${endM}`
}

const applySessionPreset = (startStr, endStr) => {
  bookingForm.value.start_time = startStr
  bookingForm.value.end_time = endStr
}

// Computed: Preview tanggal pemesanan berulang (recurring)
const recurringSummaryDates = computed(() => {
  if (!bookingForm.value.is_recurring || !bookingForm.value.event_date || !bookingForm.value.repeat_until) {
    return []
  }
  const pattern = bookingForm.value.recurrence_pattern || 'WEEKLY'
  const start = new Date(`${bookingForm.value.event_date}T00:00:00`)
  const until = new Date(`${bookingForm.value.repeat_until}T23:59:59`)
  if (isNaN(start.getTime()) || isNaN(until.getTime()) || until <= start) return []

  const maxFutureDate = new Date(start)
  maxFutureDate.setDate(maxFutureDate.getDate() + 90)

  const list = [new Date(start)]
  let curr = new Date(start)

  while (list.length < 20) {
    if (pattern === 'WEEKLY') curr.setDate(curr.getDate() + 7)
    else if (pattern === 'BIWEEKLY') curr.setDate(curr.getDate() + 14)
    else if (pattern === 'MONTHLY') curr.setMonth(curr.getMonth() + 1)
    else break

    if (curr > until || curr > maxFutureDate) break
    list.push(new Date(curr))
  }
  return list
})

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

// Computed: Cek apakah kuota pemesanan user sudah terpakai seluruhnya
const hasQuotaExhausted = computed(() => {
  if (!userQuota.value) return false
  if (userQuota.value.is_unlimited) return false
  return userQuota.value.remaining <= 0 || !userQuota.value.can_book
})

// Computed: Cek apakah user yang login adalah admin
// Digunakan untuk menonaktifkan tombol konfirmasi dan menampilkan pesan info
const isCurrentUserAdmin = computed(() => {
  if (!user.value) return false
  
  // Backend logic: admin is any user with role_id > 0
  const hasAdminRoleId = user.value.role_id !== null && 
                         user.value.role_id !== undefined && 
                         Number(user.value.role_id) > 0
                         
  const role = user.value.role
  const hasAdminRoleName = role === 'super_admin' ||
    role === 'admin_komsos' ||
    role === 'admin_sekretariat' ||
    role === 'admin'
    
  return hasAdminRoleId || hasAdminRoleName
})

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
// isBookingPassed dan getTodayDate — dari useDatetime composable
// Alias agar kompatibel dengan kode yang sudah ada
const getTodayDate = todayWibStr

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

// formatDate dan formatTime — dari useDatetime composable
const formatDate = formatWibDate
const formatTime = formatWibTime

const getRecurrenceLabel = (pattern) => {
  if (pattern === 'WEEKLY') return 'Rutin (Mingguan)'
  if (pattern === 'BIWEEKLY') return 'Rutin (2-Mingguan)'
  if (pattern === 'MONTHLY') return 'Rutin (Bulanan)'
  return 'Pemesanan Rutin'
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

      // Check if user is admin AND has admin session - only then redirect to admin panel
      // If user has role_id > 0 but no admin session token, they are blocked at API level
      // but we do NOT redirect them to admin/login (which would confuse them).
      // Instead, isCurrentUserAdmin computed will show the info box and disable the button.
      const isAdminAccount = (response.role_id !== null && response.role_id !== undefined && Number(response.role_id) > 0)
        || response.role === 'super_admin'
        || response.role === 'admin_komsos'
        || response.role === 'admin_sekretariat'
      
      const hasAdminSession = typeof sessionStorage !== 'undefined' && !!sessionStorage.getItem('admin_access_token')

      if (isAdminAccount && hasAdminSession) {
        console.log('[MOUNTED] Admin user with active session detected (role_id:', response.role_id, '), redirecting to admin panel...')
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

  // Auto-scroll smooth ke elemen yang dituju (memakai scroll-mt-28 CSS margin)
  if (process.client) {
    const scrollToHash = () => {
      const hash = window.location.hash
      const targetId = hash ? hash.replace('#', '') : ''
      if (targetId) {
        const el = document.getElementById(targetId)
        if (el) {
          el.scrollIntoView({ behavior: 'smooth', block: 'start' })
        }
      }
    }

    setTimeout(scrollToHash, 300)
    window.addEventListener('hashchange', scrollToHash)
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

    // Check if user is admin AND has admin session - only then redirect to admin panel
    const isAdminAccount = (userResponse.role_id !== null && userResponse.role_id !== undefined && Number(userResponse.role_id) > 0)
      || userResponse.role === 'super_admin'
      || userResponse.role === 'admin_komsos'
      || userResponse.role === 'admin_sekretariat'
    
    const hasAdminSession = typeof sessionStorage !== 'undefined' && !!sessionStorage.getItem('admin_access_token')

    if (isAdminAccount && hasAdminSession) {
      console.log('[Booking Login] Admin user with active session detected (role_id:', userResponse.role_id, '), redirecting to admin panel...')
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
  bookingForm.value = { event_name: '', event_date: '', start_time: '', end_time: '', is_recurring: false, recurrence_pattern: 'WEEKLY', repeat_until: '' }
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
  const eventDate = wibDateFromForm(bookingForm.value.event_date)
  const today = wibDateFromForm(todayWibStr())

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

  // Validasi pemesanan berulang
  if (bookingForm.value.is_recurring) {
    // Bug fix: trim() agar string berisi spasi saja (' ') tidak lolos validasi
    const repeatUntilTrimmed = (bookingForm.value.repeat_until || '').trim()
    if (!repeatUntilTrimmed) {
      bookingError.value = 'Batas tanggal pengulangan wajib diisi untuk pemesanan rutin'
      bookingLoading.value = false
      return
    }
    if (repeatUntilTrimmed <= bookingForm.value.event_date) {
      bookingError.value = 'Batas tanggal pengulangan harus setelah tanggal acara pertama'
      bookingLoading.value = false
      return
    }
    // Bug #5A fix: validasi maksimum 90 hari ke depan
    const startDateObj = new Date(bookingForm.value.event_date)
    const repeatUntilObj = new Date(bookingForm.value.repeat_until)
    const maxFutureDate = new Date(startDateObj)
    maxFutureDate.setDate(maxFutureDate.getDate() + 90)
    if (repeatUntilObj > maxFutureDate) {
      bookingError.value = 'Batas pemesanan berulang maksimal 90 hari (3 bulan) dari tanggal pertama'
      bookingLoading.value = false
      return
    }
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

  // Validasi tidak boleh waktu yang sudah lewat hari ini
  const isToday = bookingForm.value.event_date === getTodayDate()
  if (isToday) {
    // Gunakan nowWibTotalMinutes() dari composable — timezone-safe, tidak
    // bergantung pada timezone browser pengguna.
    if (startMinutes < nowWibTotalMinutes()) {
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
      room_id: selectedRoom.value.id,
      is_recurring: bookingForm.value.is_recurring,
      recurrence_pattern: bookingForm.value.recurrence_pattern,
      repeat_until: bookingForm.value.repeat_until
    })

    const response = await $fetch('/api/bookings', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: {
        event_name: bookingForm.value.event_name,
        start_time: startDateTime.toISOString(),
        end_time: endDateTime.toISOString(),
        room_id: selectedRoom.value.id,
        is_recurring: bookingForm.value.is_recurring,
        recurrence_pattern: bookingForm.value.recurrence_pattern,
        repeat_until: bookingForm.value.repeat_until
      }
    })
    bookingMessage.value = response.message

    // Refresh data and weekly schedule immediately after successful booking
    await Promise.all([loadData(), loadWeeklySchedule()])

    // Close modal and reset form after showing success message
    setTimeout(() => {
      selectedRoom.value = null
      bookingForm.value = { event_name: '', event_date: '', start_time: '', end_time: '', is_recurring: false, recurrence_pattern: 'WEEKLY', repeat_until: '' }
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
  bookingForm.value = { event_name: '', event_date: '', start_time: '', end_time: '', is_recurring: false, recurrence_pattern: 'WEEKLY', repeat_until: '' }
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

// formatBookingTime — dari useDatetime composable
const formatBookingTime = formatWibBookingTime

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
