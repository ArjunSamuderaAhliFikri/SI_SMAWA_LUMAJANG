// import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "/frontend/features/convertRupiah/convertRupiah.js";

import port from "../secret/port.js";

const toRupiah = convertRupiah;
const tBody = document.querySelector("tbody");

const token = localStorage.getItem("token");

const URL = new URLSearchParams(window.location.search);
const username = URL.get("name");

document.addEventListener("DOMContentLoaded", () => {
  const aboutUser = document.getElementById("about-user");

  aboutUser.innerHTML = username;
});

document.addEventListener("DOMContentLoaded", () => {
  async function handleGetBilling() {
    try {
      const response = await fetch(
        `${port}/student-payments/by-username/${username}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        const { data } = await response.json();

        data.forEach((data) => {
          const generateTrElement = document.createElement("tr");
          generateTrElement.setAttribute(
            "class",
            "cursor-pointer hover:bg-gray-100"
          );

          generateTrElement.innerHTML = generateTdElement(
            data.id,
            data.catatanSiswa,
            toRupiah(data.jumlahTagihanSiswa),
            data.isPaidOff,
            data.deadline,
            data.isPaidOn,
            data.rekeningTujuan,
            data.typeofPayment
          );

          tBody.appendChild(generateTrElement);
        });
      }
    } catch (error) {
      return console.error(`Error Message : ${error.message}`);
    }
  }

  handleGetBilling();
});

function generateTdElement(
  id,
  deskripsiPembayaran,
  tanggalPembayaran,
  statusPembayaran,
  deadline,
  isPaidOn,
  rekeningTujuan,
  typeofPayment
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
  <td class="relative py-4 px-4 border-b font-medium text-slate-500" id="${deskripsiPembayaran}">
  <a href="/frontend/pages/konfirmasi_pembayaran.html?id=${id}" class="block h-full w-[1440px] absolute top-0 left-0 bg-transparent"></a>
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
<td class="px-4 border-b text-xs font-semibold text-slate-500 text-center ml-7">${typeofPayment}</td>
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
