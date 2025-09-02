// NexusAI Labs – interactions, demo simulation, and validation

// Helpers
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

// Header: mobile nav toggle
const nav = $('#nav');
const navToggle = $('#navToggle');
if (navToggle) {
  navToggle.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close on link click (mobile)
  $$('#nav a').forEach(a => a.addEventListener('click', () => nav.classList.remove('open')));
}

// Year in footer
$('#year').textContent = new Date().getFullYear();

// Reveal on scroll
const revealables = $$('[data-reveal], .card, .section-head');
const io = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      io.unobserve(e.target);
    }
  });
}, { threshold: 0.12 });
revealables.forEach(el => io.observe(el));

// Interactive Demo
const demoForm = $('#demoForm');
const demoText = $('#demoText');
const demoModel = $('#demoModel');
const demoTone = $('#demoTone');
const demoError = $('#demoError');
const demoStream = $('#demoStream');
const demoStatus = $('#demoStatus');
const demoProgress = $('#demoProgress span');

const simulatedResponses = {
  summarization: (input, tone) => {
    const base = `Summary (${tone}): `;
    let summary = input.trim();
    if (summary.length > 200) summary = summary.slice(0, 180) + '…';
    const sentences = summary
      .replace(/\s+/g, ' ')
      .split(/(?<=[.!?])\s+/)
      .slice(0, 2)
      .join(' ');
    return base + (sentences || 'Concise overview of the provided content.');
  },
  sentiment: (input) => {
    const text = input.toLowerCase();
    const score = (text.match(/(great|love|excellent|happy|good)/g) || []).length - (text.match(/(bad|terrible|hate|sad|poor)/g) || []).length;
    const label = score > 0 ? 'Positive' : score < 0 ? 'Negative' : 'Neutral';
    return `Sentiment: ${label} (confidence ${(Math.min(0.95, 0.6 + Math.abs(score) * 0.1)).toFixed(2)})`;
  },
  keyphrases: (input) => {
    const words = input
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .split(/\s+/)
      .filter(w => w.length > 4);
    const counts = words.reduce((m, w) => (m[w] = (m[w] || 0) + 1, m), {});
    const top = Object.entries(counts).sort((a,b) => b[1]-a[1]).slice(0, 5).map(([w,c]) => `${w} (${c})`);
    return `Keyphrases: ${top.join(', ') || 'n/a'}`;
  }
};

function simulateStreaming(text, onChunk, onDone) {
  const tokens = text.split(/(\s+)/); // include spaces
  let i = 0;
  const total = tokens.length;
  function tick() {
    if (i >= total) { onDone && onDone(); return; }
    const chunk = tokens[i++];
    onChunk(chunk);
    const progress = Math.round((i / total) * 100);
    demoProgress.style.width = progress + '%';
    const delay = 18 + Math.random() * 24; // fast but readable
    setTimeout(tick, delay);
  }
  tick();
}

function setStatus(text) {
  demoStatus.querySelector('span').textContent = text;
}

$('#demoClear').addEventListener('click', () => {
  demoText.value = '';
  demoStream.textContent = '';
  demoProgress.style.width = '0%';
  setStatus('Waiting for input…');
  demoError.textContent = '';
});

demoForm.addEventListener('submit', (e) => {
  e.preventDefault();
  demoError.textContent = '';
  demoStream.textContent = '';
  demoProgress.style.width = '0%';
  if (!demoText.value.trim()) { demoError.textContent = 'Please enter some text.'; return; }
  if (!demoModel.value) { demoError.textContent = 'Please select a model.'; return; }

  setStatus('Initializing model…');
  let stage = 0;
  const stages = ['Tokenizing input…', 'Generating response…', 'Streaming tokens…'];
  const stageTimer = setInterval(() => {
    setStatus(stages[stage] || 'Streaming tokens…');
    stage++;
    if (stage > stages.length) clearInterval(stageTimer);
  }, 800);

  const generator = simulatedResponses[demoModel.value];
  const outputText = generator ? generator(demoText.value, demoTone.value) : 'Result ready.';
  setTimeout(() => {
    setStatus('Streaming tokens…');
    simulateStreaming(outputText, (chunk) => {
      demoStream.textContent += chunk;
    }, () => {
      setStatus('Done');
      setTimeout(() => setStatus('Ready for next input'), 1200);
    });
  }, 800);
});

