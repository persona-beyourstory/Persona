const CART_STORAGE_KEY = 'persona_cart';
const PRODUCT_PRICE = 799;

const products = [
  {
    id: 'gotham-times',
    filter: 'batman',
    image: './images/img_01.png',
    universe: 'Batman x DC',
    name: 'The Gotham Times',
    price: 'Rs. 799',
    desc: 'A newspaper front page from Gotham City. "Will the Dark Knight Rise Tonight?" - chaos scripted in newsprint.',
    tags: ['Batman', 'Joker', 'Gotham', 'Newspaper']
  },
  {
    id: 'the-batman',
    filter: 'batman',
    image: './images/img_02.png',
    universe: 'DC | 2022',
    name: 'The Batman',
    price: 'Rs. 799',
    desc: 'The bold crimson logo from the 2022 film. Bat wings carved into the letterform. Vengeance is a statement you wear.',
    tags: ['Batman', 'DC', 'Logo', 'Red']
  },
  {
    id: 'god-vs-man',
    filter: 'batman',
    image: './images/img_03.png',
    universe: 'Batman x Superman',
    name: 'God vs Man',
    price: 'Rs. 799',
    desc: 'The ultimate clash - Man of Steel against the Dark Knight. Abstract paint-splash art captures the collision of two legends.',
    tags: ['Batman', 'Superman', 'DC', 'Art']
  },
  {
    id: 'why-so-serious-geo',
    filter: 'joker',
    image: './images/img_04.png',
    universe: 'DC | Joker',
    name: 'Why So Serious? - Geo',
    price: 'Rs. 799',
    desc: 'A geometric, cubist Joker in bold colour blocks. Fractured. Unhinged. Unforgettable.',
    tags: ['Joker', 'Geometric', 'White', 'Oversized']
  },
  {
    id: 'worlds-finest',
    filter: 'batman',
    image: './images/img_05.png',
    universe: 'Batman x Superman',
    name: "World's Finest",
    price: 'Rs. 799',
    desc: 'Two silhouettes. Two cities. One shared skyline. Heroes stand back to back - emblems speak louder than words.',
    tags: ['Batman', 'Superman', 'Silhouette', 'Minimal']
  },
  {
    id: 'ha-ha-ha',
    filter: 'joker',
    image: './images/img_06.png',
    universe: 'DC | Joker',
    name: 'HA HA HA',
    price: 'Rs. 799',
    desc: 'Purple chaos. Joker silhouette surrounded by an infinite field of laughter. Batman watches from the shadows.',
    tags: ['Joker', 'Batman', 'Purple', 'Villain']
  },
  {
    id: 'why-so-serious',
    filter: 'joker',
    image: './images/img_07.png',
    universe: 'DC | Joker',
    name: 'Why So Serious?',
    price: 'Rs. 799',
    desc: "Small but savage chest print. White scrawled text and a dripping red smile - the Joker's question, always rhetorical.",
    tags: ['Joker', 'Pocket Print', 'Smile', 'Red']
  },
  {
    id: 'im-your-villain',
    filter: 'joker',
    image: './images/img_08.png',
    universe: 'DC | Joker',
    name: "I'm Your Villain",
    price: 'Rs. 799',
    desc: 'Bold distressed red type. Rough edges, broken serifs, pure attitude. Not a statement - a declaration.',
    tags: ['Joker', 'Typography', 'Red', 'Bold']
  },
  {
    id: 'jack-of-chaos',
    filter: 'loki',
    image: './images/img_09.png',
    universe: 'Marvel | Loki',
    name: 'Jack of Chaos',
    price: 'Rs. 799',
    desc: 'The God of Mischief as a playing card. Jack of Hearts - chaos always holds the winning hand.',
    tags: ['Loki', 'Marvel', 'Playing Card', 'Gold']
  },
  {
    id: 'where-am-i',
    filter: 'deadpool',
    image: './images/img_10.png',
    universe: 'Marvel | Deadpool',
    name: 'Where The F@*K Am I?',
    price: 'Rs. 799',
    desc: 'Deadpool bursts through the fourth wall - through the shirt itself. Comic-book art with a speech bubble only he would say.',
    tags: ['Deadpool', 'Comic', 'Fourth Wall', 'Funny']
  },
  {
    id: 'ironman',
    filter: 'marvel',
    image: './images/img_11.png',
    universe: 'Marvel | Tony Stark',
    name: 'IRONMAN',
    price: 'Rs. 799',
    desc: 'Vintage bootleg-style collage. Three panels. One genius. The man, the armour, the legacy in washed tones.',
    tags: ['Iron Man', 'Tony Stark', 'Vintage', 'Collage']
  },
  {
    id: 'great-responsibility',
    filter: 'marvel',
    image: './images/img_12.png',
    universe: 'Marvel | Spider-Man',
    name: 'Great Responsibility',
    price: 'Rs. 799',
    desc: 'The spider symbol with famous words woven into it. Power and responsibility - hidden inside the icon that defines a hero.',
    tags: ['Spider-Man', 'Typography', 'Red', 'Symbol']
  },
  {
    id: 'marvel',
    filter: 'marvel',
    image: './images/img_13.png',
    universe: 'Marvel Universe',
    name: 'MARVEL',
    price: 'Rs. 799',
    desc: 'The iconic red-box logo filled with line-art heroes. Every letter hides a legend.',
    tags: ['Marvel', 'Logo', 'Heroes', 'Red']
  },
  {
    id: 'best-buds',
    filter: 'deadpool',
    image: './images/img_14.png',
    universe: 'Marvel | Deadpool',
    name: 'Best Buds',
    price: 'Rs. 799',
    desc: '"Did we just become best buds?!" Wolverine says NOPE. The bromance nobody asked for in classic comic-panel style.',
    tags: ['Deadpool', 'Wolverine', 'Comic', 'Humor']
  },
  {
    id: 'hey-you-look-funny',
    filter: 'deadpool',
    image: './images/img_15.png',
    universe: 'Marvel | Deadpool',
    name: 'Hey!! You Look Funny!',
    price: 'Rs. 799',
    desc: 'Deadpool points directly at you. "Not you! YOU!" Speech bubbles popped. The Merc with a Mouth has a message.',
    tags: ['Deadpool', 'Comic', 'Pointing', 'Funny']
  },
  {
    id: 'why-so-serious-oversized',
    filter: 'joker',
    image: './images/img_16.png',
    universe: 'DC | Joker',
    name: 'Why So Serious? - Oversized',
    price: 'Rs. 799',
    desc: 'Full-back oversized statement piece. Geometric, multi-colour Joker portrait sprawling across white canvas.',
    tags: ['Joker', 'Oversized', 'White', 'Art']
  }
];

