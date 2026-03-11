<template>
  <footer class="relative bg-gray-800 text-white py-8 pb-24 md:pb-8 dark:bg-gray-900 z-0">
    <div class="container mx-auto max-w-7xl px-4 sm:px-[5%] md:px-[7%] lg:px-[10%]">
      <!-- Footer Description and Address -->
      <div v-if="footerData.settings?.footer_description || footerData.settings?.physical_address" class="mb-8">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div v-if="footerData.settings?.footer_description" class="text-center md:text-left">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Tentang Kami</h3>
            <p class="text-gray-300 text-sm leading-relaxed">{{ footerData.settings.footer_description }}</p>
          </div>
          <div v-if="footerData.settings?.physical_address" class="text-center md:text-right">
            <h3 class="text-sm font-semibold text-gray-400 uppercase tracking-wider mb-2">Alamat</h3>
            <div class="flex items-start justify-center md:justify-end">
              <svg class="w-5 h-5 mt-0.5 mr-2 text-red-400 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fill-rule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clip-rule="evenodd" />
              </svg>
              <p class="text-gray-300 text-sm leading-relaxed break-words max-w-xs">{{ footerData.settings.physical_address }}</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Footer Content -->
      <div class="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
        <!-- Legal Menu -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Legal</h3>
          <ul class="space-y-2">
            <li v-for="link in footerData.links.legal" :key="link.id">
              <NuxtLink
                :to="link.url"
                class="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {{ link.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Support Menu -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Dukungan</h3>
          <ul class="space-y-2">
            <li v-for="link in footerData.links.support" :key="link.id">
              <NuxtLink
                :to="link.url"
                class="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {{ link.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>

        <!-- Content Menu -->
        <div>
          <h3 class="text-lg font-semibold mb-4">Eksplorasi</h3>
          <ul class="space-y-2">
            <li v-for="link in footerData.links.content" :key="link.id">
              <NuxtLink
                :to="link.url"
                class="text-gray-300 hover:text-white transition-colors duration-200"
              >
                {{ link.title }}
              </NuxtLink>
            </li>
          </ul>
        </div>
      </div>

      <!-- Social Media Links -->
      <div class="flex justify-center space-x-6 mb-8" v-if="footerData.socialLinks.length > 0">
        <a
          v-for="social in footerData.socialLinks"
          :key="social.id"
          :href="social.url"
          target="_blank"
          rel="noopener noreferrer"
          class="text-gray-300 hover:text-white transition-colors duration-200"
          :aria-label="social.platform_name"
        >
          <i :class="social.platform_icon" class="text-xl"></i>
        </a>
      </div>

      <!-- Copyright -->
      <div class="border-t border-gray-700 pt-8 text-center">
        <p class="text-sm text-gray-300">
          © {{ currentYear }} {{ footerData.settings?.copyright_entity || 'KOMSOS Paroki St. Paulus - Juanda' }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup lang="ts">
// TypeScript interfaces for type safety
interface FooterSettings {
  id: number
  copyright_entity: string
  footer_description?: string
  physical_address?: string
  created_at: string
  updated_at: string
}

interface FooterLink {
  id: number
  title: string
  url: string
  column_type: 'legal' | 'support' | 'content'
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface FooterSocialLink {
  id: number
  platform_name: string
  platform_icon: string
  url: string
  display_order: number
  is_active: boolean
  created_at: string
  updated_at: string
}

interface FooterData {
  settings: FooterSettings | null
  socialLinks: FooterSocialLink[]
  links: {
    legal: FooterLink[]
    support: FooterLink[]
    content: FooterLink[]
  }
}

// Current year for copyright
const currentYear = new Date().getFullYear()

// Fetch footer data with SSR support
const { data: footerData } = await useFetch<FooterData>('/api/footer-settings', {
  default: () => ({
    settings: null,
    socialLinks: [],
    links: {
      legal: [],
      support: [],
      content: []
    }
  }),
  transform: (data) => data || {
    settings: null,
    socialLinks: [],
    links: {
      legal: [],
      support: [],
      content: []
    }
  }
})
</script>
