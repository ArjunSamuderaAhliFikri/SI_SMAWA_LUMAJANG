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
            data.jumlahTagihanSiswa,
            data.createdAt
          );

          bodyOfTable.appendChild(createTrElement);
        });
      }

      const tdElements = document.querySelectorAll("td");

      tdElements.forEach((td) => {
        td.addEventListener("click", () => {
          const popup = document.getElementById("popup-update-siswa");

          const getNameStudent =
            td.parentElement.querySelector("span").textContent;
          const getClassStudent =
            td.parentElement.querySelectorAll("td")[1].textContent;
          const getBillingStudent =
            td.parentElement.querySelectorAll("td")[2].textContent;

          hidden.value = getNameStudent;
          popupNama.value = getNameStudent;
          popupKelas.value = getClassStudent;
          popupJumlahTagihan.value = getBillingStudent;

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

  const currentUser = {
    namaSiswa: popupNama.value,
    kelasSiswa: popupKelas.value,
    jumlahTagihanSiswa: popupJumlahTagihan.value,
  };

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

  updateDataStudent();
});

const buttonClosePopup = document.getElementById("close-popup");

buttonClosePopup.addEventListener("click", () => {
  const popup = document.getElementById("popup-update-siswa");
  popup.classList.replace("flex", "hidden");
});

function generateTdElement(name, kelas, jumlahTagihan, createdAt) {
  return `<td class="flex items-center gap-4 py-4 px-4 border-b">
    <div class="size-8 rounded-full overflow-hidden">
      <img
        class="block size-full object-cover"
        src="/frontend/public/img/default-profile.jpeg"
        alt="user"
      />
    </div>
    <span class="text-[14px] font-semibold text-slate-600"
      >${name}</span
    >
  </td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center"
  >${kelas}</td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center"
  >${jumlahTagihan}</td>
  <td
    class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center"
  >${createdAt}</td>
  `;
}
