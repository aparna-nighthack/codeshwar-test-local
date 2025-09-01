// Demo electronics products dataset (using user-provided image URLs)
const PRODUCTS = [
  {
    id: 'laptop-001',
    title: 'Ultrabook Pro 14" Laptop',
    brand: 'Amazona Basics',
    category: 'laptop',
    price: 1199.99,
    rating: 4.6,
    ratingCount: 1289,
    image: 'https://g2u-wp-prod.s3-ap-southeast-2.amazonaws.com/wp-content/uploads/2025/01/shutterstock_2328203513.jpg',
    description:
      'Lightweight 14-inch ultrabook with 12‑core CPU, 16GB RAM, 512GB NVMe SSD, and 16-hour battery life. Ideal for creators and power users.'
  },
  {
    id: 'phone-001',
    title: 'Infinity X Smartphone 6.7" OLED',
    brand: 'Amazona Mobile',
    category: 'smartphone',
    price: 799.0,
    rating: 4.4,
    ratingCount: 3421,
    image:
      'https://img.freepik.com/free-vector/realistic-display-smartphone-with-different-apps_52683-30241.jpg?semt=ais_hybrid&w=740&q=80',
    description:
      'Flagship performance with pro camera system, 5G, fast charging, and gorgeous 120Hz OLED display.'
  },
  {
    id: 'headphone-001',
    title: 'Sennheiser HD200 Pro Monitoring Headphones',
    brand: 'Sennheiser',
    category: 'headphone',
    price: 89.99,
    rating: 4.5,
    ratingCount: 898,
    image:
      'https://x.imastudent.com/content/0004627_sennheiser-hd-200-pro-monitoring-headphones_500.jpeg',
    description:
      'Closed-back monitoring headphones delivering precise sound and superior comfort for long sessions.'
  },
  {
    id: 'camera-001',
    title: 'Agfa Optima 500 Vintage Camera',
    brand: 'Agfa',
    category: 'camera',
    price: 259.5,
    rating: 4.1,
    ratingCount: 214,
    image:
      'https://vintagecameras.in/wp-content/uploads/2024/11/Agfa-Optima-500-Sensor-Vintage-Camera-2.jpg',
    description:
      'Classic 35mm film camera for enthusiasts and collectors. Fully serviced and film-ready.'
  },
  {
    id: 'watch-001',
    title: 'Pulse HR+ Smartwatch',
    brand: 'Amazona Wear',
    category: 'smartwatch',
    price: 159.99,
    rating: 4.2,
    ratingCount: 1673,
    image:
      'https://5.imimg.com/data5/ANDROID/Default/2023/10/356939310/EM/DR/JB/201943257/product-jpeg-500x500.jpg',
    description:
      'All-day health tracking, AMOLED display, GPS, and 7-day battery life.'
  },
  {
    id: 'speaker-001',
    title: 'BassMax Portable Bluetooth Speaker',
    brand: 'Amazona Audio',
    category: 'speaker',
    price: 49.99,
    rating: 4.3,
    ratingCount: 2410,
    image:
      'https://cdn.shopify.com/s/files/1/0057/8938/4802/files/img1_199503c8-b10d-4480-8f74-e22b9cc609e7.png?v=1646910815',
    description:
      'IPX7 waterproof with deep bass, 12-hour playtime, and stereo pairing.'
  },
  {
    id: 'drone-001',
    title: 'Mavic Air Portable Drone 4K',
    brand: 'DJI',
    category: 'drone',
    price: 599.0,
    rating: 4.7,
    ratingCount: 765,
    image:
      'https://5.imimg.com/data5/BM/CW/MY-26899578/dji-mavic-air-arctic-white-portable-quadcopter-drone-500x500.jpg',
    description:
      'Foldable 4K drone with 3-axis gimbal, obstacle avoidance, and intelligent flight modes.'
  },
  {
    id: 'console-001',
    title: 'X7m Handheld Game Console',
    brand: 'RetroFun',
    category: 'game console',
    price: 79.99,
    rating: 4.0,
    ratingCount: 980,
    image:
      'https://image.made-in-china.com/202f0j00VWakFwvcEioQ/3-5-Inch-HD-Screen-X7m-Handheld-500-in-1-Game-Console.webp',
    description:
      'Portable retro console with HD screen and 500 built-in classic games.'
  },
  {
    id: 'power-001',
    title: 'PowerFlow 20000mAh Power Bank',
    brand: 'Amazona Power',
    category: 'powerbank',
    price: 39.99,
    rating: 4.4,
    ratingCount: 1519,
    image:
      'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSiZm4q1fyjrnq0yiBg6hMSE2FVWhNheo314g&s',
    description:
      'High-capacity USB‑C PD fast charging with dual outputs and smart protection.'
  }
];

