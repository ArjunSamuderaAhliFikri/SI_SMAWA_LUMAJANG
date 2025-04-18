// module environment variables
import convertRupiah from "../features/convertRupiah/convertRupiah.js";
const toRupiah = convertRupiah;

const inputNama = document.querySelector('input[id="nama"]');
const inputNominal = document.querySelector('input[id="nominal"]');
const form = document.querySelector("form");

const namaSiswa = localStorage.getItem("username");
const infoBilling = localStorage.getItem("deskripsi_pembayaran");

document.addEventListener("DOMContentLoaded", () => {
  async function handleDetailBilling() {
    try {
      const response = await fetch(
        `http://localhost:3000/detail-tagihan/${encodeURIComponent(
          namaSiswa
        )}/${encodeURIComponent(infoBilling)}`
      );

      if (response.ok) {
        const { billing } = await response.json();

        inputNama.value = billing.namaSiswa;
        inputNama.disabled = true;

        inputNominal.value = billing.jumlahTagihanSiswa;
        inputNominal.disabled = true;
      }
    } catch (error) {
      alert(error);
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

      formData.append("avatar", fileInput.files[0]);
      const uploadPhoto = await fetch(
        `http://localhost:3000/upload-photo/${inputNama.value}/${inputNominal.value}/${infoBilling}`,
        {
          method: "PUT",
          body: formData,
        }
      );

      if (uploadPhoto.ok) {
        alert("Berhasil upload foto!");
      }
    } catch (error) {
      return alert(error);
    }
  }

  async function handleCompleteBilling() {
    try {
      const response = await fetch(
        `http://localhost:3000/tuntaskan-tagihan/${inputNama.value}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            namaSiswa: inputNama.value,
            jumlahTagihanSiswa: inputNominal.value,
            catatanSiswa: localStorage.getItem("deskripsi_pembayaran"),
          }),
        }
      );

      if (response.ok) {
        const { msg, err } = await response.json();

        if (err) {
          return alert(err);
        }

        if (msg) {
          handleUploadPhoto();
          alert(msg);
          window.location.href = "/frontend/pages/user/cek_tagihan.html";
        }
      }
    } catch (error) {
      return alert("update gagal");
    }
  }

  handleCompleteBilling();
});
