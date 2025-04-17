const listOfClass = document.getElementById("list-kelas");
const listOfTapel = document.getElementById("list-tapel");

document.addEventListener("DOMContentLoaded", async () => {
  async function handleRetrieveClassNTapel() {
    try {
      const classResponse = await fetch("http://localhost:3000/kelas_siswa");
      const tapelResponse = await fetch("http://localhost:3000/tapel");

      if (!classResponse || !tapelResponse) {
        return console.log("Response not ok");
      }

      const dataKelas = await classResponse.json();

      const { tapel } = await tapelResponse.json();
      const { kelas } = await dataKelas.kelasSiswaData[0];

      return { kelas, tapel };
    } catch (error) {
      return console.error(error);
    }
  }

  const { kelas, tapel } = await handleRetrieveClassNTapel();

  kelas.forEach((item) => {
    const listItem = generateList(item, "kelas");

    listOfClass.appendChild(listItem);
  });

  tapel.forEach((item) => {
    const listItem = generateList(item, "tapel");

    listOfTapel.appendChild(listItem);
  });

  const btnEditClass = document.querySelectorAll(".btn-edit-kelas");
  const btnEditTapel = document.querySelectorAll(".btn-edit-tapel");

  // TODOOOO
  btnEditTapel.forEach((btn) => {
    btn.addEventListener("click", () => {
      const inputEdit =
        btn.parentElement.parentElement.querySelector("input[type=text]");
      const currentText = btn.parentElement.parentElement.querySelector("span");

      // return console.log(inputEdit, currentText);

      const disabledEditDeleteButton =
        btn.parentElement.querySelectorAll("button");

      disabledEditDeleteButton[0].classList.add("hidden");
      disabledEditDeleteButton[1].classList.add("hidden");
      disabledEditDeleteButton[2].classList.remove("hidden");

      inputEdit.classList.remove("hidden");
      currentText.classList.add("hidden");
    });
  });

  btnEditClass.forEach((btn) => {
    btn.addEventListener("click", () => {
      const inputEdit =
        btn.parentElement.parentElement.querySelector("input[type=text]");
      const currentText = btn.parentElement.parentElement.querySelector("span");

      const disabledEditDeleteButton =
        btn.parentElement.querySelectorAll("button");

      disabledEditDeleteButton.forEach((btn) => {
        if (btn.innerHTML != "Simpan") {
          console.log("ada");
          btn.classList.add("hidden");
        }
      });

      disabledEditDeleteButton[2].classList.remove("hidden");
      inputEdit.classList.remove("hidden");
      currentText.classList.add("hidden");
    });
  });

  const btnSaveClass = document.querySelectorAll(".btn-save-kelas");

  const btnSaveTapel = document.querySelectorAll(".btn-save-tapel");

  btnSaveTapel.forEach((btn) => {
    btn.addEventListener("click", async () => {
      let currentText =
        btn.parentElement.parentElement.querySelector("input[type=text]");
      currentText.value = currentText.value.split("/").join("-");
      // return console.log(currentText.value);
      let hiddenValue =
        btn.parentElement.parentElement.querySelector("input[type=hidden]");

      hiddenValue.value = hiddenValue.value.split("/").join("-");

      try {
        const response = await fetch(
          `http://localhost:3000/editTapel/${hiddenValue.value}/${currentText.value}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) return console.log("gagal simpan perubahan");

        const { msg, err } = await response.json();
        if (err) return alert(err);

        alert(msg);

        const currentInput =
          btn.parentElement.parentElement.querySelector("input[type=text]");
        currentInput.classList.add("hidden");

        const span = btn.parentElement.parentElement.querySelector("span");
        span.classList.remove("hidden");

        const enabledEditDeleteButton =
          btn.parentElement.querySelectorAll("button");
        enabledEditDeleteButton[0].classList.remove("hidden");
        enabledEditDeleteButton[1].classList.remove("hidden");
        enabledEditDeleteButton[2].classList.add("hidden");
      } catch (error) {
        return console.error(error);
      } finally {
        window.location.reload();
      }
    });
  });

  btnSaveClass.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const currentText =
        btn.parentElement.parentElement.querySelector("input[type=text]").value;
      const hiddenValue =
        btn.parentElement.parentElement.querySelector(
          "input[type=hidden]"
        ).value;
      try {
        const response = await fetch(
          `http://localhost:3000/editKelas/${hiddenValue}/${currentText}`,
          {
            method: "PUT",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) return console.log("gagal simpan perubahan");

        const { msg, err } = await response.json();
        if (err) return alert(err);

        alert(msg);

        const currentInput =
          btn.parentElement.parentElement.querySelector("input[type=text]");
        currentInput.classList.add("hidden");

        const span = btn.parentElement.parentElement.querySelector("span");
        span.classList.remove("hidden");

        const enabledEditDeleteButton =
          btn.parentElement.querySelectorAll("button");
        enabledEditDeleteButton[0].classList.remove("hidden");
        enabledEditDeleteButton[1].classList.remove("hidden");
        enabledEditDeleteButton[2].classList.add("hidden");
      } catch (error) {
        return console.error(error);
      } finally {
        window.location.reload();
      }
    });
  });

  const btnDeleteClass = document.querySelectorAll(".btn-delete-kelas");
  const btnDeleteTapel = document.querySelectorAll(".btn-delete-tapel");

  console.log(btnDeleteTapel);

  btnDeleteTapel.forEach((btn) => {
    btn.addEventListener("click", async () => {
      let currentText = btn.parentElement.parentElement.querySelector("span");
      currentText.textContent = currentText.textContent.split("/").join("-");
      // let newcurr = currentText.textContent.split("-").join("/");

      // return console.log(currentText.textContent);

      try {
        const response = await fetch(
          `http://localhost:3000/deleteTapel/${currentText.textContent}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) return console.log("delete failed!");

        const { msg, err } = await response.json();

        if (err) return alert(err);

        return alert(msg);
      } catch (error) {
        return console.error(error);
      } finally {
        window.location.reload();
      }
    });
  });

  btnDeleteClass.forEach((btn) => {
    btn.addEventListener("click", async () => {
      const currentText = btn.parentElement.parentElement.querySelector("span");

      try {
        const response = await fetch(
          `http://localhost:3000/deleteClass/${currentText.textContent}`,
          {
            method: "DELETE",
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) return console.log("delete failed!");

        const { msg, err } = await response.json();

        if (err) return alert(err);

        return alert(msg);
      } catch (error) {
        return console.error(error);
      } finally {
        window.location.reload();
      }
    });
  });
});

const tapelInput = document.getElementById("tapel-input");
const kelasInput = document.getElementById("kelas-input");

const formTapel = document.querySelector("form[id=form-tahun]");
const formKelas = document.querySelector("form[id=form-kelas]");

formKelas.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleAddNewItem() {
    try {
      const response = await fetch("http://localhost:3000/add-kelas", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kelas: kelasInput.value }),
      });

      if (!response.ok) return console.log("response not ok");

      const { msg, err } = await response.json();

      if (err) return alert(err);

      return alert(msg);
    } catch (error) {
      return console.error(error);
    } finally {
      window.location.reload();
    }
  }

  handleAddNewItem();
});

