/* ShopLite Demo Store - Amazon-style features */

// --- Demo Product Data (Electronics) ---
const PRODUCTS = [
  {
    id: 'laptop-xps13',
    title: 'Ultrabook XPS 13 Evo (13.4" OLED)',
    category: 'laptops',
    price: 1299.0,
    rating: 4.7,
    reviews: 2412,
    image: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1400&auto=format&fit=crop',
    badge: 'Best Seller',
    desc: 'Featherweight power: 13.4" OLED, 12th‑Gen i7, 16GB RAM, 512GB SSD.',
    features: ['Intel Evo', 'Thunderbolt 4', 'Killer Wi‑Fi 6E', 'Backlit keyboard']
  },
  {
    id: 'phone-pro-max',
    title: 'Smartphone Pro Max 6.7" (128GB)',
    category: 'phones',
    price: 999.0,
    rating: 4.8,
    reviews: 5123,
    image: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1400&auto=format&fit=crop',
    badge: 'Prime Day Deal',
    desc: 'Stunning Pro camera system, A‑series chip, all‑day battery, 5G.',
    features: ['48MP camera', '120Hz display', 'MagSafe charging']
  },
  {
    id: 'headphones-anc',
    title: 'Noise‑Canceling Headphones ANC+ (Over‑Ear)',
    category: 'audio',
    price: 299.99,
    rating: 4.6,
    reviews: 8321,
    image: 'https://images.unsplash.com/photo-1518443871231-1f1a90404357?q=80&w=1400&auto=format&fit=crop',
    badge: 'Top Rated',
    desc: 'Immersive ANC with 30‑hour battery and ultra‑comfort ear cushions.',
    features: ['Bluetooth 5.2', 'Multi‑point', 'Fast charging']
  },
  {
    id: 'tv-4k-oled',
    title: '55" 4K OLED Smart TV',
    category: 'tv',
    price: 1399.0,
    rating: 4.9,
    reviews: 1645,
    image: 'https://images.unsplash.com/photo-1587300003388-59208cc962cb?q=80&w=1400&auto=format&fit=crop',
    badge: 'New',
    desc: 'Infinite contrast OLED panel with HDR10+ and cinematic sound.',
    features: ['Dolby Vision', '120Hz gaming', 'AirPlay/Chromecast']
  },
  {
    id: 'smartwatch-fitness',
    title: 'Smartwatch Fitness+ (GPS, 44mm)',
    category: 'accessories',
    price: 249.0,
    rating: 4.4,
    reviews: 3910,
    image: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1400&auto=format&fit=crop',
    badge: 'Limited Time',
    desc: 'Advanced health tracking, sleep insights, and multi‑day battery.',
    features: ['VO2 Max', 'ECG app', 'Water‑resistant']
  },
  {
    id: 'camera-mirrorless',
    title: 'Mirrorless Camera Z6 II (Body)',
    category: 'accessories',
    price: 1599.0,
    rating: 4.7,
    reviews: 1234,
    image: 'https://images.unsplash.com/photo-1519183071298-a2962be96f83?q=80&w=1400&auto=format&fit=crop',
    badge: 'Pro Pick',
    desc: 'Full‑frame sensor with superb low‑light performance and 4K video.',
    features: ['Dual processors', 'Eye AF', '5‑axis IBIS']
  },
  {
    id: 'tablet-air-10',
    title: 'Tablet Air 10.9" (256GB, Wi‑Fi)',
    category: 'accessories',
    price: 599.0,
    rating: 4.5,
    reviews: 2188,
    image: 'https://images.unsplash.com/photo-1510557880182-3d4d3cba35a5?q=80&w=1400&auto=format&fit=crop',
    badge: 'Great Value',
    desc: 'Ultra‑thin tablet perfect for sketching, streaming, and school.',
    features: ['P3 color', 'Stereo speakers', 'Pencil support']
  },
  {
    id: 'console-nextgen',
    title: 'Next‑Gen Gaming Console (1TB)',
    category: 'gaming',
    price: 499.0,
    rating: 4.8,
    reviews: 8423,
    image: 'https://images.unsplash.com/photo-1605901309720-002c4b4b1f09?q=80&w=1400&auto=format&fit=crop',
    badge: 'Hard to Find',
    desc: 'Blazing 4K gaming at 120fps with ray tracing.',
    features: ['Haptic feedback', 'Fast SSD', 'Game Pass ready']
  },
  {
    id: 'router-wifi6',
    title: 'Wi‑Fi 6E Mesh Router (Tri‑Band)',
    category: 'accessories',
    price: 279.0,
    rating: 4.3,
    reviews: 987,
    image: 'https://images.unsplash.com/photo-1587825140400-9ff59f88d9a4?q=80&w=1400&auto=format&fit=crop',
    badge: 'Whole Home',
    desc: 'Gigabit speeds with 6GHz for ultra‑low latency gaming.',
    features: ['OFDMA', 'WPA3', 'Easy app setup']
  },
  {
    id: 'monitor-34-ultrawide',
    title: '34" Ultrawide Monitor (144Hz, QHD)',
    category: 'accessories',
    price: 449.0,
    rating: 4.6,
    reviews: 1765,
    image: 'https://images.unsplash.com/photo-1545235617-9465d2a55698?q=80&w=1400&auto=format&fit=crop',
    badge: 'Editor’s Choice',
    desc: 'Immersive curve with buttery‑smooth 144Hz refresh for work and play.',
    features: ['USB‑C', 'HDR10', 'Height adjustable']
  },
  {
    id: 'drone-4k',
    title: 'Compact 4K Drone (Fly More Combo)',
    category: 'accessories',
    price: 799.0,
    rating: 4.5,
    reviews: 1145,
    image: 'https://images.unsplash.com/photo-1512820790803-83ca734da794?q=80&w=1400&auto=format&fit=crop',
    badge: 'Travel Ready',
    desc: 'Cinematic 4K footage with obstacle avoidance in a palm size.',
    features: ['ActiveTrack', '4K/60', 'Long-range']
  },
  {
    id: 'speaker-smart',
    title: 'Smart Speaker with Voice Assistant',
    category: 'audio',
    price: 99.0,
    rating: 4.2,
    reviews: 9450,
    image: 'https://images.unsplash.com/photo-1518441902110-9f7dc45eebd6?q=80&w=1400&auto=format&fit=crop',
    badge: 'Most Gifted',
    desc: 'Room‑filling sound with smart home controls and privacy built‑in.',
    features: ['Multiroom audio', 'Privacy mic switch', 'Smart home hub']
  }
];

