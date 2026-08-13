import { fetchCachedFAQs, clearFAQCache } from '../../utils/faqCache'
import { runQuery, allQuery } from '../../database/db'
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
  const { message, context: pageContext, history = [] } = body

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

        const today = new Date().toLocaleDateString('id-ID', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', timeZone: 'Asia/Jakarta' })
        const todayIso = new Date().toLocaleDateString('en-CA', { timeZone: 'Asia/Jakarta' })

        const systemPrompt = `You are the "Virtual Assistant for St. Paulus Juanda Parish". Speak in a warm, polite, and highly helpful tone that reflects the spirit of Catholic service. Never use a robotic or overly rigid tone.${pageContextString}

**CURRENT DATE:**
Today is ${today} (ISO: ${todayIso}). Use this date to resolve relative time like "hari ini" (today), "besok" (tomorrow), etc.

**STATIC KNOWLEDGE BASE:**
All your static knowledge (such as Mass schedules, church address, Parish Priest name, important links, etc.) is provided in the **RELEVANT FAQS** section below. Use the information provided there as the absolute foundation for your answers when asked. Do not assume or guess church details outside of what is provided there.

**STRICT GUARDRAILS:**
1. ONLY answer questions related to St. Paulus Juanda Parish, church schedules, sacraments, parish news, facilities (room bookings), and general Catholic guidelines.
2. If the user asks about politics, programming/coding, weather, or topics completely outside the church context, politely refuse and guide them back to church-related topics.
3. DO NOT HALLUCINATE. If you do not know the exact answer, honestly say that you do not know and suggest they contact the Parish Secretariat via the Contact page.
4. Reply in Indonesian (Bahasa Indonesia).
5. IMPORTANT: Maintain the list/bullet point format and newlines exactly as provided in the Relevant FAQs. DO NOT compile lists into a single long paragraph.

**TOOL CALLING INSTRUCTIONS:**
You have access to 2 tools:
1. \`search_agenda\`: Use this for questions about the agenda, schedule, activities, or room bookings (e.g., "kapan pelajaran katekumen", "hari ini ada acara apa", "besok ruangan kosong").
2. \`search_website_content\`: Use this for questions about news (berita), articles (artikel), history (sejarah), devotions (renungan), or general parish profile/content.

DO NOT rely on the FAQ to answer questions about specific daily schedules or room bookings.
DO NOT tell the user to use the tool. YOU must invoke the tool yourself.
If you invoke a tool, do not worry about the JSON FORMAT INTEGRITY yet.

**JSON FORMAT INTEGRITY:**
You MUST respond with a structured JSON format. 
IMPORTANT: Set \`has_action: false\` IF the question does not directly relate to one of the available pages below AND you did not find a specific article/news slug from the database.
CRITICAL: If you used the \`search_website_content\` tool and found a specific article, news, or page, you MUST set \`has_action: true\`, provide a \`button_text\` (e.g., "Baca Selengkapnya"), and set \`target_route\` to the correct path (e.g., \`/berita/[slug]\`, \`/artikel/[slug]\`, or \`/[slug]\` for pages).

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

        // STEP 1: Definisikan Tools/Functions
        const tools = [
          {
            type: "function",
            function: {
              name: "search_agenda",
              description: "Mencari daftar agenda, kegiatan, atau pemesanan ruangan gereja. Bisa dicari berdasarkan tanggal tertentu atau kata kunci nama kegiatan (contoh: katekumen, rapat, dll).",
              parameters: {
                type: "object",
                properties: {
                  date: {
                    type: "string",
                    description: "Opsional. Tanggal dalam format YYYY-MM-DD. Kosongkan jika mencari kegiatan di masa depan secara umum."
                  },
                  keyword: {
                    type: "string",
                    description: "Opsional. Kata kunci nama kegiatan, misal 'katekumen'. Kosongkan jika mencari semua kegiatan pada tanggal tertentu."
                  }
                },
                required: []
              }
            }
          },
          {
            type: "function",
            function: {
              name: "search_website_content",
              description: "Mencari berita, artikel, renungan, sejarah, atau profil gereja berdasarkan kata kunci.",
              parameters: {
                type: "object",
                properties: {
                  keyword: {
                    type: "string",
                    description: "Kata kunci pencarian (contoh: 'paskah', 'sejarah', 'maria')"
                  },
                  content_type: {
                    type: "string",
                    description: "Opsional. Jenis konten yang dicari. Pilih antara: 'berita', 'artikel', 'halaman', atau 'semua'. Jika tidak yakin, pilih 'semua'.",
                    enum: ["berita", "artikel", "halaman", "semua"]
                  }
                },
                required: ["keyword"]
              }
            }
          }
        ]

        let messages = [
          { role: 'system', content: systemPrompt },
          ...history,
          { role: 'user', content: sanitizedMessage }
        ]

        console.log('[Chatbot] Calling Groq API with tools...')
        const startTime = Date.now()

        // STEP 1 & 2: Kirim prompt user + tools ke Grok
        let completion = await groq.chat.completions.create({
          model: 'llama-3.1-8b-instant',
          messages: messages as any,
          tools: tools as any,
          tool_choice: 'auto',
          max_tokens: 400,
          temperature: 0.3,
          top_p: 0.8
        })

        let responseMessage = completion.choices[0]?.message

        // STEP 2: Jika respons Grok mengandung tool_calls
        if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
          console.log('[Chatbot] Grok calling tool:', responseMessage.tool_calls[0]?.function?.name)
          messages.push(responseMessage as any) // Append assistant's tool call request

          for (const toolCall of responseMessage.tool_calls) {
            if (toolCall.function?.name === 'search_agenda' || toolCall.function?.name === 'check_agenda_by_date') {
              const args = JSON.parse(toolCall.function?.arguments || '{}')
              const requestedDate = args.date
              const keyword = args.keyword

              // STEP 3: Kueri database
              let queryResult = ''
              try {
                let query = `
                  SELECT b.event_name, b.start_time, b.end_time, r.name as room_name
                  FROM bookings b
                  JOIN rooms r ON b.room_id = r.id
                  WHERE b.deleted_at IS NULL AND b.status = 'APPROVED' 
                `
                let params = []

                if (requestedDate && keyword) {
                  query += ` AND DATE(b.start_time) = ? AND b.event_name LIKE ? `
                  params.push(requestedDate, `%${keyword}%`)
                } else if (requestedDate) {
                  query += ` AND DATE(b.start_time) = ? `
                  params.push(requestedDate)
                } else if (keyword) {
                  query += ` AND DATE(b.start_time) >= ? AND b.event_name LIKE ? `
                  params.push(todayIso, `%${keyword}%`)
                } else {
                  // Fallback: next 7 days
                  query += ` AND DATE(b.start_time) >= ? AND DATE(b.start_time) <= DATE_ADD(DATE(?), INTERVAL 7 DAY) `
                  params.push(todayIso, todayIso)
                }

                query += ` ORDER BY b.start_time ASC LIMIT 20`
                const bookings = await allQuery(query, params)
                const activeRoomsRows = await allQuery(`SELECT name FROM rooms WHERE is_active = 1`)
                const activeRoomsList = activeRoomsRows.map((r: any) => r.name).join(', ')
                
                if (bookings && bookings.length > 0) {
                  queryResult = JSON.stringify({
                    booked_events: bookings,
                    all_available_rooms: activeRoomsList
                  })
                } else {
                  queryResult = JSON.stringify({
                    message: `Tidak ada agenda yang ditemukan berdasarkan kriteria pencarian tersebut.`,
                    all_available_rooms: activeRoomsList
                  })
                }
              } catch (e: any) {
                console.error('[Chatbot] Error querying bookings:', e.message)
                queryResult = `Error fetching database.`
              }

              // STEP 4: Kembalikan hasil database sebagai pesan dengan role "tool"
              messages.push({
                tool_call_id: toolCall.id,
                role: "tool",
                name: toolCall.function.name,
                content: queryResult
              } as any)
            } else if (toolCall.function?.name === 'search_website_content') {
              const args = JSON.parse(toolCall.function?.arguments || '{}')
              const keyword = args.keyword || ''
              const contentType = args.content_type || 'semua'

              let queryResult = ''
              try {
                let results: any = {}
                const searchTerm = `%${keyword}%`
                
                if (contentType === 'berita' || contentType === 'semua') {
                  results.berita = await allQuery(`SELECT title, slug, excerpt FROM news WHERE status='published' AND title LIKE ? LIMIT 3`, [searchTerm])
                }
                if (contentType === 'artikel' || contentType === 'semua') {
                  results.artikel = await allQuery(`SELECT title, slug, excerpt FROM articles WHERE status='published' AND title LIKE ? LIMIT 3`, [searchTerm])
                }
                if (contentType === 'halaman' || contentType === 'semua') {
                  results.halaman = await allQuery(`SELECT title, slug, SUBSTRING(content, 1, 200) as excerpt FROM pages WHERE is_published=1 AND title LIKE ? LIMIT 3`, [searchTerm])
                }

                const totalFound = (results.berita?.length || 0) + (results.artikel?.length || 0) + (results.halaman?.length || 0)
                
                if (totalFound > 0) {
                  queryResult = JSON.stringify({
                    message: "Berikut adalah hasil pencarian dari database website.",
                    results: results
                  })
                } else {
                  queryResult = JSON.stringify({
                    message: `Tidak ada berita, artikel, atau halaman yang cocok dengan kata kunci '${keyword}'.`
                  })
                }
              } catch (e: any) {
                console.error('[Chatbot] Error querying website content:', e.message)
                queryResult = `Error fetching database for website content.`
              }

              messages.push({
                role: 'tool',
                tool_call_id: toolCall.id,
                name: toolCall.function.name,
                content: queryResult
              } as any)
            }
          }

          // STEP 5: Biarkan Grok merangkum hasil database tersebut ke dalam format JSON akhir
          completion = await groq.chat.completions.create({
            model: 'llama-3.1-8b-instant',
            messages: messages as any,
            response_format: { type: 'json_object' },
            max_tokens: 400,
            temperature: 0.3,
            top_p: 0.8
          })
          
          responseMessage = completion.choices[0]?.message
        }

        const elapsed = Date.now() - startTime
        console.log(`[Chatbot] Groq API responded in ${elapsed}ms`)

        const aiResponse = responseMessage?.content || ''

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
