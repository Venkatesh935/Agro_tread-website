const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", function (e) {
    e.preventDefault();
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("userRole");
    alert("Logged out successfully");
    window.location.href = "login.html";
  });
}

async function loadDashboardStats() {
  try {
    const response = await fetch("http://localhost:8080/api/admin/dashboard");
    const data = await response.json();

    document.getElementById("totalProducts").textContent = data.totalProducts;
    document.getElementById("totalOrders").textContent = data.totalOrders;
    document.getElementById("totalUsers").textContent = data.totalUsers;
    document.getElementById("pendingOrders").textContent = data.pendingOrders;
  } catch (error) {
    console.error("Error loading dashboard stats:", error);
    alert("Failed to load dashboard data");
  }
}

loadDashboardStats();