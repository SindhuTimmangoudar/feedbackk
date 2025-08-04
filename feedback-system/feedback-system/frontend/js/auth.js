const base = "http://localhost:5000/api/auth";

document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("loginForm");
  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();
      login();
    });
  }

  const registerForm = document.getElementById("registerForm");
  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();
      register();
    });
  }
});

function register() {
  const data = {
    name: document.getElementById("name").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  fetch(`${base}/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => {
      alert("Registered! Now login.");
      window.location = "index.html";
    })
    .catch(err => alert("Error: " + err.message));
}

function login() {
  const data = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
  };
  fetch(`${base}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  })
    .then(res => res.json())
    .then(res => {
      if (res.token) {
        localStorage.setItem("token", res.token);
        window.location = "feedback.html";
      } else {
        alert("Login failed");
      }
    })
    .catch(err => alert("Error: " + err.message));
}

function logout() {
  localStorage.removeItem("token");
  window.location = "index.html";
}
