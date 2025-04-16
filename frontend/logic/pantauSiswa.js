import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "../features/convertRupiah/convertRupiah.js";
const toRupiah = convertRupiah;

const bodyOfTable = document.querySelector("tbody");
const hidden = document.getElementById("popup-hidden");
const popupNama = document.getElementById("popup-nama-siswa");
const popupKelas = document.getElementById("popup-kelas-siswa");
const popupJumlahTagihan = document.getElementById(
  "popup-jumlah-tagihan-siswa"
);

document.addEventListener("DOMContentLoaded", () => {
  async function retrieveDataStudent() {
    try {
      const response = await fetch("http://localhost:3000/tagihan-siswa");

      if (response.ok) {
        const { tagihan } = await response.json();

        tagihan.forEach((data) => {
          const createTrElement = document.createElement("tr");
          createTrElement.setAttribute(
            "class",
            "cursor-pointer hover:bg-gray-100"
          );

          createTrElement.innerHTML = generateTdElement(
            data.namaSiswa,
            data.kelasSiswa,
            data.tapelSiswa,
            data.jumlahTagihanSiswa,
            data.createdAt,
            data.isPaidOff,
            data.catatanSiswa,
            data.verifiedBy
          );

          bodyOfTable.appendChild(createTrElement);
        });
      }

      const tdElements = document.querySelectorAll("td");

      tdElements.forEach((td) => {
        td.addEventListener("click", () => {
          const popup = document.getElementById("popup-update-siswa");

          const getNameStudent = td.parentElement.querySelector(
            "span[id=nama-siswa]"
          ).textContent;
          const getStatusPembayaran = td.parentElement.querySelector(
            "span[id=status-pembayaran]"
          );
          const getClassStudent =
            td.parentElement.querySelectorAll("td")[1].textContent;
          const getBillingStudent =
            td.parentElement.querySelectorAll("td")[3].textContent;
          const getInfoBillingStudent = td.parentElement.querySelector(
            "span[id=deskripsi-pembayaran]"
          );

          window.statusPembayaran = getStatusPembayaran.textContent;
          window.deskripsiPembayaran = getInfoBillingStudent.textContent;

          // buttons
          const deleteNCancelPayment = document.getElementById(
            "delete-and-cancel-payment"
          );
          const saveNConfirmPayment = document.getElementById(
            "save-and-confirm-payment"
          );

          if (getStatusPembayaran.textContent == "Menunggu Konfirmasi") {
            popupNama.disabled = true;
            popupKelas.disabled = true;
            popupJumlahTagihan.disabled = true;

            saveNConfirmPayment.innerHTML = "Konfirmasi Tagihan";
            saveNConfirmPayment.disabled = false;
          } else if (getStatusPembayaran.textContent == "Belum Tuntas") {
            popupNama.disabled = false;
            popupKelas.disabled = false;
            popupJumlahTagihan.disabled = false;

            saveNConfirmPayment.innerHTML = "Simpan";
            saveNConfirmPayment.disabled = false;
          }

          if (getStatusPembayaran.textContent == "Menunggu Konfirmasi") {
            popupNama.disabled = true;
            popupKelas.disabled = true;
            popupJumlahTagihan.disabled = true;

            deleteNCancelPayment.innerHTML = "Tolak Tagihan";
            saveNConfirmPayment.disabled = false;
          } else if (getStatusPembayaran.textContent == "Belum Tuntas") {
            popupNama.disabled = false;
            popupKelas.disabled = false;
            popupJumlahTagihan.disabled = false;

            deleteNCancelPayment.innerHTML = "Hapus Tagihan Siswa";
            saveNConfirmPayment.disabled = false;
          } else {
            popupNama.disabled = true;
            popupKelas.disabled = true;
            popupJumlahTagihan.disabled = true;

            const wrapperEditPayment = document.getElementById(
              "wrapper-edit-payment"
            );
            saveNConfirmPayment.innerHTML = "Tuntas";
            saveNConfirmPayment.disabled = true;
          }

          hidden.value = getNameStudent;
          popupNama.value = getNameStudent;
          popupKelas.value = getClassStudent;
          popupJumlahTagihan.value = getBillingStudent;

          async function retrieveImageByData() {
            try {
              const response = await fetch(
                `http://localhost:3000/bukti-pembayaran/${encodeURIComponent(
                  getNameStudent
                )}/${encodeURIComponent(
                  getBillingStudent
                )}/${encodeURIComponent(getInfoBillingStudent.textContent)}`
              );

              if (response.ok) {
                const { image, err } = await response.json();

                const imageElement = document.getElementById(
                  "popup-bukti-pembayaran"
                );

                const wrapperImage = document.getElementById(
                  "wrapper-proof-of-payment"
                );

                // berarti jika tidak ada foto
                if (err) {
                  wrapperImage.innerHTML = "";
                  return console.log("tidak ada gambar");
                }
                console.log("ada gambar");
                const generateBillingImage = `<div class="w-full h-32 rounded-md overflow-hidden relative">
                <a href="/frontend/public/img/buktiPembayaran/${image.filename}" class="absolute top-4 right-4 text-slate-200 px-2 text-sm font-medium py-2 rounded-md bg-blue-700 hover:bg-blue-900" download="${image.filename}"><i class="fa-solid fa-download"></i> Unduh Bukti Pembayaran</a>
                  <img
                    src="/frontend/public/img/buktiPembayaran/${image.filename}"
                    id="popup-bukti-pembayaran"
                    class="block w-full h-full object-cover"
                  />
                </div>`;
                wrapperImage.innerHTML = generateBillingImage;
                return alert(image);
              }
            } catch (error) {
              return alert(error);
            }
          }

          retrieveImageByData();

          popup.classList.replace("hidden", "flex");
        });
      });
    } catch (error) {
      alert(error);
    }
  }

  retrieveDataStudent();
});

