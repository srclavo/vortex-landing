# CLAUDE.md — Vortex AI Agents Landing Page
## Context for Claude Code

This is the marketing landing page for **Vortex AI Agents**, a division of **Sr Clavo LLC**,
based in The Woodlands, TX. Domain: **vortexagents.ai**

---

## Business Context

**Owner:** Daniel — 30-year enterprise consultant (SAP, ERP, digital transformation)
**Model:** AI Agent-as-a-Service (AaaS) for local SMBs
**Target markets:** Medical/Dental practices + Freight Brokers (Houston metro)
**Competitive moat:** Local presence + enterprise credibility + month-to-month pricing

### Product Tiers
- **Tier 1 Medical:** Review Agent (WhatsApp post-visit review requests) — $500/mo
- **Tier 2 Medical:** UMPM (Unified Medical Presence Manager, 8+ platforms) — $3,000–$10,000/mo
- **Freight:** 9-agent stack (E1–E9) for quoting, dispatch, negotiation, commissions — $400–$1,750/mo
- **E9 (Posicionador):** SEO + GBP + AI Search add-on — +$300/mo, works on both verticals

### Tech Stack (backend, not in this repo)
- n8n (workflow orchestration)
- Claude API (Anthropic)
- WhatsApp Business API
- Google Business Profile API
- Google Sheets (MVP data layer) → Supabase (scale)

---

## File Structure

```
vortex-landing/
├── index.html          # Main page — all sections, no inline JS/CSS
├── css/
│   └── styles.css      # Full design system — tokens, all components
├── js/
│   ├── main.js         # Canvas vortex particle animation + custom cursor
│   ├── i18n.js         # Bilingual EN/ES — T object (113 keys each) + setLang()
│   └── chat.js         # DARA sales agent — Claude API integration
├── api/
│   └── chat-proxy.js   # Vercel/Netlify serverless proxy (production security)
├── assets/             # Empty — add favicon.ico, og-image.jpg here
├── .env.example        # API key template
├── .gitignore
├── package.json        # npm run dev → serve on :3000
└── CLAUDE.md           # This file
```

---

## Design System (css/styles.css)

```css
--bg: #080a0f          /* Main background */
--surface: #0f1318     /* Card/section background */
--surface2: #161c24    /* Elevated surfaces */
--border: rgba(255,255,255,0.07)
--green: #00ff88       /* Primary accent */
--blue: #00c8ff        /* Secondary accent (freight) */
--white: #f0f4f8
--muted: rgba(240,244,248,0.45)
```

Fonts: **Bebas Neue** (headings) · **DM Sans** (body) · **JetBrains Mono** (labels/code)

---

## Page Sections (index.html)

| ID | Name | Background |
|----|------|-----------|
| `#hero` | Hero + orbit animation | transparent (canvas shows) |
| ticker | Scrolling feature strip | `--surface` |
| `#problem` | 4 pain points | `--surface` |
| `#solution` | 9 agent cards (E1–E9) | `--bg` |
| `#verticals` | Medical + Freight pricing | `--surface` |
| `#why` | Credibility + comparison table | `--bg` |
| `#process` | 4-step onboarding | `--surface` |
| `#testimonials` | 3 placeholder cards | `--bg` |
| `#cta` | Book Strategy Call | `--bg` + radial glow |

---

## Bilingual System (js/i18n.js)

```js
setLang('en')  // switches all [data-key] elements to English
setLang('es')  // switches all [data-key] elements to Spanish
```

- T object has **113 keys × 2 languages**
- Some values are HTML (listed in `htmlKeys` Set) — uses `innerHTML`
- Others are plain text — uses `textContent`
- Triggered by nav buttons `#btnEN` and `#btnES`

**To add a new translatable string:**
1. Add `data-key="my_key"` to the HTML element
2. Add `my_key: 'English text'` to `T.en`
3. Add `my_key: 'Texto en español'` to `T.es`
4. If it contains HTML tags, add `'my_key'` to the `htmlKeys` Set

---

## DARA Chat Agent (js/chat.js)

DARA is a sales qualification agent powered by Claude API.

```js
// Key functions
toggleChat()     // open/close chat window
initChat()       // sends greeting on first open
sendMsg(text)    // user sends message → API → display response
setQR(options)   // update quick reply buttons
```

**Chat flow:**
1. Opens with greeting + business type quick replies
2. Asks 3–4 qualification questions
3. Pushes toward "Book a 30-min Strategy Call"
4. Adjusts language based on `document.documentElement.lang`

