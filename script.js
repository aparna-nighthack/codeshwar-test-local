// --- Product sorting ---
(function () {
  const grid = document.getElementById('productGrid');
  const select = document.getElementById('sortSelect');

  if (!grid || !select) return;

  // Tag each product with its original index to support Default order
  const items = Array.from(grid.children);
  items.forEach((el, idx) => {
    el.dataset.index = String(idx);
  });

  function sortProducts(mode) {
    const products = Array.from(grid.children);

    let sorted = products.slice();
    if (mode === 'priceAsc') {
      sorted.sort((a, b) => parseFloat(a.dataset.price || '0') - parseFloat(b.dataset.price || '0'));
    } else if (mode === 'priceDesc') {
      sorted.sort((a, b) => parseFloat(b.dataset.price || '0') - parseFloat(a.dataset.price || '0'));
    } else {
      // default - restore original index order
      sorted.sort((a, b) => parseInt(a.dataset.index || '0') - parseInt(b.dataset.index || '0'));
    }

    // Re-append in new order (no reload)
    const frag = document.createDocumentFragment();
    sorted.forEach((el) => frag.appendChild(el));
    grid.appendChild(frag);
  }

  select.addEventListener('change', (e) => {
    sortProducts(select.value);
  });
})();

// --- Chatbot widget ---
(function () {
  const toggleBtn = document.getElementById('chatToggle');
  const panel = document.getElementById('chatbot');
  const closeBtn = document.getElementById('chatClose');
  const messages = document.getElementById('chatMessages');
  const form = document.getElementById('chatForm');
  const input = document.getElementById('chatInput');

  if (!toggleBtn || !panel || !messages || !form || !input) return;

  function openChat() {
    panel.hidden = false;
    toggleBtn.setAttribute('aria-expanded', 'true');
    input.focus();
    if (!messages.dataset.booted) {
      addBot("Hi there! How can I help you today? Try asking about pricing, shipping, or returns.");
      messages.dataset.booted = '1';
    }
  }

  function closeChat() {
    panel.hidden = true;
    toggleBtn.setAttribute('aria-expanded', 'false');
    toggleBtn.focus();
  }

  toggleBtn.addEventListener('click', () => {
    if (panel.hidden) openChat(); else closeChat();
  });
  if (closeBtn) closeBtn.addEventListener('click', closeChat);

  function addMsg(text, who) {
    const div = document.createElement('div');
    div.className = `msg ${who}`;
    div.textContent = text;
    messages.appendChild(div);
    messages.scrollTop = messages.scrollHeight;
  }
  function addUser(text) { addMsg(text, 'user'); }
  function addBot(text) { addMsg(text, 'bot'); }

  // very lightweight rule-based replies (no network/back-end)
  function replyTo(text) {
    const t = text.toLowerCase();
    if (/ship|delivery|arriv/.test(t)) {
      return 'We offer standard (3–5 business days) and express shipping. You will see options at checkout.';
    }
    if (/return|refund/.test(t)) {
      return 'Returns accepted within 30 days in original condition. Start returns from your orders page.';
    }
    if (/price|cost|expens|cheap/.test(t)) {
      return 'You can sort products by price using the dropdown above the grid.';
    }
    if (/help|support|human|agent/.test(t)) {
      return 'I can answer quick questions. For a human, email support@example.com.';
    }
    if (/hello|hi|hey/.test(t)) {
      return 'Hello! What can I help you with today?';
    }
    return "Thanks for your message! I’ll pass this along to our team if needed.";
  }

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addUser(text);
    input.value = '';

    // Simulate thinking delay
    setTimeout(() => {
      addBot(replyTo(text));
    }, 350);
  });
})();

