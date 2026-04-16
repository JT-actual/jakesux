// Sticky nav blur on scroll
const nav = document.getElementById('nav');
const onScroll = () => nav.classList.toggle('scrolled', window.scrollY > 8);
document.addEventListener('scroll', onScroll, { passive: true });
onScroll();

// Reveal-on-scroll
const io = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      e.target.classList.add('in');
      io.unobserve(e.target);
    }
  }
}, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
document.querySelectorAll('.reveal').forEach((el) => io.observe(el));

// Animated counters
const formatNumber = (n, decimals) => {
  if (decimals && decimals > 0) return n.toFixed(decimals);
  if (n >= 1_000_000_000) return (n / 1_000_000_000).toFixed(2).replace(/\.?0+$/, '') + 'B';
  if (n >= 1_000_000)     return (n / 1_000_000).toFixed(2).replace(/\.?0+$/, '') + 'M';
  if (n >= 1_000)         return (n / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  return Math.round(n).toString();
};

const animateCounter = (el) => {
  const to = parseFloat(el.dataset.to || '0');
  const decimals = parseInt(el.dataset.decimals || '0', 10);
  const divisor = parseFloat(el.dataset.divisor || '1');
  const target = to / divisor;
  const duration = 1600;
  const start = performance.now();
  const tick = (now) => {
    const t = Math.min(1, (now - start) / duration);
    const eased = 1 - Math.pow(1 - t, 3);
    el.textContent = formatNumber(target * eased, decimals);
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = formatNumber(target, decimals);
  };
  requestAnimationFrame(tick);
};

const counterIo = new IntersectionObserver((entries) => {
  for (const e of entries) {
    if (e.isIntersecting) {
      animateCounter(e.target);
      counterIo.unobserve(e.target);
    }
  }
}, { threshold: 0.4 });
document.querySelectorAll('.counter').forEach((el) => counterIo.observe(el));

// Card spotlight follow-cursor
document.querySelectorAll('.card').forEach((card) => {
  card.addEventListener('mousemove', (e) => {
    const r = card.getBoundingClientRect();
    card.style.setProperty('--mx', ((e.clientX - r.left) / r.width) * 100 + '%');
    card.style.setProperty('--my', ((e.clientY - r.top) / r.height) * 100 + '%');
  });
});

// CTA form toast
const form = document.getElementById('ctaForm');
const toast = document.getElementById('toast');
const showToast = (msg) => {
  toast.textContent = msg;
  toast.classList.add('show');
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => toast.classList.remove('show'), 3200);
};
form?.addEventListener('submit', (e) => {
  e.preventDefault();
  const email = form.querySelector('input').value.trim();
  if (!email || !email.includes('@')) {
    showToast('That email looks fake. Just like Jake\'s personality.');
    return;
  }
  form.reset();
  showToast('✓ Thanks! Jake will disappoint you shortly.');
});

// Live "sigh feed" auto-update
const feed = document.querySelector('.mock-feed');
if (feed) {
  const events = [
    { cls: 'warn', tag: 'SIGH',     text: 'audible · payload: "again, Jake?"' },
    { cls: 'bad',  tag: 'EYEROLL',  text: 'p99 = 4.4s · region us-east' },
    { cls: 'bad',  tag: 'CRINGE',   text: 'spike detected during all-hands' },
    { cls: 'warn', tag: 'YIKES',    text: 'Jake said "actually..." again' },
    { cls: 'ok',   tag: 'RECOVERY', text: 'nope. false alarm.' },
    { cls: 'bad',  tag: 'EYEROLL',  text: 'severity: hard · ocular muscles: strained' },
    { cls: 'warn', tag: 'SIGH',     text: 'duration 3.2s · cause: opinion shared' },
  ];
  let i = 3;
  setInterval(() => {
    const ev = events[i++ % events.length];
    const time = new Date().toLocaleTimeString('en-US', { hour12: false });
    const row = document.createElement('div');
    row.className = 'feed-row';
    row.innerHTML = `<span class="pill ${ev.cls}">${ev.tag}</span> ${ev.text} · ${time}`;
    row.style.opacity = '0';
    row.style.transition = 'opacity .35s ease';
    feed.insertBefore(row, feed.firstChild);
    requestAnimationFrame(() => (row.style.opacity = '1'));
    while (feed.children.length > 4) feed.lastChild.remove();
  }, 2400);
}
