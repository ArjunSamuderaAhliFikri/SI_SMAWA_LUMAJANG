import verifyUser from "../secret/verifyUser.js";

verifyUser("/frontend/pages/auth/login.html");

import convertRupiah from "../features/convertRupiah/convertRupiah.js";

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
    name: nameStudent.value,
    kelas: selectClass.value,
    tapel: selectTapel.value,
    accountNumber: accountNumber.value,
    nominalPayment: nominalPayment.value,
    typeofPayment:
      typePayment.dataset.typeofpayment == "pendaftaran-kelas-10"
        ? "Pendaftaran Siswa Kelas X"
        : "Pendaftaran Ulang Siswa Kelas XI",
  };

  const handleRegisterStudent = async () => {
    try {
      const response = await fetch("http://localhost:3000/pendaftaran-siswa", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(profileStudent),
      });

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { msg, err } = await response.json();

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
      const response = await fetch("http://localhost:3000/tapel");

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { tapel } = await response.json();

      generateOption(tapel, selectTapel);
    } catch (error) {
      return console.error(error);
    }
  };

  const retrieveClass = async () => {
    try {
      const response = await fetch("http://localhost:3000/kelas_siswa");

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { kelasSiswaData } = await response.json();

      const { kelas } = kelasSiswaData[0];

      generateOption(kelas, selectClass);
    } catch (error) {
      return console.error(error);
    }
  };

  const retrieveAccountNumbers = async () => {
    try {
      const response = await fetch("http://localhost:3000/nomor-rekening");

      if (!response.ok) {
        return console.log("Response not ok!");
      }

      const { accounts } = await response.json();

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
    const option = document.createElement("option");

    option.setAttribute("value", item.accountNumber);
    option.innerHTML = item.accountNumber;

    selectElement.appendChild(option);
  });
}

function generateOption(data, selectElement) {
  data.forEach((item) => {
    const option = document.createElement("option");

    option.setAttribute("value", item);
    option.innerHTML = item;

    selectElement.appendChild(option);
  });
}
