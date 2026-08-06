<template>
  <!-- Single root wrapper required by Vue/Nuxt <Transition> -->
  <div>
  <!-- Welcome Header with Role Badge -->
  <div class="mb-6 bg-white shadow rounded-lg p-6">
    <ClientOnly>
      <div class="flex items-center justify-between">
        <div class="flex-1">
          <div class="flex items-center gap-3">
            <h2 class="text-2xl font-bold text-gray-900 uppercase">Selamat Datang, {{ auth.user.value?.username || 'Admin' }}!</h2>
            <!-- Live Indicator -->
            <div class="hidden sm:flex items-center gap-2 px-3 py-1.5 bg-gray-50 border border-gray-100 rounded-full" title="Pembaruan Otomatis Aktif">
              <div class="relative flex h-2.5 w-2.5">
                <span :class="['animate-ping absolute inline-flex h-full w-full rounded-full opacity-75', isRefreshing ? 'bg-amber-400' : 'bg-green-400']"></span>
                <span :class="['relative inline-flex rounded-full h-2.5 w-2.5', isRefreshing ? 'bg-amber-500' : 'bg-green-500']"></span>
              </div>
              <span class="text-xs font-medium text-gray-600">{{ isRefreshing ? 'Memperbarui...' : 'Live' }}</span>
            </div>
          </div>
          <p class="text-gray-600 mt-1">Dashboard {{ getRoleName(userRole) }}</p>
        </div>
        <div class="flex items-center gap-3">
          <div class="px-4 py-2 rounded-full" :class="getRoleBadgeClass(userRole)">
            <span class="text-sm font-semibold">{{ getRoleName(userRole) }}</span>
          </div>
          <button @click="handleLogout"
            class="px-4 py-2 bg-red-600 hover:bg-red-700 text-white text-sm font-medium rounded-lg transition-colors">
            Logout
          </button>
        </div>
      </div>
      <template #fallback>
        <div class="flex items-center justify-between animate-pulse">
          <div class="flex-1">
            <div class="h-8 bg-gray-200 rounded w-64 mb-2"></div>
            <div class="h-5 bg-gray-200 rounded w-48"></div>
          </div>
          <div class="flex items-center gap-3">
            <div class="h-10 w-24 bg-gray-200 rounded-full"></div>
            <div class="h-10 w-20 bg-gray-200 rounded-lg"></div>
          </div>
        </div>
      </template>
    </ClientOnly>
  </div>

  <!-- ── Action Widgets (role-specific) ── -->
  <ClientOnly>
    <div v-if="widgets" class="mb-6 space-y-4">

      <!-- Super Admin & Sekretariat: Pending items banner -->
      <div v-if="widgets.pendingBookings > 0 || widgets.pendingUsers > 0"
        class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
        
        <NuxtLink v-if="widgets.pendingUsers > 0" to="/admin/users"
          class="flex items-center gap-4 bg-blue-50 border border-blue-200 rounded-xl p-5 hover:bg-blue-100 transition-colors shadow-sm cursor-pointer">
          <div class="w-12 h-12 rounded-full bg-blue-500 flex items-center justify-center shrink-0 shadow-sm">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="text-3xl font-bold text-blue-700 leading-tight">{{ widgets.pendingUsers }}</div>
            <div class="text-sm text-blue-600 font-medium">User Menunggu Aktivasi</div>
          </div>
          <div class="text-blue-400 shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </NuxtLink>

        <NuxtLink v-if="widgets.pendingBookings > 0" to="/admin/bookings-new"
          class="flex items-center gap-4 bg-amber-50 border border-amber-200 rounded-xl p-5 hover:bg-amber-100 transition-colors shadow-sm cursor-pointer">
          <div class="w-12 h-12 rounded-full bg-amber-500 flex items-center justify-center shrink-0 shadow-sm">
            <svg class="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div class="flex-1">
            <div class="text-3xl font-bold text-amber-700 leading-tight">{{ widgets.pendingBookings }}</div>
            <div class="text-sm text-amber-700 font-medium">Pemesanan Ruangan Pending</div>
          </div>
          <div class="text-amber-400 shrink-0">
            <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/>
            </svg>
          </div>
        </NuxtLink>
      </div>

      <!-- Admin Komsos: stale drafts + published this month -->
      <div v-if="widgets.staleDrafts !== undefined" class="flex flex-wrap gap-4">
        <div v-if="widgets.staleDrafts > 0"
          class="flex items-center gap-3 bg-red-50 border border-red-300 rounded-lg px-5 py-4 flex-1 min-w-[200px]">
          <div class="w-10 h-10 rounded-full bg-red-400 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"/>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-red-700">{{ widgets.staleDrafts }}</div>
            <div class="text-sm text-red-600 font-medium">Draft artikel belum dipublish &gt; 30 hari</div>
          </div>
        </div>
        <div class="flex items-center gap-3 bg-green-50 border border-green-200 rounded-lg px-5 py-4 flex-1 min-w-[200px]">
          <div class="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"/>
            </svg>
          </div>
          <div>
            <div class="text-lg font-bold text-green-700">
              {{ widgets.publishedThisMonth.articles }} artikel · {{ widgets.publishedThisMonth.news }} berita
            </div>
            <div class="text-sm text-green-600">Dipublish bulan ini</div>
          </div>
        </div>
        <div class="flex items-center gap-3 bg-indigo-50 border border-indigo-200 rounded-lg px-5 py-4 flex-1 min-w-[200px]">
          <div class="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center shrink-0">
            <svg class="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"/>
            </svg>
          </div>
          <div>
            <div class="text-2xl font-bold text-indigo-700">{{ widgets.activeFaq }}</div>
            <div class="text-sm text-indigo-600">FAQ Chatbot aktif</div>
          </div>
        </div>
      </div>

      <!-- Super Admin & Sekretariat: 2-column grid — Today bookings + Upcoming agenda -->
      <div v-if="widgets.todayBookings !== undefined" class="grid grid-cols-1 lg:grid-cols-2 gap-4">

        <!-- Today's bookings -->
        <div class="bg-white rounded-lg shadow p-5">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"/>
            </svg>
            Ruangan Digunakan Hari Ini
          </h3>
          <div v-if="widgets.todayBookings.length > 0" class="space-y-2">
            <div v-for="b in widgets.todayBookings" :key="b.id"
              class="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm">
              <div>
                <div class="font-medium text-gray-800">{{ b.room_name }}</div>
                <div class="text-xs text-gray-400">{{ b.user_name }} — {{ b.event_name }}</div>
              </div>
              <div class="text-xs text-gray-500 shrink-0 ml-2">{{ formatWibTimeRange(b.start_time, b.end_time) }} WIB</div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Tidak ada pemesanan hari ini.</p>
        </div>

        <!-- Upcoming agenda -->
        <div class="bg-white rounded-lg shadow p-5">
          <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
            <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"/>
            </svg>
            Agenda 7 Hari ke Depan
          </h3>
          <div v-if="widgets.upcomingAgenda.length > 0" class="space-y-2">
            <div v-for="ag in widgets.upcomingAgenda" :key="ag.title + ag.event_date"
              class="flex items-start gap-3 bg-gray-50 rounded px-3 py-2 text-sm">
              <div class="w-10 text-center shrink-0">
                <div class="text-xs font-bold text-[#882f1d]">{{ formatAgendaDay(ag.event_date) }}</div>
                <div class="text-xs text-gray-400">{{ formatAgendaMonth(ag.event_date) }}</div>
              </div>
              <div class="min-w-0">
                <div class="font-medium text-gray-800 truncate">{{ ag.title }}</div>
                <div class="text-xs text-gray-400">{{ ag.location || '-' }}</div>
              </div>
            </div>
          </div>
          <p v-else class="text-gray-400 text-sm">Tidak ada agenda mendatang.</p>
        </div>
      </div>

      <!-- Admin Komsos: latest kronik -->
      <div v-if="widgets.latestKronik !== undefined" class="bg-white rounded-lg shadow p-5">
        <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"/>
          </svg>
          Entri Kronik Terbaru
        </h3>
        <div v-if="widgets.latestKronik.length > 0" class="space-y-2">
          <div v-for="k in widgets.latestKronik" :key="k.title"
            class="flex items-center justify-between bg-gray-50 rounded px-3 py-2 text-sm">
            <div>
              <div class="font-medium text-gray-800">{{ k.title }}</div>
              <div class="text-xs text-gray-400">{{ k.section || 'Umum' }}</div>
            </div>
            <div class="text-xs text-gray-500 shrink-0 ml-2">{{ formatBookingDate(k.when_date) }}</div>
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">Belum ada entri kronik.</p>
      </div>

      <!-- Super Admin: recent activity -->
      <div v-if="widgets.recentActivity !== undefined" class="bg-white rounded-lg shadow p-5">
        <h3 class="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
          <svg class="w-4 h-4 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/>
          </svg>
          Aktivitas Konten Terbaru
        </h3>
        <div v-if="widgets.recentActivity.length > 0" class="space-y-1">
          <div v-for="a in widgets.recentActivity" :key="a.title + a.updated_at"
            class="flex items-center gap-3 text-sm py-1.5 border-b border-gray-50 last:border-0">
            <span class="px-2 py-0.5 rounded-full text-xs font-medium shrink-0"
              :class="a.type === 'artikel' ? 'bg-blue-100 text-blue-700' : 'bg-purple-100 text-purple-700'">
              {{ a.type }}
            </span>
            <span class="truncate text-gray-700 flex-1">{{ a.title }}</span>
            <span class="text-xs text-gray-400 shrink-0">{{ formatDate(a.updated_at) }}</span>
          </div>
        </div>
        <p v-else class="text-gray-400 text-sm">Belum ada aktivitas.</p>
      </div>

    </div>
  </ClientOnly>

  <!-- Statistics Section -->
  <div class="mb-8">
    <div class="bg-white shadow rounded-lg">
      <div class="px-6 py-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Statistik</h3>
        <ClientOnly>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <!-- Artikel - Super Admin & Admin Komsos -->
            <div v-if="canViewContent" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Artikel</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.articles || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Berita - Super Admin & Admin Komsos -->
            <div v-if="canViewContent" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Berita</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.news || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Album - Super Admin & Admin Komsos -->
            <div v-if="canViewGallery" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Album</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.albums || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Foto - Super Admin & Admin Komsos -->
            <div v-if="canViewGallery" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Foto</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.photos || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Agenda - Super Admin & Admin Sekretariat -->
            <div v-if="canViewAgenda" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Agenda</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.agenda || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Bookings - Super Admin & Admin Sekretariat -->
            <div v-if="canViewBookings" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Bookings</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.bookings || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Ruangan - Super Admin & Admin Sekretariat -->
            <div v-if="canViewRooms" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Ruangan</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.rooms || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Dokumen - Super Admin & Admin Sekretariat -->
            <div v-if="canViewDocuments" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Dokumen</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.documents || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Users - Super Admin Only -->
            <div v-if="auth.isSuperAdmin.value" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Users</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.users || 0 }}</dd>
                </div>
              </div>
            </div>

            <!-- Contact Messages - Super Admin & Admin Sekretariat -->
            <div v-if="canViewContactMessages" class="bg-gray-50 p-4 rounded-lg">
              <div class="flex items-center">
                <div class="flex-shrink-0">
                  <svg class="h-8 w-8 text-[#882f1d]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                    </path>
                  </svg>
                </div>
                <div class="ml-4">
                  <dt class="text-sm font-medium text-gray-500 truncate">Pesan</dt>
                  <dd class="text-lg font-semibold text-gray-900">{{ stats.contactMessages || 0 }}</dd>
                </div>
              </div>
            </div>
          </div>
          <template #fallback>
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 animate-pulse">
              <div v-for="i in 8" :key="i" class="bg-gray-100 p-4 rounded-lg h-24"></div>
            </div>
          </template>
        </ClientOnly>
      </div>
    </div>
  </div>

  <!-- Booking Status Section - Only for superadmin and admin_sekretariat -->
  <ClientOnly>
    <div v-if="canViewBookingList" class="mb-8 bg-white shadow rounded-lg">
      <div class="px-6 py-5">
        <div class="flex items-center justify-between mb-4">
          <h3 class="text-lg leading-6 font-medium text-gray-900">Status Pemesanan Ruangan</h3>
          <!-- Link disabled - bookings page not yet created -->
          <!-- <NuxtLink 
          to="/admin/bookings" 
          class="text-sm text-[#882f1d] hover:text-[#6b2416] font-medium"
        >
          Lihat Semua →
        </NuxtLink> -->
        </div>

        <!-- Loading State -->
        <div v-if="loadingBookings" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Memuat data booking...</p>
        </div>

        <!-- Bookings Table -->
        <div v-else-if="bookings.length > 0">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gray-50">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">ID</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Nama
                    Pemesan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Ruangan
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal
                  </th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Waktu</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-200">
                <tr v-for="booking in paginatedBookings" :key="booking.id" class="hover:bg-gray-50">
                  <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    #{{ booking.id }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900">{{ booking.user_name || booking.name }}</div>
                    <div class="text-sm text-gray-500">{{ booking.user_email || booking.email }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ booking.room_name }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatBookingDate(booking.booking_date) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {{ formatTime(booking.start_time) }} - {{ formatTime(booking.end_time) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span :class="getBookingStatusClass(booking.status)"
                      class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                      {{ getBookingStatusText(booking.status) }}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Booking Pagination - Always show if there are bookings -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6 mt-4">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="currentBookingPage > 1 && currentBookingPage--" :disabled="currentBookingPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Sebelumnya
              </button>
              <button @click="currentBookingPage < totalBookingPages && currentBookingPage++"
                :disabled="currentBookingPage === totalBookingPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                Selanjutnya
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Menampilkan
                  <span class="font-medium">{{ (currentBookingPage - 1) * bookingsPerPage + 1 }}</span>
                  sampai
                  <span class="font-medium">{{ Math.min(currentBookingPage * bookingsPerPage, bookings.length) }}</span>
                  dari
                  <span class="font-medium">{{ bookings.length }}</span>
                  pemesanan
                </p>
              </div>
              <div v-if="totalBookingPages > 1">
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
                  <button @click="currentBookingPage > 1 && currentBookingPage--" :disabled="currentBookingPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="sr-only">Sebelumnya</span>
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button v-for="page in visibleBookingPages" :key="page" @click="currentBookingPage = page" :class="[
                    'relative inline-flex items-center px-4 py-2 border text-sm font-medium',
                    currentBookingPage === page
                      ? 'z-10 bg-[#882f1d] border-[#882f1d] text-white'
                      : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                  ]">
                    {{ page }}
                  </button>
                  <button @click="currentBookingPage < totalBookingPages && currentBookingPage++"
                    :disabled="currentBookingPage === totalBookingPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed">
                    <span class="sr-only">Selanjutnya</span>
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-8">
          <svg class="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2">
            </path>
          </svg>
          <p class="mt-2 text-sm text-gray-500">Tidak ada data pemesanan</p>
        </div>
      </div>
    </div>
  </ClientOnly>

  <!-- Recent Content Section - Only for users with content permissions -->
  <ClientOnly>
    <div v-if="canViewContent" class="bg-white shadow rounded-lg">
      <div class="px-6 py-5">
        <h3 class="text-lg leading-6 font-medium text-gray-900 mb-4">Konten Terbaru</h3>

        <!-- Loading State -->
        <div v-if="loading" class="text-center py-8">
          <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#882f1d] mx-auto"></div>
          <p class="mt-2 text-sm text-gray-500">Memuat konten...</p>
        </div>

        <!-- Content Table -->
        <div v-else-if="paginatedContent.length > 0" class="overflow-x-auto">
          <table class="min-w-full divide-y divide-gray-200">
            <thead class="bg-gray-50">
              <tr>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Jenis</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Judul</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Penulis</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Tanggal
                  Dibuat
                </th>
              </tr>
            </thead>
            <tbody class="bg-white divide-y divide-gray-200">
              <tr v-for="item in paginatedContent" :key="item.id" class="hover:bg-gray-50">
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="item.type === 'article' ? 'bg-blue-100 text-blue-800' : 'bg-green-100 text-green-800'"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ item.type === 'article' ? 'Artikel' : 'Berita' }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <div class="text-sm font-medium text-gray-900 truncate max-w-xs">{{ item.title }}</div>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ item.author || 'Tidak diketahui' }}
                </td>
                <td class="px-6 py-4 whitespace-nowrap">
                  <span :class="getStatusClass(item.status)"
                    class="inline-flex px-2 py-1 text-xs font-semibold rounded-full">
                    {{ getStatusText(item.status) }}
                  </span>
                </td>
                <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {{ formatDate(item.created_at) }}
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Pagination -->
          <div class="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
            <div class="flex-1 flex justify-between sm:hidden">
              <button @click="currentPage > 1 && currentPage--" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Sebelumnya
              </button>
              <button @click="currentPage < totalPages && currentPage++" :disabled="currentPage === totalPages"
                class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50">
                Selanjutnya
              </button>
            </div>
            <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Menampilkan
                  <span class="font-medium">{{ (currentPage - 1) * itemsPerPage + 1 }}</span>
                  sampai
                  <span class="font-medium">{{ Math.min(currentPage * itemsPerPage, combinedContent.length) }}</span>
                  dari
                  <span class="font-medium">{{ combinedContent.length }}</span>
                  hasil
                </p>
              </div>
              <div>
                <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  <button @click="currentPage > 1 && currentPage--" :disabled="currentPage === 1"
                    class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <span class="sr-only">Sebelumnya</span>
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                  <button v-for="page in visiblePages" :key="page" @click="currentPage = page"
                    :class="page === currentPage ? 'z-10 bg-[#882f1d] border-[#882f1d] text-white' : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'"
                    class="relative inline-flex items-center px-4 py-2 border text-sm font-medium">
                    {{ page }}
                  </button>
                  <button @click="currentPage < totalPages && currentPage++" :disabled="currentPage === totalPages"
                    class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50">
                    <span class="sr-only">Selanjutnya</span>
                    <svg class="h-5 w-5" fill="currentColor" viewBox="0 0 20 20">
                      <path fill-rule="evenodd"
                        d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </button>
                </nav>
              </div>
            </div>
          </div>
        </div>

        <!-- Empty State -->
        <div v-else class="text-center py-12">
          <svg class="mx-auto h-24 w-24 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          <h3 class="mt-4 text-lg font-medium text-gray-900">Belum ada konten</h3>
          <p class="mt-2 text-gray-500">Mulai dengan membuat artikel atau berita pertama Anda.</p>
        </div>
      </div>
    </div>
  </ClientOnly>
  </div><!-- end single root wrapper -->