// --- State ---
const state = {
  filterCategory: 'all',
  query: '',
  cart: load('shoplite_cart', {}), // {productId: qty}
  wishlist: load('shoplite_wishlist', {}), // {productId: true}
};

// Utilities
function $(sel, root = document) { return root.querySelector(sel); }
function $all(sel, root = document) { return Array.from(root.querySelectorAll(sel)); }
function money(n) { return `$${n.toFixed(2)}`; }
function save(key, value) { localStorage.setItem(key, JSON.stringify(value)); }
function load(key, fallback) { try { return JSON.parse(localStorage.getItem(key)) || fallback; } catch { return fallback; } }
function productById(id) { return PRODUCTS.find(p => p.id === id); }
function stars(rating) {
  const full = Math.floor(rating);
  const half = rating - full >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return '★'.repeat(full) + (half ? '☆' : '') + '✩'.repeat(empty);
}

// --- Rendering: Product Grid ---
const grid = $('#productGrid');
function renderProducts() {
  const q = state.query.trim().toLowerCase();
  let items = PRODUCTS.filter(p => state.filterCategory === 'all' || p.category === state.filterCategory);
  if (q) items = items.filter(p => p.title.toLowerCase().includes(q) || p.desc.toLowerCase().includes(q));

  grid.innerHTML = items.map(p => cardHTML(p)).join('');

  // Wire events for new elements
  $all('[data-action="add-cart"]').forEach(btn => btn.addEventListener('click', onAddCart));
  $all('[data-action="quick-view"]').forEach(btn => btn.addEventListener('click', onQuickView));
  $all('[data-action="toggle-wishlist"]').forEach(btn => btn.addEventListener('click', onToggleWishlist));
}

function cardHTML(p) {
  const inWish = !!state.wishlist[p.id];
  const countReviews = new Intl.NumberFormat().format(p.reviews);
  return `
  <article class="card" aria-label="${p.title}">
    <div class="card-media">
      <img src="${p.image}" alt="${p.title}" loading="lazy" />
      ${p.badge ? `<span class="badge-chip">${p.badge}</span>` : ''}
      <button class="wishlist-toggle ${inWish ? 'active' : ''}" data-id="${p.id}" data-action="toggle-wishlist" aria-pressed="${inWish}">
        ❤
      </button>
    </div>
    <div class="card-body">
      <div class="title">${p.title}</div>
      <div class="price-row">
        <div class="price">${money(p.price)}</div>
        <div class="rating" aria-label="${p.rating} out of 5 stars">
          <span class="stars">${stars(p.rating)}</span>
          <small>(${countReviews})</small>
        </div>
      </div>
      <div class="card-actions">
        <button class="btn primary" data-id="${p.id}" data-action="add-cart">Add to Cart</button>
        <button class="btn ghost" data-id="${p.id}" data-action="quick-view">Quick View</button>
      </div>
    </div>
  </article>`;
}

