// Global cache & retrieval helper dari server/utils/faqCache.ts
import { fetchCachedFAQs, clearFAQCache } from '../../utils/faqCache'
import { runQuery } from '../../database/db'
import Groq from 'groq-sdk'

// Re-export untuk kompatibilitas jika ada yang mengimpor dari file ini
export function invalidateFAQCache() {
  clearFAQCache()
}

function getGroqClient(): Groq | null {
  const config = useRuntimeConfig()
  const apiKey = config.groq?.apiKey
  if (!apiKey) {
    console.warn('[Chatbot] GROQ_API_KEY tidak dikonfigurasi — mode FAQ-only')
    return null
  }
  return new Groq({ apiKey })
}

const FALLBACK_CONTACT = 'Sekretariat Paroki (hubungi langsung di kantor atau lihat halaman Kontak kami)'
const MAX_MESSAGE_LENGTH = 500 // Batasi input agar tidak memboroskan token AI

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
  const keywords = parseKeywords(faq.keywords).map(k => k.toLowerCase())
  const questionWords = faq.question.toLowerCase().split(/\s+/)
  const categoryWords = (faq.category || '').toLowerCase().split(/\s+/)
  const allWords = [...keywords, ...questionWords, ...categoryWords]

  let score = 0
  for (const userWord of userWords) {
    if (userWord.length <= 2) continue // Hindari noise kata pendek (di, ke, ya, dll)
    for (const faqWord of allWords) {
      if (faqWord.length <= 2) continue
      if (faqWord === userWord) {
        score += 2 // Match kata persis mendapat bobot lebih tinggi (+2)
      } else if (faqWord.includes(userWord) || userWord.includes(faqWord)) {
        score += 1 // Partial match (+1)
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

  const userWords = userMessage.toLowerCase().trim().split(/\s+/).filter(w => w.length > 2)
  let bestMatch = null
  let bestScore = 0

  for (const faq of faqs) {
    const score = scoreFAQ(userWords, faq)
    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  // Jika kata kunci tunggal (misal: "Theresia"), skor 1 atau lebih sudah mencukupi match
  const MINIMUM_SCORE = userWords.length === 1 ? 1 : 2
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
  const userWords = userMessage.toLowerCase().trim().split(/\s+/).filter(w => w.length > 2)

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
  const userWords = userMessage.toLowerCase().trim().split(/\s+/).filter(w => w.length > 2)

  for (const faq of faqs) {
    const hasMatch = [...parseKeywords(faq.keywords), ...faq.question.toLowerCase().split(/\s+/)]
      .some(word => userWords.some(userWord => word.toLowerCase().includes(userWord) || userWord.includes(word.toLowerCase())))

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
    const faqs = await fetchCachedFAQs()
    let response = ''

    // Coba Groq AI jika API key tersedia
    const groq = getGroqClient()
    if (groq) {
      try {
        const relevantFAQs = getRelevantFAQs(sanitizedMessage, faqs, 5)

        const context = relevantFAQs.length > 0
          ? relevantFAQs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')
          : 'Tidak ada FAQ yang relevan ditemukan.'

        const systemPrompt = `Anda adalah asisten AI resmi untuk Gereja St. Paulus Juanda.

**ATURAN UTAMA:**
1. Jawab pertanyaan seputar: Jadwal misa, sakramen (baptis, pernikahan, dll), informasi paroki, ketua wilayah, kegiatan gereja.
2. Jika pengguna menyebut kata kunci tunggal (contoh: "Theresia", "Baptis", "Misa") dan terdapat FAQ relevan, berikan informasi dari FAQ tersebut secara ramah dan lengkap.
3. JANGAN mengarang jawaban di luar informasi FAQ. Jika tidak ada informasi di FAQ, arahkan pengguna ke Sekretariat Paroki.
4. Jawab dalam bahasa Indonesia yang ramah, sopan, dan jelas.

**FAQ Relevan:**
${context}`

        console.log('[Chatbot] Calling Groq API...')
        const startTime = Date.now()

        const completion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
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

        if (aiResponse.trim().length > 0) {
          response = aiResponse
        } else {
          const matchResult = findBestMatch(sanitizedMessage, faqs)
          response = matchResult.answer
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
