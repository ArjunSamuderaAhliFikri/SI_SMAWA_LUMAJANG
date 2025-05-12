import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

const downloadCardButton = document.getElementById("download-card");
const cardStudent = document.getElementById("popup-card");

downloadCardButton.addEventListener("click", () => {
  setTimeout(() => {
    cardStudent.classList.replace("translate-y-[8%]", "-translate-y-[150%]");
  }, 2000);
});

const form = document.querySelector("form");
const tahunPelajaran = document.querySelector('select[id="tahun-pelajaran"]');
const kelasSiswa = document.querySelector('select[id="kelas-siswa"]');

document.addEventListener("DOMContentLoaded", () => {
  async function handleRetrieveClassStudent() {
    try {
      const response = await fetch("http://localhost:3000/kelas_siswa");

      if (response.ok) {
        const { kelasSiswaData, err } = await response.json();

        const { kelas } = kelasSiswaData[0];

        if (err) {
          return Swal.fire(err);
        }

        kelas.forEach((kelas) => {
          const optionElement = document.createElement("option");
          optionElement.setAttribute("value", kelas);
          optionElement.innerHTML = kelas;

          kelasSiswa.appendChild(optionElement);
        });
      }
    } catch (error) {
      return console.error(
        `Gagal untuk melakukan pengambilan data kelas, ${error.message}`
      );
    }
  }

  handleRetrieveClassStudent();
});

document.addEventListener("DOMContentLoaded", () => {
  async function getTapel() {
    try {
      const response = await fetch("http://localhost:3000/tapel");

      if (response.ok) {
        const { tapel } = await response.json();

        tapel.forEach((tapel) => {
          const optionElement = document.createElement("option");
          optionElement.setAttribute("value", tapel);
          optionElement.innerHTML = tapel;

          tahunPelajaran.appendChild(optionElement);
        });
      }
    } catch (error) {
      return console.error(
        `Gagal untuk melakukan pengambilan data tapel, ${error.message}`
      );
    }
  }

  getTapel();
});

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const fileImage = document.querySelector('input[type="file"]');
  const username = document.getElementById("username").value;
  const password = document.querySelector('input[type="password"]').value;
  const nomorHP = document.querySelector('input[type="number"]').value;
  const NISN = document.getElementById("nisn-input").value;

  const cardStudentName = document.getElementById("card-student-name");
  const cardStudentNISN = document.getElementById("nisn");
  const cardStudentClass = document.getElementById("card-student-class");
  const cardStudentTapel = document.getElementById("card-student-tapel");

  try {
    if (!username || !password || !nomorHP) {
      return Swal.fire("harus di isi!");
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
        kelas: kelasSiswa.value,
        tapel: tahunPelajaran.value,
        nisn: NISN,
      }),
    });

    if (response.ok) {
      //   message
      const { err } = await response.json();

      if (err) {
        return Swal.fire("Siswa sudah terdaftar!");
      }

      Swal.fire("berhasil didaftarkan!");

      // fill name in card
      cardStudentName.textContent = username;
      cardStudentNISN.textContent = NISN;

      // cardStudentClass.textContent = kelasSiswa.value;
      // cardStudentTapel.textContent = tahunPelajaran.value;

      const generateQRCode = (filename) => {
        var qrcode = new QRCode("qrcode", {
          text: `http://192.168.1.12:5500/frontend/pages/user/cek_tagihan.html?name=${username}`,
          width: 200,
          height: 200,
          colorDark: "#000",
          colorLight: "#FFF",
          correctLevel: QRCode.CorrectLevel.H,
        });

        qrcode.makeCode(filename);

        async function handleDownloadCard() {
          const card = await html2canvas(cardStudent, {
            scale: 3,
            useCORS: true,
          });

          const data = card.toDataURL("image/png");

          downloadCardButton.setAttribute("href", data);
          downloadCardButton.download = `KTS-${username}.jpg`;
        }

        setTimeout(() => {
          // let qelem = document.querySelector("#qrcode img");
          // let dlink = document.querySelector("#qrcode_download");
          // let qr = qelem.getAttribute("src");
          // dlink.setAttribute("href", qr);
          // dlink.setAttribute("download", "filename");
          // dlink.removeAttribute("hidden");

          handleDownloadCard();
        }, 500);

        // cardStudent.classList.remove("hidden");
        cardStudent.classList.replace(
          "-translate-y-[150%]",
          "translate-y-[8%]"
        );
      };

      generateQRCode(
        `http://192.168.1.12:5500/frontend/pages/user/cek_tagihan.html?name=${username}`
      );
    } else {
      return Swal.fire("error!");
    }
  } catch (error) {
    return console.error(`Error Message : ${error.message}`);
  } finally {
    window.location.href("/frontend/pages/admin/dashboard.html");
  }
});
