const selectElementName = document.getElementById("nama-siswa");
const selectElementClass = document.getElementById("kelas-siswa");
const form = document.getElementById("form-buat-tagihan");
let namaSiswa;
let kelasSiswa;

document.addEventListener("DOMContentLoaded", () => {
  async function handleGetStudents() {
    try {
      const response = await fetch("http://localhost:3000/siswa");

      if (response.ok) {
        const data = await response.json();
        const { getAllStudents } = data;

        getAllStudents.forEach((element) => {
          let optionElement = document.createElement("option");
          const nama = element.username;

          // Untuk memasukkan nama
          optionElement.innerHTML = nama;
          optionElement.setAttribute("value", nama);

          selectElementName.appendChild(optionElement);
        });
      }
    } catch (error) {
      console.error(`Error Message : ${error.message}`);
    }
  }

  handleGetStudents();
});

selectElementName.addEventListener("change", (event) => {
  namaSiswa = event.target.value;
});

selectElementClass.addEventListener("change", (event) => {
  kelasSiswa = event.target.value;
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const catatanSiswa = document.getElementById("catatan").value;
  const jumlahTagihanSiswa = document.getElementById(
    "jumlah-tagihan-siswa"
  ).value;

  async function handleMakeBill() {
    try {
      const response = await fetch("http://localhost:3000/tagihan-siswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          namaSiswa,
          kelasSiswa,
          catatanSiswa,
          jumlahTagihanSiswa,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { msg } = data;

        alert(msg);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  handleMakeBill();
});
