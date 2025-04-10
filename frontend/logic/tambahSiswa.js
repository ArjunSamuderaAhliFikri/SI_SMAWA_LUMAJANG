const form = document.querySelector("form");
const tahunPelajaran = document.querySelector('select[id="tahun-pelajaran"]');

document.addEventListener("DOMContentLoaded", () => {
  async function getTapel() {
    try {
      const response = await fetch("http://localhost:3000/tapel");

      if (response.ok) {
        const { tapel } = await response.json();

        for (const kelas in tapel) {
          const optionElement = document.createElement("option");
          optionElement.setAttribute("data-kelas", kelas);
          optionElement.innerHTML = tapel[kelas];

          tahunPelajaran.appendChild(optionElement);
        }
      }
    } catch (error) {
      alert(`Gagal untuk melakukan pengambilan data tapel, ${error.message}`);
    }
  }

  getTapel();
});

let setTapel = ["XII", "2024/2025"]; //by default

tahunPelajaran.addEventListener("change", (event) => {
  // setTapel = '[tahun pelajaran yang dipilih]-[kelas yang dipilih]
  setTapel = [
    event.target.options[event.target.selectedIndex].dataset.kelas,
    event.target.value,
  ];
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fileImage = document.querySelector('input[type="file"]');
  const username = document.querySelector('input[type="text"]').value;
  const password = document.querySelector('input[type="password"]').value;
  const nomorHP = document.querySelector('input[type="number"]').value;

  try {
    if (!username || !password || !nomorHP || setTapel == "") {
      return alert("harus di isi!");
    }

    const response = await fetch("http://localhost:3000/tambah_siswa", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        role: "siswa",
        username,
        password,
        nomorHP,
        kelas: setTapel[0],
        tapel: setTapel[1],
      }),
    });

    if (response.ok) {
      //   message

      const { err } = await response.json();

      console.log(setTapel);
      if (err) {
        return alert("Siswa sudah terdaftar!");
      }

      alert("berhasil didaftarkan!");
    } else {
      alert("error!");
    }
  } catch (error) {
    console.error(`Error Message : ${error.message}`);
  }
});
