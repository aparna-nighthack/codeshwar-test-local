(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const fmt = (n) => n.toLocaleString(undefined, { style: 'currency', currency: 'USD' });

  function svgDataUri({ label, hue = 210, s = 80, l = 55 }) {
    const bg1 = `hsl(${hue}, ${s}%, ${l}%)`;
    const bg2 = `hsl(${(hue + 30) % 360}, ${Math.max(60, s - 10)}%, ${Math.max(40, l - 10)}%)`;
    const txt = label.replace(/&/g, '&amp;').replace(/</g, '&lt;');
    const svg = `<?xml version='1.0'?>\n<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 800 600'>\n  <defs>\n    <linearGradient id='g' x1='0' x2='1' y1='0' y2='1'>\n      <stop offset='0%' stop-color='${bg1}'/>\n      <stop offset='100%' stop-color='${bg2}'/>\n    </linearGradient>\n  </defs>\n  <rect width='800' height='600' fill='url(#g)'/>\n  <g transform='translate(400,300)'>\n    <circle cx='0' cy='0' r='180' fill='rgba(255,255,255,0.12)'/>\n    <circle cx='0' cy='0' r='140' fill='rgba(255,255,255,0.18)'/>\n  </g>\n  <text x='400' y='480' font-family='system-ui,Segoe UI,Roboto,Helvetica,Arial' font-size='42' text-anchor='middle' fill='white' opacity='0.95'>${txt}</text>\n</svg>`;
    return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
  }

  const PRODUCTS = [
    { id: 'p-tv-001', name: '4K Smart TV 55"', brand: 'Visionex', category: 'tv', price: 499.99, oldPrice: 699.99, rating: { score: 4.6, count: 1821 }, image: svgDataUri({ label: '4K TV 55"', hue: 210 }), badges: ['Prime', 'Deal'], desc: 'Ultra HD 4K with HDR10+, voice control, and low input lag for gaming.' },
    { id: 'p-ph-002', name: 'Noise-Canceling Headphones', brand: 'Auralite', category: 'audio', price: 199.00, oldPrice: 249.00, rating: { score: 4.5, count: 2540 }, image: svgDataUri({ label: 'NC Headphones', hue: 270 }), badges: ['Prime'], desc: 'Premium ANC, 40h battery life, multipoint Bluetooth with aptX HD.' },
    { id: 'p-lt-003', name: 'Ultrabook 14" i7', brand: 'SwiftBook', category: 'laptops', price: 1099.00, oldPrice: 1299.00, rating: { score: 4.4, count: 743 }, image: svgDataUri({ label: '14" Ultrabook', hue: 200 }), badges: ['Deal'], desc: '11th‑gen Intel i7, 16GB RAM, 512GB SSD, 1.2kg magnesium body.' },
    { id: 'p-cm-004', name: 'Mirrorless Camera Pro', brand: 'Photon', category: 'cameras', price: 1399.99, rating: { score: 4.7, count: 322 }, image: svgDataUri({ label: 'Mirrorless Pro', hue: 10 }), badges: ['Prime'], desc: '24MP BSI sensor, 4K60, 5‑axis IBIS, fast hybrid AF with eye tracking.' },
    { id: 'p-sp-005', name: 'Smartwatch Series X', brand: 'Movio', category: 'wearables', price: 249.99, rating: { score: 4.2, count: 1880 }, image: svgDataUri({ label: 'Smartwatch X', hue: 140 }), badges: [], desc: 'AMOLED display, GPS, SpO2, 7‑day battery, waterproof 5ATM.' },
    { id: 'p-spk-006', name: 'Portable Bluetooth Speaker', brand: 'Boomly', category: 'audio', price: 59.99, rating: { score: 4.4, count: 9412 }, image: svgDataUri({ label: 'BT Speaker', hue: 20 }), badges: ['Best Seller'], desc: 'Bold sound with enhanced bass, IPX7 waterproof, 15‑hour playtime.' },
    { id: 'p-ps-007', name: 'Next‑Gen Console', brand: 'GameSphere', category: 'gaming', price: 499.99, rating: { score: 4.8, count: 39210 }, image: svgDataUri({ label: 'Console', hue: 245 }), badges: ['Prime'], desc: 'Ray tracing, ultra‑fast SSD, 4K gaming with 120Hz support.' },
    { id: 'p-dr-008', name: '4K Drone Camera', brand: 'SkySnap', category: 'drones', price: 799.00, rating: { score: 4.5, count: 2088 }, image: svgDataUri({ label: '4K Drone', hue: 35 }), badges: [], desc: '3‑axis gimbal, 34‑min flight time, obstacle avoidance, 10km range.' },
    { id: 'p-r-009', name: 'Wi‑Fi 6 Router', brand: 'NetSwift', category: 'networking', price: 129.99, rating: { score: 4.3, count: 8321 }, image: svgDataUri({ label: 'Wi‑Fi 6', hue: 195 }), badges: ['Prime'], desc: 'Tri‑band AX, MU‑MIMO, OFDMA, coverage for large homes with WPA3.' },
    { id: 'p-mn-010', name: '27" 2K Monitor 144Hz', brand: 'PixelPro', category: 'monitors', price: 279.99, rating: { score: 4.6, count: 5102 }, image: svgDataUri({ label: '144Hz 2K', hue: 215 }), badges: ['Deal'], desc: 'Fast IPS, 1ms GtG, 99% sRGB, height‑adjustable stand with tilt/swivel.' },
    { id: 'p-phn-011', name: 'Flagship Smartphone 5G', brand: 'ZenOne', category: 'smartphones', price: 899.00, rating: { score: 4.5, count: 10221 }, image: svgDataUri({ label: '5G Phone', hue: 330 }), badges: ['Prime', 'Best Seller'], desc: '120Hz OLED, triple camera with OIS, 65W fast charging.' },
    { id: 'p-tab-012', name: '10.5" Tablet', brand: 'Tablix', category: 'tablets', price: 329.99, rating: { score: 4.1, count: 4522 }, image: svgDataUri({ label: '10.5" Tablet', hue: 290 }), badges: [], desc: '2K display, quad speakers, stylus support, long‑lasting battery.' },
    { id: 'p-kb-013', name: 'Mechanical Keyboard', brand: 'KeyWave', category: 'accessories', price: 89.99, rating: { score: 4.7, count: 6411 }, image: svgDataUri({ label: 'Mech Keyboard', hue: 15 }), badges: [], desc: 'Hot‑swappable switches, PBT keycaps, RGB with per‑key lighting.' },
    { id: 'p-ms-014', name: 'Wireless Mouse', brand: 'SwiftPoint', category: 'accessories', price: 39.99, rating: { score: 4.4, count: 18322 }, image: svgDataUri({ label: 'Wireless Mouse', hue: 60 }), badges: ['Prime'], desc: 'Silent clicks, low‑latency, 90‑day battery, ergonomic design.' },
    { id: 'p-ssd-015', name: 'NVMe SSD 1TB', brand: 'FlashCore', category: 'storage', price: 79.99, rating: { score: 4.8, count: 15222 }, image: svgDataUri({ label: '1TB NVMe', hue: 0 }), badges: ['Deal'], desc: 'PCIe Gen4 speeds up to 7,000MB/s, DRAM cache, 5‑year warranty.' },
    { id: 'p-bud-016', name: 'TWS Earbuds ANC', brand: 'AirDot', category: 'audio', price: 129.00, rating: { score: 4.2, count: 9822 }, image: svgDataUri({ label: 'ANC Earbuds', hue: 325 }), badges: ['Prime'], desc: 'Hybrid ANC, wireless charging case, low‑latency gaming mode.' },
    { id: 'p-eread-017', name: 'E‑Reader 7"', brand: 'PaperLeaf', category: 'readers', price: 149.99, rating: { score: 4.6, count: 1202 }, image: svgDataUri({ label: '7" E‑Reader', hue: 180 }), badges: [], desc: '300‑ppi e‑ink, adjustable warm light, weeks‑long battery life.' },
  ];

  const state = {
    products: PRODUCTS,
    filtered: PRODUCTS,
    cart: new Map(),
    wishlist: new Set(),
    category: 'all',
    query: '',
    quickProduct: null,
  };

  const els = {};

  function renderStars(score, count) {
    const full = Math.floor(score);
    const half = score - full >= 0.5 ? 1 : 0;
    const empty = 5 - full - half;
    let html = '';
    const star = (f) => `<svg width="16" height="16" viewBox="0 0 24 24" fill="${f ? '#f59e0b' : 'none'}" stroke="#f59e0b" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><polygon points="12 2 15 9 22 9 17 14 19 21 12 17 5 21 7 14 2 9 9 9 12 2"/></svg>`;
    for (let i = 0; i < full; i++) html += star(true);
    if (half) html += star(true);
    for (let i = 0; i < empty; i++) html += star(false);
    html += `<span aria-label="${score} out of 5 stars" style="color:#6b7280; font-size:12px;">(${count.toLocaleString()})</span>`;
    return html;
  }

  function priceHtml(p, old) {
    return old && old > p ? `<span class="price">${fmt(p)}</span><del>${fmt(old)}</del>` : `<span class="price">${fmt(p)}</span>`;
  }

  function filterProducts() {
    const q = state.query.trim().toLowerCase();
    const cat = state.category;
    state.filtered = state.products.filter((p) => {
      const matchesCat = cat === 'all' || p.category === cat;
      const matchesQ = !q || p.name.toLowerCase().includes(q) || p.brand.toLowerCase().includes(q) || (p.desc && p.desc.toLowerCase().includes(q));
      return matchesCat && matchesQ;
    });
    renderProducts();
  }

  function renderProducts() {
    const grid = els.productGrid;
    grid.innerHTML = '';
    const tmpl = $('#productCardTmpl');
    state.filtered.forEach((p) => {
      const node = tmpl.content.firstElementChild.cloneNode(true);
      const img = $('.card__img', node);
      img.src = p.image;
      img.alt = `${p.name} by ${p.brand}`;
      const title = $('.card__title', node);
      title.textContent = `${p.brand} — ${p.name}`;
      const rating = $('.rating', node);
      rating.innerHTML = renderStars(p.rating.score, p.rating.count);
      const price = $('.price', node.parentElement) || $('.price', node); // fallback
      const priceContainer = $('.card__body .price', node) || $('.card__body', node);
      priceContainer.innerHTML = priceHtml(p.price, p.oldPrice);
      const badges = $('.card__badges', node);
      (p.badges || []).forEach((b) => {
        const tag = document.createElement('span');
        tag.className = 'badge';
        tag.textContent = b;
        badges.appendChild(tag);
      });
      const wishBtn = $('.card__wish', node);
      if (state.wishlist.has(p.id)) wishBtn.classList.add('card__wish--active');
      wishBtn.addEventListener('click', () => toggleWishlist(p.id, wishBtn));
      const addBtn = $('.card__add', node);
      addBtn.addEventListener('click', () => { addToCart(p.id, 1); openCart(); });
      const quickBtn = $('.card__quick', node);
      quickBtn.addEventListener('click', () => openQuickView(p));
      node.dataset.id = p.id;
      grid.appendChild(node);
    });
    const info = `${state.filtered.length} result${state.filtered.length !== 1 ? 's' : ''}${state.category !== 'all' ? ` • ${capitalize(state.category)}` : ''}${state.query ? ` • “${state.query}”` : ''}`;
    els.resultsInfo.textContent = info;
  }

  function addToCart(id, qty = 1) {
    const p = state.products.find(x => x.id === id);
    if (!p) return;
    const existing = state.cart.get(id) || { product: p, qty: 0 };
    existing.qty += qty;
    state.cart.set(id, existing);
    updateCartUI();
  }

  function setCartQty(id, qty) {
    if (!state.cart.has(id)) return;
    if (qty <= 0) { state.cart.delete(id); } else { state.cart.get(id).qty = qty; }
    updateCartUI();
  }

  function removeFromCart(id) {
    state.cart.delete(id);
    updateCartUI();
  }

  function cartTotals() {
    let subtotal = 0;
    for (const { product, qty } of state.cart.values()) subtotal += product.price * qty;
    return { subtotal, total: subtotal };
  }

  function updateCartUI() {
    $('#cartCount').textContent = Array.from(state.cart.values()).reduce((n, it) => n + it.qty, 0);
    const list = els.cartItems;
    list.innerHTML = '';
    const tmpl = $('#cartItemTmpl');
    if (state.cart.size === 0) {
      const empty = document.createElement('div');
      empty.style.color = '#6b7280';
      empty.textContent = 'Your cart is empty.';
      list.appendChild(empty);
    } else {
      for (const [id, { product, qty }] of state.cart) {
        const node = tmpl.content.firstElementChild.cloneNode(true);
        $('.cart-item__img', node).src = product.image;
        $('.cart-item__img', node).alt = `${product.name} thumbnail`;
        $('.cart-item__title', node).textContent = `${product.brand} — ${product.name}`;
        $('.cart-item__price', node).textContent = fmt(product.price);
        const input = $('.qty__input', node);
        input.value = qty;
        $('.qty__btn[data-act="dec"]', node).addEventListener('click', () => setCartQty(id, Math.max(0, Number(input.value) - 1)));
        $('.qty__btn[data-act="inc"]', node).addEventListener('click', () => setCartQty(id, Number(input.value) + 1));
        input.addEventListener('change', () => setCartQty(id, Math.max(0, Number(input.value))));
        $('.cart-item__remove', node).addEventListener('click', () => removeFromCart(id));
        list.appendChild(node);
      }
    }
    const totals = cartTotals();
    $('#cartSubtotal').textContent = fmt(totals.subtotal);
    $('#cartTotal').textContent = fmt(totals.total);
  }

  function toggleWishlist(id, btnEl) {
    if (state.wishlist.has(id)) state.wishlist.delete(id); else state.wishlist.add(id);
    const count = state.wishlist.size;
    $('#wishlistCount').textContent = count;
    if (btnEl) btnEl.classList.toggle('card__wish--active');
    $$(`.card[data-id="${CSS.escape(id)}"] .card__wish`).forEach((b) => b.classList.toggle('card__wish--active', state.wishlist.has(id)));
  }

  function openCart() {
    els.cartDrawer.classList.add('cart--open');
    els.overlay.classList.add('overlay--show');
    els.cartDrawer.setAttribute('aria-hidden', 'false');
  }
  function closeCart() {
    els.cartDrawer.classList.remove('cart--open');
    els.overlay.classList.remove('overlay--show');
    els.cartDrawer.setAttribute('aria-hidden', 'true');
  }

  function openQuickView(p) {
    state.quickProduct = p;
    $('#qvImg').src = p.image;
    $('#qvImg').alt = `${p.name} large image`;
    $('#qvTitle').textContent = `${p.brand} — ${p.name}`;
    $('#qvRating').innerHTML = renderStars(p.rating.score, p.rating.count);
    $('#qvPrice').innerHTML = priceHtml(p.price, p.oldPrice);
    $('#qvDesc').textContent = p.desc || '';
    $('#qvAdd').onclick = () => { addToCart(p.id, 1); try { $('#quickView').close(); } catch {} openCart(); };
    const wishBtn = $('#qvWish');
    wishBtn.textContent = state.wishlist.has(p.id) ? 'Remove from Wishlist' : 'Add to Wishlist';
    wishBtn.onclick = () => { toggleWishlist(p.id); wishBtn.textContent = state.wishlist.has(p.id) ? 'Remove from Wishlist' : 'Add to Wishlist'; };
    const dlg = $('#quickView');
    if (typeof dlg.showModal === 'function') dlg.showModal(); else { els.overlay.classList.add('overlay--show'); dlg.setAttribute('open', 'true'); }
  }

  function closeQuickView() {
    const dlg = $('#quickView');
    try { dlg.close(); } catch { dlg.removeAttribute('open'); }
  }

  function capitalize(s) { return s ? s[0].toUpperCase() + s.slice(1) : s; }

  function bindHeader() {
    $('#cartBtn').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    $('#overlay').addEventListener('click', () => { closeCart(); closeQuickView(); });
    $('#quickClose').addEventListener('click', closeQuickView);

    const input = $('#searchInput');
    const clear = $('#searchClear');
    input.addEventListener('input', (e) => { state.query = e.target.value; clear.hidden = !state.query; filterProducts(); });
    clear.addEventListener('click', () => { input.value = ''; state.query = ''; clear.hidden = true; filterProducts(); input.focus(); });

    $$('.nav__link').forEach((btn) => {
      btn.addEventListener('click', () => {
        $$('.nav__link').forEach(b => b.classList.remove('nav__link--active'));
        btn.classList.add('nav__link--active');
        state.category = btn.dataset.category || 'all';
        filterProducts();
      });
    });

    $('#wishlistBtn').addEventListener('click', () => {
      const wishIds = Array.from(state.wishlist);
      if (wishIds.length === 0) { alert('Your wishlist is empty.'); return; }
      const first = state.products.find(p => p.id === wishIds[0]);
      if (first) openQuickView(first);
    });

    $('#checkoutBtn').addEventListener('click', () => {
      if (state.cart.size === 0) { alert('Your cart is empty.'); return; }
      const totals = cartTotals();
      alert(`Demo checkout\nItems: ${$('#cartCount').textContent}\nTotal: ${fmt(totals.total)}`);
    });
  }

  function init() {
    els.productGrid = $('#productGrid');
    els.resultsInfo = $('#resultsInfo');
    els.cartDrawer = $('#cartDrawer');
    els.cartItems = $('#cartItems');
    els.overlay = $('#overlay');
    bindHeader();
    updateCartUI();
    filterProducts();
  }

  document.addEventListener('DOMContentLoaded', init);
})();