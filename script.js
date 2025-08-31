// Sling Pizza — interactivity

const form = document.getElementById('orderForm');
const inquiryType = document.getElementById('inquiryType');
const orderFields = document.getElementById('orderFields');
const statusEl = document.getElementById('formStatus');
const yearEl = document.getElementById('year');

// Set current year in footer
yearEl.textContent = new Date().getFullYear();

function toggleOrderFields() {
  const isOrder = inquiryType.value === 'order';
  orderFields.hidden = !isOrder;
  // Toggle required attributes for a11y/validation
  orderFields.querySelectorAll('select, input, textarea').forEach((el) => {
    if (['pizza', 'size', 'quantity', 'crust', 'address'].includes(el.name)) {
      el.required = isOrder;
    }
  });
}

inquiryType.addEventListener('change', toggleOrderFields);
toggleOrderFields();

form.addEventListener('submit', (e) => {
  e.preventDefault();
  statusEl.textContent = '';

  // Simple client-side validation
  const missing = Array.from(form.querySelectorAll('[required]')).filter((el) => !el.value.trim());
  if (missing.length) {
    const names = missing.map((el) => (el.previousElementSibling?.textContent || el.name)).join(', ');
    statusEl.textContent = `Please fill: ${names}`;
    statusEl.style.color = '#ffb300';
    missing[0].focus();
    return;
  }

  // Gather data
  const data = Object.fromEntries(new FormData(form).entries());

  // Simulate async submission
  statusEl.style.color = '#9be79b';
  statusEl.textContent = 'Sending…';
  setTimeout(() => {
    statusEl.textContent = 'Thanks! We received your request and will confirm shortly.';
    // Optional: clear form for enquiry, keep for order so user can review
    if (data.type === 'enquiry') form.reset();
    toggleOrderFields();
    console.log('Sling Pizza form data:', data);
  }, 600);
});