// Use Case Filtering
const grid = $('#useCaseGrid');
const chips = $$('#filters .chip');
chips.forEach(chip => {
  chip.addEventListener('click', () => {
    chips.forEach(c => c.classList.remove('active'));
    chip.classList.add('active');
    const filter = chip.dataset.filter;
    $$('.use-case', grid).forEach(card => {
      const show = filter === 'all' || card.dataset.tags.includes(filter);
      if (show) {
        card.classList.remove('hide');
      } else {
        card.classList.add('hide');
      }
    });
  });
});

// Contact form validation (client-only simulation)
const contactForm = $('#contactForm');
const contactError = $('#contactError');
contactForm.addEventListener('submit', (e) => {
  e.preventDefault();
  contactError.textContent = '';
  const name = $('#name').value.trim();
  const email = $('#email').value.trim();
  const topic = $('#topic').value;
  const message = $('#message').value.trim();
  const consent = $('#consent').checked;
  const emailOk = /.+@.+\..+/.test(email);

  if (!name || !emailOk || !topic || message.length < 10 || !consent) {
    contactError.textContent = 'Please fill all required fields (message ≥ 10 chars) and consent.';
    return;
  }
  // Simulate send
  const btn = contactForm.querySelector('button[type="submit"]');
  const original = btn.textContent;
  btn.disabled = true; btn.textContent = 'Sending…';
  setTimeout(() => {
    btn.disabled = false; btn.textContent = original;
    alert('Thanks! Your message has been received.');
    contactForm.reset();
  }, 900);
});

// Chatbot widget
const chatToggle = $('#chatToggle');
const chatWindow = $('#chatWindow');
const chatClose = $('#chatClose');
const chatForm = $('#chatForm');
const chatText = $('#chatText');
const chatBody = $('#chatBody');

function openChat() {
  chatWindow.classList.add('open');
  chatWindow.setAttribute('aria-hidden', 'false');
  chatText.focus();
}
function closeChat() {
  chatWindow.classList.remove('open');
  chatWindow.setAttribute('aria-hidden', 'true');
}
chatToggle.addEventListener('click', () => {
  if (chatWindow.classList.contains('open')) closeChat(); else openChat();
});
chatClose.addEventListener('click', () => closeChat());

function addMsg(text, who = 'bot') {
  const div = document.createElement('div');
  div.className = `msg ${who}`;
  div.textContent = text;
  chatBody.appendChild(div);
  chatBody.scrollTop = chatBody.scrollHeight;
}

function addTyping() {
  const wrap = document.createElement('div');
  wrap.className = 'typing';
  wrap.innerHTML = '<span class="dot"></span><span class="dot"></span><span class="dot"></span> typing…';
  chatBody.appendChild(wrap);
  chatBody.scrollTop = chatBody.scrollHeight;
  return wrap;
}

chatForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const text = chatText.value.trim();
  if (!text) return;
  addMsg(text, 'user');
  chatText.value = '';

  const typing = addTyping();
  setTimeout(() => {
    typing.remove();
    const reply = botReply(text);
    addMsg(reply, 'bot');
  }, 650 + Math.random() * 700);
});

function botReply(input) {
  const t = input.toLowerCase();
  if (/(price|pricing|cost)/.test(t)) {
    return 'We offer flexible pilots and enterprise plans. Share scope and volume, and we’ll tailor pricing.';
  }
  if (/(demo|trial|poc|pilot)/.test(t)) {
    return 'Happy to set up a guided demo or POC. Use the contact form with topic “Pilot / POC”.';
  }
  if (/(security|privacy|pii|compliance|hipaa|soc2|gdpr)/.test(t)) {
    return 'We support private deployments, role-based controls, redaction, and audit trails. Compliance options include SOC 2 and GDPR; HIPAA BAA on request.';
  }
  if (/(integrat|api|sdk)/.test(t)) {
    return 'We integrate via REST and event streams. Our SDKs and reference pipelines accelerate onboarding.';
  }
  return 'Great question! A member of our team will follow up — feel free to leave details in the contact form.';
}

