const moment = require("moment");

const formatDateINA = require("../logic/formatDateINA");
const Siswa = require("../models/siswa");
const BillStudent = require("../models/billStudent");
const convertRupiah = require("../logic/convertRupiah");

module.exports = async (req, res) => {
  //  kelasTagihan, catatanTagihan, jumlahTagihanSiswa,
  const { catatanSiswa, kelasTagihan, tapelTagihan, jumlahTagihanSiswa } =
    req.body;

  const getDateTime = moment().format("LLLL");
  const date = formatDateINA(getDateTime);

  const getAllStudents = await Siswa.find({ kelas: kelasTagihan });

  if (!getAllStudents.length) {
    return res.json({ err: "Tidak ada siswa pada kelas tersebut!" });
  }

  const toRupiah = convertRupiah(jumlahTagihanSiswa);

  getAllStudents.forEach(async (data) => {
    const buatTagihanBaru = new BillStudent({
      namaSiswa: data.username,
      kelasSiswa: data.kelas,
      tapelSiswa: data.tapel,
      catatanSiswa: catatanSiswa,
      jumlahTagihanSiswa: toRupiah,
      createdAt: date,
    });

    await buatTagihanBaru.save();
  });

  return res.json({ msg: "Proses membuat tagihan ke semua siswa berhasil!" });
};
