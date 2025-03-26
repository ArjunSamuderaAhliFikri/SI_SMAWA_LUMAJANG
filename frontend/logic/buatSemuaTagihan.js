const form = document.querySelector("form");
const selectElementClass = document.getElementById("kelas");
const catatanTagihan = document.getElementById("catatan").value;
const jumlahTagihanSiswa = document.getElementById("jumlah-tagihan").value;
let kelasTagihan;

selectElementClass.addEventListener("change", (event) => {
  kelasTagihan = event.target.value;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleCreateAllBilling() {
    try {
      const response = await fetch("http://localhost:3000/buat-semua-tagihan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kelasTagihan,
          catatanTagihan,
          jumlahTagihanSiswa,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const { msg } = data;

        alert(msg);
      }
    } catch (error) {
      alert(`Error Message : ${error.message}`);
    }
  }

  handleCreateAllBilling();
});
