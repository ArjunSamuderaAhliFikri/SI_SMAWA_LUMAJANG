import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

let inputAccountNumber = document.getElementById("input-nomor-rekening");
const inputOwnerAccountNumber = document.getElementById(
  "nama-pemilik-rekening"
);
const addAccountNumber = document.getElementById("add-nomor-rekening");
const inputAtasNama = document.getElementById("atas-nama");
let hidden = document.getElementById("account-number-popup-hidden");

const formUpdateAccountNumber = document.getElementById(
  "form-update-nomor-rekening"
);

// TODOOO
formUpdateAccountNumber.addEventListener("submit", (event) => {
  event.preventDefault();

  async function updateAccountNumber() {
    try {
      const response = await fetch(
        `http://localhost:3000/update-nomor-rekening/${hidden.value}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            newAccountNumber: inputAccountNumber.value,
            atasNama: inputOwnerAccountNumber.value,
          }),
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

  updateAccountNumber();
});

const formDeletedAccountNumber = document.getElementById(
  "form-deleted-nomor-rekening"
);

// TODOOO
formDeletedAccountNumber.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleDeleteAccountNumber() {
    const response = await fetch(
      `http://localhost:3000/delete-nomor-rekening/${hidden.value}`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (response.ok) {
      alert("Data berhasil dihapus!");
      window.location.reload();
    }
  }

  handleDeleteAccountNumber();
});

const bodyOfTable = document.querySelector("tbody");

document.addEventListener("DOMContentLoaded", () => {
  async function retrieveAccountNumber() {
    try {
      const response = await fetch("http://localhost:3000/nomor-rekening");

      if (response.ok) {
        const { accounts, err } = await response.json();

        if (err) {
          return alert(err);
        }

        accounts.forEach((data) => {
          const createTrElement = document.createElement("tr");
          createTrElement.setAttribute(
            "class",
            "cursor-pointer hover:bg-gray-100"
          );

          createTrElement.innerHTML = generateTdElement(
            data.atasNama,
            data.accountNumber,
            data.status
          );

          bodyOfTable.appendChild(createTrElement);
        });
      }

      const tdElements = document.querySelectorAll("td");
      tdElements.forEach((td) => {
        td.addEventListener("click", () => {
          const popup = document.getElementById("popup-update-nomor-rekening");

          const getNameAccountNumber = td.parentElement.firstChild.textContent;
          const getAccountNumber =
            td.parentElement.querySelectorAll("td")[1].textContent;
          console.log(getAccountNumber);

          hidden.value = getAccountNumber;
          inputOwnerAccountNumber.value = getNameAccountNumber;
          inputAccountNumber.value = getAccountNumber;

          popup.classList.replace("hidden", "flex");
        });
      });
    } catch (error) {
      alert(error);
    }
  }

  retrieveAccountNumber();
});

const buttonClosePopup = document.getElementById("close-popup");
buttonClosePopup.addEventListener("click", () => {
  const popup = document.getElementById("popup-update-nomor-rekening");
  popup.classList.replace("flex", "hidden");
});

const addAccountNumberForm = document.querySelector(
  "form[id=form-nomor-rekening]"
);

addAccountNumberForm.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleAddAccountNumber() {
    try {
      const response = await fetch(
        "http://localhost:3000/tambah-nomor-rekening",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nomorRekening: addAccountNumber.value,
            atasNama: inputAtasNama.value,
          }),
        }
      );

      if (response.ok) {
        const { message, err } = await response.json();

        if (err) {
          return alert(err);
        }

        alert(message);
        window.location.reload();
      }
    } catch (error) {
      return alert(`Gagal menambahkan nomor rekening!, ${error}`);
    }
  }

  handleAddAccountNumber();
});

function generateTdElement(atasNama, nomorRekening, status) {
  return `<td class="py-4 px-4 border-b xl:text-sm text-xs font-semibold text-slate-500 text-center">${atasNama}</td><td class="py-4 px-4 border-b xl:text-sm text-xs font-semibold text-slate-500 text-center">${nomorRekening}</td><td class="py-4 px-4 border-b xl:text-sm text-xs font-semibold ${
    status ? "text-emerald-600" : "text-red-600"
  }  text-center">${status ? "Aktif" : "Tidak Aktif"}</td>`;
}
