// Phronetics — interactions
(function(){
  const $ = (sel, ctx=document) => ctx.querySelector(sel);
  const $$ = (sel, ctx=document) => Array.from(ctx.querySelectorAll(sel));

  // Config: set your event start here
  const EVENT_START = new Date(Date.now() + 1000 * 60 * 60 * 24 * 30); // 30 days from now
  const EVENT_TZ = Intl.DateTimeFormat().resolvedOptions().timeZone;

  // Countdown
  function updateCountdown(){
    const now = new Date();
    let diff = (EVENT_START - now);
    const daysEl = $('#cd-days');
    const hoursEl = $('#cd-hours');
    const minsEl = $('#cd-mins');
    const secsEl = $('#cd-secs');

    if (diff <= 0){
      daysEl.textContent = '00';
      hoursEl.textContent = '00';
      minsEl.textContent = '00';
      secsEl.textContent = '00';
      const t = $('.tagline');
      if (t) t.textContent = 'We are LIVE — good luck, builders!';
      return; // stop once live
    }

    const days = Math.floor(diff / (1000*60*60*24)); diff -= days*(1000*60*60*24);
    const hours = Math.floor(diff / (1000*60*60)); diff -= hours*(1000*60*60);
    const mins = Math.floor(diff / (1000*60)); diff -= mins*(1000*60);
    const secs = Math.floor(diff / 1000);

    daysEl.textContent = String(days).padStart(2,'0');
    hoursEl.textContent = String(hours).padStart(2,'0');
    minsEl.textContent = String(mins).padStart(2,'0');
    secsEl.textContent = String(secs).padStart(2,'0');
  }

  setInterval(updateCountdown, 1000);
  updateCountdown();

  // Timeline data and rendering
  const timeline = [
    { time: '09:00', title: 'Doors Open + Check-in' },
    { time: '10:00', title: 'Opening Ceremony + Team Match' },
    { time: '11:00', title: 'Hacking Begins' },
    { time: '13:00', title: 'Lunch + Sponsor Mini-talks' },
    { time: '16:00', title: 'Mentor Office Hours' },
    { time: '19:00', title: 'Dinner + Music' },
    { time: '23:00', title: 'Wellness Break / Stretch' },
    { time: '09:00 (Day 2)', title: 'Final Push' },
    { time: '12:00 (Day 2)', title: 'Submission Deadline' },
    { time: '13:00 (Day 2)', title: 'Demos & Judging' },
    { time: '16:00 (Day 2)', title: 'Awards + Closing' }
  ];

  function renderTimeline(){
    const el = $('#timeline'); if(!el) return;
    el.innerHTML = '';
    const today = new Date();
    let currentIndex = -1;
    // Basic heuristic: mark current around midday slots
    const hour = today.getHours();
    if (hour < 10) currentIndex = 0; else if (hour < 11) currentIndex = 1; else if (hour < 13) currentIndex = 2; else if (hour < 16) currentIndex = 3; else if (hour < 19) currentIndex = 4; else if (hour < 23) currentIndex = 5; else currentIndex = 6;
    timeline.forEach((item, i) => {
      const div = document.createElement('div');
      div.className = 'timeline__item' + (i === currentIndex ? ' is-current' : '');
      const time = document.createElement('div'); time.className = 'timeline__time'; time.textContent = item.time;
      const title = document.createElement('h4'); title.className = 'timeline__title'; title.textContent = item.title;
      div.append(time, title);
      el.appendChild(div);
    });
  }
  renderTimeline();

  // Neon card tilt (simple parallax)
  function attachTilt(){
    const cards = $$('[data-tilt]');
    cards.forEach(card => {
      let rect;
      const onEnter = () => { rect = card.getBoundingClientRect(); };
      const onMove = (e) => {
        if(!rect) rect = card.getBoundingClientRect();
        const cx = rect.left + rect.width/2;
        const cy = rect.top + rect.height/2;
        const dx = (e.clientX - cx) / (rect.width/2);
        const dy = (e.clientY - cy) / (rect.height/2);
        const rotX = (dy * -6).toFixed(2);
        const rotY = (dx * 6).toFixed(2);
        card.style.transform = `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg)`;
      };
      const onLeave = () => { card.style.transform = ''; };
      card.addEventListener('mouseenter', onEnter);
      card.addEventListener('mousemove', onMove);
      card.addEventListener('mouseleave', onLeave);
      // Touch cleanup
      card.addEventListener('touchend', onLeave);
    });
  }
  attachTilt();

  // Scroll reveal
  const observer = ('IntersectionObserver' in window) ? new IntersectionObserver((entries)=>{
    entries.forEach(entry => {
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); observer.unobserve(entry.target); }
    });
  }, { threshold: 0.12 }) : null;
  if (observer) $$('.reveal').forEach(el => observer.observe(el)); else $$('.reveal').forEach(el=>el.classList.add('in-view'));

  // Mobile nav toggle
  const navToggle = $('.nav__toggle');
  const navLinks = $('.nav__links');
  if (navToggle && navLinks){
    navToggle.addEventListener('click', () => {
      const isOpen = navLinks.classList.toggle('is-open');
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });
    // Close on click
    navLinks.addEventListener('click', (e)=>{
      if (e.target.tagName === 'A') { navLinks.classList.remove('is-open'); navToggle.setAttribute('aria-expanded', 'false'); }
    });
  }

  // Registration form
  const form = $('#registration-form');
  const membersEl = $('#members');
  const addMemberBtn = $('#addMember');
  const statusEl = $('#form-status');
  if (addMemberBtn && membersEl){
    addMemberBtn.addEventListener('click', ()=>{
      const count = membersEl.querySelectorAll('.member').length + 1;
      const wrap = document.createElement('div');
      wrap.className = 'form__row member';
      const label = document.createElement('label'); label.textContent = `Member ${count} Email`;
      const input = document.createElement('input'); input.type = 'email'; input.name = 'memberEmails[]'; input.placeholder = 'name@example.com'; input.required = true;
      wrap.append(label, input);
      membersEl.appendChild(wrap);
      wrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
    });
  }
  if (form){
    form.addEventListener('submit', (e)=>{
      e.preventDefault();
      // Simulate async submission
      statusEl.textContent = 'Submitting…';
      setTimeout(()=>{
        statusEl.textContent = 'Registration received! We’ve emailed your confirmation.';
        form.reset();
      }, 900);
    });
  }

  // Live updates (simulated)
  const updates = [
    'Check-in opens at 9:00 — grab your badge!',
    'Coffee bar is live near the main stage.',
    'Join the 2pm workshop: Prompting for Devs (Room B).',
    'Remember to submit project repos by tomorrow noon.',
    'Mentors now available at Mentor Hub until 6pm.',
    'Dinner served — vegetarian and vegan options available.',
  ];
  const updatesFeed = $('#updates-feed');
  function addUpdate(text){
    if(!updatesFeed) return;
    const li = document.createElement('li');
    const msg = document.createElement('div'); msg.textContent = text;
    const time = document.createElement('time'); time.textContent = new Date().toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    li.append(msg, time);
    updatesFeed.prepend(li);
  }
  if (updatesFeed){
    // seed a few
    updates.slice(0,3).forEach(addUpdate);
    let i = 3;
    setInterval(()=>{ addUpdate(updates[i % updates.length]); i++; }, 4500);
  }

  // Footer year
  const yearEl = $('#year'); if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

