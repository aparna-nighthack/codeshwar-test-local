// Mobile nav toggle
const header = document.querySelector('.site-header');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.getElementById('site-nav');

if (navToggle && header) {
  navToggle.addEventListener('click', () => {
    const open = header.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  // Close nav when clicking a link (on small screens)
  siteNav?.addEventListener('click', (e) => {
    if (e.target instanceof HTMLAnchorElement) {
      header.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    }
  });
}

// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach((a) => {
  a.addEventListener('click', (e) => {
    const href = a.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Newsletter form mock submit
const form = document.querySelector('.newsletter');
const note = document.querySelector('.form-note');
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = (document.getElementById('email'));
  const value = email && 'value' in email ? email.value.trim() : '';
  if (!value || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
    if (note) note.textContent = 'Please enter a valid email.';
    return;
  }
  if (note) note.textContent = 'Thanks — you’re subscribed!';
  if (email) email.value = '';
});

// Year in footer
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Chatbot widget
(() => {
  const toggle = document.querySelector('.chat-toggle');
  const win = document.getElementById('chat-window');
  const close = document.querySelector('.chat-close');
  const log = document.querySelector('.chat-messages');
  const form = document.querySelector('.chat-form');
  const input = document.getElementById('chat-input');

  if (!toggle || !win || !close || !log || !form || !input) return;

  let openedOnce = false;

  function openChat() {
    if (win.hasAttribute('hidden')) {
      win.removeAttribute('hidden');
      toggle.setAttribute('aria-expanded', 'true');
      if (!openedOnce) {
        openedOnce = true;
        greet();
      }
      setTimeout(() => input.focus(), 0);
    }
  }
  function closeChat() {
    if (!win.hasAttribute('hidden')) {
      win.setAttribute('hidden', '');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.focus();
    }
  }

  toggle.addEventListener('click', () => {
    if (win.hasAttribute('hidden')) openChat();
    else closeChat();
  });
  close.addEventListener('click', closeChat);

  function addMessage(text, who = 'bot') {
    const msg = document.createElement('div');
    msg.className = `msg ${who}`;
    msg.textContent = text;
    log.appendChild(msg);
    log.scrollTop = log.scrollHeight;
  }

  function typing(on = true) {
    let el = log.querySelector('.typing');
    if (on) {
      if (!el) {
        el = document.createElement('div');
        el.className = 'msg bot typing';
        el.textContent = 'Typing…';
        log.appendChild(el);
      }
    } else if (el) {
      el.remove();
    }
    log.scrollTop = log.scrollHeight;
  }

  function greet() {
    addMessage("Hi! I’m the Stride Assistant. Ask about products, sizing, shipping, or returns. Type 'agent' to reach support.");
  }

  function respond(userText) {
    const t = userText.toLowerCase();

    // Simple intent detection
    const includesAny = (arr) => arr.some((w) => t.includes(w));

    if (includesAny(['shipping', 'deliver', 'ship', 'arrival'])) {
      return 'We offer free standard shipping on orders over $75. Orders ship within 1–2 business days and usually arrive in 3–5 days.';
    }
    if (includesAny(['return', 'refund', 'exchange'])) {
      return 'Hassle‑free returns within 30 days for unused items. Start a return from the Contact section and we’ll help you out.';
    }
    if (includesAny(['size', 'fit', 'sizing', 'wide', 'narrow'])) {
      return 'Stride runs true to size with a comfortable, slightly roomy toe box. Between sizes? Most customers size down.';
    }
    if (includesAny(['recommend', 'which', 'best', 'product', 'shoe'])) {
      return 'Tell me where you’ll use them most (running, city walking, or trails) and I’ll suggest a model.';
    }
    if (includesAny(['order', 'status', 'track'])) {
      return 'I can’t access orders here, but our team can help. Share your order number via the Contact section and we’ll reply quickly.';
    }
    if (includesAny(['material', 'sustain', 'recycle', 'eco'])) {
      return 'We use recycled materials where possible and design for durability to reduce waste — comfort without compromise.';
    }
    if (includesAny(['agent', 'human', 'support', 'help'])) {
      return 'No problem — connecting you with our team. Please leave your email in the Contact section and we’ll reach out.';
    }

    return "I’m a simple helper for common questions. Ask about sizing, shipping, or returns — or type ‘agent’ to contact support.";
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addMessage(text, 'user');
    input.value = '';
    typing(true);
    setTimeout(() => {
      typing(false);
      addMessage(respond(text), 'bot');
    }, 450);
  });

  // Open chat with keyboard when toggle focused and Enter pressed
  toggle.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      openChat();
    }
  });
})();
