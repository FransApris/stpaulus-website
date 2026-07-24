import { allQuery, runQuery } from '../../database/db'
import Groq from 'groq-sdk'

// ─── CATATAN PENTING: Groq TIDAK diinisialisasi di top-level module ──────────
// Alasan: useRuntimeConfig() hanya tersedia dalam request handler context.
// Jika Groq diinisialisasi di top-level (saat module load), apiKey akan
// undefined dan semua request ke AI chatbot akan gagal dengan 401.
// Gunakan fungsi getGroqClient() yang dipanggil di dalam handler.
// ─────────────────────────────────────────────────────────────────────────────

function getGroqClient(): Groq | null {
  const config = useRuntimeConfig()
  const apiKey = config.groq?.apiKey
  if (!apiKey) {
    console.warn('[Chatbot] GROQ_API_KEY tidak dikonfigurasi — mode FAQ-only')
    return null
  }
  return new Groq({ apiKey })
}

// FAQ Cache - mengurangi query database berulang
// CATATAN: Cache ini global (persisten lintas request).
// Jika admin mengupdate FAQ, cache akan kedaluwarsa setelah CACHE_DURATION.
let faqCache: any[] | null = null
let faqCacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 menit

// Fungsi ini bisa dipanggil dari admin API untuk invalidasi cache
export function invalidateFAQCache() {
  faqCache = null
  faqCacheTime = 0
  console.log('[Chatbot] FAQ cache invalidated')
}

const FALLBACK_CONTACT = 'Sekretariat Paroki (hubungi langsung di kantor atau lihat halaman Kontak kami)'
const MAX_MESSAGE_LENGTH = 500 // Batasi input agar tidak memboroskan token AI

async function getCachedFAQs() {
  const now = Date.now()
  if (faqCache && (now - faqCacheTime) < CACHE_DURATION) {
    console.log('[Chatbot] Using cached FAQs')
    return faqCache
  }

  console.log('[Chatbot] Fetching fresh FAQs from database')
  try {
    faqCache = await allQuery(
      'SELECT id, question, answer, keywords FROM chatbot_faqs WHERE is_active = 1'
    ) as any[]
    faqCacheTime = now
    return faqCache
  } catch (error: any) {
    console.error('[Chatbot] Failed to fetch FAQs:', error.message)
    // Jika fetch gagal (misal tabel belum ada), kembalikan array kosong
    // tapi JANGAN cache hasilnya agar bisa dicoba lagi di request berikutnya
    return []
  }
}

// Helper: parse keywords dari berbagai format (JSON array / comma-separated string)
function parseKeywords(keywords: any): string[] {
  if (!keywords) return []
  if (Array.isArray(keywords)) return keywords
  if (typeof keywords === 'string') {
    try {
      if (keywords.startsWith('[') || keywords.startsWith('{')) {
        return JSON.parse(keywords)
      }
      return keywords.split(',').map(k => k.trim()).filter(Boolean)
    } catch {
      return keywords.split(',').map(k => k.trim()).filter(Boolean)
    }
  }
  return []
}

// Hitung skor relevansi antara pesan user dengan FAQ
function scoreFAQ(userWords: string[], faq: any): number {
  const keywords = parseKeywords(faq.keywords)
  const questionWords = faq.question.toLowerCase().split(/\s+/)
  const allWords = [...keywords, ...questionWords]

  let score = 0
  for (const userWord of userWords) {
    for (const faqWord of allWords) {
      if (faqWord.length > 2 && userWord.length > 2) { // Hindari noise dari kata pendek
        if (faqWord.includes(userWord) || userWord.includes(faqWord)) {
          score += 1
        }
      }
    }
  }
  return score
}

// Cari FAQ yang paling relevan (untuk fallback keyword matching)
function findBestMatch(userMessage: string, faqs: any[]): { answer: string; confidence: number } {
  if (faqs.length === 0) {
    return {
      answer: `Mohon maaf, saya belum memiliki informasi yang cukup untuk menjawab pertanyaan Anda. Silakan hubungi ${FALLBACK_CONTACT}.`,
      confidence: 0
    }
  }

  const userWords = userMessage.toLowerCase().split(/\s+/)
  let bestMatch = null
  let bestScore = 0

  for (const faq of faqs) {
    const score = scoreFAQ(userWords, faq)
    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  const MINIMUM_SCORE = 2
  if (bestMatch && bestScore >= MINIMUM_SCORE) {
    return { answer: bestMatch.answer, confidence: bestScore }
  }

  return {
    answer: `Mohon maaf, saya belum mengerti pertanyaan Anda. Silakan hubungi ${FALLBACK_CONTACT}.`,
    confidence: 0
  }
}

// Ambil FAQ paling relevan untuk dikirim sebagai context ke Groq
function getRelevantFAQs(userMessage: string, faqs: any[], limit = 5): any[] {
  if (faqs.length === 0) return []
  const userWords = userMessage.toLowerCase().split(/\s+/)

  return faqs
    .map(faq => ({ faq, score: scoreFAQ(userWords, faq) }))
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.faq)
}

