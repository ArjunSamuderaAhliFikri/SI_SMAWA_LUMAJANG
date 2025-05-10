const params = new URLSearchParams(window.location.search);
const paramsTitle = params.get("title");

const title = document.getElementById("title");
const description = document.getElementById("description");
const headerImage = document.getElementById("header-image");
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
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveDetailMedia();
});
