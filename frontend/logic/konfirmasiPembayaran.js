// module environment variables
// import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "../features/convertRupiah/convertRupiah.js";
const toRupiah = convertRupiah;

const inputNama = document.querySelector('input[id="nama"]');
const inputNominal = document.querySelector('input[id="nominal"]');
const form = document.querySelector("form");

const namaSiswa = localStorage.getItem("username");
const infoBilling = localStorage.getItem("deskripsi_pembayaran");

console.log(namaSiswa, infoBilling);

document.addEventListener("DOMContentLoaded", () => {
  const buttonBackToPage = document.getElementById("prev_page");

  buttonBackToPage.setAttribute(
    "href",
    `/frontend/pages/user/cek_tagihan.html?name=${namaSiswa}`
  );

  async function handleDetailBilling() {
    try {
      const response = await fetch(
        `http://localhost:3000/detail-tagihan/${encodeURIComponent(
          namaSiswa
        )}/${encodeURIComponent(infoBilling)}`
      );

      if (response.ok) {
        // return console.log(data);
        const { billing } = await response.json();

        inputNama.value = billing.namaSiswa;
        inputNama.disabled = true;

        inputNominal.setAttribute(
          "data-realnominal",
          billing.jumlahTagihanSiswa
        );
        inputNominal.value = toRupiah(billing.jumlahTagihanSiswa);
        inputNominal.disabled = true;
      }
    } catch (error) {
      return console.error(error);
    }
  }

  handleDetailBilling();
});

const fileImage = document.querySelector("input[type=file]");
const currentImagePayment = document.getElementById("current-image-payment");
const buttonSubmit = document.querySelector("button[type=submit]");
const checkboxPayment = document.querySelector("input[type=checkbox]");

console.log(checkboxPayment);

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

  async function handleUploadPhoto() {
    try {
      const fileInput = document.getElementById("avatar");
      const formData = new FormData();

      if (fileInput.files[0]) {
        formData.append("avatar", fileInput.files[0]);
      }

      const uploadPhoto = await fetch(
        `http://localhost:3000/upload-photo/${inputNama.value}/${inputNominal.dataset.realnominal}/${infoBilling}`,
        {
          method: "PUT",
          body: formData,
        }
      );
      if (!uploadPhoto.ok) {
        throw new Error("Response not ok!");
      }

      const { msg } = await response.json();

      if (msg) {
        Swal.fire(msg).then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
              window.location.href = `/frontend/pages/user/cek_tagihan.html/name=${namaSiswa}`;
            }, 500);
          }
        });
      }
    } catch (error) {
      return console.error(error);
    }
  }

  handleUploadPhoto();
});
