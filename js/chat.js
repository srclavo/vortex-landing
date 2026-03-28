// ── CHAT — powered by Vortex AI Agents Railway API ──────────────────────────
const VORTEX_API      = 'https://api.vortexagents.ai';
const VORTEX_KEY      = 'vortex_public_2026';
const VORTEX_BUSINESS = 'vortex';

const quickRepliesEN = [
  ["Show me pricing","Book a demo","How does it work?","Talk to a human"]
];
const quickRepliesES = [
  ["Ver precios","Agendar demo","¿Cómo funciona?","Hablar con alguien"]
];

let chatOpen = false;

function getSessionId() {
  let sid = localStorage.getItem('vx_session');
  if (!sid) {
    sid = 'vx_' + Math.random().toString(36).slice(2, 11);
    localStorage.setItem('vx_session', sid);
  }
  return sid;
}

function toggleChat() {
  chatOpen = !chatOpen;
  document.getElementById('chat-win').classList.toggle('open', chatOpen);
  document.getElementById('ico-chat').style.display = chatOpen ? 'none' : 'block';
  document.getElementById('ico-close').style.display = chatOpen ? 'block' : 'none';
  document.getElementById('chat-tooltip').classList.remove('visible');
  if (chatOpen && document.getElementById('ch-msgs').children.length === 0) initChat();
  if (chatOpen) setTimeout(() => document.getElementById('ch-input').focus(), 180);
}

function ts() { return new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }); }

function addMsg(text, role) {
  const msgs = document.getElementById('ch-msgs');
  const d = document.createElement('div');
  d.className = 'msg ' + role;
  d.innerHTML = text.replace(/\n/g, '<br>') + `<span class="ts">${ts()}</span>`;
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}

function showTyping() {
  const msgs = document.getElementById('ch-msgs');
  const d = document.createElement('div'); d.className = 'typing'; d.id = 'typing';
  d.innerHTML = '<span></span><span></span><span></span>';
  msgs.appendChild(d);
  msgs.scrollTop = msgs.scrollHeight;
}
function hideTyping() { const t = document.getElementById('typing'); if (t) t.remove(); }

function setQR(opts) {
  const row = document.getElementById('qr-row'); row.innerHTML = '';
  (opts || []).forEach(o => {
    const b = document.createElement('button'); b.className = 'qr';
    b.textContent = o; b.onclick = () => sendMsg(o); row.appendChild(b);
  });
}

function initChat() {
  const lang = document.documentElement.lang || 'en';
  const greet = lang === 'es'
    ? "Hola! Soy DARA 👋\n\nPuedo responder preguntas sobre nuestros agentes de IA, mostrarte precios o agendarte una demo.\n\n¿En qué te puedo ayudar?"
    : "Hi! I'm DARA 👋\n\nI can answer questions about our AI agents, walk you through pricing, or book a quick demo.\n\nWhat can I help you with?";
  setTimeout(() => {
    addMsg(greet, 'bot');
    setQR(lang === 'es' ? quickRepliesES[0] : quickRepliesEN[0]);
  }, 500);
}

async function sendMsg(text) {
  if (!text.trim()) return;
  const inp = document.getElementById('ch-input');
  const btn = document.getElementById('ch-send');
  addMsg(text, 'user');
  inp.value = ''; inp.style.height = 'auto';
  btn.disabled = true; setQR([]);
  showTyping();
  try {
    const res = await fetch(`${VORTEX_API}/api/v1/agents/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': VORTEX_KEY,
      },
      body: JSON.stringify({
        message: text,
        session_id: getSessionId(),
        business_id: VORTEX_BUSINESS,
      }),
    });
    const data = await res.json();
    hideTyping();
    const reply = data.message || 'Something went wrong. Try again.';
    addMsg(reply, 'bot');
    const lang = document.documentElement.lang || 'en';
    const msgCount = document.getElementById('ch-msgs').querySelectorAll('.msg.user').length;
    if (msgCount <= 2) setQR(lang === 'es' ? quickRepliesES[0] : quickRepliesEN[0]);
    else if (msgCount <= 4) setQR(lang === 'es' ? ['Automatización', 'Reseñas Google', 'Cotizaciones', 'Precios'] : ['Automation', 'Google reviews', 'Quoting', 'Pricing?']);
    else setQR(lang === 'es' ? ['Ver demo', 'Agendar llamada'] : ['See a demo', 'Book a call']);
  } catch (e) {
    hideTyping();
    addMsg('Network error — please try again.', 'bot');
  }
  btn.disabled = false;
  inp.focus();
}

document.addEventListener('DOMContentLoaded', () => {
  const inp = document.getElementById('ch-input');
  inp.addEventListener('keydown', e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); sendMsg(inp.value); } });
  inp.addEventListener('input', () => { inp.style.height = 'auto'; inp.style.height = Math.min(inp.scrollHeight, 90) + 'px'; });
  document.getElementById('ch-send').addEventListener('click', () => sendMsg(inp.value));

  // Invite tooltip: appears after 5s, disappears after 15s or when chat opens
  setTimeout(() => { if (!chatOpen) document.getElementById('chat-tooltip').classList.add('visible'); }, 5000);
  setTimeout(() => { document.getElementById('chat-tooltip').classList.remove('visible'); }, 15000);
});
