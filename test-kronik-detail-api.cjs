// Test kronik detail API endpoint
const http = require('http');

// Test with entry ID 1
const entryId = 1;

const options = {
  hostname: 'localhost',
  port: 3000,
  path: `/api/kronik/entries/detail/${entryId}`,
  method: 'GET',
  headers: {
    'Content-Type': 'application/json'
  }
};

console.log(`Testing API: http://localhost:3000${options.path}\n`);

const req = http.request(options, (res) => {
  let data = '';

  console.log(`Status Code: ${res.statusCode}`);
  console.log(`Headers:`, res.headers);
  console.log('');

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    try {
      const json = JSON.parse(data);
      console.log('Response:', JSON.stringify(json, null, 2));

      if (json.data) {
        console.log('\n✓ Entry found!');
        console.log('Title:', json.data.what_title);
        console.log('Category:', json.data.category_name);
        console.log('When:', json.data.when_date);
      } else {
        console.log('\n⚠️  No data in response');
      }
    } catch (e) {
      console.error('Error parsing response:', e.message);
      console.log('Raw response:', data);
    }
  });
});

req.on('error', (error) => {
  console.error('Request Error:', error.message);
  console.log('\n⚠️  Make sure dev server is running (npm run dev)');
});

req.end();
