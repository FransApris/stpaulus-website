import { allQuery, runQuery } from '../../database/db'
import Groq from 'groq-sdk'

const config = useRuntimeConfig()

// Initialize Groq
const groq = new Groq({
  apiKey: config.groq.apiKey
})

// FAQ Cache - to reduce database queries
let faqCache: any[] | null = null
let faqCacheTime: number = 0
const CACHE_DURATION = 5 * 60 * 1000 // 5 minutes

async function getCachedFAQs() {
  const now = Date.now()
  if (faqCache && (now - faqCacheTime) < CACHE_DURATION) {
    console.log('[Chatbot] Using cached FAQs')
    return faqCache
  }

  console.log('[Chatbot] Fetching fresh FAQs from database')
  faqCache = await allQuery(
    'SELECT id, question, answer, keywords FROM chatbot_faqs WHERE is_active = 1'
  ) as any[]
  faqCacheTime = now
  return faqCache
}

// Helper function to safely parse keywords
function parseKeywords(keywords: any): string[] {
  if (!keywords) return []
  if (typeof keywords === 'string') {
    try {
      // Try to parse as JSON first
      if (keywords.startsWith('[') || keywords.startsWith('{')) {
        return JSON.parse(keywords)
      }
      // If not JSON, split by comma
      return keywords.split(',').map(k => k.trim())
    } catch (e) {
      // If parsing fails, split by comma
      return keywords.split(',').map(k => k.trim())
    }
  }
  if (Array.isArray(keywords)) return keywords
  return []
}

// Helper function to find best matching FAQ using keyword matching
function findBestMatch(userMessage: string, faqs: any[]): { answer: string; confidence: number } {
  const userWords = userMessage.toLowerCase().split(/\s+/)

  let bestMatch = null
  let bestScore = 0

  for (const faq of faqs) {
    const keywords = parseKeywords(faq.keywords)
    const questionWords = faq.question.toLowerCase().split(/\s+/)

    const allWords = [...keywords, ...questionWords]
    let score = 0

    for (const userWord of userWords) {
      for (const faqWord of allWords) {
        if (faqWord.includes(userWord) || userWord.includes(faqWord)) {
          score += 1
        }
      }
    }

    if (score > bestScore) {
      bestScore = score
      bestMatch = faq
    }
  }

  // STRICT THRESHOLD: Minimum 2 keyword matches required
  const MINIMUM_SCORE = 2

  if (bestMatch && bestScore >= MINIMUM_SCORE) {
    return {
      answer: bestMatch.answer,
      confidence: bestScore
    }
  }

  return {
    answer: 'Mohon maaf, saya belum mengerti pertanyaan Anda. Untuk informasi lebih lanjut yang tidak dapat saya jawab, silakan hubungi Sekretariat Paroki melalui WhatsApp di nomor 0812-3456-7890 (contoh) pada jam kerja. Terima kasih.',
    confidence: 0
  }
}

