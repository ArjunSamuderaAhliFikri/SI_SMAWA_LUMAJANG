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
      const response = await fetch(
        `http://localhost:3000/media/${paramsTitle}`
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { data } = await response.json();

      title.innerHTML = data.title;
      description.innerHTML = data.description;
      dateTime.innerHTML = data.datePost;
      headerImage.setAttribute(
        "src",
        `/frontend/public/img/mediaPost/${data.image}`
      );

      editPost.setAttribute(
        "href",
        `/frontend/pages/pusat_informasi/create-information.html?edit=true&title=${paramsTitle}`
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
      const response = await fetch(
        `http://localhost:3000/media/${paramsTitle}`,
        {
          method: "DELETE",
        }
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { msg, err } = await response.json();

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
          window.location.href = "/frontend/pages/admin/masterData.html";
        }
      });
    }
  });
});
