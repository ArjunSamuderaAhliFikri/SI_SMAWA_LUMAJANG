import port from "../secret/port.js";
import convertRupiah from "../features/convertRupiah/convertRupiah.js";

const token = localStorage.getItem("token");

const notFinishedCount = document.getElementById("not-finished-count");
const isPendingCount = document.getElementById("pending-count");
const isCompleteCount = document.getElementById("complete-count");

const tbody = document.querySelector("tbody");
const tbodyHidden = document.getElementById("tbody-hidden");

const searchBilling = document.getElementById("search-billing");

const sortedByName = document.getElementById("sort-by-name");
const sortedByClass = document.getElementById("sort-by-class");
const sortedByTapel = document.getElementById("sort-by-tapel");
const tableToExcelButton = document.getElementById("download-to-excel");

let dataBilling;

searchBilling.addEventListener("keyup", (event) => {
  const { value } = event.target;

  if (dataBilling) {
    tbody.innerHTML = "";

    const filterData = dataBilling.filter((data) =>
      data.namaSiswa.toLowerCase().includes(value.toLowerCase())
    );

    showDataInTable(filterData, tbody);
  }
});

sortedByName.addEventListener("change", (event) => {
  const { value } = event.target;

  if (dataBilling && value == "A-Z") {
    tbody.innerHTML = "";

    const sortedBy = dataBilling.sort((a, b) =>
      a.namaSiswa.toLowerCase().localeCompare(b.namaSiswa.toLowerCase())
    );

    showDataInTable(sortedBy, tbody);
    return;
  } else if (dataBilling && value == "Z-A") {
    tbody.innerHTML = "";

    const sortedBy = dataBilling.sort((a, b) =>
      b.namaSiswa.toLowerCase().localeCompare(a.namaSiswa.toLowerCase())
    );

    showDataInTable(sortedBy, tbody);
  }
});

sortedByClass.addEventListener("change", (event) => {
  const { value } = event.target;

  if (dataBilling && value == "10-12") {
    tbody.innerHTML = "";

    const sortedBy = dataBilling.sort(
      (a, b) =>
        a.kelasSiswa.split("-")[0].length - b.kelasSiswa.split("-")[0].length
    );

    showDataInTable(sortedBy, tbody);
  } else if (dataBilling && value == "12-10") {
    tbody.innerHTML = "";

    const sortedBy = dataBilling.sort(
      (a, b) =>
        b.kelasSiswa.split("-")[0].length - a.kelasSiswa.split("-")[0].length
    );

    showDataInTable(sortedBy, tbody);
  }
});

sortedByTapel.addEventListener("change", (event) => {
  const { value } = event.target;

  if (dataBilling) {
    tbody.innerHTML = "";

    const filterBy = dataBilling.filter((data) => data.tapel == value);

    showDataInTable(filterBy, tbody);
  }
});

document.addEventListener("DOMContentLoaded", () => {
  fillTapelList(sortedByTapel);

  const retrieveBillingStudents = async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(`${port}/student-payments`, config);

      if (!response.ok) return console.log(`Response not ok!`);

      const { tagihan } = await response.json();

      dataBilling = tagihan;

      if (tagihan) {
        const isCompleteLength = tagihan.filter(
          (data) => data.isPaidOff == "Tuntas"
        );
        const isNotCompleteLength = tagihan.filter(
          (data) => data.isPaidOff == "Belum Tuntas"
        );
        const isPendingLength = tagihan.filter(
          (data) => data.isPaidOff == "Menunggu Konfirmasi"
        );

        isCompleteCount.innerHTML = `${isCompleteLength.length} Siswa`;
        notFinishedCount.innerHTML = `${isNotCompleteLength.length} Siswa`;
        isPendingCount.innerHTML = `${isPendingLength.length} Siswa`;

        showDataInTable(tagihan, tbody);
        generateTableHidden(tagihan, tbodyHidden, generateTdElementHidden);
      }
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveBillingStudents();
});

tableToExcelButton.addEventListener("click", () => {
  const table = document.getElementById("table-hidden");
  const table2Excel = new Table2Excel();
  table2Excel.export(table, "Rekapan Administrasi SMA Wahidiyah Kota Lumajang");
});

function fillTapelList(selectElement) {
  const retrieveTapel = async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(`${port}/tapel`, config);

      if (!response.ok) return console.log("Response not ok!");

      const { tapel } = await response.json();

      tapel.forEach((data) => {
        const { id, tapel } = data;

        const createOption = document.createElement("option");
        createOption.setAttribute("value", tapel);
        createOption.innerHTML = tapel;

        selectElement.appendChild(createOption);
      });
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveTapel();
}

function generateTableHidden(data, tbody, tableHiddenGenerator) {
  data.forEach((billing) => {
    const {
      id,
      namaSiswa,
      kelasSiswa,
      tapel,
      catatanSiswa,
      jumlahTagihanSiswa,
      typeofPayment,
      createdAt,
      isPaidOff,
      isPaidOn,
    } = billing;

    const createTableCell = document.createElement("tr");
    const generateTableRow = tableHiddenGenerator(
      namaSiswa,
      kelasSiswa,
      catatanSiswa,
      isPaidOn,
      tapel,
      convertRupiah(jumlahTagihanSiswa),
      typeofPayment,
      createdAt,
      isPaidOff
    );

    createTableCell.innerHTML = generateTableRow;

    tbody.appendChild(createTableCell);
  });
}

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

