const CART_STORAGE_KEY = 'persona_cart';
const ORDERS_STORAGE_KEY = 'persona_test_orders';

// Paste your deployed Google Apps Script Web App URL here.
// Leave blank to test locally: orders will be stored in this browser only.
const ORDERS_ENDPOINT = '';

const checkoutItemsEl = document.getElementById('checkoutItems');
const checkoutItemsCount = document.getElementById('checkoutItemsCount');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutHeaderTotal = document.getElementById('checkoutHeaderTotal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutStatus = document.getElementById('checkoutStatus');
const cartCount = document.getElementById('cartCount');

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

function totals(cart) {
  return cart.reduce((acc, item) => {
    acc.quantity += item.quantity;
    acc.subtotal += item.price * item.quantity;
    return acc;
  }, { quantity: 0, subtotal: 0 });
}

function renderSummary() {
  const cart = readCart();
  const total = totals(cart);

  cartCount.textContent = total.quantity;
  checkoutItemsCount.textContent = total.quantity;
  checkoutSubtotal.textContent = formatMoney(total.subtotal);
  checkoutTotal.textContent = formatMoney(total.subtotal);
  checkoutHeaderTotal.textContent = formatMoney(total.subtotal);

  if (!cart.length) {
    checkoutItemsEl.innerHTML = '<p class="checkout-empty">Your cart is empty. Add products before checkout.</p>';
    checkoutForm.querySelector('button[type="submit"]').disabled = true;
    return;
  }

  checkoutItemsEl.innerHTML = cart.map(item => `
    <article class="checkout-item">
      <img src="${item.image}" alt="${item.name}" />
      <div>
        <h3>${item.name}</h3>
        <p>Size ${item.size} | Qty ${item.quantity}</p>
        <p>${formatMoney(item.price * item.quantity)}</p>
      </div>
    </article>
  `).join('');
}

function orderPayload(formData) {
  const cart = readCart();
  const total = totals(cart);
  const orderId = `PER-${Date.now()}`;

  return {
    orderId,
    createdAt: new Date().toISOString(),
    customer: {
      name: formData.get('name'),
      email: formData.get('email'),
      phone: formData.get('phone'),
      address: formData.get('address'),
      city: formData.get('city'),
      state: formData.get('state'),
      pincode: formData.get('pincode'),
      notes: formData.get('notes') || ''
    },
    items: cart,
    itemCount: total.quantity,
    subtotal: total.subtotal,
    total: total.subtotal,
    paymentStatus: 'Not collected - testing mode'
  };
}

async function saveOrder(order) {
  if (!ORDERS_ENDPOINT) {
    const savedOrders = JSON.parse(localStorage.getItem(ORDERS_STORAGE_KEY) || '[]');
    savedOrders.push(order);
    localStorage.setItem(ORDERS_STORAGE_KEY, JSON.stringify(savedOrders));
    return { mode: 'local-test' };
  }

  const payload = new FormData();
  payload.append('payload', JSON.stringify(order));

  await fetch(ORDERS_ENDPOINT, {
    method: 'POST',
    mode: 'no-cors',
    body: payload
  });

  return { mode: 'sheet' };
}

checkoutForm.addEventListener('submit', async event => {
  event.preventDefault();

  const cart = readCart();
  if (!cart.length) {
    checkoutStatus.textContent = 'Your cart is empty.';
    return;
  }

  const submitBtn = checkoutForm.querySelector('button[type="submit"]');
  submitBtn.disabled = true;
  checkoutStatus.textContent = 'Saving order...';

  try {
    const order = orderPayload(new FormData(checkoutForm));
    const result = await saveOrder(order);
    localStorage.removeItem(CART_STORAGE_KEY);

    if (result.mode === 'local-test') {
      checkoutStatus.textContent = `Test order ${order.orderId} saved in this browser. Add the Apps Script URL in checkout.js to save to your sheet.`;
    } else {
      checkoutStatus.textContent = `Order ${order.orderId} sent. Check your Google Sheet for the new row.`;
    }

    checkoutForm.reset();
    renderSummary();
  } catch (error) {
    checkoutStatus.textContent = 'Could not save order. Check your Apps Script deployment URL and access settings.';
    submitBtn.disabled = false;
  }
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

renderSummary();
