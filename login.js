document.getElementById("loginForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    email: document.getElementById("loginEmail").value,
    password: document.getElementById("loginPassword").value
  };

  const response = await fetch("http://localhost:8080/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.text();
  document.getElementById("loginMessage").textContent = result;

  if (result.includes("Login successful")) {
    if (result.includes("ADMIN")) {
      window.location.href = "admin-dashboard.html";
    } else {
      window.location.href = "index.html";
    }
  }
});