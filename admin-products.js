const productForm = document.getElementById("productForm");
const productTableBody = document.getElementById("productTableBody");
const formTitle = document.getElementById("formTitle");
const cancelEditBtn = document.getElementById("cancelEditBtn");
const logoutBtn = document.getElementById("logoutBtn");

let uploadedImageBase64 = "";

function getProducts() {
  return JSON.parse(localStorage.getItem("adminProducts")) || [];
}

function saveProducts(products) {
  localStorage.setItem("adminProducts", JSON.stringify(products));
}

function resetForm() {
  productForm.reset();
  uploadedImageBase64 = "";
  document.getElementById("productId").value = "";
  document.getElementById("productGst").value = 18;
  formTitle.textContent = "Add Product";
}

function renderProducts() {
  const products = getProducts();

  if (products.length === 0) {
    productTableBody.innerHTML = `
      <tr>
        <td colspan="7" style="text-align:center;">No products available</td>
      </tr>
    `;
    return;
  }

  productTableBody.innerHTML = products.map((product, index) => `
    <tr>
      <td>${product.id}</td>
      <td>${product.name}</td>
      <td>${product.category}</td>
      <td>₹${product.price}</td>
      <td>${product.gst}%</td>
      <td>${product.stock}</td>
      <td>
        <button class="table-btn edit-btn" onclick="editProduct(${index})">Edit</button>
        <button class="table-btn delete-btn" onclick="deleteProduct(${index})">Delete</button>
      </td>
    </tr>
  `).join("");
}

function editProduct(index) {
  const products = getProducts();
  const product = products[index];

  document.getElementById("productId").value = index;
  document.getElementById("productName").value = product.name;
  document.getElementById("productCategory").value = product.category;
  document.getElementById("productPrice").value = product.price;
  document.getElementById("productGst").value = product.gst;
  document.getElementById("productStock").value = product.stock;
  document.getElementById("productDescription").value = product.description;

  uploadedImageBase64 = product.image || "";

  formTitle.textContent = "Edit Product";
  window.scrollTo({ top: 0, behavior: "smooth" });
}

function deleteProduct(index) {
  const products = getProducts();

  if (!confirm("Are you sure you want to delete this product?")) return;

  products.splice(index, 1);
  saveProducts(products);
  renderProducts();
}

const productImageFile = document.getElementById("productImageFile");

if (productImageFile) {
  productImageFile.addEventListener("change", function (e) {
    const file = e.target.files[0];

    if (!file) return;

    const reader = new FileReader();

    reader.onload = function () {
      uploadedImageBase64 = reader.result;
    };

    reader.readAsDataURL(file);
  });
}

productForm.addEventListener("submit", function (e) {
  e.preventDefault();

  const products = getProducts();
  const editIndex = document.getElementById("productId").value;

  if (editIndex === "" && !uploadedImageBase64) {
    alert("Please upload an image");
    return;
  }

  const productData = {
    id: editIndex === "" ? Date.now() : products[editIndex].id,
    name: document.getElementById("productName").value.trim(),
    category: document.getElementById("productCategory").value,
    price: Number(document.getElementById("productPrice").value),
    gst: Number(document.getElementById("productGst").value),
    stock: Number(document.getElementById("productStock").value),
    image: uploadedImageBase64,
    description: document.getElementById("productDescription").value.trim()
  };

  if (editIndex === "") {
    products.push(productData);
  } else {
    products[editIndex] = productData;
  }

  saveProducts(products);
  resetForm();
  renderProducts();

  alert("Product saved successfully");
});

cancelEditBtn.addEventListener("click", function () {
  resetForm();
});

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    alert("Logged out successfully");
    window.location.href = "login.html";
  });
}

renderProducts();