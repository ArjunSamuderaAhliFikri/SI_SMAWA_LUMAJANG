const form = document.querySelector("form");
const opsiKelas = document.querySelector('select[id="kelas"]');
let infoKelas = "X-1";

opsiKelas.addEventListener("change", (event) => {
  infoKelas = event.target.value;
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fileImage = document.querySelector('input[type="file"]');
  const username = document.querySelector('input[type="text"]').value;
  const email = document.querySelector('input[type="email"]').value;
  const password = document.querySelector('input[type="password"]').value;
  const nomorHP = document.querySelector('input[type="number"]').value;

  try {
    const response = await fetch("http://localhost:3000/tambah_siswa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "Siswa",
        username,
        email,
        password,
        nomorHP,
        infoKelas,
      }),
    });

    if (response.ok) {
      const data = await response.json();

      //   message
      alert(data.msg);
      username = "";
      email = "";
      password = "";
      nomorHP = "";
    } else {
      alert("error!");
    }
  } catch (error) {
    console.error(`Error Message : ${error.message}`);
  }
});
