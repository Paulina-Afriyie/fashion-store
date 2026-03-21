
let cart = JSON.parse(localStorage.getItem("cart")) || [];


function addToCart(name, price) {
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


function showNotification(message) {
  const notification = document.createElement("div");
  notification.classList.add("toast");
  notification.textContent = message;

  document.body.appendChild(notification);

  setTimeout(() => {
    notification.remove();
  }, 2000);
}


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


window.onload = function () {
  updateCart();
  setupSearch();
};