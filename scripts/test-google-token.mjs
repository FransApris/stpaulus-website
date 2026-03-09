#!/usr/bin/env node
/**
 * Test Google Photos Token
 * Verify if access token has correct scopes
 */

const token = process.argv[2];

if (!token) {
    console.log('❌ Usage: node test-token.mjs <access_token>');
    process.exit(1);
}

async function testToken() {
    try {
        console.log('\n🔍 Testing Google Photos API access...\n');

        const response = await fetch('https://photoslibrary.googleapis.com/v1/albums?pageSize=10', {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            const errorBody = await response.text();
            console.log('❌ ERROR:', response.status, response.statusText);
            console.log('\nDetails:', errorBody);

            if (response.status === 403) {
                console.log('\n========================================');
                console.log('⚠️  SCOPE NOT CONFIGURED');
                console.log('========================================\n');
                console.log('This means OAuth Consent Screen does NOT have');
                console.log('the scope: photoslibrary.readonly\n');
                console.log('FIX:');
                console.log('1. Go to: https://console.cloud.google.com/apis/credentials/consent');
                console.log('2. Click: EDIT APP');
                console.log('3. Tab 2 (Scopes): ADD OR REMOVE SCOPES');
                console.log('4. Search: photoslibrary');
                console.log('5. Check: .../auth/photoslibrary.readonly');
                console.log('6. UPDATE → SAVE\n');
            }

            process.exit(1);
        }

        const data = await response.json();

        console.log('========================================');
        console.log('✅ TOKEN WORKS!');
        console.log('========================================\n');
        console.log('Albums found:', data.albums?.length || 0);

        if (data.albums && data.albums.length > 0) {
            console.log('\nAlbum List:');
            data.albums.forEach(album => {
                console.log(`  - ${album.title} (${album.mediaItemsCount || 0} photos)`);
            });
        }

        console.log('\n✅ Scope photoslibrary.readonly: CONFIGURED CORRECTLY');
        console.log('\n🎉 You can now use this token in your website!');
        console.log('   It will work when you click "Refresh Albums"\n');

    } catch (error) {
        console.log('❌ Error:', error.message);
        process.exit(1);
    }
}

testToken();
