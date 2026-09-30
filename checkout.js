function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

function saveOrder(orderData) {
  localStorage.setItem("latestOrder", JSON.stringify(orderData));
}

function saveDeliveryAddress(addressData) {
  localStorage.setItem("deliveryAddress", JSON.stringify(addressData));
}

function getDeliveryAddress() {
  return JSON.parse(localStorage.getItem("deliveryAddress")) || null;
}

function updateCartCount() {
  const cart = getCart();
  const count = cart.reduce((sum, item) => sum + item.quantity, 0);
  const cartCount = document.getElementById("cartCount");
  if (cartCount) cartCount.textContent = count;
}

function renderCheckoutItems() {
  const cart = getCart();

  const checkoutItems = document.getElementById("checkoutItems");
  const subtotalEl = document.getElementById("subtotal");
  const gstAmountEl = document.getElementById("gstAmount");
  const deliveryChargeEl = document.getElementById("deliveryCharge");
  const finalTotalEl = document.getElementById("finalTotal");

  const GST_RATE = 18;
  const deliveryCharge = 50;

  if (!checkoutItems || !subtotalEl || !gstAmountEl || !deliveryChargeEl || !finalTotalEl) {
    console.log("Checkout HTML elements not found");
    return;
  }

  if (cart.length === 0) {
    checkoutItems.innerHTML = `
      <div class="empty-cart">
        <h3>Your cart is empty</h3>
        <br>
        <a href="index.html" class="btn">Go Shopping</a>
      </div>
    `;
    subtotalEl.textContent = "0";
    gstAmountEl.textContent = "0";
    deliveryChargeEl.textContent = deliveryCharge;
    finalTotalEl.textContent = "0";
    return;
  }

  let subtotal = 0;

  checkoutItems.innerHTML = cart.map(item => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    const itemTotal = price * quantity;
    subtotal += itemTotal;

    return `
      <div class="checkout-item">
        <img src="${item.image}" alt="${item.name}">
        <div class="checkout-item-info">
          <h4>${item.name}</h4>
          <p>Price: ₹${price}</p>
          <p>Quantity: ${quantity}</p>
          <p>Total: ₹${itemTotal}</p>
        </div>
      </div>
    `;
  }).join("");

  const gstAmount = Math.round((subtotal * GST_RATE) / 100);
  const finalTotal = subtotal + gstAmount + deliveryCharge;

  subtotalEl.textContent = subtotal;
  gstAmountEl.textContent = gstAmount;
  deliveryChargeEl.textContent = deliveryCharge;
  finalTotalEl.textContent = finalTotal;
}

let userLatitude = "";
let userLongitude = "";

function renderSavedAddress() {
  const savedAddressBox = document.getElementById("savedAddressBox");
  const savedAddress = getDeliveryAddress();

  if (!savedAddressBox) return;

  if (!savedAddress) {
    savedAddressBox.innerHTML = "No address saved yet.";
    return;
  }

  savedAddressBox.innerHTML = `
    <strong>${savedAddress.customerName}</strong><br>
    Phone: ${savedAddress.customerPhone}<br>
    Email: ${savedAddress.customerEmail}<br>
    Address: ${savedAddress.customerAddress}<br>
    Village / City: ${savedAddress.customerVillage}<br>
    Pincode: ${savedAddress.customerPincode}<br>
    Payment Method: ${savedAddress.paymentMethod || "Not selected"}<br>
    ${
      savedAddress.latitude && savedAddress.longitude
        ? `Location: ${savedAddress.latitude}, ${savedAddress.longitude}`
        : "Location: Not captured"
    }
  `;
}

function autoFillSavedAddress() {
  const savedAddress = getDeliveryAddress();
  if (!savedAddress) return;

  const customerName = document.getElementById("customerName");
  const customerPhone = document.getElementById("customerPhone");
  const customerEmail = document.getElementById("customerEmail");
  const customerAddress = document.getElementById("customerAddress");
  const customerVillage = document.getElementById("customerVillage");
  const customerPincode = document.getElementById("customerPincode");
  const paymentMethod = document.getElementById("paymentMethod");

  if (customerName) customerName.value = savedAddress.customerName || "";
  if (customerPhone) customerPhone.value = savedAddress.customerPhone || "";
  if (customerEmail) customerEmail.value = savedAddress.customerEmail || "";
  if (customerAddress) customerAddress.value = savedAddress.customerAddress || "";
  if (customerVillage) customerVillage.value = savedAddress.customerVillage || "";
  if (customerPincode) customerPincode.value = savedAddress.customerPincode || "";
  if (paymentMethod) paymentMethod.value = savedAddress.paymentMethod || "";

  userLatitude = savedAddress.latitude || "";
  userLongitude = savedAddress.longitude || "";
}

function setupLocationButton() {
  const getLocationBtn = document.getElementById("getLocationBtn");
  const locationStatus = document.getElementById("locationStatus");

  if (!getLocationBtn) return;

  getLocationBtn.addEventListener("click", function () {
    if (!navigator.geolocation) {
      if (locationStatus) {
        locationStatus.textContent = "Geolocation is not supported by your browser.";
      }
      return;
    }

    if (locationStatus) {
      locationStatus.textContent = "Fetching current location...";
    }

    navigator.geolocation.getCurrentPosition(
      function (position) {
        userLatitude = position.coords.latitude;
        userLongitude = position.coords.longitude;

        if (locationStatus) {
          locationStatus.textContent = `Location captured: ${userLatitude}, ${userLongitude}`;
        }
      },
      function (error) {
        if (locationStatus) {
          locationStatus.textContent = "Unable to fetch location. Please allow location access.";
        }
        console.error("Location error:", error);
      }
    );
  });
}

const checkoutForm = document.getElementById("checkoutForm");

if (checkoutForm) {
  checkoutForm.addEventListener("submit", function (e) {
    e.preventDefault();

    const cart = getCart();

    if (cart.length === 0) {
      alert("Your cart is empty");
      return;
    }

    const paymentMethodValue = document.getElementById("paymentMethod").value;

    if (!paymentMethodValue) {
      alert("Please select a payment method");
      return;
    }

    const addressData = {
      customerName: document.getElementById("customerName").value.trim(),
      customerPhone: document.getElementById("customerPhone").value.trim(),
      customerEmail: document.getElementById("customerEmail").value.trim(),
      customerAddress: document.getElementById("customerAddress").value.trim(),
      customerVillage: document.getElementById("customerVillage").value.trim(),
      customerPincode: document.getElementById("customerPincode").value.trim(),
      paymentMethod: paymentMethodValue,
      latitude: userLatitude,
      longitude: userLongitude
    };

    saveDeliveryAddress(addressData);
    renderSavedAddress();

    const orderData = {
      ...addressData,
      items: cart,
      subtotal: Number(document.getElementById("subtotal").textContent),
      gstAmount: Number(document.getElementById("gstAmount").textContent),
      deliveryCharge: Number(document.getElementById("deliveryCharge").textContent),
      finalTotal: Number(document.getElementById("finalTotal").textContent),
      orderDate: new Date().toLocaleString()
    };

    if (paymentMethodValue === "UPI" || paymentMethodValue === "Card") {
      alert("Online payment gateway will be integrated here. For now, order is saved as demo.");
    }

    saveOrder(orderData);
    localStorage.removeItem("cart");
    window.location.href = "order-success.html";
  });
}

updateCartCount();
renderCheckoutItems();
renderSavedAddress();
autoFillSavedAddress();
setupLocationButton();