// Sling Pizza — Interactions
(function(){
  const byId = id => document.getElementById(id);
  const qs = (sel, el=document) => el.querySelector(sel);
  const qsa = (sel, el=document) => Array.from(el.querySelectorAll(sel));

  const year = new Date().getFullYear();
  const yearEl = byId('year');
  if (yearEl) yearEl.textContent = String(year);

  const form = byId('contactForm');
  const orderFields = qs('.order-fields');
  const enquiryFields = qs('.enquiry-fields');
  const formStatus = byId('formStatus');
  const orderType = byId('orderType');
  const addressFieldWrap = qs('.address-field');

  function setMode(mode){
    const isOrder = mode === 'order';
    orderFields.classList.toggle('hidden', !isOrder);
    enquiryFields.classList.toggle('hidden', isOrder);
  }

  qsa('input[name="type"]').forEach(r => {
    r.addEventListener('change', e => setMode(e.target.value));
  });
  setMode(qs('input[name="type"]:checked').value);

  // Show/hide address for delivery
  orderType && orderType.addEventListener('change', () => {
    const isDelivery = orderType.value === 'Delivery';
    addressFieldWrap.classList.toggle('hidden', !isDelivery);
  });

  function setError(id, message){
    const err = qs(`.error[data-for="${id}"]`);
    if (err) err.textContent = message || '';
  }

  function validate(){
    let ok = true;
    const name = byId('name');
    const phone = byId('phone');
    const email = byId('email');
    setError('name',''); setError('phone',''); setError('email','');
    if(!name.value.trim()){ setError('name','Please enter your name.'); ok=false; }
    if(!/^[0-9+\-\s]{7,15}$/.test(phone.value.trim())){ setError('phone','Enter a valid phone.'); ok=false; }
    if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value.trim())){ setError('email','Enter a valid email.'); ok=false; }
    return ok;
  }

  function encode(v){ return encodeURIComponent(v ?? ''); }

  function submitAsMailto(data){
    const to = 'orders@sling.pizza'; // replace with your actual email
    const subject = data.type === 'order' ?
      `New Order — ${data.name} (${data.size} / ${data.crust})` :
      `Product Enquiry — ${data.subject || 'General'} (${data.name})`;

    const toppings = (data.toppings && data.toppings.length) ? data.toppings.join(', ') : 'None';
    const lines = [
      `Name: ${data.name}`,
      `Phone: ${data.phone}`,
      `Email: ${data.email}`,
      '',
      data.type === 'order' ? `Type: ${data.orderType}` : `Type: Enquiry`,
      data.type === 'order' ? `Size/Crust: ${data.size} / ${data.crust}` : `Product: ${data.product || '-'}`,
      data.type === 'order' ? `Qty: ${data.quantity}` : `Subject: ${data.subject || '-'}`,
      data.type === 'order' ? `Toppings: ${toppings}` : `Message: ${data.message || '-'}`,
      data.orderType === 'Delivery' ? `Address: ${data.address || '-'}` : '',
      `Preferred Time: ${data.time || '-'}`,
      `Notes: ${data.notes || '-'}`
    ].filter(Boolean).join('\n');

    const href = `mailto:${encode(to)}?subject=${encode(subject)}&body=${encode(lines)}`;
    // Navigate to mailto and also show a confirmation message.
    window.location.href = href;
    formStatus.textContent = 'Opening your email client to finish the request…';
  }

  form && form.addEventListener('submit', (e) => {
    e.preventDefault();
    formStatus.textContent = '';
    if(!validate()){
      formStatus.textContent = 'Please correct the highlighted fields.';
      return;
    }

    const formData = new FormData(form);
    const type = formData.get('type');
    const data = {
      type,
      name: formData.get('name'),
      phone: formData.get('phone'),
      email: formData.get('email'),
      size: formData.get('size'),
      crust: formData.get('crust'),
      quantity: formData.get('quantity'),
      toppings: formData.getAll('toppings'),
      orderType: formData.get('orderType'),
      address: formData.get('address'),
      time: formData.get('time'),
      subject: formData.get('subject'),
      product: formData.get('product'),
      message: formData.get('message'),
      notes: formData.get('notes')
    };

    submitAsMailto(data);
  });
})();