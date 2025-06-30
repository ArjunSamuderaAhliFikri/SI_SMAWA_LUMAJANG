import port from "../secret/port.js";
// Smooth scrolling untuk anchor links
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      target.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  });
});

// Navbar background change on scroll
window.addEventListener("scroll", function () {
  const nav = document.querySelector("nav");
  if (window.scrollY > 100) {
    nav.classList.add("bg-primary-600");
    nav.classList.remove("glass-effect");
  } else {
    nav.classList.remove("bg-primary-600");
    nav.classList.add("glass-effect");
  }
});

// Intersection Observer untuk animasi
const observerOptions = {
  threshold: 0.1,
  rootMargin: "0px 0px -50px 0px",
};

const observer = new IntersectionObserver(function (entries) {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";
    }
  });
}, observerOptions);

// Observe semua elemen yang ingin dianimasikan
document.querySelectorAll(".card-hover").forEach((card) => {
  card.style.opacity = "0";
  card.style.transform = "translateY(30px)";
  card.style.transition = "all 0.6s ease";
  observer.observe(card);
});

const token = localStorage.getItem("token");

const wrapperNews = document.getElementById("wrapper-news");

const hamburgerMenu = document.getElementById("hamburger-menu");
const listNavbar = document.getElementById("list-navbar");

hamburgerMenu.addEventListener("click", () => {
  if (listNavbar.classList.contains("translate-x-[150%]")) {
    hamburgerMenu.innerHTML = '<i class="fa-solid fa-xmark text-xl"></i>';
  } else {
    hamburgerMenu.innerHTML = '<i class="fa-solid fa-bars text-xl"></i>';
  }
  listNavbar.classList.toggle("translate-x-[150%]");
});

document.addEventListener("DOMContentLoaded", () => {
  const retrieveMediaNews = async () => {
    const config = {
      method: "GET",
    };

    try {
      const response = await fetch(`${port}/media`, config);

      if (!response.ok) return console.log("Response not ok!");

      const { data } = await response.json();

      if (data) {
        data.forEach((news) => {
          const { id, title, description, image, datePost } = news;

          const generateEvent = generateListEvent(
            id,
            title,
            description,
            image
          );

          wrapperNews.appendChild(generateEvent);
        });
      }
    } catch (error) {
      return console.error(error.message);
    }
  };

  retrieveMediaNews();
});

function generateListEvent(id, title, description, image) {
  const createListElement = document.createElement("li");
  createListElement.setAttribute(
    "class",
    "bg-slate-100 p-3 rounded-lg shadow-md transition-all duration-150 hover:bg-slate-300 hover:scale-[98%]"
  );
  createListElement.setAttribute("data-event-id", id);

  const html = `<a href="/frontend/pages/topic.html?id=${id}">
                <div class="max-h-60 w-full overflow-hidden rounded-lg">
                  <img
                    class="block size-full object-cover"
                    src="${port}/test/${image}"
                    alt="image-news"
                  />
                </div>

                <div class="text-slate-800 mt-4 px-2">
                  <h1 class="font-medium text-lg">${title}</h1>
                  <p class="text-slate-600 mt-1.5 text-xs">
                    ${description}
                  </p>
                </div>

                <div class="relative w-full h-14 mt-4">
                  <button
                    type="button"
                    class="absolute right-4 w-1/2 text-slate-200 capitalize font-medium text-sm bg-slate-800 px-2 py-2.5 rounded-lg shadow transition-all duration-150 hover:bg-slate-600"
                  >
                    baca sekarang
                  </button>
                </div>
              </a>`;
  createListElement.innerHTML = html;

  return createListElement;
}
