/* CURSOR */
const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
let mx=0, my=0, rx=0, ry=0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  dot.style.left = mx+'px'; dot.style.top = my+'px';
});
(function ar(){ rx+=(mx-rx)*.1; ry+=(my-ry)*.1; ring.style.left=rx+'px'; ring.style.top=ry+'px'; requestAnimationFrame(ar); })();
document.querySelectorAll('a,button,.product-card,.modal-swatch').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

/* FILTER */
document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const f = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      if (f === 'all' || card.dataset.filter === f) {
        card.style.display = '';
      } else {
        card.style.display = 'none';
      }
    });
  });
});

/* SIZE SELECTION ON CARD */
function selectSize(btn, e) {
  e.stopPropagation();
  const row = btn.closest('.size-row');
  row.querySelectorAll('.size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

/* SIZE SELECTION IN MODAL */
function selectModalSize(btn) {
  const row = btn.closest('.modal-sizes');
  row.querySelectorAll('.modal-size-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');
}

/* MODAL */
let currentModal = null;
let modalDrag = false, modalSX = 0, modalAngle = 0, modalTAngle = 0, modalVel = 0;
let modalAnimFrame = null;

function openModal(index) {
  const overlay = document.getElementById('modalOverlay');
  const container = document.getElementById('modalContainer');
  
  // Hide all modals
  container.querySelectorAll('.modal').forEach(m => m.style.display = 'none');
  
  // Show target
  const target = document.getElementById('modal-' + index);
  if (target) {
    target.style.display = 'grid';
    currentModal = index;
    
    // Reset rotation
    modalAngle = 0; modalTAngle = 0; modalVel = 0;
    
    // Setup drag on mannequin
    const svgEl = document.getElementById('msvg-' + index);
    if (svgEl) {
      svgEl.addEventListener('mousedown', mDragStart);
      svgEl.addEventListener('touchstart', mTouchStart, {passive:true});
    }
    
    // Start animation
    if (modalAnimFrame) cancelAnimationFrame(modalAnimFrame);
    animateModal(index);
  }
  
  overlay.classList.add('open');
  document.body.style.overflow = 'hidden';
}

function animateModal(index) {
  const svgEl = document.getElementById('msvg-' + index);
  const designEl = document.getElementById('mdesign-' + index);
  if (!svgEl) return;
  
  if (!modalDrag) { modalVel *= .92; modalTAngle += modalVel; }
  modalAngle += (modalTAngle - modalAngle) * .12;
  
  const rad = modalAngle * Math.PI / 180;
  const cosA = Math.cos(rad);
  const scaleX = Math.max(.15, Math.abs(cosA));
  const flip = cosA < 0 ? -scaleX : scaleX;
  svgEl.style.transform = `scaleX(${flip})`;
  if (designEl) designEl.style.opacity = scaleX > .3 ? '1' : '0';
  
  modalAnimFrame = requestAnimationFrame(() => animateModal(index));
}

function mDragStart(e) {
  modalDrag = true; modalSX = e.clientX;
  document.addEventListener('mousemove', mDragMove);
  document.addEventListener('mouseup', mDragEnd);
}
function mDragMove(e) {
  if (!modalDrag) return;
  const dx = e.clientX - modalSX; modalSX = e.clientX;
  modalVel = dx; modalTAngle += dx * .7;
}
function mDragEnd() { modalDrag = false; document.removeEventListener('mousemove', mDragMove); document.removeEventListener('mouseup', mDragEnd); }
function mTouchStart(e) { modalDrag = true; modalSX = e.touches[0].clientX; }
window.addEventListener('touchmove', e => { if (!modalDrag) return; const dx = e.touches[0].clientX - modalSX; modalSX = e.touches[0].clientX; modalVel = dx; modalTAngle += dx*.7; }, {passive:true});
window.addEventListener('touchend', () => { modalDrag = false; });

function closeModal(e) {
  if (e.target === document.getElementById('modalOverlay')) {
    closeModalBtn();
  }
}
function closeModalBtn() {
  document.getElementById('modalOverlay').classList.remove('open');
  document.body.style.overflow = '';
  if (modalAnimFrame) { cancelAnimationFrame(modalAnimFrame); modalAnimFrame = null; }
  currentModal = null;
}

/* SHIRT COLOR CHANGE */
function changeShirtColor(el, index, color) {
  el.closest('.modal-colors').querySelectorAll('.modal-swatch').forEach(s => s.classList.remove('active'));
  el.classList.add('active');
  
  const svgEl = document.getElementById('msvg-' + index);
  if (!svgEl) return;
  
  // Change all shirt-colored paths (body + sleeves)
  svgEl.querySelectorAll('path').forEach(p => {
    const fill = p.getAttribute('fill');
    if (fill && (fill === '#111111' || fill === '#f5f0e8' || fill === '#2a2a2a' || fill === '#e0dbd0' || fill.startsWith('#'))) {
      const stroke = p.getAttribute('stroke');
      if (stroke && stroke.includes('201,168,76')) {
        // it's a shirt piece
        if (!stroke.includes('0.4') && !stroke.includes('0.16') && !stroke.includes('0.12')) {
          p.setAttribute('fill', color);
        }
      }
    }
  });
}

/* CART */
function addToCart(e, name) {
  e.stopPropagation();
  const toast = document.getElementById('cartToast');
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 2500);
}

/* SCROLL REVEAL */
const obs = new IntersectionObserver(es => es.forEach(e => {
  if (e.isIntersecting) { e.target.style.opacity='1'; e.target.style.transform='translateY(0)'; }
}), {threshold:.08});
document.querySelectorAll('.product-card').forEach(el => {
  el.style.opacity='0'; el.style.transform='translateY(24px)';
  el.style.transition='opacity .6s ease, transform .6s ease';
  obs.observe(el);
});
