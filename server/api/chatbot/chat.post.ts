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
  const { message, context: pageContext } = body

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
    let response: any = { reply: '', has_action: false }

    // Coba Groq AI jika API key tersedia
    const groq = getGroqClient()
    if (groq) {
      try {
        const relevantFAQs = getRelevantFAQs(sanitizedMessage, faqs, 5)

        const context = relevantFAQs.length > 0
          ? relevantFAQs.map(faq => `Q: ${faq.question}\nA: ${faq.answer}`).join('\n\n')
          : 'Tidak ada FAQ yang relevan ditemukan.'

        const pageContextString = pageContext && pageContext.path 
          ? `\n\n**CURRENT PAGE CONTEXT:**\nThe user is currently viewing the page: [${pageContext.title || 'Unknown Title'}] at path [${pageContext.path}]. If the user asks a question with demonstrative pronouns like "this", "here", or "that event", assume they are referring to the context of this specific page.`
          : ''

        const systemPrompt = `You are the "Virtual Assistant for St. Paulus Juanda Parish". Speak in a warm, polite, and highly helpful tone that reflects the spirit of Catholic service. Never use a robotic or overly rigid tone.${pageContextString}

**STATIC KNOWLEDGE BASE:**
All your static knowledge (such as Mass schedules, church address, Parish Priest name, important links, etc.) is provided in the **RELEVANT FAQS** section below. Use the information provided there as the absolute foundation for your answers when asked. Do not assume or guess church details outside of what is provided there.

**STRICT GUARDRAILS:**
1. ONLY answer questions related to St. Paulus Juanda Parish, church schedules, sacraments, parish news, facilities (room bookings), and general Catholic guidelines.
2. If the user asks about politics, programming/coding, weather, or topics completely outside the church context, politely refuse and guide them back to church-related topics.
3. DO NOT HALLUCINATE. If you do not know the exact answer, honestly say that you do not know and suggest they contact the Parish Secretariat via the Contact page.
4. Reply in Indonesian (Bahasa Indonesia).
5. IMPORTANT: Maintain the list/bullet point format and newlines exactly as provided in the Relevant FAQs. DO NOT compile lists into a single long paragraph.

**JSON FORMAT INTEGRITY:**
You MUST respond with a structured JSON format. 
IMPORTANT: Set \`has_action: false\` IF the question does not directly relate to one of the available pages below. DO NOT invent or hallucinate routes! (Example: if asked for the name of a neighborhood leader / ketua lingkungan, just provide the name and set \`has_action: false\`).

Mandatory JSON format:
{
  "reply": "Your descriptive text response here",
  "has_action": true, // false if no page exactly matches the intent
  "button_text": "Short Text", // optional, only if has_action is true
  "target_route": "/path" // optional, only if has_action is true
}

Available Routes/Pages on the website:
- /misa (Mass Schedule)
- /berita (News & Announcements)
- /galeri (Photo Gallery)
- /sejarah (Church History)
- /kontak (Secretariat Contact)
- /dokumen-paroki (Documents & Forms)
- /artikel (Articles & Devotions)
- /agenda (Upcoming Events)

**RELEVANT FAQS:**
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
          try {
            const jsonStr = aiResponse.replace(/\`\`\`json\n?/i, '').replace(/\`\`\`/g, '').trim()
            response = JSON.parse(jsonStr)
          } catch (e) {
            response = { reply: aiResponse, has_action: false }
          }
        } else {
          const matchResult = findBestMatch(sanitizedMessage, faqs)
          response = { reply: matchResult.answer, has_action: false }
        }
      } catch (groqError: any) {
        console.warn('[Chatbot] Groq API error, falling back to keyword matching:', groqError.message)
        const matchResult = findBestMatch(sanitizedMessage, faqs)
        response = { reply: matchResult.answer, has_action: false }
      }
    } else {
      // Tidak ada API key — gunakan keyword matching saja
      const matchResult = findBestMatch(sanitizedMessage, faqs)
      response = { reply: matchResult.answer, has_action: false }
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