// State
const STORAGE_KEYS = {
  cart: 'amazonCloneCart',
  wishlist: 'amazonCloneWishlist',
};

const state = {
  cart: loadJSON(STORAGE_KEYS.cart, {}), // {productId: qty}
  wishlist: new Set(loadJSON(STORAGE_KEYS.wishlist, [])),
  query: '',
  category: 'all',
};

// Utilities
function saveJSON(key, value){ try{ localStorage.setItem(key, JSON.stringify(value)); }catch(e){} }
function loadJSON(key, fallback){ try{ const v = localStorage.getItem(key); return v? JSON.parse(v) : fallback; }catch(e){ return fallback; } }
const $ = (sel, root=document) => root.querySelector(sel);
const $$ = (sel, root=document) => Array.from(root.querySelectorAll(sel));
const fmt = (n) => `$${n.toFixed(2)}`;
const stars = (r) => '★★★★★☆☆☆☆☆'.slice(5 - Math.round(r)) // helper not used

function ratingStars(rating){
  const full = Math.floor(rating);
  const half = rating - full >= 0.5;
  let out = '';
  for(let i=0;i<5;i++){
    if(i<full) out += '★';
    else if(i===full && half) out += '☆';
    else out += '✩';
  }
  return out;
}

// Rendering
function renderProducts(){
  const grid = $('#productGrid');
  const list = filteredProducts();
  if(!list.length){
    grid.innerHTML = `<div class="empty">No products found.</div>`;
    return;
  }
  grid.innerHTML = list.map(p => productCardHTML(p)).join('');
}

function productCardHTML(p){
  const wished = state.wishlist.has(p.id) ? 'active' : '';
  return `
    <article class="card" data-id="${p.id}">
      <div class="thumb">
        <img src="${p.image}" alt="${escapeHtml(p.title)}" onerror="this.src=''; this.alt='Image unavailable'" />
        <button class="wishlist-toggle ${wished}" data-action="toggle-wishlist" aria-label="Toggle wishlist">❤</button>
      </div>
      <div class="content">
        <a href="#" class="title" data-action="quick-view" title="Open quick view">${escapeHtml(p.title)}</a>
        <div class="muted">${escapeHtml(p.brand)}</div>
        <div class="rating" aria-label="Rating ${p.rating} out of 5">
          <span>${ratingStars(p.rating)}</span>
          <span class="muted">(${p.ratingCount.toLocaleString()})</span>
        </div>
        <div class="price">${fmt(p.price)}</div>
        <div class="actions">
          <button class="primary-btn" data-action="add-to-cart">Add to Cart</button>
          <button class="secondary-btn" data-action="quick-view">Quick view</button>
        </div>
      </div>
    </article>
  `;
}

function filteredProducts(){
  const q = state.query.trim().toLowerCase();
  const cat = state.category;
  return PRODUCTS.filter(p => {
    const inCat = cat === 'all' || p.category === cat;
    if(!inCat) return false;
    if(!q) return true;
    return (
      p.title.toLowerCase().includes(q) ||
      p.brand.toLowerCase().includes(q) ||
      p.category.toLowerCase().includes(q)
    );
  });
}

function renderCart(){
  const container = $('#cartItems');
  const entries = Object.entries(state.cart);
  if(!entries.length){
    container.innerHTML = `<p class="muted">Your cart is empty.</p>`;
  } else {
    container.innerHTML = entries.map(([id, qty]) => cartItemHTML(id, qty)).join('');
  }
  const { subtotal, total, count } = cartTotals();
  $('#cartSubtotal').textContent = fmt(subtotal);
  $('#cartTotal').textContent = fmt(total);
  $('#cartCount').textContent = String(count);
}

function cartItemHTML(id, qty){
  const p = PRODUCTS.find(x => x.id === id);
  const line = p ? p.price * qty : 0;
  return `
    <div class="item" data-id="${id}">
      <img src="${p?.image || ''}" alt="${escapeHtml(p?.title || 'Item')}" />
      <div>
        <div class="title">${escapeHtml(p?.title || 'Unknown')}</div>
        <div class="muted">${fmt(p?.price || 0)}</div>
        <div class="qty" role="group" aria-label="Quantity selector">
          <button data-action="dec-qty" aria-label="Decrease">−</button>
          <span aria-live="polite">${qty}</span>
          <button data-action="inc-qty" aria-label="Increase">＋</button>
        </div>
      </div>
      <div style="text-align:right">
        <div>${fmt(line)}</div>
        <button class="remove-btn" data-action="remove-line" aria-label="Remove from cart">Remove</button>
      </div>
    </div>
  `;
}

