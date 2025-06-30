import port from "../secret/port.js";

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const token = localStorage.getItem("token");
const username = localStorage.getItem("siswa");
const statusAdmin = localStorage.getItem("admin");

const form = document.querySelector("form");

const mediaImage = document.getElementById("avatar");
const nameStudent = document.getElementById("name");
const classStudent = document.getElementById("class_student");
const imageMedia = document.getElementById("image-media");
const labelImage = form.querySelector("label");

const titleMedia = document.getElementById("title");
const descriptionMedia = document.getElementById("description");

document.addEventListener("DOMContentLoaded", () => {
  const retrieveDataStudent = async () => {
    const config = {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    try {
      const response = await fetch(
        `${port}/siswa/detailSiswa/${username}`,
        config
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { siswa, warn, err } = await response.json();

      if (warn) {
        window.location.href = "/frontend/pages";
      }

      if (err) {
        return Swal.fire(err);
      }

      // fill name student form automatic
      nameStudent.value = siswa[0].username;
      nameStudent.disabled = true;

      // fill class student form automatic
      classStudent.value = siswa[0].kelas;
      classStudent.disabled = true;
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveDataStudent();
});

mediaImage.addEventListener("change", (event) => {
  const toURL = URL.createObjectURL(mediaImage.files[0]);

  labelImage.classList.add("opacity-0");

  imageMedia.setAttribute("src", toURL);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const handlePostMedia = async () => {
    const formData = new FormData();
    formData.append("avatar", mediaImage.files[0]);

    const config = {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },

      body: formData,
    };

    try {
      const response = await fetch(
        `${port}/student-post/${id}/${titleMedia.value}/${descriptionMedia.value}`,
        config
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { msg, err, warn } = await response.json();

      if (warn) {
        // there are not token!
        window.location.href = "/frontend/pages";
      }

      //   error
      if (err) return Swal.fire(err);

      if (msg) {
        window.location.href = "/frontend/pages/postSuccess.html";
      }
    } catch (error) {
      return console.error(error.message);
    }
  };

  handlePostMedia();
});
