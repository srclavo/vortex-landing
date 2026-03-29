/**
 * Cloudflare Worker — proxy transparente para abstorage.vortexagents.ai
 * La URL del usuario se mantiene limpia (no redirige a vercel.app)
 *
 * Deploy:
 *   1. Cloudflare → Workers & Pages → Create Worker → pega este código
 *   2. Nombra el worker: abstorage-proxy
 *   3. Settings → Triggers → Add route: abstorage.vortexagents.ai/*  → zona vortexagents.ai
 *   4. Borra la Page Rule de forwarding (ya no se necesita)
 */

const UPSTREAM = 'https://vortex-landing-kappa.vercel.app';

export default {
  async fetch(request) {
    const url = new URL(request.url);

    // Rewrite hostname to Vercel, keep path + query
    const upstream = new URL(url.pathname + url.search, UPSTREAM);

    // If root path, serve /abstorage/
    if (url.pathname === '/' || url.pathname === '') {
      upstream.pathname = '/abstorage/';
    } else if (url.pathname.startsWith('/mercado')) {
      // Pass /mercado/* through unchanged
    } else if (!url.pathname.startsWith('/abstorage')) {
      upstream.pathname = '/abstorage' + url.pathname;
    }

    const response = await fetch(upstream.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    // Pass through response with original headers
    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  },
};
