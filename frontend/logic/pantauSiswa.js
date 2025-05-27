const params = new URLSearchParams(window.location.search);

const id = params.get("id");

import verifyUser from "../secret/verifyUser.js";
import port from "../secret/port.js";

// verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "/frontend/features/convertRupiah/convertRupiah.js";
const toRupiah = convertRupiah;

const token = localStorage.getItem("token");

const bodyOfTable = document.querySelector("tbody");
const hidden = document.getElementById("popup-hidden");
const popupNama = document.getElementById("popup-nama-siswa");
const popupKelas = document.getElementById("popup-kelas-siswa");
const popupJumlahTagihan = document.getElementById(
  "popup-jumlah-tagihan-siswa"
);

const paymentViaAdmin = document.getElementById("payment-via-admin");

let copyPayment;

const displayToRupiah = document.querySelector("span[id=to-rupiah]");

popupJumlahTagihan.addEventListener("keyup", (event) => {
  let rupiah = "";
  rupiah += toRupiah(event.target.value);
  displayToRupiah.innerHTML = rupiah;
});

const tapelFilter = document.getElementById("tapel-sorting");
const sortingKelas = document.getElementById("tingkatan_kelas");
const sortingNama = document.getElementById("tingkatan_nama");
const resetDataButton = document.getElementById("reset-data");

const updateStudent = document.getElementById("popup-update-siswa");
const closePopup = document.getElementById("close-popup");
const buktiPembayaran = document.getElementById("bukti-pembayaran");
const imagePayment = buktiPembayaran.querySelector("img");
const downloadImagePayment = document.getElementById("download-image-payment");

const confirmPayment = document.getElementById("save-and-confirm-payment");

