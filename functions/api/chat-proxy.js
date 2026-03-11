// Cloudflare Pages Function — proxies Anthropic API
// so the API key is never exposed in the browser.
// Route: /api/chat-proxy (auto-mapped from functions/api/chat-proxy.js)

export async function onRequestPost(context) {
  const { request, env } = context;

  const { model, max_tokens, system, messages } = await request.json();

  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({ model, max_tokens, system, messages }),
  });

  const data = await response.json();

  return new Response(JSON.stringify(data), {
    status: response.status,
    headers: { 'Content-Type': 'application/json' },
  });
}
