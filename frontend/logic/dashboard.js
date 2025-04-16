import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

// const token = localStorage.getItem("token");

// const deleteToken = setInterval(() => {
//   localStorage.removeItem("token");
// }, 2000);

// window.addEventListener("beforeunload", () => {
//   clearInterval(deleteToken);
// });

// document.addEventListener("DOMContentLoaded", async () => {
//   if (!token) {
//     return (window.location.href = "/frontend/pages/auth/login.html");
//   }

//   try {
//     const response = await fetch(`http://localhost:3000/get-verify/${token}`, {
//       method: "GET",
//       headers: {
//         "Content-Type": "application/json",
//         Authorization: "Bearer Token",
//       },
//     });
//     if (!response.ok) {
//       return alert("Gagal mendapatkan data verifikasi!");
//     }

//     const { role, status } = await response.json();

//     console.log({ role, status });
//   } catch (error) {
//     return (window.location.href = "/frontend/pages/auth/login.html");
//   }
// });

// document.addEventListener("DOMContentLoaded", async () => {
// document.cookie = "token=arjun; expires=1s";

// const getToken = document.cookie.split("=")[1];
// console.log(getToken);

// const status = localStorage.getItem("status");

// if (!status) {
// window.location.href = "/frontend/pages/auth/login.html";
// }
// });

// setTimeout(() => {
//   document.cookie = "token=; expires=0s";
// }, 3000);

// setTimeout(() => {
//   const getCookie = document.cookie.split("=")[1];
//   console.log(getCookie == "");
// }, 4000);
