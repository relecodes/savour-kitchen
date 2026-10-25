
const WHATSAPP_NUMBER = "27600000000"; // Replace with the restaurant's real number.

const products = [
  {
    id: 1,
    name: "Classic Smash Burger",
    category: "burgers",
    price: 75,
    tag: "CUSTOMER FAVOURITE",
    description: "Juicy beef, fresh lettuce, tomato and our signature sauce.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 2,
    name: "Crispy Chicken Burger",
    category: "burgers",
    price: 69,
    tag: "CRISPY & GOLDEN",
    description: "Crispy chicken, crunchy lettuce and creamy mayo.",
    image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 3,
    name: "Grilled Chicken Plate",
    category: "mains",
    price: 99,
    tag: "HEARTY MEAL",
    description: "Grilled chicken served with chips and a fresh side salad.",
    image: "https://images.unsplash.com/photo-1532550907401-a500c9a57435?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 4,
    name: "Loaded Beef Bowl",
    category: "mains",
    price: 89,
    tag: "BIG FLAVOUR",
    description: "Seasoned beef, golden chips and our house sauce.",
    image: "https://images.unsplash.com/photo-1547592180-85f173990554?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 5,
    name: "Golden Chips",
    category: "sides",
    price: 30,
    tag: "EXTRA CRUNCH",
    description: "Hot, crispy chips with a pinch of seasoning.",
    image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 6,
    name: "Chicken Wings",
    category: "sides",
    price: 55,
    tag: "SHARE OR KEEP",
    description: "Sticky, flavourful wings with a delicious glaze.",
    image: "https://images.unsplash.com/photo-1527477396000-e27163b481c2?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 7,
    name: "Fresh Lemonade",
    category: "drinks",
    price: 25,
    tag: "REFRESHING",
    description: "A refreshing citrus drink served chilled.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765edfd7?auto=format&fit=crop&w=650&q=80"
  },
  {
    id: 8,
    name: "Chocolate Milkshake",
    category: "drinks",
    price: 35,
    tag: "SWEET TREAT",
    description: "A creamy chocolate shake for your sweet tooth.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=650&q=80"
  }
];

const cart = {};

const productGrid = document.getElementById("productGrid");
const cartCount = document.getElementById("cartCount");
const cartHint = document.getElementById("cartHint");
const cartTotal = document.getElementById("cartTotal");
const checkoutBtn = document.getElementById("checkoutBtn");
const filters = document.getElementById("filters");

function formatPrice(amount) {
  return `R${amount.toFixed(2)}`;
}

function renderProducts(category = "all") {
  const visibleProducts = category === "all"
    ? products
    : products.filter(product => product.category === category);

  productGrid.innerHTML = visibleProducts.map(product => `
    <article class="product-card">
      <div class="product-photo">
        <img src="${product.image}" alt="${product.name}" loading="lazy">
        <span class="product-tag">${product.tag}</span>
      </div>
      <div class="product-info">
        <h3>${product.name}</h3>
        <p>${product.description}</p>
        <div class="product-bottom">
          <span class="product-price">${formatPrice(product.price)}</span>
          <button
            class="add-button"
            data-add="${product.id}"
            aria-label="Add ${product.name} to order"
            title="Add to order"
          >+</button>
        </div>
      </div>
    </article>
  `).join("");
}

function updateCart() {
  const items = Object.values(cart);
  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
  const totalPrice = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  cartCount.textContent = totalItems === 0
    ? "Your order is empty"
    : `${totalItems} item${totalItems === 1 ? "" : "s"} in your order`;

  cartHint.textContent = totalItems === 0
    ? "Add something delicious to get started."
    : "Ready when you are. Send your order below.";

  cartTotal.textContent = formatPrice(totalPrice);
  checkoutBtn.textContent = totalItems > 0
    ? "Order on WhatsApp ↗"
    : "Start your order ↗";
}

function addToCart(id) {
  const product = products.find(item => item.id === id);
  if (!product) return;

  if (!cart[id]) {
    cart[id] = { ...product, quantity: 0 };
  }

  cart[id].quantity += 1;
  updateCart();
}

filters.addEventListener("click", event => {
  const button = event.target.closest("[data-category]");
  if (!button) return;

  filters.querySelectorAll(".filter").forEach(filter => {
    filter.classList.toggle("active", filter === button);
  });

  renderProducts(button.dataset.category);
});

productGrid.addEventListener("click", event => {
  const button = event.target.closest("[data-add]");
  if (!button) return;

  addToCart(Number(button.dataset.add));

  button.textContent = "✓";
  window.setTimeout(() => {
    button.textContent = "+";
  }, 500);
});

checkoutBtn.addEventListener("click", () => {
  const items = Object.values(cart);

  if (items.length === 0) {
    document.getElementById("menu").scrollIntoView({ behavior: "smooth" });
    cartHint.textContent = "Choose a meal first, then come back here!";
    return;
  }

  if (!/^\d{10,15}$/.test(WHATSAPP_NUMBER)) {
    alert("Please add the restaurant's WhatsApp number in script.js first.");
    return;
  }

  const orderLines = items.map(item =>
    `${item.quantity} x ${item.name} - ${formatPrice(item.price * item.quantity)}`
  );

  const total = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  const message = [
    "Hi Savour Kitchen! I'd like to place an order:",
    "",
    ...orderLines,
    "",
    `Total: ${formatPrice(total)}`,
    "",
    "Please confirm availability and collection or delivery details."
  ].join("\n");

  const whatsappURL =
    `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

  window.open(whatsappURL, "_blank", "noopener,noreferrer");
});

const menuToggle = document.getElementById("menuToggle");
const nav = document.getElementById("nav");

menuToggle.addEventListener("click", () => {
  const isOpen = nav.classList.toggle("open");
  menuToggle.setAttribute("aria-expanded", String(isOpen));
  menuToggle.setAttribute(
    "aria-label",
    isOpen ? "Close navigation" : "Open navigation"
  );
  menuToggle.textContent = isOpen ? "✕" : "☰";
});

nav.querySelectorAll("a").forEach(link => {
  link.addEventListener("click", () => {
    nav.classList.remove("open");
    menuToggle.setAttribute("aria-expanded", "false");
    menuToggle.setAttribute("aria-label", "Open navigation");
    menuToggle.textContent = "☰";
  });
});

document.getElementById("year").textContent = new Date().getFullYear();

renderProducts();
updateCart();
