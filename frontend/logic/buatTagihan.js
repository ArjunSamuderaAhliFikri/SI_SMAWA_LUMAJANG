const selectElementName = document.getElementById("nama-siswa");
const selectElementClass = document.getElementById("kelas-siswa");
const form = document.getElementById("form-buat-tagihan");
let namaSiswa;
let kelasSiswa = "XII-1"; // by default
let tapelSiswa = "2024/2025"; // by default

document.addEventListener("DOMContentLoaded", async () => {
  const response = await fetch("http://localhost:3000/kelasNTapel");
  try {
    if (response.ok) {
      const { kelas, tapel } = await response.json();
      const getTapel = tapel.tapel;

      kelas.forEach((item) => {
        const option = document.createElement("option");

        option.setAttribute("data-tapel", getTapel[item.split("-")[0]]);
        option.setAttribute("value", item);
        option.innerHTML = item;

        selectElementClass.appendChild(option);
      });
    }
  } catch (error) {
    alert(`Error Message : ${error.message}`);
  }
});

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
  tapelSiswa = event.target.options[event.target.selectedIndex].dataset.tapel;
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
          tapelSiswa,
          catatanSiswa,
          jumlahTagihanSiswa,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        const { msg, err } = data;

        if (err) {
          return alert(err);
        }

        alert(msg);
      }
    } catch (error) {
      alert(error.message);
    }
  }

  handleMakeBill();
});