</template>

<script setup>
definePageMeta({
  middleware: 'auth',
  layout: 'admin',
  ssr: false // Disable SSR to prevent hydration mismatch with role-based content - now using ClientOnly components
})

// Import auth composable
const auth = useAuth()

// ── Datetime helpers (Single Source of Truth — useDatetime) ──────────────────
// Selalu gunakan fungsi dari composable ini untuk format tanggal/waktu.
// Jangan membuat konversi inline agar tidak ada timezone bug.
const {
  formatWibDate,
  formatWibTime,
  formatWibTimeRange,
  formatWibDateTime
} = useDatetime()

const stats = ref({
  articles: 0,
  news: 0,
  albums: 0,
  photos: 0,
  agenda: 0,
  bookings: 0,
  rooms: 0,
  documents: 0,
  users: 0,
  contactMessages: 0
})

const articles = ref([])
const news = ref([])
const bookings = ref([])
const widgets = ref(null)
const loading = ref(false)
const loadingBookings = ref(false)
const isRefreshing = useState('isRefreshing', () => false)
const currentPage = ref(1)
const itemsPerPage = 5

// Pagination state for bookings
const currentBookingPage = ref(1)
const bookingsPerPage = 5  // Changed from 10 to 5 for better pagination visibility

// Get user role
const userRole = computed(() => auth.user.value?.role || 'admin')

