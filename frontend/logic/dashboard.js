// window.addEventListener("beforeunload", (event) => {
//   event.preventDefault();

//   event.returnValue = "";

//   alert("heheheheh");
//   localStorage.removeItem("status");
// });

document.addEventListener("DOMContentLoaded", async () => {
  // document.cookie = "token=arjun; expires=1s";

  // const getToken = document.cookie.split("=")[1];
  // console.log(getToken);

  const status = localStorage.getItem("status");

  if (!status) {
    window.location.href = "/frontend/pages/auth/login.html";
  }
});

// setTimeout(() => {
//   document.cookie = "token=; expires=0s";
// }, 3000);

// setTimeout(() => {
//   const getCookie = document.cookie.split("=")[1];
//   console.log(getCookie == "");
// }, 4000);
