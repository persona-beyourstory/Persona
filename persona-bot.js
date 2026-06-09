const personaBotAnswers = [
  {
    keys: ['size', 'fit', 'oversized', 'measurement'],
    answer: 'Most Persona tees are oversized streetwear fit. If you like a regular fit, choose one size down. If you like the drop-shoulder look, pick your normal size.'
  },
  {
    keys: ['payment', 'pay', 'upi', 'cod', 'checkout'],
    answer: 'Place the order request first. We will get in touch with payment details soon after checking your order.'
  },
  {
    keys: ['delivery', 'shipping', 'ship', 'days'],
    answer: 'Delivery timing depends on your city. Share your address during checkout and we will confirm the expected delivery time when we contact you.'
  },
  {
    keys: ['price', 'cost', 'rs', 'rupee'],
    answer: 'Current drop price is Rs. 799 per t-shirt.'
  },
  {
    keys: ['return', 'exchange', 'replace'],
    answer: 'For now, keep your order details ready and contact us quickly if the size or item needs attention. You can edit this policy in persona-bot.js later.'
  },
  {
    keys: ['contact', 'whatsapp', 'phone', 'email'],
    answer: 'Leave your phone and email at checkout. We will use those details to contact you about payment and confirmation.'
  },
  {
    keys: ['cart', 'quantity', 'remove', 'edit'],
    answer: 'Open the cart page to change quantity, remove items, or continue to checkout.'
  }
];

function personaBotReply(text) {
  const clean = text.toLowerCase();
  const match = personaBotAnswers.find(item => item.keys.some(key => clean.includes(key)));
  return match
    ? match.answer
    : 'I can help with sizing, payment, delivery, price, cart edits, and contact details. Ask me in simple words.';
}

function createPersonaBot() {
  const bot = document.createElement('aside');
  bot.className = 'persona-bot';
  bot.setAttribute('aria-label', 'Persona help bot');
  bot.innerHTML = `
    <div class="persona-bot-panel" role="dialog" aria-label="Persona help chat">
      <div class="persona-bot-header">
        <div>
          <h2>Persona Help</h2>
          <p>Ask before you order</p>
        </div>
        <button class="persona-bot-close" type="button" aria-label="Close help bot">X</button>
      </div>
      <div class="persona-bot-messages" aria-live="polite"></div>
      <div class="persona-bot-chips">
        <button class="persona-bot-chip" type="button">Sizing</button>
        <button class="persona-bot-chip" type="button">Payment</button>
        <button class="persona-bot-chip" type="button">Delivery</button>
      </div>
      <form class="persona-bot-form">
        <input type="text" aria-label="Ask Persona a question" placeholder="Ask about size, payment..." />
        <button type="submit">Ask</button>
      </form>
    </div>
    <button class="persona-bot-toggle" type="button" aria-label="Open Persona help bot" aria-expanded="false">
      <span class="bot-face" aria-hidden="true">
        <i class="bot-eye bot-eye-left"></i>
        <i class="bot-eye bot-eye-right"></i>
      </span>
    </button>
  `;

  document.body.appendChild(bot);

  const toggle = bot.querySelector('.persona-bot-toggle');
  const close = bot.querySelector('.persona-bot-close');
  const messages = bot.querySelector('.persona-bot-messages');
  const form = bot.querySelector('.persona-bot-form');
  const input = bot.querySelector('input');

  document.addEventListener('pointermove', event => {
    const rect = toggle.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const dx = Math.max(-4, Math.min(4, (event.clientX - cx) / 28));
    const dy = Math.max(-3, Math.min(3, (event.clientY - cy) / 34));
    toggle.style.setProperty('--eye-x', `${dx.toFixed(2)}px`);
    toggle.style.setProperty('--eye-y', `${dy.toFixed(2)}px`);
  }, { passive: true });

  function addMessage(message, who = 'bot') {
    const bubble = document.createElement('p');
    bubble.className = `persona-bot-message ${who}`;
    bubble.textContent = message;
    messages.appendChild(bubble);
    messages.scrollTop = messages.scrollHeight;
  }

  function ask(message) {
    const trimmed = message.trim();
    if (!trimmed) return;
    addMessage(trimmed, 'user');
    window.setTimeout(() => addMessage(personaBotReply(trimmed), 'bot'), 240);
  }

  toggle.addEventListener('click', () => {
    const isOpen = bot.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    if (isOpen && !messages.children.length) {
      addMessage('Hey, I am the Persona help bot. Ask about sizing, payment, delivery, or your cart.');
    }
    if (isOpen) input.focus();
  });

  close.addEventListener('click', () => {
    bot.classList.remove('open');
    toggle.setAttribute('aria-expanded', 'false');
    toggle.focus();
  });

  form.addEventListener('submit', event => {
    event.preventDefault();
    ask(input.value);
    input.value = '';
  });

  bot.querySelectorAll('.persona-bot-chip').forEach(chip => {
    chip.addEventListener('click', () => ask(chip.textContent));
  });
}

createPersonaBot();