// Permission-based computed properties
const canViewContent = computed(() => auth.hasPermission('view_articles') || auth.hasPermission('manage_content'))
const canViewGallery = computed(() => auth.hasPermission('view_gallery') || auth.hasPermission('manage_gallery'))
const canViewAgenda = computed(() => auth.hasPermission('view_agenda') || auth.hasPermission('manage_agenda'))
const canViewBookings = computed(() => auth.hasPermission('view_bookings') || auth.hasPermission('manage_bookings'))

// Show booking list only for superadmin and admin_sekretariat (not admin_komsos)
const canViewBookingList = computed(() => {
  const role = auth.user.value?.role || ''
  return (role === 'super_admin' || role === 'admin_sekretariat') &&
    (auth.hasPermission('view_bookings') || auth.hasPermission('manage_bookings'))
})

const canViewRooms = computed(() => auth.hasPermission('manage_rooms'))
const canViewDocuments = computed(() => auth.hasPermission('manage_documents'))
const canViewContactMessages = computed(() => auth.hasPermission('manage_contact_messages'))

// Helper functions for role badges
const getRoleName = (role) => {
  const roleNames = {
    'super_admin': 'Super Admin',
    'admin_komsos': 'Admin Komsos',
    'admin_sekretariat': 'Admin Sekretariat'
  }
  return roleNames[role] || 'Admin'
}

