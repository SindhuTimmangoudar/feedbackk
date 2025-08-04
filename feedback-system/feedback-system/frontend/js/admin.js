const token = localStorage.getItem("token");
const feedbackListDiv = document.getElementById("feedbackList");

// ✅ Load all feedbacks (on page load)
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


window.onload = function () {
  fetch("http://localhost:5000/api/feedback/all", {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Unauthorized or error fetching feedback");
      return res.json();
    })
    .then((feedbacks) => {
      if (feedbacks.length === 0) {
        feedbackListDiv.innerHTML = "<p>No feedback submitted yet.</p>";
        return;
      }

      const table = document.createElement("table");
      table.innerHTML = `
        <tr>
          <th>User Name</th>
          <th>Email</th>
          <th>Rating</th>
          <th>Message</th>
        </tr>
      `;

      feedbacks.forEach((fb) => {
        const row = document.createElement("tr");
        row.innerHTML = `
          <td>${fb.user?.name || "N/A"}</td>
          <td>${fb.user?.email || "N/A"}</td>
          <td>${fb.rating}</td>
          <td>${fb.message}</td>
        `;
        table.appendChild(row);
      });

      feedbackListDiv.appendChild(table);
    })
    .catch((err) => {
      feedbackListDiv.innerHTML = "<p>Error loading feedback. Please login again.</p>";
      console.error(err);
    });
};

// ✅ Export Feedback
function exportFeedback() {
  fetch("http://localhost:5000/api/feedback/export", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((res) => {
      if (!res.ok) throw new Error("Export failed");
      return res.blob();
    })
    .then((blob) => {
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "feedback_export.json";
      a.click();
      window.URL.revokeObjectURL(url);
    })
    .catch((err) => {
      alert("Failed to export feedback");
      console.error(err);
    });
}

// ✅ Logout
function logout() {
  localStorage.removeItem("token");
  localStorage.removeItem("adminName");
  window.location = "index.html"; // Redirect to login page
}
