const moment = require("moment");
const BillStudent = require("../models/billStudent");
const Siswa = require("../models/siswa");
const formatDateINA = require("../logic/formatDateINA");

module.exports = async (req, res) => {
  const getDateTime = moment().format("LLLL");
  const {
    namaSiswa,
    kelasSiswa,
    catatanSiswa,
    deadline,
    jumlahTagihanSiswa,
    rekeningTujuan,
  } = req.body;

  const findStudent = await Siswa.findOne({ username: namaSiswa });

  const checkClassStudent = kelasSiswa === findStudent.kelas;

  if (!checkClassStudent) {
    return res.json({
      err: `${namaSiswa} Kelas ${findStudent.kelas} tidak sesuai dengan kelas siswa!`,
    });
  }

  const date = formatDateINA(getDateTime);

  const buatTagihanBaru = new BillStudent({
    namaSiswa,
    kelasSiswa,
    tapelSiswa: findStudent.tapel,
    catatanSiswa,
    deadline,
    jumlahTagihanSiswa,
    rekeningTujuan,
    createdAt: date,
  });

  const saveTagihan = await buatTagihanBaru.save();

  if (saveTagihan) {
    return res.json({ msg: "Penambahan tagihan telah berhasil!" });
  }
};
