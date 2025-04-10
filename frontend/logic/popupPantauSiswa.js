const buttonClosePopup = document.getElementById("close-popup");

buttonClosePopup.addEventListener("click", () => {
  alert("Tombol tutup popup ditekan");
  const popup = document.getElementById("popup-update-siswa");
  popup.classList.replace("flex", "hidden");
});

document.addEventListener("DOMContentLoaded", () => {
  const trElements = document.querySelector("tbody");
  console.log(trElements);
});