const getRoleBadgeClass = (role) => {
  const roleClasses = {
    'super_admin': 'bg-purple-100 text-purple-800',
    'admin_komsos': 'bg-blue-100 text-blue-800',
    'admin_sekretariat': 'bg-green-100 text-green-800'
  }
  return roleClasses[role] || 'bg-gray-100 text-gray-800'
}

const combinedContent = computed(() => {
  const allContent = [
    ...(Array.isArray(articles.value) ? articles.value : []).map(article => ({ ...article, type: 'article' })),
    ...(Array.isArray(news.value) ? news.value : []).map(newsItem => ({ ...newsItem, type: 'news' }))
  ]
  return allContent.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
})

const totalPages = computed(() => Math.ceil(combinedContent.value.length / itemsPerPage))

const paginatedContent = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage
  const end = start + itemsPerPage
  return combinedContent.value.slice(start, end)
})

const visiblePages = computed(() => {
  const pages = []
  const total = totalPages.value
  const current = currentPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages.filter(page => page !== '...')
})

// Pagination for bookings
const totalBookingPages = computed(() => Math.ceil(bookings.value.length / bookingsPerPage))

const paginatedBookings = computed(() => {
  const start = (currentBookingPage.value - 1) * bookingsPerPage
  const end = start + bookingsPerPage
  return bookings.value.slice(start, end)
})

