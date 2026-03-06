# Vortex AI Agents — Landing Page

> vortexagents.ai | A division of Sr Clavo LLC | The Woodlands, TX

## Project Structure

```
vortex-landing/
├── index.html          # Main landing page (clean, no inline JS/CSS)
├── css/
│   └── styles.css      # All styles (design system + components)
├── js/
│   ├── main.js         # Canvas vortex, custom cursor, scroll reveal
│   ├── i18n.js         # EN/ES translations + setLang()
│   └── chat.js         # DARA — AI sales agent (Claude API)
├── assets/             # Images, icons, favicons (add here)
├── .env.example        # Environment variable template
├── .gitignore
├── package.json
└── README.md
```

## Quick Start (VS Code)

```bash
# 1. Clone / open folder in VS Code
code .

# 2. Install Live Server extension (if not installed)
# Extension ID: ritwickdey.LiveServer

# 3. Right-click index.html → "Open with Live Server"
# Or run:
npm run dev
# → Opens at http://localhost:3000
```

## ⚠️ API Key Setup (DARA Chat)

The DARA chat widget calls the Anthropic API. In development, the key
is embedded in `js/chat.js`. For production, use a backend proxy.

**Development (quick):**
1. Open `js/chat.js`
2. The fetch call at line ~60 goes to `https://api.anthropic.com/v1/messages`
3. Currently has no key (relies on Claude.ai context for testing)
4. Add your key temporarily for local testing:
   ```js
   headers: {
     'Content-Type': 'application/json',
     'x-api-key': 'sk-ant-YOUR_KEY_HERE',  // ← add this line
     'anthropic-version': '2023-06-01'
   }
   ```

**Production (secure — recommended):**
```
/api/
  chat.js   ← Vercel/Netlify serverless function as proxy
```
See `## Deploy` section below.

## Key Files to Edit

### Content Updates
- **Copy & text** → `index.html` (look for `data-key` attributes)
- **Translations** → `js/i18n.js` (T.en and T.es objects)
- **Pricing** → Search for `From $500` in `index.html`
- **CTA email/link** → Search for `mailto:hello@vortexagents.ai`

### DARA Customization
- **Personality & knowledge** → `js/chat.js`, `SYSTEM_PROMPT` constant (top of file)
- **Quick replies** → `quickRepliesEN` and `quickRepliesES` arrays
- **Opening message** → `initChat()` function

### Testimonials (replace placeholders)
Search for `⏳ Pilot client result coming soon` in `index.html`.
Replace placeholder cards with real testimonials:
```html
<div class="testi-text">"Your client quote here."</div>
<div class="testi-author">
  <div class="testi-avatar">🦷</div>
  <div>
    <div class="testi-name">Dr. Jane Smith</div>
    <div class="testi-role">Smith Dental · Spring, TX</div>
  </div>
</div>
<div class="testi-metric">📈 +47 Google reviews in 30 days</div>
```

### Design System (CSS Variables)
Edit `:root` in `css/styles.css`:
```css
--green: #00ff88;     /* Primary accent — change to rebrand */
--accent2: #00c8ff;   /* Secondary accent */
--black: #080a0f;     /* Page background */
--surface: #0d1117;   /* Card backgrounds */
```

## Sections (in order)
1. **Nav** — logo + lang toggle (🇺🇸/🇲🇽) + CTA button
2. **Hero** — headline + agent orbit visual + stats
3. **Ticker** — scrolling feature strip
4. **Problem** — pain points grid
5. **Solution** — 9 agent cards
6. **Verticals** — Medical/Dental + Freight cards
7. **Why Vortex** — credibility + competitive comparison table
8. **Process** — 4-step onboarding
9. **Testimonials** — 3 placeholder cards (replace with real data)
10. **CTA** — final conversion section
11. **Footer**
12. **DARA** — floating chat widget (bottom-right)

## Deploy

### Vercel (recommended — free tier works)
```bash
npm install -g vercel
vercel login
vercel --prod
```

### Netlify
```bash
npm install -g netlify-cli
netlify deploy --prod --dir .
```

### Custom domain (vortexagents.ai)
Point your DNS A record to Vercel/Netlify IP.
Add domain in project settings.

## Secure API Proxy (Production)

Create `/api/chat.js` for Vercel:
```js
export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).end();
  const response = await fetch('https://api.anthropic.com/v1/messages', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': process.env.ANTHROPIC_API_KEY,
      'anthropic-version': '2023-06-01'
    },
    body: JSON.stringify(req.body)
  });
  const data = await response.json();
  res.status(200).json(data);
}
```

Then update `js/chat.js` fetch URL from:
```js
'https://api.anthropic.com/v1/messages'
```
to:
```js
'/api/chat'
```
And remove the `anthropic-version` header from the client.

## Roadmap / TODO
- [ ] Replace testimonial placeholders with real pilot client results
- [ ] Add Calendly embed for strategy call booking
- [ ] Add `/api/chat` proxy for secure API key handling
- [ ] Add favicon + OG image (`assets/og-image.png`, 1200x630)
- [ ] Google Analytics / Meta Pixel setup
- [ ] Add `sitemap.xml` for SEO
- [ ] A/B test hero headline variants
- [ ] "Meet the Team" section (when ready)

---
*Vortex AI Agents — a division of Sr Clavo LLC · The Woodlands, TX*
