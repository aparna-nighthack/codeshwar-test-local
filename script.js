const $ = (s, el = document) => el.querySelector(s);
const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

// Sticky header on scroll
const header = $('#site-header');
const onScroll = () => {
  if (window.scrollY > 8) header.classList.add('scrolled');
  else header.classList.remove('scrolled');
};
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Mobile nav toggle
const mobileBtn = $('#mobileMenuBtn');
const navLinks = $('.nav-links');
mobileBtn?.addEventListener('click', () => navLinks.classList.toggle('open'));
$$('.nav-links a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// Intersection-based reveal animations
const revealTargets = [
  ...$$('.panel'),
  ...$$('.card'),
  ...$$('.team-photo'),
];
const obs = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      obs.unobserve(e.target);
    }
  }
}, { threshold: 0.12 });
revealTargets.forEach(t => { t.setAttribute('data-animate', ''); obs.observe(t); });

// Demo: simulated models
const demoForm = $('#demoForm');
const demoText = $('#demoText');
const modelSel = $('#model');
const toneSel = $('#tone');
const output = $('#outputContent');
const demoErr = $('#demoError');

function setOutputStreaming(text, speed = 18) {
  output.innerHTML = '';
  const pre = document.createElement('div');
  pre.style.whiteSpace = 'pre-wrap';
  output.appendChild(pre);
  let i = 0;
  const id = setInterval(() => {
    pre.textContent += text.slice(i, i + 2);
    i += 2;
    if (i >= text.length) clearInterval(id);
  }, speed);
}

function summarize(text, tone = 'neutral') {
  const clean = text.replace(/\s+/g, ' ').trim();
  const sents = clean.split(/(?<=[.!?])\s+/).filter(Boolean);
  const head = sents.slice(0, 2).join(' ');
  const tones = {
    neutral: 'Summary',
    formal: 'Executive Summary',
    casual: 'Quick Take',
  };
  return `${tones[tone] || 'Summary'}:\n• ${head}\n• Key idea: ${extractKeywords(clean).slice(0,3).join(', ')}`;
}

