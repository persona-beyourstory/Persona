const CART_STORAGE_KEY = 'persona_cart';

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function updateCartCount() {
  const cartCount = document.getElementById('cartCount');
  if (!cartCount) return;
  cartCount.textContent = readCart().reduce((sum, item) => sum + item.quantity, 0);
}

function setupCursor() {
  const dot = document.getElementById('cursor-dot');
  const ring = document.getElementById('cursor-ring');
  if (!dot || !ring) return;

  let mx = 0;
  let my = 0;
  let rx = 0;
  let ry = 0;

  document.addEventListener('mousemove', event => {
    mx = event.clientX;
    my = event.clientY;
    dot.style.left = `${mx}px`;
    dot.style.top = `${my}px`;
  });

  (function animateRing() {
    rx += (mx - rx) * .1;
    ry += (my - ry) * .1;
    ring.style.left = `${rx}px`;
    ring.style.top = `${ry}px`;
    requestAnimationFrame(animateRing);
  })();

  document.querySelectorAll('a, button, input, textarea, .glow-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

function setupGooeyText() {
  const host = document.querySelector('[data-gooey-texts]');
  if (!host) return;

  const texts = JSON.parse(host.dataset.gooeyTexts || '[]');
  const one = host.querySelector('.gooey-text-one');
  const two = host.querySelector('.gooey-text-two');
  if (!texts.length || !one || !two) return;

  let textIndex = texts.length - 1;
  let time = new Date();
  let morph = 0;
  let cooldown = .55;
  const morphTime = 1;
  const cooldownTime = .55;

  function setMorph(fraction) {
    const safeFraction = Math.max(fraction, .001);
    two.style.filter = `blur(${Math.min(8 / safeFraction - 8, 100)}px)`;
    two.style.opacity = `${Math.pow(safeFraction, .4) * 100}%`;

    const reverse = Math.max(1 - fraction, .001);
    one.style.filter = `blur(${Math.min(8 / reverse - 8, 100)}px)`;
    one.style.opacity = `${Math.pow(reverse, .4) * 100}%`;
  }

  function cooldownFrame() {
    morph = 0;
    two.style.filter = '';
    two.style.opacity = '100%';
    one.style.filter = '';
    one.style.opacity = '0%';
  }

  function morphFrame() {
    morph -= cooldown;
    cooldown = 0;
    let fraction = morph / morphTime;

    if (fraction > 1) {
      cooldown = cooldownTime;
      fraction = 1;
    }

    setMorph(fraction);
  }

  function animate() {
    requestAnimationFrame(animate);
    const newTime = new Date();
    const shouldIncrementIndex = cooldown > 0;
    const dt = (newTime.getTime() - time.getTime()) / 1000;
    time = newTime;
    cooldown -= dt;

    if (cooldown <= 0) {
      if (shouldIncrementIndex) {
        textIndex = (textIndex + 1) % texts.length;
        one.textContent = texts[textIndex % texts.length];
        two.textContent = texts[(textIndex + 1) % texts.length];
      }
      morphFrame();
    } else {
      cooldownFrame();
    }
  }

  animate();
}

function setupGlowCards() {
  document.addEventListener('pointermove', event => {
    document.querySelectorAll('.glow-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', (event.clientX - rect.left).toFixed(2));
      card.style.setProperty('--y', (event.clientY - rect.top).toFixed(2));
    });
  }, { passive: true });
}

function setupScrollShowcase() {
  const section = document.querySelector('.scroll-showcase');
  const card = document.getElementById('scrollCard');
  const title = document.querySelector('.scroll-showcase-title');
  if (!section || !card || !title) return;

  function update() {
    const rect = section.getBoundingClientRect();
    const progress = Math.min(Math.max((window.innerHeight - rect.top) / rect.height, 0), 1);
    const rotate = 20 - progress * 20;
    const scale = window.innerWidth <= 768
      ? .72 + progress * .18
      : 1.05 - progress * .05;
    const translate = -100 * progress;

    card.style.transform = `rotateX(${rotate}deg) scale(${scale})`;
    title.style.transform = `translateY(${translate}px)`;
  }

  window.addEventListener('scroll', update, { passive: true });
  window.addEventListener('resize', update);
  update();
}

updateCartCount();
setupCursor();
setupGooeyText();
setupGlowCards();
setupScrollShowcase();
