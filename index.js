
// ----------------------------
// LOGIN FORM HANDLER
// ----------------------------
const loginForm = document.getElementById("loginForm");

if (loginForm) {
  loginForm.addEventListener("submit", function(e) {
    e.preventDefault();

    // Set login state
    localStorage.setItem("isLoggedIn", "true");

    alert("Login successful!");
    window.location.href = "shop.html"; // redirect to shop page
  });
}

// ----------------------------
// CART HANDLER WITH LOGIN CHECK
// ----------------------------
let cart = JSON.parse(localStorage.getItem("cart")) || [];

function addToCart(name, price) {
  const isLoggedIn = localStorage.getItem("isLoggedIn");

  if (!isLoggedIn) {
    alert("Please login first before you can purchase products.");
    window.location.href = "login.html"; // redirect to login page
    return;
  }

  const existingItem = cart.find(item => item.name === name);

  if (existingItem) {
    existingItem.quantity += 1;
  } else {
    cart.push({ name, price, quantity: 1 });
  }

  saveCart();
  updateCart();
  showNotification(name + " added to cart");
}

// ----------------------------
// CART FUNCTIONS
// ----------------------------
function removeItem(index) {
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function saveCart() {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCart() {
  const cartItems = document.getElementById("cart-items");
  const totalDisplay = document.getElementById("total");
  const count = document.getElementById("cart-count");

  if (!cartItems || !totalDisplay || !count) return;

  cartItems.innerHTML = "";
  let total = 0;

  cart.forEach((item, index) => {
    total += item.price * item.quantity;

    cartItems.innerHTML += `
      <li>
        ${item.name} - $${item.price} x ${item.quantity}
        <button onclick="removeItem(${index})">❌</button>
      </li>
    `;
  });

  totalDisplay.textContent = "$" + total;
  count.textContent = cart.length;
}

// ----------------------------
// NOTIFICATIONS
// ----------------------------
function showNotification(message) {
  const notification = document.createElement("div");
  notification.classList.add("toast");
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}

// ----------------------------
// SEARCH FUNCTIONALITY
// ----------------------------
function searchProducts() {
  const input = document.getElementById("search").value.toLowerCase();
  const products = document.querySelectorAll(".card");

  products.forEach(product => {
    const text = product.textContent.toLowerCase();

    if (text.includes(input)) {
      product.style.display = "block";
    } else {
      product.style.display = "none";
    }
  });
}

function setupSearch() {
  const searchInput = document.getElementById("search");

  if (!searchInput) return;

  searchInput.addEventListener("keypress", function (e) {
    if (e.key === "Enter") {
      e.preventDefault(); 
      searchProducts();
    }
  });

  searchInput.addEventListener("input", function () {
    searchProducts();
  });
}

// Handle search icon click
const searchBtn = document.getElementById("search-btn");

if (searchBtn) {
  searchBtn.addEventListener("click", function() {
    searchProducts(); // calls your existing function
  });
}

// ----------------------------
// LOGOUT BUTTON HANDLER
// ----------------------------
const logoutBtn = document.getElementById("logout-btn");

function checkLoginState() {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  
  if (logoutBtn) {
    logoutBtn.style.display = isLoggedIn ? "block" : "none";
  }

  const loginLinks = document.querySelectorAll(".login-btn");
  loginLinks.forEach(link => {
    if (isLoggedIn) {
      link.style.display = "none"; // hide login link if logged in
    } else {
      link.style.display = "block"; // show login link if not logged in
    }
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", function() {
    localStorage.removeItem("isLoggedIn"); // clear login state
    alert("You have been logged out.");
    checkLoginState(); // update header
    window.location.href = "index.html"; // optional: redirect to home
  });
}

// ----------------------------
// INITIALIZE ON PAGE LOAD
// ----------------------------
window.onload = function () {
  updateCart();
  setupSearch();
  checkLoginState();
};