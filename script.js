/* ============================================================
   PERSONA — script.js
   ============================================================ */

'use strict';

/* ── Utility: lerp ─────────────────────────────────────── */
const lerp = (a, b, t) => a + (b - a) * t;

/* ── Custom cursor ─────────────────────────────────────── */
const dot  = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;

document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx + 'px';
  dot.style.top  = my + 'px';
  spawnTrail(mx, my);
});

(function animateRing() {
  rx = lerp(rx, mx, 0.1);
  ry = lerp(ry, my, 0.1);
  ring.style.left = rx + 'px';
  ring.style.top  = ry + 'px';
  requestAnimationFrame(animateRing);
})();

/* Hover state for interactive elements */
document.querySelectorAll('a, button, .drop-card, .shirt-swatch').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* ── Trail particles ────────────────────────────────────── */
const SHAPES = ['✦', '★', '◆', '✧', '◈', '⬡'];
let lastTrail = 0;

function spawnTrail(x, y) {
  const now = Date.now();
  if (now - lastTrail < 65) return;
  lastTrail = now;

  const p = document.createElement('div');
  p.className = 'trail-particle';
  const s = 7 + Math.random() * 9;
  p.style.cssText = `left:${x}px;top:${y}px;font-size:${s}px;color:rgba(201,168,76,${.35 + Math.random() * .45})`;
  p.textContent = SHAPES[Math.floor(Math.random() * SHAPES.length)];
  p.setAttribute('aria-hidden', 'true');
  document.body.appendChild(p);
  setTimeout(() => p.remove(), 750);
}

/* ── Cursor followers ───────────────────────────────────── */
const fData = [
  { el: document.getElementById('f1'), x: 0, y: 0, lag: .052, ox: -42, oy: -36 },
  { el: document.getElementById('f2'), x: 0, y: 0, lag: .038, ox:  38, oy: -28 },
  { el: document.getElementById('f3'), x: 0, y: 0, lag: .028, ox: -30, oy:  40 },
  { el: document.getElementById('f4'), x: 0, y: 0, lag: .065, ox:  45, oy:  32 },
].filter(f => f.el); /* Guard: skip if element missing */

(function animateFollowers() {
  fData.forEach(f => {
    f.x = lerp(f.x, mx + f.ox, f.lag);
    f.y = lerp(f.y, my + f.oy, f.lag);
    f.el.style.left = f.x + 'px';
    f.el.style.top  = f.y + 'px';
  });
  requestAnimationFrame(animateFollowers);
})();

/* ── Background particle canvas ────────────────────────── */
const canvas = document.getElementById('particleCanvas');
if (canvas) {
  const ctx = canvas.getContext('2d');

  function resizeCanvas() {
    canvas.width  = canvas.parentElement.offsetWidth;
    canvas.height = canvas.parentElement.offsetHeight;
  }
  resizeCanvas();
  window.addEventListener('resize', resizeCanvas);

  const pts = Array.from({ length: 55 }, () => ({
    x:  Math.random() * 1400,
    y:  Math.random() * 800,
    r:  .4 + Math.random() * 1.4,
    vx: (Math.random() - .5) * .28,
    vy: (Math.random() - .5) * .28,
    a:  Math.random(),
    da: .002 + Math.random() * .005,
  }));

  (function drawParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy; p.a += p.da;
      if (p.a > 1 || p.a < 0) p.da *= -1;
      if (p.x < 0 || p.x > canvas.width)  p.vx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(201,168,76,${p.a * .48})`;
      ctx.fill();
    });
    requestAnimationFrame(drawParticles);
  })();
}

/* ── Mannequin drag-to-rotate ───────────────────────────── */
const m3d       = document.getElementById('mannequin-3d');
const mSvg      = document.getElementById('mannequin-svg');
const shirtBody   = document.getElementById('shirt-body');
const shirtDesign = document.getElementById('shirt-design');

if (m3d && mSvg) {
  let drag = false, sx = 0, angle = 0, tAngle = 0, vel = 0;

  /* Mouse */
  m3d.addEventListener('mousedown', e => { drag = true; sx = e.clientX; });
  window.addEventListener('mouseup', () => { drag = false; });
  window.addEventListener('mousemove', e => {
    if (!drag) return;
    const dx = e.clientX - sx; sx = e.clientX; vel = dx; tAngle += dx * .65;
  });

  /* Touch */
  m3d.addEventListener('touchstart', e => {
    drag = true; sx = e.touches[0].clientX;
  }, { passive: true });
  window.addEventListener('touchend', () => { drag = false; });
  window.addEventListener('touchmove', e => {
    if (!drag) return;
    const dx = e.touches[0].clientX - sx; sx = e.touches[0].clientX; vel = dx; tAngle += dx * .65;
  }, { passive: true });

  /* Keyboard accessibility: left/right arrows rotate mannequin */
  m3d.setAttribute('tabindex', '0');
  m3d.setAttribute('role', 'slider');
  m3d.setAttribute('aria-label', 'Mannequin — use arrow keys to rotate');
  m3d.addEventListener('keydown', e => {
    if (e.key === 'ArrowLeft')  tAngle -= 20;
    if (e.key === 'ArrowRight') tAngle += 20;
  });

  (function animateMannequin() {
    if (!drag) { vel *= .92; tAngle += vel; }
    angle = lerp(angle, tAngle, .12);

    const rad   = angle * Math.PI / 180;
    const cosA  = Math.cos(rad);
    const scaleX = Math.max(.12, Math.abs(cosA));
    const flip   = cosA < 0 ? -scaleX : scaleX;

    mSvg.style.transform = `scaleX(${flip})`;
    if (shirtDesign) {
      shirtDesign.style.opacity = scaleX > .38 ? '1' : '0';
    }
    requestAnimationFrame(animateMannequin);
  })();
}

/* ── Shirt colour swatches ──────────────────────────────── */
const LIGHT_COLORS = ['#f0dfa0', '#c9a84c'];

document.querySelectorAll('.shirt-swatch').forEach(sw => {
  sw.addEventListener('click', () => {
    document.querySelectorAll('.shirt-swatch').forEach(s => s.classList.remove('active'));
    sw.classList.add('active');

    const c = sw.getAttribute('data-color');
    if (shirtBody) shirtBody.setAttribute('fill', c);

    if (shirtDesign) {
      const isLight = LIGHT_COLORS.includes(c);
      const fill   = isLight ? 'rgba(10,8,0,0.75)' : '';
      const stroke = isLight ? 'rgba(10,8,0,0.5)'  : '';
      shirtDesign.querySelectorAll('text, polygon, line').forEach(el => {
        el.style.fill   = fill;
        el.style.stroke = stroke;
      });
    }
  });
});

/* ── Scroll reveal (IntersectionObserver) ───────────────── */
const revealObs = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.style.opacity   = '1';
      e.target.style.transform = 'translateY(0)';
      revealObs.unobserve(e.target); /* Stop observing once revealed */
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.step, .drop-card, .about-content, .philosophy blockquote').forEach(el => {
  el.style.opacity    = '0';
  el.style.transform  = 'translateY(38px)';
  el.style.transition = 'opacity .7s ease, transform .7s ease';
  revealObs.observe(el);
});

/* ── Mobile nav toggle ──────────────────────────────────── */
const navToggle = document.getElementById('nav-toggle');
const navLinks  = document.getElementById('nav-links');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    navToggle.setAttribute('aria-expanded', String(isOpen));
  });

  /* Close menu when a link is tapped */
  navLinks.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}