// =====================
// Authentication (modal)
// =====================
(function authModule() {
  function init() {
    const authModal = document.getElementById('authModal');
    const loginForm = document.getElementById('loginForm');
    const signupForm = document.getElementById('signupForm');
    const loginError = document.getElementById('loginError');
    const signupError = document.getElementById('signupError');
    const modeButtons = $$('.mode-btn');

  // Render logged-in badge + logout
  function ensureAuthBadge() {
    const header = document.querySelector('.header-inner');
    if (!header) return;
    if (header.querySelector('.auth-badge')) return;
    const badge = document.createElement('div');
    badge.className = 'auth-badge';
    badge.innerHTML = '<span id="whoami"></span> <button class="logout-btn" id="logoutBtn" title="End session">Logout</button>';
    header.appendChild(badge);
    const logoutBtn = badge.querySelector('#logoutBtn');
    logoutBtn.addEventListener('click', () => {
      sessionStorage.removeItem('authToken');
      sessionStorage.removeItem('authUser');
      // Keep user registry for the rest of the session
      showAuthModal();
      updateBadge();
    });
  }

  function updateBadge() {
    ensureAuthBadge();
    const who = document.getElementById('whoami');
    const user = sessionStorage.getItem('authUser');
    const token = sessionStorage.getItem('authToken');
    if (who) {
      if (token && user) {
        who.textContent = `Signed in as @${user}`;
        who.parentElement.style.display = 'inline-flex';
      } else {
        who.textContent = '';
        who.parentElement.style.display = 'none';
      }
    }
  }

  function getUsers() {
    try {
      const raw = sessionStorage.getItem('users');
      if (!raw) return {};
      return JSON.parse(raw);
    } catch { return {}; }
  }
  function saveUsers(users) {
    sessionStorage.setItem('users', JSON.stringify(users));
  }

  function token() {
    return 'tok_' + Math.random().toString(36).slice(2) + Date.now().toString(36);
  }

  function showAuthModal() {
    authModal.classList.add('open');
    authModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('locked');
    // default to login view
    setMode('login');
    setTimeout(() => document.getElementById('loginUser')?.focus(), 0);
  }
  function hideAuthModal() {
    authModal.classList.remove('open');
    authModal.setAttribute('aria-hidden', 'true');
    document.body.classList.remove('locked');
  }

  function setMode(mode) {
    modeButtons.forEach(btn => {
      const active = btn.dataset.mode === mode;
      btn.classList.toggle('active', active);
      btn.setAttribute('aria-selected', String(active));
    });
    if (mode === 'login') {
      loginForm.classList.remove('hidden');
      signupForm.classList.add('hidden');
    } else {
      signupForm.classList.remove('hidden');
      loginForm.classList.add('hidden');
    }
  }
  modeButtons.forEach(btn => btn.addEventListener('click', () => setMode(btn.dataset.mode)));

  function requireAuthOnLoad() {
    const token = sessionStorage.getItem('authToken');
    const user = sessionStorage.getItem('authUser');
    const users = getUsers();
    const defaultOK = user === 'aparna' && token; // allow default without registry
    const hasUser = users[user];
    if (!token || !(defaultOK || hasUser)) {
      showAuthModal();
    } else {
      hideAuthModal();
    }
    updateBadge();
  }

  function doLogin(username, password) {
    loginError.textContent = '';
    const users = getUsers();
    const isDefault = username === 'aparna' && password === 'password';
    const found = users[username];
    const ok = isDefault || (found && found.password === password);
    if (!ok) { loginError.textContent = 'Invalid username or password.'; return; }
    sessionStorage.setItem('authUser', username);
    sessionStorage.setItem('authToken', token());
    sessionStorage.setItem('authAt', String(Date.now()));
    hideAuthModal();
    updateBadge();
  }

  function doSignup(username, password) {
    signupError.textContent = '';
    if (!username || !password) { signupError.textContent = 'Please enter a username and password.'; return; }
    const users = getUsers();
    if (users[username]) { signupError.textContent = 'Username is already taken.'; return; }
    users[username] = { password, createdAt: Date.now() };
    saveUsers(users);
    // Auto-login after signup
    sessionStorage.setItem('authUser', username);
    sessionStorage.setItem('authToken', token());
    sessionStorage.setItem('authAt', String(Date.now()));
    hideAuthModal();
    updateBadge();
  }

  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('loginUser').value.trim();
    const p = document.getElementById('loginPass').value;
    doLogin(u, p);
  });
  signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const u = document.getElementById('signupUser').value.trim();
    const p = document.getElementById('signupPass').value;
    doSignup(u, p);
  });

  // Block ESC-close; modal only hides on success
  authModal.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') e.preventDefault();
  });
  // Enforce immediately after init
  requireAuthOnLoad();
  }
  // Run after DOM ready to ensure modal exists
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