function renderWishlist(){
  const container = $('#wishlistItems');
  const ids = [...state.wishlist];
  if(!ids.length){
    container.innerHTML = `<p class="muted">Your wishlist is empty.</p>`;
  } else {
    container.innerHTML = ids.map(id => wishlistItemHTML(id)).join('');
  }
  $('#wishlistCount').textContent = String(ids.length);
}

function wishlistItemHTML(id){
  const p = PRODUCTS.find(x => x.id === id);
  return `
    <div class="item" data-id="${id}">
      <img src="${p?.image || ''}" alt="${escapeHtml(p?.title || 'Item')}" />
      <div>
        <div class="title">${escapeHtml(p?.title || 'Unknown')}</div>
        <div class="muted">${fmt(p?.price || 0)}</div>
      </div>
      <div style="text-align:right; display:flex; flex-direction:column; gap:6px; align-items:flex-end">
        <button class="secondary-btn" data-action="move-to-cart">Move to cart</button>
        <button class="remove-btn" data-action="remove-wishlist">Remove</button>
      </div>
    </div>
  `;
}

function cartTotals(){
  let subtotal = 0; let count = 0;
  for(const [id, qty] of Object.entries(state.cart)){
    const p = PRODUCTS.find(x => x.id === id);
    if(!p) continue;
    subtotal += p.price * qty; count += qty;
  }
  const total = subtotal; // taxes/shipping omitted in demo
  return { subtotal, total, count };
}

// Drawers & Modal helpers
function openDrawer(el){ el.classList.add('open'); el.setAttribute('aria-hidden','false'); }
function closeDrawer(el){ el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }
function openModal(el){ el.classList.add('open'); el.setAttribute('aria-hidden','false'); }
function closeModal(el){ el.classList.remove('open'); el.setAttribute('aria-hidden','true'); }

// Quick View
function showQuickView(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  const root = $('#quickViewContent');
  root.innerHTML = `
    <div class="media"><img src="${p.image}" alt="${escapeHtml(p.title)}" /></div>
    <div class="details">
      <h3 class="title">${escapeHtml(p.title)}</h3>
      <div class="muted">${escapeHtml(p.brand)} • ${escapeHtml(p.category)}</div>
      <div class="rating">${ratingStars(p.rating)} <span class="muted">${p.rating} • ${p.ratingCount.toLocaleString()} ratings</span></div>
      <div class="price" style="font-size:22px">${fmt(p.price)}</div>
      <p>${escapeHtml(p.description)}</p>
      <div style="display:flex; gap:8px; margin-top:auto">
        <button class="primary-btn" data-action="add-to-cart" data-id="${p.id}">Add to Cart</button>
        <button class="secondary-btn" data-action="toggle-wishlist" data-id="${p.id}">${state.wishlist.has(p.id)?'Remove Wishlist':'Add Wishlist'}</button>
      </div>
    </div>
  `;
  openModal($('#quickView'));
}

// Actions
function addToCart(id, qty=1){
  const current = state.cart[id] || 0;
  state.cart[id] = Math.max(0, current + qty);
  if(state.cart[id] === 0) delete state.cart[id];
  saveJSON(STORAGE_KEYS.cart, state.cart);
  renderCart();
  toast('Added to cart');
}

function removeLine(id){
  delete state.cart[id];
  saveJSON(STORAGE_KEYS.cart, state.cart);
  renderCart();
}

function toggleWishlist(id){
  if(state.wishlist.has(id)) state.wishlist.delete(id); else state.wishlist.add(id);
  saveJSON(STORAGE_KEYS.wishlist, [...state.wishlist]);
  renderWishlist();
  renderProducts();
}

// Toasts
function toast(msg){
  const t = document.createElement('div');
  t.className = 'toast'; t.textContent = msg;
  $('#toasts').appendChild(t);
  setTimeout(()=>{ t.remove(); }, 2200);
}

