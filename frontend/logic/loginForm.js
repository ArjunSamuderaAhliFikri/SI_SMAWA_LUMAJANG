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
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });

    if (response.ok) {
      const data = await response.json();
      const { status, role, username, infoKelas, token } = data.user;
      localStorage.setItem("token", data.token);

      if (role == "admin") {
        localStorage.setItem("status", status);

        window.location.href = "/frontend/pages/admin/dashboard.html";
      } else {
        localStorage.setItem("status", "Siswa");
        localStorage.setItem("username", username);
        localStorage.setItem("kelas", infoKelas);

        window.location.href = "/frontend/pages/user/dashboard_user.html";
      }
    } else {
      console.log("error bro");
      window.location.href = "#";
    }
  } catch (error) {
    console.error(error);
  }
});
