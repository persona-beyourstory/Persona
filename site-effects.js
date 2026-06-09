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

setupSharedGlowCards();
setupSharedHoverTargets();
