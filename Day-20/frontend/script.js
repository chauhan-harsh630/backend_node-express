const Backend_URL = "http://localhost:5000";

/* =========================
   REGISTER
========================= */

const register = document.getElementById("registerform");

if (register) {
  register.addEventListener("submit", async (e) => {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;

    try {
      const res = await fetch(`${Backend_URL}/api/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ name, email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Registered successfully");
        window.location.href = "login.html";
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Registration failed");
    }
  });
}


/* =========================
   LOGIN
========================= */

const loginform = document.getElementById("loginform");

if (loginform) {
  loginform.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("loginEmail").value;
    const password = document.getElementById("loginPassword").value;

    try {
      const res = await fetch(`${Backend_URL}/api/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include",
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      console.log(data);

      if (res.ok) {
        alert("Login successful");
        window.location.href = "profile.html";
      } else {
        alert(data.message);
      }

    } catch (error) {
      console.error(error);
      alert("Login failed");
    }
  });
}


/* =========================
   PROFILE
========================= */

const profile = document.getElementById("profileData");

if (profile) {
  fetch(`${Backend_URL}/api/auth/profile`, {
    method: "GET",
    credentials: "include",
  })
    .then(res => res.json())
    .then(data => {
      console.log(data);

      if (data.user) {
        profile.innerHTML = `
          <p><strong>Name:</strong> ${data.user.name}</p>
          <p><strong>Email:</strong> ${data.user.email}</p>
        `;
      } else {
        alert("Not authorized. Please login.");
        window.location.href = "login.html";
      }
    })
    .catch(err => {
      console.error(err);
      window.location.href = "login.html";
    });
}


/* =========================
   LOGOUT
========================= */

const logoutBtn = document.getElementById("logoutBtn");

if (logoutBtn) {
  logoutBtn.addEventListener("click", async () => {
    await fetch(`${Backend_URL}/api/auth/logout`, {
      method: "POST",
      credentials: "include",
    });

    window.location.href = "login.html";
  });
}