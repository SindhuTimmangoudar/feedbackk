const base = "http://localhost:5000/api/auth";

function adminLogin() {
  const data = {
    email: document.getElementById("adminEmail").value,
    password: document.getElementById("adminPassword").value,
  };

  fetch(`${base}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then((res) => res.json())
    .then((res) => {
      if (res.token && res.user.role === "admin") {
        localStorage.setItem("token", res.token);
        localStorage.setItem("adminName", res.user.name);
        window.location = "dashboard.html";
      } else {
        alert("Access denied: Not an admin");
      }
    })
    .catch((err) => {
      console.error("Login error:", err);
      alert("Login failed");
    });
}
