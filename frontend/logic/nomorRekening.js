let inputAccountNumber = document.getElementById("input-nomor-rekening");
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

          const getAccountNumber = td.parentElement.firstChild.textContent;
          console.log(getAccountNumber);

          hidden.value = getAccountNumber;
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
  console.log(addAccountNumberForm);

  const inputAccountNumber = document.getElementById(
    "input-nomor-rekening"
  ).value;

  async function handleAddAccountNumber() {
    try {
      const response = await fetch(
        "http://localhost:3000/tambah-nomor-rekening",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ nomorRekening: inputAccountNumber }),
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

function generateTdElement(nomorRekening, status) {
  return `<td class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center">${nomorRekening}</td><td class="py-4 px-4 border-b text-sm font-semibold text-slate-500 text-center">${
    status ? "Aktif" : "Tidak Aktif"
  }</td>`;
}