const visibleBookingPages = computed(() => {
  const pages = []
  const total = totalBookingPages.value
  const current = currentBookingPage.value

  if (total <= 7) {
    for (let i = 1; i <= total; i++) {
      pages.push(i)
    }
  } else {
    if (current <= 4) {
      for (let i = 1; i <= 5; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    } else if (current >= total - 3) {
      pages.push(1)
      pages.push('...')
      for (let i = total - 4; i <= total; i++) {
        pages.push(i)
      }
    } else {
      pages.push(1)
      pages.push('...')
      for (let i = current - 1; i <= current + 1; i++) {
        pages.push(i)
      }
      pages.push('...')
      pages.push(total)
    }
  }

  return pages.filter(page => page !== '...')
})

const handleLogout = () => {
  auth.logout()
  navigateTo('/admin/login')
}

// Fetch stats data
const fetchStats = async () => {
  try {
    const response = await $fetch('/api/admin/stats', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    stats.value = response
  } catch (error) {
    if (error.statusCode === 401) {
      auth.logout()
      navigateTo('/admin/login')
      return
    }
    console.error('Failed to fetch stats:', error)
  }
}

// Fetch articles and news - only if user has content permissions
const fetchContent = async (isBackground = false) => {
  if (!canViewContent.value) {
    return // Skip fetching if user doesn't have content permissions
  }

  if (!isBackground) loading.value = true
  try {
    const [articlesResponse, newsResponse] = await Promise.all([
      $fetch('/api/admin/articles', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
        }
      }),
      $fetch('/api/admin/news', {
        headers: {
          'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
        }
      })
    ])

    articles.value = Array.isArray(articlesResponse) ? articlesResponse : (articlesResponse?.data ?? [])
    news.value = Array.isArray(newsResponse) ? newsResponse : (newsResponse?.data ?? [])
  } catch (error) {
    if (error.statusCode === 401) {
      auth.logout()
      navigateTo('/admin/login')
      return
    }
    console.error('Failed to fetch content:', error)
  } finally {
    if (!isBackground) loading.value = false
  }
}

