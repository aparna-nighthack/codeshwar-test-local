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

