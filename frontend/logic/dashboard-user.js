import convertRupiah from "../features/convertRupiah/convertRupiah.js";

const toRupiah = convertRupiah;

const nameStudent = localStorage.getItem("username");
const tbody = document.querySelector("tbody");

document.addEventListener("DOMContentLoaded", () => {
  async function handleRetrieveDataUser() {
    try {
      const response = await fetch(
        `http://localhost:3000/tagihan/${nameStudent}`
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { findBilling } = await response.json();

      const highlightBilling = findBilling.slice(0, 4);

      highlightBilling.forEach((data) => {
        const trElement = document.createElement("tr");

        trElement.innerHTML = generateTdElement(
          data.catatanSiswa,
          toRupiah(data.jumlahTagihanSiswa),
          data.isPaidOff,
          data.deadline,
          data.isPaidOn,
          data.rekeningTujuan
        );

        tbody.appendChild(trElement);
      });
    } catch (error) {
      return console.error(error);
    }
  }

  handleRetrieveDataUser();
});

document.addEventListener("DOMContentLoaded", () => {
  const adminName = document.getElementById("admin-name");

  adminName.innerHTML = nameStudent;
});

const logoutSection = document.getElementById("logout-section");
const logoutButton = document.getElementById("logout");
const buttonAboutUser = document.getElementById("about-user");

logoutButton.addEventListener("click", () => {
  localStorage.clear();

  Swal.fire({
    title: "Yakin Meninggalkan Halaman?",
    text: "Tekan Keluar Untuk Meninggalkan Halaman",
    icon: "Warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Keluar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/frontend/pages/auth/login.html";
    }
  });
});

buttonAboutUser.addEventListener("click", () => {
  logoutSection.classList.toggle("-translate-y-56");
});

function generateTdElement(
  deskripsiPembayaran,
  tanggalPembayaran,
  statusPembayaran,
  deadline,
  isPaidOn,
  rekeningTujuan
) {
  function convertDateTime(date) {
    // 29-04-2025 -> 29 April 2025

    let seperateDate = date.split("-");

    switch (seperateDate[1]) {
      case "01": {
        // karena array dalam javascript itu mutable (bisa dirubah nilainya)
        seperateDate[1] = "Januari";
        break;
      }
      case "02": {
        seperateDate[1] = "Februari";
        break;
      }
      case "03": {
        seperateDate[1] = "Maret";
        break;
      }
      case "04": {
        seperateDate[1] = "April";
        break;
      }
      case "05": {
        seperateDate[1] = "Mei";
        break;
      }
      case "06": {
        seperateDate[1] = "Juni";
        break;
      }
      case "07": {
        seperateDate[1] = "Juli";
        break;
      }
      case "08": {
        seperateDate[1] = "Agustus";
        break;
      }
      case "09": {
        seperateDate[1] = "September";
        break;
      }
      case "10": {
        seperateDate[1] = "Oktober";
        break;
      }
      case "11": {
        seperateDate[1] = "November";
        break;
      }
      case "12": {
        seperateDate[1] = "Desember";
        break;
      }
    }

    return seperateDate.join(" ");
  }

  const isDeadline = convertDateTime(deadline);

  return `
  <td class="py-4 px-4 border-b font-medium text-slate-500" id="${deskripsiPembayaran}">
  <div class="flex items-center gap-4 xl:w-auto w-[300px]">
  <i class="fa-solid fa-money-check-dollar text-slate-800 text-xl"></i>
  <div>
  <span class="xl:text-md text-sm" id="deskripsi-pembayaran">${deskripsiPembayaran}</span>
  ${
    statusPembayaran == "Tuntas"
      ? `<p class='xl:text-xs text-[10px] text-emerald-600'>Telah Dibayar Pada : ${isPaidOn} || <i class="fa-solid fa-circle-check"></i> Tuntas</p>`
      : `${
          isPaidOn
            ? `<p class='xl:text-xs text-[10px] text-yellow-300'>Telah Dibayar Pada : ${isPaidOn}</p>`
            : `<p class='xl:text-xs text-[10px] text-red-400'>Mohon Lakukan Transaksi Sebelum : ${isDeadline}</p>`
        }`
  }
  
  </div>
  </div>
  </td>
  <td class="px-4 border-b text-xs font-semibold text-slate-500 text-center ml-7">${rekeningTujuan}</td>
<td class="px-4 border-b text-sm font-semibold text-slate-500 text-center"><div></div><span class="inline-block">${tanggalPembayaran}</span></td>
<td class="py-4 px-4 border-b text-md font-semibold ${
    statusPembayaran == "Tuntas"
      ? "text-emerald-500"
      : statusPembayaran == "Belum Tuntas"
      ? "text-red-500"
      : "text-yellow-500"
  } text-center">
  <div class="xl:text-md text-xs flex items-center gap-2 justify-center">
  ${
    statusPembayaran == "Tuntas"
      ? '<i class="fa-solid fa-circle-check text-xl"></i>'
      : statusPembayaran == "Belum Tuntas"
      ? '<i class="fa-solid fa-circle-xmark text-xl"></i>'
      : '<i class="fa-solid fa-hourglass-start text-xl"></i>'
  }<span>${statusPembayaran}</span>
  </div>
  </td>`;
}