const sizes = ['XS', 'S', 'M', 'L', 'XL', '2XL'];
const shopGrid = document.getElementById('shopGrid');
const modalOverlay = document.getElementById('modalOverlay');
const modalImage = document.getElementById('modalImage');
const modalUniverse = document.getElementById('modalUniverse');
const modalTitle = document.getElementById('modalTitle');
const modalPrice = document.getElementById('modalPrice');
const modalDesc = document.getElementById('modalDesc');
const modalSizes = document.getElementById('modalSizes');
const modalTags = document.getElementById('modalTags');
const modalAddBtn = document.getElementById('modalAddBtn');
const cartToast = document.getElementById('cartToast');
const cartCount = document.getElementById('cartCount');

let selectedProduct = null;

function readCart() {
  try {
    return JSON.parse(localStorage.getItem(CART_STORAGE_KEY)) || [];
  } catch {
    return [];
  }
}

function writeCart(cart) {
  localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart));
  updateCartCount();
}

function cartQuantity() {
  return readCart().reduce((sum, item) => sum + item.quantity, 0);
}

function updateCartCount() {
  if (cartCount) cartCount.textContent = cartQuantity();
}

function showCartToast(message = 'Added to cart') {
  cartToast.textContent = message;
  cartToast.classList.add('show');
  setTimeout(() => cartToast.classList.remove('show'), 2500);
}

function addToCart(product, size) {
  if (!size) {
    showCartToast('Select a size first');
    return;
  }

  const cart = readCart();
  const existing = cart.find(item => item.id === product.id && item.size === size);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      id: product.id,
      name: product.name,
      universe: product.universe,
      image: product.image,
      size,
      price: PRODUCT_PRICE,
      quantity: 1
    });
  }

  writeCart(cart);
  showCartToast('Added to cart');
}

