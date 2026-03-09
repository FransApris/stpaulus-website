#!/usr/bin/env node
import fetch from 'node-fetch'

const API_URL = 'http://localhost:3000/api/chatbot/chat'

const testCases = [
    {
        category: '🚫 OUT-OF-CONTEXT (Should be rejected)',
        tests: [
            { message: 'Bagaimana cuaca hari ini?', expected: 'REJECT' },
            { message: 'Resep nasi goreng yang enak?', expected: 'REJECT' },
            { message: 'Siapa presiden Indonesia?', expected: 'REJECT' },
            { message: 'Cara main sepak bola?', expected: 'REJECT' },
            { message: 'asdfghjkl', expected: 'REJECT' },
            { message: 'What is machine learning?', expected: 'REJECT' },
            { message: 'Harga laptop murah?', expected: 'REJECT' }
        ]
    },
    {
        category: '✅ CHURCH QUESTIONS (Should be answered)',
        tests: [
            { message: 'Kapan jadwal misa?', expected: 'ANSWER' },
            { message: 'Bagaimana cara baptis bayi?', expected: 'ANSWER' },
            { message: 'Di mana lokasi gereja?', expected: 'ANSWER' },
            { message: 'Kontak sekretariat?', expected: 'ANSWER' },
            { message: 'Jam operasional paroki?', expected: 'ANSWER' },
            { message: 'Info pendaftaran krisma?', expected: 'ANSWER' },
            { message: 'Syarat menikah di gereja?', expected: 'ANSWER' }
        ]
    },
    {
        category: '🔍 EDGE CASES',
        tests: [
            { message: 'misa', expected: 'ANSWER' },
            { message: 'baptis anak umur 5 tahun', expected: 'ANSWER' },
            { message: 'bgaimana cra baptis?', expected: 'ANSWER/REJECT' }, // typo
            { message: 'Gereja tutup jam berapa?', expected: 'ANSWER' },
            { message: 'Ada OMK gak?', expected: 'ANSWER' }
        ]
    }
]

async function testChatbot(message) {
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message })
        })

        if (!response.ok) {
            return { error: `HTTP ${response.status}` }
        }

        const data = await response.json()
        return data
    } catch (error) {
        return { error: error.message }
    }
}

function isRejectionResponse(response) {
    const lowerResponse = response.toLowerCase()
    const rejectionPhrases = [
        'belum mengerti',
        'tidak dapat saya jawab',
        'di luar cakupan',
        'hubungi sekretariat',
        'tidak relevan'
    ]
    return rejectionPhrases.some(phrase => lowerResponse.includes(phrase))
}

function analyzeResponse(response, expected) {
    const isRejection = isRejectionResponse(response)

    if (expected === 'REJECT') {
        return isRejection ? '✅ PASS' : '❌ FAIL (Should reject)'
    } else if (expected === 'ANSWER') {
        return !isRejection ? '✅ PASS' : '❌ FAIL (Should answer)'
    } else {
        // ANSWER/REJECT - both are acceptable
        return '🟡 CHECK'
    }
}

console.log('🤖 ===== CHATBOT STRICTNESS TEST =====\n')
console.log('📡 Testing API:', API_URL)
console.log('⏳ Make sure dev server is running on port 3000\n')

// Wait a bit
await new Promise(resolve => setTimeout(resolve, 1000))

let totalTests = 0
let passedTests = 0
let failedTests = 0

for (const section of testCases) {
    console.log('\n' + '='.repeat(80))
    console.log(`\n${section.category}\n`)
    console.log('='.repeat(80))

    for (const test of section.tests) {
        totalTests++
        console.log(`\n📝 Question: "${test.message}"`)
        console.log(`   Expected: ${test.expected}`)

        const result = await testChatbot(test.message)

        if (result.error) {
            console.log(`   ❌ ERROR: ${result.error}`)
            failedTests++
        } else {
            const response = result.response || ''
            const status = analyzeResponse(response, test.expected)

            if (status.includes('PASS')) passedTests++
            else if (status.includes('FAIL')) failedTests++

            console.log(`   ${status}`)
            console.log(`   Response: "${response.substring(0, 100)}${response.length > 100 ? '...' : ''}"`)
        }

        // Small delay between requests
        await new Promise(resolve => setTimeout(resolve, 500))
    }
}

// Summary
console.log('\n\n' + '='.repeat(80))
console.log('\n📊 TEST SUMMARY\n')
console.log('='.repeat(80))
console.log(`Total Tests: ${totalTests}`)
console.log(`✅ Passed: ${passedTests}`)
console.log(`❌ Failed: ${failedTests}`)
console.log(`🟡 Manual Check: ${totalTests - passedTests - failedTests}`)
console.log(`Success Rate: ${((passedTests / totalTests) * 100).toFixed(1)}%`)

if (failedTests === 0) {
    console.log('\n🎉 ALL TESTS PASSED! Chatbot strictness is working!')
} else {
    console.log('\n⚠️  Some tests failed. Please review the responses above.')
}

console.log('\n')