// Helper function to get most relevant FAQs (for optimized context)
function getRelevantFAQs(userMessage: string, faqs: any[], limit = 3): any[] {
  const userWords = userMessage.toLowerCase().split(/\s+/)

  // Score each FAQ based on relevance
  const scored = faqs.map(faq => {
    const keywords = parseKeywords(faq.keywords)
    const questionWords = faq.question.toLowerCase().split(/\s+/)
    const allWords = [...keywords, ...questionWords]

    let score = 0
    for (const userWord of userWords) {
      for (const faqWord of allWords) {
        if (faqWord.includes(userWord) || userWord.includes(faqWord)) {
          score += 1
        }
      }
    }

    return { faq, score }
  })

  // Return top N most relevant FAQs
  return scored
    .filter(item => item.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(item => item.faq)
}

// Helper function to update usage count
function updateUsageCount(userMessage: string, faqs: any[]) {
  const userWords = userMessage.toLowerCase().split(/\s+/)

  for (const faq of faqs) {
    const keywords = parseKeywords(faq.keywords)
    const questionWords = faq.question.toLowerCase().split(/\s+/)

    const hasMatch = [...keywords, ...questionWords].some(word =>
      userWords.some(userWord => word.includes(userWord) || userWord.includes(word))
    )

    if (hasMatch) {
      runQuery('UPDATE chatbot_faqs SET usage_count = usage_count + 1 WHERE id = ?', [faq.id])
      break
    }
  }
}

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { message } = body

  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Pesan tidak boleh kosong'
    })
  }

  try {
    // Get all active FAQs (with caching)
    const faqs = await getCachedFAQs()

    let response = ''

    // Try Groq first if API key is available
    if (config.groq.apiKey) {
      try {
        // Get only relevant FAQs for optimized context
        const relevantFAQs = getRelevantFAQs(message, faqs, 5)

        // Prepare optimized context from relevant FAQs only
        const context = relevantFAQs.length > 0
          ? relevantFAQs.map(faq =>
            `Q: ${faq.question}\nA: ${faq.answer}`
          ).join('\n\n')
          : 'Tidak ada FAQ yang relevan ditemukan.'

        // Create STRICT system prompt with clear boundaries
        const systemPrompt = `Anda adalah asisten AI untuk Gereja St. Paulus Juanda. 

**ATURAN KETAT:**
1. HANYA jawab pertanyaan tentang: Jadwal misa, sakramen (baptis, pernikahan, dll), informasi paroki, kegiatan gereja
2. Jika pertanyaan TIDAK RELEVAN dengan gereja/paroki: TOLAK dengan sopan dan arahkan ke sekretariat
3. Jika tidak yakin atau tidak ada informasi: ARAHKAN ke sekretariat paroki
4. JANGAN mengarang jawaban yang tidak ada di FAQ

**FAQ Relevan:**
${context}

**CONTOH PENOLAKAN:**
- Pertanyaan tentang cuaca, resep, olahraga, dll → "Mohon maaf, pertanyaan tersebut di luar cakupan saya. Saya hanya dapat membantu informasi seputar Gereja St. Paulus Juanda."
- Pertanyaan tidak jelas → "Mohon maaf, saya belum mengerti pertanyaan Anda. Silakan hubungi Sekretariat Paroki."

Jawab dalam bahasa Indonesia dengan ramah namun TEGAS menolak pertanyaan di luar konteks.`

        console.log('[Chatbot] Calling Groq API with STRICT context...')
        const startTime = Date.now()

        // Call Groq API with stricter parameters
        const completion = await groq.chat.completions.create({
          model: 'llama3-8b-8192',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: message }
          ],
          max_tokens: 400,  // Reduced to prevent long irrelevant answers
          temperature: 0.3,  // ⬇️ Reduced from 0.7 to 0.3 for more deterministic/strict answers
          top_p: 0.8  // Added: Limit token selection for more focused responses
        })

        const elapsed = Date.now() - startTime
        console.log(`[Chatbot] Groq API responded in ${elapsed}ms`)

        const aiResponse = completion.choices[0]?.message?.content || ''

        // VALIDATION: Check if AI actually followed rules
        const responseLower = aiResponse.toLowerCase()
        const hasRelevantKeywords = [
          'gereja', 'paroki', 'misa', 'baptis', 'sakramen', 'jadwal',
          'paulus', 'sekretariat', 'informasi', 'kegiatan'
        ].some(keyword => responseLower.includes(keyword))

        if (!hasRelevantKeywords && relevantFAQs.length === 0) {
          // AI gave irrelevant response, use fallback
          response = 'Mohon maaf, saya belum mengerti pertanyaan Anda. Untuk informasi lebih lanjut yang tidak dapat saya jawab, silakan hubungi Sekretariat Paroki melalui WhatsApp di nomor 0812-3456-7890 (contoh) pada jam kerja. Terima kasih.'
        } else {
          response = aiResponse
        }
      } catch (groqError: any) {
        console.warn('Groq API error, falling back to keyword matching:', groqError.message)
        // Fallback to keyword matching with confidence check
        const matchResult = findBestMatch(message, faqs)
        response = matchResult.answer
      }
    } else {
      // No API key, use keyword matching with confidence check
      const matchResult = findBestMatch(message, faqs)
      response = matchResult.answer
    }

    // Try to find and update usage count for relevant FAQ
    updateUsageCount(message, faqs)

    return {
      response,
      timestamp: new Date().toISOString()
    }

  } catch (error) {
    console.error('Chatbot error:', error)
    throw createError({
      statusCode: 500,
      statusMessage: 'Terjadi kesalahan saat memproses pesan'
    })
  }
})
