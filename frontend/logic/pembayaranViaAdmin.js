import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import convertToRupiah from "/frontend/features/convertRupiah/convertRupiah.js";

import port from "../secret/port.js";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

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
      const response = await fetch(`${port}/student-payments/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch data");
      }

      const { siswa, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      studentName.value = siswa[0].namaSiswa;
      studentClass.value = siswa[0].kelasSiswa;

      if (siswa[0].isPaidOff === "Tuntas") {
        billingStatus.textContent = siswa[0].isPaidOff;

        nominalPayment.value = siswa[0].jumlahTagihanSiswa;
        nominalPayment.disabled = true;

        submitButton.disabled = true;

        monitoringHistoryPayment.classList.replace(
          "bg-slate-700",
          "bg-emerald-500"
        );
      }

      isBilling.textContent = convertToRupiah(
        siswa[0].jumlahTagihanSiswa.toString()
      );

      if (siswa[0].image) {
        img.setAttribute("src", `${port}/test/${siswa[0].image}`);
        img.classList.replace("hidden", "block");
      }
    } catch (error) {
      return console.error(error.message);
    }
  };

  const historyPaymentViaAdmin = async () => {
    try {
      const response = await fetch(`${port}/history-payment-via-admin/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { payments, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (payments) {
        payments.forEach((payment) => {
          const { nominal, createdAt } = payment;

          const generateListPayment = generateListItem(createdAt, nominal);

          wrapperListHistoryPayment.prepend(generateListPayment);
        });
      }
    } catch (error) {
      return console.error(error);
    }
  };

  retriveDetailPayment();

  historyPaymentViaAdmin();
});

form.addEventListener("submit", async (event) => {
  event.preventDefault();

  try {
    const formData = new FormData();
    formData.append("avatar", input.files[0]);

    const response = await fetch(
      `${port}/student-payments/via-admin-with-photo/${id}/${studentName.value}/${nominalPayment.value}`,
      {
        method: "PUT",
        body: formData,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!response.ok) {
      throw new Error("Gagal memperbarui data");
    }

    const { msg, warn, image } = await response.json();

    if (image) {
      window.location.href = image;
      return;
    }

    if (warn) {
      window.location.href = "/";
    }

    setTimeout(() => {
      Swal.fire(msg).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/pages/pantau_siswa.html";
        }
      });
    }, 500);
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
