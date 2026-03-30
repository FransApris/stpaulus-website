import { GoogleGenerativeAI } from '@google/generative-ai'

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
    console.log('[News AI Generate] Starting AI generation...')

    try {
        // Get request body
        const body = await readBody(event)
        const {
            what_title,
            when_date,
            when_time,
            where_location,
            who_participants,
            why_purpose,
            how_process
        } = body

        // Validate required fields
        if (!what_title) {
            throw createError({
                statusCode: 400,
                message: 'Judul berita harus diisi'
            })
        }

        // Initialize Gemini AI
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

        console.log('[News AI Generate] Initializing Gemini API...')
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        // Build prompt from 5W1H data
        const prompt = `
Anda adalah penulis berita gereja Katolik yang profesional. Buatkan narasi berita yang informatif dan menarik berdasarkan data 5W1H berikut:

📌 JUDUL: ${what_title}
📅 KAPAN: ${when_date || '-'} ${when_time || ''}
📍 DIMANA: ${where_location || '-'}
👥 SIAPA: ${who_participants || '-'}
🎯 MENGAPA: ${why_purpose || '-'}
⚙️ BAGAIMANA: ${how_process || '-'}

INSTRUKSI PENULISAN:
1. Tulis dalam gaya berita gereja yang formal namun tetap hangat dan mengundang
2. Mulai dengan lead paragraph yang menarik (mencakup 5W1H utama)
3. Jelaskan kronologi atau detail kegiatan dengan jelas
4. Tambahkan kutipan atau perspektif jika relevan dengan data yang ada
5. Tutup dengan kesimpulan inspiratif atau harapan ke depan
6. Panjang: 4-5 paragraf (300-400 kata)
7. Gunakan Bahasa Indonesia yang baik, benar, dan mudah dipahami
8. Hindari kata-kata klise atau berlebihan
9. Fokus pada makna rohani dan dampak bagi komunitas
10. Gunakan istilah Katolik yang tepat bila relevan

FORMAT OUTPUT:
- Plain text tanpa markdown formatting
- Pisahkan paragraf dengan baris kosong
- Hindari bullet points atau numbering
- Tulis dalam bentuk narasi mengalir

Narasi:
`.trim()

        console.log('[News AI Generate] Calling Gemini API...')

        // Generate content
        const result = await model.generateContent(prompt)
        const response = await result.response
        const generatedText = response.text()

        console.log('[News AI Generate] Successfully generated narasi')
        console.log('[News AI Generate] Length:', generatedText.length, 'characters')

        return {
            success: true,
            narasi: generatedText,
            prompt: prompt
        }

    } catch (error: any) {
        console.error('[News AI Generate Error]', error)

        throw createError({
            statusCode: error.statusCode || 500,
            statusMessage: error.statusMessage || error.message || 'Gagal generate narasi dengan AI',
            data: {
                message: error?.data?.message || error.message || 'Gagal generate narasi dengan AI'
            }
        })
    }
})