// Fetch bookings - only for superadmin and admin_sekretariat
const fetchBookings = async (isBackground = false) => {
  if (!canViewBookingList.value) {
    return // Skip fetching if user is not superadmin or admin_sekretariat
  }

  if (!isBackground) loadingBookings.value = true
  try {
    const response = await $fetch('/api/admin/bookings', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })

    // Sort bookings: PENDING first, then by booking date descending
    bookings.value = response.bookings
      .sort((a, b) => {
        // First sort by status (PENDING first)
        if (a.status === 'PENDING' && b.status !== 'PENDING') return -1
        if (a.status !== 'PENDING' && b.status === 'PENDING') return 1

        // Then by booking date (newest first)
        return new Date(b.created_at) - new Date(a.created_at)
      })
  } catch (error) {
    if (error.statusCode === 401) {
      auth.logout()
      navigateTo('/admin/login')
      return
    }
    console.error('Failed to fetch bookings:', error)
    bookings.value = []
  } finally {
    if (!isBackground) loadingBookings.value = false
  }
}

// ── Format helpers — dialihkan ke useDatetime (UTC-aware, WIB-safe) ──────────

// Format tanggal panjang: "6 Agustus 2026"
const formatDate = formatWibDateTime

// Format tanggal pendek untuk kronik: "06 Agu 2026"
const formatBookingDate = (s) => {
  const d = useDatetime().toUtcDate(s)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    timeZone: 'Asia/Jakarta'
  })
}

