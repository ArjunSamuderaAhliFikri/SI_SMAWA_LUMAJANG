// membuat schema tagihan
const mongoose = require("mongoose");

const BillStudentSchema = new mongoose.Schema({
  namaSiswa: String,
  kelasSiswa: String,
  tapelSiswa: String,
  catatanSiswa: String,
  jumlahTagihanSiswa: String,
  createdAt: String,
  isPaidOff: {
    type: Boolean,
    default: false,
  },
});

const BillStudent = mongoose.model(
  "riwayat_pembayaran_siswa",
  BillStudentSchema
);

module.exports = BillStudent;