// Update usage_count FAQ yang paling relevan (fire-and-forget, tidak memblokir response)
function updateUsageCount(userMessage: string, faqs: any[]) {
  if (faqs.length === 0) return
  const userWords = userMessage.toLowerCase().split(/\s+/)

  for (const faq of faqs) {
    const hasMatch = [...parseKeywords(faq.keywords), ...faq.question.toLowerCase().split(/\s+/)]
      .some(word => userWords.some(userWord => word.includes(userWord) || userWord.includes(word)))

    if (hasMatch) {
      // Fire-and-forget: log error jika gagal tapi jangan blocking
      runQuery('UPDATE chatbot_faqs SET usage_count = usage_count + 1 WHERE id = ?', [faq.id])
        .catch((err: any) => {
          console.warn('[Chatbot] updateUsageCount failed:', err.message)
        })
      break
    }
  }
}

// ─────────────────────────────────────────────────────────────────────────────
// HANDLER UTAMA
// ─────────────────────────────────────────────────────────────────────────────

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message } = body

  // Validasi input
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw createError({ statusCode: 400, statusMessage: 'Pesan tidak boleh kosong' })
  }

  // Batasi panjang pesan untuk mencegah penyalahgunaan token AI
  const sanitizedMessage = message.trim().slice(0, MAX_MESSAGE_LENGTH)
  if (message.trim().length > MAX_MESSAGE_LENGTH) {
    console.warn(`[Chatbot] Message truncated from ${message.trim().length} to ${MAX_MESSAGE_LENGTH} chars`)
  }

  try {
    const faqs = await getCachedFAQs()
    let response = ''

    // Coba Groq AI jika API key tersedia
    const groq = getGroqClient()
    if (groq) {
      try {
        const relevantFAQs = getRelevantFAQs(sanitizedMessage, faqs, 5)

        const context = relevantFAQs.length > 0
          ? relevantFAQs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')
          : 'Tidak ada FAQ yang relevan ditemukan.'

        const systemPrompt = `Anda adalah asisten AI untuk Gereja St. Paulus Juanda.

**ATURAN KETAT:**
1. HANYA jawab pertanyaan tentang: Jadwal misa, sakramen (baptis, pernikahan, dll), informasi paroki, kegiatan gereja
2. Jika pertanyaan TIDAK RELEVAN dengan gereja/paroki: TOLAK dengan sopan dan arahkan ke sekretariat
3. Jika tidak yakin atau tidak ada informasi di FAQ: ARAHKAN ke sekretariat paroki
4. JANGAN mengarang jawaban yang tidak ada di FAQ

**FAQ Relevan:**
${context}

**CONTOH PENOLAKAN:**
- Pertanyaan tentang cuaca, resep, olahraga → "Mohon maaf, pertanyaan tersebut di luar cakupan saya. Saya hanya dapat membantu informasi seputar Gereja St. Paulus Juanda."
- Pertanyaan tidak jelas → "Mohon maaf, saya belum mengerti pertanyaan Anda. Silakan hubungi Sekretariat Paroki."

Jawab dalam bahasa Indonesia dengan ramah namun TEGAS menolak pertanyaan di luar konteks.`

        console.log('[Chatbot] Calling Groq API...')
        const startTime = Date.now()

        const completion = await groq.chat.completions.create({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: sanitizedMessage }
          ],
          max_tokens: 400,
          temperature: 0.3,
          top_p: 0.8
        })

        const elapsed = Date.now() - startTime
        console.log(`[Chatbot] Groq API responded in ${elapsed}ms`)

        const aiResponse = completion.choices[0]?.message?.content || ''

        // Validasi: cek apakah respons AI relevan
        const responseLower = aiResponse.toLowerCase()
        const hasRelevantKeywords = [
          'gereja', 'paroki', 'misa', 'baptis', 'sakramen', 'jadwal',
          'paulus', 'sekretariat', 'informasi', 'kegiatan', 'mohon maaf'
        ].some(keyword => responseLower.includes(keyword))

        if (!hasRelevantKeywords && relevantFAQs.length === 0) {
          // AI menjawab di luar konteks — gunakan fallback
          response = `Mohon maaf, saya belum mengerti pertanyaan Anda. Silakan hubungi ${FALLBACK_CONTACT}.`
        } else {
          response = aiResponse
        }
      } catch (groqError: any) {
        console.warn('[Chatbot] Groq API error, falling back to keyword matching:', groqError.message)
        const matchResult = findBestMatch(sanitizedMessage, faqs)
        response = matchResult.answer
      }
    } else {
      // Tidak ada API key — gunakan keyword matching saja
      const matchResult = findBestMatch(sanitizedMessage, faqs)
      response = matchResult.answer
    }

    // Update usage count (non-blocking)
    updateUsageCount(sanitizedMessage, faqs)

    return {
      response,
      timestamp: new Date().toISOString()
    }

  } catch (error: any) {
    console.error('[Chatbot] Unhandled error:', error.message)
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan saat memproses pesan'
    })
  }
})
