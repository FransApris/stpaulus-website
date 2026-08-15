import { allQuery } from '../database/db'

// Global FAQ Cache persisten di memory server Nuxt
const CACHE_DURATION = 5 * 60 * 1000 // 5 menit

declare global {
  var __faqCache: any[] | null
  var __faqCacheTime: number
}

export function getFAQCache(): any[] | null {
  const now = Date.now()
  if (globalThis.__faqCache && (now - (globalThis.__faqCacheTime || 0)) < CACHE_DURATION) {
    return globalThis.__faqCache
  }
  return null
}

export function setFAQCache(faqs: any[]) {
  globalThis.__faqCache = faqs
  globalThis.__faqCacheTime = Date.now()
}

export function clearFAQCache() {
  globalThis.__faqCache = null
  globalThis.__faqCacheTime = 0
  console.log('[Chatbot] FAQ cache invalidated globally (globalThis)')
}

export async function fetchCachedFAQs() {
  const cached = getFAQCache()
  if (cached) {
    console.log('[Chatbot] Using cached FAQs')
    return cached
  }

  console.log('[Chatbot] Fetching fresh FAQs from database')
  try {
    const faqs = await allQuery(
      // FIX: tambah kolom 'category' agar scoreFAQ dapat menggunakannya untuk scoring relevansi
      'SELECT id, question, answer, keywords, category FROM chatbot_faqs WHERE is_active = 1'
    ) as any[]
    setFAQCache(faqs)
    return faqs
  } catch (error: any) {
    console.error('[Chatbot] Failed to fetch FAQs:', error.message)
    return []
  }
}