const formUpdateStudent = document.getElementById("form-update-siswa");
const formDeletedStudent = document.getElementById("form-deleted-siswa");

formDeletedStudent.addEventListener("submit", (event) => {
  event.preventDefault();

  async function deleteDataStudent() {
    try {
      const response = await fetch(
        `http://localhost:3000/delete-tagihan-siswa/${hidden.value}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.ok) {
        const { deleted } = await response.json();
        alert(`${deleted} berhasil dihapus!`);
        window.location.reload();
      }
    } catch (error) {
      alert(error);
    }
  }
  deleteDataStudent();
});

console.log(formUpdateStudent);

formUpdateStudent.addEventListener("submit", (event) => {
  event.preventDefault();

  // return console.log(window.statusPembayaran);

  // TODOOO CONFIRM VERIFICATION PAYMENT

  const currentUser = {
    namaSiswa: popupNama.value,
    kelasSiswa: popupKelas.value,
    jumlahTagihanSiswa: popupJumlahTagihan.value,
    statusPembayaran: window.statusPembayaran,
    catatanSiswa: window.deskripsiPembayaran,
  };

  async function handleConfirmPayment() {
    try {
      const response = await fetch(
        `http://localhost:3000/confirm-payment/${hidden.value}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            namaSiswa: currentUser.namaSiswa,
            kelasSiswa: currentUser.kelasSiswa,
            jumlahTagihanSiswa: currentUser.jumlahTagihanSiswa,
            statusPembayaran: currentUser.statusPembayaran,
            catatanSiswa: currentUser.catatanSiswa,
            diVerifikasiOleh: localStorage.getItem("status"),
          }),
        }
      );

      if (!response.ok) return console.log("gagal konfirmasi pembayaran!");

      const { msg, err } = await response.json();

      if (err) return console.log(err);

      return alert(msg);
    } catch (error) {
      return alert(error);
    } finally {
      window.location.reload();
    }
  }

  async function updateDataStudent() {
    try {
      const response = await fetch(
        `http://localhost:3000/update-tagihan/${hidden.value}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentUser),
        }
      );

      if (response.ok) {
        alert("Data berhasil diperbarui");
        window.location.reload();
      }
    } catch (error) {
      alert("Update data gagal!");
    }
  }

  if (window.statusPembayaran == "Menunggu Konfirmasi") {
    return handleConfirmPayment();
  }

  updateDataStudent();
});

const buttonClosePopup = document.getElementById("close-popup");

console.log(buttonClosePopup);

buttonClosePopup.addEventListener("click", () => {
  const popup = document.getElementById("popup-update-siswa");
  popup.classList.replace("flex", "hidden");
});

function generateTdElement(
  name,
  kelas,
  tapel,
  jumlahTagihan,
  createdAt,
  statusPembayaran,
  deskripsiPembayaran,
  verifiedBy
) {
  return `<td class="flex items-center gap-4 py-4 px-4 border-b">
    <div class="size-8 rounded-full overflow-hidden">
      <img
        class="block size-full object-cover"
        src="/frontend/public/img/default-profile.jpeg"
        alt="user"
      />
    </div>
    <div>
    <div class="flex items-center justify-start gap-3">
    <span id="nama-siswa" class="text-[14px] font-semibold text-slate-600"
      >${name}</span
    >
    ${
      statusPembayaran == "Tuntas"
        ? `<div class="flex items-center gap-2 text-xs text-emerald-600 font-medium">
            <i class="fa-solid fa-certificate text-sm"></i>
            <p>Di Verifikasi Oleh ${verifiedBy}</p>
          </div>`
        : ""
    }
    </div>
      <div class="flex items-center justify-start gap-1 mt-1 ${
        statusPembayaran == "Tuntas"
          ? "text-emerald-600"
          : statusPembayaran == "Menunggu Konfirmasi"
          ? "text-yellow-600"
          : "text-red-600"
      }">
      ${
        statusPembayaran == "Tuntas"
          ? '<i class="fa-solid fa-circle-check text-sm"></i>'
          : statusPembayaran == "Menunggu Konfirmasi"
          ? '<i class="fa-solid fa-hourglass-end text-sm"></i>'
          : '<i class="fa-solid fa-circle-xmark text-sm"></i>'
      }
      <p class="text-xs font-medium"><span id="deskripsi-pembayaran">${deskripsiPembayaran}</span> <span id="status-pembayaran">${statusPembayaran}</span></p>
      </div>
    </div>
  </td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center"
  >${kelas}</td>
   <td
    class="py-4 border-b text-sm font-semibold text-slate-500 text-center"
  >${tapel}</td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center"
  >${jumlahTagihan}</td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center"
  >${createdAt}</td>
  `;
}
