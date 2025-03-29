const BillStudent = require("../models/billStudent");

module.exports = async (req, res) => {
  const { namaSiswa, kelasSiswa, catatanSiswa, jumlahTagihanSiswa } = req.body;

  const buatTagihanBaru = new BillStudent({
    namaSiswa,
    kelasSiswa,
    catatanSiswa,
    jumlahTagihanSiswa,
  });

  const saveTagihan = await buatTagihanBaru.save();

  if (saveTagihan) {
    return res.json({ msg: "Penambahan tagihan telah berhasil!" });
  }
};
