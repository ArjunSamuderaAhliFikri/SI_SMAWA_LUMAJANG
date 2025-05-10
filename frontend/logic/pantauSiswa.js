import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "../features/convertRupiah/convertRupiah.js";
const toRupiah = convertRupiah;

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

document.addEventListener("DOMContentLoaded", () => {
  async function handleRetrieveTapel() {
    try {
      const response = await fetch("http://localhost:3000/tapel");

      if (!response.ok) {
        return console.log("failed to retrieve tapel!");
      }

      const { tapel } = await response.json();

      tapel.forEach((data) => {
        const option = document.createElement("option");

        option.setAttribute("value", data);
        option.innerHTML = data;

        tapelFilter.appendChild(option);
      });
    } catch (error) {
      return console.error(error);
    }
  }

  handleRetrieveTapel();
});

document.addEventListener("DOMContentLoaded", () => {
  async function retrieveDataStudent() {
    try {
      const response = await fetch("http://localhost:3000/tagihan-siswa");

      if (response.ok) {
        const { tagihan } = await response.json();

        copyPayment = [...tagihan];

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
            data.tapelSiswa,
            toRupiah(data.jumlahTagihanSiswa),
            data.typeofPayment,
            data.createdAt,
            data.isPaidOff
          );

          trElementHidden.innerHTML = tdElementHidden;
          tableBodyHidden.appendChild(trElementHidden);
        });
      }

      const tdElements = document.querySelectorAll("td");

      tdElements.forEach((td) => {
        td.addEventListener("click", () => {
          paymentViaAdmin.setAttribute(
            "href",
            `/frontend/pages/admin/pembayaranViaAdmin.html?name=${
              td.parentElement.querySelector("span[id=nama-siswa]").textContent
            }&description=${
              td.parentElement.querySelector("#deskripsi-pembayaran")
                .textContent
            }`
          );

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
            td.parentElement.querySelectorAll("td")[3].dataset.realnominal;
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

            deleteNCancelPayment.innerHTML = "Hapus";
            saveNConfirmPayment.disabled = false;
          } else {
            popupNama.disabled = true;
            popupKelas.disabled = true;
            popupJumlahTagihan.disabled = true;

            saveNConfirmPayment.innerHTML = "Tuntas";
            saveNConfirmPayment.disabled = true;
          }

          hidden.value = getNameStudent;
          popupNama.value = getNameStudent;
          popupKelas.value = getClassStudent;
          popupJumlahTagihan.value = getBillingStudent;
          displayToRupiah.innerHTML = toRupiah(getBillingStudent);

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

                console.log(image);

                const wrapperImage = document.getElementById(
                  "wrapper-proof-of-payment"
                );

                // berarti jika tidak ada foto
                if (err || !image) {
                  wrapperImage.classList.add("hidden");
                  wrapperImage.innerHTML = "";
                }
                const generateBillingImage = `<div class="w-full h-full rounded-md overflow-hidden relative">
                <a href="/frontend/public/img/buktiPembayaran/${image.filename}" class="absolute bottom-2 right-2 text-slate-200 px-2 text-xs font-medium py-2 rounded-md bg-blue-700 hover:bg-blue-900" download="${image.filename}"><i class="fa-solid fa-download"></i> Unduh Gambar</a>
                  <img
                    src="/frontend/public/img/buktiPembayaran/${image.filename}"
                    id="popup-bukti-pembayaran"
                    class="block w-full h-full object-cover"
                  />
                </div>`;
                wrapperImage.innerHTML = generateBillingImage;
                wrapperImage.classList.remove("hidden");
              }
            } catch (error) {
              return console.error(error);
            }
          }

          retrieveImageByData();

          popup.classList.replace("hidden", "flex");
        });
      });
    } catch (error) {
      return console.error(error);
    }
  }

  retrieveDataStudent();
});