// --- Header & Filters ---
$all('.nav-link').forEach(btn => {
  btn.addEventListener('click', () => {
    $all('.nav-link').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    state.filterCategory = btn.dataset.category;
    renderProducts();
  });
});

$('.search').addEventListener('submit', e => {
  e.preventDefault();
  const input = $('#searchInput');
  state.query = input.value;
  renderProducts();
});

// --- Cart Logic ---
const cartDrawer = $('#cartDrawer');
const backdrop = $('#drawerBackdrop');
const cartItemsEl = $('#cartItems');

function openCart() { cartDrawer.classList.add('open'); backdrop.hidden = false; cartDrawer.setAttribute('aria-hidden', 'false'); }
function closeCart() { cartDrawer.classList.remove('open'); backdrop.hidden = true; cartDrawer.setAttribute('aria-hidden', 'true'); }

$('#openCart').addEventListener('click', () => { renderCart(); openCart(); });
$('#closeCart').addEventListener('click', closeCart);
backdrop.addEventListener('click', () => { closeCart(); closeWishlist(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') { closeCart(); closeWishlist(); closeQuickView(); } });

function onAddCart(ev) {
  const id = ev.currentTarget.dataset.id;
  state.cart[id] = (state.cart[id] || 0) + 1;
  save('shoplite_cart', state.cart);
  updateCounts();
  toast('Added to cart');
}

function renderCart() {
  const entries = Object.entries(state.cart);
  if (entries.length === 0) {
    cartItemsEl.innerHTML = `<p style="color: var(--muted);">Your cart is empty.</p>`;
    $('#cartSubtotal').textContent = money(0);
    $('#cartTotal').textContent = money(0);
    return;
  }
  let subtotal = 0;
  const html = entries.map(([id, qty]) => {
    const p = productById(id);
    const line = p.price * qty;
    subtotal += line;
    return `
      <div class="line-item" data-id="${id}">
        <img src="${p.image}" alt="${p.title}">
        <div>
          <div class="li-title">${p.title}</div>
          <div class="li-price">${money(p.price)}</div>
          <div class="qty">
            <button data-action="dec" aria-label="Decrease quantity">–</button>
            <span aria-live="polite">${qty}</span>
            <button data-action="inc" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:end; gap:8px;">
          <strong>${money(line)}</strong>
          <button class="remove" data-action="remove">Remove</button>
        </div>
      </div>
    `;
  }).join('');
  cartItemsEl.innerHTML = html;
  $('#cartSubtotal').textContent = money(subtotal);
  $('#cartTotal').textContent = money(subtotal);

  // Wire events
  $all('.line-item').forEach(li => {
    li.addEventListener('click', e => {
      const action = e.target?.dataset?.action;
      if (!action) return;
      const id = li.dataset.id;
      if (action === 'inc') state.cart[id]++;
      if (action === 'dec') state.cart[id] = Math.max(1, state.cart[id] - 1);
      if (action === 'remove') delete state.cart[id];
      save('shoplite_cart', state.cart);
      renderCart();
      updateCounts();
    });
  });
}

function updateCounts() {
  const count = Object.values(state.cart).reduce((a, b) => a + b, 0);
  $('#cartCount').textContent = count;
  $('#wishlistCount').textContent = Object.keys(state.wishlist).length;
}

$('#checkoutBtn').addEventListener('click', () => {
  toast('Demo checkout — not implemented');
});

// --- Wishlist ---
const wishlistDrawer = $('#wishlistDrawer');
const wishlistItemsEl = $('#wishlistItems');
function openWishlist() { wishlistDrawer.classList.add('open'); backdrop.hidden = false; wishlistDrawer.setAttribute('aria-hidden', 'false'); }
function closeWishlist() { wishlistDrawer.classList.remove('open'); wishlistDrawer.setAttribute('aria-hidden', 'true'); if (!cartDrawer.classList.contains('open')) backdrop.hidden = true; }

$('#openWishlist').addEventListener('click', () => { renderWishlist(); openWishlist(); });
$('#closeWishlist').addEventListener('click', closeWishlist);

function onToggleWishlist(ev) {
  const id = ev.currentTarget.dataset.id;
  if (state.wishlist[id]) delete state.wishlist[id]; else state.wishlist[id] = true;
  save('shoplite_wishlist', state.wishlist);
  updateCounts();
  // update button state without full re-render if possible
  ev.currentTarget.classList.toggle('active');
  ev.currentTarget.setAttribute('aria-pressed', ev.currentTarget.classList.contains('active'));
}

function renderWishlist() {
  const ids = Object.keys(state.wishlist);
  if (ids.length === 0) {
    wishlistItemsEl.innerHTML = `<p style="color: var(--muted);">Your wishlist is empty.</p>`;
    return;
  }
  wishlistItemsEl.innerHTML = ids.map(id => {
    const p = productById(id);
    return `
      <div class="line-item" data-id="${id}">
        <img src="${p.image}" alt="${p.title}">
        <div>
          <div class="li-title">${p.title}</div>
          <div class="li-price">${money(p.price)}</div>
          <div class="rating"><span class="stars">${stars(p.rating)}</span><small>(${new Intl.NumberFormat().format(p.reviews)})</small></div>
        </div>
        <div style="display:flex; flex-direction:column; align-items:end; gap:8px;">
          <button class="primary" data-action="add">Add to Cart</button>
          <button class="remove" data-action="remove">Remove</button>
        </div>
      </div>
    `;
  }).join('');

  $all('#wishlistItems .line-item').forEach(li => {
    li.addEventListener('click', e => {
      const action = e.target?.dataset?.action;
      if (!action) return;
      const id = li.dataset.id;
      if (action === 'add') {
        state.cart[id] = (state.cart[id] || 0) + 1;
        save('shoplite_cart', state.cart);
        updateCounts();
        toast('Added to cart');
      }
      if (action === 'remove') {
        delete state.wishlist[id];
        save('shoplite_wishlist', state.wishlist);
        renderWishlist();
        updateCounts();
        // also toggle button if on screen
        const btn = document.querySelector(`.wishlist-toggle[data-id="${id}"]`);
        btn?.classList.remove('active');
        btn?.setAttribute('aria-pressed', 'false');
      }
    });
  });
}

// --- Quick View Modal ---
const qv = {
  el: $('#quickView'),
  img: $('#qvImage'),
  title: $('#qvTitle'),
  price: $('#qvPrice'),
  rating: $('#qvRating'),
  desc: $('#qvDesc'),
  features: $('#qvFeatures'),
  add: $('#qvAddToCart'),
  wish: $('#qvWishlist'),
};

let qvCurrentId = null;

function onQuickView(ev) { openQuickView(ev.currentTarget.dataset.id); }
function openQuickView(id) {
  const p = productById(id);
  if (!p) return;
  qvCurrentId = id;
  qv.img.src = p.image;
  qv.img.alt = p.title;
  qv.title.textContent = p.title;
  qv.price.textContent = money(p.price);
  qv.rating.innerHTML = `<span class="stars">${stars(p.rating)}</span> <small>(${new Intl.NumberFormat().format(p.reviews)})</small>`;
  qv.desc.textContent = p.desc;
  qv.features.innerHTML = p.features.map(f => `<li>${f}</li>`).join('');
  qv.wish.textContent = state.wishlist[id] ? 'In Wishlist' : 'Add to Wishlist';
  qv.el.hidden = false;
}
function closeQuickView() { qv.el.hidden = true; qvCurrentId = null; }
$('#closeQuickView').addEventListener('click', closeQuickView);
qv.add.addEventListener('click', () => { if (!qvCurrentId) return; state.cart[qvCurrentId] = (state.cart[qvCurrentId]||0) + 1; save('shoplite_cart', state.cart); updateCounts(); toast('Added to cart'); });
qv.wish.addEventListener('click', () => { if (!qvCurrentId) return; if (state.wishlist[qvCurrentId]) { delete state.wishlist[qvCurrentId]; } else { state.wishlist[qvCurrentId] = true; } save('shoplite_wishlist', state.wishlist); updateCounts(); qv.wish.textContent = state.wishlist[qvCurrentId] ? 'In Wishlist' : 'Add to Wishlist'; });
qv.el.addEventListener('click', e => { if (e.target === qv.el) closeQuickView(); });

// --- Toast ---
const toastEl = $('#toast');
let toastTimer;
function toast(msg) {
  toastEl.textContent = msg;
  toastEl.hidden = false;
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toastEl.hidden = true, 1400);
}

// --- Initialize ---
renderProducts();
updateCounts();