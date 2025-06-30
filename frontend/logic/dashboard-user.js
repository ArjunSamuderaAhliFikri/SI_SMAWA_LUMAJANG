import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import port from "../secret/port.js";

import convertRupiah from "/frontend/features/convertRupiah/convertRupiah.js";

const toRupiah = convertRupiah;

const token = localStorage.getItem("token");
const nameStudent = localStorage.getItem("siswa");

const id = localStorage.getItem("id");
const tbody = document.querySelector("tbody");

const createInformation = document.getElementById("create-information");

const navbarMobileVersion = document.getElementById("navbar-mobile-version");
const hamburgerMenu = document.getElementById("hamburger-menu");
const mobileButtonLogout = document.getElementById("mobile-button-logout");

hamburgerMenu.addEventListener("click", () => {
  if (navbarMobileVersion.classList.contains("translate-x-[150%]")) {
    hamburgerMenu.innerHTML = '<i class="fa-solid fa-xmark text-xl"></i>';
  } else {
    hamburgerMenu.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
  }
  navbarMobileVersion.classList.toggle("translate-x-[150%]");
});

mobileButtonLogout.addEventListener("click", () => {
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
      localStorage.clear();
      window.location.href = "/frontend/pages/";
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  createInformation.setAttribute(
    "href",
    `/frontend/pages/buatPostinganSiswa.html?id=${id}`
  );

  const cekTagihanSPP = document.getElementById("cek_tagihan_spp");
  cekTagihanSPP.setAttribute(
    "href",
    `/frontend/pages/cek_tagihan.html?id=${id}&name=${nameStudent}`
  );

  async function handleRetrieveDataUser() {
    try {
      const response = await fetch(
        `${port}/student-payments/by-username/${nameStudent}`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { data, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      const highlightBilling = data.slice(0, 4);

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

document.addEventListener("DOMContentLoaded", () => {
  const retrieveMedia = async () => {
    try {
      const response = await fetch(`${port}/media`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { data, warn } = await response.json();
      if (warn) {
        window.location.href = "/";
      }

      const wrapperListMedia = document.getElementById("wrapper-media");

      data.forEach((item) => {
        const { id, title, description, image, datePost } = item;

        const listMediaElement = generateListMedia(
          id,
          title,
          description,
          image,
          datePost
        );

        wrapperListMedia.appendChild(listMediaElement);
      });
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveMedia();
});

const logoutSection = document.getElementById("logout-section");
const logoutButton = document.getElementById("logout");
const buttonAboutUser = document.getElementById("about-user");

logoutButton.addEventListener("click", () => {
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
      localStorage.clear();
      window.location.href = "/frontend/pages/";
    }
  });
});

buttonAboutUser.addEventListener("click", () => {
  logoutSection.classList.toggle("-translate-y-56");
});

function generateListMedia(id, title, description, image, dateTime) {
  const hyperLink = document.createElement("a");
  hyperLink.setAttribute("href", `/frontend/pages/topic.html?id=${id}`);
  hyperLink.setAttribute(
    "class",
    "block max-w-[400px] min-h-[350px] max-h-[700px] overflow-hidden rounded-lg shadow overflow-hidden"
  );
  const html = `<li>
                  <div class="max-w-full max-h-56 overflow-hidden">
                    <img class="block size-full object-cover" src="http://localhost:3000/test/${image}" alt="informasi"/>
                  </div>

                  <div class="relative py-3 px-4">
                    <button
                      type="button"
                      class="absolute bg-slate-100 shadow-lg z-20 -top-5 right-5 px-5 py-2 rounded-full text-sm font-medium cursor-pointer hover:bg-slate-500 hover:text-slate-100 transition-all duration-150 group"
                    >
                     <i class="fa-solid fa-calendar text-slate-600 text-lg pr-2"></i> 
                     ${dateTime}
                    </button>

                    <h1 class="capitalize text-lg font-medium text-slate-600 mt-4">${title.substring(
                      0,
                      32
                    )} ${title.length > 32 ? "..." : ""}</h1>
                    <p class="capitalize text-xs font-normal text-slate-500 mt-1">${description.substring(
                      0,
                      32
                    )} ${
    description.length > 36 ? "Baca Selengkapnya..." : ""
  }</p>
                    <button
                      type="button"
                      class="w-full mt-4 bg-slate-700 px-3 py-2 font-medium text-slate-200 rounded-md text-sm cursor-pointer hover:bg-slate-900"
                    >
                      Baca Sekarang
                    </button>
                  </div>
            </li>`;

  hyperLink.innerHTML = html;

  return hyperLink;
}

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
