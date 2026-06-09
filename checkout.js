const CART_STORAGE_KEY = 'persona_cart';
const LOCAL_ORDERS_STORAGE_KEY = 'persona_saved_orders';
const LAST_ORDER_STORAGE_KEY = 'persona_last_order';
const ORDERS_ENDPOINT = window.PERSONA_ORDERS_ENDPOINT || '';

const checkoutItemsEl = document.getElementById('checkoutItems');
const checkoutItemsCount = document.getElementById('checkoutItemsCount');
const checkoutSubtotal = document.getElementById('checkoutSubtotal');
const checkoutTotal = document.getElementById('checkoutTotal');
const checkoutHeaderTotal = document.getElementById('checkoutHeaderTotal');
const checkoutForm = document.getElementById('checkoutForm');
const checkoutStatus = document.getElementById('checkoutStatus');
const cartCount = document.getElementById('cartCount');

function formatMoney(value) {
  return `Rs. ${Number(value || 0).toLocaleString('en-IN')}`;
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

function saveOrderLocally(order) {
  const savedOrders = JSON.parse(localStorage.getItem(LOCAL_ORDERS_STORAGE_KEY) || '[]');
  savedOrders.push(order);
  localStorage.setItem(LOCAL_ORDERS_STORAGE_KEY, JSON.stringify(savedOrders));
  localStorage.setItem(LAST_ORDER_STORAGE_KEY, JSON.stringify(order));
}

function jsonpRequest(params) {
  return new Promise((resolve, reject) => {
    if (!ORDERS_ENDPOINT) {
      reject(new Error('Missing order endpoint'));
      return;
    }

    const callbackName = `personaSheetCallback_${Date.now()}_${Math.floor(Math.random() * 100000)}`;
    const script = document.createElement('script');
    const timeout = window.setTimeout(() => {
      cleanup();
      reject(new Error('Sheet request timed out'));
    }, 30000);

    function cleanup() {
      window.clearTimeout(timeout);
      delete window[callbackName];
      script.remove();
    }

    window[callbackName] = response => {
      cleanup();
      response && response.ok ? resolve(response) : reject(new Error('Sheet returned an error'));
    };

    const url = new URL(ORDERS_ENDPOINT);
    Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
    url.searchParams.set('callback', callbackName);
    script.onerror = () => {
      cleanup();
      reject(new Error('Could not reach sheet endpoint'));
    };
    script.src = url.toString();
    document.body.appendChild(script);
  });
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

  return {
    orderId: `PER-${Date.now()}`,
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
    paymentStatus: 'Payment follow-up pending',
    orderStatus: 'New order request'
  };
}

async function saveOrder(order) {
  saveOrderLocally(order);

  if (!ORDERS_ENDPOINT) {
    return { ok: true, mode: 'local' };
  }

  try {
    await jsonpRequest({
      action: 'createOrder',
      payload: JSON.stringify(order)
    });
    return { ok: true, mode: 'sheet' };
  } catch {
    return { ok: true, mode: 'local-backup' };
  }
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
  checkoutStatus.textContent = 'Saving your order request...';

  const order = orderPayload(new FormData(checkoutForm));
  await saveOrder(order);

  localStorage.removeItem(CART_STORAGE_KEY);
  checkoutStatus.innerHTML = `
    <strong>Order received.</strong><br>
    Your order ID is ${order.orderId}. We will get in touch with you soon regarding payment.
  `;
  checkoutForm.reset();
  renderSummary();
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
