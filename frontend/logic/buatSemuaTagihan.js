import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "../features/convertRupiah/convertRupiah.js";
const toRupiah = convertRupiah;

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
      const response = await fetch("http://localhost:3000/kelas_siswa");

      if (response.ok) {
        const { kelasSiswaData } = await response.json();
        const { kelas } = kelasSiswaData[0];

        kelas.forEach((item) => {
          const option = document.createElement("option");

          option.setAttribute("value", item);
          option.innerHTML = item;

          selectElementClass.appendChild(option);
        });
      }
    } catch (error) {
      return alert(`Error Message : ${error.message}`);
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
      const response = await fetch("http://localhost:3000/nomor-rekening");

      if (response.ok) {
        const { accounts } = await response.json();

        accounts.forEach((item) => {
          const option = document.createElement("option");

          option.setAttribute("value", item.accountNumber);
          option.innerHTML = item.accountNumber;

          accountNumberOptionElement.appendChild(option);
        });
      }
    } catch (error) {
      return alert(error);
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
      const response = await fetch("http://localhost:3000/buat-semua-tagihan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kelasTagihan: selectElementClass.value,
          rekeningTujuan: accountNumberOptionElement.value,
          deadline: calendarDeadline.value,
          catatanTagihan: catatanTagihan.value,
          jumlahTagihanSiswa: jumlahTagihan,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const { msg, err } = data;

        if (err) {
          return alert(err);
        }

        alert(msg);
      }
    } catch (error) {
      alert(`Error Message : ${error.message}`);
    }
  }

  handleCreateAllBilling();
});
