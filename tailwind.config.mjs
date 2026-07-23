/** @type {import('tailwindcss').Config} */
export default {
  content: [
    './components/**/*.{vue,js,ts}',
    './pages/**/*.{vue,js,ts}',
    './layouts/**/*.{vue,js,ts}',
    './app.vue',
    './error.vue',
    './plugins/**/*.{js,ts}'
  ],

  theme: {
    container: {
      center: true,
      padding: {
        DEFAULT: '1.5rem',    // 24px - seperti admin panel
        sm: '2rem',           // 32px
        md: '3rem',           // 48px
        lg: '4rem',           // 64px
        xl: '6rem',           // 96px - lebih besar untuk layar lebar
        '2xl': '8rem',        // 128px - maksimal padding
      },
      screens: {
        sm: '640px',
        md: '768px',
        lg: '1024px',
        xl: '1280px',
        '2xl': '1320px',  // Lebih kecil dari sebelumnya (1400px) agar tidak terlalu lebar
      },
    },
    extend: {
      colors: {
        'paulus-blue': '#1E40AF',
      },
      fontFamily: {
        'cinzel': ['Cinzel', 'serif'],
        'lora': ['Lora', 'serif'],
        'barlow': ['Barlow Condensed', 'sans-serif'],
      },
      // Font sizes restored to Tailwind defaults for better readability
      fontSize: {
        'xs': ['0.75rem', { lineHeight: '1rem' }],        // 12px
        'sm': ['0.875rem', { lineHeight: '1.25rem' }],    // 14px
        'base': ['1rem', { lineHeight: '1.5rem' }],       // 16px (RESTORED)
        'lg': ['1.125rem', { lineHeight: '1.75rem' }],    // 18px (RESTORED)
        'xl': ['1.25rem', { lineHeight: '1.75rem' }],     // 20px (RESTORED)
        '2xl': ['1.5rem', { lineHeight: '2rem' }],        // 24px
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],   // 30px
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],     // 36px
        '5xl': ['3rem', { lineHeight: '1' }],             // 48px
        '6xl': ['3.75rem', { lineHeight: '1' }],          // 60px
        '7xl': ['4.5rem', { lineHeight: '1' }],           // 72px
        '8xl': ['6rem', { lineHeight: '1' }],             // 96px
        '9xl': ['8rem', { lineHeight: '1' }],             // 128px
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
}