formTapel.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleAddNewItem() {
    try {
      const response = await fetch(`http://localhost:3000/add-tapel`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tapel: tapelInput.value }),
      });

      if (!response.ok) return console.log("Gagal untuk menambahkan");

      const { msg, err } = await response.json();

      if (err) return alert(err);

      return alert(msg);
    } catch (error) {
      return console.error(error);
    } finally {
      window.location.reload();
    }
  }

  handleAddNewItem();
});

function generateList(data, status) {
  const listItem = document.createElement("li");
  listItem.setAttribute(
    "class",
    "flex justify-between items-center bg-gray-50 p-3 rounded shadow-sm"
  );
  let html = `<input type="hidden" value="${data}" /> <input class="hidden bg-slate-200 px-2 py-2 rounded-md outline-slate-100" type="text" value="${data}" /> <span class="">${data}</span>
  <div class="flex gap-2">
  <button class="btn-edit-${status} bg-yellow-400 text-white px-3 py-1 rounded">Edit</button>
  <button class="btn-delete-${status} bg-red-500 text-white px-3 py-1 rounded">Hapus</button>
<button class="btn-save-${status} bg-green-600 text-white px-3 py-1 rounded hidden">Simpan</button>
</div>`;

  listItem.innerHTML = html;

  return listItem;
}
