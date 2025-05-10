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
  backToMasterData.setAttribute(
    "href",
    "/frontend/pages/admin/masterData.html"
  );

  if (paramsTitle) {
    console.log(paramsTitle);
    hiddenTitle.value = paramsTitle;

    const retrieveDataQuery = async () => {
      try {
        const response = await fetch(
          `http://localhost:3000/media/${paramsTitle}`
        );

        if (!response.ok) {
          return console.log("Response not ok!");
        }

        const { data } = await response.json();

        titlePost.innerHTML = data.title;
        descriptionPost.innerHTML = data.description;

        img.classList.replace("hidden", "block");
        img.setAttribute("src", `/frontend/public/img/mediaPost/${data.image}`);
      } catch (error) {
        return console.error(error.message);
      }
    };

    retrieveDataQuery();
  }
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  console.log(hiddenTitle.value);

  const contents = {
    title: titlePost.value,
    description: descriptionPost.value,
  };

  const handlePostMedia = async () => {
    try {
      const media = document.getElementById("avatar");

      const formData = new FormData();
      formData.append("media-photo", media.files[0]);

      const response = await fetch(
        `http://localhost:3000/post-content/${titlePost.value}/${descriptionPost.value}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { msg, err } = await response.json();

      if (err) return alert(err);

      alert(msg);
    } catch (error) {
      return console.error(error);
    } finally {
      window.location.href = "/frontend/pages/admin/masterData.html";
    }
  };

  const handleEditMedia = async () => {
    try {
      const media = document.getElementById("avatar");

      const formData = new FormData();
      formData.append("media-photo", media.files[0]);

      const response = await fetch(
        `http://localhost:3000/edit-content/${hiddenTitle.value}/${titlePost.value}/${descriptionPost.value}`,
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) return console.log("not ok!");

      const { msg, err } = await response.json();

      if (err) return alert(err);

      alert(msg);
    } catch (error) {
      return console.error(error);
    } finally {
      window.location.href = "/frontend/pages/admin/masterData.html";
    }
  };

  if (isEdit) {
    handleEditMedia();
  } else {
    handlePostMedia();
  }
});
