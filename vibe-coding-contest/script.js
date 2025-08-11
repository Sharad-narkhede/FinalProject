const SELECTORS = {
  dd: document.getElementById('dd'),
  hh: document.getElementById('hh'),
  mm: document.getElementById('mm'),
  ss: document.getElementById('ss'),
  year: document.getElementById('year'),
  themeToggle: document.getElementById('themeToggle'),
  confettiCanvas: document.getElementById('confetti-canvas'),
  registerBtn: document.getElementById('registerBtn'),
  registerForm: document.getElementById('registerForm'),
  formStatus: document.getElementById('formStatus')
};

// Set current year in footer
SELECTORS.year.textContent = new Date().getFullYear();

// Theme toggle with persistence
(function setupTheme() {
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const stored = localStorage.getItem('vibe-theme');
  const theme = stored || (prefersDark ? 'dark' : 'light');
  if (theme === 'light') document.documentElement.setAttribute('data-theme', 'light');
  SELECTORS.themeToggle.addEventListener('click', () => {
    const isLight = document.documentElement.getAttribute('data-theme') === 'light';
    document.documentElement.setAttribute('data-theme', isLight ? 'dark' : 'light');
    localStorage.setItem('vibe-theme', isLight ? 'dark' : 'light');
  });
})();

// Smooth scroll for anchor links
for (const a of document.querySelectorAll('a[href^="#"]')) {
  a.addEventListener('click', (e) => {
    const id = a.getAttribute('href').slice(1);
    if (!id) return;
    const el = document.getElementById(id);
    if (!el) return;
    e.preventDefault();
    el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  });
}

// Countdown
const START_TIME = new Date('2025-12-01T17:00:00Z').getTime();
let countdownInterval = null;
function updateCountdown() {
  const now = Date.now();
  let diff = Math.max(0, START_TIME - now);

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  diff -= days * 24 * 60 * 60 * 1000;
  const hours = Math.floor(diff / (1000 * 60 * 60));
  diff -= hours * 60 * 60 * 1000;
  const mins = Math.floor(diff / (1000 * 60));
  diff -= mins * 60 * 1000;
  const secs = Math.floor(diff / 1000);

  SELECTORS.dd.textContent = String(days).padStart(2, '0');
  SELECTORS.hh.textContent = String(hours).padStart(2, '0');
  SELECTORS.mm.textContent = String(mins).padStart(2, '0');
  SELECTORS.ss.textContent = String(secs).padStart(2, '0');

  if (START_TIME - now <= 0) {
    clearInterval(countdownInterval);
    celebrate();
  }
}
countdownInterval = setInterval(updateCountdown, 1000);
updateCountdown();

// Scroll spy to highlight nav based on section in view
(function setupScrollSpy() {
  const navLinks = Array.from(document.querySelectorAll('.nav a[href^="#"]'));
  const idToLink = new Map(navLinks.map(link => [link.getAttribute('href').slice(1), link]));
  const observer = new IntersectionObserver((entries) => {
    for (const e of entries) {
      if (!idToLink.has(e.target.id)) continue;
      if (e.isIntersecting) {
        navLinks.forEach(l => l.classList.remove('active'));
        idToLink.get(e.target.id).classList.add('active');
      }
    }
  }, { rootMargin: '-40% 0px -50% 0px', threshold: 0.01 });

  const sections = document.querySelectorAll('section[id]');
  sections.forEach(s => observer.observe(s));
})();

// Interactive tilt on cards
(function setupTilt() {
  const cards = document.querySelectorAll('.card');
  const bounds = 16; // max deg
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const r = card.getBoundingClientRect();
      const cx = e.clientX - r.left;
      const cy = e.clientY - r.top;
      const rx = ((cy - r.height / 2) / r.height) * -bounds;
      const ry = ((cx - r.width / 2) / r.width) * bounds;
      card.style.transform = `rotateX(${rx.toFixed(2)}deg) rotateY(${ry.toFixed(2)}deg)`;
    });
    card.addEventListener('mouseleave', () => {
      card.style.transform = 'rotateX(0) rotateY(0)';
    });
  });
})();

// Confetti
function celebrate() {
  const canvas = SELECTORS.confettiCanvas;
  const ctx = canvas.getContext('2d');
  const dpr = Math.max(1, window.devicePixelRatio || 1);
  function resize() {
    canvas.width = Math.floor(innerWidth * dpr);
    canvas.height = Math.floor(innerHeight * dpr);
    ctx.scale(dpr, dpr);
  }
  resize();
  let running = true;
  const colors = ['#ff6ec7', '#6d8cff', '#58e6d9', '#ffd166', '#ff4d4d'];
  const pieces = Array.from({ length: 180 }, () => ({
    x: Math.random() * innerWidth,
    y: -20 - Math.random() * innerHeight,
    s: 6 + Math.random() * 12,
    a: Math.random() * Math.PI * 2,
    v: 2 + Math.random() * 3,
    w: -0.05 + Math.random() * 0.1,
    c: colors[Math.floor(Math.random() * colors.length)]
  }));

  function step() {
    if (!running) return;
    ctx.clearRect(0, 0, innerWidth, innerHeight);
    for (const p of pieces) {
      p.a += p.w;
      p.y += p.v;
      p.x += Math.sin(p.a) * 1.2;
      if (p.y > innerHeight + 30) {
        p.y = -20;
        p.x = Math.random() * innerWidth;
      }
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(p.a);
      ctx.fillStyle = p.c;
      ctx.fillRect(-p.s / 2, -p.s / 2, p.s, p.s * 0.6);
      ctx.restore();
    }
    requestAnimationFrame(step);
  }

  const timeout = setTimeout(() => { running = false; ctx.clearRect(0, 0, innerWidth, innerHeight); }, 4500);
  window.addEventListener('resize', resize, { once: true });
  step();
}

// Trigger confetti on register click as a preview delight
if (SELECTORS.registerBtn) {
  SELECTORS.registerBtn.addEventListener('click', () => {
    celebrate();
  });
}

// AJAX form submission to backend
(function setupForm() {
  const form = SELECTORS.registerForm;
  if (!form) return;
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const submitBtn = SELECTORS.registerBtn;
    const status = SELECTORS.formStatus;
    status.textContent = '';

    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    submitBtn.disabled = true;
    submitBtn.textContent = 'Registering…';
    try {
      const res = await fetch('http://localhost:5050/api/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok || !data.ok) throw new Error(data.error || 'Request failed');
      status.textContent = 'Registered! Check your email for updates.';
      status.style.color = 'var(--success)';
      form.reset();
    } catch (err) {
      status.textContent = `Error: ${err.message}`;
      status.style.color = 'salmon';
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Register';
    }
  });
})();