document.addEventListener("DOMContentLoaded", () => {
  closePopup.addEventListener("click", () => {
    window.location.href = "/frontend/pages/pantau_siswa.html";
  });

  if (id) {
    paymentViaAdmin.setAttribute(
      "href",
      `/frontend/pages/pembayaranViaAdmin.html?id=${id}`
    );
    updateStudent.classList.remove("hidden");

    const retrieveDetailStudent = async () => {
      try {
        const response = await fetch(`${port}/student-payments/${id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          return console.log("Response not ok!");
        }

        const { siswa, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        if (
          siswa[0].isPaidOff == "Menunggu Konfirmasi" ||
          (siswa[0].isPaidOff == "Pembayaran Via Admin" && siswa[0].image)
        ) {
          confirmPayment.innerHTML = "Konfirmasi Tagihan";

          buktiPembayaran.classList.remove("hidden");

          imagePayment.setAttribute(
            "src",
            `http://localhost:3000/test/${siswa[0].image}`
          );

          downloadImagePayment.setAttribute(
            "href",
            `/public/img/buktiPembayaran/${siswa[0].image}`
          );

          downloadImagePayment.setAttribute("download", siswa[0].image);

          popupNama.disabled = true;
          popupKelas.disabled = true;
          popupJumlahTagihan.disabled = true;
        }

        popupNama.value = siswa[0].namaSiswa;
        popupKelas.value = siswa[0].kelasSiswa;
        popupJumlahTagihan.value = siswa[0].jumlahTagihanSiswa;

        localStorage.setItem("catatanSiswa", siswa[0].catatanSiswa);
        localStorage.setItem("statusPembayaran", siswa[0].isPaidOff);
      } catch (error) {
        return console.log(error);
      }
    };

    retrieveDetailStudent();
  }
  async function handleRetrieveTapel() {
    try {
      const response = await fetch(`${port}/tapel`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return console.log("failed to retrieve tapel!");
      }

      const { tapel, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      tapel.forEach((data) => {
        const { tapel } = data;
        const option = document.createElement("option");

        option.setAttribute("value", tapel);
        option.innerHTML = tapel;

        tapelFilter.appendChild(option);
      });
    } catch (error) {
      return console.error(error);
    }
  }
  async function retrieveDataStudent() {
    try {
      const response = await fetch(`${port}/student-payments`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { tagihan, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        // return console.log(data);

        copyPayment = [...tagihan];

        tagihan.forEach((data) => {
          const createTrElement = document.createElement("tr");
          createTrElement.setAttribute(
            "class",
            "cursor-pointer hover:bg-gray-100"
          );

          createTrElement.innerHTML = generateTdElement(
            data.id,
            data.namaSiswa,
            data.kelasSiswa,
            data.tapel,
            data.jumlahTagihanSiswa,
            data.createdAt,
            data.isPaidOff,
            data.catatanSiswa,
            data.verifiedBy,
            data.isPaidOn,
            data.typeofPayment
          );

          bodyOfTable.appendChild(createTrElement);
        });

        tagihan.forEach((data) => {
          const trElementHidden = document.createElement("tr");
          const tableBodyHidden = document.getElementById("hidden-table-body");

          const tdElementHidden = generateTdElementHidden(
            data.namaSiswa,
            data.kelasSiswa,
            data.catatanSiswa,
            data.isPaidOn,
            data.tapel,
            toRupiah(data.jumlahTagihanSiswa),
            data.typeofPayment,
            data.createdAt,
            data.isPaidOff
          );

          trElementHidden.innerHTML = tdElementHidden;
          tableBodyHidden.appendChild(trElementHidden);
        });

        sortingNama.addEventListener("change", (event) => {
          const { value } = event.target;

          const dataPayment = [...copyPayment];

          console.log(value);

          if (value == "A-Z") {
            bodyOfTable.innerHTML = "";

            const sortedByName = dataPayment.sort((a, b) =>
              a.namaSiswa.toLowerCase().localeCompare(b.namaSiswa.toLowerCase())
            );

            sortedByName.forEach((data) => {
              const trElement = document.createElement("tr");
              trElement.setAttribute(
                "class",
                "cursor-pointer hover:bg-gray-100"
              );

              const tdElement = generateTdElement(
                data.id,
                data.namaSiswa,
                data.kelasSiswa,
                data.tapel,
                data.jumlahTagihanSiswa,
                data.createdAt,
                data.isPaidOff,
                data.catatanSiswa,
                data.verifiedBy,
                data.isPaidOn,
                data.typeofPayment
              );

              trElement.innerHTML = tdElement;

              bodyOfTable.appendChild(trElement);
            });
          } else {
            bodyOfTable.innerHTML = "";

            const sortedByName = dataPayment.sort((a, b) =>
              b.namaSiswa.toLowerCase().localeCompare(a.namaSiswa.toLowerCase())
            );

            sortedByName.forEach((data) => {
              const trElement = document.createElement("tr");
              trElement.setAttribute(
                "class",
                "cursor-pointer hover:bg-gray-100"
              );

              const tdElement = generateTdElement(
                data.id,
                data.namaSiswa,
                data.kelasSiswa,
                data.tapel,
                data.jumlahTagihanSiswa,
                data.createdAt,
                data.isPaidOff,
                data.catatanSiswa,
                data.verifiedBy,
                data.isPaidOn,
                data.typeofPayment
              );

              trElement.innerHTML = tdElement;

              bodyOfTable.appendChild(trElement);
            });
          }
        });

        sortingKelas.addEventListener("change", (event) => {
          const { value } = event.target;

          const dataPayment = [...copyPayment];

          // return console.log(dataPayment);
          if (value == "10-12") {
            bodyOfTable.innerHTML = "";

            const sortedClass = dataPayment.sort(
              (a, b) => a.kelasSiswa.length - b.kelasSiswa.length
            );

            sortedClass.forEach((data) => {
              const trElement = document.createElement("tr");
              trElement.setAttribute(
                "class",
                "cursor-pointer hover:bg-gray-100"
              );

              const tdElement = generateTdElement(
                data.id,
                data.namaSiswa,
                data.kelasSiswa,
                data.tapel,
                data.jumlahTagihanSiswa,
                data.createdAt,
                data.isPaidOff,
                data.catatanSiswa,
                data.verifiedBy,
                data.isPaidOn,
                data.typeofPayment
              );

              trElement.innerHTML = tdElement;

              bodyOfTable.appendChild(trElement);
            });
          } else {
            bodyOfTable.innerHTML = "";

            const sortedClass = dataPayment.sort(
              (a, b) => b.kelasSiswa.length - a.kelasSiswa.length
            );

            sortedClass.forEach((data) => {
              const trElement = document.createElement("tr");
              trElement.setAttribute(
                "class",
                "cursor-pointer hover:bg-gray-100"
              );

              const tdElement = generateTdElement(
                data.id,
                data.namaSiswa,
                data.kelasSiswa,
                data.tapel,
                data.jumlahTagihanSiswa,
                data.createdAt,
                data.isPaidOff,
                data.catatanSiswa,
                data.verifiedBy,
                data.isPaidOn,
                data.typeofPayment
              );

              trElement.innerHTML = tdElement;

              bodyOfTable.appendChild(trElement);
            });
          }
        });

        const searchStudentInput = document.getElementById("search-student");

        searchStudentInput.addEventListener("keyup", (event) => {
          // search features
          const { value } = event.target;
          const dataPayment = [...copyPayment];

          const search = dataPayment.filter((data) =>
            data.namaSiswa.toLowerCase().includes(value.toLowerCase())
          );

          if (search.length == 0) {
            // reset table
            bodyOfTable.innerHTML = "";

            dataPayment.forEach((data) => {
              const trElement = document.createElement("tr");
              trElement.setAttribute(
                "class",
                "cursor-pointer hover:bg-gray-100"
              );

              const tdElement = generateTdElement(
                data.id,
                data.namaSiswa,
                data.kelasSiswa,
                data.tapel,
                data.jumlahTagihanSiswa,
                data.createdAt,
                data.isPaidOff,
                data.catatanSiswa,
                data.verifiedBy,
                data.isPaidOn,
                data.typeofPayment
              );

              trElement.innerHTML = tdElement;

              bodyOfTable.appendChild(trElement);
            });
            return;
          }

          bodyOfTable.innerHTML = "";

          search.forEach((data) => {
            const trElement = document.createElement("tr");
            trElement.setAttribute("class", "cursor-pointer hover:bg-gray-100");

            const tdElement = generateTdElement(
              data.id,
              data.namaSiswa,
              data.kelasSiswa,
              data.tapel,
              data.jumlahTagihanSiswa,
              data.createdAt,
              data.isPaidOff,
              data.catatanSiswa,
              data.verifiedBy,
              data.isPaidOn,
              data.typeofPayment
            );

            trElement.innerHTML = tdElement;

            bodyOfTable.appendChild(trElement);
          });
        });

        tapelFilter.addEventListener("change", (event) => {
          const sortedBy = event.target.value;
          const dataPayment = [...copyPayment];

          const filterDataByTapel = dataPayment.filter(
            (data) => data.tapel == sortedBy
          );

          if (filterDataByTapel) {
            bodyOfTable.innerHTML = "";

            filterDataByTapel.forEach((data) => {
              const trElement = document.createElement("tr");
              trElement.setAttribute(
                "class",
                "cursor-pointer hover:bg-gray-100"
              );

              const tdElement = generateTdElement(
                data.id,
                data.namaSiswa,
                data.kelasSiswa,
                data.tapel,
                data.jumlahTagihanSiswa,
                data.createdAt,
                data.isPaidOff,
                data.catatanSiswa,
                data.verifiedBy,
                data.isPaidOn,
                data.typeofPayment
              );

              trElement.innerHTML = tdElement;

              bodyOfTable.appendChild(trElement);
            });
          }
        });
      }
    } catch (error) {
      return console.error(error);
    }
  }

  handleRetrieveTapel();
  retrieveDataStudent();
});

const tableToExcelButton = document.getElementById("download-to-excel");
tableToExcelButton.addEventListener("click", () => {
  const table = document.getElementById("table-hidden");
  const table2Excel = new Table2Excel();
  table2Excel.export(table, "Rekapan Administrasi SMA Wahidiyah Kota Lumajang");
});

resetDataButton.addEventListener("click", () => {
  window.location.reload();
});

const formUpdateStudent = document.getElementById("form-update-siswa");
const formDeletedStudent = document.getElementById("form-deleted-siswa");

formDeletedStudent.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentUser = {
    namaSiswa: hidden.value,
    kelasSiswa: popupKelas.value,
    jumlahTagihanSiswa: popupJumlahTagihan.value,
    catatanSiswa: localStorage.getItem("catatanSiswa"),
    statusPembayaran: localStorage.getItem("statusPembayaran"),
  };

  async function deleteDataStudent() {
    try {
      const response = await fetch(`${port}/student-payments/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (response.ok) {
        const { msg, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        Swal.fire(msg).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/pages/admin/pantau_siswa.html";
          }
        });
      }
    } catch (error) {
      return console.error(error);
    }
  }
  deleteDataStudent();
});

formUpdateStudent.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentUser = {
    namaSiswa: popupNama.value,
    kelasSiswa: popupKelas.value,
    jumlahTagihanSiswa: popupJumlahTagihan.value,
    statusPembayaran: localStorage.getItem("statusPembayaran"),
    catatanSiswa: localStorage.getItem("catatanSiswa"),
  };

  async function handleConfirmPayment() {
    try {
      const response = await fetch(
        `${port}/student-payments/admin-confirm-payment/${id}`,
        {
          method: "PUT",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) return console.log("gagal konfirmasi pembayaran!");

      const { msg, err, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) return Swal.fire(err);

      Swal.fire(msg).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/pages/admin/pantau_siswa.html";
        }
      });
    } catch (error) {
      return console.error(error);
    }
  }

  async function updateDataStudent() {
    try {
      const response = await fetch(`${port}/student-payments/${id}`, {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(currentUser),
      });

      if (response.ok) {
        const { msg, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        Swal.fire(msg).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/pages/admin/pantau_siswa.html";
          }
        });
      }
    } catch (error) {
      return console.error(error.messsage);
    }
  }

  if (confirmPayment.innerHTML == "Konfirmasi Tagihan") {
    handleConfirmPayment();

    return;
  }

  updateDataStudent();
});

function generateTdElementHidden(
  namaSiswa,
  kelasSiswa,
  informasiPembayaran,
  dibayarPada,
  tahunPelajaran,
  nominalTagihan,
  tipePembayaran,
  tagihanDibuat,
  deadline
) {
  let printStudentClass;
  switch (kelasSiswa) {
    case "XII-1": {
      printStudentClass = "12.1";
      break;
    }
    case "XII-2": {
      printStudentClass = "12.2";
      break;
    }
    case "XII-3": {
      printStudentClass = "12.3";
      break;
    }
    case "XII-4": {
      printStudentClass = "12.4";
      break;
    }
    case "XII-5": {
      printStudentClass = "12.5";
      break;
    }
    case "XI-1": {
      printStudentClass = "11.1";
      break;
    }
    case "XI-2": {
      printStudentClass = "11.2";
      break;
    }
    case "XI-3": {
      printStudentClass = "11.3";
      break;
    }
    case "XI-4": {
      printStudentClass = "11.4";
      break;
    }
    case "XI-5": {
      printStudentClass = "11.5";
      break;
    }
    case "X-1": {
      printStudentClass = "10.1";
      break;
    }
    case "X-2": {
      printStudentClass = "10.2";
      break;
    }
    case "X-3": {
      printStudentClass = "10.3";
      break;
    }
    case "X-4": {
      printStudentClass = "10.4";
      break;
    }
    case "X-5": {
      printStudentClass = "10.5";
      break;
    }
  }
  return `<td>${namaSiswa}</td>
  <td>${printStudentClass ? printStudentClass : "-"}</td>
  <td>${tahunPelajaran}</td>
  <td>${informasiPembayaran}</td>
  <td>${tipePembayaran}</td>
  <td>${nominalTagihan}</td>
  <td>${dibayarPada == null ? "-" : dibayarPada}</td>
  <td>${deadline ? deadline : "-"}</td>
  <td>${tagihanDibuat}</td>`;
}

function generateTdElement(
  id,
  name,
  kelas,
  tapel,
  jumlahTagihan,
  createdAt,
  statusPembayaran,
  deskripsiPembayaran,
  verifiedBy,
  isPaidOn,
  typeofPayment
) {
  const html = `<td class="relative py-4 px-4 border-b w-auto">
  <a href="/frontend/pages/pantau_siswa.html?id=${id}" class="block h-full w-[1440px] absolute top-0 left-0 z-10 bg-transparent"></a>
    <div class="flex items-center gap-8 w-[375px] xl:w-[400px] 2xl:w-auto">
    <div class="size-8 rounded-full overflow-hidden">
      <img
        class="block size-full object-cover"
        src="/frontend/public/img/default-profile.jpeg"
        alt="user"
      />
    </div>
    <div>
    <div class="flex items-center justify-start gap-3">
    <span id="nama-siswa" class="2xl:text-[14px] xl:text-[12px] text-[11px] font-semibold text-slate-600"
      >${name}</span>
    ${
      statusPembayaran == "Tuntas"
        ? `<div class="hidden items-center gap-2 2xl:text-xs xl:text-[10px] text-[11px] text-emerald-600 font-medium">
            <i class="fa-solid fa-certificate text-sm"></i>
            <p>Di Verifikasi Oleh ${verifiedBy}</p>
          </div>`
        : ""
    }
    </div>
      <div class="flex items-center justify-start gap-1 xl:mt-1 mt-2 ${
        statusPembayaran == "Tuntas"
          ? "text-emerald-600"
          : statusPembayaran == "Menunggu Konfirmasi" ||
            statusPembayaran == "Pembayaran Via Admin"
          ? "text-yellow-600"
          : "text-red-600"
      }">
      ${
        statusPembayaran == "Tuntas"
          ? '<i class="fa-solid fa-circle-check text-sm"></i>'
          : statusPembayaran == "Menunggu Konfirmasi" ||
            statusPembayaran == "Pembayaran Via Admin"
          ? '<i class="fa-solid fa-hourglass-end text-sm"></i>'
          : '<i class="fa-solid fa-circle-xmark text-sm"></i>'
      }
      <p class="2xl:text-xs xl:text-[10px] text-[9px] font-medium"><span id="deskripsi-pembayaran">${deskripsiPembayaran}</span> <span id="status-pembayaran">${statusPembayaran}</span> || <span class="text-slate-600" id="waktu-pembayaran"><i class="fa-solid fa-clock"></i> Dibayar pada : ${
    isPaidOn ? isPaidOn : "-"
  }</span></p>
      </div>
    </div></div>
  </td>
  <td
    class="py-4 xl:px-4 border-b text-sm xl:text-[12px] font-semibold text-slate-500 w-auto"
  ><div class="w-28 text-center mx-auto">${kelas}</div></td>
   <td
    class="py-4 border-b text-sm xl:text-[12px] font-semibold text-slate-500 text-center"
  ><div class="w-28 mx-auto text-center">${tapel}</div></td>  
  <td
    class="py-4 px-4 border-b text-sm xl:text-[12px] font-semibold text-slate-500 text-center"
    data-realnominal="${jumlahTagihan}"
  >${toRupiah(jumlahTagihan)}</td>
  <td
    class="py-4 px-4 border-b text-sm xl:text-[12px] font-semibold text-slate-500 text-center"
  >${typeofPayment}</td>
  <td
    class="py-4 px-4 border-b text-sm xl:text-[12px] font-semibold text-slate-500 text-center"
  ><div class="w-44 mx-auto text-center">${createdAt}</div>
  </td>
  `;

  return html;
}
