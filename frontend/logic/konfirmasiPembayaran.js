const inputNama = document.querySelector('input[id="nama"]');
const inputKelas = document.querySelector('input[id="kelas"]');
const inputNominal = document.querySelector('input[id="nominal"]');
const form = document.querySelector("form");

document.addEventListener("DOMContentLoaded", () => {
  const namaSiswa = localStorage.getItem("username");
  const kelasSiswa = localStorage.getItem("kelas");

  inputNama.value = namaSiswa;
  inputNama.disabled = true;

  inputKelas.value = kelasSiswa;
  inputKelas.disabled = true;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  //   TODOOOO
  //   async function handleConfirmBilling() {
  //     try {
  //       const response = await fetch(
  //         `http://localhost:3000/tagihan/${namaSiswa}`,
  //         {
  //           method: "POST",
  //           headers: {
  //             "Content-Type": "application/json",
  //           },
  //           body: JSON.stringify({ namaSiswa }),
  //         }
  //       );

  //       if (response.ok) {
  //         const data = await response.json();
  //       }
  //     } catch (error) {}
  //   }
});
