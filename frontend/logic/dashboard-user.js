document.addEventListener("DOMContentLoaded", () => {
  const nameStudent = localStorage.getItem("username");

  const adminName = document.getElementById("admin-name");

  adminName.innerHTML = nameStudent;
});

const logoutSection = document.getElementById("logout-section");
const logoutButton = document.getElementById("logout");
const buttonAboutUser = document.getElementById("about-user");

logoutButton.addEventListener("click", () => {
  localStorage.clear();

  Swal.fire({
    title: "Yakin Meninggalkan Halaman?",
    text: "Tekan Keluar Untuk Meninggalkan Halaman",
    icon: "Warning",
    showCancelButton: true,
    confirmButtonColor: "#3085d6",
    cancelButtonColor: "#d33",
    confirmButtonText: "Keluar",
  }).then((result) => {
    if (result.isConfirmed) {
      window.location.href = "/frontend/pages/auth/login.html";
    }
  });
});

buttonAboutUser.addEventListener("click", () => {
  logoutSection.classList.toggle("-translate-y-56");
});
