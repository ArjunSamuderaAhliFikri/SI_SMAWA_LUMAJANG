import verifyUser from "../secret/verifyUser.js";
import convertRupiah from "../features/convertRupiah/convertRupiah.js";

const toRupiah = convertRupiah;

// verifyUser("/frontend/pages/auth/login.html");

const wrapperMedia = document.getElementById("wrapper-media");

document.addEventListener("DOMContentLoaded", () => {
  const retrieveMedia = async () => {
    try {
      const response = await fetch("http://localhost:3000/media", {
        method: "GET",
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { data } = await response.json();

      data.forEach((media) => {
        const { title, description, image, datePost } = media;

        const listItem = generateListMedia(title, description, image, datePost);

        wrapperMedia.appendChild(listItem);
      });
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveMedia();
});

const tableBody = document.querySelector("tbody");

document.addEventListener("DOMContentLoaded", () => {
  async function retrieveDataPayment() {
    const response = await fetch("http://localhost:3000/tagihan-siswa");

    if (!response.ok) {
      return console.log("Response not ok!");
    }

    const { tagihan } = await response.json();

    const setLimitData = 3;

    // karena data terbaru ditempatkan di urutan yang paling bawah, maka sebelum kita ambil datanya kita reverse dulu untuk mendapatkan data terbaru!
    const showData = tagihan.reverse().slice(0, 3);

    showData.forEach((data) => {
      const trElement = document.createElement("tr");
      trElement.setAttribute("class", "cursor-pointer hover:bg-slate-300");

      const tdElement = generateTdElement(
        data.namaSiswa,
        data.kelasSiswa,
        data.tapelSiswa,
        data.jumlahTagihanSiswa,
        data.createdAt,
        data.isPaidOff,
        data.catatanSiswa,
        data.verifiedBy,
        data.isPaidOn
      );

      trElement.innerHTML = tdElement;

      tableBody.appendChild(trElement);
    });
  }

  retrieveDataPayment();
});

const buttonAboutUser = document.getElementById("about-user");
const logoutSection = document.getElementById("logout-section");
const logoutButton = document.getElementById("logout");

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
  logoutSection.classList.toggle("-translate-y-52");
});

function generateListMedia(title, description, image, dateTime) {
  const hyperLink = document.createElement("a");
  hyperLink.setAttribute(
    "class",
    "group relative max-w-[320px] h-[225px] overflow-hidden rounded-lg transition-all duration-150 hover:scale-105 after:content-[''] after:block after:absolute after:top-0 after:left-0 after:size-full after:bg-gradient-to-t after:from-slate-800/75 after:to-transparent cursor-pointer after:transition-all after:duration-300 after:translate-y-full hover:after:translate-y-0"
  );

  hyperLink.setAttribute(
    "href",
    `/frontend/pages/pusat_informasi/topic-admin.html?title=${title}`
  );
  const html = `<li class="block size-full">
                  <img
                    class="block size-full object-cover"
                    src="/frontend/public/img/mediaPost/${image}"
                    alt="${image}"
                  />

                  <div
                    class="absolute bottom-3 left-2 px-2 py-1 translate-y-full transition-all duration-500 group-hover:translate-y-0 z-10"
                  >
                  <h1 class="text-slate-200 font-medium text-lg capitalize">${title.substring(
                    0,
                    32
                  )} ${title.length > 32 ? "..." : ""}</h1>
                    <p class="text-slate-300 text-xs mt-1 capitalize">${description.substring(
                      0,
                      128
                    )} ${
    description.length > 128 ? " Baca Selengkapnya..." : ""
  }</p>
  <div class="mt-2 text-xs font-normal text-slate-200">${dateTime}</div>  
                  </div>
                </li>`;

  hyperLink.innerHTML = html;

  return hyperLink;
}

function generateTdElement(
  name,
  kelas,
  tapel,
  jumlahTagihan,
  createdAt,
  statusPembayaran,
  deskripsiPembayaran,
  verifiedBy,
  isPaidOn
) {
  return `<td class="py-4 px-4 border-b w-auto">
      <div class="flex items-center gap-8 w-[375px] xl:w-auto">
      <div class="size-8 rounded-full overflow-hidden">
        <img
          class="block size-full object-cover"
          src="/frontend/public/img/default-profile.jpeg"
          alt="user"
        />
      </div>
      <div>
      <div class="flex items-center justify-start gap-3">
      <span id="nama-siswa" class="xl:text-[14px] text-[11px] font-semibold text-slate-600"
        >${name}</span>
      ${
        statusPembayaran == "Tuntas"
          ? `<div class="flex items-center gap-2 xl:text-xs text-[11px] text-emerald-600 font-medium">
              <i class="fa-solid fa-certificate text-sm"></i>
              <p>Di Verifikasi Oleh ${verifiedBy}</p>
            </div>`
          : ""
      }
      </div>
        <div class="flex items-center justify-start gap-1 xl:mt-1 mt-2 ${
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
        <p class="xl:text-xs text-[9px] font-medium"><span id="deskripsi-pembayaran">${deskripsiPembayaran}</span> <span id="status-pembayaran">${statusPembayaran}</span> || <span class="text-slate-600" id="waktu-pembayaran"><i class="fa-solid fa-clock"></i> Dibayar pada : ${isPaidOn}</span></p>
        </div>
      </div></div>
    </td>
    <td
      class="py-4 xl:px-4 border-b text-sm font-semibold text-slate-500 w-auto"
    ><div class="w-28 text-center mx-auto">${kelas}</div>
    </td>
     <td
      class="py-4 border-b text-sm font-semibold text-slate-500 text-center"
    >
    <div class="w-28 mx-auto text-center">${tapel}</div>
    </td>  
    <td
      class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center"
      data-realnominal="${jumlahTagihan}"
    >${toRupiah(jumlahTagihan)}</td>
    <td
      class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center"
    >
    <div class="w-44 mx-auto text-center">${createdAt}</div>
    </td>
    `;
}

// document.addEventListener("DOMContentLoaded", async () => {
//   try {
//     const response = await fetch("http://localhost:3000/test-auth", {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer",
//       },
//     });

//     if (!response.ok) return console.log("gagal!");

//     const data = await response.json();

//     return console.log(data);
//   } catch (error) {
//     return console.error(error);
//   }
// });

// const token = localStorage.getItem("token");

// const deleteToken = setInterval(() => {
//   localStorage.removeItem("token");
// }, 2000);

// window.addEventListener("beforeunload", () => {
//   clearInterval(deleteToken);
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   if (!token) {
//     return (window.location.href = "/frontend/pages/auth/login.html");
//   }

//   try {
//     const response = await fetch(`http://localhost:3000/get-verify/${token}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer Token",
//       },
//     });
//     if (!response.ok) {
//       return alert("Gagal mendapatkan data verifikasi!");
//     }

//     const { role, status } = await response.json();

//     console.log({ role, status });
//   } catch (error) {
//     return (window.location.href = "/frontend/pages/auth/login.html");
//   }
// });

// document.addEventListener("DOMContentLoaded", async () => {
// document.cookie = "token=arjun; expires=1s";

// const getToken = document.cookie.split("=")[1];
// console.log(getToken);

// const status = localStorage.getItem("status");

// if (!status) {
// window.location.href = "/frontend/pages/auth/login.html";
// }
// });

// setTimeout(() => {
//   document.cookie = "token=; expires=0s";
// }, 3000);

// setTimeout(() => {
//   const getCookie = document.cookie.split("=")[1];
//   console.log(getCookie == "");
// }, 4000);
