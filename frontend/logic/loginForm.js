const form = document.getElementById("login-form");
const buttonsOptionLogin = document.querySelectorAll('button[id="opsi-login"]');

buttonsOptionLogin.forEach((button) => {
  button.addEventListener("click", () => {
    buttonsOptionLogin.forEach((button) => {
      button.removeAttribute("disabled");
      button.classList.remove("disabled:bg-slate-400");
    });

    button.setAttribute("disabled", "true");
    button.classList.add("disabled:bg-slate-400");
    setRole = button.innerHTML.toLowerCase();
  });
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();
  const username = document.querySelector('input[name="username"]').value;
  const password = document.querySelector('input[name="password"]').value;

  try {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (!response.ok) {
      return console.log("Response not ok!");
    }

    const { role, admin, siswa, token, err } = await response.json();

    if (err) {
      return Swal.fire(err);
    }

    if (role == "Siswa") {
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      localStorage.setItem("siswa", siswa[0].username);
      localStorage.setItem("id", siswa[0].id);

      window.location.href = "/frontend/pages/dashboard_user.html";
    } else {
      localStorage.setItem("role", role);
      localStorage.setItem("token", token);
      localStorage.setItem("admin", admin);

      window.location.href = "/frontend/pages/dashboard.html";
    }
  } catch (error) {
    Swal.fire(error.message);
  }
});
