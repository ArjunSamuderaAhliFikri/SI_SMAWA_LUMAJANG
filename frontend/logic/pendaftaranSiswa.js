import verifyUser from "../secret/verifyUser.js";

// verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "/features/convertRupiah/convertRupiah.js";

const token = localStorage.getItem("token");
const statusAdmin = localStorage.getItem("admin");

const form = document.querySelector("form");
const nameStudent = document.getElementById("name-student");
const selectClass = document.getElementById("class-student");
const selectTapel = document.getElementById("tapel-student");
const nominalPayment = document.getElementById("nominal-payment");
const accountNumber = document.getElementById("destination-account");
const monitoringPayment = document.getElementById("to-rupiah");

const typePayment = document.getElementById("typeof-payment");
console.log(typePayment.textContent);

nominalPayment.addEventListener("keyup", (event) => {
  const { value } = event.target;

  if (!value) {
    monitoringPayment.innerHTML = "Rp0";
  }

  monitoringPayment.innerHTML = convertRupiah(value);
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  const profileStudent = {
    namaSiswa: nameStudent.value,
    kelasSiswa: selectClass.value,
    tapelSiswa: selectTapel.value,
    rekeningTujuan: accountNumber.value,
    jumlahTagihanSiswa: nominalPayment.value,
    typeofPayment:
      typePayment.dataset.typeofpayment == "pendaftaran-kelas-10"
        ? "Pendaftaran Siswa Kelas X"
        : "Pendaftaran Ulang Siswa Kelas XI",
  };

  const handleRegisterStudent = async () => {
    try {
      const response = await fetch(
        "https://api2.smawalmj.com/student-payments",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },

          body: JSON.stringify(profileStudent),
        }
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { msg, err, warn } = await response.json();

      if (warn || statusAdmin !== "Super Admin") {
        window.location.href = "/";
      }

      if (err)
        return Swal.fire(err).then((result) => {
          if (result.isConfirmed) {
            window.location.reload();
          }
        });

      Swal.fire(msg).then((result) => {
        if (result.isConfirmed) {
          window.location.reload();
        }
      });
    } catch (error) {
      return console.error(error);
    }
  };

  handleRegisterStudent();
});

// TODOOOOOOOOOOOO
document.addEventListener("DOMContentLoaded", () => {
  const retrieveTapel = async () => {
    try {
      const response = await fetch("https://api2.smawalmj.com/tapel", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { tapel, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      generateOption(tapel, selectTapel);
    } catch (error) {
      return console.error(error);
    }
  };

  const retrieveClass = async () => {
    try {
      const response = await fetch("https://api2.smawalmj.com/kelas", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { kelas, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      generateOption(kelas, selectClass);
    } catch (error) {
      return console.error(error);
    }
  };

  const retrieveAccountNumbers = async () => {
    try {
      const response = await fetch(
        "https://api2.smawalmj.com/account-billing",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { accounts, warn } = await response.json();

      if (warn) {
        window.location.href = "/";
      }

      generateOptionAccountNumber(accounts, accountNumber);
    } catch (error) {
      return console.error(error);
    }
  };

  retrieveTapel();
  retrieveClass();
  retrieveAccountNumbers();
});

function generateOptionAccountNumber(data, selectElement) {
  data.forEach((item) => {
    const { id, atasNama, rekening } = item;
    const option = document.createElement("option");

    option.setAttribute("value", rekening);
    option.innerHTML = rekening;

    selectElement.appendChild(option);
  });
}

function generateOption(data, selectElement) {
  data.forEach((item) => {
    const { kelas, tapel } = item;
    if (kelas) {
      const option = document.createElement("option");

      option.setAttribute("value", kelas);
      option.innerHTML = kelas;

      selectElement.appendChild(option);
      return;
    }

    const option = document.createElement("option");

    option.setAttribute("value", tapel);
    option.innerHTML = tapel;

    selectElement.appendChild(option);
    return;
  });
}
