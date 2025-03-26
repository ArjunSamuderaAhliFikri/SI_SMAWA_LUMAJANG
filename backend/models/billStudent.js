// membuat schema tagihan
const mongoose = require("mongoose");

const BillStudentSchema = new mongoose.Schema({
  namaSiswa: String,
  kelasSiswa: String,
  catatanSiswa: String,
  jumlahTagihanSiswa: String,
});

const BillStudent = mongoose.model(
  "riwayat_pembayaran_siswa",
  BillStudentSchema
);

module.exports = BillStudent;
