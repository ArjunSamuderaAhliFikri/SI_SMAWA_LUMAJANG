const form = document.querySelector("form");
const selectElementClass = document.getElementById("kelas");
const optionElements = selectElementClass.querySelectorAll("option");
const catatanTagihan = document.getElementById("catatan").value;

let kelasTagihan = selectElementClass.firstElementChild.value;
let tapelTagihan = selectElementClass.firstElementChild.dataset.tapel;

document.addEventListener("DOMContentLoaded", () => {
  async function testing() {
    try {
      const response = await fetch("http://localhost:3000/tapel");

      if (response.ok) {
        const { tapel } = await response.json();

        optionElements.forEach((item) => {
          item.setAttribute("data-tapel", tapel[item.value]);
        });
      }
    } catch (error) {
      return alert(`Error Message : ${error.message}`);
    }
  }
  testing();
});

selectElementClass.addEventListener("change", (event) => {
  kelasTagihan = event.target.value;
  tapelTagihan = event.target.options[event.target.selectedIndex].dataset.tapel;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const jumlahTagihanSiswa = document.querySelector(
    "input[id=jumlah-tagihan]"
  ).value;

  async function handleCreateAllBilling() {
    try {
      const response = await fetch("http://localhost:3000/buat-semua-tagihan", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          kelasTagihan,
          tapelTagihan,
          catatanTagihan,
          jumlahTagihanSiswa,
        }),
      });

      if (response.ok) {
        const data = await response.json();

        const { msg, err } = data;

        if (err) {
          return alert("gagal menambah tagihan ke semua siswa!");
        }

        alert(msg);
      }
    } catch (error) {
      alert(`Error Message : ${error.message}`);
    }
  }

  handleCreateAllBilling();
});
