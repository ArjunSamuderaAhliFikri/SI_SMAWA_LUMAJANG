const inputNama = document.querySelector('input[id="nama"]');
const inputNominal = document.querySelector('input[id="nominal"]');
const form = document.querySelector("form");

document.addEventListener("DOMContentLoaded", () => {
  const namaSiswa = localStorage.getItem("username");
  const infoBilling = localStorage.getItem("deskripsi_pembayaran");

  async function handleDetailBilling() {
    try {
      const response = await fetch(
        `http://localhost:3000/detail-tagihan/${encodeURIComponent(
          namaSiswa
        )}/${encodeURIComponent(infoBilling)}`
      );

      if (response.ok) {
        const { billing } = await response.json();

        inputNama.value = billing.namaSiswa;
        inputNama.disabled = true;

        inputNominal.value = billing.jumlahTagihanSiswa;
        inputNominal.disabled = true;
      }
    } catch (error) {
      alert(error);
    }
  }

  handleDetailBilling();
});

form.addEventListener("submit", (event) => {
  event.preventDefault();

  async function handleCompleteBilling() {
    try {
      const response = await fetch(
        `http://localhost:3000/tuntaskan-tagihan/${inputNama.value}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            namaSiswa: inputNama.value,
            jumlahTagihanSiswa: inputNominal.value,
            catatanSiswa: localStorage.getItem("deskripsi_pembayaran"),
          }),
        }
      );

      if (response.ok) {
        const { msg, err } = await response.json();

        if (err) {
          return alert(err);
        }

        if (msg) {
          alert(msg);
          window.location.href = "/frontend/pages/user/cek_tagihan.html";
        }
      }
    } catch (error) {
      return alert(error);
    }
  }

  handleCompleteBilling();
});
