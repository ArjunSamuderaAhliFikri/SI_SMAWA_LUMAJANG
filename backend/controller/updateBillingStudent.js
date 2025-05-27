const db = require("../config/mysql.js");

const updateBillingStudent = async (req, res) => {
  const { id } = req.params;
  const {
    namaSiswa,
    kelasSiswa,
    jumlahTagihanSiswa,
    catatanSiswa,
    statusPembayaran,
  } = req.body;

  try {
    const updateBilling = await db.execute(
      "UPDATE paymentstudents SET namaSiswa = ?, kelasSiswa = ?, jumlahTagihanSiswa = ?, catatanSiswa = ?, isPaidOff = ? WHERE id = ?",
      [
        namaSiswa,
        kelasSiswa,
        jumlahTagihanSiswa,
        catatanSiswa,
        statusPembayaran,
        id,
      ]
    );

    if (updateBilling) {
      return res.json({ msg: "Tagihan berhasil diupdate!" });
    }
  } catch (error) {
    return res.json({ err: error });
  }
};

module.exports = updateBillingStudent;
