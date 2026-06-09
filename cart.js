const CART_STORAGE_KEY = 'persona_cart';
const cartItemsEl = document.getElementById('cartItems');
const cartCountEl = document.getElementById('cartCount');
const cartHeaderTotal = document.getElementById('cartHeaderTotal');
const summaryItems = document.getElementById('summaryItems');
const summarySubtotal = document.getElementById('summarySubtotal');
const summaryTotal = document.getElementById('summaryTotal');
const checkoutLink = document.getElementById('checkoutLink');
const cartToast = document.getElementById('cartToast');

function formatMoney(value) {
  return `Rs. ${value.toLocaleString('en-IN')}`;
}

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  renderCart();
}

function totals(cart) {
  return cart.reduce((acc, item) => {
    acc.quantity += item.quantity;
    acc.subtotal += item.price * item.quantity;
    return acc;
  }, { quantity: 0, subtotal: 0 });
}

function showToast(message) {
  cartToast.textContent = message;
  cartToast.classList.add('show');
  setTimeout(() => cartToast.classList.remove('show'), 1800);
}

function emptyCartMarkup() {
  return `
    <div class="empty-cart">
      <p class="summary-label">Cart Empty</p>
      <h2>No stories selected yet.</h2>
      <p>Pick your designs, choose sizes, and they will appear here.</p>
      <a class="summary-btn" href="shop.html">Shop the Drop</a>
    </div>
  `;
}

function cartItemMarkup(item, index) {
  return `
    <article class="cart-item" data-index="${index}">
      <img src="${item.image}" alt="${item.name}" />
      <div class="cart-item-info">
        <p class="product-universe">${item.universe}</p>
        <h3>${item.name}</h3>
        <p>Size: <strong>${item.size}</strong></p>
        <p>${formatMoney(item.price)} each</p>
      </div>
      <div class="qty-control" aria-label="Quantity controls">
        <button class="qty-btn" data-action="decrease" type="button">-</button>
        <input class="qty-input" type="number" min="1" max="99" value="${item.quantity}" />
        <button class="qty-btn" data-action="increase" type="button">+</button>
      </div>
      <p class="line-total">${formatMoney(item.price * item.quantity)}</p>
      <button class="remove-btn" type="button">Remove</button>
    </article>
  `;
}

function renderCart() {
  const cart = readCart();
  const total = totals(cart);

  cartCountEl.textContent = total.quantity;
  cartHeaderTotal.textContent = formatMoney(total.subtotal);
  summaryItems.textContent = total.quantity;
  summarySubtotal.textContent = formatMoney(total.subtotal);
  summaryTotal.textContent = formatMoney(total.subtotal);

  checkoutLink.classList.toggle('disabled-link', cart.length === 0);
  checkoutLink.setAttribute('aria-disabled', cart.length === 0 ? 'true' : 'false');

  if (!cart.length) {
    cartItemsEl.innerHTML = emptyCartMarkup();
    return;
  }

  cartItemsEl.innerHTML = cart.map(cartItemMarkup).join('');
  cartItemsEl.querySelectorAll('.cart-item').forEach(itemEl => {
    const index = Number(itemEl.dataset.index);
    const input = itemEl.querySelector('.qty-input');

    itemEl.querySelector('[data-action="decrease"]').addEventListener('click', () => {
      const cart = readCart();
      cart[index].quantity = Math.max(1, cart[index].quantity - 1);
      writeCart(cart);
      showToast('Cart updated');
    });

    itemEl.querySelector('[data-action="increase"]').addEventListener('click', () => {
      const cart = readCart();
      cart[index].quantity += 1;
      writeCart(cart);
      showToast('Cart updated');
    });

    input.addEventListener('change', () => {
      const cart = readCart();
      cart[index].quantity = Math.max(1, Number(input.value) || 1);
      writeCart(cart);
      showToast('Cart updated');
    });

    itemEl.querySelector('.remove-btn').addEventListener('click', () => {
      const cart = readCart();
      cart.splice(index, 1);
      writeCart(cart);
      showToast('Removed from cart');
    });
  });
}

checkoutLink.addEventListener('click', event => {
  if (!readCart().length) event.preventDefault();
});

const dot = document.getElementById('cursor-dot');
const ring = document.getElementById('cursor-ring');
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

document.querySelectorAll('a, button, input, textarea').forEach(el => {
  el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
  el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
});

renderCart();
