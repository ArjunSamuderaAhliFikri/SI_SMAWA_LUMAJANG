import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");s

// Initialize Feather icons

const token = localStorage.getItem("token");

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
    const response = await fetch(
      `https://api2.smawalmj.com/siswa/detailSiswa/${username}`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Response not ok!");
    }

    const { siswa, warn } = await response.json();

    if (warn) {
      window.location.href = "/";
    }

    hidden.value = siswa[0].username;
    nameInput.value = siswa[0].username;
    classInput.value = siswa[0].kelas;
    tapelInput.value = siswa[0].tapel;
    nomorHPInput.value = siswa[0].nomorHP;
    nisnInput.value = siswa[0].nisn;
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
      const response = await fetch("https://api2.smawalmj.com/siswa", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(dataStudent),
      });

      if (!response.ok) {
        throw new Error("Response not ok!");
      }

      const { msg, err, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) {
        return Swal.fire(err);
      }

      return Swal.fire(msg).then((result) => {
        if (result.isConfirmed) {
          window.location.href = `/pages/data_siswa.html?username=${username}`;
        }
      });
    } catch (error) {
      return console.error(error);
    }
  };

  handleEditSubmit();
});

const deleteStudent = document.getElementById("delete-data-student");

deleteStudent.addEventListener("click", () => {
  const deleteDataStudent = async () => {
    try {
      const response = await fetch(
        `https://api2.smawalmj.com/siswa/${username}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { msg, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (msg) {
        return Swal.fire(msg).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/pages/data_siswa.html";
          }
        });
      }
    } catch (error) {
      return console.error(error);
    }
  };

  deleteDataStudent();
});
