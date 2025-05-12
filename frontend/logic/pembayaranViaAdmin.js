import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

import convertToRupiah from "../features/convertRupiah/convertRupiah.js";

const params = new URLSearchParams(window.location.search);
const getName = params.get("name");
const getDescription = params.get("description");

const input = document.querySelector('input[type="file"]');
const img = document.getElementById("preview-avatar");

const studentName = document.getElementById("nama-siswa");
const studentClass = document.getElementById("kelas-siswa");
const nominalPayment = document.getElementById("nominal-pembayaran");
const submitButton = document.getElementById("submit-button");

const billingStatus = document.getElementById("billing-status");
const isBilling = document.getElementById("billing");
const monitoringPayment = document.getElementById("rupiah");

const monitoringHistoryPayment = document.getElementById("status-payment");

const wrapperListHistoryPayment = document.getElementById(
  "wrapper-history-payment"
);

const form = document.querySelector("form");

nominalPayment.addEventListener("keyup", (event) => {
  const { value } = event.target;

  if (!value) {
    monitoringPayment.innerHTML = "Rp0";
  }

  monitoringPayment.innerHTML = convertToRupiah(value);
});

input.addEventListener("change", () => {
  // ambil file gambar
  const file = input.files[0];
  console.log(file);

  // cek apakah file yang diupload adalah gambar
  if (file && file.type.startsWith("image/")) {
    // buat object URL untuk membaca file
    const reader = new FileReader();

    //   saat file selesai dibaca, tampilkan gambar
    reader.addEventListener("load", (event) => {
      img.src = event.target.result;
    });

    //   baca file gambar ke dalam bentuk URL
    reader.readAsDataURL(file);
    img.classList.replace("hidden", "block");
  } else {
    // jika bukan gambar, tampilkan pesan error
    throw new Error("File harus berupa gambar");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const retriveDetailPayment = async () => {
    try {
      const response = await fetch(
        `http://localhost:3000/tagihan/${getName}/${getDescription}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const { findBilling } = await response.json();

      studentName.value = findBilling.namaSiswa;
      studentClass.value = findBilling.kelasSiswa;

      if (findBilling.isPaidOff === "Tuntas") {
        billingStatus.textContent = findBilling.isPaidOff;
        nominalPayment.disabled = true;

        submitButton.disabled = true;

        monitoringHistoryPayment.classList.replace(
          "bg-slate-700",
          "bg-emerald-500"
        );
      }

      isBilling.textContent = convertToRupiah(findBilling.jumlahTagihanSiswa);

      if (findBilling.uniqAccessImage) {
        img.setAttribute(
          "src",
          `/frontend/public/img/buktiPembayaran/${findBilling.uniqAccessImage}`
        );
        img.classList.replace("hidden", "block");
      }

      const historyPayment = findBilling.historyPayment;

      historyPayment.forEach((item) => {
        const listItem = generateListItem(item.datetime, item.nominal);
        wrapperListHistoryPayment.appendChild(listItem);
      });
    } catch (error) {
      return console.error(error.message);
    }
  };

  retriveDetailPayment();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData();
    if (input.files[0]) {
      formData.append("avatar", input.files[0]);
    }

    const response = await fetch(
      `http://localhost:3000/via-admin/${getName}/${getDescription}/${nominalPayment.value}`,
      {
        method: "PUT",
        body: formData,
      }
    );

    if (!response.ok) {
      throw new Error("Gagal memperbarui data");
    }

    const { msg } = await response.json();
    Swal.fire("Pembayaran Berhasil!").then((result) => {
      if (result.isConfirmed) {
        window.location.href = "/frontend/pages/admin/pantau_siswa.html";
      }
    });
  } catch (error) {
    console.error(error.message);
  }
});

function generateListItem(date, nominal) {
  const listItem = document.createElement("li");
  listItem.setAttribute("id", "wrapper-history-payment");
  listItem.setAttribute(
    "class",
    "flex justify-between items-center w-full text-slate-200 bg-slate-700 px-3 py-3 rounded-lg shadow-md"
  );
  const html = `<div class="flex items-center gap-x-3 font-medium"><i class="fa-solid fa-clock text-lg"></i><span id="date-time-billing" class="text-xs capitalize">${date}</span></div><span id="billing-nominal" class="text-xs">
  <strong>${convertToRupiah(nominal)}</strong></span>`;

  listItem.innerHTML = html;

  return listItem;
}
