import fetch from 'node-fetch'; // built in for node 18+

async function fetchWithRetry(url, options, retries = 10) {
  for (let i = 0; i < retries; i++) {
    try {
      return await fetch(url, options);
    } catch (e) {
      if (e.code === 'ECONNREFUSED' && i < retries - 1) {
        await new Promise(r => setTimeout(r, 2000));
      } else {
        throw e;
      }
    }
  }
}

async function runTest() {
  console.log("Testing 'baptis'...");
  let res = await fetchWithRetry('http://localhost:3000/api/chatbot/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "baptis" })
  });
  console.log("Status:", res.status);
  console.log("Response:", await res.text());

  console.log("\nTesting 'pernikahan'...");
  res = await fetchWithRetry('http://localhost:3000/api/chatbot/chat', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: "pernikahan" })
  });
  console.log("Status:", res.status);
  console.log("Response:", await res.text());
}

runTest().catch(console.error);
