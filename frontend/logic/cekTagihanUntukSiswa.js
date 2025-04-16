import convertRupiah from "../features/convertRupiah/convertRupiah.js";

const toRupiah = convertRupiah;
const tBody = document.querySelector("tbody");

tBody.addEventListener("click", (event) => {
  if (event.srcElement.localName == "td") {
    const parent = event.target.parentNode;

    // todo!

    const namaSiswa = localStorage.getItem("username");

    const infoBilling =
      parent.getElementsByTagName("td")[0].lastElementChild.innerHTML;
    const nominal =
      parent.getElementsByTagName("td")[1].lastElementChild.innerHTML;

    localStorage.setItem("deskripsi_pembayaran", infoBilling);
    localStorage.setItem("nominal", nominal);

    const informasiPembayaran = { namaSiswa, catatanSiswa: infoBilling };

    localStorage.setItem("informasi-pembayaran", informasiPembayaran);

    window.location.href = "/frontend/pages/user/konfirmasi_pembayaran.html";
  } else {
    window.location.href = "/frontend/pages/user/konfirmasi_pembayaran.html";
  }
});

document.addEventListener("DOMContentLoaded", () => {
  async function handleGetBilling() {
    const username = localStorage.getItem("username");

    try {
      const response = await fetch(`http://localhost:3000/tagihan/${username}`);

      if (response.ok) {
        const data = await response.json();
        const { msg, findBilling } = data;

        findBilling.forEach((data) => {
          const generateTrElement = document.createElement("tr");
          generateTrElement.setAttribute(
            "class",
            "cursor-pointer hover:bg-gray-100"
          );

          generateTrElement.innerHTML = generateTdElement(
            data.catatanSiswa,
            toRupiah(data.jumlahTagihanSiswa),
            data.isPaidOff
          );

          tBody.appendChild(generateTrElement);
        });
      }
    } catch (error) {
      alert(`Error Message : ${error.message}`);
    }
  }

  handleGetBilling();
});

function generateTdElement(
  deskripsiPembayaran,
  tanggalPembayaran,
  statusPembayaran
) {
  return `
  <td class="flex items-center gap-4 py-4 px-4 border-b font-medium text-slate-500" id="${deskripsiPembayaran}"><i class="fa-solid fa-money-check-dollar text-slate-800 text-xl"></i><span>${deskripsiPembayaran}</span></td>
<td class="px-4 border-b text-sm font-semibold text-slate-500 text-left"><div></div><span class="inline-block">${tanggalPembayaran}</span></td>
<td class="flex items-center gap-2 justify-center py-4 px-4 border-b text-md font-semibold ${
    statusPembayaran == "Tuntas"
      ? "text-emerald-500"
      : statusPembayaran == "Belum Tuntas"
      ? "text-red-500"
      : "text-yellow-500"
  } text-center">${
    statusPembayaran == "Tuntas"
      ? '<i class="fa-solid fa-circle-check text-xl"></i>'
      : statusPembayaran == "Belum Tuntas"
      ? '<i class="fa-solid fa-circle-xmark text-xl"></i>'
      : '<i class="fa-solid fa-hourglass-start text-xl"></i>'
  }<span>${statusPembayaran}</span></td>`;
}
