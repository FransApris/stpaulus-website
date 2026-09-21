/**
 * useOgMeta — Composable untuk mengatur Open Graph & Twitter Card meta tags secara dinamis.
 *
 * Digunakan di halaman-halaman detail (berita, galeri, kronik, dll.) agar
 * thumbnail yang muncul saat tautan dibagikan ke WhatsApp / media sosial
 * adalah gambar spesifik halaman tersebut, bukan logo paroki.
 *
 * Logika fallback:
 *   - Jika `image` tersedia → gunakan sebagai og:image (URL absolut).
 *   - Jika `image` kosong/null → gunakan logo paroki sebagai fallback.
 *
 * URL gambar selalu di-resolve menjadi URL absolut karena platform media sosial
 * (WhatsApp, Facebook, Twitter, dll.) TIDAK mendukung path relatif.
 */

const DEFAULT_SITE_URL = 'https://stpaulusjuanda.org'
const DEFAULT_OG_IMAGE = `${DEFAULT_SITE_URL}/images/logo-paulus-juanda.png`
const DEFAULT_SITE_NAME = 'Paroki St. Paulus - Juanda, Sidoarjo'
const DEFAULT_DESCRIPTION = 'Website resmi Paroki St. Paulus Juanda Sidoarjo - Informasi jadwal misa, berita gereja, kegiatan paroki, dan pelayanan umat Katolik'

/**
 * Resolve sebuah URL menjadi URL absolut.
 * - Jika sudah http:// atau https://, kembalikan apa adanya.
 * - Jika path relatif (misal: /uploads/img.jpg), gabungkan dengan SITE_URL.
 * - Jika null/undefined/kosong, kembalikan image default paroki.
 */
export function resolveAbsoluteImageUrl(imageUrl: string | null | undefined): string {
  if (!imageUrl) return DEFAULT_OG_IMAGE
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl
  }
  // Path relatif: tambahkan domain
  const path = imageUrl.startsWith('/') ? imageUrl : `/${imageUrl}`
  return `${DEFAULT_SITE_URL}${path}`
}

export interface OgMetaOptions {
  /** Judul halaman (akan diset sebagai og:title, twitter:title, dan <title>) */
  title: string
  /** Deskripsi halaman */
  description?: string | null
  /** URL gambar (boleh relatif, null, atau undefined — akan di-resolve otomatis) */
  image?: string | null
  /** URL canonical halaman ini (boleh relatif) */
  url?: string | null
  /** Tipe Open Graph: 'article' untuk berita/kronik, 'website' untuk halaman umum */
  type?: 'article' | 'website'
}

/**
 * Composable utama. Panggil di dalam `<script setup>` halaman detail.
 *
 * Contoh:
 * ```ts
 * useOgMeta({
 *   title: post.value.title,
 *   description: post.value.excerpt,
 *   image: post.value.image,     // bisa relatif, absolut, atau null
 *   url: route.path,
 *   type: 'article',
 * })
 * ```
 */
export function useOgMeta(options: OgMetaOptions) {
  const route = useRoute()

  const resolvedImage = resolveAbsoluteImageUrl(options.image)
  const resolvedUrl = options.url
    ? (options.url.startsWith('http') ? options.url : `${DEFAULT_SITE_URL}${options.url}`)
    : `${DEFAULT_SITE_URL}${route.path}`

  const description = options.description || DEFAULT_DESCRIPTION
  const type = options.type || 'article'

  useSeoMeta({
    // ── Title ────────────────────────────────────────────────────────────────
    title: options.title,

    // ── Standard Meta ────────────────────────────────────────────────────────
    description: description,

    // ── Open Graph ───────────────────────────────────────────────────────────
    ogType: type,
    ogSiteName: DEFAULT_SITE_NAME,
    ogTitle: options.title,
    ogDescription: description,
    ogImage: resolvedImage,
    ogImageWidth: '1200',
    ogImageHeight: '630',
    ogImageAlt: options.title,
    ogUrl: resolvedUrl,
    ogLocale: 'id_ID',

    // ── Twitter Card ─────────────────────────────────────────────────────────
    twitterCard: 'summary_large_image',
    twitterTitle: options.title,
    twitterDescription: description,
    twitterImage: resolvedImage,
    twitterImageAlt: options.title,
  })
}
