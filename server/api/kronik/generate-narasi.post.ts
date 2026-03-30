import { GoogleGenerativeAI } from '@google/generative-ai'
import { requireAuth } from '~/server/utils/auth'
import { requireKronikUserAccess } from '~/server/utils/kronik-auth'

function resolveGeminiApiKey(): string {
    const config = useRuntimeConfig()
    const candidates = [
        config.geminiApiKey,
        process.env.NUXT_GEMINI_API_KEY,
        process.env.GEMINI_API_KEY
    ]

    for (const candidate of candidates) {
        if (typeof candidate === 'string' && candidate.trim().length > 0) {
            return candidate.trim()
        }
    }

    return ''
}

export default defineEventHandler(async (event) => {
    try {
        const decoded = requireAuth(event)
        await requireKronikUserAccess(decoded.userId)

        const body = await readBody(event)
        const { what, when, where, who, why, how } = body

        // Validasi input
        if (!what || !when || !where) {
            throw createError({
                statusCode: 400,
                message: 'Data 5W1H tidak lengkap. Minimal What, When, dan Where harus diisi.'
            })
        }

        // Ambil API key dari config
        const apiKey = resolveGeminiApiKey()

        if (!apiKey) {
            throw createError({
                statusCode: 500,
                statusMessage: 'API Key Gemini belum dikonfigurasi',
                data: {
                    message: 'API Key Gemini belum dikonfigurasi. Set NUXT_GEMINI_API_KEY atau GEMINI_API_KEY di environment.'
                }
            })
        }

        console.log('[Generate Narasi] Starting AI generation...')

        // Inisialisasi Gemini AI
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        // Buat prompt untuk generate narasi
        const prompt = `
Tugas: Buatkan narasi kronik paroki yang menarik dan inspiratif berdasarkan data 5W1H berikut.

Data 5W1H:
- Apa (What): ${what}
- Kapan (When): ${when}
- Di mana (Where): ${where}
${who ? `- Siapa (Who): ${who}` : ''}
${why ? `- Mengapa (Why): ${why}` : ''}
${how ? `- Bagaimana (How): ${how}` : ''}

Instruksi:
1. Buatlah narasi dalam Bahasa Indonesia yang baik, formal namun tetap hangat
2. Gaya penulisan: Jurnalistik gereja yang informatif dan inspiratif
3. Struktur: 
   - Paragraf 1: Pembuka yang menarik perhatian (lead paragraph)
   - Paragraf 2-3: Detail peristiwa dengan unsur 5W1H
   - Paragraf 4: Penutup yang inspiratif dan memberikan makna rohani
4. Panjang: 3-4 paragraf (250-350 kata)
5. Jika ada "Who", sertakan peran mereka dalam narasi
6. Gunakan kalimat aktif dan engaging
7. Fokus pada dampak spiritual dan makna peristiwa bagi umat
8. Gunakan istilah Katolik yang tepat jika relevan
9. Hindari kata-kata klise, buatlah narasi yang unik dan menarik

Narasi:
`.trim()

        // Generate narasi
        const result = await model.generateContent(prompt)
        const narasi = result.response.text()

        console.log('[Generate Narasi] Successfully generated narasi')

        return {
            success: true,
            narasi: narasi.trim(),
            metadata: {
                model: 'gemini-1.5-flash',
                timestamp: new Date().toISOString(),
                inputLength: JSON.stringify(body).length,
                outputLength: narasi.length
            }
        }

    } catch (error: any) {
        console.error('[Generate Narasi Error]', error)

        // Handle specific errors
        if (error.statusCode === 429) {
            throw createError({
                statusCode: 429,
                statusMessage: 'Terlalu banyak permintaan ke AI. Silakan coba lagi dalam beberapa saat.',
                data: {
                    message: 'Terlalu banyak permintaan ke AI. Silakan coba lagi dalam beberapa saat.'
                }
            })
        }

        if (error.message?.includes('API_KEY') || error.message?.includes('API key')) {
            throw createError({
                statusCode: 500,
                statusMessage: 'Konfigurasi API Key Gemini tidak valid',
                data: {
                    message: 'Konfigurasi API Key Gemini tidak valid. Periksa NUXT_GEMINI_API_KEY atau GEMINI_API_KEY.'
                }
            })
        }

        if (error.statusCode === 400) {
            throw error
        }

        throw createError({
            statusCode: 500,
            statusMessage: error.statusMessage || error.message || 'Gagal generate narasi dengan AI. Silakan coba lagi.',
            data: {
                message: error?.data?.message || error.message || 'Gagal generate narasi dengan AI. Silakan coba lagi.'
            }
        })
    }
})
