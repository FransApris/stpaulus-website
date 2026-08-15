import Groq from 'groq-sdk';
import * as dotenv from 'dotenv';
dotenv.config();

const groq = new Groq({ apiKey: process.env.NUXT_GROQ_API_KEY });

async function testGroq() {
  const messages = [
    { role: 'system', content: 'You are a bot. Respond in JSON.' },
    { role: 'user', content: 'baptis' }
  ];

  const tools = [
    {
      type: "function",
      function: {
        name: "search_website_content",
        description: "Mencari artikel, berita, atau halaman di database website Paroki.",
        parameters: {
          type: "object",
          properties: {
            keyword: { type: "string" },
            content_type: { type: "string", enum: ["berita", "artikel", "semua"] }
          },
          required: ["keyword"]
        }
      }
    }
  ];

  try {
    console.log("STEP 1: Calling Groq with tools...");
    let completion = await groq.chat.completions.create({
      model: 'llama-3.1-8b-instant',
      messages: messages,
      tools: tools,
      tool_choice: 'auto',
      max_tokens: 800,
      temperature: 0.3,
      top_p: 0.8
    });
    
    let responseMessage = completion.choices[0]?.message;
    console.log("STEP 1 RESPONSE:");
    console.log(JSON.stringify(responseMessage, null, 2));

    if (responseMessage?.tool_calls && responseMessage.tool_calls.length > 0) {
      messages.push(responseMessage);
      messages.push({
        tool_call_id: responseMessage.tool_calls[0].id,
        role: "tool",
        name: responseMessage.tool_calls[0].function.name,
        content: JSON.stringify({ message: "Tidak ada berita, artikel, atau halaman yang cocok dengan kata kunci 'pernikahan'." })
      });

      console.log("STEP 5: Calling Groq again...");
      completion = await groq.chat.completions.create({
        model: 'llama-3.1-8b-instant',
        messages: messages,
        response_format: { type: 'json_object' },
        max_tokens: 800,
        temperature: 0.3,
        top_p: 0.8
      });
      console.log("STEP 5 RESPONSE:");
      console.log(JSON.stringify(completion.choices[0]?.message, null, 2));
    }
  } catch (error) {
    console.error("ERROR:", error.message);
  }
}

testGroq();