// Format waktu WIB: "08:00" (bukan "01:00" UTC!)
// GANTI dari: split(':') raw string → sekarang: konversi UTC→WIB via Intl
const formatTime = formatWibTime

const getStatusClass = (status) => {
  switch (status) {
    case 'published':
      return 'bg-green-100 text-green-800'
    case 'draft':
      return 'bg-yellow-100 text-yellow-800'
    case 'archived':
      return 'bg-gray-100 text-gray-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'published':
      return 'Published'
    case 'draft':
      return 'Draft'
    case 'archived':
      return 'Archived'
    default:
      return status
  }
}

// Booking status helper functions
const getBookingStatusClass = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'bg-yellow-100 text-yellow-800'
    case 'APPROVED':
      return 'bg-green-100 text-green-800'
    case 'REJECTED':
      return 'bg-red-100 text-red-800'
    case 'CANCELLED':
      return 'bg-gray-100 text-gray-800'
    case 'COMPLETED':
      return 'bg-blue-100 text-blue-800'
    default:
      return 'bg-gray-100 text-gray-800'
  }
}

const getBookingStatusText = (status) => {
  switch (status?.toUpperCase()) {
    case 'PENDING':
      return 'Menunggu'
    case 'APPROVED':
      return 'Disetujui'
    case 'REJECTED':
      return 'Ditolak'
    case 'CANCELLED':
      return 'Dibatalkan'
    case 'COMPLETED':
      return 'Selesai'
    default:
      return status || '-'
  }
}

