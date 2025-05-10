// membuat schema tagihan
const mongoose = require("mongoose");

const BillStudentSchema = new mongoose.Schema({
  namaSiswa: String,
  kelasSiswa: String,
  tapelSiswa: String,
  catatanSiswa: String,
  jumlahTagihanSiswa: String,
  deadline: String,
  isPaidOn: {
    type: String,
    default: "",
  },
  uniqAccessImage: String,
  verifiedBy: {
    type: String,
    default: "",
  },
  rekeningTujuan: String,
  createdAt: String,
  isPaidOff: {
    type: String,
    default: "Belum Tuntas",
  },
  typeofPayment: String,
  historyPayment: {
    type: Array,
    default: [],
  },
});

const BillStudent = mongoose.model(
  "riwayat_pembayaran_siswa",
  BillStudentSchema
);
module.exports = BillStudent;
