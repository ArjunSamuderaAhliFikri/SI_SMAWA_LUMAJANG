const Siswa = require("../models/siswa");
const BillStudent = require("../models/billStudent");

module.exports = async (req, res) => {
  const { catatanSiswa, kelasTagihan, jumlahTagihanSiswa } = req.body;

  const getAllStudents = await Siswa.find({ infoKelas: kelasTagihan });

  getAllStudents.forEach(async (data) => {
    const buatTagihanBaru = new BillStudent({
      namaSiswa: data.username,
      kelasSiswa: data.infoKelas,
      jumlahTagihanSiswa,
      catatanSiswa,
    });

    await buatTagihanBaru.save();
  });

  return res.json({ msg: "Proses membuat tagihan ke semua siswa berhasil!" });
};
