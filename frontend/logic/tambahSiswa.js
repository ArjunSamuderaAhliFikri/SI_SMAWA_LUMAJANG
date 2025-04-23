import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

const form = document.querySelector("form");
const tahunPelajaran = document.querySelector('select[id="tahun-pelajaran"]');
const kelasSiswa = document.querySelector('select[id="kelas-siswa"]');

document.addEventListener("DOMContentLoaded", () => {
  async function handleRetrieveClassStudent() {
    try {
      const response = await fetch("http://localhost:3000/kelas_siswa");

      if (response.ok) {
        const { kelasSiswaData, err } = await response.json();

        const { kelas } = kelasSiswaData[0];

        if (err) {
          return alert(err);
        }

        kelas.forEach((kelas) => {
          const optionElement = document.createElement("option");
          optionElement.setAttribute("value", kelas);
          optionElement.innerHTML = kelas;

          kelasSiswa.appendChild(optionElement);
        });
      }
    } catch (error) {
      return console.error(
        `Gagal untuk melakukan pengambilan data kelas, ${error.message}`
      );
    }
  }

  handleRetrieveClassStudent();
});

document.addEventListener("DOMContentLoaded", () => {
  async function getTapel() {
    try {
      const response = await fetch("http://localhost:3000/tapel");

      if (response.ok) {
        const { tapel } = await response.json();

        tapel.forEach((tapel) => {
          const optionElement = document.createElement("option");
          optionElement.setAttribute("value", tapel);
          optionElement.innerHTML = tapel;

          tahunPelajaran.appendChild(optionElement);
        });
      }
    } catch (error) {
      return console.error(
        `Gagal untuk melakukan pengambilan data tapel, ${error.message}`
      );
    }
  }

  getTapel();
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fileImage = document.querySelector('input[type="file"]');
  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;
  const nomorHP = document.querySelector('input[type="number"]').value;

  try {
    if (!username || !password || !nomorHP) {
      return Swal.fire("harus di isi!");
    }

    const response = await fetch("http://localhost:3000/tambah_siswa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "siswa",
        username,
        password,
        nomorHP,
        kelas: kelasSiswa.value,
        tapel: tahunPelajaran.value,
      }),
    });

    if (response.ok) {
      //   message
      const { err } = await response.json();

      if (err) {
        return Swal.fire("Siswa sudah terdaftar!");
      }

      Swal.fire("berhasil didaftarkan!");
    } else {
      return Swal.fire("error!");
    }
  } catch (error) {
    return console.error(`Error Message : ${error.message}`);
  } finally {
    window.location.href("/frontend/pages/admin/dashboard.html");
  }
});
