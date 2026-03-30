/**
 * Cloudflare Worker — proxy transparente para mercado.vortexagents.ai
 * Sirve vortex-landing-kappa.vercel.app/mercado/* con URL limpia
 *
 * Deploy:
 *   1. Cloudflare → Workers & Pages → Create application → Create Worker
 *   2. Nombre: mercado-proxy
 *   3. Pega este código → Deploy
 *   4. Settings → Domains & Routes → Add Custom Domain → mercado.vortexagents.ai
 */

const UPSTREAM = 'https://vortex-landing-kappa.vercel.app';

export default {
  async fetch(request) {
    const url = new URL(request.url);
    const upstream = new URL(url.pathname + url.search, UPSTREAM);

    // Root → /mercado/
    if (url.pathname === '/' || url.pathname === '') {
      upstream.pathname = '/mercado/';
    } else if (!url.pathname.startsWith('/mercado')) {
      upstream.pathname = '/mercado' + url.pathname;
    }

    const response = await fetch(upstream.toString(), {
      method: request.method,
      headers: request.headers,
      body: request.method !== 'GET' && request.method !== 'HEAD' ? request.body : undefined,
    });

    return new Response(response.body, {
      status: response.status,
      headers: response.headers,
    });
  },
};