function analyzeSentiment(text) {
  const pos = ['good','great','excellent','love','happy','win','amazing','positive','benefit','success','fast','easy'];
  const neg = ['bad','terrible','awful','hate','sad','fail','slow','bug','issue','negative','hard','complex'];
  const words = text.toLowerCase().match(/[a-z']+/g) || [];
  let score = 0;
  for (const w of words) {
    if (pos.includes(w)) score++;
    if (neg.includes(w)) score--;
  }
  const label = score > 1 ? 'Positive' : score < -1 ? 'Negative' : 'Neutral';
  const emoji = score > 1 ? '😄' : score < -1 ? '😟' : '😐';
  const magnitude = Math.min(Math.abs(score) / 5, 1);
  return `Sentiment: ${label} ${emoji}\nScore: ${score} | Confidence: ${(0.5 + magnitude/2).toFixed(2)}`;
}

function extractEntities(text) {
  const entities = new Set();
  const re = /\b([A-Z][a-zA-Z]{2,}(?:\s+[A-Z][a-zA-Z]{2,})*)\b/g;
  let m; while ((m = re.exec(text))) entities.add(m[1]);
  const list = Array.from(entities).slice(0, 12);
  return list.length ? `Entities:\n- ${list.join('\n- ')}` : 'No prominent entities detected.';
}

function simulateTranslate(text) {
  const map = {a:'á', e:'ē', i:'î', o:'ō', u:'ü'};
  const out = text.replace(/[aeiou]/g, v => map[v] || v);
  return `Simulated Translation (demo):\n${out}`;
}

function extractKeywords(text) {
  const bad = new Set(['the','a','an','and','or','but','of','to','in','on','for','with','is','are','was','were','be','this','that','it','as','by','from','at','we','you','they','i']);
  const counts = new Map();
  for (const w of (text.toLowerCase().match(/[a-z']+/g) || [])) {
    if (w.length < 3 || bad.has(w)) continue;
    counts.set(w, (counts.get(w) || 0) + 1);
  }
  return [...counts.entries()].sort((a,b)=>b[1]-a[1]).map(([w])=>w);
}

demoForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  demoErr.textContent = '';
  const text = demoText.value.trim();
  if (!text) { demoErr.textContent = 'Please enter some text for the model.'; return; }
  const model = modelSel.value;
  const tone = toneSel.value;

  output.innerHTML = '<div class="placeholder">Initializing model <span class="typing">…</span></div>';

  setTimeout(() => {
    let result = '';
    if (model === 'summarize') result = summarize(text, tone);
    else if (model === 'sentiment') result = analyzeSentiment(text);
    else if (model === 'entities') result = extractEntities(text);
    else result = simulateTranslate(text);
    setOutputStreaming(result, 14);
  }, 600);
});

demoForm?.addEventListener('reset', () => {
  output.innerHTML = '<div class="placeholder">Your results will appear here with a live stream effect…</div>';
  demoErr.textContent = '';
});

// Use case filters
const grid = $('#usecaseGrid');
const chips = $$('.chip');
chips.forEach(ch => ch.addEventListener('click', () => {
  chips.forEach(c => c.classList.remove('active'));
  ch.classList.add('active');
  const tag = ch.dataset.filter;
  $$('.card', grid).forEach(card => {
    const hit = tag === 'all' || card.dataset.tags.includes(tag);
    card.classList.toggle('hidden', !hit);
  });
}));

// Contact form validation
const contactForm = $('#contactForm');
const status = $('#contactStatus');
function setErr(id, msg) { const el = $(`.err[data-for="${id}"]`); if (el) el.textContent = msg || ''; }
function validateEmail(v) { return /[^\s@]+@[^\s@]+\.[^\s@]+/.test(v); }
contactForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  status.textContent = '';
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const message = $('#message').value.trim();
  let ok = true;
  if (!name) { setErr('name', 'Please provide your name.'); ok = false; } else setErr('name');
  if (!validateEmail(email)) { setErr('email', 'Enter a valid email.'); ok = false; } else setErr('email');
  if (message.length < 10) { setErr('message', 'Please add more detail (10+ chars).'); ok = false; } else setErr('message');
  if (!ok) return;
  status.textContent = 'Sending…';
  setTimeout(() => { status.textContent = 'Message sent! We’ll be in touch.'; contactForm.reset(); }, 900);
});

// Year
$('#year').textContent = new Date().getFullYear();

// Chatbot widget
const chatToggle = $('#chatToggle');
const chatWidget = $('#chatWidget');
const chatClose = $('#chatClose');
const chatForm = $('#chatForm');
const chatText = $('#chatText');
const chatMessages = $('#chatMessages');

function addMsg(text, who = 'ai') {
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.textContent = text;
  chatMessages.appendChild(div);
  chatMessages.scrollTop = chatMessages.scrollHeight;
  return div;
}
function addTyping() { return addMsg('Assistant is typing…', 'ai typing'); }
function removeTyping(el) { if (el?.classList.contains('typing')) el.remove(); }
function streamInto(el, text, speed = 12) {
  el.textContent = '';
  let i = 0; const id = setInterval(() => {
    el.textContent += text[i++] || '';
    if (i >= text.length) clearInterval(id);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  }, speed);
}
function replyFor(q) {
  const s = q.toLowerCase();
  if (s.includes('sentiment')) return 'For sentiment, our classifiers weigh contextual cues and intensity. Want to try it in the demo above?';
  if (s.includes('summar') || s.includes('summarize')) return 'Summarization distills key points with extractive + abstractive heuristics. Paste text into the demo to see it in action.';
  if (s.includes('price') || s.includes('cost')) return 'We tailor pricing to scope and SLAs. Share your use case, and we’ll propose options within 1–2 business days.';
  if (s.includes('contact') || s.includes('email')) return 'Use the contact form to reach our team, or share details here and we’ll follow up.';
  return 'Great question. I can share best practices, integration tips, or examples. What are you building?';
}

function openChat() { chatWidget.classList.add('open'); chatToggle.setAttribute('aria-expanded', 'true'); chatText.focus(); }
function closeChat() { chatWidget.classList.remove('open'); chatToggle.setAttribute('aria-expanded', 'false'); }

chatToggle?.addEventListener('click', () => {
  if (chatWidget.classList.contains('open')) closeChat(); else openChat();
});
chatClose?.addEventListener('click', closeChat);

chatForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const q = chatText.value.trim(); if (!q) return;
  addMsg(q, 'user'); chatText.value = '';
  const t = addTyping();
  setTimeout(() => {
    removeTyping(t);
    const m = addMsg('', 'ai');
    streamInto(m, replyFor(q));
  }, 600 + Math.random()*600);
});
