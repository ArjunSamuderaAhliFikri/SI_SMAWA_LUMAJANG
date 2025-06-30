import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import port from "../secret/port.js";

const token = localStorage.getItem("token");
const statusAdmin = localStorage.getItem("admin");

const listOfClass = document.getElementById("list-kelas");
const listOfTapel = document.getElementById("list-tapel");

document.addEventListener("DOMContentLoaded", async () => {
  async function handleRetrieveClassNTapel() {
    try {
      const classResponse = await fetch(`${port}/kelas`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const tapelResponse = await fetch(`${port}/tapel`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!classResponse || !tapelResponse) {
        return console.log("Response not ok");
      }

      const { kelas, warn } = await classResponse.json();
      const { tapel } = await tapelResponse.json();

      if (warn || statusAdmin !== "Super Admin") {
        window.location.href = "/";
      }

      return { kelas, tapel };
    } catch (error) {
      return console.error(error);
    }
  }

  const { kelas, tapel } = await handleRetrieveClassNTapel();

  kelas.forEach((item) => {
    const { kelas } = item;
    const listItem = generateList(kelas, "kelas");

    listOfClass.appendChild(listItem);
  });

  tapel.forEach((item) => {
    const { tapel } = item;
    const listItem = generateList(tapel, "tapel");

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
          `${port}/tapel/${hiddenValue.value}/${currentText.value}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) return console.log("gagal simpan perubahan");

        const { msg, err, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

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
          `${port}/kelas/${hiddenValue}/${currentText}`,
          {
            method: "PUT",
            headers: {
              Authorization: `Bearer ${token}`,
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
          `${port}/tapel/${currentText.textContent}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
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
          `${port}/kelas/${currentText.textContent}`,
          {
            method: "DELETE",
            headers: {
              Authorization: `Bearer ${token}`,
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

const wrapperListMedia = document.getElementById("wrapper-media");

document.addEventListener("DOMContentLoaded", () => {
  const retrieveDataMedia = async () => {
    try {
      const response = await fetch(`${port}/media`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { data, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      data.forEach((media) => {
        const listItem = generateListMedia(
          media.id,
          media.title,
          media.description,
          media.image,
          media.datePost
        );

        wrapperListMedia.appendChild(listItem);
      });
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveDataMedia();
});

const tapelInput = document.getElementById("tapel-input");
const kelasInput = document.getElementById("kelas-input");

const formTapel = document.querySelector("form[id=form-tahun]");
const formKelas = document.querySelector("form[id=form-kelas]");

formKelas.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleAddNewItem() {
    try {
      const response = await fetch(`${port}/kelas`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ kelas: kelasInput.value }),
      });

      if (!response.ok) return console.log("response not ok");

      const { msg, err, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) {
        Swal.fire(err).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }

      return Swal.fire(msg).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      return console.error(error);
    }
  }

  handleAddNewItem();
});

formTapel.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleAddNewItem() {
    try {
      const response = await fetch(`${port}/tapel`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ tapel: tapelInput.value }),
      });

      if (!response.ok) return console.log("Gagal untuk menambahkan");

      const { msg, err } = await response.json();

      if (err) {
        Swal.fire(err).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });
      }

      return Swal.fire(msg).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      return console.error(error);
    }
  }

  handleAddNewItem();
});

function generateListMedia(id, title, description, image, dateTime) {
  const hyperLink = document.createElement("a");
  hyperLink.setAttribute(
    "class",
    "group relative max-w-[320px] h-[225px] overflow-hidden rounded-lg transition-all duration-150 hover:scale-105 after:content-[''] after:block after:absolute after:top-0 after:left-0 after:size-full after:bg-gradient-to-t after:from-slate-800/75 after:to-transparent cursor-pointer after:transition-all after:duration-300 after:translate-y-full hover:after:translate-y-0"
  );

  hyperLink.setAttribute(
    "href",
    `/frontend/pages/topic-admin.html?title=${title}`
  );
  const html = `<li class="block size-full">
                  <img
                    class="block size-full object-cover"
                    src="http://localhost:3000/test/${image}"
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