const tapelFilter = document.getElementById("tapel-sorting");
const sortingKelas = document.getElementById("tingkatan_kelas");
const sortingNama = document.getElementById("tingkatan_nama");
const resetDataButton = document.getElementById("reset-data");

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
      trElement.setAttribute("class", "cursor-pointer hover:bg-gray-100");

      const tdElement = generateTdElement(
        data.namaSiswa,
        data.kelasSiswa,
        data.tapelSiswa,
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
      trElement.setAttribute("class", "cursor-pointer hover:bg-gray-100");

      const tdElement = generateTdElement(
        data.namaSiswa,
        data.kelasSiswa,
        data.tapelSiswa,
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
        td.parentElement.querySelectorAll("td")[3].dataset.realnominal;
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

        deleteNCancelPayment.innerHTML = "Hapus";
        saveNConfirmPayment.disabled = false;
      } else {
        popupNama.disabled = true;
        popupKelas.disabled = true;
        popupJumlahTagihan.disabled = true;

        saveNConfirmPayment.innerHTML = "Tuntas";
        saveNConfirmPayment.disabled = true;
      }

      hidden.value = getNameStudent;
      popupNama.value = getNameStudent;
      popupKelas.value = getClassStudent;
      popupJumlahTagihan.value = getBillingStudent;
      displayToRupiah.innerHTML = toRupiah(getBillingStudent);

      async function retrieveImageByData() {
        try {
          const response = await fetch(
            `http://localhost:3000/bukti-pembayaran/${encodeURIComponent(
              getNameStudent
            )}/${encodeURIComponent(getBillingStudent)}/${encodeURIComponent(
              getInfoBillingStudent.textContent
            )}`
          );

          if (response.ok) {
            const { image, err } = await response.json();

            const wrapperImage = document.getElementById(
              "wrapper-proof-of-payment"
            );

            // berarti jika tidak ada foto
            if (err) {
              wrapperImage.classList.add("hidden");
            }
            const generateBillingImage = `<div class="w-full h-full rounded-md overflow-hidden relative">
                <a href="/frontend/public/img/buktiPembayaran/${image.filename}" class="absolute bottom-2 right-2 text-slate-200 px-2 text-xs font-medium py-2 rounded-md bg-blue-700 hover:bg-blue-900" download="${image.filename}"><i class="fa-solid fa-download"></i> Unduh Gambar</a>
                  <img
                    src="/frontend/public/img/buktiPembayaran/${image.filename}"
                    id="popup-bukti-pembayaran"
                    class="block w-full h-full object-cover"
                  />
                </div>`;
            wrapperImage.innerHTML = generateBillingImage;
            wrapperImage.classList.remove("hidden");
          }
        } catch (error) {
          return console.error(error);
        }
      }

      retrieveImageByData();

      popup.classList.replace("hidden", "flex");
    });
  });
});

