function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = count;
}

function renderCart() {
  const cart = getCart();
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <br>
        <a href="index.html" class="btn">Continue Shopping</a>
      </div>
    `;
    cartTotal.textContent = "0";
    return;
  }

  let total = 0;

  cartItems.innerHTML = cart.map(item => {
    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    return `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}">
        <div>
          <h3>${item.name}</h3>
          <p>${item.description}</p>
          <p><strong>Price:</strong> ₹${item.price}</p>
          <p><strong>Quantity:</strong> ${item.quantity}</p>
          <p><strong>Total:</strong> ₹${itemTotal}</p>
        </div>
        <div>
          <button class="remove-btn" onclick="removeItem('${item.id}')">Remove</button>
        </div>
      </div>
    `;
  }).join("");

  cartTotal.textContent = total;
}

function removeItem(id) {
  let cart = getCart();
  cart = cart.filter(item => item.id !== id);
  saveCart(cart);
  updateCartCount();
  renderCart();
}

document.getElementById("clearCartBtn").addEventListener("click", () => {
  localStorage.removeItem("cart");
  updateCartCount();
  renderCart();
});

updateCartCount();
renderCart();