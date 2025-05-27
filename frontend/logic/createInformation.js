import verifyUser from "../secret/verifyUser.js";
// verifyUser("/frontend/pages/auth/login.html");

import port from "../secret/port.js";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const paramsTitle = params.get("title");
const isEdit = params.get("edit");

const input = document.querySelector('input[type="file"]');
const img = document.getElementById("media-post");

const form = document.querySelector("form");
const titlePost = form.querySelector("textarea[id=title-post]");
const hiddenTitle = document.getElementById("hidden-title");
const descriptionPost = form.querySelector("textarea[id=description-post]");
const backToMasterData = document.getElementById("back-to-masterdata");

// change image features
input.addEventListener("change", () => {
  // ambil file gambar
  const file = input.files[0];
  console.log(file);

  // cek apakah file yang diupload adalah gambar
  if (file && file.type.startsWith("image/")) {
    // buat object URL untuk membaca file
    const reader = new FileReader();

    //   saat file selesai dibaca, tampilkan gambar
    reader.addEventListener("load", (event) => {
      img.src = event.target.result;
    });

    //   baca file gambar ke dalam bentuk URL
    reader.readAsDataURL(file);

    img.classList.replace("hidden", "block");
  } else {
    // jika bukan gambar, tampilkan pesan error
    throw new Error("File harus berupa gambar");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  backToMasterData.setAttribute("href", "/frontend/pages/masterData.html");

  if (paramsTitle) {
    hiddenTitle.value = paramsTitle;

    const retrieveDataQuery = async () => {
      try {
        const response = await fetch(`${port}/media/by-title/${paramsTitle}`, {
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

        titlePost.innerHTML = data[0].title;
        descriptionPost.innerHTML = data[0].description;

        img.classList.replace("hidden", "block");
        img.setAttribute("src", `http://localhost:3000/test/${data[0].image}`);
      } catch (error) {
        return console.error(error.message);
      }
    };

    retrieveDataQuery();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const handlePostMedia = async () => {
    try {
      const media = document.getElementById("avatar");

      const formData = new FormData();
      formData.append("media-photo", media.files[0]);

      const response = await fetch(
        `${port}/media/post-information/${titlePost.value}/${descriptionPost.value}`,
        {
          method: "POST",
          body: formData,
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (!response.ok) {
        console.log("Response not ok!");
      }

      const { msg, err, warn, image } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) {
        return Swal.fire(err).then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
              window.location.href = "/pages/masterData.html";
            }, 500);
          }
        });
      }

      if (msg) {
        Swal.fire(msg).then((result) => {
          if (result.isConfirmed) {
            setTimeout(() => {
              window.location.href = "/pages/masterData.html";
            }, 5000);
          }
        });
      }
    } catch (error) {
      return console.error(error);
    }
  };

  const handleEditMedia = async () => {
    try {
      const media = document.getElementById("avatar");

      const formData = new FormData();
      if (media.files[0]) {
        formData.append("media-photo", media.files[0]);
      }

      const response = await fetch(
        `${port}/media/${titlePost.value}/${hiddenTitle.value}/${descriptionPost.value}`,
        {
          method: "PUT",
          body: formData,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) return console.log("not ok!");

      const { msg, err, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) {
        Swal.fire(err).then((result) => {
          if (result.isConfirmed) {
            window.location.href = "/frontend/pages/masterData.html";
          }
        });
      }

      Swal.fire(msg).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/frontend/pages/masterData.html";
        }
      });
    } catch (error) {
      return console.error(error);
    }
  };

  if (isEdit) {
    handleEditMedia();
    return;
  } else {
    handlePostMedia();
  }
});