// Escape HTML
function escapeHtml(s){
  return String(s).replace(/[&<>"]+/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
}

// Event Listeners
function bindEvents(){
  // Product grid actions
  $('#productGrid').addEventListener('click', (e)=>{
    const btn = e.target.closest('button, a');
    if(!btn) return;
    const card = e.target.closest('.card');
    const id = card?.dataset.id;
    const action = btn.dataset.action;
    if(action === 'add-to-cart' && id){ addToCart(id, 1); }
    if(action === 'quick-view' && id){ showQuickView(id); }
    if(action === 'toggle-wishlist' && id){ toggleWishlist(id); }
    e.preventDefault();
  });

  // Header buttons
  $('#cartBtn').addEventListener('click', ()=>{ openDrawer($('#cartDrawer')); });
  $('#wishlistBtn').addEventListener('click', ()=>{ openDrawer($('#wishlistDrawer')); });

  // Drawer closes
  $$('#cartDrawer [data-close-drawer], #wishlistDrawer [data-close-drawer]').forEach(b=>
    b.addEventListener('click', (e)=> closeDrawer(e.target.closest('.drawer')))
  );

  // Cart drawer interactions
  $('#cartItems').addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const item = e.target.closest('.item');
    const id = item?.dataset.id;
    const action = btn.dataset.action;
    if(!id) return;
    if(action === 'inc-qty'){ addToCart(id, 1); }
    if(action === 'dec-qty'){ addToCart(id, -1); if((state.cart[id]||0)===0) removeLine(id); }
    if(action === 'remove-line'){ removeLine(id); }
  });

  // Wishlist drawer interactions
  $('#wishlistItems').addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const item = e.target.closest('.item');
    const id = item?.dataset.id;
    const action = btn.dataset.action;
    if(action === 'move-to-cart'){ addToCart(id, 1); state.wishlist.delete(id); saveJSON(STORAGE_KEYS.wishlist,[...state.wishlist]); renderWishlist(); renderProducts(); }
    if(action === 'remove-wishlist'){ state.wishlist.delete(id); saveJSON(STORAGE_KEYS.wishlist,[...state.wishlist]); renderWishlist(); renderProducts(); }
  });

  // Clear buttons
  $('#clearCart').addEventListener('click', ()=>{ state.cart = {}; saveJSON(STORAGE_KEYS.cart,state.cart); renderCart(); });
  $('#clearWishlist').addEventListener('click', ()=>{ state.wishlist = new Set(); saveJSON(STORAGE_KEYS.wishlist,[]); renderWishlist(); renderProducts(); });

  // Checkout demo
  $('#checkoutBtn').addEventListener('click', ()=>{
    const { total, count } = cartTotals();
    if(count===0) { toast('Your cart is empty'); return; }
    toast(`Checkout simulated — ${count} items, total ${fmt(total)}`);
  });

  // Search
  $('#searchForm').addEventListener('submit', (e)=>{ e.preventDefault(); state.query = $('#searchInput').value; renderProducts(); });
  $('#searchInput').addEventListener('input', (e)=>{ state.query = e.target.value; renderProducts(); });

  // Categories
  $('#categoryNav').addEventListener('click', (e)=>{
    const btn = e.target.closest('button[data-category]');
    if(!btn) return;
    state.category = btn.dataset.category;
    $$('#categoryNav .nav-link').forEach(b=> b.classList.toggle('active', b===btn));
    renderProducts();
  });

  // Logo click -> reset filters
  $('.logo').addEventListener('click', (e)=>{
    e.preventDefault();
    state.query=''; state.category='all';
    $('#searchInput').value='';
    $$('#categoryNav .nav-link').forEach(b=> b.classList.toggle('active', b.dataset.category==='all'));
    renderProducts();
    closeDrawer($('#cartDrawer')); closeDrawer($('#wishlistDrawer'));
    window.scrollTo({top:0, behavior:'smooth'});
  });

  // Quick view modal close
  $$('#quickView [data-close-modal]').forEach(b=> b.addEventListener('click', ()=> closeModal($('#quickView'))));
  $('#quickView').addEventListener('click', (e)=>{
    if(e.target.matches('[data-close-modal], .modal-backdrop')) closeModal($('#quickView'));
  });

  // Quick view internal actions
  $('#quickView').addEventListener('click', (e)=>{
    const btn = e.target.closest('button');
    if(!btn) return;
    const id = btn.dataset.id;
    const action = btn.dataset.action;
    if(action==='add-to-cart' && id){ addToCart(id,1); }
    if(action==='toggle-wishlist' && id){ toggleWishlist(id); showQuickView(id); }
  });
}

// Init
function init(){
  renderProducts();
  renderCart();
  renderWishlist();
  bindEvents();
}

document.addEventListener('DOMContentLoaded', init);