sortingKelas.addEventListener("change", (event) => {
  const { value } = event.target;

  const dataPayment = [...copyPayment];
  if (value == "10-12") {
    bodyOfTable.innerHTML = "";

    const sortedClass = dataPayment.sort(
      (a, b) => a.kelasSiswa.length - b.kelasSiswa.length
    );

    sortedClass.forEach((data) => {
      const trElement = document.createElement("tr");
      trElement.setAttribute("class", "cursor-pointer hover:bg-gray-100");

      const tdElement = generateTdElement(
        data.namaSiswa,
        data.kelasSiswa,
        data.tapelSiswa,
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
      trElement.setAttribute("class", "cursor-pointer hover:bg-gray-100");

      const tdElement = generateTdElement(
        data.namaSiswa,
        data.kelasSiswa,
        data.tapelSiswa,
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
        td.parentElement.querySelectorAll("td")[3].dataset.realnominal;
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

        deleteNCancelPayment.innerHTML = "Hapus";
        saveNConfirmPayment.disabled = false;
      } else {
        popupNama.disabled = true;
        popupKelas.disabled = true;
        popupJumlahTagihan.disabled = true;

        saveNConfirmPayment.innerHTML = "Tuntas";
        saveNConfirmPayment.disabled = true;
      }

      hidden.value = getNameStudent;
      popupNama.value = getNameStudent;
      popupKelas.value = getClassStudent;
      popupJumlahTagihan.value = getBillingStudent;
      displayToRupiah.innerHTML = toRupiah(getBillingStudent);

      async function retrieveImageByData() {
        try {
          const response = await fetch(
            `http://localhost:3000/bukti-pembayaran/${encodeURIComponent(
              getNameStudent
            )}/${encodeURIComponent(getBillingStudent)}/${encodeURIComponent(
              getInfoBillingStudent.textContent
            )}`
          );

          if (response.ok) {
            const { image, err } = await response.json();

            const wrapperImage = document.getElementById(
              "wrapper-proof-of-payment"
            );

            // berarti jika tidak ada foto
            if (err) {
              wrapperImage.classList.add("hidden");
            }
            const generateBillingImage = `<div class="w-full h-full rounded-md overflow-hidden relative">
                <a href="/frontend/public/img/buktiPembayaran/${image.filename}" class="absolute bottom-2 right-2 text-slate-200 px-2 text-xs font-medium py-2 rounded-md bg-blue-700 hover:bg-blue-900" download="${image.filename}"><i class="fa-solid fa-download"></i> Unduh Gambar</a>
                  <img
                    src="/frontend/public/img/buktiPembayaran/${image.filename}"
                    id="popup-bukti-pembayaran"
                    class="block w-full h-full object-cover"
                  />
                </div>`;
            wrapperImage.innerHTML = generateBillingImage;
            wrapperImage.classList.remove("hidden");
          }
        } catch (error) {
          return console.error(error);
        }
      }

      retrieveImageByData();

      popup.classList.replace("hidden", "flex");
    });
  });
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
      trElement.setAttribute("class", "cursor-pointer hover:bg-gray-100");

      const tdElement = generateTdElement(
        data.namaSiswa,
        data.kelasSiswa,
        data.tapelSiswa,
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
      data.namaSiswa,
      data.kelasSiswa,
      data.tapelSiswa,
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
        td.parentElement.querySelectorAll("td")[3].dataset.realnominal;
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

        deleteNCancelPayment.innerHTML = "Hapus";
        saveNConfirmPayment.disabled = false;
      } else {
        popupNama.disabled = true;
        popupKelas.disabled = true;
        popupJumlahTagihan.disabled = true;

        saveNConfirmPayment.innerHTML = "Tuntas";
        saveNConfirmPayment.disabled = true;
      }

      hidden.value = getNameStudent;
      popupNama.value = getNameStudent;
      popupKelas.value = getClassStudent;
      popupJumlahTagihan.value = getBillingStudent;
      displayToRupiah.innerHTML = toRupiah(getBillingStudent);

      async function retrieveImageByData() {
        try {
          const response = await fetch(
            `http://localhost:3000/bukti-pembayaran/${encodeURIComponent(
              getNameStudent
            )}/${encodeURIComponent(getBillingStudent)}/${encodeURIComponent(
              getInfoBillingStudent.textContent
            )}`
          );

          if (response.ok) {
            const { image, err } = await response.json();

            const wrapperImage = document.getElementById(
              "wrapper-proof-of-payment"
            );

            // berarti jika tidak ada foto
            if (err) {
              wrapperImage.classList.add("hidden");
            }
            const generateBillingImage = `<div class="w-full h-full rounded-md overflow-hidden relative">
                <a href="/frontend/public/img/buktiPembayaran/${image.filename}" class="absolute bottom-2 right-2 text-slate-200 px-2 text-xs font-medium py-2 rounded-md bg-blue-700 hover:bg-blue-900" download="${image.filename}"><i class="fa-solid fa-download"></i> Unduh Gambar</a>
                  <img
                    src="/frontend/public/img/buktiPembayaran/${image.filename}"
                    id="popup-bukti-pembayaran"
                    class="block w-full h-full object-cover"
                  />
                </div>`;
            wrapperImage.innerHTML = generateBillingImage;
            wrapperImage.classList.remove("hidden");
          }
        } catch (error) {
          return console.error(error);
        }
      }

      retrieveImageByData();

      popup.classList.replace("hidden", "flex");
    });
  });
});

