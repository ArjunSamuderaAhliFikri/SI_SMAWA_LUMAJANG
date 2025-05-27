import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import port from "../secret/port.js";

const token = localStorage.getItem("token");

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
      const response = await fetch(`${port}/kelas`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        // const { kelas, warn } = await response.json();
        const { kelas, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        if (!kelas) {
          return Swal.fire("Tidak ada kelas yang tersedia!");
        }

        kelas.forEach((item) => {
          const { kelas } = item;
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
      const response = await fetch(`${port}/tapel`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const { tapel, warn } = await response.json();

        if (warn) {
          window.location.href = "/";
        }

        tapel.forEach((item) => {
          const { tapel } = item;
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

    const response = await fetch(`${port}/siswa`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
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
      const { err, msg, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      if (err) {
        return Swal.fire("Siswa sudah terdaftar!");
      }

      Swal.fire(msg);

      // fill name in card
      cardStudentName.textContent = username;
      cardStudentNISN.textContent = NISN;

      // cardStudentClass.textContent = kelasSiswa.value;
      // cardStudentTapel.textContent = tahunPelajaran.value;

      const generateQRCode = (filename) => {
        var qrcode = new QRCode("qrcode", {
          text: `https://smawalmj.com/pages/cek_tagihan.html?${username}`,
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

      generateQRCode(`https://smawalmj.com/pages/cek_tagihan.html?${username}`);
    } else {
      return Swal.fire("error!");
    }
  } catch (error) {
    return console.error(`Error Message : ${error.message}`);
  }
});
