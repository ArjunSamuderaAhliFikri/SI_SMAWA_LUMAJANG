const moment = require("moment");

const formatDateINA = require("../logic/formatDateINA");
const Siswa = require("../models/siswa");
const BillStudent = require("../models/billStudent");
const convertRupiah = require("../logic/convertRupiah");

module.exports = async (req, res) => {
  const {
    catatanTagihan,
    kelasTagihan,
    jumlahTagihanSiswa,
    deadline,
    rekeningTujuan,
  } = req.body;

  const getDateTime = moment().format("LLLL");
  const date = formatDateINA(getDateTime);

  const getAllStudents = await Siswa.find({ kelas: kelasTagihan });

  if (!getAllStudents.length) {
    return res.json({ err: "Tidak ada siswa pada kelas tersebut!" });
  }

  getAllStudents.forEach(async (data) => {
    const buatTagihanBaru = new BillStudent({
      namaSiswa: data.username,
      kelasSiswa: data.kelas,
      tapelSiswa: data.tapel,
      catatanSiswa: catatanTagihan,
      jumlahTagihanSiswa: jumlahTagihanSiswa,
      deadline,
      rekeningTujuan,
      createdAt: date,
      typeofPayment: "Pembayaran SPP",
    });

    await buatTagihanBaru.save();
  });

  return res.json({ msg: "Proses membuat tagihan ke semua siswa berhasil!" });
};
