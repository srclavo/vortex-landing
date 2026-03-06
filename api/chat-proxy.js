// api/chat-proxy.js
// Vercel / Netlify serverless function — proxies Anthropic API
// so the API key is never exposed in the browser.
//
// Deploy: place this file in /api/chat-proxy.js
// Then in js/chat.js, change the fetch URL to '/api/chat-proxy'

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { model, max_tokens, system, messages } = req.body;

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens, system, messages }),
  });

  const data = await response.json();
  return res.status(response.status).json(data);
}