function showDataInTable(data, tbody) {
  data.forEach((billing) => {
    const {
      id,
      namaSiswa,
      kelasSiswa,
      tapel,
      jumlahTagihanSiswa,
      typeofPayment,
      createdAt,
      isPaidOff,
      isPaidOn,
    } = billing;

    const createTableCell = document.createElement("tr");
    createTableCell.setAttribute(
      "class",
      "lg:table-row grid grid-rows-[] w-full odd:bg-slate-50 even:bg-slate-200 even:text-slate-500 h-fit lg:h-16"
    );

    const tableRow = generateTableRow(
      id,
      namaSiswa,
      kelasSiswa,
      tapel,
      isPaidOff,
      isPaidOn,
      typeofPayment,
      jumlahTagihanSiswa,
      createdAt
    );

    createTableCell.innerHTML = tableRow;

    tbody.appendChild(createTableCell);
  });
}

function generateTableRow(
  id,
  username,
  classStudent,
  tapel,
  isConfirmed,
  isPaidOn,
  typeofPayment,
  nominalPayment,
  createdAt
) {
  const html = `<td
                    class="relative block lg:table-cell px-3 lg:py-0 py-0 lg:pt-0 pt-8 w-fit lg:pb-0 pb-4"
                  >

                  <a href="#" class="block absolute top-0 left-0 bg-transparent h-full w-[1550px] z-10"></a>

                    <div
                      class="flex items-center justify-center gap-x-6 pl-4 lg:justify-start size-full"
                    >
                      <div class="size-9 rounded-full overflow-hidden">
                        <img
                          class="block size-full object-cover"
                          src="/frontend/public/img/default-profile.jpeg"
                          alt="profile-student"
                        />
                      </div>

                      <div class="">
                        <h1
                          class="font-medium text-xs text-slate-700 capitalize">${username}</h1>
                        <div>
                          <span
                            class="text-[11px] ${
                              isConfirmed == "Belum Tuntas"
                                ? "text-red-500"
                                : isConfirmed == "Menunggu Konfirmasi" ||
                                  isConfirmed == "Pembayaran Via Admin"
                                ? "text-yellow-500"
                                : "text-emerald-500"
                            } font-medium capitalize">${isConfirmed}</span>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td
                    class="relative grid grid-cols-[125px_minmax(900px,_1fr)_100px] lg:table-cell px-3 py-4 text-left lg:text-center lg:font-medium font-normal text-xs lg:text-sm text-slate-600 capitalize"
                  >
                  <a href="#" class="block absolute top-0 left-0 bg-transparent h-full w-[1550px] z-10"></a>
                    <span
                      class="block lg:hidden font-semibold text-slate-600 text-md"
                      >Kelas :
                    </span>${classStudent}</td>
                  <td
                    class="relative grid grid-cols-[125px_minmax(900px,_1fr)_100px] lg:table-cell px-3 py-4 text-left lg:text-center lg:font-medium font-normal text-xs lg:text-sm text-slate-600 capitalize before:content-['Tahun Pelajaran:']"
                  >
                  <a href="#" class="block absolute top-0 left-0 bg-transparent h-full w-[1550px] z-10"></a>
                    <span
                      class="block lg:hidden font-semibold text-slate-600 text-md"
                      >Tahun Pelajaran :
                    </span>${tapel}</td>
                  <td
                    class="relative grid grid-cols-[125px_minmax(900px,_1fr)_100px] lg:table-cell px-3 py-4 text-left lg:text-center lg:font-medium font-normal text-xs lg:text-sm text-slate-600 capitalize before:content-['Nominal Pembayaran:']"
                  >
                  <a href="#" class="block absolute top-0 left-0 bg-transparent h-full w-[1550px] z-10"></a>
                    <span
                      class="block lg:hidden font-semibold text-slate-600 text-md"
                      >Nominal Pembayaran :
                    </span>${convertRupiah(nominalPayment)}</td>
                  <td
                    class="relative grid grid-cols-[125px_minmax(900px,_1fr)_100px] lg:table-cell px-3 py-4 text-left lg:text-center lg:font-medium font-normal text-xs lg:text-sm text-slate-600 capitalize before:content-['Jenis Pembayaran:']"
                  >
                  <a href="#" class="block absolute top-0 left-0 bg-transparent h-full w-[1550px] z-10"></a>
                    <span
                      class="block lg:hidden font-semibold text-slate-600 text-md"
                      >Jenis Pembayaran :
                    </span>${typeofPayment}</td>
                  <td
                    class="relative grid grid-cols-[125px_minmax(900px,_1fr)_100px] lg:table-cell px-3 py-0 text-left lg:text-center lg:font-medium font-normal text-xs lg:text-sm text-slate-600 capitalize lg:pb-0 pb-8 before:content-['Dibuat Pada:']"
                  >
                  <a href="#" class="block absolute top-0 left-0 bg-transparent h-full w-[1550px] z-10"></a>
                    <span
                      class="block lg:hidden font-semibold text-slate-600 text-md"
                      >Dibuat Pada :
                    </span>${createdAt}</td>`;

  return html;
}
