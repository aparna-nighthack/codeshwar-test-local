// Mobile menu toggle
const menuBtn = document.querySelector('.menu-toggle');
const nav = document.getElementById('mainNav');
if (menuBtn && nav) {
  menuBtn.addEventListener('click', () => {
    const open = nav.classList.toggle('open');
    menuBtn.setAttribute('aria-expanded', String(open));
  });
}

// Add-to-cart demo (no backend)
document.querySelectorAll('.add-to-cart').forEach(btn => {
  btn.addEventListener('click', () => {
    const name = btn.getAttribute('data-name');
    const price = btn.getAttribute('data-price');
    // Simple, friendly UI feedback
    btn.textContent = 'Added ✓';
    btn.disabled = true;
    setTimeout(() => {
      btn.textContent = 'Add to Cart';
      btn.disabled = false;
    }, 1500);
    console.log(`Added to cart: ${name} ($${price})`);
  });
});

// Contact form message (demo only)
const contactForm = document.getElementById('contactForm');
const formNote = document.getElementById('formNote');
if (contactForm && formNote) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();
    formNote.textContent = 'Thanks! We will get back to you soon.';
    contactForm.reset();
  });
}

// Newsletter form (demo only)
const newsletterForm = document.getElementById('newsletterForm');
if (newsletterForm) {
  newsletterForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert('Subscribed! Welcome to Stride.');
    newsletterForm.reset();
  });
}

// Footer year
const year = document.getElementById('year');
if (year) year.textContent = new Date().getFullYear();

