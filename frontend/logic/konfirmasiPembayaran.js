// module environment variables
// import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import port from "../secret/port.js";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");
const namaSiswa = localStorage.getItem("siswa");

import convertRupiah from "/frontend/features/convertRupiah/convertRupiah.js";
const toRupiah = convertRupiah;

const inputNama = document.querySelector('input[id="nama"]');
const inputNominal = document.querySelector('input[id="nominal"]');
const form = document.querySelector("form");
const imageInput = document.querySelector("input[name=avatar]");
const buttonConfirm = document.getElementById("button-confirm");
const currentImagePayment = document.getElementById("current-image-payment");

document.addEventListener("DOMContentLoaded", () => {
  const buttonBackToPage = document.getElementById("prev_page");

  buttonBackToPage.setAttribute(
    "href",
    `/frontend/pages/cek_tagihan.html?name=${namaSiswa}`
  );

  async function handleDetailBilling() {
    try {
      const response = await fetch(`${port}/student-payments/${id}`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // return console.log(data);
        const { siswa, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        if (siswa[0].image) {
          currentImagePayment.setAttribute(
            "src",
            `http://localhost:3000/test/${siswa[0].image}`
          );

          buttonConfirm.innerHTML = "Perbarui Pembayaran";
        }

        inputNama.value = siswa[0].namaSiswa;
        inputNama.disabled = true;

        inputNominal.setAttribute(
          "data-realnominal",
          siswa[0].jumlahTagihanSiswa
        );
        inputNominal.value = toRupiah(siswa[0].jumlahTagihanSiswa);
        inputNominal.disabled = true;
      }
    } catch (error) {
      return console.error(error);
    }
  }

  handleDetailBilling();
});

const fileImage = document.querySelector("input[type=file]");
const buttonSubmit = document.querySelector("button[type=submit]");
const checkboxPayment = document.querySelector("input[type=checkbox]");

fileImage.addEventListener("change", (event) => {
  const file = fileImage.files[0];

  // cek apakah file yang diupload adalah gambar
  if (file && file.type.startsWith("image/")) {
    // buat object URL untuk membaca file
    const reader = new FileReader();

    //   saat file selesai dibaca, tampilkan gambar
    reader.addEventListener("load", (event) => {
      currentImagePayment.setAttribute("src", event.target.result);
    });

    //   baca file gambar ke dalam bentuk URL
    reader.readAsDataURL(file);

    buttonSubmit.disabled = false;
    checkboxPayment.checked = true;
  } else {
    // jika bukan gambar, tampilkan pesan error
    throw new Error("File harus berupa gambar");
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleConfirmPayment() {
    try {
      const fileInput = document.getElementById("avatar");
      const formData = new FormData();

      if (fileInput.files[0]) {
        formData.append("avatar", fileInput.files[0]);
      } else {
        Swal.fire("Berhasil!");
      }

      const uploadPhoto = await fetch(
        `${port}/student-payments/confirm-payment/${id}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!uploadPhoto.ok) {
        throw new Error("Response not ok!");
      }

      const { msg, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (msg) {
        Swal.fire("msg").then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
              window.location.href = `/frontend/pages/cek_tagihan.html/name=${namaSiswa}`;
            }, 500);
          }
        });
      }
    } catch (error) {
      return console.error(error);
    }
  }

  handleConfirmPayment();
});
