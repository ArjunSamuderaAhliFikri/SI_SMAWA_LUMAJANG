import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "/features/convertRupiah/convertRupiah.js";
const toRupiah = convertRupiah;

const token = localStorage.getItem("token");
const statusAdmin = localStorage.getItem("admin");

const form = document.querySelector("form");
const selectElementClass = document.getElementById("kelas");
const optionElements = selectElementClass.querySelectorAll("option");
const catatanTagihan = document.getElementById("catatan");

const calendarDeadline = document.getElementById("deadline-tagihan-siswa");
flatpickr(calendarDeadline, {
  altInput: true,
  altFormat: "j F, Y",
  dateFormat: "d-m-Y",
});

document.addEventListener("DOMContentLoaded", () => {
  async function handleRetrieveClassStudent() {
    try {
      const response = await fetch("https://api2.smawalmj.com/kelas", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { kelas, warn } = await response.json();

        if (warn || statusAdmin !== "Super Admin") {
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
  }
  handleRetrieveClassStudent();
});

const accountNumberOptionElement = document.querySelector(
  "select[id=opsi-rekening]"
);

document.addEventListener("DOMContentLoaded", () => {
  async function retrieveDataAccountNumber() {
    try {
      const response = await fetch(
        "https://api2.smawalmj.com/account-billing",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const { accounts, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        accounts.forEach((item) => {
          const { rekening } = item;
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

const jumlahTagihanSiswa = document.querySelector("input[id=jumlah-tagihan]");

jumlahTagihanSiswa.addEventListener("change", (event) => {
  const rupiahConvertText = document.querySelector("span[id=rupiah]");

  if (!event.target.value) rupiahConvertText.textContent = "Rp. 0";

  const convertRupiah = toRupiah(event.target.value);

  rupiahConvertText.innerHTML = convertRupiah;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const jumlahTagihan = document.querySelector(
    "input[id=jumlah-tagihan]"
  ).value;

  async function handleCreateAllBilling() {
    try {
      const response = await fetch(
        "https://api2.smawalmj.com/student-payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            kelasSiswa: selectElementClass.value,
            rekeningTujuan: accountNumberOptionElement.value,
            deadline: calendarDeadline.value,
            catatanSiswa: catatanTagihan.value,
            jumlahTagihanSiswa: jumlahTagihan,
            typeofPayment: "Pembayaran SPP",
            specialKeyword: "Fitur Buat Tagihan Untuk Semua Siswa",
          }),
        }
      );

      if (response.ok) {
        const data = await response.json();

        const { msg, err, warn } = data;

        if (warn) {
          window.location.href = "/";
        }

        if (err) {
          return Swal.fire(err);
        }

        return Swal.fire(msg);
      }
    } catch (error) {
      return console.error(`Error Message : ${error.message}`);
    }
  }

  handleCreateAllBilling();
});
