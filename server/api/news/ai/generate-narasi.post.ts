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

function buildFallbackNarasi(data: {
    what_title: string
    when_date?: string
    when_time?: string
    where_location?: string
    who_participants?: string
    why_purpose?: string
    how_process?: string
}): string {
    const whenText = [data.when_date, data.when_time].filter(Boolean).join(' ').trim() || 'waktu yang telah dijadwalkan'
    const whereText = data.where_location || 'lingkungan paroki'
    const whoText = data.who_participants || 'umat paroki'
    const whyText = data.why_purpose || 'memperkuat iman dan kebersamaan umat'
    const howText = data.how_process || 'rangkaian kegiatan pastoral dan liturgis yang tertib serta penuh makna'

    return [
        `${data.what_title} dilaksanakan pada ${whenText} di ${whereText} dengan melibatkan ${whoText}. Kegiatan ini menjadi bagian dari pelayanan pastoral yang terus diupayakan secara berkesinambungan oleh paroki.`,
        `Dalam pelaksanaannya, kegiatan berlangsung melalui ${howText}. Umat mengikuti rangkaian acara dengan antusias, sehingga suasana kebersamaan, doa, dan pelayanan dapat terbangun dengan baik.`,
        `Tujuan utama kegiatan ini adalah ${whyText}. Melalui momentum tersebut, paroki berharap nilai-nilai iman, solidaritas, dan semangat pelayanan semakin tumbuh dalam kehidupan menggereja sehari-hari.`,
        `Ke depan, kegiatan serupa diharapkan terus dikembangkan agar semakin banyak umat dapat terlibat aktif, mengalami pendalaman rohani, serta mengambil bagian dalam karya pelayanan Gereja.`
    ].join('\n\n')
}

export default defineEventHandler(async (event) => {
    console.log('[News AI Generate] Starting AI generation...')

    const body = await readBody(event)
    const {
        what_title,
        when_date,
        when_time,
        where_location,
        who_participants,
        why_purpose,
        how_process
    } = body || {}

    const safeTitle = String(what_title || '').trim() || 'Berita Kegiatan Paroki'

    try {
        // Initialize Gemini AI
        const apiKey = resolveGeminiApiKey()

        if (!apiKey) {
            const narasiFallback = buildFallbackNarasi({
                what_title: safeTitle,
                when_date,
                when_time,
                where_location,
                who_participants,
                why_purpose,
                how_process
            })

            return {
                success: true,
                narasi: narasiFallback,
                prompt: 'fallback-no-gemini-key',
                fallback: true,
                message: 'Narasi dibuat dengan mode fallback karena API key Gemini belum dikonfigurasi.'
            }
        }

        console.log('[News AI Generate] Initializing Gemini API...')
        const genAI = new GoogleGenerativeAI(apiKey)
        const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })

        // Build prompt from 5W1H data
        const prompt = `
Anda adalah penulis berita gereja Katolik yang profesional. Buatkan narasi berita yang informatif dan menarik berdasarkan data 5W1H berikut:

📌 JUDUL: ${safeTitle}
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

        if (error?.statusCode === 400) {
            throw error
        }

        const narasiFallback = buildFallbackNarasi({
            what_title: String(what_title || '').trim() || 'Berita Kegiatan Paroki',
            when_date,
            when_time,
            where_location,
            who_participants,
            why_purpose,
            how_process
        })

        return {
            success: true,
            narasi: narasiFallback,
            prompt: 'fallback-on-ai-error',
            fallback: true,
            message: error?.data?.message || error.message || 'Gemini tidak tersedia saat ini, narasi fallback digunakan.'
        }
    }
})
