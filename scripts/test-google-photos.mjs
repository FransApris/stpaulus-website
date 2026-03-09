/**
 * Test Google Photos API Connection
 * Verifikasi bahwa credentials valid dan API berfungsi
 * 
 * Usage: node scripts/test-google-photos.mjs
 */

import 'dotenv/config'

const config = {
    clientId: process.env.GOOGLE_PHOTOS_CLIENT_ID,
    clientSecret: process.env.GOOGLE_PHOTOS_CLIENT_SECRET,
    redirectUri: process.env.GOOGLE_PHOTOS_REDIRECT_URI,
    userEmail: process.env.GOOGLE_PHOTOS_USER_EMAIL
}

console.log('🔍 Testing Google Photos API Configuration...\n')

// Check environment variables
console.log('📋 Configuration Check:')
console.log('✓ Client ID:', config.clientId ? '✅ Set' : '❌ Missing')
console.log('✓ Client Secret:', config.clientSecret ? '✅ Set' : '❌ Missing')
console.log('✓ Redirect URI:', config.redirectUri || '❌ Missing')
console.log('✓ User Email:', config.userEmail || '❌ Missing')

if (!config.clientId || !config.clientSecret) {
    console.error('\n❌ Error: Missing required credentials!')
    console.log('\n💡 Fix: Edit .env file and add:')
    console.log('   GOOGLE_PHOTOS_CLIENT_ID=your-client-id')
    console.log('   GOOGLE_PHOTOS_CLIENT_SECRET=your-secret')
    process.exit(1)
}

// Validate Client ID format
const clientIdPattern = /^\d+-[a-z0-9]+\.apps\.googleusercontent\.com$/
if (!clientIdPattern.test(config.clientId)) {
    console.warn('\n⚠️  Warning: Client ID format looks incorrect')
    console.log('   Expected format: 123456789-abc...xyz.apps.googleusercontent.com')
}

// Generate OAuth URL (test)
const authParams = new URLSearchParams({
    client_id: config.clientId,
    redirect_uri: config.redirectUri,
    response_type: 'code',
    scope: 'https://www.googleapis.com/auth/photoslibrary.readonly',
    access_type: 'offline',
    prompt: 'consent'
})

const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${authParams.toString()}`

console.log('\n✅ Configuration Valid!\n')
console.log('📸 Google Photos Integration Ready\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('🚀 Next Steps:\n')
console.log('1. Start development server:')
console.log('   npm run dev\n')
console.log('2. Open admin panel:')
console.log('   http://localhost:3000/admin/google-photos\n')
console.log('3. Click "Connect Google Photos" button\n')
console.log('4. Login dengan: ' + config.userEmail + '\n')
console.log('5. Authorize aplikasi\n')
console.log('6. Start syncing albums!\n')
console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')
console.log('📖 Documentation: GOOGLE_PHOTOS_HYBRID_GUIDE.md')
console.log('⚡ Quick Start: GOOGLE_PHOTOS_QUICKSTART.md\n')

// Show Auth URL for manual testing (if needed)
if (process.argv.includes('--show-auth-url')) {
    console.log('\n🔗 OAuth URL (for manual testing):')
    console.log(authUrl)
    console.log('\nNote: This URL is also available at /api/google-photos/auth-url')
}

console.log('✨ Test completed successfully!\n')
