import convertRupiah from "../features/convertRupiah/convertRupiah.js";
import verifyUser from "../secret/verifyUser.js";

import port from "../secret/port.js";

// verifyUser("/frontend/pages/auth/login.html");

const token = localStorage.getItem("token");
const statusAdmin = localStorage.getItem("admin");

let inputTagihanSiswa = 50000;

const nominalOptions = document.querySelectorAll("div[id=nominal-spp]");
nominalOptions.forEach((nominal) => {
  nominal.addEventListener("click", () => {
    nominalOptions.forEach((prevNominal) => {
      prevNominal.classList.remove("scale-90");
      prevNominal.classList.replace("bg-slate-500", "bg-slate-700");
    });
    nominal.classList.add("scale-90");
    nominal.classList.replace("bg-slate-700", "bg-slate-500");

    const nominalPayment = nominal.querySelector("h4").dataset.realnominal;
    inputTagihanSiswa = nominalPayment;
  });
});

const selectElementName = document.getElementById("nama-siswa");
const selectElementClass = document.getElementById("kelas-siswa");
const form = document.getElementById("form-buat-tagihan");
const calendarDeadline = document.getElementById("deadline-tagihan-siswa");
flatpickr(calendarDeadline, {
  altInput: true,
  altFormat: "j F, Y",
  dateFormat: "d-m-Y",
});

calendarDeadline.addEventListener("change", (event) => {
  console.log(event.target.value);
});

let namaSiswa;
let kelasSiswa = "XII-1"; // by default
let tapelSiswa = "2024/2025"; // by default

const accountNumberOptionElement = document.querySelector(
  "select[id=opsi-rekening]"
);

document.addEventListener("DOMContentLoaded", () => {
  async function retrieveDataAccountNumber() {
    try {
      const response = await fetch(`${port}/account-billing`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { accounts, warn } = await response.json();

        if (warn || statusAdmin !== "Super Admin") {
          window.location.href = "/";
        }

        accounts.forEach((item) => {
          const { id, atasNama, rekening } = item;

          const option = document.createElement("option");

          option.setAttribute("value", rekening);
          option.innerHTML = rekening;

          accountNumberOptionElement.appendChild(option);
        });
      }
    } catch (error) {
      return console.error(error);
    }
  }

  retrieveDataAccountNumber();
});

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch(`${port}/kelas`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  try {
    if (response.ok) {
      const { kelas, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      kelas.forEach((item) => {
        const { kelas } = item;

        const option = document.createElement("option");

        option.setAttribute("value", kelas);
        option.innerHTML = kelas;

        selectElementClass.appendChild(option);
      });
    }
  } catch (error) {
    return console.error(`Error Message : ${error.message}`);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  async function handleGetStudents() {
    try {
      const response = await fetch(`${port}/siswa`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { siswa, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        siswa.forEach((item) => {
          const { username } = item;
          let optionElement = document.createElement("option");

          // Untuk memasukkan nama
          optionElement.innerHTML = username;
          optionElement.setAttribute("value", username);

          selectElementName.appendChild(optionElement);
        });
      }
    } catch (error) {
      return console.error(`Error Message : ${error.message}`);
    }
  }

  handleGetStudents();
});

selectElementName.addEventListener("change", (event) => {
  namaSiswa = event.target.value;

  const retrieveClassStudent = async () => {
    try {
      const response = await fetch(
        `${port}/siswa/detailSiswa/${selectElementName.value}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { siswa } = await response.json();

      selectElementClass.disabled = true;

      selectElementClass.value = siswa[0].kelas;
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveClassStudent();
});

selectElementClass.addEventListener("change", (event) => {
  kelasSiswa = event.target.value;
  tapelSiswa = event.target.options[event.target.selectedIndex].dataset.tapel;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const catatanSiswa = document.getElementById("catatan").value;

  async function handleMakeBill() {
    try {
      const response = await fetch(`${port}/student-payments`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          namaSiswa,
          kelasSiswa: selectElementClass.value,
          catatanSiswa,
          deadline: calendarDeadline.value,
          jumlahTagihanSiswa: inputTagihanSiswa,
          rekeningTujuan: accountNumberOptionElement.value,
          typeofPayment: "Pembayaran SPP",
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { msg, err, warn } = data;

        if (warn) {
          window.location.href = "/";
        }

        if (msg) {
          return Swal.fire(msg);
        }

        return Swal.fire(err);
      }
    } catch (error) {
      return console.error(error.message);
    }
  }

  handleMakeBill();
});
