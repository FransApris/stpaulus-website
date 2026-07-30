<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <ClientOnly>
      <div id="admin-sidebar" class="w-64 bg-white shadow-lg flex-shrink-0">
        <div class="flex flex-col h-full">
          <!-- Logo/Header -->
          <div class="flex items-center justify-center h-16 px-4 bg-[#882f1d] flex-shrink-0">
            <img src="/images/logo-paulus-juanda.png" alt="Logo Paroki St. Paulus" class="h-10 w-auto mr-3" />
            <h1 class="text-xl font-cinzel text-white font-bold">CMS Admin</h1>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
            <!-- Dashboard -->
            <NuxtLink v-if="menuVisibility.dashboard" to="/admin/dashboard"
              class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#882f1d]"
              :class="$route.path === '/admin/dashboard' ? 'bg-[#882f1d] text-white shadow-sm' : 'text-gray-700 hover:bg-red-50 hover:text-[#882f1d]'"
              @keydown.enter="navigateTo('/admin/dashboard')" @keydown.space.prevent="navigateTo('/admin/dashboard')">
              <svg class="w-5 h-5 mr-3 flex-shrink-0" :class="$route.path === '/admin/dashboard' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
              </svg>
              <span>Dashboard</span>
            </NuxtLink>

            <!-- 1. PROFIL & STRUKTUR PAROKI -->
            <div v-if="groupVisibility.profil_paroki">
              <div @click="openGroups.profil_paroki = !openGroups.profil_paroki"
                class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none"
                :class="isGroupActive('profil_paroki') ? 'bg-[#882f1d]/10 text-[#882f1d]' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                <svg class="w-5 h-5 mr-3 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                  </path>
                </svg>
                <span class="flex-1 font-bold">Profil & Struktur Paroki</span>
                <svg class="w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 text-[#882f1d]"
                  :class="openGroups.profil_paroki ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.profil_paroki" class="ml-4 pl-3 border-l-2 border-[#882f1d]/30 space-y-1 mt-1">
                <NuxtLink v-if="menuVisibility.pastors" to="/admin/pastors"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path.startsWith('/admin/pastors') ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path.startsWith('/admin/pastors') ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Romo Bertugas
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.dpp" to="/admin/dpp"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path.startsWith('/admin/dpp') ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path.startsWith('/admin/dpp') ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
                  </svg>
                  DPP Paroki
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.bgkp" to="/admin/bgkp"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path.startsWith('/admin/bgkp') ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path.startsWith('/admin/bgkp') ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                    </path>
                  </svg>
                  BGKP Paroki
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.teritorial" to="/admin/teritorial"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path.startsWith('/admin/teritorial') ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path.startsWith('/admin/teritorial') ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Wilayah & Lingkungan
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.parishStatistics" to="/admin/parish-statistics"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/parish-statistics' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/parish-statistics' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  Statistik Umat Paroki
                </NuxtLink>
              </div>
            </div>

            <!-- 2. PUBLIKASI & KONTEN MEDIA -->
            <div v-if="groupVisibility.publikasi">
              <div @click="openGroups.publikasi = !openGroups.publikasi"
                class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none"
                :class="isGroupActive('publikasi') ? 'bg-[#882f1d]/10 text-[#882f1d]' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                <svg class="w-5 h-5 mr-3 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                  </path>
                </svg>
                <span class="flex-1 font-bold">Publikasi & Konten Media</span>
                <svg class="w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 text-[#882f1d]"
                  :class="openGroups.publikasi ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.publikasi" class="ml-4 pl-3 border-l-2 border-[#882f1d]/30 space-y-1 mt-1">
                <NuxtLink v-if="menuVisibility.news" to="/admin/news" :prefetch="false"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/news' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/news' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                    </path>
                  </svg>
                  Kelola Berita
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.articles" to="/admin/articles" :prefetch="false"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/articles' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/articles' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  Kelola Artikel & Inspirasi
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.articleCategories" to="/admin/article-categories"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/article-categories' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/article-categories' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori Berita & Artikel
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.gallery" to="/admin/gallery"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/gallery' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/gallery' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                  Kelola Galeri Foto
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.galleryCategories" to="/admin/gallery-categories"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/gallery-categories' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/gallery-categories' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori Galeri
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.announcements" to="/admin/announcements"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/announcements' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/announcements' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z">
                    </path>
                  </svg>
                  Pengumuman Gereja
                </NuxtLink>
              </div>
            </div>

            <!-- 3. PERIBADATAN & AGENDA -->
            <div v-if="groupVisibility.peribadatan">
              <div @click="openGroups.peribadatan = !openGroups.peribadatan"
                class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none"
                :class="isGroupActive('peribadatan') ? 'bg-[#882f1d]/10 text-[#882f1d]' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                <svg class="w-5 h-5 mr-3 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="flex-1 font-bold">Peribadatan & Agenda</span>
                <svg class="w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 text-[#882f1d]"
                  :class="openGroups.peribadatan ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.peribadatan" class="ml-4 pl-3 border-l-2 border-[#882f1d]/30 space-y-1 mt-1">
                <NuxtLink v-if="menuVisibility.massSchedules" to="/admin/mass-schedules"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/mass-schedules' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/mass-schedules' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Kelola Jadwal Misa
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.liturgyTypes" :prefetch="false" to="/admin/liturgy-types"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/liturgy-types' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/liturgy-types' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"></path>
                  </svg>
                  Kelola Jenis Liturgi
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.agenda" to="/admin/agenda"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/agenda' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/agenda' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Kelola Agenda Paroki
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.agendaCategories" to="/admin/categories"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/categories' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/categories' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori Agenda
                </NuxtLink>
              </div>
            </div>

            <!-- 4. LAYANAN PEMESANAN RUANG -->
            <div v-if="groupVisibility.booking">
              <div @click="openGroups.booking = !openGroups.booking"
                class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none"
                :class="isGroupActive('booking') ? 'bg-[#882f1d]/10 text-[#882f1d]' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                <svg class="w-5 h-5 mr-3 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <span class="flex-1 font-bold">Layanan Pemesanan Ruang</span>
                <svg class="w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 text-[#882f1d]"
                  :class="openGroups.booking ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.booking" class="ml-4 pl-3 border-l-2 border-[#882f1d]/30 space-y-1 mt-1">
                <NuxtLink v-if="menuVisibility.bookings" to="/admin/bookings-new"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/bookings-new' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/bookings-new' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4">
                    </path>
                  </svg>
                  Kelola Pemesanan Masuk
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.rooms" to="/admin/rooms"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/rooms' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/rooms' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                    </path>
                  </svg>
                  Master Ruangan & Fasilitas
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.bookingReport" to="/admin/bookings-report"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/bookings-report' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/bookings-report' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  Laporan & Statistik Pemesanan
                </NuxtLink>
              </div>
            </div>

            <!-- 5. KRONIK PAROKI -->
            <div v-if="groupVisibility.kronik">
              <div @click="openGroups.kronik = !openGroups.kronik"
                class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none"
                :class="isGroupActive('kronik') ? 'bg-[#882f1d]/10 text-[#882f1d]' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                <svg class="w-5 h-5 mr-3 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                <span class="flex-1 font-bold">Kronik Paroki</span>
                <svg class="w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 text-[#882f1d]"
                  :class="openGroups.kronik ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.kronik" class="ml-4 pl-3 border-l-2 border-[#882f1d]/30 space-y-1 mt-1">
                <NuxtLink v-if="menuVisibility.kronikEntries" to="/admin/kronik"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/kronik' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/kronik' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Kelola Catatan Kronik
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.kronikSections" to="/admin/kronik/sections"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/kronik/sections' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/kronik/sections' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Pengaturan Seksi BGKP & DPP
                </NuxtLink>
              </div>
            </div>

            <!-- 6. DOKUMEN & INTERAKSI UMAT -->
            <div v-if="groupVisibility.dokumen_interaksi">
              <div @click="openGroups.dokumen_interaksi = !openGroups.dokumen_interaksi"
                class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none"
                :class="isGroupActive('dokumen_interaksi') ? 'bg-[#882f1d]/10 text-[#882f1d]' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                <svg class="w-5 h-5 mr-3 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                  </path>
                </svg>
                <span class="flex-1 font-bold">Dokumen & Interaksi Umat</span>
                <svg class="w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 text-[#882f1d]"
                  :class="openGroups.dokumen_interaksi ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.dokumen_interaksi" class="ml-4 pl-3 border-l-2 border-[#882f1d]/30 space-y-1 mt-1">
                <NuxtLink v-if="menuVisibility.documents" to="/admin/documents"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/documents' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/documents' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  Kelola Dokumen Paroki
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.documentCategories" to="/admin/document-categories"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/document-categories' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/document-categories' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori Dokumen
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.contactMessages" to="/admin/contact-messages"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/contact-messages' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/contact-messages' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                    </path>
                  </svg>
                  Pesan Masuk (Kontak)
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.chatbotFaqs" to="/admin/chatbot-faqs"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/chatbot-faqs' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/chatbot-faqs' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                  </svg>
                  Kelola Chatbot FAQ Umat
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.chatbotFaqCategories" to="/admin/chatbot-faq-categories"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/chatbot-faq-categories' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/chatbot-faq-categories' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori FAQ
                </NuxtLink>
              </div>
            </div>

            <!-- 7. PENGATURAN SISTEM & AKSES -->
            <div v-if="groupVisibility.pengaturan_sistem">
              <div @click="openGroups.pengaturan_sistem = !openGroups.pengaturan_sistem"
                class="flex items-center px-4 py-2.5 text-sm font-bold rounded-lg transition-colors duration-200 cursor-pointer select-none"
                :class="isGroupActive('pengaturan_sistem') ? 'bg-[#882f1d]/10 text-[#882f1d]' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                <svg class="w-5 h-5 mr-3 text-[#882f1d] flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                  </path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                <span class="flex-1 font-bold">Pengaturan Sistem & Akses</span>
                <svg class="w-4 h-4 ml-auto transition-transform duration-200 flex-shrink-0 text-[#882f1d]"
                  :class="openGroups.pengaturan_sistem ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.pengaturan_sistem" class="ml-4 pl-3 border-l-2 border-[#882f1d]/30 space-y-1 mt-1">
                <NuxtLink v-if="menuVisibility.users" to="/admin/users"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/users' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/users' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
                    </path>
                  </svg>
                  Kelola Pengguna (User)
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.userCategories" to="/admin/user-categories"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/user-categories' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/user-categories' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori Pengguna
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.heroThemes" to="/admin/hero-themes"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/hero-themes' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/hero-themes' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                  Pengelola Tema Hero
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.footerSettings" to="/admin/footer-settings"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/footer-settings' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/footer-settings' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4">
                    </path>
                  </svg>
                  Pengaturan Footer
                </NuxtLink>
                <NuxtLink v-if="user?.role_name === 'super_admin'" to="/admin/maintenance"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/maintenance' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/maintenance' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Maintenance Halaman
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.backup" to="/admin/backup"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/backup' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/backup' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
                    </path>
                  </svg>
                  Database Backup
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.restore" to="/admin/restore"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/restore' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/restore' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                    </path>
                  </svg>
                  Database Restore
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.migrations" to="/admin/migrations"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/migrations' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/migrations' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  DB Migrations
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.contentReport" to="/admin/content-report"
                  class="flex items-center px-3 py-2 text-sm font-bold rounded-lg transition-colors duration-200"
                  :class="$route.path === '/admin/content-report' ? 'bg-[#882f1d] text-white shadow-xs' : 'text-gray-800 hover:bg-[#882f1d]/10 hover:text-[#882f1d]'">
                  <svg class="w-4 h-4 mr-2.5 flex-shrink-0" :class="$route.path === '/admin/content-report' ? 'text-white' : 'text-[#882f1d]'" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  Laporan Aktivitas Konten
                </NuxtLink>
              </div>
            </div>

          </nav>

          <!-- Logout -->
          <div class="p-4 border-t flex-shrink-0 bg-gray-50/50">
            <button @click="handleLogout"
              class="flex items-center w-full px-4 py-2.5 text-sm font-bold text-red-600 rounded-lg hover:bg-red-50 transition-colors duration-200">
              <svg class="w-5 h-5 mr-3 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              <span>Logout Admin</span>
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col min-w-0">
      <!-- Header -->
      <header id="admin-topheader" class="bg-white shadow-sm flex-shrink-0">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-cinzel text-gray-900 font-bold">{{ pageTitle }}</h2>
              <p class="text-sm text-gray-600">Selamat datang di panel admin CMS</p>
              <p v-if="user" class="text-xs text-[#882f1d] font-semibold mt-0.5">Anda login sebagai: {{ user.role_display_name }}</p>
            </div>
            <div class="text-sm text-gray-500 font-medium">
              {{ currentDate }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6 overflow-y-auto">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>

// User state
const user = useState('admin-layout-user', () => null)

// Group toggle states (8 Terstruktur)
const openGroups = reactive({
  profil_paroki: false,
  publikasi: false,
  peribadatan: false,
  booking: false,
  kronik: false,
  dokumen_interaksi: false,
  pengaturan_sistem: false
})

// Auto-open sidebar group berdasarkan route saat ini
const route = useRoute()
const groupRouteMap = {
  profil_paroki: ['/admin/pastors', '/admin/dpp', '/admin/bgkp', '/admin/teritorial', '/admin/parish-statistics'],
  publikasi: ['/admin/news', '/admin/articles', '/admin/article-categories', '/admin/gallery', '/admin/gallery-categories', '/admin/announcements'],
  peribadatan: ['/admin/mass-schedules', '/admin/liturgy-types', '/admin/agenda', '/admin/categories'],
  booking: ['/admin/bookings-new', '/admin/rooms', '/admin/bookings-report'],
  kronik: ['/admin/kronik', '/admin/kronik/sections'],
  dokumen_interaksi: ['/admin/documents', '/admin/document-categories', '/admin/contact-messages', '/admin/chatbot-faqs', '/admin/chatbot-faq-categories'],
  pengaturan_sistem: ['/admin/users', '/admin/user-categories', '/admin/hero-themes', '/admin/footer-settings', '/admin/maintenance', '/admin/backup', '/admin/restore', '/admin/migrations', '/admin/content-report']
}

watch(() => route.path, (newPath) => {
  for (const [group, routes] of Object.entries(groupRouteMap)) {
    if (routes.some(r => newPath.startsWith(r))) {
      openGroups[group] = true
    }
  }
}, { immediate: true })

// Persist decoded admin identity across navigations to avoid menu flashes
onMounted(async () => {
  try {
    // Only check for admin token - users should NOT be here
    const token = sessionStorage.getItem('admin_access_token')

    if (!token) {
      navigateTo('/admin/login')
      return
    }

    const decoded = JSON.parse(atob(token.split('.')[1]))

    // Always refresh layout identity from token/API to avoid stale role after account switch.
    let resolvedRole = decoded.role
    let resolvedPermissions = []

    try {
      const me = await $fetch('/api/admin/me', {
        headers: {
          Authorization: `Bearer ${token}`
        },
        cache: 'no-cache'
      })

      if (me?.role) {
        resolvedRole = me.role
      }

      if (Array.isArray(me?.permissions)) {
        resolvedPermissions = me.permissions
      }
    } catch {
      // Keep decoded token role if /api/admin/me is temporarily unavailable.
    }

    user.value = {
      id: decoded.userId,
      role_name: resolvedRole,
      role_display_name: resolvedRole === 'super_admin' ? 'Super Admin' :
        resolvedRole === 'admin_komsos' ? 'Admin Komsos' :
          resolvedRole === 'admin_sekretariat' ? 'Admin Sekretariat' : resolvedRole,
      permissions: resolvedPermissions
    }
  } catch (error) {
    // If failed to decode token, redirect to login
    navigateTo('/admin/login')
  }
})

// Helper function to check permissions
const hasPermission = (permission) => {
  return user.value?.permissions?.includes(permission) || false
}

// Computed for menu visibility
const menuVisibility = computed(() => {
  // Super Admin has access to all features
  if (user.value?.role_name === 'super_admin') {
    return {
      dashboard: true,
      articles: true,
      articleCategories: true,
      news: true,
      gallery: true,
      agenda: true,
      regularMassSchedules: true,
      agendaCategories: true,
      liturgyTypes: true,
      contactMessages: true,
      announcements: true,
      users: true,
      userCategories: true,
      rooms: true,
      bookings: true,
      bookingReport: true,
      contentReport: true,
      signage: true,
      chatbotFaqCategories: true,
      chatbotFaqs: true,
      heroThemes: true,
      massSchedules: true,
      pastors: true,
      bgkp: true,
      dpp: true,
      teritorial: true,
      documentCategories: true,
      documents: true,
      footerSettings: true,
      parishStatistics: true,
      backup: true,
      restore: true,
      migrations: true,
      kronikEntries: true,
      kronikSections: true
    }
  }

  // Admin Komsos: Akses ke Kelompok 1 - 7, serta Tema Hero, Footer, Laporan Konten di Kelompok 8
  else if (user.value?.role_name === 'admin_komsos') {
    return {
      dashboard: true,
      // Kelompok 1: Profil & Struktur Paroki
      pastors: true,
      dpp: true,
      bgkp: true,
      teritorial: true,
      parishStatistics: true,
      // Kelompok 2: Publikasi & Konten Media
      articles: true,
      articleCategories: true,
      news: true,
      gallery: true,
      galleryCategories: true,
      announcements: true,
      // Kelompok 3: Peribadatan & Agenda
      agenda: true,
      agendaCategories: true,
      regularMassSchedules: true,
      massSchedules: true,
      liturgyTypes: true,
      // Kelompok 4: Layanan Pemesanan Ruang
      bookings: true,
      rooms: true,
      bookingReport: true,
      // Kelompok 5: Kronik Paroki
      kronikEntries: true,
      kronikSections: true,
      // Kelompok 6: Dokumen & Interaksi Umat
      documents: true,
      documentCategories: true,
      contactMessages: true,
      chatbotFaqs: true,
      chatbotFaqCategories: true,
      // Kelompok 7: Pengaturan Sistem & Akses
      users: false,
      userCategories: false,
      heroThemes: true,
      footerSettings: true,
      contentReport: true,
      signage: true,
      backup: false,
      restore: false,
      migrations: false
    }
  }

  // Admin Sekretariat: Akses ke Kelompok 1 - 7, serta Kelola Pengguna di Kelompok 8
  else if (user.value?.role_name === 'admin_sekretariat') {
    return {
      dashboard: true,
      // Kelompok 1: Profil & Struktur Paroki
      pastors: true,
      dpp: true,
      bgkp: true,
      teritorial: true,
      parishStatistics: true,
      // Kelompok 2: Publikasi & Konten Media
      articles: true,
      articleCategories: true,
      news: true,
      gallery: true,
      galleryCategories: true,
      announcements: true,
      // Kelompok 3: Peribadatan & Agenda
      agenda: true,
      agendaCategories: true,
      regularMassSchedules: true,
      massSchedules: true,
      liturgyTypes: true,
      // Kelompok 4: Layanan Pemesanan Ruang
      bookings: true,
      rooms: true,
      bookingReport: true,
      // Kelompok 5: Kronik Paroki
      kronikEntries: true,
      kronikSections: true,
      // Kelompok 6: Dokumen & Interaksi Umat
      documents: true,
      documentCategories: true,
      contactMessages: true,
      chatbotFaqs: true,
      chatbotFaqCategories: true,
      // Kelompok 7: Pengaturan Sistem & Akses
      users: true,
      userCategories: true,
      heroThemes: false,
      footerSettings: false,
      contentReport: false,
      signage: true,
      backup: false,
      restore: false,
      migrations: false
    }
  }

  // Default for other roles or no user: only Dashboard
  else {
    return {
      dashboard: true,
      articles: false,
      articleCategories: false,
      news: false,
      gallery: false,
      agenda: false,
      regularMassSchedules: false,
      agendaCategories: false,
      contactMessages: false,
      users: false,
      rooms: false,
      bookings: false,
      chatbotFaqCategories: false,
      chatbotFaqs: false,
      heroThemes: false,
      pastors: false,
      documentCategories: false,
      documents: false
    }
  }
})

// Computed for group visibility
const groupVisibility = computed(() => {
  return {
    profil_paroki: menuVisibility.value.pastors || menuVisibility.value.dpp || menuVisibility.value.bgkp || menuVisibility.value.teritorial || menuVisibility.value.parishStatistics,
    publikasi: menuVisibility.value.news || menuVisibility.value.articles || menuVisibility.value.articleCategories || menuVisibility.value.gallery || menuVisibility.value.announcements,
    peribadatan: menuVisibility.value.massSchedules || menuVisibility.value.liturgyTypes || menuVisibility.value.agenda || menuVisibility.value.agendaCategories,
    booking: menuVisibility.value.bookings || menuVisibility.value.rooms || menuVisibility.value.bookingReport,
    kronik: menuVisibility.value.kronikEntries || menuVisibility.value.kronikSections,
    dokumen_interaksi: menuVisibility.value.documents || menuVisibility.value.documentCategories || menuVisibility.value.contactMessages || menuVisibility.value.chatbotFaqs || menuVisibility.value.chatbotFaqCategories,
    pengaturan_sistem: menuVisibility.value.users || menuVisibility.value.userCategories || menuVisibility.value.heroThemes || menuVisibility.value.footerSettings || menuVisibility.value.backup || menuVisibility.value.restore || menuVisibility.value.migrations || menuVisibility.value.contentReport
  }
})

// Function to check if group is active
const isGroupActive = (group) => {
  const routes = groupRouteMap[group] || []
  return routes.some(route => useRoute().path.startsWith(route))
}

const pageTitle = computed(() => {
  const route = useRoute()
  if (route.path === '/admin/dashboard') return 'Dashboard'
  if (route.path === '/admin/articles') return 'Kelola Artikel'
  if (route.path === '/admin/article-categories') return 'Kategori Artikel / Berita'
  if (route.path === '/admin/news') return 'Kelola Berita'
  if (route.path === '/admin/gallery') return 'Kelola Galeri'
  if (route.path === '/admin/gallery-categories') return 'Kategori Galeri'
  if (route.path === '/admin/agenda') return 'Kelola Agenda'
  if (route.path === '/admin/liturgy-types') return 'Kelola Jenis Liturgi'
  if (route.path === '/admin/mass-schedules') return 'Kelola Jadwal Misa'
  if (route.path === '/admin/pastors') return 'Romo Bertugas'
  if (route.path === '/admin/bgkp') return 'Kelola BGKP Paroki'
  if (route.path === '/admin/dpp') return 'Kelola DPP Paroki'
  if (route.path === '/admin/categories') return 'Kelola Kategori Agenda'
  if (route.path === '/admin/contact-messages') return 'Pesan Masuk'
  if (route.path === '/admin/users') return 'Kelola Pengguna'
  if (route.path === '/admin/user-categories') return 'Kelola Kategori Pengguna'
  if (route.path === '/admin/rooms') return 'Kelola Ruangan'
  if (route.path === '/admin/bookings-new') return 'Kelola Pemesanan'
  if (route.path === '/admin/bookings-report') return 'Laporan Pemesanan'
  if (route.path === '/admin/content-report') return 'Laporan Konten'
  if (route.path === '/admin/chatbot-faq-categories') return 'Kategori Chatbot FAQ'
  if (route.path === '/admin/chatbot-faqs') return 'Kelola Chatbot FAQ'
  if (route.path === '/admin/hero-themes') return 'Pengelola Tema Hero'
  if (route.path === '/admin/document-categories') return 'Kelola Kategori Dokumen'
  if (route.path === '/admin/documents') return 'Kelola Dokumen'
  if (route.path === '/admin/footer-settings') return 'Pengaturan Footer'
  if (route.path === '/admin/parish-statistics') return 'Statistik Paroki'
  if (route.path === '/admin/announcements') return 'Pengumuman Gereja'
  if (route.path === '/admin/backup') return 'Database Backup'
  if (route.path === '/admin/restore') return 'Database Restore'
  if (route.path === '/admin/migrations') return 'DB Migrations'
  if (route.path === '/admin/kronik') return 'Kelola Kronik'
  if (route.path === '/admin/kronik/create') return 'Buat Kronik Baru'
  if (route.path === '/admin/kronik/sections') return 'Kelola BGKP & DPP'
  return 'Admin Panel'
})

const currentDate = computed(() => {
  return new Date().toLocaleDateString('id-ID', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })
})

const handleLogout = async () => {
  try {
    // Clear all admin tokens from local storage
    localStorage.removeItem('admin_token')
    sessionStorage.removeItem('admin_access_token')
    localStorage.removeItem('admin_refresh_token')

    // Clear user state immediately
    user.value = null

    // Clear all reactive states to prevent residue
    Object.keys(openGroups).forEach(key => {
      openGroups[key] = false
    })

    // Add a small delay to ensure cleanup is complete before navigation
    await nextTick()

    // Navigate to admin login page
    await navigateTo('/admin/login')
  } catch (error) {
    console.error('Logout error:', error)
    // Force navigation even if cleanup fails
    await navigateTo('/admin/login')
  }
}
</script>

<style scoped>
/* Scrollbar styling for admin sidebar */
nav::-webkit-scrollbar {
  width: 5px;
}
nav::-webkit-scrollbar-track {
  background: transparent;
}
nav::-webkit-scrollbar-thumb {
  background: #e2e8f0;
  border-radius: 9999px;
}
nav::-webkit-scrollbar-thumb:hover {
  background: #cbd5e1;
}
</style>
