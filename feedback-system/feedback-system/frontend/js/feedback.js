const base = "http://localhost:5000/api/feedback";

function submitFeedback() {
  const token = localStorage.getItem("token");
  const message = document.getElementById("message").value;
  const rating = document.getElementById("rating").value;

  fetch(base, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ message,rating }),
  })
    .then(res => res.json())
    .then(res => {
      alert("Feedback submitted!");
      document.getElementById("message").value = "";
    });
}

function logout() {
  localStorage.removeItem("token");
  window.location = "index.html";
}
