import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

// Initialize Feather icons
document.addEventListener("DOMContentLoaded", function () {
  feather.replace();
});

const params = new URLSearchParams(window.location.search);
const username = params.get("username");

const form = document.querySelector("form");

const hidden = document.getElementById("hidden");
const nameInput = document.getElementById("nama");
const classInput = document.getElementById("kelas");
const tapelInput = document.getElementById("tahun_pelajaran");
const nomorHPInput = document.getElementById("nomor_hp");
const nisnInput = document.getElementById("nisn");

document.addEventListener("DOMContentLoaded", () => {
  const retrieveDetailStudent = async () => {
    const response = await fetch(`http://localhost:3000/siswa/${username}`);

    if (!response.ok) {
      throw new Error("Response not ok!");
    }

    const { siswa } = await response.json();

    hidden.value = siswa.username;
    nameInput.value = siswa.username;
    classInput.value = siswa.kelas;
    tapelInput.value = siswa.tapel;
    nomorHPInput.value = siswa.nomorHP;
    nisnInput.value = siswa.nisn;
  };

  retrieveDetailStudent();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const dataStudent = {
    hidden: hidden.value,
    username: nameInput.value,
    kelas: classInput.value,
    tapel: tapelInput.value,
    nomorHP: nomorHPInput.value,
    nisn: nisnInput.value,
  };

  const handleEditSubmit = async () => {
    try {
      const response = await fetch("http://localhost:3000/siswa", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataStudent),
      });

      if (!response.ok) {
        throw new Error("Response not ok!");
      }

      const { msg, err } = await response.json();

      if (err) {
        return Swal.fire(err);
      }

      return Swal.fire(msg).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `/frontend/pages/admin/data_siswa.html?username=${username}`;
        }
      });
    } catch (error) {
      return console.error(error);
    }
  };

  handleEditSubmit();
});
