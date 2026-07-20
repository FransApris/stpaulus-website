<template>
  <div class="min-h-screen bg-gray-50 flex">
    <!-- Sidebar -->
    <ClientOnly>
      <div id="admin-sidebar" class="w-64 bg-white shadow-lg">
        <div class="flex flex-col h-full">
          <!-- Logo/Header -->
          <div class="flex items-center justify-center h-16 px-4 bg-[#882f1d]">
            <img src="/images/logo-paulus-juanda.png" alt="Logo Paroki St. Paulus" class="h-10 w-auto mr-3" />
            <h1 class="text-xl font-cinzel text-white">CMS Admin</h1>
          </div>

          <!-- Navigation -->
          <nav class="flex-1 px-4 py-6 space-y-2">
            <!-- Dashboard -->
            <NuxtLink v-if="menuVisibility.dashboard" to="/admin/dashboard"
              class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-[#882f1d] focus:ring-opacity-50"
              :class="$route.path === '/admin/dashboard' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'"
              @keydown.enter="navigateTo('/admin/dashboard')" @keydown.space.prevent="navigateTo('/admin/dashboard')">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z"></path>
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M8 5a2 2 0 012-2h4a2 2 0 012 2v2H8V5z"></path>
              </svg>
              Dashboard
            </NuxtLink>

            <!-- Artikel -->
            <div v-if="groupVisibility.artikel">
              <div @click="openGroups.artikel = !openGroups.artikel"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('artikel') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                  </path>
                </svg>
                Artikel
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.artikel ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.artikel" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.articles" to="/admin/articles" :prefetch="false"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/articles' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  Kelola Artikel
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.articleCategories" to="/admin/article-categories"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/article-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori Artikel / Berita
                </NuxtLink>
              </div>
            </div>

            <!-- Berita -->
            <div v-if="groupVisibility.berita">
              <div @click="openGroups.berita = !openGroups.berita"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('berita') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                  </path>
                </svg>
                Berita
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.berita ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.berita" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.news" to="/admin/news" :prefetch="false"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/news' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z">
                    </path>
                  </svg>
                  Kelola Berita
                </NuxtLink>
              </div>
            </div>

            <!-- Galeri -->
            <div v-if="groupVisibility.galeri">
              <div @click="openGroups.galeri = !openGroups.galeri"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('galeri') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                  </path>
                </svg>
                Galeri
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.galeri ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.galeri" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.gallery" to="/admin/gallery"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/gallery' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                  Kelola Galeri
                </NuxtLink>
                <NuxtLink v-if="hasPermission('manage_gallery_categories')" to="/admin/gallery-categories"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/gallery-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori Galeri
                </NuxtLink>
              </div>
            </div>

            <!-- Chatbot -->
            <div v-if="groupVisibility.chatbot">
              <div @click="openGroups.chatbot = !openGroups.chatbot"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('chatbot') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                  </path>
                </svg>
                Chatbot FAQ
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.chatbot ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.chatbot" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.chatbotFaqs" to="/admin/chatbot-faqs"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/chatbot-faqs' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z">
                    </path>
                  </svg>
                  Kelola Chatbot FAQ
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.chatbotFaqCategories" to="/admin/chatbot-faq-categories"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/chatbot-faq-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kategori Chatbot FAQ
                </NuxtLink>
              </div>
            </div>

            <!-- Kronik Paroki -->
            <div v-if="groupVisibility.kronik">
              <div @click="openGroups.kronik = !openGroups.kronik"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('kronik') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
                Kronik Paroki
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.kronik ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.kronik" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.kronikEntries" to="/admin/kronik"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/kronik' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Kelola Kronik
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.kronikSections" to="/admin/kronik/sections"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/kronik/sections' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                  </svg>
                  Kelola BGKP & DPP
                </NuxtLink>
              </div>
            </div>

            <!-- Jadwal & Agenda -->
            <div v-if="groupVisibility.schedule">
              <div @click="openGroups.schedule = !openGroups.schedule"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('schedule') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                Jadwal & Agenda
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.schedule ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.schedule" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.agenda" to="/admin/agenda"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/agenda' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Kelola Agenda
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.agendaCategories" to="/admin/categories"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253">
                    </path>
                  </svg>
                  Kelola Kategori Agenda
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.massSchedules" to="/admin/mass-schedules"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/mass-schedules' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                  </svg>
                  Kelola Jadwal Misa
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.liturgyTypes" :prefetch="false" to="/admin/liturgy-types"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/liturgy-types' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                  </svg>
                  Kelola Jenis Liturgi
                </NuxtLink>
              </div>
            </div>

            <!-- Administrasi Paroki -->
            <div v-if="groupVisibility.admin">
              <div @click="openGroups.admin = !openGroups.admin"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('admin') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                  </path>
                </svg>
                Administrasi Paroki
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.admin ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.admin" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.users" to="/admin/users"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/users' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z">
                    </path>
                  </svg>
                  Kelola Pengguna
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.rooms" to="/admin/rooms"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/rooms' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4">
                    </path>
                  </svg>
                  Kelola Ruangan
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.userCategories" to="/admin/user-categories"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/user-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kelola Kategori
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.bookings" to="/admin/bookings-new"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/bookings-new' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4">
                    </path>
                  </svg>
                  Kelola Pemesanan
                </NuxtLink>

                <NuxtLink v-if="menuVisibility.bookingReport" to="/admin/bookings-report"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/bookings-report' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  Laporan Pemesanan
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.contentReport" to="/admin/content-report"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/content-report' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  Laporan Konten
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.contactMessages" to="/admin/contact-messages"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/contact-messages' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z">
                    </path>
                  </svg>
                  Pesan Masuk
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.announcements" to="/admin/announcements"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/announcements' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M11 5.882V19.24a1.76 1.76 0 01-3.417.592l-2.147-6.15M18 13a3 3 0 100-6M5.436 13.683A4.001 4.001 0 017 6h1.832c4.1 0 7.625-1.234 9.168-3v14c-1.543-1.766-5.067-3-9.168-3H7a3.988 3.988 0 01-1.564-.317z">
                    </path>
                  </svg>
                  Pengumuman Gereja
                </NuxtLink>
              </div>
            </div>

            <!-- Manajemen Dokumen -->
            <div v-if="groupVisibility.documents">
              <div @click="openGroups.documents = !openGroups.documents"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('documents') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                  </path>
                </svg>
                Manajemen Dokumen
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.documents ? 'rotate-90' : ''" fill="none" stroke="currentColor"
                  viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.documents" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.documentCategories" to="/admin/document-categories"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/document-categories' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z">
                    </path>
                  </svg>
                  Kelola Kategori Dokumen
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.documents" to="/admin/documents"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/documents' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z">
                    </path>
                  </svg>
                  Kelola Dokumen
                </NuxtLink>
              </div>
            </div>

            <!-- Pengaturan -->
            <div v-if="groupVisibility.theme">
              <div @click="openGroups.theme = !openGroups.theme"
                class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200 cursor-pointer"
                :class="isGroupActive('theme') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z">
                  </path>
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path>
                </svg>
                Pengaturan
                <svg class="w-4 h-4 ml-auto transition-transform duration-200"
                  :class="openGroups.theme ? 'rotate-90' : ''" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                </svg>
              </div>
              <div v-show="openGroups.theme" class="ml-6 space-y-1">
                <NuxtLink v-if="menuVisibility.pastors" to="/admin/pastors"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path.startsWith('/admin/pastors') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                  </svg>
                  Romo Bertugas
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.bgkp" to="/admin/bgkp"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path.startsWith('/admin/bgkp') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z">
                    </path>
                  </svg>
                  BGKP Paroki
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.dpp" to="/admin/dpp"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path.startsWith('/admin/dpp') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z">
                    </path>
                  </svg>
                  DPP Paroki
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.teritorial" to="/admin/teritorial"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path.startsWith('/admin/teritorial') ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                  </svg>
                  Wilayah & Lingkungan
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.heroThemes" to="/admin/hero-themes"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/hero-themes' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z">
                    </path>
                  </svg>
                  Pengelola Tema Hero
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.footerSettings" to="/admin/footer-settings"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/footer-settings' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 100 4m0-4v2m0-6V4">
                    </path>
                  </svg>
                  Pengaturan Footer
                </NuxtLink>
                <!-- Maintenance Halaman -->
                <NuxtLink to="/admin/maintenance"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/maintenance' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  Maintenance Halaman
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.parishStatistics" to="/admin/parish-statistics"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/parish-statistics' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z">
                    </path>
                  </svg>
                  Statistik Paroki
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.backup" to="/admin/backup"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/backup' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4">
                    </path>
                  </svg>
                  Database Backup
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.restore" to="/admin/restore"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/restore' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15">
                    </path>
                  </svg>
                  Database Restore
                </NuxtLink>
                <NuxtLink v-if="menuVisibility.migrations" to="/admin/migrations"
                  class="flex items-center px-4 py-2 text-sm font-medium rounded-md transition-colors duration-200"
                  :class="$route.path === '/admin/migrations' ? 'bg-[#882f1d] text-white' : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'">
                  <svg class="w-4 h-4 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
                  </svg>
                  DB Migrations
                </NuxtLink>
              </div>
            </div>

          </nav>

          <!-- Logout -->
          <div class="p-4 border-t">
            <button @click="handleLogout"
              class="flex items-center w-full px-4 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-100 hover:text-gray-900 transition-colors duration-200">
              <svg class="w-5 h-5 mr-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </ClientOnly>

    <!-- Main Content -->
    <div class="flex-1 flex flex-col">
      <!-- Header -->
      <header id="admin-topheader" class="bg-white shadow-sm">
        <div class="px-6 py-4">
          <div class="flex items-center justify-between">
            <div>
              <h2 class="text-2xl font-cinzel text-gray-900">{{ pageTitle }}</h2>
              <p class="text-sm text-gray-600">Selamat datang di panel admin CMS</p>
              <p v-if="user" class="text-sm text-gray-500">Anda login sebagai: {{ user.role_display_name }}</p>
            </div>
            <div class="text-sm text-gray-500">
              {{ currentDate }}
            </div>
          </div>
        </div>
      </header>

      <!-- Page Content -->
      <main class="flex-1 p-6">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>

// User state
const user = useState('admin-layout-user', () => null)

// Group toggle states
const openGroups = reactive({
  artikel: false,
  berita: false,
  galeri: false,
  chatbot: false,
  schedule: false,
  admin: false,
  theme: false,
  documents: false,
  footer: false,
  kronik: false
})

// Auto-open sidebar group berdasarkan route saat ini
const route = useRoute()
const groupRouteMap = {
  artikel: ['/admin/articles', '/admin/article-categories'],
  berita: ['/admin/news'],
  galeri: ['/admin/gallery', '/admin/gallery-categories'],
  chatbot: ['/admin/chatbot-faq-categories', '/admin/chatbot-faqs'],
  kronik: ['/admin/kronik'],
  schedule: ['/admin/agenda', '/admin/categories', '/admin/liturgy-types', '/admin/regular-mass-schedules', '/admin/mass-schedules'],
  admin: ['/admin/users', '/admin/user-categories', '/admin/rooms', '/admin/bookings-new', '/admin/announcements', '/admin/contact-messages', '/admin/signage'],
  theme: ['/admin/hero-themes', '/admin/backup', '/admin/parish-statistics', '/admin/pastors', '/admin/bgkp', '/admin/teritorial', '/admin/footer-settings', '/admin/dpp', '/admin/migrations'],
  documents: ['/admin/document-categories', '/admin/documents']
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

  // Admin Komsos: Dashboard, Kelola Artikel, News, Gallery, Chatbot
  else if (user.value?.role_name === 'admin_komsos') {
    return {
      dashboard: true,
      articles: true,
      articleCategories: hasPermission('manage_article_categories'),
      news: true,
      gallery: true,
      agenda: false,
      regularMassSchedules: false,
      agendaCategories: false,
      contactMessages: false,
      announcements: false,
      users: false,
      rooms: false,
      bookings: false,
      signage: false,
      chatbotFaqCategories: hasPermission('manage_chatbot_faqs') || hasPermission('manage_chatbot'),
      chatbotFaqs: true,
      heroThemes: true,
      pastors: false,
      bgkp: false,
      dpp: false,
      teritorial: false,
      documentCategories: false,
      documents: false,
      kronikEntries: true,
      kronikSections: false,
      contentReport: true,
      bookingReport: false
    }
  }

  // Admin Sekretariat: Dashboard, Agenda, Users, Rooms, Bookings, Mass Schedules, Documents
  else if (user.value?.role_name === 'admin_sekretariat') {
    return {
      dashboard: true,
      articles: false,
      articleCategories: false,
      news: false,
      gallery: false,
      agenda: true,
      regularMassSchedules: false,
      massSchedules: true,
      liturgyTypes: true,
      pastors: true,
      bgkp: true,
      dpp: true,
      teritorial: true,
      agendaCategories: false,
      contactMessages: hasPermission('manage_contact_messages'),
      announcements: hasPermission('manage_church_announcements'),
      users: hasPermission('manage_users') || hasPermission('manage_users_komsos_sekretariat'),
      rooms: true,
      bookings: true,
      bookingReport: true,
      signage: true,
      contentReport: false,
      chatbotFaqCategories: false,
      chatbotFaqs: false,
      documentCategories: true,
      documents: true,
      footerSettings: hasPermission('manage_footer'),
      parishStatistics: hasPermission('manage_users_komsos_sekretariat'),
      backup: hasPermission('manage_content'),
      kronikEntries: true,
      kronikSections: true
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
    artikel: menuVisibility.value.articles || menuVisibility.value.articleCategories,
    berita: menuVisibility.value.news,
    galeri: menuVisibility.value.gallery,
    chatbot: menuVisibility.value.chatbotFaqCategories || menuVisibility.value.chatbotFaqs,
    kronik: menuVisibility.value.kronikEntries || menuVisibility.value.kronikSections,
    schedule: menuVisibility.value.agenda || menuVisibility.value.agendaCategories || menuVisibility.value.regularMassSchedules || menuVisibility.value.massSchedules || menuVisibility.value.liturgyTypes,
    admin: menuVisibility.value.users || menuVisibility.value.userCategories || menuVisibility.value.rooms || menuVisibility.value.bookings || menuVisibility.value.bookingReport || menuVisibility.value.contentReport,
    theme: menuVisibility.value.heroThemes || menuVisibility.value.footerSettings || menuVisibility.value.backup || menuVisibility.value.parishStatistics || menuVisibility.value.pastors || menuVisibility.value.bgkp || menuVisibility.value.teritorial || menuVisibility.value.migrations,
    documents: menuVisibility.value.documentCategories || menuVisibility.value.documents
  }
})

// Function to check if group is active
const isGroupActive = (group) => {
  const routes = {
    artikel: ['/admin/articles', '/admin/article-categories'],
    berita: ['/admin/news'],
    galeri: ['/admin/gallery', '/admin/gallery-categories'],
    chatbot: ['/admin/chatbot-faq-categories', '/admin/chatbot-faqs'],
    kronik: ['/admin/kronik', '/admin/kronik/create', '/admin/kronik/sections'],
    schedule: ['/admin/agenda', '/admin/categories', '/admin/liturgy-types', '/admin/regular-mass-schedules', '/admin/mass-schedules'],
    admin: ['/admin/users', '/admin/user-categories', '/admin/rooms', '/admin/bookings-new', '/admin/bookings-report', '/admin/content-report', '/admin/announcements', '/admin/contact-messages'],
    theme: ['/admin/hero-themes', '/admin/backup', '/admin/parish-statistics', '/admin/pastors', '/admin/bgkp', '/admin/teritorial', '/admin/footer-settings'],
    documents: ['/admin/document-categories', '/admin/documents'],
    footer: ['/admin/footer-settings']
  }
  return routes[group]?.some(route => useRoute().path.startsWith(route)) || false
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
