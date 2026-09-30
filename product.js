function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  document.getElementById("cartCount").textContent = count;
}

function getSafeImage(image) {
  if (!image) return "https://via.placeholder.com/400x300?text=No+Image";

  if (image.startsWith("data:image") || image.startsWith("http")) {
    return image;
  }

  return "https://via.placeholder.com/400x300?text=No+Image";
}

function loadProduct() {
  const product = JSON.parse(localStorage.getItem("selectedProduct"));

  if (!product) {
    alert("No product found");
    window.location.href = "index.html";
    return;
  }

  document.getElementById("productName").textContent = product.name;
  document.getElementById("productCategory").textContent = product.category;
  document.getElementById("productDescription").textContent = product.description;
  document.getElementById("productPrice").textContent = product.price;
  document.getElementById("productImage").src = getSafeImage(product.image);

  const addToCartBtn = document.getElementById("addToCartBtn");

  addToCartBtn.addEventListener("click", () => {
    const cart = getCart();
    const existing = cart.find(item => item.id == product.id);

    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    saveCart(cart);
    updateCartCount();

    alert("Added to cart");
  });
}

updateCartCount();
loadProduct();