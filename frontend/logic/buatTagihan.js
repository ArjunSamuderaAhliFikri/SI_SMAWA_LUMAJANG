import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "../features/convertRupiah/convertRupiah.js";

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

const inputTagihanSiswa = document.getElementById("jumlah-tagihan-siswa");
const toRupiah = convertRupiah;
inputTagihanSiswa.addEventListener("change", (event) => {
  const rupiahDisplay = document.querySelector("span#rupiah");

  if (!event.target.value) {
    return (rupiahDisplay.innerHTML = "Rp.0");
  }

  const convertRupiah = toRupiah(event.target.value);

  rupiahDisplay.innerHTML = convertRupiah;
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

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("http://localhost:3000/kelas_siswa");
  try {
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
    alert(`Error Message : ${error.message}`);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  async function handleGetStudents() {
    try {
      const response = await fetch("http://localhost:3000/siswa");

      if (response.ok) {
        const data = await response.json();

        const { getAllStudents } = data;

        getAllStudents.forEach((element) => {
          let optionElement = document.createElement("option");
          const nama = element.username;

          // Untuk memasukkan nama
          optionElement.innerHTML = nama;
          optionElement.setAttribute("value", nama);

          selectElementName.appendChild(optionElement);
        });
      }
    } catch (error) {
      console.error(`Error Message : ${error.message}`);
    }
  }

  handleGetStudents();
});

selectElementName.addEventListener("change", (event) => {
  namaSiswa = event.target.value;
});

selectElementClass.addEventListener("change", (event) => {
  kelasSiswa = event.target.value;
  tapelSiswa = event.target.options[event.target.selectedIndex].dataset.tapel;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const catatanSiswa = document.getElementById("catatan").value;
  const jumlahTagihanSiswa = document.getElementById(
    "jumlah-tagihan-siswa"
  ).value;

  async function handleMakeBill() {
    try {
      const response = await fetch("http://localhost:3000/tagihan-siswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namaSiswa,
          kelasSiswa: selectElementClass.value,
          catatanSiswa,
          deadline: calendarDeadline.value,
          jumlahTagihanSiswa,
          rekeningTujuan: accountNumberOptionElement.value,
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
      alert(error.message);
    }
  }

  handleMakeBill();
});
