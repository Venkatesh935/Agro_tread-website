const menuToggle = document.getElementById("menuToggle");
const navMenu = document.getElementById("navMenu");

if (menuToggle) {
  menuToggle.addEventListener("click", () => {
    navMenu.classList.toggle("active");
  });
}

const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const productGrid = document.getElementById("productGrid");
const noProductsMessage = document.getElementById("noProductsMessage");

function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

function getAdminProducts() {
  return JSON.parse(localStorage.getItem("adminProducts")) || [];
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);

  const cartCount = document.getElementById("cartCount");
  const cartCountDesktop = document.getElementById("cartCountDesktop");

  if (cartCount) cartCount.textContent = count;
  if (cartCountDesktop) cartCountDesktop.textContent = count;
}

function addToCart(product) {
  const cart = getCart();
  const existing = cart.find(item => item.id == product.id);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ ...product, quantity: 1 });
  }

  saveCart(cart);
  updateCartCount();
  alert(product.name + " added to cart");
}

function getSafeImage(product) {
  if (product.image && product.image.startsWith("data:image")) {
    return product.image;
  }

  if (product.image && product.image.startsWith("http")) {
    return product.image;
  }

  return "https://via.placeholder.com/400x300?text=No+Image";
}

function renderProducts(productsToRender) {
  if (!productGrid) return;

  if (productsToRender.length === 0) {
    productGrid.innerHTML = "";
    if (noProductsMessage) noProductsMessage.style.display = "block";
    return;
  }

  if (noProductsMessage) noProductsMessage.style.display = "none";

  productGrid.innerHTML = productsToRender.map(product => {
    const imageSrc = getSafeImage(product);

    return `
      <div class="product-card">
        <img src="${imageSrc}" alt="${product.name}" />
        <div class="product-info">
          <span class="product-tag">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.description}</p>
          <div class="product-bottom">
            <span class="price">₹${product.price}</span>
            <div class="product-actions">
              <button class="details-btn" onclick="viewProduct('${product.id}')">View</button>
              <button class="product-btn" onclick="handleAddToCart('${product.id}')">Add to Cart</button>
            </div>
          </div>
        </div>
      </div>
    `;
  }).join("");
}

function filterProducts() {
  const allProducts = getAdminProducts();

  if (!searchInput || !categoryFilter) {
    renderProducts(allProducts);
    return;
  }

  const searchValue = searchInput.value.toLowerCase().trim();
  const selectedCategory = categoryFilter.value.toLowerCase();

  const filteredProducts = allProducts.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchValue);
    const matchesCategory =
      selectedCategory === "all" ||
      product.category.toLowerCase() === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  renderProducts(filteredProducts);
}

function viewProduct(productId) {
  const products = getAdminProducts();
  const product = products.find(item => item.id == productId);

  if (!product) return;

  const selectedProduct = {
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    image: getSafeImage(product),
    description: product.description
  };

  localStorage.setItem("selectedProduct", JSON.stringify(selectedProduct));
  window.location.href = "product.html";
}

function handleAddToCart(productId) {
  const products = getAdminProducts();
  const product = products.find(item => item.id == productId);

  if (!product) return;

  addToCart({
    id: product.id,
    name: product.name,
    category: product.category,
    price: Number(product.price),
    image: getSafeImage(product),
    description: product.description
  });
}

if (searchInput) searchInput.addEventListener("input", filterProducts);
if (categoryFilter) categoryFilter.addEventListener("change", filterProducts);

updateCartCount();
renderProducts(getAdminProducts());