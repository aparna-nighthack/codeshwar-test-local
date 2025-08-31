/* ShopX Demo Store — Amazon-style interactions (cart, wishlist, quick view) */
(function () {
  const $ = (sel, el = document) => el.querySelector(sel);
  const $$ = (sel, el = document) => Array.from(el.querySelectorAll(sel));

  const fmt = (n) => `$${n.toFixed(2)}`;
  const storage = {
    get(key, fallback) {
      try { return JSON.parse(localStorage.getItem(key)) ?? fallback; } catch { return fallback; }
    },
    set(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
  };

  const PRODUCTS = [
    { id: 'lap-neo14', name: 'NeonBook 14" Ultralight Laptop', category: 'Laptops', price: 899.99, rating: 4.6, image: 'assets/img/laptop.svg', desc: '14-inch ultralight with 11th‑gen performance and all‑day battery.', specs: ['14" IPS 1080p','Intel i7','16GB RAM','512GB NVMe','Wi‑Fi 6'] },
    { id: 'phn-xpro', name: 'X‑Pro 5G Smartphone', category: 'Phones', price: 749.00, rating: 4.4, image: 'assets/img/phone.svg', desc: 'Flagship camera system with pro video and smooth 120Hz display.', specs: ['6.5" OLED 120Hz','Triple 50MP','8GB RAM','256GB','5G + Wi‑Fi 6E'] },
    { id: 'aud-quiet', name: 'QuietFlow ANC Headphones', category: 'Audio', price: 199.99, rating: 4.3, image: 'assets/img/headphones.svg', desc: 'Adaptive noise cancelation with 40hr battery and rich sound.', specs: ['ANC','BT 5.3','40h Battery','USB‑C','Multipoint'] },
    { id: 'cam-vista', name: 'Vista 24MP Mirrorless Camera', category: 'Cameras', price: 1099.00, rating: 4.7, image: 'assets/img/camera.svg', desc: 'Stabilized sensor with 4K60 video and vibrant color science.', specs: ['24MP APS‑C','4K60','IBIS','Dual Pixel AF','USB‑C PD'] },
    { id: 'wat-orbit', name: 'Orbit Smartwatch', category: 'Wearables', price: 279.00, rating: 4.2, image: 'assets/img/watch.svg', desc: 'Health tracking with AMOLED display and 7‑day battery life.', specs: ['AMOLED','GPS','SpO2','7‑day Battery','5ATM'] },
    { id: 'spk-pulse', name: 'Pulse Bluetooth Speaker', category: 'Audio', price: 89.50, rating: 4.1, image: 'assets/img/speaker.svg', desc: 'Room‑filling sound, deep bass, and splash resistance.', specs: ['BT 5.0','IPX5','10h Battery','Stereo Pair'] },
    { id: 'drn-aero', name: 'AeroFold 4K Drone', category: 'Drones', price: 649.99, rating: 4.5, image: 'assets/img/drone.svg', desc: 'Foldable 4K HDR drone with obstacle avoidance and long range.', specs: ['4K HDR','OAS','10km Range','28min Flight'] },
    { id: 'mon-27q', name: '27" QHD Pro Monitor', category: 'Monitors', price: 329.99, rating: 4.4, image: 'assets/img/monitor.svg', desc: 'Crisp QHD panel with 99% sRGB and ergonomic stand.', specs: ['27" QHD','IPS 75Hz','99% sRGB','USB‑C 65W'] },
    { id: 'key-mech', name: 'Mecha RGB Keyboard', category: 'Accessories', price: 129.00, rating: 4.3, image: 'assets/img/keyboard.svg', desc: 'Hot‑swappable mechanical keyboard with per‑key RGB.', specs: ['Hot‑swap','PBT','Tri‑mode','Gasket Mount'] },
    { id: 'mou-glide', name: 'Glide Pro Mouse', category: 'Accessories', price: 59.99, rating: 4.2, image: 'assets/img/mouse.svg', desc: 'Ergonomic wireless mouse with precision sensor.', specs: ['26K DPI','BT + 2.4G','100h','USB‑C'] },
    { id: 'tab-11', name: 'SlateTab 11" Tablet', category: 'Tablets', price: 399.00, rating: 4.1, image: 'assets/img/tablet.svg', desc: '11-inch entertainment tablet with quad speakers.', specs: ['11" 1200p','8GB RAM','128GB','Quad Speaker'] },
    { id: 'con-neo', name: 'Neo Game Console', category: 'Gaming', price: 499.00, rating: 4.8, image: 'assets/img/console.svg', desc: 'Next‑gen console with ray tracing and instant resume.', specs: ['4K60','RT','1TB SSD','VRR'] },
    { id: 'rtr-ax', name: 'AX5400 Wi‑Fi 6 Router', category: 'Networking', price: 179.99, rating: 4.4, image: 'assets/img/router.svg', desc: 'Tri‑band Wi‑Fi 6 with network security and app control.', specs: ['AX5400','Tri‑band','WPA3','OFDMA'] },
    { id: 'ssd-nv1', name: 'NV1 1TB NVMe SSD', category: 'Storage', price: 89.99, rating: 4.6, image: 'assets/img/ssd.svg', desc: 'Fast NVMe storage for snappy loads.', specs: ['PCIe 3.0 x4','R: 2100MB/s','W: 1700MB/s'] },
    { id: 'pwb-20k', name: 'PowerBank 20,000mAh', category: 'Power', price: 49.99, rating: 4.0, image: 'assets/img/powerbank.svg', desc: 'High capacity USB‑C PD portable charger.', specs: ['20,000mAh','USB‑C PD','2x USB‑A'] },
  ];

  // State
  let cart = storage.get('sx_cart', {}); // { id: qty }
  let wishlist = new Set(storage.get('sx_wishlist', []));
  let filterCategory = 'all';
  let searchQuery = '';

  // Elements
  const grid = $('#productGrid');
  const cartSidebar = $('#cartSidebar');
  const overlay = $('#overlay');
  const cartItemsEl = $('#cartItems');
  const cartSubtotalEl = $('#cartSubtotal');
  const cartCountEl = $('#cartCount');
  const wishlistCountEl = $('#wishlistCount');
  const quickView = $('#quickView');
  const quickViewBody = $('#quickViewBody');
  const wishlistModal = $('#wishlistModal');
  const yearEl = $('#year');

  // Helpers
  function productById(id) { return PRODUCTS.find(p => p.id === id); }
  function computeSubtotal() {
    return Object.entries(cart).reduce((sum, [id, qty]) => sum + productById(id).price * qty, 0);
  }
  function computeCount() { return Object.values(cart).reduce((a, b) => a + b, 0); }
  function updateBadges() {
    cartCountEl.textContent = computeCount();
    wishlistCountEl.textContent = wishlist.size;
  }

  function renderStars(rating) {
    const pct = Math.max(0, Math.min(100, (rating / 5) * 100));
    return `<span class="rating"><span class="rating__fill" style="width:${pct}%"></span></span>`;
  }

  function productCard(p) {
    const wished = wishlist.has(p.id) ? ' active' : '';
    return `
      <article class="card" data-id="${p.id}" aria-label="${p.name}">
        <div class="card__thumb">
          <img src="${p.image}" alt="${p.name}">
        </div>
        <div class="card__body">
          <h3 class="card__title">${p.name}</h3>
          <div class="card__meta">
            <div>${renderStars(p.rating)}</div>
            <div class="card__price">${fmt(p.price)}</div>
          </div>
          <div class="card__actions">
            <button class="btn btn--primary add-to-cart">Add to Cart</button>
            <button class="btn btn--ghost quick-view">Quick View</button>
            <button class="wishlist-btn${wished}" title="Add to wishlist" aria-label="Add to wishlist">❤</button>
          </div>
        </div>
      </article>
    `;
  }

  function renderGrid() {
    const q = searchQuery.trim().toLowerCase();
    const list = PRODUCTS.filter(p => (
      (filterCategory === 'all' || p.category === filterCategory) &&
      (!q || p.name.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q) || p.category.toLowerCase().includes(q))
    ));
    grid.innerHTML = list.length ? list.map(productCard).join('') : '<p style="grid-column: 1 / -1; color: var(--muted);">No products found.</p>';
  }

  function openCart() {
    cartSidebar.classList.add('open');
    cartSidebar.setAttribute('aria-hidden', 'false');
    overlay.hidden = false;
  }
  function closeCart() {
    cartSidebar.classList.remove('open');
    cartSidebar.setAttribute('aria-hidden', 'true');
    overlay.hidden = true;
  }

  function renderCart() {
    const entries = Object.entries(cart);
    if (entries.length === 0) {
      cartItemsEl.innerHTML = '<p>Your cart is empty.</p>';
    } else {
      cartItemsEl.innerHTML = entries.map(([id, qty]) => {
        const p = productById(id);
        const line = p.price * qty;
        return `
          <div class="cart__item" data-id="${id}">
            <img src="${p.image}" alt="${p.name}">
            <div>
              <div><strong>${p.name}</strong></div>
              <div>${fmt(p.price)} each</div>
              <div class="qty" role="group" aria-label="Quantity selector">
                <button class="qty-decr" aria-label="Decrease">−</button>
                <span class="qty-val" aria-live="polite">${qty}</span>
                <button class="qty-incr" aria-label="Increase">+</button>
                <button class="qty-remove" aria-label="Remove" style="margin-left:8px; color: var(--danger)">Remove</button>
              </div>
            </div>
            <div><strong>${fmt(line)}</strong></div>
          </div>
        `;
      }).join('');
    }
    cartSubtotalEl.textContent = fmt(computeSubtotal());
    updateBadges();
  }

  function addToCart(id, qty = 1) {
    cart[id] = (cart[id] || 0) + qty;
    storage.set('sx_cart', cart);
    renderCart();
    openCart();
  }

  function setQty(id, qty) {
    if (qty <= 0) delete cart[id]; else cart[id] = qty;
    storage.set('sx_cart', cart);
    renderCart();
  }

  function toggleWishlist(id) {
    if (wishlist.has(id)) wishlist.delete(id); else wishlist.add(id);
    storage.set('sx_wishlist', Array.from(wishlist));
    updateBadges();
    renderGrid();
    renderWishlist();
  }

  function renderWishlist() {
    const wrap = $('#wishlistItems');
    if (!wrap) return;
    const list = PRODUCTS.filter(p => wishlist.has(p.id));
    if (!list.length) {
      wrap.innerHTML = '<p>Your wishlist is empty.</p>';
      return;
    }
    wrap.innerHTML = list.map(p => `
      <div class="wishlist__item" data-id="${p.id}">
        <img src="${p.image}" alt="${p.name}">
        <div>
          <div><strong>${p.name}</strong></div>
          <div>${fmt(p.price)}</div>
        </div>
        <div style="display:flex; gap:8px;">
          <button class="btn btn--ghost wl-remove">Remove</button>
          <button class="btn btn--primary wl-add">Add to Cart</button>
        </div>
      </div>
    `).join('');
  }

  function openModal(modal) { modal.setAttribute('aria-hidden', 'false'); overlay.hidden = false; }
  function closeModal(modal) { modal.setAttribute('aria-hidden', 'true'); overlay.hidden = true; }

  function showQuickView(id) {
    const p = productById(id);
    quickViewBody.innerHTML = `
      <div class="modal__thumb"><img src="${p.image}" alt="${p.name}"></div>
      <div>
        <h3 style="margin-top:0;">${p.name}</h3>
        <div style="display:flex; align-items:center; gap:8px;">${renderStars(p.rating)} <span>${p.rating.toFixed(1)}</span></div>
        <p style="color: var(--muted);">${p.desc}</p>
        <div class="card__price" style="margin: 10px 0;">${fmt(p.price)}</div>
        <div class="specs">
          <strong>Highlights</strong>
          <ul>${p.specs.map(s => `<li>${s}</li>`).join('')}</ul>
        </div>
        <div style="display:flex; gap:8px; margin-top:12px;">
          <button class="btn btn--primary" id="qvAdd">Add to Cart</button>
          <button class="btn btn--ghost" id="qvWish">${wishlist.has(p.id) ? 'Wishlisted' : 'Add to Wishlist'}</button>
        </div>
      </div>
    `;
    $('#qvAdd').addEventListener('click', () => addToCart(p.id, 1));
    $('#qvWish').addEventListener('click', () => toggleWishlist(p.id));
    openModal(quickView);
  }

  // Event wiring
  function wire() {
    $('#cartOpen').addEventListener('click', openCart);
    $('#cartClose').addEventListener('click', closeCart);
    overlay.addEventListener('click', () => {
      closeCart();
      closeModal(quickView);
      closeModal(wishlistModal);
    });
    $('#quickViewClose').addEventListener('click', () => closeModal(quickView));
    $('#wishlistOpen').addEventListener('click', () => { renderWishlist(); openModal(wishlistModal); });
    $('#wishlistClose').addEventListener('click', () => closeModal(wishlistModal));
    $('#cartClear').addEventListener('click', () => { cart = {}; storage.set('sx_cart', cart); renderCart(); });
    $('#checkoutBtn').addEventListener('click', () => {
      const total = computeSubtotal();
      alert(`Demo checkout — total ${fmt(total)}. This is a demo.`);
    });

    // Footer links (demo actions)
    $('#aboutLink').addEventListener('click', (e) => { e.preventDefault(); alert('ShopX is a demo store for showcasing e‑commerce UI.'); });
    $('#helpLink').addEventListener('click', (e) => { e.preventDefault(); alert('Need help? This is a demo, but all UI is functional.'); });
    $('#sellLink').addEventListener('click', (e) => { e.preventDefault(); alert('Interested in selling? In a production app this links to onboarding.'); });
    $('#shippingLink').addEventListener('click', (e) => { e.preventDefault(); alert('Shipping: Free over $50 in this demo.'); });
    $('#returnsLink').addEventListener('click', (e) => { e.preventDefault(); alert('Returns: 30‑day demo return policy.'); });

    // Search
    $('#searchForm').addEventListener('submit', (e) => { e.preventDefault(); searchQuery = $('#searchInput').value; renderGrid(); });
    $('#searchInput').addEventListener('input', (e) => { searchQuery = e.target.value; renderGrid(); });

    // Category filter via nav
    $$('.nav__link').forEach(a => a.addEventListener('click', (e) => {
      e.preventDefault();
      filterCategory = e.currentTarget.dataset.filter;
      renderGrid();
    }));

    // Delegate product card actions
    grid.addEventListener('click', (e) => {
      const card = e.target.closest('.card');
      if (!card) return;
      const id = card.dataset.id;
      if (e.target.closest('.add-to-cart')) addToCart(id, 1);
      if (e.target.closest('.quick-view')) showQuickView(id);
      if (e.target.closest('.wishlist-btn')) toggleWishlist(id);
    });

    // Delegate cart quantity changes
    cartItemsEl.addEventListener('click', (e) => {
      const row = e.target.closest('.cart__item');
      if (!row) return;
      const id = row.dataset.id;
      if (e.target.classList.contains('qty-incr')) setQty(id, (cart[id] || 0) + 1);
      if (e.target.classList.contains('qty-decr')) setQty(id, (cart[id] || 0) - 1);
      if (e.target.classList.contains('qty-remove')) setQty(id, 0);
    });

    // Wishlist actions
    $('#wishlistItems').addEventListener('click', (e) => {
      const row = e.target.closest('.wishlist__item');
      if (!row) return;
      const id = row.dataset.id;
      if (e.target.classList.contains('wl-remove')) toggleWishlist(id);
      if (e.target.classList.contains('wl-add')) addToCart(id, 1);
    });
  }

  function init() {
    yearEl.textContent = new Date().getFullYear();
    renderGrid();
    renderCart();
    updateBadges();
    wire();
  }

  document.addEventListener('DOMContentLoaded', init);
})();
