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
    console.log(nominal);

    // TODOOOOO
    async function sendDataBilling() {
      try {
        const response = await fetch(
          `http://localhost:3000/tagihan/${namaSiswa}/${infoBilling}`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ namaSiswa, infoBilling }),
          }
        );

        if (response.ok) {
          const data = await response.json();
          console.log(data);
        }
      } catch (error) {
        alert(`Error Message : ${error.message}`);
      }
    }

    // window.location.href = "/frontend/pages/user/konfirmasi_pembayaran.html";
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
            data.jumlahTagihanSiswa,
            "Belum Lunas"
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
  <td
                      class="flex items-center gap-4 py-4 px-4 border-b font-medium text-slate-500" id="${deskripsiPembayaran}"
                    >
                      <i
                        class="fa-solid fa-money-check-dollar text-slate-800 text-xl"
                      ></i>
                      <span> ${deskripsiPembayaran} </span>
                    </td>
                    <td
                      class="py-4 px-4 border-b text-sm font-semibold text-slate-500"
                    >
                      <i class="fa-solid fa-clock text-slate-800 text-xl"></i>
                      <span>${tanggalPembayaran}</span>
                    </td>
                    <td
                      class="py-4 px-4 border-b text-md font-semibold ${
                        statusPembayaran == "Lunas"
                          ? "text-emerald-500"
                          : "text-pink-600"
                      } text-center"
                    >
                      <i
                        class="fa-solid fa-circle-check text-2xl"
                      ></i>
                      <span>${statusPembayaran}</span>
                    </td>`;
}
