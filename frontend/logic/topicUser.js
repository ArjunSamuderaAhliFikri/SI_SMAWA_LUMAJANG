import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import port from "../secret/port.js";

const token = localStorage.getItem("token");

const params = new URLSearchParams(window.location.search);
const id = params.get("id");

const title = document.getElementById("title");
const description = document.getElementById("description");
const headerImage = document.getElementById("header-image");
const dateTime = document.getElementById("date-time");

document.addEventListener("DOMContentLoaded", () => {
  const retrieveDetailMedia = async () => {
    try {
      const response = await fetch(`${port}/media/${id}`, {
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
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveDetailMedia();
});
