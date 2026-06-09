function setupSharedGlowCards() {
  document.addEventListener('pointermove', event => {
    document.querySelectorAll('.glow-card').forEach(card => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--x', (event.clientX - rect.left).toFixed(2));
      card.style.setProperty('--y', (event.clientY - rect.top).toFixed(2));
    });
  }, { passive: true });
}

function setupSharedHoverTargets() {
  document.querySelectorAll('a, button, input, textarea, .glow-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

function setupSoftReveals() {
  const targets = document.querySelectorAll('.page-signal span, .filter-btn, .cart-item, .cart-summary, .checkout-form, .checkout-summary');
  if (!targets.length) return;

  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('is-visible');
  }), { threshold: .12 });

  targets.forEach(target => {
    target.classList.add('reveal-soft');
    observer.observe(target);
  });
}

setupSharedGlowCards();
setupSharedHoverTargets();
setupSoftReveals();