tapelFilter.addEventListener("change", (event) => {
  const sortedBy = event.target.value;
  const dataPayment = [...copyPayment];

  const filterDataByTapel = dataPayment.filter(
    (data) => data.tapelSiswa == sortedBy
  );

  if (filterDataByTapel) {
    bodyOfTable.innerHTML = "";

    filterDataByTapel.forEach((data) => {
      const trElement = document.createElement("tr");
      trElement.setAttribute("class", "cursor-pointer hover:bg-gray-100");

      const tdElement = generateTdElement(
        data.namaSiswa,
        data.kelasSiswa,
        data.tapelSiswa,
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
        td.parentElement.querySelectorAll("td")[3].dataset.realnominal;
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

        deleteNCancelPayment.innerHTML = "Hapus";
        saveNConfirmPayment.disabled = false;
      } else {
        popupNama.disabled = true;
        popupKelas.disabled = true;
        popupJumlahTagihan.disabled = true;

        saveNConfirmPayment.innerHTML = "Tuntas";
        saveNConfirmPayment.disabled = true;
      }

      hidden.value = getNameStudent;
      popupNama.value = getNameStudent;
      popupKelas.value = getClassStudent;
      popupJumlahTagihan.value = getBillingStudent;
      displayToRupiah.innerHTML = toRupiah(getBillingStudent);

      async function retrieveImageByData() {
        try {
          const response = await fetch(
            `http://localhost:3000/bukti-pembayaran/${encodeURIComponent(
              getNameStudent
            )}/${encodeURIComponent(getBillingStudent)}/${encodeURIComponent(
              getInfoBillingStudent.textContent
            )}`
          );

          if (response.ok) {
            const { image, err } = await response.json();

            const wrapperImage = document.getElementById(
              "wrapper-proof-of-payment"
            );

            // berarti jika tidak ada foto
            if (err) {
              wrapperImage.classList.add("hidden");
            }
            const generateBillingImage = `<div class="w-full h-full rounded-md overflow-hidden relative">
                <a href="/frontend/public/img/buktiPembayaran/${image.filename}" class="absolute bottom-2 right-2 text-slate-200 px-2 text-xs font-medium py-2 rounded-md bg-blue-700 hover:bg-blue-900" download="${image.filename}"><i class="fa-solid fa-download"></i> Unduh Gambar</a>
                  <img
                    src="/frontend/public/img/buktiPembayaran/${image.filename}"
                    id="popup-bukti-pembayaran"
                    class="block w-full h-full object-cover"
                  />
                </div>`;
            wrapperImage.innerHTML = generateBillingImage;
            wrapperImage.classList.remove("hidden");
          }
        } catch (error) {
          return console.error(error);
        }
      }

      retrieveImageByData();

      popup.classList.replace("hidden", "flex");
    });
  });
});

const formUpdateStudent = document.getElementById("form-update-siswa");
const formDeletedStudent = document.getElementById("form-deleted-siswa");

formDeletedStudent.addEventListener("submit", (event) => {
  event.preventDefault();

  const currentUser = {
    kelasSiswa: popupKelas.value,
    jumlahTagihanSiswa: popupJumlahTagihan.value,
  };

  async function deleteDataStudent() {
    try {
      const response = await fetch(
        `http://localhost:3000/delete-tagihan-siswa/${hidden.value}`,
        {
          method: "DELETE",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(currentUser),
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

      await Swal.fire(msg);
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
  <td>${dibayarPada}</td>
  <td>${deadline ? deadline : "-"}</td>
  <td>${tagihanDibuat}</td>`;
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
  isPaidOn,
  typeofPayment
) {
  return `<td class="py-4 px-4 border-b w-auto">
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
            statusPembayaran == "Via Admin - Cicilan"
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
      <p class="2xl:text-xs xl:text-[10px] text-[9px] font-medium"><span id="deskripsi-pembayaran">${deskripsiPembayaran}</span> <span id="status-pembayaran">${statusPembayaran}</span> || <span class="text-slate-600" id="waktu-pembayaran"><i class="fa-solid fa-clock"></i> Dibayar pada : ${isPaidOn}</span></p>
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
}