// Fetch role-specific dashboard widgets
const fetchWidgets = async () => {
  try {
    const response = await $fetch('/api/admin/dashboard-widgets', {
      headers: {
        'Authorization': `Bearer ${sessionStorage.getItem('admin_access_token')}`
      }
    })
    widgets.value = response
  } catch (error) {
    console.error('Failed to fetch dashboard widgets:', error)
  }
}

// Date helpers for agenda mini-calendar (UTC-aware via useDatetime)
const formatAgendaDay = (s) => {
  const d = useDatetime().toUtcDate(s)
  if (isNaN(d.getTime())) return '-'
  return d.toLocaleDateString('id-ID', { day: '2-digit', timeZone: 'Asia/Jakarta' })
}

const formatAgendaMonth = (s) => {
  const d = useDatetime().toUtcDate(s)
  if (isNaN(d.getTime())) return ''
  return d.toLocaleDateString('id-ID', { month: 'short', timeZone: 'Asia/Jakarta' })
}

// Watch for page changes and reset to first page when content changes
watch([articles, news], () => {
  currentPage.value = 1
})

// Polling Interval Reference
let pollingInterval = null

// Watch for auth user changes and fetch data when user is ready
watch(() => auth.user.value, (newUser, oldUser) => {
  if (newUser && !oldUser) {
    fetchStats()
    fetchContent()
    fetchBookings()
    fetchWidgets()
  }
}, { immediate: true })

// Fetch data on mount (middleware already checks auth)
onMounted(async () => {
  // Hanya fetch data awal jika di-mounted belum ada data,
  // (meskipun watcher immediate:true mungkin sudah berjalan).
  // Untuk mencegah double fetching, kita asumsikan widget sudah ada atau kita biarkan logic aslinya:
  if (auth.user.value && !widgets.value) {
    await Promise.all([fetchStats(), fetchContent(), fetchBookings(), fetchWidgets()])
  }

  // Mulai interval polling setiap 15 detik secara background (silent refresh)
  pollingInterval = setInterval(async () => {
    if (auth.user.value) {
      isRefreshing.value = true
      try {
        await Promise.all([
          fetchStats(),
          fetchWidgets(),
          fetchContent(true), // true = isBackground agar loading indikator tidak muncul
          fetchBookings(true) // true = isBackground agar loading indikator tidak muncul
        ])
      } finally {
        // Biarkan sedikit delay agar transisi indikator tetap terlihat walau koneksi sangat cepat
        setTimeout(() => {
          isRefreshing.value = false
        }, 500)
      }
    }
  }, 15000)
})

onUnmounted(() => {
  // Membersihkan interval saat admin pindah ke halaman lain
  if (pollingInterval) {
    clearInterval(pollingInterval)
  }
})
</script>
