document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const data = {
    fullName: document.getElementById("fullName").value,
    email: document.getElementById("email").value,
    phone: document.getElementById("phone").value,
    password: document.getElementById("password").value,
    role: document.getElementById("role").value
  };

  const response = await fetch("http://localhost:8080/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data)
  });

  const result = await response.text();
  document.getElementById("registerMessage").textContent = result;
});