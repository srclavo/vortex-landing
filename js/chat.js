// ── CHAT ────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `You are DARA, an AI sales agent for Vortex AI Agents — a company based in The Woodlands, TX that deploys autonomous AI agent workforces for local businesses. You are a live demonstration of the product you're selling.

COMPANY:
- Vortex AI Agents, a division of Sr Clavo LLC
- Location: The Woodlands, TX (Houston metro)
- 30 years of enterprise digital transformation experience backing the team
- Website: vortexagents.ai

YOUR JOB: Qualify prospects and push them toward booking a 30-min strategy call.

QUALIFICATION QUESTIONS (ask in order, one at a time):
1. What type of business do you run? (medical/dental, freight/logistics, or other)
2. What's your biggest operational pain right now? (leads, reviews, manual ops, etc.)
3. How many people are currently handling that process manually?
4. Have you tried tools like Birdeye, Podium, or similar?

SERVICES WE OFFER:
- Medical/Dental: Review Agent ($500-800/mo), UMPM Tier 2 ($3K-5K/mo)
- Freight Brokerage: Full agent stack from $400/mo to $1,750/mo for complete package
- All clients: E9 Positioner (SEO + Google + AI Search visibility, +$300/mo)
- Month-to-month contracts only. No annual lock-in.

THE 9 AGENTS:
E1 Quoter (freight sales), E2 Finder (carrier matching), E3 Receiver (availability), 
E4 Negotiator (rate negotiation), E5 Accountant (commissions), E6 Evaluator (carrier scoring),
E7 Supervisor (orchestration), E8 Reporter (analytics), E9 Positioner (SEO/visibility)

COMPETITIVE ADVANTAGES:
- Local team in The Woodlands — can meet in person
- Month-to-month vs Birdeye/Podium annual contracts
- Fraction of the cost with enterprise-grade capability
- HIPAA compliant for medical vertical (Twilio BAA)
- 30 years enterprise experience

PERSONALITY:
- Direct, confident, professional but warm. You are the product demo.
- Keep responses SHORT — max 3-4 lines per message, WhatsApp style
- Ask ONE question at a time, never multiple
- Use line breaks for readability
- After qualifying, always push toward: "Book a 30-min strategy call at vortexagents.ai"

LANGUAGE: Respond in the same language the user writes in (English or Spanish).

IMPORTANT: You are a live demo of what Vortex AI Agents does. Mention this naturally — "You're talking to one of our agents right now" — when relevant.`;
const quickRepliesEN = [
  ["I run a dental practice","I'm a freight broker","Tell me more","Pricing?"]
];
const quickRepliesES = [
  ["Tengo un consultorio","Soy broker de carga","Cuéntame más","¿Precios?"]
];

let history=[], chatOpen=false;

function toggleChat(){
  chatOpen=!chatOpen;
  document.getElementById('chat-win').classList.toggle('open',chatOpen);
  document.getElementById('ico-chat').style.display=chatOpen?'none':'block';
  document.getElementById('ico-close').style.display=chatOpen?'block':'none';
  const badge=document.querySelector('.chat-badge');
  if(badge) badge.remove();
  if(chatOpen && history.length===0) initChat();
  if(chatOpen) setTimeout(()=>document.getElementById('ch-input').focus(),180);
}

function ts(){ return new Date().toLocaleTimeString([],{hour:'2-digit',minute:'2-digit'}); }

function addMsg(text, role){
  const msgs=document.getElementById('ch-msgs');
  const d=document.createElement('div');
  d.className='msg '+role;
  d.innerHTML=text.replace(/\n/g,'<br>')+`<span class="ts">${ts()}</span>`;
  msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
}

function showTyping(){
  const msgs=document.getElementById('ch-msgs');
  const d=document.createElement('div'); d.className='typing'; d.id='typing';
  d.innerHTML='<span></span><span></span><span></span>';
  msgs.appendChild(d); msgs.scrollTop=msgs.scrollHeight;
}
function hideTyping(){ const t=document.getElementById('typing'); if(t) t.remove(); }

function setQR(opts){
  const row=document.getElementById('qr-row'); row.innerHTML='';
  (opts||[]).forEach(o=>{ const b=document.createElement('button'); b.className='qr'; b.textContent=o; b.onclick=()=>sendMsg(o); row.appendChild(b); });
}

function initChat(){
  const lang=document.documentElement.lang||'en';
  const greet = lang==='es'
    ? "Hola! Soy DARA, agente de Vortex AI Agents.\n\n¿Qué tipo de negocio tienes?"
    : "Hey! I'm DARA, Vortex AI Agents sales agent.\n\nWhat type of business do you run?";
  setTimeout(()=>{
    addMsg(greet,'bot');
    history.push({role:'assistant',content:greet});
    setQR(lang==='es' ? quickRepliesES[0] : quickRepliesEN[0]);
  },500);
}

async function sendMsg(text){
  if(!text.trim()) return;
  const inp=document.getElementById('ch-input');
  const btn=document.getElementById('ch-send');
  addMsg(text,'user');
  history.push({role:'user',content:text});
  inp.value=''; inp.style.height='auto';
  btn.disabled=true; setQR([]);
  showTyping();
  try{
    const res=await fetch('https://api.anthropic.com/v1/messages',{
      method:'POST',
      headers:{'Content-Type':'application/json'},
      body:JSON.stringify({model:'claude-sonnet-4-20250514',max_tokens:300,system:SYSTEM_PROMPT,messages:history})
    });
    const data=await res.json();
    hideTyping();
    const reply=data.content?.[0]?.text||'Something went wrong. Try again.';
    addMsg(reply,'bot');
    history.push({role:'assistant',content:reply});
    const lang=document.documentElement.lang||'en';
    if(history.length<=4) setQR(lang==='es'?['Automatización','Reseñas Google','Cotizaciones','Precios']:['Automation','Google reviews','Quoting','Pricing?']);
    else setQR(lang==='es'?['Ver demo','Agendar llamada']:['See a demo','Book a call']);
  }catch(e){ hideTyping(); addMsg('Network error — please try again.','bot'); }
  btn.disabled=false; inp.focus();
}

document.addEventListener('DOMContentLoaded',()=>{
  const inp=document.getElementById('ch-input');
  inp.addEventListener('keydown',e=>{ if(e.key==='Enter'&&!e.shiftKey){e.preventDefault();sendMsg(inp.value);} });
  inp.addEventListener('input',()=>{ inp.style.height='auto'; inp.style.height=Math.min(inp.scrollHeight,90)+'px'; });
  document.getElementById('ch-send').addEventListener('click',()=>sendMsg(inp.value));
});