function productCard(product, index) {
  return `
    <article class="product-card glow-card" data-filter="${product.filter}" data-index="${index}">
      <button class="product-card-open" type="button" aria-label="View ${product.name}">
        <div class="product-card-img">
          <img src="${product.image}" alt="${product.name}" loading="lazy" />
          <span class="product-open-hint">click for details</span>
        </div>
      </button>
      <div class="product-info">
        <p class="product-universe">${product.universe}</p>
        <h3 class="product-name">${product.name}</h3>
        <p class="product-price">${product.price}</p>
        <div class="size-row">${sizes.map(size => `<button class="size-btn" type="button">${size}</button>`).join('')}</div>
        <button class="add-btn" type="button">Add to Cart</button>
      </div>
    </article>
  `;
}

function renderProducts() {
  shopGrid.innerHTML = products.map(productCard).join('');
  wireProductInteractions();
  observeCards();
  updateHoverTargets();
  updateCartCount();
}

function wireProductInteractions() {
  shopGrid.querySelectorAll('.product-card').forEach(card => {
    const index = Number(card.dataset.index);
    const product = products[index];

    card.querySelector('.product-card-open').addEventListener('click', () => openModal(index));
    card.querySelectorAll('.size-btn').forEach(btn => {
      btn.addEventListener('click', event => {
        event.stopPropagation();
        btn.closest('.size-row').querySelectorAll('.size-btn').forEach(sizeBtn => sizeBtn.classList.remove('selected'));
        btn.classList.add('selected');
      });
    });
    card.querySelector('.add-btn').addEventListener('click', event => {
      event.stopPropagation();
      const selectedSize = card.querySelector('.size-btn.selected')?.textContent;
      addToCart(product, selectedSize);
    });
  });
}

function openModal(index) {
  const product = products[index];
  selectedProduct = product;

  modalImage.src = product.image;
  modalImage.alt = product.name;
  modalUniverse.textContent = product.universe;
  modalTitle.textContent = product.name;
  modalPrice.textContent = product.price;
  modalDesc.textContent = product.desc;
  modalAddBtn.textContent = `Add to Cart - ${product.price}`;
  modalSizes.innerHTML = sizes.map(size => `<button class="modal-size-btn" type="button">${size}</button>`).join('');
  modalTags.innerHTML = product.tags.map(tag => `<span class="modal-tag">${tag}</span>`).join('');

  modalSizes.querySelectorAll('.modal-size-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      modalSizes.querySelectorAll('.modal-size-btn').forEach(sizeBtn => sizeBtn.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });

  modalOverlay.classList.add('open');
  modalOverlay.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeModal() {
  modalOverlay.classList.remove('open');
  modalOverlay.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
  selectedProduct = null;
}

function observeCards() {
  const observer = new IntersectionObserver(entries => entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('is-visible');
    }
  }), { threshold: .08 });

  shopGrid.querySelectorAll('.product-card').forEach(card => {
    card.classList.add('product-reveal');
    observer.observe(card);
  });
}

document.querySelectorAll('.filter-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.filter-btn').forEach(filterBtn => filterBtn.classList.remove('active'));
    btn.classList.add('active');
    const filter = btn.dataset.filter;
    document.querySelectorAll('.product-card').forEach(card => {
      card.style.display = filter === 'all' || card.dataset.filter === filter ? '' : 'none';
    });
  });
});

modalOverlay.addEventListener('click', event => {
  if (event.target === modalOverlay) closeModal();
});

document.getElementById('modalClose').addEventListener('click', closeModal);

document.addEventListener('keydown', event => {
  if (event.key === 'Escape' && modalOverlay.classList.contains('open')) closeModal();
});

modalAddBtn.addEventListener('click', () => {
  if (!selectedProduct) return;
  const selectedSize = modalSizes.querySelector('.modal-size-btn.selected')?.textContent;
  addToCart(selectedProduct, selectedSize);
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

function updateHoverTargets() {
  document.querySelectorAll('a, button, .product-card').forEach(el => {
    el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
    el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
  });
}

renderProducts();
