// ============================
// GLOBAL STATE
// ============================
let cart = JSON.parse(localStorage.getItem("cart")) || [];

// ============================
// HELPER FUNCTIONS
// ============================

function isLoggedIn() {
  return localStorage.getItem("isLoggedIn") === "true";
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function showNotification(message) {
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 2000);
}

// ============================
// LOGIN SYSTEM
// ============================
function handleLogin() {
  const form = document.getElementById("loginForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();

    const email = form.querySelector("input[name='email']").value.trim().toLowerCase();
    const password = form.querySelector("input[name='password']").value;

    const users = JSON.parse(localStorage.getItem("users")) || [];
    const user = users.find(u => u.email === email && u.password === password);

    if (user) {
      localStorage.setItem("isLoggedIn", "true");
      showNotification("Login successful!");
      window.location.href = "shop.html";
    } else {
      alert("Invalid email or password.");
    }
  });
}

// ============================
// LOGOUT & LOGIN STATE
// ============================
function checkLoginState() {
  const loginLinks = document.querySelectorAll(".login-btn");
  const logoutBtn = document.getElementById("logout-btn");

  if (isLoggedIn()) {
    loginLinks.forEach(link => link.style.display = "none");
    if (logoutBtn) logoutBtn.style.display = "block";
  } else {
    loginLinks.forEach(link => link.style.display = "block");
    if (logoutBtn) logoutBtn.style.display = "none";
  }
}

function handleLogout() {
  const logoutBtn = document.getElementById("logout-btn");
  if (!logoutBtn) return;

  logoutBtn.addEventListener("click", function () {
    localStorage.removeItem("isLoggedIn");
    showNotification("You have been logged out.");
    window.location.href = "index.html";
  });
}

// ============================
// SIGN-UP SYSTEM
// ============================
function handleSignUp() {
  const signForm = document.getElementById("signForm");
  if (!signForm) return;

  signForm.addEventListener("submit", function(e) {
    e.preventDefault();

    const name = signForm.querySelector("input[name='name']").value.trim();
    const email = signForm.querySelector("input[name='email']").value.trim().toLowerCase();
    const password = signForm.querySelector("input[name='password']").value;

    if (!name || !email || !password) {
      alert("Please fill all fields");
      return;
    }

    let users = JSON.parse(localStorage.getItem("users")) || [];

    if (users.find(u => u.email === email)) {
      alert("Email already registered. Please login.");
      return;
    }

    users.push({ name, email, password });
    localStorage.setItem("users", JSON.stringify(users));

    alert("Account created successfully! Please login.");
    window.location.href = "login.html";
  });
}

// ============================
// CART SYSTEM
// ============================
function addToCart(name, price) {
  if (!isLoggedIn()) {
    alert("Please login first before purchasing.");
    window.location.href = "login.html";
    return;
  }

  const item = cart.find(p => p.name.toLowerCase() === name.toLowerCase());

  if (item) {
    item.quantity++;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  updateCart();
  showNotification(`${name} added to cart`);
}

function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function clearCart() {
  cart = [];
  saveCart();
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total");
  const count = document.getElementById("cart-count");

  if (!cartItems || !totalDisplay || !count) return;

  cartItems.innerHTML = "";
  let total = 0;
  let totalItems = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;
    totalItems += item.quantity;

    const li = document.createElement("li");
    li.innerHTML = `
      ${item.name} - $${item.price} x ${item.quantity}
      <button onclick="removeItem(${index})">❌</button>
    `;
    cartItems.appendChild(li);
  });

  totalDisplay.textContent = total.toFixed(2);
  count.textContent = totalItems;
}

// ============================
// SEARCH SYSTEM
// ============================
function searchProducts() {
  const input = document.getElementById("search");
  if (!input) return;

  const value = input.value.toLowerCase();
  const products = document.querySelectorAll(".card");

  products.forEach(product => {
    const text = product.textContent.toLowerCase();
    product.style.display = text.includes(value) ? "" : "none";
  });
}

function setupSearch() {
  const input = document.getElementById("search");
  const btn = document.getElementById("search-btn");

  if (!input) return;

  input.addEventListener("input", searchProducts);

  input.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
      e.preventDefault();
      searchProducts();
    }
  });

  if (btn) btn.addEventListener("click", searchProducts);
}

// ============================
// CHECKOUT PAGE FUNCTIONS
// ============================
function loadCheckout() {
  const checkoutItems = document.getElementById("checkout-items");
  const checkoutTotal = document.getElementById("checkout-total");
  const placeOrderBtn = document.getElementById("place-order-btn");

  if (!checkoutItems || !checkoutTotal || !placeOrderBtn) return;

  // Load items from cart
  let total = 0;
  checkoutItems.innerHTML = "";
  cart.forEach(item => {
    const li = document.createElement("li");
    li.textContent = `${item.name} - $${item.price} x ${item.quantity}`;
    checkoutItems.appendChild(li);
    total += item.price * item.quantity;
  });

  checkoutTotal.textContent = total.toFixed(2);

  // Handle place order
  placeOrderBtn.addEventListener("click", () => {
    if (cart.length === 0) {
      alert("Your cart is empty.");
      return;
    }
    alert("Order placed successfully! Thank you for shopping with us.");
    clearCart();
    window.location.href = "shop.html";
  });

  function getPaymentMethod() {
  const selected = document.querySelector('input[name="payment"]:checked');

  if (!selected) {
    alert("Please select a payment method");
    return null;
  }

  return selected.value;
}

// Place order button
document.getElementById("place-order-btn").addEventListener("click", function () {
  const payment = getPaymentMethod();
  if (!payment) return;

  alert("Order placed using: " + payment);
});
}



// ============================
// INITIALIZATION
// ============================
document.addEventListener("DOMContentLoaded", function () {
  handleLogin();
  handleLogout();
  handleSignUp();
  setupSearch();
  updateCart();
  checkLoginState();
  loadCheckout(); // initialize checkout page if it exists
});

document.addEventListener("DOMContentLoaded", function () {
  const megaLink = document.querySelector(".mega-dropdown > a");

  if (megaLink) {
    megaLink.addEventListener("click", function (e) {
      if (window.innerWidth <= 768) {
        e.preventDefault();

        const parent = this.parentElement;

        // Close others (clean UX)
        document.querySelectorAll(".mega-dropdown").forEach(item => {
          if (item !== parent) {
            item.classList.remove("active");
          }
        });

        parent.classList.toggle("active");
      }
    });
  }
});