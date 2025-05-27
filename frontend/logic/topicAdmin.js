import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import port from "../secret/port.js";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const paramsTitle = params.get("title");

const title = document.getElementById("title");
const description = document.getElementById("description");
const headerImage = document.getElementById("header-image");
const editPost = document.getElementById("edit-post");
const dateTime = document.getElementById("date-time");

document.addEventListener("DOMContentLoaded", () => {
  const retrieveDetailMedia = async () => {
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

      title.innerHTML = data[0].title;
      description.innerHTML = data[0].description;
      dateTime.innerHTML = data[0].datePost;
      headerImage.setAttribute(
        "src",
        `http://localhost:3000/test/${data[0].image}`
      );

      editPost.setAttribute(
        "href",
        `/frontend/pages/create-information.html?edit=true&title=${paramsTitle}`
      );
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveDetailMedia();
});

const formDelete = document.getElementById("delete-media");

formDelete.addEventListener("submit", (event) => {
  event.preventDefault();

  const handleDeleteMedia = async () => {
    try {
      const response = await fetch(`${port}/media/${paramsTitle}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { msg, err, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) {
        return console.log(err);
      }
    } catch (error) {
      return console.error(error.message);
    }
  };

  Swal.fire({
    title: `Hapus Postingan ${paramsTitle}?`,
    text: "Setelah proses hapus selesai anda akan segera diarahkan ke halaman master data!",
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Yes, hapus!",
  }).then((result) => {
    if (result.isConfirmed) {
      handleDeleteMedia();

      Swal.fire({
        title: "Postingan berhasil dihapus!",
        icon: "success",
      }).then((result) => {
        if (result.isConfirmed) {
          window.location.href = "/frontend/pages/masterData.html";
        }
      });
    }
  });
});
