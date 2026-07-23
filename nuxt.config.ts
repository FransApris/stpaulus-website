import { defineNuxtConfig } from 'nuxt/config'

export default defineNuxtConfig({
  compatibilityDate: '2026-01-31',

  modules: [
    '@nuxt/image'
  ],

  // Auto-import components from nested folders
  components: [
    {
      path: '~/components',
      pathPrefix: false,
    },
    {
      path: '~/components/editor',
      pathPrefix: false,
    },
    {
      path: '~/components/admin',
      pathPrefix: false,
    }
  ],

  // Disable DevTools temporarily to test if it's causing the SSR warning
  devtools: {
    enabled: true // Re-enable since we disabled devLogs
  },

  // Suppress false-positive SSR warnings in development
  vueCompilerOptions: {
    suppressHydrationMismatchWarnings: true
  },

  // Reduce log noise - suppress non-critical warnings
  logLevel: process.env.NODE_ENV === 'production' ? 'info' : 'info',

  // Disable dev-server-logs for SSR warnings (development only)
  experimental: {
    devLogs: false,
    inlineSSRStyles: true
  },


  // Disable client-side rendering of SSR logs
  hooks: {
    'devtools:customTabs': () => [],
  },

  css: [
    '~/assets/css/fonts.css',
    '~/assets/css/tailwind.css',
    '~/assets/css/prose-custom.css'
  ],

  postcss: {
    plugins: {
      'postcss-import': {},
      tailwindcss: {},
      autoprefixer: {},
    },
  },

  // Performance optimization for Google Maps
  app: {
    head: {
      htmlAttrs: {
        lang: 'id'
      },
      title: 'Paroki St. Paulus - Juanda, Sidoarjo',

      titleTemplate: '%s - Paroki St. Paulus Juanda',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },
        { name: 'keywords', content: 'Gereja Katolik, Paroki St. Paulus, Juanda, Sidoarjo, Surabaya, jadwal misa, kegiatan gereja, umat katolik' },

        // Open Graph / Facebook
        { property: 'og:type', content: 'website' },
        { property: 'og:site_name', content: 'Paroki St. Paulus - Juanda, Sidoarjo' },
        { property: 'og:title', content: 'Paroki St. Paulus - Juanda, Sidoarjo' },
        { property: 'og:description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },
        { property: 'og:image', content: 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png' },
        { property: 'og:image:width', content: '1200' },
        { property: 'og:image:height', content: '630' },
        { property: 'og:image:alt', content: 'Logo Paroki St. Paulus Juanda' },
        { property: 'og:url', content: 'https://stpaulusjuanda.org' },
        { property: 'og:locale', content: 'id_ID' },

        // Twitter Card
        { name: 'twitter:card', content: 'summary_large_image' },
        { name: 'twitter:title', content: 'Paroki St. Paulus - Juanda, Sidoarjo' },
        { name: 'twitter:description', content: 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik' },
        { name: 'twitter:image', content: 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png' },
        { name: 'twitter:image:alt', content: 'Logo Paroki St. Paulus Juanda' }
      ],
      link: [
        // Favicon - Logo Paroki St. Paulus
        { rel: 'icon', type: 'image/png', href: '/images/logo-paulus-juanda.png' },
        { rel: 'apple-touch-icon', href: '/images/logo-paulus-juanda.png' },
        // Preconnect to CDNs for fast font & icon loading
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: 'anonymous' },
        { rel: 'preconnect', href: 'https://cdnjs.cloudflare.com', crossorigin: 'anonymous' },
        { rel: 'dns-prefetch', href: 'https://fonts.gstatic.com' },
        { rel: 'dns-prefetch', href: 'https://cdnjs.cloudflare.com' },
        // Preload Hero Image for instant mobile & desktop LCP
        { rel: 'preload', as: 'image', href: '/images/gereja-stpaulus-hero.jpg', fetchpriority: 'high' },
        // Non-blocking Google Fonts (Cinzel, Lora, Barlow Condensed) for 0ms render-blocking
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Cinzel:wght@400;600;700&family=Lora:wght@400;500&family=Barlow+Condensed:wght@400;600;700&display=swap', media: 'print', onload: "this.media='all'" },
        // Non-blocking Font Awesome stylesheet for social icons
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css', media: 'print', onload: "this.media='all'" }
      ],



      script: [
        {
          type: 'application/ld+json',
          innerHTML: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'CatholicChurch',
            'name': 'Paroki St. Paulus Juanda',
            'alternateName': 'Gereja Katolik St. Paulus Juanda Sidoarjo',
            'url': 'https://stpaulusjuanda.org',
            'logo': 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png',
            'image': 'https://stpaulusjuanda.org/images/logo-paulus-juanda.png',
            'description': 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik',
            'address': {
              '@type': 'PostalAddress',
              'streetAddress': 'Jl. Juanda',
              'addressLocality': 'Sidoarjo',
              'addressRegion': 'Jawa Timur',
              'addressCountry': 'ID'
            },
            'geo': {
              '@type': 'GeoCoordinates',
              'latitude': '-7.3826',
              'longitude': '112.7667'
            }
          })
        }
      ]

    },

    // Keep previous page visible while the next page resolves auth/data.
    pageTransition: { name: 'page', mode: 'in-out' }
  },

  // Router configuration
  router: {
    options: {
      linkPrefetchedClass: 'nuxt-link-prefetched',
      linkExactActiveClass: 'nuxt-link-exact-active',
      linkActiveClass: 'nuxt-link-active',
      scrollBehaviorType: 'smooth'
    }
  },

  // Image optimization configuration (requires @nuxt/image module)
  // Uncomment if you have @nuxt/image installed
  // image: {
  //   format: ['webp', 'avif', 'png', 'jpg'],
  //   quality: 80,
  //   screens: {
  //     xs: 320,
  //     sm: 640,
  //     md: 768,
  //     lg: 1024,
  //     xl: 1280,
  //     xxl: 1536,
  //   }
  // },

  // Build optimization
  vite: {
    server: {
      // Increase HMR timeout to prevent IPC socket drops under heavy SSR load
      hmr: {
        timeout: 60000
      }
    },
    build: {
      rollupOptions: {
        output: {
          manualChunks(id) {
            if (id.includes('node_modules')) {
              if (id.includes('@ckeditor')) return 'vendor-ckeditor'
              if (id.includes('xlsx')) return 'vendor-xlsx'
              if (id.includes('@google/generative-ai') || id.includes('groq-sdk')) return 'vendor-ai'
              if (id.includes('@vueuse')) return 'vendor-vueuse'
              if (id.includes('tw-elements')) return 'vendor-ui'
              if (id.includes('vue-router') || id.includes('vue/dist') || id.includes('/vue/')) return 'vendor-vue'
            }
          }
        }
      }
    },
    define: {
      global: 'globalThis',
    },
  },

  // Penambahan blok nitro untuk menghilangkan warning
  nitro: {
    compatibilityDate: '2025-11-09',
    // 🚀 RAILWAY FIX: Listen on dynamic PORT from Railway
    port: parseInt(process.env.PORT || '3000'),
    host: process.env.HOST || '0.0.0.0',
    externals: {
      inline: ['xlsx']
    },
    logLevel: 'info', // Reduce SSR log noise
    experimental: {
      // Enable multipart form data handling
      asyncContext: true
    },
    // Increase body size limit for file uploads (e.g., 50MB)
    bodyParser: {
      maxBodyLength: 52428800 // 50MB in bytes
    },
    devProxy: {
      // Disable SSR logs forwarding in development
      changeOrigin: false
    },
    routeRules: {
      '/api/**': {
        cors: true,
        headers: {
          // 🔒 SECURITY: Whitelist specific origins instead of '*'
          // In production, set ALLOWED_ORIGINS in .env to your actual domain
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGINS || 'http://localhost:3000,http://localhost:3001',
          'Access-Control-Allow-Methods': 'GET, POST, PUT, PATCH, DELETE, OPTIONS',
          'Access-Control-Allow-Headers': 'Authorization, Content-Type',
          'Access-Control-Allow-Credentials': 'true',
          // No cache for API responses — always return fresh data
          'cache-control': 'no-store, no-cache, must-revalidate'
        }
      },
      // Admin API: NEVER cache - always return fresh data
      '/api/admin/**': {
        headers: {
          'cache-control': 'no-store, no-cache, must-revalidate',
          'pragma': 'no-cache',
          'expires': '0'
        }
      },
      // Bookings API: contains sensitive user data, also used by admin with auth tokens
      '/api/bookings/**': {
        headers: {
          'cache-control': 'no-store, no-cache, must-revalidate',
          'pragma': 'no-cache',
          'expires': '0'
        }
      },
      '/**': {
        headers: {
          // 🔒 Security headers
          'X-Content-Type-Options': 'nosniff',
          'X-Frame-Options': 'DENY',
          'X-XSS-Protection': '1; mode=block',
          'Referrer-Policy': 'strict-origin-when-cross-origin',
          'Permissions-Policy': 'geolocation=(), microphone=(), camera=()'
        }
      },
      '/_nuxt/**': {
        headers: {
          'cache-control': 'public,max-age=31536000'
        }
      },
      '/images/**': {
        headers: {
          'cache-control': 'public,max-age=86400'
        }
      }
    }
  },

  runtimeConfig: {
    // JWT Secret for token verification - read from environment first, fallback to a stable dev secret
    jwtSecret: process.env.JWT_SECRET || 'stpaulus-cms-stable-jwt-secret-key-2025-dev-only',

    // Database configuration for MySQL
    database: {
      client: 'mysql',
      host: process.env.MYSQL_HOST || 'localhost',
      port: parseInt(process.env.MYSQL_PORT || '3306'),
      user: process.env.MYSQL_USER || 'new_cms_user',
      password: process.env.MYSQL_PASSWORD || 'secure_app_password_2025',
      database: process.env.MYSQL_DATABASE || 'stpaulus_cms_db'
    },

    // Variabel ini HANYA tersedia di sisi server (aman)
    googleClientSecret: process.env.GOOGLE_CLIENT_SECRET,
    googleRefreshToken: process.env.GOOGLE_REFRESH_TOKEN,

    // Variabel ini bisa diakses publik (di browser)
    public: {
      googleClientId: process.env.GOOGLE_CLIENT_ID,
      googleRedirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback',
      apiBase: process.env.API_BASE || '' // Use relative path by default (same origin)
    },

    // Konfigurasi untuk auth endpoints
    google: {
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      redirectUri: process.env.GOOGLE_REDIRECT_URI || 'http://localhost:3000/api/auth/callback'
    },

    // Groq API configuration for chatbot
    groq: {
      apiKey: process.env.GROQ_API_KEY
    },

    // Google Gemini API configuration for AI narration
    geminiApiKey: process.env.GEMINI_API_KEY || '',

    // Google Photos API configuration for gallery integration
    googlePhotos: {
      clientId: process.env.GOOGLE_PHOTOS_CLIENT_ID || '',
      clientSecret: process.env.GOOGLE_PHOTOS_CLIENT_SECRET || '',
      redirectUri: process.env.GOOGLE_PHOTOS_REDIRECT_URI || 'http://localhost:3000/api/google-photos/callback',
      userEmail: process.env.GOOGLE_PHOTOS_USER_EMAIL || '',
      downloadThumbnails: process.env.GOOGLE_PHOTOS_DOWNLOAD_THUMBNAILS === 'true',
      thumbnailSize: parseInt(process.env.GOOGLE_PHOTOS_THUMBNAIL_SIZE || '400')
    }
  },


})