**⚠️ SECURITY:** In dev, API key is embedded in chat.js (line with `ANTHROPIC_API_KEY`).
For production, use `api/chat-proxy.js` and change the fetch URL in `sendMsg()` to `/api/chat-proxy`.

---

## Pending Work (Next Steps)

### High Priority
- [ ] **API key security** — move key to `/api/chat-proxy.js` before deploying publicly
- [ ] **Calendly integration** — replace `mailto:` CTA with Calendly popup (`data-cal-link`)
- [ ] **Favicon** — add `favicon.ico` + `apple-touch-icon.png` to `assets/`
- [ ] **OG image** — add `og-image.jpg` (1200×630) to `assets/` for social sharing

### Content
- [ ] **Testimonials** — replace 3 placeholder cards with real pilot client results
- [ ] **Hero stats** — update 9/$50/30Y/97% when real data available
- [ ] **Pricing** — confirm final prices before launch ($500, $400, etc.)

### Technical
- [ ] **Robots.txt** — add to root
- [ ] **Sitemap.xml** — generate after domain is live
- [ ] **Analytics** — add GA4 or Plausible tracking snippet to `<head>`
- [ ] **Meta tags** — verify OG/Twitter card tags are correct
- [ ] **DNS** — point vortexagents.ai to Vercel/Netlify deployment

### Nice to Have
- [ ] Scroll-based fade-in animations (removed for stability — can re-add with GSAP)
- [ ] Mobile nav menu (hamburger for <900px)
- [ ] Agent detail modal (click agent card → expanded description)

---

## Local Development

```bash
npm install
npm run dev
# → http://localhost:3000
```

Or just open `index.html` directly in Chrome.

---

## Deployment (Vercel)

```bash
npm i -g vercel
vercel
# Follow prompts — set ANTHROPIC_API_KEY as environment variable
# Custom domain: vortexagents.ai
```

---

## Key Decisions Made

- **No annual contracts** — month-to-month is the core differentiator vs Birdeye/Podium
- **Local presence** is the main moat — not "AI" as a novelty
- **E9 (Posicionador) never sold alone** — always bundled with another agent
- **Testimonial placeholders** — honest about pilot stage, real results to replace soon
- **Single HTML file option** — `vortex-landing-final.html` is the self-contained version
# Workflow Orchestration

### 1. Plan Node Default
- Enter plan mode for any non-trivial task (three or more steps, or involving architectural decisions).
- If something goes wrong, stop and re-plan immediately rather than continuing blindly.
- Use plan mode for verification steps, not just implementation.
- Write detailed specifications upfront to reduce ambiguity.

### 2. Subagent Strategy
- Use subagents liberally to keep the main context window clean.
- Offload research, exploration, and parallel analysis to subagents.
- For complex problems, allocate more compute via subagents.
- Assign one task per subagent to ensure focused execution.

### 3. Self-Improvement Loop
- After any correction from the user, update tasks/lessons.md with the relevant pattern.
- Create rules that prevent repeating the same mistake.
- Review lessons at the start of each session when relevant to the project.

### 4. Verification Before Done
- Never mark a task complete without proving it works.
- Diff behavior between main and your changes when relevant.
- Ask yourself: "Would a staff engineer approve this?"
- Run tests, check logs, and demonstrate correctness.

### 5. Demand Elegance (Balanced)
- For non-trivial changes, pause and ask whether there is a more elegant solution.
- If a fix feels hacky, implement the solution you would choose knowing everything you now know.
- Do not over-engineer simple or obvious fixes.

### 6. Autonomous Bug Fixing
- When given a bug report, fix it without asking for unnecessary guidance.
- Review logs, errors, and failing tests, then resolve them.
- Fix failing CI tests proactively.

## Task Management
1. Plan First: Write the plan to tasks/todo.md with checkable items.
2. Verify Plan: Review before starting implementation.
3. Track Progress: Mark items complete as you go.
4. Explain Changes: Provide a high-level summary at each step.
5. Document Results: Add a review section to tasks/todo.md.
6. Capture Lessons: Update tasks/lessons.md after corrections.

## Core Principles
- Simplicity First: Make every change as simple as possible. Minimize code impact.
- No Laziness: Identify root causes. Avoid temporary fixes. Apply senior developer standards.
- Minimal Impact: Touch only what is necessary. Avoid introducing new bugs.
