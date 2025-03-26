// window.addEventListener("beforeunload", () => {
//   localStorage.removeItem("token");
//   localStorage.removeItem("status");
// });

document.addEventListener("DOMContentLoaded", () => {
  const status = localStorage.getItem("status");

  if (!status) {
    window.location.href = "/frontend/pages/auth/login.html";
  }
});
